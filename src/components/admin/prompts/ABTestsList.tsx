import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { TestTube } from "lucide-react";

interface ABTestsListProps {
  organizationId?: string;
}

export function ABTestsList({ organizationId }: ABTestsListProps) {
  const { data: tests, isLoading } = useQuery({
    queryKey: ["prompt-ab-tests", organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      const { data } = await supabase
        .from("prompt_ab_tests")
        .select(`
          *,
          prompt_templates(name),
          variant_a:prompt_versions!variant_a_id(version_number),
          variant_b:prompt_versions!variant_b_id(version_number)
        `)
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false });

      return data || [];
    },
    enabled: !!organizationId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "default";
      case "completed":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (!tests || tests.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <TestTube className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No A/B tests configured</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create A/B tests to compare prompt performance
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tests.map((test) => {
        const variantA = (test as any).variant_a;
        const variantB = (test as any).variant_b;
        const template = (test as any).prompt_templates;

        return (
          <Card key={test.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{test.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {template?.name}
                  </p>
                </div>
                <Badge variant={getStatusColor(test.status)}>
                  {test.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {test.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {test.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Variant A</span>
                    <Badge variant="outline">
                      v{variantA?.version_number}
                    </Badge>
                  </div>
                  <Progress value={test.traffic_split} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {test.traffic_split}% traffic
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Variant B</span>
                    <Badge variant="outline">
                      v{variantB?.version_number}
                    </Badge>
                  </div>
                  <Progress value={100 - test.traffic_split} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {100 - test.traffic_split}% traffic
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Metric: {test.success_metric}</span>
                {test.start_date && (
                  <span>
                    Started: {new Date(test.start_date).toLocaleDateString()}
                  </span>
                )}
                {test.end_date && (
                  <span>
                    Ends: {new Date(test.end_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}