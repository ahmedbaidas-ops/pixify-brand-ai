import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Users,
  MessageSquare,
  Shield,
  Clock,
  Eye,
  Download
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { exportBrandHealthPDF } from "@/utils/exportBrandHealthPDF";
import { useToast } from "@/hooks/use-toast";

// Mock data - In production, this would come from Qatar Airways Instagram API and website analytics
const brandHealthData = {
  overallScore: 82,
  trend: "+4",
  lastUpdated: "2 hours ago",
  categories: [
    {
      id: "visual",
      name: "Visual Consistency",
      score: 83,
      weight: 25,
      trend: "+2",
      icon: Eye,
      color: "hsl(var(--primary))",
      metrics: [
        { label: "Asset Compliance Rate", value: "87%", status: "good" },
        { label: "Design System Usage", value: "85%", status: "good" },
        { label: "Color Accuracy Index", value: "78%", status: "warning" }
      ]
    },
    {
      id: "voice",
      name: "Voice & Messaging",
      score: 76,
      weight: 15,
      trend: "-6",
      icon: MessageSquare,
      color: "hsl(280 70% 55%)",
      metrics: [
        { label: "Tone Match Accuracy", value: "80%", status: "good" },
        { label: "Message Alignment", value: "72%", status: "warning" }
      ]
    },
    {
      id: "adoption",
      name: "System Adoption",
      score: 88,
      weight: 20,
      trend: "+8",
      icon: Users,
      color: "hsl(260 70% 60%)",
      metrics: [
        { label: "Active User Rate", value: "92%", status: "excellent" },
        { label: "Guideline Reference", value: "85%", status: "good" },
        { label: "Version Control", value: "87%", status: "good" }
      ]
    },
    {
      id: "engagement",
      name: "Brand Engagement",
      score: 70,
      weight: 15,
      trend: "-3",
      icon: BarChart3,
      color: "hsl(240 70% 65%)",
      metrics: [
        { label: "Engagement Consistency", value: "68%", status: "warning" },
        { label: "Asset Reuse Rate", value: "72%", status: "warning" }
      ]
    },
    {
      id: "responsiveness",
      name: "Operational Speed",
      score: 82,
      weight: 10,
      trend: "+5",
      icon: Clock,
      color: "hsl(220 70% 60%)",
      metrics: [
        { label: "Update Implementation", value: "24h avg", status: "good" },
        { label: "Error Correction", value: "6h avg", status: "excellent" }
      ]
    },
    {
      id: "governance",
      name: "Brand Governance",
      score: 90,
      weight: 15,
      trend: "+3",
      icon: Shield,
      color: "hsl(200 70% 55%)",
      metrics: [
        { label: "Permission Compliance", value: "94%", status: "excellent" },
        { label: "Documentation Complete", value: "88%", status: "good" },
        { label: "Audit Trail Coverage", value: "89%", status: "good" }
      ]
    }
  ],
  insights: [
    {
      type: "warning",
      message: "Your tone consistency dropped 6% this month — check content uploaded by Marketing Team.",
      action: "Review recent uploads"
    },
    {
      type: "success",
      message: "System adoption increased significantly! 92% of users are now actively using the DAM.",
      action: "View adoption report"
    },
    {
      type: "info",
      message: "Brand engagement on Instagram shows 68% consistency with guidelines.",
      action: "Run AI audit"
    }
  ]
};

const getTierInfo = (score: number) => {
  if (score >= 90) return { tier: "Excellent", color: "hsl(142 71% 45%)", icon: CheckCircle2 };
  if (score >= 75) return { tier: "Strong", color: "hsl(47 96% 53%)", icon: CheckCircle2 };
  if (score >= 60) return { tier: "Needs Attention", color: "hsl(25 95% 53%)", icon: AlertCircle };
  return { tier: "Critical", color: "hsl(0 84% 60%)", icon: AlertCircle };
};

const BrandHealth = () => {
  const tierInfo = getTierInfo(brandHealthData.overallScore);
  const TierIcon = tierInfo.icon;
  const { toast } = useToast();

  const handleExportPDF = async () => {
    try {
      toast({
        title: "Generating PDF...",
        description: "Your report is being created",
      });
      await exportBrandHealthPDF(brandHealthData);
      toast({
        title: "Success!",
        description: "Brand Health report downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not generate PDF report",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Breadcrumb */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Brand Health</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button 
            onClick={handleExportPDF}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export PDF Report
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-5xl font-bold text-foreground">Brand Health Score</h1>
            <Badge variant="secondary" className="text-sm">
              Updated {brandHealthData.lastUpdated}
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            Real-time analysis of visual, verbal, and operational brand consistency
          </p>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-8 border-2 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
          <CardContent className="p-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Score Circle */}
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="hsl(var(--muted))"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="url(#scoreGradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(brandHealthData.overallScore / 100) * 553} 553`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-foreground">
                      {brandHealthData.overallScore}
                    </span>
                    <span className="text-sm text-muted-foreground">out of 100</span>
                  </div>
                </div>
              </div>

              {/* Tier Info */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <TierIcon className="w-8 h-8" style={{ color: tierInfo.color }} />
                  <h2 className="text-3xl font-bold" style={{ color: tierInfo.color }}>
                    {tierInfo.tier}
                  </h2>
                </div>
                <p className="text-muted-foreground text-lg mb-4">
                  Fully consistent and scalable brand system
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {brandHealthData.trend} vs last month
                  </Badge>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                {brandHealthData.categories.slice(0, 3).map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <cat.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{cat.score}</span>
                      {parseInt(cat.trend) > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-orange-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {brandHealthData.insights.map((insight, idx) => (
            <Card 
              key={idx} 
              className={`border-l-4 ${
                insight.type === 'success' ? 'border-l-green-500' :
                insight.type === 'warning' ? 'border-l-orange-500' :
                'border-l-blue-500'
              }`}
            >
              <CardHeader className="pb-3">
                <CardDescription className="text-sm">{insight.message}</CardDescription>
              </CardHeader>
              <CardContent>
                <button className="text-sm text-primary hover:underline font-medium">
                  {insight.action} →
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandHealthData.categories.map((category, idx) => {
            const CategoryIcon = category.icon;
            return (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${category.color}20` }}>
                      <CategoryIcon className="w-5 h-5" style={{ color: category.color }} />
                    </div>
                    <Badge variant={parseInt(category.trend) > 0 ? "default" : "secondary"}>
                      {category.trend}%
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>Weight: {category.weight}%</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Score Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold">{category.score}</span>
                      <span className="text-xs text-muted-foreground">/ 100</span>
                    </div>
                    <Progress value={category.score} className="h-2" />
                  </div>

                  {/* Metrics */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    {category.metrics.map((metric, mIdx) => (
                      <div key={mIdx} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{metric.label}</span>
                        <span className={`font-medium ${
                          metric.status === 'excellent' ? 'text-green-500' :
                          metric.status === 'good' ? 'text-blue-500' :
                          'text-orange-500'
                        }`}>
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Data Source Note */}
        <Card className="mt-8 bg-muted/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Data Sources</h3>
                <p className="text-sm text-muted-foreground">
                  Brand Health metrics are calculated from Qatar Airways official Instagram account analytics, 
                  website performance data, and internal DAM system usage. Data refreshes every 2 hours.
                  Connect additional social channels for more comprehensive analysis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandHealth;
