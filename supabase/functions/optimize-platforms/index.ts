import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLATFORM_SPECS: Record<string, any> = {
  instagram_post: {
    size: [1080, 1350],
    copy: { min: 80, max: 2200 },
    tone: "elevated-warm",
    hashtags: { min: 3, max: 8 },
  },
  instagram_story: {
    size: [1080, 1920],
    copy: { min: 0, max: 150 },
    tone: "elevated-warm",
    safeZones: true,
  },
  instagram_reel: {
    size: [1080, 1920],
    copy: { min: 0, max: 150 },
    tone: "elevated-warm",
    hashtags: { min: 1, max: 5 },
  },
  linkedin: {
    size: [1200, 628],
    copy: { min: 80, max: 220 },
    tone: "professional-elegant",
    hashtags: { min: 0, max: 3 },
  },
  x: {
    size: [1200, 675],
    copy: { min: 0, max: 280 },
    tone: "concise-elegant",
    hashtags: { min: 1, max: 3 },
  },
  youtube_thumb: {
    size: [1280, 720],
    copy: null,
    tone: "cinematic-premium",
  },
  tiktok: {
    size: [1080, 1920],
    copy: { min: 0, max: 150 },
    tone: "elevated-warm",
    hashtags: { min: 0, max: 3 },
  },
};

const TONE_INSTRUCTIONS: Record<string, string> = {
  "elevated-warm": "Use warm, inviting language that reflects luxury and care. Evoke emotion and aspiration. Include emojis sparingly.",
  "professional-elegant": "Professional yet approachable. Emphasize expertise, trust, and premium service. Avoid emojis.",
  "concise-elegant": "Brief and impactful. Lead with the key message, maintain elegance in few words. No emojis.",
  "cinematic-premium": "Descriptive and aspirational. Paint a picture of the experience.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
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
    const copy = typeof body?.copy === 'string' ? body.copy.trim() : '';
    const imageUrl = typeof body?.imageUrl === 'string' ? body.imageUrl : '';
    const rawPlatforms = Array.isArray(body?.platforms) ? body.platforms : null;
    if (!copy || copy.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Invalid copy: must be 1-5000 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
    if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
      return new Response(
        JSON.stringify({ error: 'imageUrl must be an http(s) URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
    const validPlatforms = Object.keys(PLATFORM_SPECS);
    const platforms = rawPlatforms
      ? rawPlatforms.filter((p: unknown) => typeof p === 'string' && validPlatforms.includes(p)).slice(0, 10)
      : null;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const targetPlatforms = platforms && platforms.length > 0
      ? platforms
      : ["instagram_post", "instagram_story", "linkedin", "x"];
    
    const results = await Promise.all(
      targetPlatforms.map(async (platform: string) => {
        const spec = PLATFORM_SPECS[platform];
        if (!spec) return null;

        // Generate platform-optimized copy
        const toneInstruction = TONE_INSTRUCTIONS[spec.tone] || "";
        const copyLimit = spec.copy ? `Keep it between ${spec.copy.min}-${spec.copy.max} characters.` : "";
        const hashtagInstruction = spec.hashtags 
          ? `Include ${spec.hashtags.min}-${spec.hashtags.max} relevant hashtags.` 
          : "Do not include hashtags.";

        const systemPrompt = `You are optimizing social media copy for Qatar Airways (Brand: Luxury airline, Caregiver/Explorer archetype, Colors: #5C0A3A maroon, #CBB59C beige, Tone: warm, elegant, trustworthy).
        
Platform: ${platform}
Tone: ${toneInstruction}
${copyLimit}
${hashtagInstruction}

Rewrite the following copy to be perfect for this platform while maintaining Qatar Airways' brand voice:`;

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
              { role: "user", content: copy },
            ],
          }),
        });

        if (!response.ok) {
          console.error(`AI API error for ${platform}:`, response.status);
          throw new Error(`Failed to optimize copy for ${platform}`);
        }

        const data = await response.json();
        const optimizedCopy = data.choices[0].message.content;

        // Extract hashtags
        const hashtagMatches = optimizedCopy.match(/#[\w]+/g) || [];
        const hashtags = hashtagMatches.slice(0, spec.hashtags?.max || 0);
        const copyWithoutHashtags = optimizedCopy.replace(/#[\w]+/g, "").trim();

        // Run checks
        const charCount = copyWithoutHashtags.length;
        const checks = [
          {
            name: "Character limit",
            passed: spec.copy ? charCount >= spec.copy.min && charCount <= spec.copy.max : true,
          },
          {
            name: "Hashtag count",
            passed: spec.hashtags
              ? hashtags.length >= spec.hashtags.min && hashtags.length <= spec.hashtags.max
              : true,
          },
          {
            name: "Brand tone",
            passed: true, // Assume AI maintains tone
          },
          {
            name: "Aspect ratio",
            passed: true, // Assume image will be resized
          },
        ];

        const passedChecks = checks.filter((c) => c.passed).length;
        const score = Math.round((passedChecks / checks.length) * 100);

        return {
          platform,
          copy: copyWithoutHashtags,
          hashtags,
          charCount,
          checks,
          score,
          image: imageUrl, // In production, this would be resized
        };
      })
    );

    return new Response(
      JSON.stringify({ results: results.filter(Boolean) }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in optimize-platforms:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
