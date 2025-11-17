import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";

const promptSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  description: z.string().max(500).optional(),
  category: z.enum(["generate", "optimize", "motion", "copy"]),
  content: z.string().min(10, "Content must be at least 10 characters"),
  tags: z.string().optional(),
});

interface CreatePromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId?: string;
}

export function CreatePromptDialog({
  open,
  onOpenChange,
  organizationId,
}: CreatePromptDialogProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "generate",
    content: "",
    tags: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Validate input
      const validation = promptSchema.safeParse(data);
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        throw new Error("Validation failed");
      }
      setErrors({});

      if (!organizationId) throw new Error("No organization");

      const { data: { user } } = await supabase.auth.getUser();

      // Create template
      const { data: template, error: templateError } = await supabase
        .from("prompt_templates")
        .insert({
          organization_id: organizationId,
          name: data.name.trim(),
          description: data.description.trim() || null,
          category: data.category,
          status: "draft",
          tags: data.tags
            ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
            : [],
          created_by: user?.id,
        })
        .select()
        .single();

      if (templateError) throw templateError;

      // Create initial version
      const { error: versionError } = await supabase
        .from("prompt_versions")
        .insert({
          template_id: template.id,
          version_number: 1,
          content: data.content.trim(),
          is_active: true,
          created_by: user?.id,
          notes: "Initial version",
        });

      if (versionError) throw versionError;

      return template;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompt-templates"] });
      toast.success("Prompt template created successfully");
      onOpenChange(false);
      setFormData({
        name: "",
        description: "",
        category: "generate",
        content: "",
        tags: "",
      });
    },
    onError: (error) => {
      if (error.message !== "Validation failed") {
        toast.error("Failed to create prompt template");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Prompt Template</DialogTitle>
          <DialogDescription>
            Create a new AI prompt template with version control
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Brand-Aligned Social Post Generator"
              maxLength={100}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the purpose of this prompt..."
              rows={3}
              maxLength={500}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="generate">Generate</SelectItem>
                <SelectItem value="optimize">Optimize</SelectItem>
                <SelectItem value="motion">Motion</SelectItem>
                <SelectItem value="copy">Copy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Prompt Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Enter the prompt template content..."
              rows={8}
              className="font-mono text-sm"
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Use variables like {"{brand_tone}"}, {"{brand_colors}"}, {"{user_input}"} for dynamic content
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="social-media, content-generation, ..."
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated tags for organization
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}