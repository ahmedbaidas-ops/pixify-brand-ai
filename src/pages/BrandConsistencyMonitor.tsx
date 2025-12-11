import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Palette,
  Type,
  Image,
  Sparkles,
  RefreshCw,
  Filter,
  ChevronRight,
  Zap,
  Clock,
  BarChart3,
  FileWarning,
  Lightbulb
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Mock data for compliance scores
const overallScore = 87;
const scoreHistory = [
  { date: "Nov 1", score: 82 },
  { date: "Nov 8", score: 85 },
  { date: "Nov 15", score: 84 },
  { date: "Nov 22", score: 86 },
  { date: "Nov 29", score: 87 },
  { date: "Dec 6", score: 87 },
];

const categoryScores = [
  { 
    name: "Color Compliance", 
    score: 92, 
    icon: Palette, 
    trend: "up",
    issues: 3,
    description: "Brand color usage across assets"
  },
  { 
    name: "Typography", 
    score: 88, 
    icon: Type, 
    trend: "up",
    issues: 5,
    description: "Font families and sizing"
  },
  { 
    name: "Logo Usage", 
    score: 85, 
    icon: Image, 
    trend: "down",
    issues: 7,
    description: "Logo placement and clear space"
  },
  { 
    name: "Visual Style", 
    score: 83, 
    icon: Eye, 
    trend: "stable",
    issues: 9,
    description: "Overall brand aesthetic"
  },
];

const deviationAlerts = [
  {
    id: 1,
    severity: "high",
    asset: "Summer Campaign Banner",
    type: "Color Deviation",
    description: "Uses #6B1E4A instead of brand maroon #5C0A3A",
    detectedAt: "2 hours ago",
    category: "color",
    autoFixAvailable: true,
  },
  {
    id: 2,
    severity: "medium",
    asset: "Instagram Story Template",
    type: "Typography Issue",
    description: "Headline uses Arial instead of Cormorant Garamond",
    detectedAt: "5 hours ago",
    category: "typography",
    autoFixAvailable: true,
  },
  {
    id: 3,
    severity: "high",
    asset: "Email Header",
    type: "Logo Violation",
    description: "Logo placed too close to edge, violating clear space rules",
    detectedAt: "1 day ago",
    category: "logo",
    autoFixAvailable: false,
  },
  {
    id: 4,
    severity: "low",
    asset: "Product Card A",
    type: "Color Deviation",
    description: "Secondary color saturation off by 8%",
    detectedAt: "2 days ago",
    category: "color",
    autoFixAvailable: true,
  },
  {
    id: 5,
    severity: "medium",
    asset: "LinkedIn Post",
    type: "Visual Style",
    description: "Gradient direction inconsistent with brand guidelines",
    detectedAt: "3 days ago",
    category: "style",
    autoFixAvailable: true,
  },
];

const recentScans = [
  { name: "Q4 Campaign Assets", count: 24, compliant: 21, date: "Today" },
  { name: "Social Media Templates", count: 18, compliant: 16, date: "Yesterday" },
  { name: "Email Marketing Kit", count: 12, compliant: 10, date: "3 days ago" },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high": return "bg-destructive/10 text-destructive border-destructive/20";
    case "medium": return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    case "low": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    default: return "bg-muted text-muted-foreground";
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "high": return XCircle;
    case "medium": return AlertTriangle;
    case "low": return FileWarning;
    default: return CheckCircle;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-emerald-500";
  if (score >= 75) return "text-amber-500";
  return "text-destructive";
};

const getScoreBg = (score: number) => {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 75) return "bg-amber-500";
  return "bg-destructive";
};

export default function BrandConsistencyMonitor() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isScanning, setIsScanning] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);
  const { toast } = useToast();

  const handleScan = () => {
    setIsScanning(true);
    toast({
      title: "Scanning Assets",
      description: "Analyzing brand consistency across all assets...",
    });
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "Scan Complete",
        description: "Found 24 assets with 5 new deviations.",
      });
    }, 3000);
  };

  const handleAutoFix = (alertId: number) => {
    toast({
      title: "AI Fix Applied",
      description: "The deviation has been automatically corrected.",
    });
  };

  const handleGetSuggestion = (alertId: number) => {
    setSelectedAlert(alertId);
    toast({
      title: "Generating AI Suggestion",
      description: "Analyzing the best way to fix this deviation...",
    });
  };

  const filteredAlerts = selectedFilter === "all" 
    ? deviationAlerts 
    : deviationAlerts.filter(a => a.severity === selectedFilter);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-[57px] z-10">
        <div className="px-6 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Brand Consistency Monitor</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Brand Consistency Monitor</h1>
              <p className="text-muted-foreground mt-1">
                Track visual consistency and compliance across all brand assets
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                onClick={handleScan}
                disabled={isScanning}
                className="bg-primary hover:bg-primary/90"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Run Scan
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overall Score Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-muted/30"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      className={getScoreColor(overallScore)}
                      strokeDasharray={440}
                      initial={{ strokeDashoffset: 440 }}
                      animate={{ strokeDashoffset: 440 - (440 * overallScore) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span 
                      className={cn("text-4xl font-bold", getScoreColor(overallScore))}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {overallScore}%
                    </motion.span>
                    <span className="text-sm text-muted-foreground">Compliance</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2% vs last week
                  </Badge>
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  Your brand consistency is <span className="font-medium text-foreground">Strong</span>.
                  Address 5 high-priority issues to reach 90%+.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Compliance by Category</CardTitle>
              <CardDescription>Breakdown of brand consistency scores</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="grid grid-cols-2 gap-4">
                {categoryScores.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-border transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          category.score >= 90 ? "bg-emerald-500/10" : category.score >= 80 ? "bg-amber-500/10" : "bg-destructive/10"
                        )}>
                          <category.icon className={cn(
                            "h-5 w-5",
                            category.score >= 90 ? "text-emerald-500" : category.score >= 80 ? "text-amber-500" : "text-destructive"
                          )} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{category.name}</p>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn("text-lg font-bold", getScoreColor(category.score))}>
                          {category.score}%
                        </span>
                        <div className="flex items-center gap-1 text-xs mt-0.5">
                          {category.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 text-emerald-500" />
                          ) : category.trend === "down" ? (
                            <TrendingDown className="h-3 w-3 text-destructive" />
                          ) : null}
                          <span className="text-muted-foreground">{category.issues} issues</span>
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={category.score} 
                      className="h-1.5 mt-3"
                    />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deviation Alerts & AI Suggestions */}
        <Tabs defaultValue="alerts" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="alerts" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Deviation Alerts
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {deviationAlerts.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="gap-2">
                <Sparkles className="h-4 w-4" />
                AI Suggestions
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Scan History
              </TabsTrigger>
            </TabsList>

            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="alerts" className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredAlerts.map((alert, index) => {
                const SeverityIcon = getSeverityIcon(alert.severity);
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "p-2 rounded-lg border",
                              getSeverityColor(alert.severity)
                            )}>
                              <SeverityIcon className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{alert.asset}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {alert.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {alert.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                Detected {alert.detectedAt}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleGetSuggestion(alert.id)}
                              className="gap-1"
                            >
                              <Lightbulb className="h-4 w-4" />
                              Get AI Fix
                            </Button>
                            {alert.autoFixAvailable && (
                              <Button
                                size="sm"
                                onClick={() => handleAutoFix(alert.id)}
                                className="gap-1 bg-primary hover:bg-primary/90"
                              >
                                <Sparkles className="h-4 w-4" />
                                Auto-Fix
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredAlerts.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-emerald-500 mb-4" />
                  <h3 className="font-medium text-lg">No deviations found</h3>
                  <p className="text-muted-foreground mt-1">
                    All assets are compliant with brand guidelines.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI-Powered Recommendations
                </CardTitle>
                <CardDescription>
                  Intelligent suggestions to improve brand consistency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Standardize Color Palette",
                    description: "3 assets use off-brand maroon (#6B1E4A). Replace with brand maroon #5C0A3A for consistency.",
                    impact: "High Impact",
                    effort: "Low Effort",
                  },
                  {
                    title: "Update Typography System",
                    description: "5 assets still use Arial. Migrate to Cormorant Garamond for headlines and Inter for body.",
                    impact: "Medium Impact",
                    effort: "Medium Effort",
                  },
                  {
                    title: "Fix Logo Clear Space",
                    description: "7 assets violate the Q-height clear space rule. Adjust padding around logos.",
                    impact: "High Impact",
                    effort: "Low Effort",
                  },
                ].map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium group-hover:text-primary transition-colors">
                          {suggestion.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {suggestion.description}
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                          <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0">
                            {suggestion.impact}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {suggestion.effort}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentScans.map((scan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-sm">{scan.name}</h4>
                        <span className="text-xs text-muted-foreground">{scan.date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">
                          {Math.round((scan.compliant / scan.count) * 100)}%
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <span className="text-emerald-500 font-medium">{scan.compliant}</span>
                          /{scan.count} compliant
                        </div>
                      </div>
                      <Progress 
                        value={(scan.compliant / scan.count) * 100} 
                        className="h-1.5 mt-3"
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Score Trend Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compliance Trend</CardTitle>
                <CardDescription>30-day consistency score history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end justify-between gap-2 px-4">
                  {scoreHistory.map((point, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1">
                      <motion.div 
                        className={cn("w-full rounded-t-lg", getScoreBg(point.score))}
                        initial={{ height: 0 }}
                        animate={{ height: `${(point.score / 100) * 150}px` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      />
                      <span className="text-xs text-muted-foreground">{point.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Assets Scanned", value: "248", icon: Image, trend: "+12 this week" },
            { label: "Issues Resolved", value: "45", icon: CheckCircle, trend: "+8 this week" },
            { label: "Auto-Fixes Applied", value: "23", icon: Sparkles, trend: "AI-powered" },
            { label: "Avg. Resolution Time", value: "2.4h", icon: Clock, trend: "-30% faster" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-xs text-primary mt-0.5">{stat.trend}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
