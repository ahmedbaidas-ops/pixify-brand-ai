import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X, Eye, GitBranch } from "lucide-react";

interface PromptTemplatesListProps {
  templates: any[];
  isLoading: boolean;
  onUpdateStatus: (params: { id: string; status: string }) => void;
  onViewVersions: (template: any) => void;
}

export function PromptTemplatesList({
  templates,
  isLoading,
  onUpdateStatus,
  onViewVersions,
}: PromptTemplatesListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
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
      case "approved":
        return "default";
      case "review":
        return "secondary";
      case "draft":
        return "outline";
      default:
        return "outline";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "generate":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300";
      case "motion":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300";
      case "optimize":
        return "bg-green-500/10 text-green-700 dark:text-green-300";
      case "copy":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-300";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-300";
    }
  };

  if (!templates || templates.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No prompt templates found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create your first prompt template to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {templates.map((template) => {
        const versionCount = (template as any).prompt_versions?.[0]?.count || 0;

        return (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{template.name}</h3>
                    <Badge variant={getStatusColor(template.status)}>
                      {template.status}
                    </Badge>
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                    {template.is_default && (
                      <Badge variant="outline">Default</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GitBranch className="h-4 w-4" />
                  <span>{versionCount} version{versionCount !== 1 ? 's' : ''}</span>
                </div>

                {template.tags && template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="ml-auto flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewVersions(template)}
                  >
                    <GitBranch className="h-4 w-4 mr-2" />
                    Versions
                  </Button>

                  {template.status === "review" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onUpdateStatus({ id: template.id, status: "approved" })
                        }
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onUpdateStatus({ id: template.id, status: "draft" })
                        }
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}

                  {template.status === "draft" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onUpdateStatus({ id: template.id, status: "review" })
                      }
                    >
                      Submit for Review
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}