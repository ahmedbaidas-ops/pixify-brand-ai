import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { campaigns, personas, contentPillars } from "@/data/marketing";
import { Sparkles, Calendar, DollarSign, Target, TrendingUp, Edit } from "lucide-react";
import { motion } from "framer-motion";

const CampaignsView = () => {
  const getPersonaName = (id: string) => {
    return personas.find(p => p.id === id)?.name || "Unknown";
  };

  const getPillarColor = (name: string) => {
    return contentPillars.find(p => p.name === name)?.color || "#5C0A3A";
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Campaign Management</h2>
          <p className="text-muted-foreground">AI-powered campaign planning and brand alignment</p>
        </div>
        <Button className="gap-2 bg-gradient-primary">
          <Sparkles className="h-4 w-4" />
          Generate Campaign Brief
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {campaigns.map((campaign, index) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
          >
            <Card 
              className="overflow-hidden transition-all duration-300 hover:shadow-xl"
              style={{
                borderLeftWidth: "4px",
                borderLeftColor: getPillarColor(campaign.pillar)
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-2xl">{campaign.name}</CardTitle>
                      <Badge 
                        variant={campaign.status === "Active" ? "default" : campaign.status === "Completed" ? "secondary" : "outline"}
                        className="animate-pulse"
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">{campaign.goal}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Campaign Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                      <div className="text-sm font-medium">
                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Budget</div>
                      <div className="text-sm font-medium">${(campaign.budget / 1000).toFixed(0)}K</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Audience</div>
                      <div className="text-sm font-medium">{getPersonaName(campaign.audienceId)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Pillar</div>
                      <div className="text-sm font-medium">{campaign.pillar}</div>
                    </div>
                  </div>
                </div>

                {/* Campaign Copy */}
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <h4 className="font-semibold text-sm mb-2">Campaign Copy</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{campaign.copy}</p>
                </div>

                {/* Headlines */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Suggested Headlines</h4>
                  <div className="flex flex-wrap gap-2">
                    {campaign.headlines.map(headline => (
                      <Badge key={headline} variant="outline" className="text-xs py-1.5">
                        {headline}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Brand Alignment Scores */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Brand Alignment Score: {campaign.totalScore}%</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tone Consistency</span>
                      <span className="font-medium">{campaign.toneScore}%</span>
                    </div>
                    <Progress value={campaign.toneScore} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Visual Compliance</span>
                      <span className="font-medium">{campaign.visualScore}%</span>
                    </div>
                    <Progress value={campaign.visualScore} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">SEO Optimization</span>
                      <span className="font-medium">{campaign.seoScore}%</span>
                    </div>
                    <Progress value={campaign.seoScore} className="h-2" />
                  </div>
                </div>

                {/* Channels */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Distribution Channels</h4>
                  <div className="flex flex-wrap gap-2">
                    {campaign.channels.map(channel => (
                      <Badge key={channel} variant="secondary">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CampaignsView;
