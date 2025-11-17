import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, TrendingUp, Clock, Star } from "lucide-react";

interface PromptAnalyticsProps {
  organizationId?: string;
}

export function PromptAnalytics({ organizationId }: PromptAnalyticsProps) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["prompt-analytics-stats", organizationId],
    queryFn: async () => {
      if (!organizationId) return null;

      // Get overall statistics
      const { data: analytics } = await supabase
        .from("prompt_analytics")
        .select("*")
        .eq("organization_id", organizationId);

      if (!analytics) return null;

      const totalExecutions = analytics.length;
      const successfulExecutions = analytics.filter((a) => a.success).length;
      const successRate =
        totalExecutions > 0
          ? ((successfulExecutions / totalExecutions) * 100).toFixed(1)
          : "0";

      const avgExecutionTime =
        analytics.reduce((acc, a) => acc + (a.execution_time_ms || 0), 0) /
        (totalExecutions || 1);

      const totalTokens = analytics.reduce(
        (acc, a) => acc + (a.tokens_used || 0),
        0
      );

      const ratingsData = analytics.filter((a) => a.user_rating);
      const avgRating =
        ratingsData.length > 0
          ? (
              ratingsData.reduce((acc, a) => acc + (a.user_rating || 0), 0) /
              ratingsData.length
            ).toFixed(1)
          : "N/A";

      return {
        totalExecutions,
        successRate,
        avgExecutionTime: avgExecutionTime.toFixed(0),
        totalTokens,
        avgRating,
      };
    },
    enabled: !!organizationId,
  });

  const { data: topPrompts, isLoading: loadingTopPrompts } = useQuery({
    queryKey: ["top-prompts", organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      const { data } = await supabase
        .from("prompt_analytics")
        .select("template_id, prompt_templates(name)")
        .eq("organization_id", organizationId);

      if (!data) return [];

      // Count usage per template
      const usage = data.reduce((acc: any, item) => {
        const templateId = item.template_id;
        if (!acc[templateId]) {
          acc[templateId] = {
            id: templateId,
            name: (item as any).prompt_templates?.name || "Unknown",
            count: 0,
          };
        }
        acc[templateId].count++;
        return acc;
      }, {});

      return Object.values(usage)
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 5);
    },
    enabled: !!organizationId,
  });

  if (isLoading || loadingTopPrompts) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Executions
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.totalExecutions || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all prompts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Successful completions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.avgExecutionTime}ms
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Execution time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.avgRating}</div>
            <p className="text-xs text-muted-foreground mt-1">
              User satisfaction
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          {topPrompts && topPrompts.length > 0 ? (
            <div className="space-y-3">
              {topPrompts.map((prompt: any, index) => (
                <div
                  key={prompt.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <span className="font-medium">{prompt.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {prompt.count} executions
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No usage data available yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}