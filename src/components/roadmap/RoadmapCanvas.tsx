import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, Target, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoadmapCanvasProps {
  roadmap: any;
}

export function RoadmapCanvas({ roadmap }: RoadmapCanvasProps) {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const panels = [
    {
      id: "team",
      title: "Select Team",
      icon: Users,
      color: "from-blue-500/20 to-blue-600/20",
      count: roadmap.members?.length || 0,
    },
    {
      id: "milestones",
      title: "Milestones/Tasks",
      icon: Target,
      color: "from-primary/20 to-primary/30",
      count: roadmap.milestones?.length || 0,
    },
    {
      id: "risks",
      title: "Risk Mitigation",
      icon: AlertTriangle,
      color: "from-red-500/20 to-red-600/20",
      count: roadmap.risks?.length || 0,
    },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="grid grid-cols-3 gap-6 h-full">
        {/* Left Panel - Workflow */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">Workflow</h2>
          {panels.map((panel) => (
            <Card
              key={panel.id}
              className={cn(
                "p-6 cursor-pointer transition-all hover:scale-105 hover:shadow-lg",
                "bg-gradient-to-br border-2",
                activePanel === panel.id && "ring-2 ring-primary ring-offset-2",
                panel.color
              )}
              onClick={() => setActivePanel(panel.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center">
                    <panel.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{panel.title}</h3>
                    <p className="text-xs text-muted-foreground">{panel.count} items</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary/50">{panel.count}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Center Panel - Team Selection */}
        <div className="flex items-center justify-center">
          <Card className="p-8 w-full max-w-md bg-card/50 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Team Selection</h3>
              <p className="text-sm text-muted-foreground">
                {roadmap.members?.length || 0} team member(s) assigned
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {roadmap.members?.slice(0, 5).map((member: any) => (
                  <div
                    key={member.id}
                    className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold"
                  >
                    {member.user?.display_name?.[0] || "?"}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel - Milestones */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">Milestones</h2>
          {roadmap.milestones?.slice(0, 5).map((milestone: any) => (
            <Card
              key={milestone.id}
              className="p-4 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-sm">{milestone.name}</h4>
                  <div className="text-xs text-primary font-semibold">
                    {milestone.progress}%
                  </div>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Panel - Risks */}
      <div className="mt-6 p-6 bg-card/50 backdrop-blur-sm rounded-lg border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Risk Mitigation</h2>
        <div className="flex flex-wrap gap-3">
          {roadmap.risks?.map((risk: any) => {
            const severity = risk.probability * risk.impact;
            const severityColor =
              severity >= 20
                ? "bg-red-500/10 text-red-600 border-red-500/20"
                : severity >= 12
                ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";

            return (
              <div
                key={risk.id}
                className={cn(
                  "px-3 py-2 rounded-full text-xs font-medium border",
                  severityColor
                )}
              >
                {risk.title}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
