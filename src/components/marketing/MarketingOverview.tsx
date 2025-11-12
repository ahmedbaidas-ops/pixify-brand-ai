import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { campaigns, contentPillars, budgetData } from "@/data/marketing";
import { TrendingUp, Target, DollarSign, Users, BarChart3, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const MarketingOverview = () => {
  const activeCampaigns = campaigns.filter(c => c.status === "Active").length;
  const avgScore = Math.round(campaigns.reduce((acc, c) => acc + c.totalScore, 0) / campaigns.length);
  const budgetUtilization = Math.round((budgetData.allocated / budgetData.total) * 100);

  const stats = [
    {
      label: "Active Campaigns",
      value: activeCampaigns,
      change: "+2 this month",
      icon: Target,
      color: "text-primary"
    },
    {
      label: "Avg Brand Alignment",
      value: `${avgScore}%`,
      change: "+4% vs last quarter",
      icon: CheckCircle2,
      color: "text-green-500"
    },
    {
      label: "Budget Utilized",
      value: `${budgetUtilization}%`,
      change: `$${(budgetData.allocated / 1000).toFixed(0)}K allocated`,
      icon: DollarSign,
      color: "text-blue-500"
    },
    {
      label: "Audience Personas",
      value: "3",
      change: "Ready for targeting",
      icon: Users,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.change}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Campaign Brand Alignment Scores
          </CardTitle>
          <CardDescription>
            How well each campaign aligns with Qatar Airways brand guidelines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{campaign.name}</span>
                    <Badge variant={campaign.status === "Active" ? "default" : "secondary"}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Tone: {campaign.toneScore}%</span>
                    <span>Visual: {campaign.visualScore}%</span>
                    <span>SEO: {campaign.seoScore}%</span>
                  </div>
                </div>
                <span className="text-2xl font-bold ml-4">{campaign.totalScore}%</span>
              </div>
              <Progress value={campaign.totalScore} className="h-2" />
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Content Pillars Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Content Pillar Distribution</CardTitle>
          <CardDescription>Campaign alignment with strategic content themes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {contentPillars.map((pillar, index) => {
              const pillarCampaigns = campaigns.filter(c => c.pillar === pillar.name).length;
              return (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all cursor-pointer"
                  style={{ borderLeftColor: pillar.color, borderLeftWidth: "4px" }}
                >
                  <div className="text-3xl mb-2">{pillar.icon}</div>
                  <div className="font-semibold mb-1">{pillar.name}</div>
                  <div className="text-2xl font-bold text-primary mb-1">{pillarCampaigns}</div>
                  <div className="text-xs text-muted-foreground">campaigns</div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingOverview;
