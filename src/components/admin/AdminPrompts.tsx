import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, TestTube, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { PromptTemplatesList } from "./prompts/PromptTemplatesList";
import { CreatePromptDialog } from "./prompts/CreatePromptDialog";
import { PromptVersionsDialog } from "./prompts/PromptVersionsDialog";
import { ABTestsList } from "./prompts/ABTestsList";
import { PromptAnalytics } from "./prompts/PromptAnalytics";

export function AdminPrompts() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [versionsDialogOpen, setVersionsDialogOpen] = useState(false);
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

  const { data: templates, isLoading } = useQuery({
    queryKey: ["prompt-templates", org?.id],
    queryFn: async () => {
      if (!org?.id) return [];

      const { data } = await supabase
        .from("prompt_templates")
        .select("*, prompt_versions(count)")
        .eq("organization_id", org.id)
        .order("created_at", { ascending: false });

      return data || [];
    },
    enabled: !!org?.id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: any = { status };
      
      if (status === 'approved') {
        const { data: { user } } = await supabase.auth.getUser();
        updates.approved_by = user?.id;
        updates.approved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("prompt_templates")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompt-templates"] });
      toast.success("Prompt status updated");
    },
    onError: () => {
      toast.error("Failed to update prompt status");
    },
  });

  const handleViewVersions = (template: any) => {
    setSelectedTemplate(template);
    setVersionsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Prompt Library</h2>
          <p className="text-muted-foreground">
            Curate, version-control, and optimize AI prompts across the platform
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Prompt
        </Button>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates" className="gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="ab-tests" className="gap-2">
            <TestTube className="h-4 w-4" />
            A/B Tests
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <PromptTemplatesList
            templates={templates}
            isLoading={isLoading}
            onUpdateStatus={updateStatusMutation.mutate}
            onViewVersions={handleViewVersions}
          />
        </TabsContent>

        <TabsContent value="ab-tests">
          <ABTestsList organizationId={org?.id} />
        </TabsContent>

        <TabsContent value="analytics">
          <PromptAnalytics organizationId={org?.id} />
        </TabsContent>
      </Tabs>

      <CreatePromptDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        organizationId={org?.id}
      />

      {selectedTemplate && (
        <PromptVersionsDialog
          open={versionsDialogOpen}
          onOpenChange={setVersionsDialogOpen}
          template={selectedTemplate}
        />
      )}
    </div>
  );
}