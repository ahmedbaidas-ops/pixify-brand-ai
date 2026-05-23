import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt || prompt.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Invalid prompt: must be 1-2000 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Brand-specific system prompt for Qatar Airways
    const systemPrompt = `You are the Qatar Airways Brand Copywriter AI assistant.

Brand Guidelines:
- Brand Archetype: Caregiver + Explorer
- Tone of Voice: Warm, Elegant, Trustworthy, Adventurous, Reassuring, Professional
- Core Values: Hospitality, Excellence, Trust, Cultural Pride, Innovation
- Mission: "To connect the world with warmth and excellence, making every journey memorable"

Writing Style:
- Use warm, inviting language that makes passengers feel cared for
- Balance elegance with approachability
- Emphasize comfort, safety, and premium experience
- Highlight cultural connection and global reach
- Keep it concise but impactful
- Use sensory language when describing experiences
- Always maintain a premium, sophisticated tone

Example phrases:
- "Where luxury meets discovery"
- "Experience comfort beyond compare"
- "Your journey, perfected"
- "Connecting cultures, creating memories"

Do NOT:
- Use overly casual language
- Make unrealistic promises
- Use clichés
- Be too sales-y or aggressive

Generate copy that aligns with these brand guidelines.`;

    console.log('Generating copy for prompt:', prompt);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', errorText);
      throw new Error(`Copy generation failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedCopy = data.choices[0].message.content;

    console.log('Copy generated successfully');

    return new Response(
      JSON.stringify({ 
        copy: generatedCopy,
        prompt: prompt 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-brand-copy:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
