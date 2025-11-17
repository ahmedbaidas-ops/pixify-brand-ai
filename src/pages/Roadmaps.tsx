import { useState } from "react";
import { Plus, Calendar, Users, Target, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Roadmaps() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const { data: roadmaps, isLoading } = useQuery({
    queryKey: ["roadmaps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roadmaps")
        .select(`
          *,
          brand:brands(name),
          milestones:roadmap_milestones(count),
          risks:roadmap_risks(count)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleCreateRoadmap = async () => {
    setIsCreating(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .single();

      if (!profile?.organization_id) {
        toast.error("No organization found");
        return;
      }

      const { data, error } = await supabase
        .from("roadmaps")
        .insert({
          organization_id: profile.organization_id,
          title: "New Roadmap",
          owner_id: (await supabase.auth.getUser()).data.user?.id,
          status: "DRAFT",
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Roadmap created");
      navigate(`/roadmaps/${data.id}`);
    } catch (error) {
      console.error("Error creating roadmap:", error);
      toast.error("Failed to create roadmap");
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-muted text-muted-foreground";
      case "REVIEW":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "ACTIVE":
        return "bg-primary/10 text-primary border-primary/20";
      case "ARCHIVED":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Roadmaps</h1>
          <p className="text-muted-foreground">
            Manage project workflows, milestones, and risks
          </p>
        </div>
        <Button onClick={handleCreateRoadmap} disabled={isCreating}>
          <Plus className="w-4 h-4 mr-2" />
          New Roadmap
        </Button>
      </div>

      {roadmaps && roadmaps.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">No roadmaps yet</h3>
            <p className="text-muted-foreground">
              Create your first roadmap to start planning workflows, milestones, and managing risks
            </p>
            <Button onClick={handleCreateRoadmap} disabled={isCreating}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Roadmap
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roadmaps?.map((roadmap) => (
            <Card
              key={roadmap.id}
              className="p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate(`/roadmaps/${roadmap.id}`)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                      {roadmap.title}
                    </h3>
                    {roadmap.brand && (
                      <p className="text-sm text-muted-foreground">
                        {roadmap.brand.name}
                      </p>
                    )}
                  </div>
                  <Badge className={getStatusColor(roadmap.status)}>
                    {roadmap.status}
                  </Badge>
                </div>

                {roadmap.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {roadmap.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>{roadmap.milestones?.[0]?.count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{roadmap.risks?.[0]?.count || 0}</span>
                  </div>
                </div>

                {roadmap.start_date && roadmap.end_date && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(roadmap.start_date).toLocaleDateString()} -{" "}
                      {new Date(roadmap.end_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
