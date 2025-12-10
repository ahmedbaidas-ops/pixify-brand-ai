import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, FolderOpen, Sparkles, Download, ArrowRight, FileStack, Activity, 
  Users, Target, Zap, Loader2, Image, X, Palette, Type, Heart, Search,
  ChevronRight, TrendingUp, Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { toast } from "sonner";
import { CustomizeView, DashboardSection } from "@/components/dashboard/CustomizeView";

const defaultSections: DashboardSection[] = [
  { id: "ai-assistant", label: "AI Assistant", visible: true },
  { id: "metrics", label: "Metrics", visible: true },
  { id: "quick-actions", label: "Quick Actions", visible: true },
  { id: "brand-overview", label: "Brand Overview", visible: true },
];

const quickChips = [
  { label: "Brand Colors", query: "What are our brand colors?", icon: Palette },
  { label: "Typography", query: "What fonts do we use?", icon: Type },
  { label: "Find Logo", query: "Pull the logo PNG", icon: Image },
  { label: "Brand Strategy", query: "What's our brand archetype?", icon: Heart },
];

const Dashboard = () => {
  const [progressValues, setProgressValues] = useState({
    brandConsistency: 0,
    assetLibrary: 0,
    campaignPerformance: 0,
    teamActivity: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [aiQuery, setAiQuery] = useState("");
  const [sections, setSections] = useState<DashboardSection[]>(() => {
    const saved = localStorage.getItem("dashboard-sections");
    return saved ? JSON.parse(saved) : defaultSections;
  });
  const { isLoading: aiLoading, response: aiResponse, processQuery, clearResponse } = useAIAssistant();

  // Save sections to localStorage when changed
  useEffect(() => {
    localStorage.setItem("dashboard-sections", JSON.stringify(sections));
  }, [sections]);

  const isSectionVisible = (id: string) => {
    const section = sections.find(s => s.id === id);
    return section?.visible ?? true;
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data: brands, error: brandsError } = await supabase
          .from('brands')
          .select('id')
          .eq('name', 'Qatar Airways')
          .single();

        if (brandsError) throw brandsError;

        if (brands) {
          const { data: metrics, error: metricsError } = await supabase
            .from('brand_metrics')
            .select('*')
            .eq('brand_id', brands.id)
            .single();

          if (metricsError) throw metricsError;

          if (metrics) {
            setTimeout(() => {
              setProgressValues({
                brandConsistency: metrics.brand_consistency_score,
                assetLibrary: metrics.asset_library_usage,
                campaignPerformance: metrics.campaign_performance,
                teamActivity: metrics.team_activity,
              });
              setIsLoading(false);
            }, 300);
          }
        }
      } catch (error) {
        console.error('Error fetching brand metrics:', error);
        setTimeout(() => {
          setProgressValues({
            brandConsistency: 87,
            assetLibrary: 92,
            campaignPerformance: 78,
            teamActivity: 85,
          });
          setIsLoading(false);
        }, 300);
      }
    };

    fetchMetrics();

    const channel = supabase
      .channel('brand-metrics-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'brand_metrics' },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'brand_consistency_score' in payload.new) {
            const newMetrics = payload.new as {
              brand_consistency_score: number;
              asset_library_usage: number;
              campaign_performance: number;
              team_activity: number;
            };
            setProgressValues({
              brandConsistency: newMetrics.brand_consistency_score,
              assetLibrary: newMetrics.asset_library_usage,
              campaignPerformance: newMetrics.campaign_performance,
              teamActivity: newMetrics.team_activity,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleChipClick = (query: string) => {
    setAiQuery(query);
    processQuery(query);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Increased vertical padding for better breathing room - Aesthetic-Usability Effect */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 max-w-7xl">
        {/* Header - Clear visual hierarchy with proper spacing */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12"
        >
          <div className="flex items-center gap-4">
            <img 
              src="/qatar-airways-logo.png" 
              alt="Qatar Airways" 
              className="h-16 sm:h-20"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Brand Hub</h1>
              <p className="text-muted-foreground text-sm">
                Digital asset management & brand guidelines
              </p>
            </div>
          </div>
          {/* Fitts's Law - Larger touch target for primary CTA */}
          <Button className="bg-primary hover:bg-primary/90 shadow-md h-11 px-6">
            <Download className="mr-2 h-4 w-4" />
            Download Kit
          </Button>
        </motion.div>

        {/* Dynamic Sections - rendered in order based on sections array */}
        <AnimatePresence mode="popLayout">
        {sections.filter(s => s.visible).map((section, idx) => {
          switch (section.id) {
            case "ai-assistant":
              return (
                <motion.div
                  key={section.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                >
                  {/* Law of Common Region - Cards create visual grouping */}
                  <Card className="mb-12 overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-muted/30">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Ask Pixify</CardTitle>
                          <CardDescription className="text-sm">
                            Find assets, explore guidelines, get answers instantly
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Quick Action Chips */}
                      <div className="flex flex-wrap gap-2">
                        {quickChips.map((chip) => (
                          <Button
                            key={chip.label}
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-full text-xs font-medium hover:bg-primary/5 hover:border-primary/30 transition-all"
                            onClick={() => handleChipClick(chip.query)}
                            disabled={aiLoading}
                          >
                            <chip.icon className="h-3.5 w-3.5 mr-1.5" />
                            {chip.label}
                          </Button>
                        ))}
                      </div>

                      {/* Search Input */}
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (aiQuery.trim()) processQuery(aiQuery);
                        }}
                        className="relative"
                      >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Ask anything about your brand..."
                          className="pl-11 pr-24 h-12 text-sm rounded-xl border-muted-foreground/20 bg-background focus-visible:ring-primary/30"
                          value={aiQuery}
                          onChange={(e) => setAiQuery(e.target.value)}
                          disabled={aiLoading}
                        />
                        <Button 
                          type="submit" 
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 rounded-lg"
                          disabled={aiLoading || !aiQuery.trim()}
                        >
                          {aiLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              Ask
                              <ArrowRight className="ml-1 h-3.5 w-3.5" />
                            </>
                          )}
                        </Button>
                      </form>

                      {/* AI Response */}
                      <AnimatePresence>
                        {aiResponse && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="rounded-xl bg-muted/50 p-4 border border-border/50">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="h-4 w-4 text-primary" />
                                  <span className="text-sm font-medium">Pixify</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={clearResponse}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                              
                              {aiResponse.message && (
                                <p className="text-sm text-muted-foreground mb-4">{aiResponse.message}</p>
                              )}

                              {/* Asset Results */}
                              {aiResponse.type === "assets" && aiResponse.assets && aiResponse.assets.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                  {aiResponse.assets.map((asset) => (
                                    <motion.div
                                      key={asset.id}
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="group relative bg-background rounded-xl border overflow-hidden"
                                    >
                                      <div className="aspect-square bg-muted flex items-center justify-center p-4">
                                        {asset.mime_type?.startsWith("image/svg") ? (
                                          <img 
                                            src={asset.storage_url} 
                                            alt={asset.name}
                                            className="w-full h-full object-contain"
                                          />
                                        ) : asset.mime_type?.startsWith("image/") ? (
                                          <img 
                                            src={asset.storage_url} 
                                            alt={asset.name}
                                            className="w-full h-full object-cover rounded"
                                          />
                                        ) : (
                                          <FileText className="h-8 w-8 text-muted-foreground" />
                                        )}
                                      </div>
                                      <div className="p-3 border-t">
                                        <p className="text-xs font-medium truncate">{asset.name}</p>
                                        <div className="flex items-center justify-between mt-2">
                                          <Badge variant="secondary" className="text-[10px]">{asset.type}</Badge>
                                          <a 
                                            href={asset.storage_url} 
                                            download={asset.name}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            <Download className="h-4 w-4 text-primary hover:text-primary/80" />
                                          </a>
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              )}

                              {/* Color Results */}
                              {aiResponse.type === "colors" && aiResponse.colors && aiResponse.colors.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                  {aiResponse.colors.map((color, idx) => (
                                    <motion.div
                                      key={idx}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: idx * 0.1 }}
                                      className="bg-background rounded-xl border overflow-hidden"
                                    >
                                      <div 
                                        className="h-16 w-full"
                                        style={{ backgroundColor: color.value }}
                                      />
                                      <div className="p-3">
                                        <p className="text-xs font-medium">{color.name}</p>
                                        <p className="text-[10px] font-mono text-muted-foreground">{color.value}</p>
                                        {color.description && (
                                          <p className="text-[10px] text-muted-foreground mt-1">{color.description}</p>
                                        )}
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              )}

                              {/* Typography Results */}
                              {aiResponse.type === "typography" && aiResponse.typography && aiResponse.typography.length > 0 && (
                                <div className="space-y-3">
                                  {aiResponse.typography.map((font, idx) => (
                                    <motion.div
                                      key={idx}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: idx * 0.1 }}
                                      className="bg-background rounded-xl border p-4"
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <Badge variant="outline" className="text-xs">{font.name}</Badge>
                                      </div>
                                      <p className="text-lg font-medium" style={{ fontFamily: font.value }}>
                                        {font.value}
                                      </p>
                                      <p className="text-sm text-muted-foreground" style={{ fontFamily: font.value }}>
                                        Aa Bb Cc Dd Ee 123
                                      </p>
                                    </motion.div>
                                  ))}
                                </div>
                              )}

                              {/* Brand Strategy Response */}
                              {aiResponse.type === "brand" && aiResponse.brand && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="bg-background rounded-xl border p-4 space-y-3"
                                >
                                  <div className="grid grid-cols-2 gap-4">
                                    {aiResponse.brand.archetype && (
                                      <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Archetype</p>
                                        <p className="text-sm font-medium">{aiResponse.brand.archetype}</p>
                                      </div>
                                    )}
                                    {aiResponse.brand.tone && (
                                      <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Tone</p>
                                        <p className="text-sm">{aiResponse.brand.tone}</p>
                                      </div>
                                    )}
                                  </div>
                                  {aiResponse.brand.values && aiResponse.brand.values.length > 0 && (
                                    <div>
                                      <p className="text-xs font-medium text-muted-foreground mb-2">Values</p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {aiResponse.brand.values.map((value, valueIdx) => (
                                          <Badge key={valueIdx} variant="secondary" className="text-xs">
                                            {value}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              );

            case "metrics":
              return (
                <motion.div
                  key={section.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12"
                >
                  {[
                    { label: "Brand Consistency", value: progressValues.brandConsistency, icon: Target, color: "text-primary" },
                    { label: "Asset Usage", value: progressValues.assetLibrary, icon: FolderOpen, color: "text-primary" },
                    { label: "Campaign Score", value: progressValues.campaignPerformance, icon: TrendingUp, color: "text-primary" },
                    { label: "Team Activity", value: progressValues.teamActivity, icon: Users, color: "text-primary" },
                  ].map((metric, metricIdx) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + metricIdx * 0.1 }}
                    >
                      {/* Fitts's Law - Adequate card padding for touch targets */}
                      <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="pt-6 pb-5 px-5">
                          <div className="flex items-center justify-between mb-4">
                            <metric.icon className={`h-5 w-5 ${metric.color}`} />
                            <Badge variant="outline" className="text-[10px] h-5">Live</Badge>
                          </div>
                          <div className="text-3xl font-bold mb-2 tracking-tight">
                            {metric.value}<span className="text-base text-muted-foreground">%</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{metric.label}</p>
                          <Progress value={metric.value} className="h-1.5" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              );

            case "quick-actions":
              return (
                <motion.div
                  key={section.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="mb-12"
                >
                  {/* Visual Hierarchy - Consistent section headers */}
                  <h2 className="text-lg font-semibold mb-5 tracking-tight">Quick Actions</h2>
                  {/* Miller's Law - 5 items is optimal for cognitive load */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                      { title: "Brand Health", icon: Activity, href: "/brand-health" },
                      { title: "Playbook", icon: FileStack, href: "/playbook" },
                      { title: "Guidelines", icon: FileText, href: "/guideline" },
                      { title: "Asset Library", icon: FolderOpen, href: "/library" },
                      { title: "Generate", icon: Sparkles, href: "/generate" },
                    ].map((action) => (
                      <Link key={action.title} to={action.href}>
                        {/* Fitts's Law - Larger touch targets with adequate padding */}
                        <Card className="h-full border-0 shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group">
                          <CardContent className="flex items-center gap-4 p-5">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <action.icon className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-sm font-medium">{action.title}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              );

            case "brand-overview":
              return (
                <motion.div
                  key={section.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                >
                  {/* Visual Hierarchy - Consistent section headers */}
                  <h2 className="text-lg font-semibold mb-5 tracking-tight">Brand Overview</h2>
                  {/* Law of Proximity - Proper gap between related cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Strategy Card */}
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Heart className="h-4 w-4 text-primary" />
                          Strategy
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Archetype</p>
                          <p className="text-sm font-medium">Caregiver / Explorer</p>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-xs text-muted-foreground">Tone</p>
                          <p className="text-sm font-medium">Warm, Premium, Trustworthy</p>
                        </div>
                        <Separator />
                        <div className="flex flex-wrap gap-1.5">
                          {["Excellence", "Innovation", "Care"].map((value) => (
                            <Badge key={value} variant="secondary" className="text-xs">{value}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Colors Card */}
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Palette className="h-4 w-4 text-primary" />
                          Colors
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          {[
                            { color: "#5C0A3A", name: "Maroon" },
                            { color: "#CBB59C", name: "Sand" },
                            { color: "#0F1020", name: "Night" },
                          ].map((c) => (
                            <div key={c.name} className="flex-1 text-center">
                              <div 
                                className="h-12 rounded-lg shadow-inner mb-2"
                                style={{ backgroundColor: c.color }}
                              />
                              <p className="text-xs font-mono text-muted-foreground">{c.name}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Activity Card */}
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          { text: "Logo uploaded", time: "2h ago", active: true },
                          { text: "Guideline updated", time: "1d ago", active: false },
                          { text: "Playbook generated", time: "3d ago", active: false },
                        ].map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center gap-3">
                            <div className={`h-2 w-2 rounded-full ${item.active ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                            <div className="flex-1">
                              <p className="text-sm">{item.text}</p>
                              <p className="text-xs text-muted-foreground">{item.time}</p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              );

            default:
              return null;
          }
        })}
        </AnimatePresence>

        {/* Customize View Floating Button */}
        <CustomizeView sections={sections} defaultSections={defaultSections} onSectionsChange={setSections} />
      </div>
    </div>
  );
};

export default Dashboard;
