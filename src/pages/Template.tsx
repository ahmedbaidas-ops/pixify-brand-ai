import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, BookOpen, Palette, Target, MessageSquare, Image as ImageIcon, Type, Shapes, Download, Sparkles, Brain, Radar, Dna, FlaskConical, Bot, Music, Heart, Users, Globe, Building, Smile, Box, LineChart, Wand2, BarChart3, PenTool, Activity, RefreshCw, Layers, Share2, Cpu } from "lucide-react";
import Mindmap from "./Mindmap";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

const Template = () => {
  const [activeTab, setActiveTab] = useState("branded");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Brand Templates</h1>
          <p className="text-muted-foreground">Explore different views of your brand system</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-8">
            <TabsTrigger value="branded" className="gap-2">
              <Palette className="h-4 w-4" />
              Branded View
            </TabsTrigger>
            <TabsTrigger value="mindmap" className="gap-2">
              <Network className="h-4 w-4" />
              Mindmap
            </TabsTrigger>
            <TabsTrigger value="playbook" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Playbook
            </TabsTrigger>
            <TabsTrigger value="strategy" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Strategy
            </TabsTrigger>
          </TabsList>

          {/* Branded View - Inspired by Careem */}
          <TabsContent value="branded" className="space-y-0">
            <BrandedView />
          </TabsContent>

          {/* Mindmap View */}
          <TabsContent value="mindmap" className="space-y-0">
            <div className="-mx-6">
              <Mindmap />
            </div>
          </TabsContent>

          {/* Playbook View */}
          <TabsContent value="playbook" className="space-y-0">
            <PlaybookView />
          </TabsContent>

          {/* Strategy View */}
          <TabsContent value="strategy" className="space-y-0">
            <StrategyView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Branded View Component - Inspired by Careem's brand.careem.com
const BrandedView = () => {
  const brandSections = [
    {
      id: "strategy",
      title: "Strategy",
      description: "Brand purpose, vision, and values",
      icon: Target,
      gradient: "from-[#5C0A3A] to-[#7d2052]",
      image: "/qatar-airways-logo.png",
    },
    {
      id: "brand-architecture",
      title: "Brand\nArchitecture",
      description: "How our brand system is organized",
      icon: Shapes,
      gradient: "from-[#CBB59C] to-[#d4c4af]",
      pattern: true,
    },
    {
      id: "logo",
      title: "Logo",
      description: "Logo guidelines and usage",
      icon: ImageIcon,
      gradient: "from-[#0F1020] to-[#1a1b2e]",
      image: "/qatar-airways-logo.png",
    },
    {
      id: "tone-of-voice",
      title: "Tone of\nVoice",
      description: "How we communicate",
      icon: MessageSquare,
      gradient: "from-[#5C0A3A] to-[#8b1450]",
    },
    {
      id: "art-direction",
      title: "Art\nDirection",
      description: "Visual style and photography",
      icon: Palette,
      gradient: "from-[#CBB59C] to-[#e8dac5]",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "typography",
      title: "Typography",
      description: "Font families and text styles",
      icon: Type,
      gradient: "from-[#0F1020] to-[#2a2c42]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section - Careem Style */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5C0A3A] via-[#7d2052] to-[#9b2e66] p-16 text-white">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle, white 10%, transparent 10%)`,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 30px 30px'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-6xl font-black mb-6 leading-tight">
            Welcome to the<br />
            Qatar Airways Brand Guidelines
          </h1>
          <div className="flex gap-3">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-4 py-2">
              Premium Brand
            </Badge>
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-4 py-2">
              Aviation Excellence
            </Badge>
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-4 py-2">
              Middle East
            </Badge>
          </div>
        </div>
      </div>

      {/* Brand Sections Grid - Careem Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brandSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.id}
              className={`group relative overflow-hidden border-0 cursor-pointer transition-all hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${section.gradient} text-white`}
            >
              <div className="relative p-8 aspect-square flex flex-col justify-between">
                {/* Pattern Overlay */}
                {section.pattern && (
                  <div className="absolute inset-0 opacity-20">
                    <div style={{
                      backgroundImage: `radial-gradient(circle, white 8%, transparent 8%)`,
                      backgroundSize: '40px 40px',
                    }}></div>
                  </div>
                )}

                {/* Background Image */}
                {section.image && !section.pattern && (
                  <div className="absolute inset-0 opacity-30">
                    <img 
                      src={section.image} 
                      alt={section.title}
                      className="w-full h-full object-cover mix-blend-overlay"
                    />
                  </div>
                )}

                <div className="relative z-10">
                  <Icon className="h-12 w-12 mb-4 opacity-90" />
                </div>

                <div className="relative z-10">
                  <h3 className="text-3xl font-black mb-2 leading-tight whitespace-pre-line">
                    {section.title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {section.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Additional Info Section */}
      <Card className="bg-gradient-to-br from-[#CBB59C]/10 to-[#5C0A3A]/10 border-border/50 p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-2">Our Mission</h3>
            <p className="text-muted-foreground text-sm">
              To connect the world with warmth and excellence, making every journey extraordinary through premium service and cultural pride.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Our Vision</h3>
            <p className="text-muted-foreground text-sm">
              To be the most trusted and admired airline worldwide, setting new standards in aviation and hospitality.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Core Values</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Hospitality</Badge>
              <Badge variant="secondary">Excellence</Badge>
              <Badge variant="secondary">Trust</Badge>
              <Badge variant="secondary">Innovation</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Playbook View Component
const PlaybookView = () => {
  const { toast } = useToast();
  const [brand, setBrand] = useState<any>(null);
  const [designTokens, setDesignTokens] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [guidelines, setGuidelines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaybookData();
  }, []);

  const fetchPlaybookData = async () => {
    try {
      // Fetch brand data
      const { data: brandData } = await supabase
        .from("brands")
        .select("*")
        .limit(1)
        .single();

      // Fetch design tokens
      const { data: tokensData } = await supabase
        .from("design_tokens")
        .select("*")
        .eq("brand_id", brandData?.id);

      // Fetch assets
      const { data: assetsData } = await supabase
        .from("assets")
        .select("*")
        .eq("brand_id", brandData?.id)
        .limit(10);

      // Fetch guideline sections
      const { data: guidelinesData } = await supabase
        .from("guideline_sections")
        .select("*")
        .eq("brand_id", brandData?.id)
        .order("order_index");

      setBrand(brandData);
      setDesignTokens(tokensData || []);
      setAssets(assetsData || []);
      setGuidelines(guidelinesData || []);
    } catch (error) {
      console.error("Error fetching playbook data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    let yPos = 20;

    // Title
    doc.setFontSize(24);
    doc.text(brand?.name || "Brand Playbook", 20, yPos);
    yPos += 15;

    // Brand Strategy
    doc.setFontSize(16);
    doc.text("Brand Strategy", 20, yPos);
    yPos += 10;
    doc.setFontSize(10);
    if (brand?.purpose) {
      doc.text(`Purpose: ${brand.purpose}`, 20, yPos);
      yPos += 7;
    }
    if (brand?.tone) {
      doc.text(`Tone: ${brand.tone}`, 20, yPos);
      yPos += 7;
    }
    if (brand?.archetype) {
      doc.text(`Archetype: ${brand.archetype}`, 20, yPos);
      yPos += 10;
    }

    // Design Tokens
    doc.setFontSize(16);
    doc.text("Design Tokens", 20, yPos);
    yPos += 10;
    doc.setFontSize(10);
    designTokens.slice(0, 8).forEach((token) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${token.name} (${token.type})`, 20, yPos);
      yPos += 7;
    });

    // Assets
    yPos += 5;
    doc.setFontSize(16);
    doc.text("Brand Assets", 20, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.text(`Total Assets: ${assets.length}`, 20, yPos);

    doc.save(`${brand?.name || "brand"}-playbook.pdf`);
    
    toast({
      title: "PDF Generated",
      description: "Your brand playbook has been downloaded.",
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const colorTokens = designTokens.filter(t => t.type === 'color');
  const typographyTokens = designTokens.filter(t => t.type === 'typography');
  const logoAssets = assets.filter(a => a.type === 'logo');
  const imageAssets = assets.filter(a => a.type === 'image');

  return (
    <div className="space-y-8">
      <div className="max-w-none">
        <h2 className="text-3xl font-bold mb-4">Brand Playbook</h2>
        <p className="text-muted-foreground mb-8">
          A comprehensive guide to implementing the {brand?.name} brand across all touchpoints.
        </p>
      </div>

      {/* Brand Strategy Section */}
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-bold mb-4">Brand Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brand?.purpose && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">Purpose</p>
              <p className="text-sm">{brand.purpose}</p>
            </div>
          )}
          {brand?.tone && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">Tone of Voice</p>
              <p className="text-sm">{brand.tone}</p>
            </div>
          )}
          {brand?.archetype && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">Brand Archetype</p>
              <p className="text-sm">{brand.archetype}</p>
            </div>
          )}
          {brand?.audience && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">Target Audience</p>
              <p className="text-sm">{brand.audience}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Visual Identity Section */}
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-bold mb-4">Visual Identity</h3>
        <div className="grid grid-cols-1 gap-6">
          {/* Colors */}
          {colorTokens.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3">Color Palette</p>
              <div className="flex flex-wrap gap-3">
                {colorTokens.map((token) => (
                  <div key={token.id} className="flex items-center gap-2">
                    <div 
                      className="w-12 h-12 rounded-lg border border-border shadow-sm"
                      style={{ backgroundColor: token.value?.hex || token.value }}
                    />
                    <div>
                      <p className="text-xs font-medium">{token.name}</p>
                      <p className="text-xs text-muted-foreground">{token.value?.hex || token.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Typography */}
          {typographyTokens.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3">Typography</p>
              <div className="space-y-2">
                {typographyTokens.map((token) => (
                  <div key={token.id} className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">{token.name}</p>
                    {token.value?.family && (
                      <p className="text-xs text-muted-foreground">Font: {token.value.family}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Logos */}
          {logoAssets.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3">Logo Assets</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {logoAssets.map((asset) => (
                  <div key={asset.id} className="p-4 bg-muted/50 rounded-lg text-center">
                    <p className="text-xs font-medium">{asset.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{asset.mime_type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Guidelines Sections */}
      {guidelines.length > 0 && (
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold mb-4">Brand Guidelines</h3>
          <div className="space-y-3">
            {guidelines.map((guideline) => (
              <div key={guideline.id} className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">{guideline.title}</p>
                <Badge variant="secondary" className="mt-2">{guideline.type}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Asset Library */}
      {imageAssets.length > 0 && (
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold mb-4">Asset Library</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {imageAssets.slice(0, 8).map((asset) => (
              <div key={asset.id} className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-xs font-medium truncate">{asset.name}</p>
                <Badge variant="outline" className="mt-2 text-xs">{asset.type}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Download Section */}
      <Card className="bg-primary/5 border-primary/20 p-8">
        <div className="flex items-center gap-4">
          <BookOpen className="h-12 w-12 text-primary" />
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">Download Full Playbook</h3>
            <p className="text-muted-foreground mb-4">
              Get the complete brand guidelines in PDF format
            </p>
            <button
              onClick={generatePDF}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Strategy View Component - Next-Gen Features
const StrategyView = () => {
  const features = [
    {
      id: 1,
      title: "Live Brand Personality Engine",
      subtitle: "Adaptive Brand Archetype AI",
      description: "Brand tone and visuals adapt in real time based on audience type, market conditions, platform, current brand reputation, and cultural context.",
      example: "If your brand goes viral → AI adjusts tone to 'Playful Confident.' If a PR issue happens → AI switches to 'Reassuring, Empathetic.'",
      whyNew: "Brands become emotionally intelligent and dynamic.",
      icon: Brain,
      color: "from-purple-600 to-purple-800",
    },
    {
      id: 2,
      title: "Real-Time Visual Consistency Radar",
      subtitle: "Live Brand Health Heatmap",
      description: "A radar map shows which teams are on-brand, which assets drift, where tone is inconsistent, and which designers need help.",
      example: "Visualizes the 'health' of your brand in a live heatmap.",
      whyNew: "Never before done in a DAM.",
      icon: Radar,
      color: "from-blue-600 to-blue-800",
    },
    {
      id: 3,
      title: "Brand DNA Generator",
      subtitle: "Genetic Code Extraction",
      description: "AI extracts the brand's genetic code — shapes, angles, rhythms, spacing — and generates brand-specific patterns, logo explorations, motion styles, photography guidelines, and iconographic systems.",
      example: "Massive for creative teams who need consistent brand extensions.",
      whyNew: "First system to extract and replicate brand genetics.",
      icon: Dna,
      color: "from-green-600 to-green-800",
    },
    {
      id: 4,
      title: "Brand Mutation Simulation Engine",
      subtitle: "Predictive Brand Evolution",
      description: "Before updating your brand, Pixify simulates audience reaction, usability impact, digital transformation friction, marketing adaptation effort, brand recall changes, and psychological impact.",
      example: "UX + branding + behavioral science merged into one tool.",
      whyNew: "First predictive brand testing system.",
      icon: FlaskConical,
      color: "from-yellow-600 to-yellow-800",
    },
    {
      id: 5,
      title: "Zero-Input Content Auto-Pilot",
      subtitle: "Autonomous Content Creation",
      description: "Pixify creates content without you asking by tracking the calendar, checking campaigns, learning priorities, and scanning competitors. Auto-generates weekly posts, monthly reports, seasonal campaigns, layouts, and reels.",
      example: "You only approve → publish. Complete hands-off automation.",
      whyNew: "First truly autonomous brand content system.",
      icon: Bot,
      color: "from-orange-600 to-orange-800",
    },
    {
      id: 6,
      title: "Multi-Sensory Branding",
      subtitle: "AI Audio Identity Generator",
      description: "Pixify doesn't only manage visuals — it creates sound logos, podcast intros, brand themes, in-app sound UX, and ambient brand audio. Plus audio-to-brand-code mapping.",
      example: "Complete sonic identity generation from visual brand DNA.",
      whyNew: "First DAM to generate audio brand assets.",
      icon: Music,
      color: "from-red-600 to-red-800",
    },
    {
      id: 7,
      title: "Brand Emotion Analyzer",
      subtitle: "Sentiment Intelligence",
      description: "AI scans user comments, market sentiment, competitor campaigns, and industry trends — then adjusts brand tone suggestions based on emotion.",
      example: "Real-time emotional feedback loop for your brand.",
      whyNew: "First emotion-aware brand management system.",
      icon: Heart,
      color: "from-purple-600 to-pink-600",
    },
    {
      id: 8,
      title: "Team Skill Radar",
      subtitle: "AI Designer Performance Engine",
      description: "Pixify analyzes design style, output consistency, creativity index, accuracy, and time-to-delivery. Builds skill profiles for each designer & team with training path recommendations.",
      example: "Know exactly who excels at what, and where to invest in growth.",
      whyNew: "First AI-powered creative team analytics.",
      icon: Users,
      color: "from-blue-600 to-cyan-600",
    },
    {
      id: 9,
      title: "Brand Consciousness Mode",
      subtitle: "Aware Brand System",
      description: "Pixify becomes aware of cultural context, trending styles, political sensitivity, holidays, national tone shifts, and market psychology.",
      example: "'This content may not perform well during this period in KSA.' 'This message could be misunderstood in Qatar.'",
      whyNew: "True AI brand ethics and cultural intelligence.",
      icon: Globe,
      color: "from-green-600 to-teal-600",
    },
    {
      id: 10,
      title: "Cross-Brand Collaboration Layer",
      subtitle: "Portfolio Management",
      description: "If a company manages multiple brands, Pixify allows style borrowing, visual mapping, cross-brand consistency, and portfolio-wide analytics.",
      example: "Perfect for holding groups and multi-brand enterprises.",
      whyNew: "First unified multi-brand management platform.",
      icon: Building,
      color: "from-yellow-600 to-amber-600",
    },
    {
      id: 11,
      title: "AI Brand Rituals",
      subtitle: "Internal Culture Reinforcer",
      description: "Pixify helps teams stay aligned with missions by generating team reminders, brand rituals, internal campaigns, and cultural reinforcement visuals.",
      example: "Helps companies maintain brand-driven culture internally.",
      whyNew: "First system to reinforce brand culture within teams.",
      icon: Sparkles,
      color: "from-orange-600 to-red-600",
    },
    {
      id: 12,
      title: "Emotional Moodboard Generator",
      subtitle: "Feeling-Based Design",
      description: "Upload a feeling, scenario, personality, or story — and Pixify generates a moodboard that reflects emotional states.",
      example: "'Generate a moodboard for Hope after struggle in Qatar Airways brand style.'",
      whyNew: "First emotion-to-visual translation engine.",
      icon: Smile,
      color: "from-purple-600 to-violet-600",
    },
    {
      id: 13,
      title: "Immersive Brand Office",
      subtitle: "3D Virtual Brand Room",
      description: "A web-based 3D environment where guidelines float as objects, colors exist as glowing spheres, logos appear as sculptures, patterns animate, and typography is displayed in 3D space.",
      example: "Clients can walk around the brand. You will be the first in the world to offer this.",
      whyNew: "First 3D immersive brand experience platform.",
      icon: Box,
      color: "from-blue-600 to-indigo-600",
    },
    {
      id: 14,
      title: "Predictive Campaign Composer",
      subtitle: "AI Campaign Generation",
      description: "Write 'Ramadan campaign for families with travel focus' and AI responds with visuals, copy, hashtags, media mix, email flows, landing page wireframe, scripts, and budget allocation.",
      example: "All optimized with predictive performance analysis.",
      whyNew: "First end-to-end AI campaign generation.",
      icon: LineChart,
      color: "from-green-600 to-emerald-600",
    },
    {
      id: 15,
      title: "Adaptive Visual System Generator",
      subtitle: "Multi-Expression Brand System",
      description: "Pixify generates multiple expressions of the brand system while staying on-brand: geometric, organic, luxury, minimalist, surreal, abstract.",
      example: "Let brands evolve within permitted boundaries.",
      whyNew: "First system for controlled brand expression variation.",
      icon: Wand2,
      color: "from-yellow-600 to-orange-600",
    },
    {
      id: 16,
      title: "Cognitive Load Optimizer",
      subtitle: "UX Science Engine",
      description: "Pixify analyzes designs and detects visual overload, suggests spacing improvements, rearranges hierarchy, simplifies layout, and ensures WCAG compliance.",
      example: "Based on Nielsen Norman Group principles.",
      whyNew: "First UX science integration in brand management.",
      icon: BarChart3,
      color: "from-red-600 to-rose-600",
    },
    {
      id: 17,
      title: "Brand Story Engine",
      subtitle: "Narrative AI",
      description: "AI builds brand story frameworks, product story arcs, founder story scripts, and customer storyboards. Generates narrative-based visuals.",
      example: "Complete storytelling infrastructure for brands.",
      whyNew: "First AI-powered brand storytelling system.",
      icon: PenTool,
      color: "from-purple-600 to-fuchsia-600",
    },
    {
      id: 18,
      title: "Real-Time Brand Ops Dashboard",
      subtitle: "Live Operations Center",
      description: "A live dashboard showing brand score, content performance, project velocity, team burnout prediction, asset usage trends, and archetype drift.",
      example: "AI alerts: 'Brand consistency dropped 14% this week.'",
      whyNew: "First real-time brand operations monitoring.",
      icon: Activity,
      color: "from-blue-600 to-sky-600",
    },
    {
      id: 19,
      title: "Identity Transformation Advisor",
      subtitle: "Brand Evolution Guide",
      description: "If a brand wants to reposition, refresh, expand markets, or add product lines — Pixify creates new identity options, messaging shifts, visual transformations, rollout plans, and risk analysis.",
      example: "Complete brand transformation guidance.",
      whyNew: "First AI brand transformation consultant.",
      icon: RefreshCw,
      color: "from-green-600 to-lime-600",
    },
    {
      id: 20,
      title: "Brand Resurrection Mode",
      subtitle: "Brand Doctor",
      description: "For weak brands: Pixify diagnoses the entire brand, then prescribes tone, visuals, experiences, campaigns, and product improvements.",
      example: "A full brand doctor for struggling brands.",
      whyNew: "First AI brand diagnostic and recovery system.",
      icon: Heart,
      color: "from-red-600 to-pink-600",
    },
    {
      id: 21,
      title: "Archetype Reinforcement Engine",
      subtitle: "Brand Consistency Guardian",
      description: "Ensures brand archetype stays consistent across visuals, tone, advertising, UX writing, and product decisions. If a post breaks archetype rules → AI flags it.",
      example: "Never let your brand personality drift again.",
      whyNew: "First archetype consistency enforcement system.",
      icon: Layers,
      color: "from-orange-600 to-amber-600",
    },
    {
      id: 22,
      title: "Stakeholder Alignment AI",
      subtitle: "Decision Documentation",
      description: "Summarizes meetings, decisions, brand debates, and creative options. Generates a final direction, logic behind decisions, and documentation.",
      example: "Perfect for agencies & corporates.",
      whyNew: "First AI-powered brand decision alignment tool.",
      icon: Share2,
      color: "from-yellow-600 to-lime-600",
    },
    {
      id: 23,
      title: "Multi-Layer Asset Fusion Engine",
      subtitle: "AI Asset Multiplication",
      description: "AI can merge multiple assets into new compositions, hybrid layouts, infinite variations, and 3D extrapolations. Upload 2 assets → AI creates 50 new ones.",
      example: "Exponential asset generation from minimal inputs.",
      whyNew: "First AI asset fusion and multiplication engine.",
      icon: Cpu,
      color: "from-purple-600 to-indigo-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-gray-900 to-black p-12 md:p-16 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-4xl">
          <Badge className="bg-white/10 hover:bg-white/20 text-white border-0 px-4 py-2 mb-6">
            <Sparkles className="h-3 w-3 mr-2" />
            Next-Gen Features
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            The World's Most Advanced
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
              Brand OS
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl">
            Category-defining features that no DAM or brand system in the world currently offers. 
            A completely new era of brand management.
          </p>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-full blur-3xl" />
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.id}
              className="group relative overflow-hidden border border-border/50 hover:border-border transition-all hover:shadow-xl cursor-pointer bg-card"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    #{feature.id}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{feature.subtitle}</p>

                {/* Description */}
                <p className="text-sm text-foreground/80 mb-4 line-clamp-3">
                  {feature.description}
                </p>

                {/* Example */}
                <div className="p-3 rounded-lg bg-muted/50 mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Example</p>
                  <p className="text-xs font-medium line-clamp-2">{feature.example}</p>
                </div>

                {/* Why New */}
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <p className="text-xs font-medium text-primary">{feature.whyNew}</p>
                </div>
              </div>

              {/* Hover Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
            </Card>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Ready to Build the Future?</h3>
            <p className="text-muted-foreground">
              These features will make Pixify the flagship Brand OS for Pixilated.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-medium transition-colors">
            <Sparkles className="h-4 w-4" />
            Explore Roadmap
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Template;