import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoadmapCanvas } from "@/components/roadmap/RoadmapCanvas";
import { RoadmapHeader } from "@/components/roadmap/RoadmapHeader";
import { RoadmapTeam } from "@/components/roadmap/RoadmapTeam";
import { RoadmapMilestones } from "@/components/roadmap/RoadmapMilestones";
import { RoadmapRisks } from "@/components/roadmap/RoadmapRisks";
import { RoadmapActivity } from "@/components/roadmap/RoadmapActivity";

export default function Roadmap() {
  const { id } = useParams<{ id: string }>();

  const { data: roadmap, isLoading, error } = useQuery({
    queryKey: ["roadmap", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roadmaps")
        .select(`
          *,
          brand:brands(name, id),
          members:roadmap_members(*, user:profiles(display_name, avatar_url)),
          stages:roadmap_stages(*),
          milestones:roadmap_milestones(*),
          risks:roadmap_risks(*),
          dependencies:roadmap_dependencies(*)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Roadmap query error:", error);
        throw error;
      }
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading roadmap...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="text-destructive">Error loading roadmap</div>
          <div className="text-sm text-muted-foreground">{error.message}</div>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Roadmap not found</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <RoadmapHeader roadmap={roadmap} />
      
      <Tabs defaultValue={roadmap.view.toLowerCase()} className="flex-1 flex flex-col">
        <div className="border-b px-6">
          <TabsList>
            <TabsTrigger value="canvas">Canvas</TabsTrigger>
            <TabsTrigger value="gantt">Gantt</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="canvas" className="flex-1 m-0">
          <RoadmapCanvas roadmap={roadmap} />
        </TabsContent>

        <TabsContent value="gantt" className="flex-1 m-0 p-6">
          <div className="text-muted-foreground">Gantt view coming soon</div>
        </TabsContent>

        <TabsContent value="kanban" className="flex-1 m-0">
          <div className="grid grid-cols-4 gap-4 p-6 h-full">
            {roadmap.stages?.map((stage) => (
              <div key={stage.id} className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold mb-4">{stage.name}</h3>
                <div className="space-y-2">
                  {roadmap.milestones
                    ?.filter((m) => m.stage_id === stage.id)
                    .map((milestone) => (
                      <div
                        key={milestone.id}
                        className="bg-card p-3 rounded border shadow-sm"
                      >
                        <p className="text-sm font-medium">{milestone.name}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="text-xs text-muted-foreground">
                            {milestone.progress}%
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="flex-1 m-0 p-6 space-y-6">
          <RoadmapTeam roadmapId={roadmap.id} members={roadmap.members || []} />
          <RoadmapMilestones roadmapId={roadmap.id} milestones={roadmap.milestones || []} />
          <RoadmapRisks roadmapId={roadmap.id} risks={roadmap.risks || []} />
          <RoadmapActivity roadmapId={roadmap.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
