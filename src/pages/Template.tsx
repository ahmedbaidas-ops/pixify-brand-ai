import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, BookOpen, Palette, Target, MessageSquare, Image as ImageIcon, Type, Shapes } from "lucide-react";
import Mindmap from "./Mindmap";

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
  const playbookSections = [
    { title: "Brand Strategy", items: ["Mission", "Vision", "Values", "Positioning"] },
    { title: "Visual Identity", items: ["Logo System", "Color Palette", "Typography", "Iconography"] },
    { title: "Voice & Tone", items: ["Brand Personality", "Messaging Guidelines", "Copy Examples"] },
    { title: "Applications", items: ["Digital", "Print", "Environmental", "Product"] },
  ];

  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <h2 className="text-3xl font-bold mb-4">Brand Playbook</h2>
        <p className="text-muted-foreground mb-8">
          A comprehensive guide to implementing the Qatar Airways brand across all touchpoints.
        </p>
      </div>

      <div className="grid gap-6">
        {playbookSections.map((section, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-4">{section.title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                >
                  <p className="text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-primary/5 border-primary/20 p-8">
        <div className="flex items-center gap-4">
          <BookOpen className="h-12 w-12 text-primary" />
          <div>
            <h3 className="text-xl font-bold mb-1">Download Full Playbook</h3>
            <p className="text-muted-foreground mb-4">
              Get the complete brand guidelines in PDF, Notion, or PowerPoint format
            </p>
            <div className="flex gap-3">
              <Badge className="bg-primary hover:bg-primary/90 cursor-pointer">
                Download PDF
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                Export to Notion
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                Export to PPTX
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Template;