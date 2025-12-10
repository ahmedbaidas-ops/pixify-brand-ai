import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are the Pixify DAM Brand AI Assistant for Qatar Airways.

Brand Context:
- Brand Name: Qatar Airways
- Archetype: Caregiver + Explorer
- Tone: Warm, Elegant, Trustworthy, Adventurous, Reassuring, Professional
- Core Values: Hospitality, Excellence, Trust, Cultural Pride, Innovation
- Mission: "To connect the world with warmth and excellence, making every journey memorable"

Brand Colors:
- Qatar Maroon (#5C0A3A) - Primary brand color, represents heritage and luxury
- Desert Sand (#CBB59C) - Secondary warm accent
- Night Sky (#0F1020) - Deep neutral for contrast
- Cloud Gray (#A2A2A2) - Neutral supporting color

Typography:
- Display: Cormorant Garamond - Elegant serif for headlines
- UI/Body: Inter - Clean sans-serif for readability

You help users with:
1. Finding brand assets (logos, images, templates)
2. Explaining brand colors and their usage
3. Typography guidelines and font pairing
4. Brand strategy, values, and messaging
5. Creating on-brand copy and content suggestions
6. Design system and component questions

Respond in a warm, professional tone that reflects Qatar Airways' brand voice.
Keep responses concise but helpful. Use bullet points for lists.
When discussing colors, mention their hex codes and usage context.`;

    console.log('Processing AI query:', query);

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
          { role: 'user', content: `User query: ${query}\n\nAdditional context: ${JSON.stringify(context || {})}` }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add funds to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI request failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        query: query 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-assistant:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
