import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface RoadmapActivityProps {
  roadmapId: string;
}

export function RoadmapActivity({ roadmapId }: RoadmapActivityProps) {
  const { data: activities } = useQuery({
    queryKey: ["roadmap-activity", roadmapId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roadmap_activity")
        .select("*")
        .eq("roadmap_id", roadmapId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Activity Log</h2>

      {!activities || activities.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No activity recorded yet
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
            >
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.action}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(activity.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
