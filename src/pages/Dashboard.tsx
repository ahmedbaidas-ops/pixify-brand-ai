import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileText, FolderOpen, Sparkles, Download, ArrowRight, FileStack, Activity, TrendingUp, Users, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [progressValues, setProgressValues] = useState({
    brandConsistency: 0,
    assetLibrary: 0,
    campaignPerformance: 0,
    teamActivity: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch brand metrics from database
    const fetchMetrics = async () => {
      try {
        // First get the Qatar Airways brand
        const { data: brands, error: brandsError } = await supabase
          .from('brands')
          .select('id')
          .eq('name', 'Qatar Airways')
          .single();

        if (brandsError) throw brandsError;

        if (brands) {
          // Fetch metrics for this brand
          const { data: metrics, error: metricsError } = await supabase
            .from('brand_metrics')
            .select('*')
            .eq('brand_id', brands.id)
            .single();

          if (metricsError) throw metricsError;

          if (metrics) {
            // Animate to the actual values
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
        // Fallback to default values
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

    // Set up real-time subscription
    const channel = supabase
      .channel('brand-metrics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'brand_metrics'
        },
        (payload) => {
          console.log('Brand metrics updated:', payload);
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
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-6">
            <div>
              <img 
                src="/qatar-airways-logo.png" 
                alt="Qatar Airways" 
                className="h-16 mb-3"
              />
              <p className="text-xl text-muted-foreground">
                Premium airline brand guidelines & digital asset management
              </p>
            </div>
            <Button size="lg" className="bg-gradient-primary hover:opacity-90">
              <Download className="mr-2 h-5 w-5" />
              Download Brand Kit
            </Button>
          </div>

          {/* AI Prompt Card */}
          <Card className="shadow-lg border-2 border-primary/10 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Ask Pixify about your brand
              </CardTitle>
              <CardDescription>
                Get instant answers about brand guidelines, find assets, generate copy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., 'What's our primary color?' or 'Find logo variations'"
                  className="flex-1 h-12 text-base"
                />
                <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                  Ask <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics with Modern Card Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Brand Consistency Score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Target className="h-5 w-5 text-primary" />
                    <Badge variant="secondary" className="text-xs">Live</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.6, stiffness: 200 }}
                    className="text-4xl font-bold mb-1"
                  >
                    {progressValues.brandConsistency}
                    <span className="text-lg text-muted-foreground ml-1">%</span>
                  </motion.div>
                  <p className="text-sm font-medium mb-3">Brand Consistency</p>
                  <Progress value={progressValues.brandConsistency} className="h-1.5" />
                  <p className="text-xs text-muted-foreground mt-2">Excellent alignment</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Asset Library Usage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    <Badge variant="secondary" className="text-xs">Live</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.7, stiffness: 200 }}
                    className="text-4xl font-bold mb-1"
                  >
                    {progressValues.assetLibrary}
                    <span className="text-lg text-muted-foreground ml-1">%</span>
                  </motion.div>
                  <p className="text-sm font-medium mb-3">Asset Library Usage</p>
                  <Progress value={progressValues.assetLibrary} className="h-1.5" />
                  <p className="text-xs text-muted-foreground mt-2">High adoption rate</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Campaign Performance */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Zap className="h-5 w-5 text-primary" />
                    <Badge variant="secondary" className="text-xs">Live</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.8, stiffness: 200 }}
                    className="text-4xl font-bold mb-1"
                  >
                    {progressValues.campaignPerformance}
                    <span className="text-lg text-muted-foreground ml-1">%</span>
                  </motion.div>
                  <p className="text-sm font-medium mb-3">Campaign Performance</p>
                  <Progress value={progressValues.campaignPerformance} className="h-1.5" />
                  <p className="text-xs text-muted-foreground mt-2">Strong engagement</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Team Activity */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Users className="h-5 w-5 text-primary" />
                    <Badge variant="secondary" className="text-xs">Live</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.9, stiffness: 200 }}
                    className="text-4xl font-bold mb-1"
                  >
                    {progressValues.teamActivity}
                    <span className="text-lg text-muted-foreground ml-1">%</span>
                  </motion.div>
                  <p className="text-sm font-medium mb-3">Team Activity</p>
                  <Progress value={progressValues.teamActivity} className="h-1.5" />
                  <p className="text-xs text-muted-foreground mt-2">Active collaboration</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link to="/brand-health">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Brand Health Score</CardTitle>
                <CardDescription>Monitor brand consistency metrics</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/playbook">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <FileStack className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Generate Playbook</CardTitle>
                <CardDescription>One-click brand playbook export</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/guideline">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Open Guideline</CardTitle>
                <CardDescription>View complete brand guidelines</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/requests">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Request Asset</CardTitle>
                <CardDescription>AI-powered design requests</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/library">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <FolderOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Browse Library</CardTitle>
                <CardDescription>All brand assets in one place</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Brand Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Archetype</h4>
                <p className="text-foreground font-medium">Caregiver / Explorer</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Tone</h4>
                <p className="text-foreground font-medium">Warm, Premium, Trustworthy</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Values</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    Excellence
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    Innovation
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    Care
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3 text-sm text-muted-foreground">Primary Colors</h4>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="h-16 rounded-lg bg-[#5C0A3A] shadow-md mb-2"></div>
                    <p className="text-xs font-mono">#5C0A3A</p>
                    <p className="text-xs text-muted-foreground">Qatar Maroon</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-16 rounded-lg bg-[#CBB59C] shadow-md mb-2"></div>
                    <p className="text-xs font-mono">#CBB59C</p>
                    <p className="text-xs text-muted-foreground">Sand</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-16 rounded-lg bg-[#0F1020] shadow-md mb-2"></div>
                    <p className="text-xs font-mono">#0F1020</p>
                    <p className="text-xs text-muted-foreground">Neutral</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Logo uploaded</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Guideline updated</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Playbook generated</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
