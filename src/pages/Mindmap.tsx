import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Search } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ViewType = "overview" | "foundation" | "components" | "assets";
type FilterType = "all" | "logo" | "colors" | "social-media";

const Mindmap = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<ViewType>("overview");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const views = [
    { id: "overview" as ViewType, label: "Overview" },
    { id: "foundation" as ViewType, label: "Foundation" },
    { id: "components" as ViewType, label: "Components" },
    { id: "assets" as ViewType, label: "Assets" },
  ];

  const filters = [
    { id: "all" as FilterType, label: "All" },
    { id: "logo" as FilterType, label: "Logo" },
    { id: "colors" as FilterType, label: "Colors" },
    { id: "social-media" as FilterType, label: "Social Media Template" },
  ];

  return (
    <div className="min-h-screen bg-[#000000] overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Q</span>
                </div>
                <span className="text-white font-bold">Qatar Airways</span>
              </div>
              <nav className="hidden md:flex items-center gap-3">
                {views.map((view) => (
                  <Badge
                    key={view.id}
                    variant={activeView === view.id ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      activeView === view.id
                        ? "bg-primary text-primary-foreground hover:bg-primary"
                        : "border-white/20 text-white/60 hover:text-white hover:border-white/40"
                    }`}
                    onClick={() => setActiveView(view.id)}
                  >
                    {view.label}
                  </Badge>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* AI Search Bar */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-6 pt-4">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Find items easily here"
              className="pl-12 bg-card/95 backdrop-blur-sm border-border/50 shadow-premium h-12"
            />
          </div>
          
          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 justify-center">
            {filters.map((filter) => (
              <Badge
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "secondary"}
                className={`cursor-pointer transition-all ${
                  activeFilter === filter.id
                    ? "bg-primary text-primary-foreground hover:bg-primary shadow-md"
                    : "bg-card/95 backdrop-blur-sm hover:bg-card border-border/50"
                }`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Cards Grid */}
      <div className="pt-40 pb-12 px-6 min-h-screen">
        <div className="container mx-auto max-w-[1600px]">
          <TooltipProvider>
          {/* Row 1 */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* Gradient Card - Large */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="col-span-12 md:col-span-3 transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredCard(1)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="aspect-square bg-gradient-to-br from-[#5C0632] via-[#7D0842] to-[#747F8A] border-0 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-4 left-4 text-white/80 text-sm font-display">
                      Brand Essence
                    </div>
                  </Card>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Visual representation of Qatar Airways brand identity combining premium maroon with sophistication</p>
              </TooltipContent>
            </Tooltip>

            {/* Color Card - Primary */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="col-span-6 md:col-span-2 transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredCard(2)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="aspect-square bg-white border-0 p-6 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Primary Color</div>
                      <div className="text-2xl font-bold text-[#5C0632]">#5C0632</div>
                    </div>
                    <div className="text-xs text-muted-foreground">Qatar Maroon</div>
                  </Card>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Primary brand color - Qatar Maroon represents luxury, heritage, and the brand's premium positioning</p>
              </TooltipContent>
            </Tooltip>

            {/* Circular Progress */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="col-span-6 md:col-span-3 transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredCard(3)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="aspect-square bg-white border-0 p-6 flex items-center justify-center relative">
                    <svg className="w-full h-full max-w-[200px] max-h-[200px]" viewBox="0 0 200 200">
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#f0f0f0"
                        strokeWidth="12"
                      />
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#5C0632"
                        strokeWidth="12"
                        strokeDasharray={`${2 * Math.PI * 80 * 0.85} ${2 * Math.PI * 80}`}
                        strokeLinecap="round"
                        transform="rotate(-90 100 100)"
                      />
                      <text
                        x="100"
                        y="100"
                        textAnchor="middle"
                        dy="0.3em"
                        className="text-4xl font-bold"
                        fill="#5C0632"
                      >
                        85%
                      </text>
                      <text
                        x="100"
                        y="135"
                        textAnchor="middle"
                        className="text-xs"
                        fill="#666"
                      >
                        Brand Consistency
                      </text>
                    </svg>
                  </Card>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Brand consistency score - measures adherence to brand guidelines across all touchpoints</p>
              </TooltipContent>
            </Tooltip>

            {/* Abstract Pattern */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="col-span-12 md:col-span-4 transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredCard(4)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="aspect-[2/1] bg-[#CBE962] border-0 overflow-hidden relative">
                    <div className="absolute inset-0 opacity-80">
                      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M0 20 Q10 10, 20 20 T40 20" stroke="#000" fill="none" strokeWidth="3" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#pattern)" />
                      </svg>
                    </div>
                    <div className="absolute bottom-4 left-4 text-black/70 text-sm font-medium">
                      Pattern Library
                    </div>
                  </Card>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reusable design patterns and visual elements that maintain brand consistency</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* Typography Card */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="col-span-12 md:col-span-4 transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredCard(5)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="aspect-[2/1] bg-white border-0 p-6 flex flex-col justify-center">
                    <div className="text-5xl font-display mb-2">
                      Aa
                    </div>
                    <div className="text-sm text-muted-foreground">Cormorant Garamond</div>
                    <div className="text-xs text-muted-foreground mt-1">Display Typography (Official)</div>
                  </Card>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Primary display typeface - elegant serif for headlines and hero text</p>
              </TooltipContent>
            </Tooltip>

            {/* Input Example */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="col-span-12 md:col-span-3 transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredCard(6)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="aspect-square bg-white border-0 p-6 flex items-center justify-center">
                    <div className="w-full space-y-3">
                      <div className="text-xs text-muted-foreground mb-4">Enter booking code</div>
                      <div className="flex gap-2 justify-center">
                        <div className="w-3 h-3 rounded-full bg-[#5C0A3A]" />
                        <div className="w-3 h-3 rounded-full bg-[#5C0A3A]" />
                        <div className="w-3 h-3 rounded-full bg-[#5C0A3A]" />
                        <div className="w-3 h-3 rounded-full bg-gray-200" />
                      </div>
                    </div>
                  </Card>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Interactive input pattern example - booking code entry with visual feedback</p>
              </TooltipContent>
            </Tooltip>

            {/* Color Swatch - Slate Gray */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="col-span-6 md:col-span-2 transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredCard(7)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="aspect-square bg-[#747F8A] border-0 p-6 flex flex-col justify-between">
                    <div className="text-white text-2xl font-bold">#747F8A</div>
                    <div className="text-white/80 text-xs">Slate Gray</div>
                  </Card>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Secondary neutral color - used for supporting text and subtle UI elements</p>
              </TooltipContent>
            </Tooltip>

            {/* Icon Card */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="col-span-6 md:col-span-3 transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredCard(8)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 border-0 p-6 flex items-center justify-center">
                    <Sparkles className="w-24 h-24 text-[#5C0632]" />
                  </Card>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Icon system example - consistent iconography representing innovation and premium service</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* Stats Card */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="col-span-6 md:col-span-2 transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredCard(9)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="aspect-square bg-white border-0 p-6 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Assets</div>
                      <div className="text-3xl font-bold text-[#5C0632]">247</div>
                    </div>
                    <div className="text-xs text-green-600">↑ 12% this month</div>
                  </Card>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total brand assets in library - growing 12% this month</p>
              </TooltipContent>
            </Tooltip>

            {/* Large Color Block */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="col-span-12 md:col-span-4 transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredCard(10)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="aspect-[2/1] bg-[#0F1020] border-0 p-6 flex flex-col justify-between">
                    <div className="text-white text-2xl font-bold">#0F1020</div>
                    <div className="text-white/60 text-sm">Neutral Dark</div>
                  </Card>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Neutral dark color - used for backgrounds, contrast, and sophisticated design elements</p>
              </TooltipContent>
            </Tooltip>

            {/* Distribution Chart */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="col-span-12 md:col-span-3 transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredCard(11)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="aspect-square bg-white border-0 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-muted-foreground">Asset Types</span>
                      <span className="text-xs text-muted-foreground">View</span>
                    </div>
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg viewBox="0 0 100 100" className="transform -rotate-90">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#5C0632" strokeWidth="20" strokeDasharray="100 150" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#747F8A" strokeWidth="20" strokeDasharray="60 190" strokeDashoffset="-100" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#7D0842" strokeWidth="20" strokeDasharray="40 210" strokeDashoffset="-160" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold">73%</div>
                          <div className="text-xs text-muted-foreground">Images</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <div>
                        <div className="font-medium text-[#5C0632]">10%</div>
                        <div className="text-muted-foreground">Logos</div>
                      </div>
                      <div>
                        <div className="font-medium text-[#7D0842]">10%</div>
                        <div className="text-muted-foreground">Docs</div>
                      </div>
                      <div>
                        <div className="font-medium text-[#747F8A]">7%</div>
                        <div className="text-muted-foreground">Video</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Asset type distribution - breakdown of digital assets by category</p>
              </TooltipContent>
            </Tooltip>

            {/* 3D Effect Card */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="col-span-6 md:col-span-3 transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredCard(12)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="aspect-square bg-gradient-to-br from-yellow-400 via-green-400 to-blue-500 border-0 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-40">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)`,
                      }} />
                    </div>
                    <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
                      Brand Energy
                    </div>
                  </Card>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Brand energy visualization - dynamic, vibrant colors representing innovation and forward-thinking</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-12 gap-6">
            {/* UI Typography */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="col-span-6 md:col-span-2 transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredCard(13)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="aspect-square bg-white border-0 p-6 flex flex-col justify-center">
                    <div className="text-3xl font-sans mb-2">Aa</div>
                    <div className="text-xs text-muted-foreground">Inter</div>
                    <div className="text-xs text-muted-foreground mt-1">UI Typography</div>
                  </Card>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>UI typeface - clean, readable sans-serif for interface elements and body text</p>
              </TooltipContent>
            </Tooltip>

            {/* Metric Card */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="col-span-6 md:col-span-3 transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredCard(14)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="aspect-square bg-white border-0 p-6 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Downloads</div>
                      <div className="text-3xl font-bold text-[#5C0632]">1,247</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-[#5C0632] rounded-full" />
                      </div>
                    </div>
                  </Card>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Asset downloads metric - tracks usage and engagement with brand materials</p>
              </TooltipContent>
            </Tooltip>

            {/* Accent Card */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="col-span-12 md:col-span-4 transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredCard(15)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="aspect-[2/1] bg-gradient-to-br from-[#5C0632] to-[#7D0842] border-0 p-8 flex items-center justify-center relative overflow-hidden">
                    <div className="text-white text-center relative z-10">
                      <div className="text-4xl font-display font-bold mb-2">Premium</div>
                      <div className="text-white/80 text-sm">Brand Experience</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
                  </Card>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Premium brand positioning - communicates luxury, excellence, and world-class service</p>
              </TooltipContent>
            </Tooltip>

            {/* Badge Card */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="col-span-12 md:col-span-3 transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredCard(16)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="aspect-square bg-white border-0 p-6 flex flex-col items-center justify-center gap-3">
                    <Badge className="bg-[#5C0632] hover:bg-[#5C0632]">Premium</Badge>
                    <Badge variant="outline" className="border-[#5C0632] text-[#5C0632]">Trustworthy</Badge>
                    <Badge variant="secondary">Innovation</Badge>
                  </Card>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Brand values badges - core attributes that define Qatar Airways identity</p>
              </TooltipContent>
            </Tooltip>
          </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default Mindmap;
