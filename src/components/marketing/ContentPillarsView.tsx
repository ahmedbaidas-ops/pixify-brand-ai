import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { contentPillars, campaigns } from "@/data/marketing";
import { Sparkles, Target } from "lucide-react";
import { motion } from "framer-motion";

const ContentPillarsView = () => {
  const getPillarCampaigns = (pillarName: string) => {
    return campaigns.filter(c => c.pillar === pillarName);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Pillars</h2>
          <p className="text-muted-foreground">Strategic themes guiding all marketing communications</p>
        </div>
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Generate New Pillar
        </Button>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contentPillars.map((pillar, index) => {
          const pillarCampaigns = getPillarCampaigns(pillar.name);
          const activeCampaigns = pillarCampaigns.filter(c => c.status === "Active");

          return (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card 
                className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer"
                style={{
                  borderTopWidth: "4px",
                  borderTopColor: pillar.color
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                      style={{ backgroundColor: `${pillar.color}20`, borderColor: pillar.color, borderWidth: "2px" }}
                    >
                      {pillar.icon}
                    </div>
                    <Badge variant={activeCampaigns.length > 0 ? "default" : "secondary"}>
                      {activeCampaigns.length} Active
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-2xl mb-2">{pillar.name}</CardTitle>
                  <CardDescription className="text-base">{pillar.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Keywords */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Target Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {pillar.keywords.map(keyword => (
                        <motion.div
                          key={keyword}
                          whileHover={{ scale: 1.05 }}
                          className="inline-block"
                        >
                          <Badge 
                            variant="outline" 
                            className="text-xs cursor-pointer hover:bg-primary/10"
                            style={{ borderColor: pillar.color }}
                          >
                            {keyword}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Related Campaigns */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Related Campaigns ({pillarCampaigns.length})
                    </h4>
                    {pillarCampaigns.length > 0 ? (
                      <div className="space-y-2">
                        {pillarCampaigns.map(campaign => (
                          <div 
                            key={campaign.id}
                            className="p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-sm mb-1">{campaign.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  Brand Alignment: {campaign.totalScore}%
                                </div>
                              </div>
                              <Badge 
                                variant={campaign.status === "Active" ? "default" : "secondary"}
                                className="ml-2"
                              >
                                {campaign.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No campaigns assigned yet
                      </div>
                    )}
                  </div>

                  {/* Performance Indicator */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Content Performance</span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="h-8 w-1.5 rounded-full transition-all"
                              style={{
                                backgroundColor: i < pillarCampaigns.length ? pillar.color : "hsl(var(--muted))",
                                height: `${20 + (i + 1) * 6}px`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* AI Content Suggestion */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Content Pillar Insights
          </CardTitle>
          <CardDescription>Strategic recommendations based on brand analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="font-medium text-sm mb-1">Premium Experience is your strongest pillar</div>
            <div className="text-xs text-muted-foreground">
              92% avg brand alignment across campaigns. Continue showcasing Qsuite and premium services.
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="font-medium text-sm mb-1">Innovation & Future needs more content</div>
            <div className="text-xs text-muted-foreground">
              Only 1 active campaign. Expand sustainability and tech stories to balance portfolio.
            </div>
          </div>

          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="font-medium text-sm mb-1">Culture & Connection resonates with audiences</div>
            <div className="text-xs text-muted-foreground">
              Highest engagement rate (4.8%). Create more destination stories and cultural narratives.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentPillarsView;
