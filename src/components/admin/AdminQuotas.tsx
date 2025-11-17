import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const DEFAULT_QUOTAS = [
  {
    key: "ai_tokens_monthly",
    name: "AI Tokens (Monthly)",
    description: "Number of AI tokens available per month",
  },
  {
    key: "render_seconds_daily",
    name: "Render Seconds (Daily)",
    description: "Motion render capacity per day",
  },
  {
    key: "storage_gb",
    name: "Storage (GB)",
    description: "Total storage capacity for assets",
  },
];

export function AdminQuotas() {
  const { data: org } = useQuery({
    queryKey: ["organization"],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .single();
      
      if (!profile?.organization_id) return null;

      const { data } = await supabase
        .from("organizations")
        .select("*, plans(*)")
        .eq("id", profile.organization_id)
        .single();
      
      return data;
    },
  });

  const { data: quotas, isLoading } = useQuery({
    queryKey: ["quotas", org?.id],
    queryFn: async () => {
      if (!org?.id) return [];

      const { data } = await supabase
        .from("quotas")
        .select("*")
        .eq("organization_id", org.id);

      return data || [];
    },
    enabled: !!org?.id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getQuotaValue = (key: string) => {
    const quota = quotas?.find((q) => q.key === key);
    if (quota) return quota;

    // Fallback to plan entitlements
    const entitlements = org?.plans?.entitlements;
    const planQuotas = (typeof entitlements === 'object' && entitlements !== null && 'quotas' in entitlements) 
      ? (entitlements as any).quotas 
      : {};
    return {
      limit_value: planQuotas[key] || 0,
      current_usage: 0,
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Resource Quotas</h2>
        <p className="text-muted-foreground">
          Monitor usage limits and capacity for your organization
        </p>
      </div>

      <div className="grid gap-6">
        {DEFAULT_QUOTAS.map((quotaDef) => {
          const quota = getQuotaValue(quotaDef.key);
          const usage = quota.current_usage || 0;
          const limit = quota.limit_value || 0;
          const percentage = limit > 0 ? (usage / limit) * 100 : 0;

          return (
            <Card key={quotaDef.key}>
              <CardHeader>
                <CardTitle className="text-lg">{quotaDef.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {quotaDef.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Usage</span>
                  <span className="font-semibold">
                    {usage.toLocaleString()} / {limit.toLocaleString()}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {percentage.toFixed(1)}% used
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}