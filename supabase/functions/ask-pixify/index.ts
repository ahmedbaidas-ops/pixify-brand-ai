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

  const startTime = Date.now();
  
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Get authorization
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

    const { question, brandId } = await req.json();

    if (!question) {
      return new Response(
        JSON.stringify({ error: "Question is required" }),
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

    // Fetch brand data
    let brandContext: Record<string, any> = {};
    let targetBrandId = brandId;

    if (brandId) {
      // Fetch specific brand
      const { data: brand } = await supabaseClient
        .from("brands")
        .select("*")
        .eq("id", brandId)
        .eq("organization_id", profile.organization_id)
        .single();

      if (brand) {
        brandContext = {
          name: brand.name,
          purpose: brand.purpose,
          values: brand.values,
          archetype: brand.archetype,
          tone: brand.tone,
          audience: brand.audience,
        };

        // Fetch design tokens
        const { data: tokens } = await supabaseClient
          .from("design_tokens")
          .select("name, type, value, description")
          .eq("brand_id", brandId);

        if (tokens) {
          brandContext = {
            ...brandContext,
            colors: tokens.filter(t => t.type === "color").map(t => ({
              name: t.name,
              value: t.value,
              description: t.description,
            })),
            typography: tokens.filter(t => t.type === "typography").map(t => ({
              name: t.name,
              value: t.value,
              description: t.description,
            })),
          };
        }

        // Fetch guideline sections
        const { data: sections } = await supabaseClient
          .from("guideline_sections")
          .select("type, title, content")
          .eq("brand_id", brandId)
          .order("order_index");

        if (sections) {
          brandContext = { ...brandContext, guidelines: sections };
        }
      }
    } else {
      // Get first brand in org
      const { data: brands } = await supabaseClient
        .from("brands")
        .select("id")
        .eq("organization_id", profile.organization_id)
        .limit(1);

      if (brands?.[0]) {
        targetBrandId = brands[0].id;
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build system prompt with brand context
    const brandName = brandContext.name || "Your Brand";
    const systemPrompt = `You are Pixify, an AI Brand Assistant helping users with their brand "${brandName}".

Brand Context:
${JSON.stringify(brandContext, null, 2)}

You help users with:
1. Finding and understanding brand assets (logos, images, templates)
2. Explaining brand colors, their hex codes, and usage contexts
3. Typography guidelines and font pairing recommendations
4. Brand strategy, values, mission, and messaging
5. Creating on-brand copy and content suggestions
6. Design system and component questions
7. Brand consistency and compliance guidance

Guidelines for responses:
- Be warm, professional, and helpful
- Keep responses concise but informative
- Use bullet points for lists
- When discussing colors, always mention hex codes
- Reference specific brand values when relevant
- Suggest actionable next steps when appropriate`;

    console.log("Processing Ask Pixify query:", question);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI request failed: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;
    const tokensUsed = data.usage?.total_tokens || null;
    const executionTime = Date.now() - startTime;

    // Log the AI interaction
    await supabaseClient.from("ai_logs").insert({
      organization_id: profile.organization_id,
      brand_id: targetBrandId || null,
      user_id: user.id,
      query: question,
      response_summary: answer.substring(0, 500),
      tokens_used: tokensUsed,
      execution_time_ms: executionTime,
    });

    console.log("Ask Pixify response generated successfully");

    return new Response(
      JSON.stringify({
        answer,
        query: question,
        brandId: targetBrandId,
        sources: brandContext.guidelines?.map((g: any) => g.title) || [],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in ask-pixify:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
