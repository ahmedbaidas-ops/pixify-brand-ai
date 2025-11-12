import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import MarketingOverview from "@/components/marketing/MarketingOverview";
import PersonasView from "@/components/marketing/PersonasView";
import CampaignsView from "@/components/marketing/CampaignsView";
import BudgetPlanner from "@/components/marketing/BudgetPlanner";
import SEOInsights from "@/components/marketing/SEOInsights";
import ContentPillarsView from "@/components/marketing/ContentPillarsView";

const Marketing = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Marketing Intelligence Suite</h1>
              <p className="text-lg text-muted-foreground">
                AI-powered marketing strategy, campaign planning, and brand alignment
              </p>
            </div>
            <Button
              onClick={() => navigate("/marketing/optimizer")}
              className="gap-2"
              size="lg"
            >
              <Zap className="h-5 w-5" />
              Platform Optimizer
            </Button>
          </div>
        </div>
      </div>

      <div className="p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="personas">Personas</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="seo">SEO Insights</TabsTrigger>
            <TabsTrigger value="pillars">Content Pillars</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <MarketingOverview />
          </TabsContent>

          <TabsContent value="personas" className="mt-0">
            <PersonasView />
          </TabsContent>

          <TabsContent value="campaigns" className="mt-0">
            <CampaignsView />
          </TabsContent>

          <TabsContent value="budget" className="mt-0">
            <BudgetPlanner />
          </TabsContent>

          <TabsContent value="seo" className="mt-0">
            <SEOInsights />
          </TabsContent>

          <TabsContent value="pillars" className="mt-0">
            <ContentPillarsView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Marketing;
