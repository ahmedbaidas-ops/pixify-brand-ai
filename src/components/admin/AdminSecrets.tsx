import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Key } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminSecrets() {
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

  const { data: secrets, isLoading } = useQuery({
    queryKey: ["secrets", org?.id],
    queryFn: async () => {
      if (!org?.id) return [];

      const { data } = await supabase
        .from("secret_vault")
        .select("id, key, description, last_rotated_at, created_at")
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
          <CardTitle>Integration Secrets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
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
          <Key className="h-5 w-5" />
          Integration Secrets
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage API keys and secrets for external integrations
        </p>
      </CardHeader>
      <CardContent>
        {secrets && secrets.length > 0 ? (
          <div className="space-y-4">
            {secrets.map((secret) => (
              <div
                key={secret.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{secret.key}</h4>
                    <Badge variant="outline">Encrypted</Badge>
                  </div>
                  {secret.description && (
                    <p className="text-sm text-muted-foreground">
                      {secret.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Last rotated:{" "}
                    {new Date(secret.last_rotated_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <EyeOff className="h-4 w-4" />
                    <span className="text-xs">••••••••</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No secrets configured</p>
            <p className="text-sm text-muted-foreground">
              Add API keys for Runway, OpenAI, Figma, and other integrations
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}