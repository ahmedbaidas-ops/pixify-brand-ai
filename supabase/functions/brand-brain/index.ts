import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Qatar Airways brand context for AI understanding
const BRAND_CONTEXT = `
You are the Brand Brain AI for Qatar Airways, an expert in their complete brand identity.

BRAND IDENTITY:
- Mission: To connect the world with warmth and excellence, creating journeys that inspire
- Vision: To be the most trusted and admired airline worldwide
- Core Values: Hospitality, Excellence, Trust, Cultural Pride, Innovation
- Archetype: Caregiver + Explorer

VISUAL IDENTITY:
- Primary Color: Qatar Maroon #5C0A3A (use for headers, CTAs, emphasis)
- Secondary Color: Desert Sand #CBB59C (warmth, luxury accents)
- Neutral: Night Sky #0F1020 (backgrounds, text)
- Accent: Cloud Gray #A2A2A2 (subtle elements)

TYPOGRAPHY:
- Display Font: Cormorant Garamond (headlines, hero text)
- UI Font: Inter (body, interface elements)

TONE OF VOICE:
- Primary: Warm, Elegant, Trustworthy
- Secondary: Adventurous, Reassuring, Professional
- Headline example: "Where luxury meets discovery"
- Avoid: Cold, aggressive, casual slang

LOGO RULES:
- Oryx symbol must have clear space equal to height of letter 'Q'
- Never distort, recolor outside approved palette, or rotate
- Minimum size: 24px height for digital

CONTENT PILLARS:
1. World-class hospitality
2. Premium travel experience  
3. Cultural bridge between East and West
4. Innovation in comfort

When answering questions:
1. Always reference specific brand guidelines
2. Provide actionable recommendations
3. Cite specific colors, fonts, or rules when relevant
4. Maintain the warm, professional Qatar Airways tone
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    const { data: userData, error: userErr } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', ''),
    );
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const allowedActions = new Set(['explain', 'rewrite', 'check', 'suggest', 'analyze', 'convert']);
    const action = typeof body?.action === 'string' && allowedActions.has(body.action) ? body.action : '';
    const query = typeof body?.query === 'string' ? body.query.slice(0, 2000) : undefined;
    const content = typeof body?.content === 'string' ? body.content.slice(0, 5000) : undefined;
    const context = typeof body?.context === 'string' ? body.context.slice(0, 2000) : undefined;
    if (!query && !content) {
      return new Response(
        JSON.stringify({ error: 'Either query or content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = BRAND_CONTEXT;
    let userPrompt = query || content;

    // Handle different AI actions
    switch (action) {
      case "explain":
        systemPrompt += `\n\nUser is asking to explain a brand rule or guideline. Provide a clear, concise explanation with examples.`;
        break;
      
      case "rewrite":
        systemPrompt += `\n\nUser wants to rewrite content in the Qatar Airways brand voice. Transform their text to match our tone: warm, elegant, trustworthy. Provide the rewritten version and explain what changes you made.`;
        break;
      
      case "check":
        systemPrompt += `\n\nUser wants to check if something is brand-compliant. Analyze against our guidelines and provide:
1. Compliance score (0-100)
2. What's correct
3. What needs fixing
4. Specific recommendations`;
        break;
      
      case "suggest":
        systemPrompt += `\n\nUser needs creative suggestions aligned with our brand. Provide 3-5 options with explanations of why each fits our brand identity.`;
        break;
      
      case "analyze":
        systemPrompt += `\n\nAnalyze the provided content/asset against brand guidelines. Provide detailed feedback on:
1. Color usage
2. Typography
3. Tone of voice
4. Overall brand alignment`;
        break;

      case "convert":
        systemPrompt += `\n\nConvert the brand values/strategy into the requested format (messaging pillars, taglines, social copy, etc.). Ensure all output matches our tone and archetype.`;
        break;

      default:
        systemPrompt += `\n\nRespond helpfully to the user's brand-related question. Be specific, reference guidelines, and maintain our warm tone.`;
    }

    // Add additional context if provided
    if (context) {
      userPrompt = `Context: ${context}\n\nRequest: ${userPrompt}`;
    }

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
          { role: "user", content: userPrompt }
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI request failed");
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I couldn't generate a response.";

    return new Response(JSON.stringify({ 
      response: aiResponse,
      action,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Brand Brain error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
