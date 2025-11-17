import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface RoadmapMilestonesProps {
  roadmapId: string;
  milestones: any[];
}

export function RoadmapMilestones({ roadmapId, milestones }: RoadmapMilestonesProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNED":
        return "bg-muted text-muted-foreground";
      case "IN_PROGRESS":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "BLOCKED":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "DONE":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Milestones & Tasks</h2>
          <p className="text-sm text-muted-foreground">
            Track progress and dependencies
          </p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      {milestones.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No milestones created yet
        </div>
      ) : (
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="p-4 bg-muted/30 rounded-lg space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{milestone.name}</h3>
                  {milestone.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {milestone.description}
                    </p>
                  )}
                </div>
                <Badge className={getStatusColor(milestone.status)}>
                  {milestone.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-primary">
                    {milestone.progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
              </div>

              {milestone.tags && milestone.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {milestone.tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-background rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
