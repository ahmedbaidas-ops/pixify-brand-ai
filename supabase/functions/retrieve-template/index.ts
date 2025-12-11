import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify user from JWT
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { templateName } = await req.json();

    if (templateName !== "Qatar Airways") {
      return new Response(
        JSON.stringify({ error: "Template not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    // Get the hidden Qatar Airways template
    const { data: template, error: templateError } = await supabaseClient
      .from("brand_templates")
      .select("*")
      .eq("name", "Qatar Airways")
      .single();

    if (templateError || !template) {
      return new Response(
        JSON.stringify({ error: "Template not found in database" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if brand already exists
    const { data: existingBrand } = await supabaseClient
      .from("brands")
      .select("id")
      .eq("organization_id", profile.organization_id)
      .eq("name", "Qatar Airways")
      .single();

    if (existingBrand) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Qatar Airways template already exists in your workspace",
          brandId: existingBrand.id 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the brand from template
    const defaultGuideline = template.default_guideline as Record<string, unknown>;
    const { data: brand, error: brandError } = await supabaseClient
      .from("brands")
      .insert({
        organization_id: profile.organization_id,
        name: "Qatar Airways",
        purpose: (defaultGuideline?.strategy as Record<string, unknown>)?.mission as string || "To connect the world with warmth and excellence",
        values: (defaultGuideline?.strategy as Record<string, unknown>)?.values as string[] || ["Hospitality", "Excellence", "Trust"],
        archetype: defaultGuideline?.archetype as string || "Caregiver + Explorer",
        tone: ((defaultGuideline?.tone as Record<string, unknown>)?.primary as string[])?.join(", ") || "Warm, Elegant, Trustworthy",
        audience: defaultGuideline?.audience as string || "Global travelers seeking premium comfort",
      })
      .select()
      .single();

    if (brandError) {
      return new Response(
        JSON.stringify({ error: brandError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create design tokens from template colors
    const defaultColors = template.default_colors as Record<string, string>;
    const colorTokens = Object.entries(defaultColors).map(([name, value]) => ({
      brand_id: brand.id,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      type: "color",
      value: { hex: value },
      description: `${name} brand color`,
    }));

    await supabaseClient.from("design_tokens").insert(colorTokens);

    // Create typography tokens
    const defaultTypography = template.default_typography as Record<string, unknown>;
    const typographyTokens = [
      {
        brand_id: brand.id,
        name: "Display Font",
        type: "typography",
        value: { family: defaultTypography?.display || "Cormorant Garamond" },
        description: "Primary display font",
      },
      {
        brand_id: brand.id,
        name: "Body Font",
        type: "typography",
        value: { family: defaultTypography?.body || "Inter" },
        description: "Body text font",
      },
    ];

    await supabaseClient.from("design_tokens").insert(typographyTokens);

    // Create guideline sections
    const guidelineSections = [
      { type: "strategy", title: "Brand Strategy", order_index: 0, content: defaultGuideline?.strategy || {} },
      { type: "logo", title: "Logo Usage", order_index: 1, content: {} },
      { type: "color", title: "Color Palette", order_index: 2, content: defaultColors },
      { type: "typography", title: "Typography", order_index: 3, content: defaultTypography },
    ];

    for (const section of guidelineSections) {
      await supabaseClient.from("guideline_sections").insert({
        brand_id: brand.id,
        type: section.type,
        title: section.title,
        order_index: section.order_index,
        content: section.content,
      });
    }

    // Create demo assets
    const demoAssets = template.demo_assets as Array<{ type: string; name: string; url: string }>;
    for (const asset of demoAssets || []) {
      await supabaseClient.from("assets").insert({
        brand_id: brand.id,
        name: asset.name,
        type: asset.type === "logo" ? "logo" : "image",
        file_key: asset.url,
        storage_url: asset.url,
        uploaded_by: user.id,
      });
    }

    // Create brand metrics
    await supabaseClient.from("brand_metrics").insert({
      brand_id: brand.id,
      brand_consistency_score: 92,
      asset_library_usage: 78,
      campaign_performance: 85,
      team_activity: 65,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Qatar Airways template has been activated!",
        brandId: brand.id 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});