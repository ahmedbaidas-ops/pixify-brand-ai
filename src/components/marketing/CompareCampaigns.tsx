import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MarketingCampaign } from "@/data/marketing";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, DollarSign, Calendar, Target, Sparkles } from "lucide-react";

interface CompareCampaignsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaigns: MarketingCampaign[];
}

export const CompareCampaigns = ({ open, onOpenChange, campaigns }: CompareCampaignsProps) => {
  if (campaigns.length < 2) return null;

  const metrics = [
    { key: "totalScore", label: "Brand Alignment", icon: Sparkles },
    { key: "toneScore", label: "Tone Consistency", icon: Target },
    { key: "visualScore", label: "Visual Compliance", icon: Target },
    { key: "seoScore", label: "SEO Optimization", icon: Target },
    { key: "marketScore", label: "Market Score", icon: TrendingUp },
    { key: "successRate", label: "Success Rate", icon: TrendingUp },
  ];

  const getMaxValue = (key: keyof MarketingCampaign) => {
    return Math.max(...campaigns.map(c => (c[key] as number) || 0));
  };

  const getDiffIndicator = (value: number, max: number) => {
    if (value === max) return { icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" };
    if (value >= max - 5) return { icon: Minus, color: "text-yellow-500", bg: "bg-yellow-500/10" };
    return { icon: TrendingDown, color: "text-red-500", bg: "bg-red-500/10" };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Campaign Performance Comparison</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Side-by-side analysis of {campaigns.length} selected campaigns
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Campaign Headers */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${campaigns.length}, 1fr)` }}>
            {campaigns.map((campaign, idx) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <h3 className="font-semibold text-lg mb-2">{campaign.name}</h3>
                <Badge variant={campaign.status === "Active" ? "default" : "outline"} className="mb-2">
                  {campaign.status}
                </Badge>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(campaign.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    ${(campaign.budget / 1000).toFixed(0)}K
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {campaign.pillar}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Performance Metrics
            </h4>
            
            {metrics.map((metric) => {
              const maxValue = getMaxValue(metric.key as keyof MarketingCampaign);
              
              return (
                <div key={metric.key} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <metric.icon className="h-4 w-4 text-muted-foreground" />
                    {metric.label}
                  </div>
                  
                  <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${campaigns.length}, 1fr)` }}>
                    {campaigns.map((campaign) => {
                      const value = (campaign[metric.key as keyof MarketingCampaign] as number) || 0;
                      const diff = getDiffIndicator(value, maxValue);
                      
                      return (
                        <motion.div
                          key={`${campaign.id}-${metric.key}`}
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`rounded-lg border border-border p-3 ${diff.bg}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl font-bold">{value}%</span>
                            <diff.icon className={`h-5 w-5 ${diff.color}`} />
                          </div>
                          <Progress value={value} className="h-2" />
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Channels Comparison */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Distribution Channels
            </h4>
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${campaigns.length}, 1fr)` }}>
              {campaigns.map((campaign) => (
                <div key={`${campaign.id}-channels`} className="rounded-lg border border-border p-3">
                  <div className="flex flex-wrap gap-1.5">
                    {campaign.channels.map((channel) => (
                      <Badge key={channel} variant="secondary" className="text-xs">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Benchmark Comparison */}
          {campaigns.some(c => c.marketScore) && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Market Benchmark
              </h4>
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${campaigns.length}, 1fr)` }}>
                {campaigns.map((campaign) => (
                  <div key={`${campaign.id}-market`} className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
                    <div className="text-xs text-muted-foreground">Closest Competitor</div>
                    <div className="font-semibold">{campaign.closestCompetitor || "—"}</div>
                    {campaign.similarityReasons && campaign.similarityReasons.length > 0 && (
                      <ul className="space-y-1">
                        {campaign.similarityReasons.map((reason, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                            <span className="text-primary">•</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Budget Comparison */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Budget Analysis
            </h4>
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${campaigns.length}, 1fr)` }}>
              {campaigns.map((campaign) => {
                const maxBudget = Math.max(...campaigns.map(c => c.budget));
                const isHighest = campaign.budget === maxBudget;
                
                return (
                  <div key={`${campaign.id}-budget`} className={`rounded-lg border border-border p-4 ${isHighest ? 'bg-primary/5' : 'bg-card'}`}>
                    <div className="text-xs text-muted-foreground mb-1">Total Budget</div>
                    <div className="text-2xl font-bold mb-2">
                      ${(campaign.budget / 1000).toFixed(0)}K
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(campaign.budget / maxBudget) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
