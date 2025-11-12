import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { prompt, brandContext } = await req.json();
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured. Please add it in your Cloud secrets.');
    }

    // Brand context for Qatar Airways
    const brandGuideline = `
Brand: Qatar Airways
Visual Identity:
- Primary color: #5C0A3A (Qatar Maroon - deep, luxurious)
- Secondary color: #CBB59C (Desert Sand - warm, elegant)
- Accent color: #0F1020 (Night Sky - sophisticated)
Style: Cinematic, premium, warm lighting, sophisticated composition
Mood: Elegant, luxurious, welcoming, aspirational
DO NOT include logos or text overlays unless specifically requested.
Focus on premium airline travel, hospitality, comfort, and cultural connection.
`;

    const composedPrompt = `${brandGuideline}\n\nUser request: ${prompt}`;

    console.log('Generating image with prompt:', composedPrompt);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: composedPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'high',
        output_format: 'png',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`Image generation failed: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    console.log('Image generated successfully');

    // The response from gpt-image-1 contains base64 image data
    const imageData = data.data[0];
    
    return new Response(
      JSON.stringify({ 
        image: imageData.b64_json ? `data:image/png;base64,${imageData.b64_json}` : imageData.url,
        prompt: prompt 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-brand-image:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
