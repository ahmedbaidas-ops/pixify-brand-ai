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
          <h2 className="text-4xl font-bold mb-4">Logo Usage & Guidelines</h2>
          <p className="text-muted-foreground">The Oryx mark and Qatar Airways wordmark represent our brand identity. Proper usage ensures consistent brand recognition.</p>
        </div>

        {/* Primary Logo Display */}
        <Card className="p-12 bg-white mb-8">
          <div className="flex items-center justify-center min-h-[200px]">
            <img 
              src="/qatar-airways-logo.png" 
              alt="Qatar Airways Logo"
              className="max-h-[160px] w-auto object-contain"
            />
          </div>
        </Card>

        {/* Clear Space Requirements */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Clear Space Requirements</h3>
          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">X</span>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Minimum Clear Space</h4>
                  <p className="text-muted-foreground">
                    Maintain a clear space equal to the height of the letter "Q" in QATAR around all sides of the logo. 
                    This ensures the logo maintains its visual impact and is not crowded by other elements.
                  </p>
                </div>
              </div>
              <div className="bg-muted/30 p-8 rounded-lg">
                <div className="relative inline-block">
                  <img 
                    src="/qatar-airways-logo.png" 
                    alt="Clear Space Example"
                    className="h-20 w-auto"
                  />
                  <div className="absolute -inset-8 border-2 border-dashed border-primary/40"></div>
                  <div className="absolute -top-10 left-0 text-xs text-primary font-mono">← X →</div>
                  <div className="absolute -left-10 top-0 text-xs text-primary font-mono rotate-90">← X →</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Minimum Size */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Minimum Size</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="font-bold mb-3">Digital / Screen</h4>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Minimum width: <strong className="text-foreground">120px</strong></p>
                <p className="text-muted-foreground">Minimum height: <strong className="text-foreground">40px</strong></p>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground">Ensures legibility on screens and web applications</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <h4 className="font-bold mb-3">Print</h4>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Minimum width: <strong className="text-foreground">40mm</strong></p>
                <p className="text-muted-foreground">Minimum height: <strong className="text-foreground">14mm</strong></p>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground">Maintains quality and brand recognition in printed materials</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Background Usage */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Approved Backgrounds</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-white">
              <div className="aspect-square flex items-center justify-center mb-3">
                <img 
                  src="/qatar-airways-logo.png" 
                  alt="Logo on white"
                  className="h-16 w-auto"
                />
              </div>
              <p className="text-xs text-center font-medium">White</p>
            </Card>
            <Card className="p-6 bg-[#0F1020]">
              <div className="aspect-square flex items-center justify-center mb-3">
                <img 
                  src="/qatar-airways-logo.png" 
                  alt="Logo on dark"
                  className="h-16 w-auto"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
              <p className="text-xs text-center font-medium text-white">Dark Neutral</p>
            </Card>
            <Card className="p-6 bg-[#CBB59C]">
              <div className="aspect-square flex items-center justify-center mb-3">
                <img 
                  src="/qatar-airways-logo.png" 
                  alt="Logo on sand"
                  className="h-16 w-auto"
                />
              </div>
              <p className="text-xs text-center font-medium">Desert Sand</p>
            </Card>
            <Card className="p-6 bg-neutral-100">
              <div className="aspect-square flex items-center justify-center mb-3">
                <img 
                  src="/qatar-airways-logo.png" 
                  alt="Logo on light gray"
                  className="h-16 w-auto"
                />
              </div>
              <p className="text-xs text-center font-medium">Light Gray</p>
            </Card>
          </div>
        </div>

        {/* Do's and Don'ts */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Usage Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DO's */}
            <Card className="p-6 border-2 border-green-500/20 bg-green-500/5">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-bold">Do</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <div>
                    <p className="font-medium mb-1">Use approved color versions</p>
                    <p className="text-sm text-muted-foreground">Full color, monochrome, or white versions only</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <div>
                    <p className="font-medium mb-1">Maintain aspect ratio</p>
                    <p className="text-sm text-muted-foreground">Always scale proportionally when resizing</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <div>
                    <p className="font-medium mb-1">Use on clean backgrounds</p>
                    <p className="text-sm text-muted-foreground">Ensure high contrast and visibility</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <div>
                    <p className="font-medium mb-1">Respect clear space</p>
                    <p className="text-sm text-muted-foreground">Keep minimum spacing around the logo</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <div>
                    <p className="font-medium mb-1">Use high-resolution files</p>
                    <p className="text-sm text-muted-foreground">Vector formats for print, PNG for digital</p>
                  </div>
                </li>
              </ul>
            </Card>

            {/* DON'Ts */}
            <Card className="p-6 border-2 border-destructive/20 bg-destructive/5">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-full bg-destructive flex items-center justify-center text-white font-bold">
                  ✕
                </div>
                <h3 className="text-xl font-bold">Don&apos;t</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-0.5">✕</span>
                  <div>
                    <p className="font-medium mb-1">Distort or stretch</p>
                    <p className="text-sm text-muted-foreground">Never alter the width or height independently</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-0.5">✕</span>
                  <div>
                    <p className="font-medium mb-1">Change colors</p>
                    <p className="text-sm text-muted-foreground">Never use unauthorized color variations</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-0.5">✕</span>
                  <div>
                    <p className="font-medium mb-1">Rotate or flip</p>
                    <p className="text-sm text-muted-foreground">Always keep the logo in its original orientation</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-0.5">✕</span>
                  <div>
                    <p className="font-medium mb-1">Add effects or shadows</p>
                    <p className="text-sm text-muted-foreground">No drop shadows, gradients, or special effects</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-0.5">✕</span>
                  <div>
                    <p className="font-medium mb-1">Place on busy backgrounds</p>
                    <p className="text-sm text-muted-foreground">Avoid patterns, images, or low-contrast surfaces</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-0.5">✕</span>
                  <div>
                    <p className="font-medium mb-1">Recreate or redraw</p>
                    <p className="text-sm text-muted-foreground">Always use official digital files</p>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Download Section */}
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-3">Need Logo Files?</h3>
            <p className="text-muted-foreground mb-6">
              Download approved logo assets in various formats from the Library
            </p>
            <Button className="bg-gradient-primary">
              Go to Asset Library
            </Button>
          </div>
        </Card>
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
