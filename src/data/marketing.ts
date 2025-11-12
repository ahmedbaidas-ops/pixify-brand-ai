export interface AudiencePersona {
  id: string;
  name: string;
  description: string;
  demographics: {
    age: string;
    region: string;
    profession: string;
    income: string;
  };
  psychographics: {
    values: string[];
    motivations: string[];
    behaviors: string[];
  };
  toneWords: string[];
  channels: string[];
  emotionalTriggers: string[];
  preferredCTA: string;
  avatar: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  budget: number;
  audienceId: string;
  pillar: string;
  copy: string;
  channels: string[];
  toneScore: number;
  visualScore: number;
  seoScore: number;
  totalScore: number;
  status: "Planned" | "Active" | "Completed";
  headlines: string[];
  creatives: string[];
  marketScore?: number;
  successRate?: number;
  closestCompetitor?: string;
  similarityReasons?: string[];
}

export interface ContentPillar {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  color: string;
  icon: string;
}

export const personas: AudiencePersona[] = [
  {
    id: "1",
    name: "Business Voyager",
    description: "High-income professionals who value efficiency, comfort, and premium service",
    demographics: {
      age: "35-55",
      region: "Global business hubs",
      profession: "C-suite, Senior Management",
      income: "$150K+"
    },
    psychographics: {
      values: ["Time efficiency", "Status", "Quality", "Reliability"],
      motivations: ["Career advancement", "Networking", "Comfort"],
      behaviors: ["Books last-minute", "Loyalty program member", "Prefers direct flights"]
    },
    toneWords: ["Premium", "Efficient", "Professional", "Exclusive"],
    channels: ["LinkedIn", "Business publications", "Airport lounges", "Email"],
    emotionalTriggers: ["Status recognition", "Time savings", "Productivity"],
    preferredCTA: "Upgrade your journey",
    avatar: "💼"
  },
  {
    id: "2",
    name: "Cultural Explorer",
    description: "Adventurous travelers who seek authentic experiences and cultural immersion",
    demographics: {
      age: "28-40",
      region: "Urban centers, Coastal cities",
      profession: "Creative professionals, Entrepreneurs",
      income: "$80K-$120K"
    },
    psychographics: {
      values: ["Authenticity", "Discovery", "Connection", "Stories"],
      motivations: ["Cultural enrichment", "Photography", "Unique experiences"],
      behaviors: ["Plans ahead", "Researches destinations", "Shares on social"]
    },
    toneWords: ["Curious", "Warm", "Inspiring", "Adventurous"],
    channels: ["Instagram", "Travel blogs", "YouTube", "TikTok"],
    emotionalTriggers: ["Wonder", "Discovery", "Cultural connection"],
    preferredCTA: "Discover your next story",
    avatar: "🌍"
  },
  {
    id: "3",
    name: "Family Comfort Seeker",
    description: "Parents prioritizing safety, convenience, and family-friendly services",
    demographics: {
      age: "30-45",
      region: "Family-oriented suburbs",
      profession: "Various, family-focused",
      income: "$90K-$140K"
    },
    psychographics: {
      values: ["Safety", "Care", "Convenience", "Peace of mind"],
      motivations: ["Family bonding", "Child comfort", "Stress-free travel"],
      behaviors: ["Books well in advance", "Seeks family amenities", "Reads reviews"]
    },
    toneWords: ["Reassuring", "Caring", "Supportive", "Welcoming"],
    channels: ["Facebook", "Parenting forums", "Family blogs", "Email"],
    emotionalTriggers: ["Child safety", "Comfort", "Family memories"],
    preferredCTA: "Care for what matters most",
    avatar: "👨‍👩‍👧‍👦"
  }
];

export const campaigns: MarketingCampaign[] = [
  {
    id: "1",
    name: "Sustainability Flight Week",
    goal: "Position Qatar Airways as leader in sustainable aviation",
    startDate: "2025-04-15",
    endDate: "2025-04-22",
    budget: 250000,
    audienceId: "2",
    pillar: "Innovation & Future",
    copy: "The future of flight is green. Experience our commitment to sustainable aviation with reduced emissions, eco-friendly materials, and carbon offset programs. Together, we're making tomorrow's skies cleaner.",
    channels: ["LinkedIn", "Instagram", "YouTube", "Website"],
    toneScore: 88,
    visualScore: 92,
    seoScore: 85,
    totalScore: 88,
    status: "Planned",
    headlines: [
      "Future Flies Green",
      "Cleaner Skies, Better Tomorrow",
      "Sustainable Journeys Start Here"
    ],
    creatives: ["sustainability-hero.jpg", "green-aircraft.jpg", "eco-cabin.jpg"],
    marketScore: 84,
    successRate: 87,
    closestCompetitor: "Emirates",
    similarityReasons: [
      "Tone similarity 85%",
      "Sustainability pillar overlap",
      "Premium digital channel mix"
    ]
  },
  {
    id: "2",
    name: "Ramadan Journeys",
    goal: "Connect with Middle Eastern diaspora during Ramadan season",
    startDate: "2025-03-01",
    endDate: "2025-04-01",
    budget: 180000,
    audienceId: "2",
    pillar: "Culture & Connection",
    copy: "This Ramadan, bring your family together. Special fares, halal meals prepared with care, and prayer facilities at every destination. Because home is where the heart is.",
    channels: ["Facebook", "Instagram", "Email", "Arabic media"],
    toneScore: 94,
    visualScore: 89,
    seoScore: 82,
    totalScore: 88,
    status: "Active",
    headlines: [
      "Home for Ramadan",
      "Reunite with Loved Ones",
      "Journey Home This Holy Month"
    ],
    creatives: ["ramadan-family.jpg", "iftar-service.jpg", "arabic-pattern.jpg"],
    marketScore: 86,
    successRate: 89,
    closestCompetitor: "Turkish Airlines",
    similarityReasons: [
      "Cultural connection focus 92%",
      "Similar regional targeting",
      "Family-oriented messaging"
    ]
  },
  {
    id: "3",
    name: "Beyond First Class",
    goal: "Showcase Qsuite and premium cabin experience to affluent travelers",
    startDate: "2025-05-10",
    endDate: "2025-06-30",
    budget: 420000,
    audienceId: "1",
    pillar: "Premium Experience",
    copy: "Your office in the sky. Experience Qsuite - the world's first double bed in business class. Privacy doors, ambient lighting, and Michelin-starred dining at 40,000 feet. This isn't business class. It's beyond.",
    channels: ["LinkedIn", "Business magazines", "Airport media", "Email"],
    toneScore: 91,
    visualScore: 95,
    seoScore: 90,
    totalScore: 92,
    status: "Planned",
    headlines: [
      "Beyond First Class",
      "Your Sky Suite Awaits",
      "Redefining Business Travel"
    ],
    creatives: ["qsuite-interior.jpg", "dining-service.jpg", "privacy-door.jpg"],
    marketScore: 91,
    successRate: 93,
    closestCompetitor: "Singapore Airlines",
    similarityReasons: [
      "Premium cabin focus 88%",
      "Luxury messaging alignment",
      "Business traveler targeting"
    ]
  },
  {
    id: "4",
    name: "Privilege Club Push",
    goal: "Drive loyalty program sign-ups and engagement",
    startDate: "2025-03-15",
    endDate: "2025-05-15",
    budget: 150000,
    audienceId: "1",
    pillar: "Care & Hospitality",
    copy: "Your loyalty deserves recognition. Join Privilege Club and unlock exclusive benefits - priority boarding, lounge access, bonus Avios, and upgrades. Because every journey with us should feel extraordinary.",
    channels: ["Email", "Mobile app", "Website", "Social media"],
    toneScore: 86,
    visualScore: 88,
    seoScore: 87,
    totalScore: 87,
    status: "Active",
    headlines: [
      "Privilege Awaits",
      "Elevate Every Journey",
      "Your Loyalty, Our Privilege"
    ],
    creatives: ["privilege-card.jpg", "lounge-access.jpg", "exclusive-perks.jpg"],
    marketScore: 82,
    successRate: 85,
    closestCompetitor: "British Airways",
    similarityReasons: [
      "Loyalty program focus 90%",
      "Similar benefit messaging",
      "Digital channel strategy"
    ]
  }
];

export const contentPillars: ContentPillar[] = [
  {
    id: "1",
    name: "Premium Experience",
    description: "Showcase luxury, comfort, design, and exceptional service quality",
    keywords: [
      "qatar airways business class",
      "qsuite",
      "luxury air travel",
      "premium cabin",
      "first class",
      "5-star airline"
    ],
    color: "#5C0A3A",
    icon: "✨"
  },
  {
    id: "2",
    name: "Culture & Connection",
    description: "Highlight global routes, diversity, cultural stories, and human connections",
    keywords: [
      "destinations",
      "global network",
      "cultural experiences",
      "travel stories",
      "connecting people"
    ],
    color: "#CBB59C",
    icon: "🌍"
  },
  {
    id: "3",
    name: "Innovation & Future",
    description: "Feature fleet technology, sustainability initiatives, and forward-thinking solutions",
    keywords: [
      "sustainable aviation",
      "green flights",
      "modern fleet",
      "aviation technology",
      "carbon offset"
    ],
    color: "#0F1020",
    icon: "🚀"
  },
  {
    id: "4",
    name: "Care & Hospitality",
    description: "Emphasize people-first service, safety, comfort, and passenger wellbeing",
    keywords: [
      "customer service",
      "passenger care",
      "safety first",
      "family friendly",
      "qatar airways service"
    ],
    color: "#A2A2A2",
    icon: "❤️"
  }
];

export const seoKeywords = [
  { keyword: "qatar airways business class", volume: 18100, difficulty: 62, trend: "+12%" },
  { keyword: "qatar airways privilege club", volume: 9900, difficulty: 45, trend: "+8%" },
  { keyword: "best airline in the world", volume: 8200, difficulty: 78, trend: "+5%" },
  { keyword: "luxury air travel qatar", volume: 3600, difficulty: 58, trend: "+15%" },
  { keyword: "qatar airways first class suites", volume: 2900, difficulty: 54, trend: "+20%" },
  { keyword: "qsuite business class", volume: 5400, difficulty: 48, trend: "+18%" },
  { keyword: "qatar airways destinations", volume: 12000, difficulty: 42, trend: "+6%" },
  { keyword: "sustainable aviation", volume: 6700, difficulty: 65, trend: "+25%" }
];

export const budgetData = {
  total: 1000000,
  allocated: 850000,
  campaigns: [
    { name: "Beyond First Class", budget: 420000, spent: 125000, channel: "Multi-channel" },
    { name: "Sustainability Week", budget: 250000, spent: 0, channel: "Digital" },
    { name: "Ramadan Journeys", budget: 180000, spent: 142000, channel: "Social & Email" },
    { name: "Privilege Club", budget: 150000, spent: 98000, channel: "Digital" }
  ],
  byChannel: [
    { channel: "Social Media", allocated: 320000, spent: 245000 },
    { channel: "Search & Display", allocated: 280000, spent: 198000 },
    { channel: "Email Marketing", allocated: 120000, spent: 87000 },
    { channel: "Traditional Media", allocated: 80000, spent: 45000 },
    { channel: "Content Creation", allocated: 50000, spent: 32000 }
  ]
};
