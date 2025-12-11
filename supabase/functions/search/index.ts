import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const query = url.searchParams.get("q") || "";
    const scope = url.searchParams.get("scope") || "all"; // assets, guidelines, all
    const brandId = url.searchParams.get("brandId");

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Search query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user's organization
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return new Response(
        JSON.stringify({ error: "User has no organization" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get brands for this org
    let brandIds: string[] = [];
    if (brandId) {
      brandIds = [brandId];
    } else {
      const { data: brands } = await supabaseClient
        .from("brands")
        .select("id")
        .eq("organization_id", profile.organization_id);
      brandIds = brands?.map(b => b.id) || [];
    }

    const results: any = {
      assets: [],
      guidelines: [],
      tokens: [],
    };

    const searchPattern = `%${query.toLowerCase()}%`;

    // Search assets
    if (scope === "all" || scope === "assets") {
      const { data: assets } = await supabaseClient
        .from("assets")
        .select("id, name, type, storage_url, mime_type, brand_id")
        .in("brand_id", brandIds)
        .ilike("name", searchPattern)
        .limit(20);

      results.assets = assets?.map(a => ({
        id: a.id,
        name: a.name,
        type: a.type,
        url: a.storage_url,
        mimeType: a.mime_type,
        brandId: a.brand_id,
        resultType: "asset",
      })) || [];
    }

    // Search guidelines
    if (scope === "all" || scope === "guidelines") {
      const { data: sections } = await supabaseClient
        .from("guideline_sections")
        .select("id, title, type, content, brand_id")
        .in("brand_id", brandIds)
        .or(`title.ilike.${searchPattern}`);

      results.guidelines = sections?.map(s => ({
        id: s.id,
        title: s.title,
        type: s.type,
        brandId: s.brand_id,
        resultType: "guideline",
      })) || [];
    }

    // Search design tokens
    if (scope === "all") {
      const { data: tokens } = await supabaseClient
        .from("design_tokens")
        .select("id, name, type, value, description, brand_id")
        .in("brand_id", brandIds)
        .or(`name.ilike.${searchPattern},description.ilike.${searchPattern}`);

      results.tokens = tokens?.map(t => ({
        id: t.id,
        name: t.name,
        type: t.type,
        value: t.value,
        description: t.description,
        brandId: t.brand_id,
        resultType: "token",
      })) || [];
    }

    const totalResults = results.assets.length + results.guidelines.length + results.tokens.length;

    return new Response(
      JSON.stringify({
        query,
        scope,
        totalResults,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in search:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
