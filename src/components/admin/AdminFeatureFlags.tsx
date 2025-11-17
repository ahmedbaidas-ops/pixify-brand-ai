import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const DEFAULT_FEATURES = [
  { key: "library", name: "Asset Library", description: "Core asset management functionality" },
  { key: "generate", name: "AI Generate", description: "AI-powered content generation" },
  { key: "optimize", name: "Platform Optimizer", description: "Multi-platform content optimization" },
  { key: "motion", name: "Motion Studio", description: "Video and motion asset generation" },
  { key: "calendar", name: "Content Calendar", description: "Campaign scheduling and planning" },
  { key: "marketing", name: "Marketing Suite", description: "Full marketing intelligence tools" },
  { key: "webhooks", name: "Webhooks", description: "Event-driven integrations" },
  { key: "api", name: "API Access", description: "Programmatic access to the platform" },
];

export function AdminFeatureFlags() {
  const queryClient = useQueryClient();

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
        .select("*")
        .eq("id", profile.organization_id)
        .single();
      
      return data;
    },
  });

  const { data: flags, isLoading } = useQuery({
    queryKey: ["feature-flags", org?.id],
    queryFn: async () => {
      if (!org?.id) return [];

      const { data } = await supabase
        .from("feature_flags")
        .select("*")
        .eq("organization_id", org.id);

      return data || [];
    },
    enabled: !!org?.id,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ key, enabled }: { key: string; enabled: boolean }) => {
      if (!org?.id) throw new Error("No organization");

      const existingFlag = flags?.find((f) => f.key === key);

      if (existingFlag) {
        const { error } = await supabase
          .from("feature_flags")
          .update({ enabled })
          .eq("id", existingFlag.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("feature_flags")
          .insert({
            organization_id: org.id,
            key,
            enabled,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-flags"] });
      toast.success("Feature flag updated");
    },
    onError: (error) => {
      toast.error("Failed to update feature flag");
      console.error(error);
    },
  });

  const isFeatureEnabled = (key: string) => {
    return flags?.find((f) => f.key === key)?.enabled || false;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Flags</CardTitle>
        <p className="text-sm text-muted-foreground">
          Control which features are enabled for your organization
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {DEFAULT_FEATURES.map((feature) => {
            const enabled = isFeatureEnabled(feature.key);

            return (
              <div
                key={feature.key}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{feature.name}</h4>
                    <Badge variant={enabled ? "default" : "outline"}>
                      {enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={(checked) =>
                    toggleMutation.mutate({ key: feature.key, enabled: checked })
                  }
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}