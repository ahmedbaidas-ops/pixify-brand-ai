import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Database, Zap, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminOverview() {
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

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats", org?.id],
    queryFn: async () => {
      if (!org?.id) return null;

      const [users, brands, quotas, flags] = await Promise.all([
        supabase.from("user_roles").select("*", { count: "exact" }).eq("organization_id", org.id),
        supabase.from("brands").select("*", { count: "exact" }).eq("organization_id", org.id),
        supabase.from("quotas").select("*").eq("organization_id", org.id),
        supabase.from("feature_flags").select("*").eq("organization_id", org.id),
      ]);

      return {
        userCount: users.count || 0,
        brandCount: brands.count || 0,
        quotas: quotas.data || [],
        flags: flags.data || [],
      };
    },
    enabled: !!org?.id,
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const activeFlags = stats?.flags.filter((f) => f.enabled).length || 0;
  const totalQuotas = stats?.quotas.length || 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.userCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active team members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brands</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.brandCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Managed brands
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Features</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {activeFlags}/{stats?.flags.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Feature flags enabled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quotas</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalQuotas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Resource limits configured
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Plan:</span>
              <span className="text-lg font-bold capitalize">
                {org?.plans?.name || "No Plan"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Price:</span>
              <span className="text-lg">
                ${org?.plans?.price_monthly || 0}/month
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}