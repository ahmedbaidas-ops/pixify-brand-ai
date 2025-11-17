import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface RoadmapTeamProps {
  roadmapId: string;
  members: any[];
}

export function RoadmapTeam({ roadmapId, members }: RoadmapTeamProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Team Members</h2>
          <p className="text-sm text-muted-foreground">
            Manage team roles and capacity
          </p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No team members assigned yet
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
                  {member.user?.display_name?.[0] || "?"}
                </div>
                <div>
                  <p className="font-medium">{member.user?.display_name || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {member.capacity}h/week • {member.availability}% available
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
