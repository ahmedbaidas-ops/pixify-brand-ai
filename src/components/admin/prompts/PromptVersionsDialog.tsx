import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface PromptVersionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: any;
}

export function PromptVersionsDialog({
  open,
  onOpenChange,
  template,
}: PromptVersionsDialogProps) {
  const queryClient = useQueryClient();
  const [newVersionContent, setNewVersionContent] = useState("");
  const [newVersionNotes, setNewVersionNotes] = useState("");
  const [showNewVersion, setShowNewVersion] = useState(false);

  const { data: versions, isLoading } = useQuery({
    queryKey: ["prompt-versions", template?.id],
    queryFn: async () => {
      if (!template?.id) return [];

      const { data } = await supabase
        .from("prompt_versions")
        .select("*")
        .eq("template_id", template.id)
        .order("version_number", { ascending: false });

      return data || [];
    },
    enabled: !!template?.id && open,
  });

  const activateMutation = useMutation({
    mutationFn: async (versionId: string) => {
      const { error } = await supabase.rpc("activate_prompt_version", {
        p_version_id: versionId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompt-versions"] });
      toast.success("Version activated");
    },
    onError: () => {
      toast.error("Failed to activate version");
    },
  });

  const createVersionMutation = useMutation({
    mutationFn: async () => {
      if (!newVersionContent.trim()) {
        throw new Error("Content is required");
      }

      const { data: { user } } = await supabase.auth.getUser();
      const maxVersion = versions?.[0]?.version_number || 0;

      const { error } = await supabase
        .from("prompt_versions")
        .insert({
          template_id: template.id,
          version_number: maxVersion + 1,
          content: newVersionContent.trim(),
          notes: newVersionNotes.trim() || null,
          created_by: user?.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompt-versions"] });
      toast.success("New version created");
      setNewVersionContent("");
      setNewVersionNotes("");
      setShowNewVersion(false);
    },
    onError: () => {
      toast.error("Failed to create version");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template?.name} - Versions</DialogTitle>
          <DialogDescription>
            Manage and activate different versions of this prompt template
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!showNewVersion && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewVersion(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Version
            </Button>
          )}

          {showNewVersion && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <Label>New Version Content</Label>
                  <Textarea
                    value={newVersionContent}
                    onChange={(e) => setNewVersionContent(e.target.value)}
                    placeholder="Enter the new prompt content..."
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Version Notes (optional)</Label>
                  <Textarea
                    value={newVersionNotes}
                    onChange={(e) => setNewVersionNotes(e.target.value)}
                    placeholder="Describe what changed in this version..."
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => createVersionMutation.mutate()}
                    disabled={createVersionMutation.isPending}
                  >
                    {createVersionMutation.isPending ? "Creating..." : "Create Version"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowNewVersion(false);
                      setNewVersionContent("");
                      setNewVersionNotes("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {versions?.map((version) => (
                <Card
                  key={version.id}
                  className={version.is_active ? "border-primary" : ""}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          Version {version.version_number}
                        </Badge>
                        {version.is_active && (
                          <Badge variant="default">
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                      {!version.is_active && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => activateMutation.mutate(version.id)}
                        >
                          Activate
                        </Button>
                      )}
                    </div>
                    <pre className="text-sm bg-muted p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
                      {version.content}
                    </pre>
                    {version.notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Notes: {version.notes}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Created {new Date(version.created_at).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}