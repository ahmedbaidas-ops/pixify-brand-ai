export type Competitor = {
  name: string;
  country: string;
  hub: string;
  alliance?: "oneworld" | "star" | "skyteam" | "none";
  type: "Full-service" | "LCC";
  primaryColor?: string;
  brandUrl: string;
  mediaUrl?: string;
  notes?: string;
  region: "Middle East" | "Global";
};

export const competitors: Competitor[] = [
  // Middle East & regional network competitors
  { 
    name: "Emirates", 
    country: "UAE", 
    hub: "DXB", 
    alliance: "none", 
    type: "Full-service", 
    primaryColor: "#D71920", 
    brandUrl: "https://www.emirates.com", 
    region: "Middle East", 
    notes: "ME3 peer; global premium long-haul" 
  },
  { 
    name: "Etihad Airways", 
    country: "UAE", 
    hub: "AUH", 
    alliance: "none", 
    type: "Full-service", 
    primaryColor: "#4B3A2F", 
    brandUrl: "https://www.etihad.com", 
    region: "Middle East" 
  },
  { 
    name: "Saudia", 
    country: "Saudi Arabia", 
    hub: "JED/RUH", 
    alliance: "skyteam", 
    type: "Full-service", 
    primaryColor: "#1C2551", 
    brandUrl: "https://www.saudia.com", 
    region: "Middle East" 
  },
  { 
    name: "Turkish Airlines", 
    country: "Türkiye", 
    hub: "IST", 
    alliance: "star", 
    type: "Full-service", 
    primaryColor: "#C70025", 
    brandUrl: "https://www.turkishairlines.com", 
    region: "Middle East", 
    notes: "Massive global network via IST" 
  },
  { 
    name: "Oman Air", 
    country: "Oman", 
    hub: "MCT", 
    alliance: "none", 
    type: "Full-service", 
    primaryColor: "#006F72", 
    brandUrl: "https://www.omanair.com", 
    region: "Middle East" 
  },
  { 
    name: "Gulf Air", 
    country: "Bahrain", 
    hub: "BAH", 
    alliance: "none", 
    type: "Full-service", 
    primaryColor: "#C5A572", 
    brandUrl: "https://www.gulfair.com", 
    region: "Middle East" 
  },
  { 
    name: "Kuwait Airways", 
    country: "Kuwait", 
    hub: "KWI", 
    alliance: "none", 
    type: "Full-service", 
    primaryColor: "#0057A6", 
    brandUrl: "https://www.kuwaitairways.com", 
    region: "Middle East" 
  },
  { 
    name: "Royal Jordanian", 
    country: "Jordan", 
    hub: "AMM", 
    alliance: "oneworld", 
    type: "Full-service", 
    primaryColor: "#990000", 
    brandUrl: "https://www.rj.com", 
    region: "Middle East" 
  },
  // Global premium/network competitors on overlapping routes
  { 
    name: "British Airways", 
    country: "UK", 
    hub: "LHR", 
    alliance: "oneworld", 
    type: "Full-service", 
    primaryColor: "#1C2A51", 
    brandUrl: "https://www.ba.com", 
    region: "Global" 
  },
  { 
    name: "Lufthansa", 
    country: "Germany", 
    hub: "FRA/MUC", 
    alliance: "star", 
    type: "Full-service", 
    primaryColor: "#05164D", 
    brandUrl: "https://www.lufthansa.com", 
    region: "Global" 
  },
  { 
    name: "Air France", 
    country: "France", 
    hub: "CDG", 
    alliance: "skyteam", 
    type: "Full-service", 
    primaryColor: "#002157", 
    brandUrl: "https://www.airfrance.com", 
    region: "Global" 
  },
  { 
    name: "KLM", 
    country: "Netherlands", 
    hub: "AMS", 
    alliance: "skyteam", 
    type: "Full-service", 
    primaryColor: "#00A1DE", 
    brandUrl: "https://www.klm.com", 
    region: "Global" 
  },
  { 
    name: "Singapore Airlines", 
    country: "Singapore", 
    hub: "SIN", 
    alliance: "star", 
    type: "Full-service", 
    primaryColor: "#072146", 
    brandUrl: "https://www.singaporeair.com", 
    region: "Global" 
  },
  { 
    name: "Cathay Pacific", 
    country: "Hong Kong", 
    hub: "HKG", 
    alliance: "oneworld", 
    type: "Full-service", 
    primaryColor: "#00605E", 
    brandUrl: "https://www.cathaypacific.com", 
    region: "Global" 
  },
  { 
    name: "United Airlines", 
    country: "USA", 
    hub: "ORD/EWR/IAH", 
    alliance: "star", 
    type: "Full-service", 
    primaryColor: "#005DAA", 
    brandUrl: "https://www.united.com", 
    region: "Global" 
  },
  { 
    name: "American Airlines", 
    country: "USA", 
    hub: "DFW/MIA/JFK", 
    alliance: "oneworld", 
    type: "Full-service", 
    primaryColor: "#1F2A44", 
    brandUrl: "https://www.aa.com", 
    region: "Global" 
  },
  { 
    name: "Delta Air Lines", 
    country: "USA", 
    hub: "ATL/JFK/DTW", 
    alliance: "skyteam", 
    type: "Full-service", 
    primaryColor: "#C8102E", 
    brandUrl: "https://www.delta.com", 
    region: "Global" 
  },
  // Regional LCCs (useful for brand style benchmarking)
  { 
    name: "flydubai", 
    country: "UAE", 
    hub: "DXB", 
    alliance: "none", 
    type: "LCC", 
    primaryColor: "#0071CE", 
    brandUrl: "https://www.flydubai.com", 
    region: "Middle East" 
  },
  { 
    name: "Air Arabia", 
    country: "UAE", 
    hub: "SHJ", 
    alliance: "none", 
    type: "LCC", 
    primaryColor: "#ED1C24", 
    brandUrl: "https://www.airarabia.com", 
    region: "Middle East" 
  }
];
