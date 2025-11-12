import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, MessageSquare } from "lucide-react";

const Guideline = () => {
  const [view, setView] = useState<"brand" | "interactive">("brand");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Brand Guideline</h1>
              <p className="text-muted-foreground">Qatar Airways brand standards</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={view === "brand" ? "default" : "outline"}
                onClick={() => setView("brand")}
                className={view === "brand" ? "bg-gradient-primary" : ""}
              >
                <Eye className="mr-2 h-4 w-4" />
                Brand View
              </Button>
              <Button
                variant={view === "interactive" ? "default" : "outline"}
                onClick={() => setView("interactive")}
                className={view === "interactive" ? "bg-gradient-primary" : ""}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Interactive AI
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {view === "brand" ? (
          <BrandView />
        ) : (
          <InteractiveView />
        )}
      </div>
    </div>
  );
};

const BrandView = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-16">
      {/* Strategy Section */}
      <section id="strategy" className="scroll-mt-20">
        <div className="mb-8">
          <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            STRATEGY
          </div>
          <h2 className="text-4xl font-bold mb-4">Brand Purpose</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Qatar Airways connects the world with exceptional hospitality and innovation,
            making travel a seamless and enriching experience for every passenger.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-3">Archetype</h3>
            <p className="text-muted-foreground mb-2">Caregiver / Explorer</p>
            <p className="text-sm">Nurturing journeys while embracing adventure</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-3">Tone of Voice</h3>
            <p className="text-muted-foreground mb-2">Warm, Premium, Trustworthy</p>
            <p className="text-sm">Professional yet approachable communication</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-3">Target Audience</h3>
            <p className="text-muted-foreground mb-2">Global travelers</p>
            <p className="text-sm">Business and leisure passengers seeking quality</p>
          </Card>
        </div>
      </section>

      {/* Logo Section */}
      <section id="logo" className="scroll-mt-20">
        <div className="mb-8">
          <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            LOGO
          </div>
          <h2 className="text-4xl font-bold mb-4">Logo Usage</h2>
        </div>

        <Card className="p-12 bg-gradient-to-br from-neutral to-neutral/90 mb-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-6xl font-bold text-primary-foreground">
              QATAR AIRWAYS
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-2 border-green-500/20 bg-green-500/5">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs">
                ✓
              </div>
              <h3 className="font-bold">Do</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use on white or neutral backgrounds</li>
              <li>• Maintain minimum clear space</li>
              <li>• Scale proportionally</li>
            </ul>
          </Card>
          <Card className="p-6 border-2 border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-6 rounded-full bg-destructive flex items-center justify-center text-white font-bold text-xs">
                ✕
              </div>
              <h3 className="font-bold">Don't</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Distort or stretch the logo</li>
              <li>• Use on busy backgrounds</li>
              <li>• Alter colors or typography</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Color Section */}
      <section id="color" className="scroll-mt-20">
        <div className="mb-8">
          <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            COLOR
          </div>
          <h2 className="text-4xl font-bold mb-4">Color System</h2>
          <p className="text-muted-foreground">
            Our color palette reflects the premium and warm nature of the Qatar Airways brand
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Primary Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="overflow-hidden">
                <div className="h-48 bg-[#5C0A3A]"></div>
                <div className="p-6">
                  <h4 className="font-bold mb-2">Qatar Maroon</h4>
                  <p className="text-sm text-muted-foreground mb-3">Primary brand color</p>
                  <div className="space-y-1 font-mono text-sm">
                    <p>HEX: #5C0A3A</p>
                    <p>RGB: 92, 10, 58</p>
                    <p>HSL: 330°, 88%, 20%</p>
                  </div>
                </div>
              </Card>
              <Card className="overflow-hidden">
                <div className="h-48 bg-[#CBB59C]"></div>
                <div className="p-6">
                  <h4 className="font-bold mb-2">Sand</h4>
                  <p className="text-sm text-muted-foreground mb-3">Secondary accent</p>
                  <div className="space-y-1 font-mono text-sm">
                    <p>HEX: #CBB59C</p>
                    <p>RGB: 203, 181, 156</p>
                    <p>HSL: 30°, 32%, 70%</p>
                  </div>
                </div>
              </Card>
              <Card className="overflow-hidden">
                <div className="h-48 bg-[#0F1020]"></div>
                <div className="p-6">
                  <h4 className="font-bold mb-2">Neutral</h4>
                  <p className="text-sm text-muted-foreground mb-3">Text and backgrounds</p>
                  <div className="space-y-1 font-mono text-sm">
                    <p>HEX: #0F1020</p>
                    <p>RGB: 15, 16, 32</p>
                    <p>HSL: 240°, 37%, 10%</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Typography Section */}
      <section id="typography" className="scroll-mt-20">
        <div className="mb-8">
          <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            TYPOGRAPHY
          </div>
          <h2 className="text-4xl font-bold mb-4">Type System</h2>
        </div>

        <Card className="p-8">
          <div className="space-y-8">
            <div className="border-b border-border pb-8">
              <p className="text-sm text-muted-foreground mb-3">Display Font</p>
              <h3 className="text-5xl font-serif mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Cormorant Garamond
              </h3>
              <p className="text-muted-foreground">For headlines and hero content</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-3">UI Font</p>
              <h3 className="text-3xl font-sans mb-3">Inter</h3>
              <p className="text-muted-foreground">For body text and interface elements</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

const InteractiveView = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <Card className="p-8">
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">AI Brand Assistant</h3>
          <p className="text-muted-foreground mb-8">
            Ask questions about brand guidelines, find assets, or generate copy
          </p>
          <Button size="lg" className="bg-gradient-primary">
            Start Conversation
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Guideline;
