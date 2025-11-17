import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Webhook } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminWebhooks() {
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

  const { data: webhooks, isLoading } = useQuery({
    queryKey: ["webhooks", org?.id],
    queryFn: async () => {
      if (!org?.id) return [];

      const { data } = await supabase
        .from("webhook_endpoints")
        .select("*")
        .eq("organization_id", org.id)
        .order("created_at", { ascending: false });

      return data || [];
    },
    enabled: !!org?.id,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5" />
          Webhooks
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure event-driven integrations and notifications
        </p>
      </CardHeader>
      <CardContent>
        {webhooks && webhooks.length > 0 ? (
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm font-mono">{webhook.url}</code>
                      <Badge variant={webhook.is_active ? "default" : "secondary"}>
                        {webhook.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {webhook.failure_count > 0 && (
                      <p className="text-xs text-destructive">
                        {webhook.failure_count} recent failures
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {webhook.events.map((event) => (
                    <Badge key={event} variant="outline" className="text-xs">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Webhook className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No webhooks configured</p>
            <p className="text-sm text-muted-foreground">
              Set up webhooks to receive real-time notifications about events
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}