export interface PlatformSpec {
  size: [number, number];
  copy: { min: number; max: number } | null;
  tone: string;
  hashtags?: { min: number; max: number };
  safeZones?: boolean;
}

export const PLATFORM_SPECS: Record<string, PlatformSpec> = {
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

export const TONE_INSTRUCTIONS: Record<string, string> = {
  "elevated-warm": "Use warm, inviting language that reflects luxury and care. Evoke emotion and aspiration.",
  "professional-elegant": "Professional yet approachable. Emphasize expertise, trust, and premium service.",
  "concise-elegant": "Brief and impactful. Lead with the key message, maintain elegance in few words.",
  "cinematic-premium": "Descriptive and aspirational. Paint a picture of the experience.",
};
