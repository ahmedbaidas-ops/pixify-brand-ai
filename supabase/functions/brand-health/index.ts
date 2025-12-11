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
    const brandId = url.searchParams.get("brandId");

    if (!brandId) {
      return new Response(
        JSON.stringify({ error: "brandId is required" }),
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

    // Verify brand belongs to user's org
    const { data: brand } = await supabaseClient
      .from("brands")
      .select("id, name, organization_id")
      .eq("id", brandId)
      .eq("organization_id", profile.organization_id)
      .single();

    if (!brand) {
      return new Response(
        JSON.stringify({ error: "Brand not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch brand metrics
    const { data: metrics } = await supabaseClient
      .from("brand_metrics")
      .select("*")
      .eq("brand_id", brandId)
      .single();

    // Calculate health metrics based on available data
    const { data: assets } = await supabaseClient
      .from("assets")
      .select("id, type, created_at")
      .eq("brand_id", brandId);

    const { data: guidelines } = await supabaseClient
      .from("guideline_sections")
      .select("id, type, content")
      .eq("brand_id", brandId);

    const { data: tokens } = await supabaseClient
      .from("design_tokens")
      .select("id, type")
      .eq("brand_id", brandId);

    // Calculate scores
    const assetCount = assets?.length || 0;
    const guidelineCount = guidelines?.length || 0;
    const tokenCount = tokens?.length || 0;

    // Visual consistency: based on defined tokens and guidelines
    const visualConsistency = Math.min(100, Math.round(
      (tokenCount * 10) + (guidelineCount * 15)
    ));

    // Asset library usage: based on asset count
    const assetLibraryUsage = Math.min(100, Math.round(assetCount * 5));

    // Guideline completeness
    const guidelineTypes = ["strategy", "logo", "color", "typography", "grid", "imagery", "motion"];
    const completedTypes = guidelines?.map(g => g.type) || [];
    const guidelineCompleteness = Math.round((completedTypes.length / guidelineTypes.length) * 100);

    // Overall health score
    const overallScore = Math.round(
      (visualConsistency * 0.3) +
      (assetLibraryUsage * 0.25) +
      (guidelineCompleteness * 0.25) +
      ((metrics?.team_activity || 50) * 0.2)
    );

    const healthData = {
      brandId,
      brandName: brand.name,
      overallScore,
      breakdown: {
        visualConsistency: metrics?.brand_consistency_score || visualConsistency,
        assetLibraryUsage: metrics?.asset_library_usage || assetLibraryUsage,
        guidelineCompleteness,
        teamActivity: metrics?.team_activity || 50,
        campaignPerformance: metrics?.campaign_performance || 0,
      },
      stats: {
        totalAssets: assetCount,
        guidelineSections: guidelineCount,
        designTokens: tokenCount,
      },
      tier: overallScore >= 90 ? "Excellent" :
            overallScore >= 75 ? "Strong" :
            overallScore >= 60 ? "Needs Attention" : "Critical",
      updatedAt: metrics?.updated_at || new Date().toISOString(),
    };

    return new Response(
      JSON.stringify(healthData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in brand-health:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
