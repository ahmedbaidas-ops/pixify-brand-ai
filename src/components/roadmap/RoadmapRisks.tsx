import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoadmapRisksProps {
  roadmapId: string;
  risks: any[];
}

export function RoadmapRisks({ roadmapId, risks }: RoadmapRisksProps) {
  const getRiskSeverity = (probability: number, impact: number) => {
    const score = probability * impact;
    if (score >= 20) return { label: "Critical", color: "bg-red-500/10 text-red-600 border-red-500/20" };
    if (score >= 15) return { label: "High", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" };
    if (score >= 10) return { label: "Medium", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" };
    return { label: "Low", color: "bg-green-500/10 text-green-600 border-green-500/20" };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "MITIGATING":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "CLOSED":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Risk Mitigation</h2>
          <p className="text-sm text-muted-foreground">
            Identify and manage project risks
          </p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Risk
        </Button>
      </div>

      {risks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No risks identified yet
        </div>
      ) : (
        <div className="space-y-4">
          {risks.map((risk) => {
            const severity = getRiskSeverity(risk.probability, risk.impact);
            return (
              <div
                key={risk.id}
                className="p-4 bg-muted/30 rounded-lg space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{risk.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {risk.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={severity.color}>{severity.label}</Badge>
                    <Badge className={getStatusColor(risk.status)}>
                      {risk.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Probability: </span>
                    <span className="font-semibold">{risk.probability}/5</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Impact: </span>
                    <span className="font-semibold">{risk.impact}/5</span>
                  </div>
                </div>

                {risk.mitigation && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Mitigation: </span>
                      {risk.mitigation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
