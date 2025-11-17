import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, BookOpen, Palette, Target, MessageSquare, Image as ImageIcon, Type, Shapes, Download } from "lucide-react";
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
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
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

export default Template;