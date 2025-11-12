import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { seoKeywords } from "@/data/marketing";
import { TrendingUp, TrendingDown, Search, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SEOInsights = () => {
  // Mock trend data
  const trendData = [
    { month: "Oct", traffic: 245000 },
    { month: "Nov", traffic: 268000 },
    { month: "Dec", traffic: 291000 },
    { month: "Jan", traffic: 315000 },
    { month: "Feb", traffic: 342000 },
    { month: "Mar", traffic: 378000 }
  ];

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 50) return "text-green-500";
    if (difficulty < 70) return "text-orange-500";
    return "text-red-500";
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty < 50) return "Easy";
    if (difficulty < 70) return "Medium";
    return "Hard";
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">SEO & Keyword Insights</h2>
          <p className="text-muted-foreground">AI-powered search optimization and keyword strategy</p>
        </div>
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Generate SEO Report
        </Button>
      </div>

      {/* SEO Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Search className="h-8 w-8 text-primary" />
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">378K</div>
              <div className="text-sm text-muted-foreground mb-1">Monthly Organic Traffic</div>
              <div className="text-xs text-green-500">+10.5% vs last month</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Search className="h-8 w-8 text-blue-500" />
                <Badge variant="secondary">8 tracked</Badge>
              </div>
              <div className="text-3xl font-bold mb-1">Top 3</div>
              <div className="text-sm text-muted-foreground mb-1">Avg Keyword Position</div>
              <div className="text-xs text-green-500">+2 positions improved</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Search className="h-8 w-8 text-green-500" />
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">4.2%</div>
              <div className="text-sm text-muted-foreground mb-1">Click-Through Rate</div>
              <div className="text-xs text-green-500">+0.8% improvement</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Traffic Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Organic Traffic Trend</CardTitle>
          <CardDescription>6-month search performance growth</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value) => `${(value as number).toLocaleString()} visits`} />
              <Line 
                type="monotone" 
                dataKey="traffic" 
                stroke="#5C0A3A" 
                strokeWidth={3}
                dot={{ fill: "#5C0A3A", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Keyword Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Keyword Performance Matrix</CardTitle>
          <CardDescription>Priority keywords for Qatar Airways content strategy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {seoKeywords.map((keyword, index) => (
            <motion.div
              key={keyword.keyword}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium">{keyword.keyword}</span>
                    <Badge variant="outline" className="text-xs">
                      {keyword.volume.toLocaleString()} searches/mo
                    </Badge>
                    <Badge variant={keyword.trend.startsWith("+") ? "default" : "secondary"} className="text-xs">
                      {keyword.trend} trend
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      Difficulty: 
                      <span className={`font-medium ${getDifficultyColor(keyword.difficulty)}`}>
                        {keyword.difficulty}/100 ({getDifficultyLabel(keyword.difficulty)})
                      </span>
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-2">
                  Analyze
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* AI SEO Recommendations */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI SEO Recommendations
          </CardTitle>
          <CardDescription>Intelligent optimization suggestions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <div className="font-medium text-sm mb-1">Target "Qatar Airways First Class Suites"</div>
                <div className="text-xs text-muted-foreground">
                  Growing 20% MoM with medium difficulty (54/100). Create dedicated landing page showcasing Qsuite features.
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium text-sm mb-1">Optimize for "Sustainable Aviation"</div>
                <div className="text-xs text-muted-foreground">
                  High-growth keyword (+25%) aligns with Innovation & Future pillar. Expand sustainability content.
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <div className="font-medium text-sm mb-1">Content Gap: Business Class Comparison</div>
                <div className="text-xs text-muted-foreground">
                  Competitors ranking for "qatar vs emirates business class" - create comparison guide.
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-start gap-2">
              <TrendingDown className="h-4 w-4 text-orange-500 mt-0.5" />
              <div>
                <div className="font-medium text-sm mb-1">Lower CPC Alternative Found</div>
                <div className="text-xs text-muted-foreground">
                  "Qatar business class" has 20% lower CPC vs "luxury flight qatar" with similar intent - adjust PPC strategy.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOInsights;
