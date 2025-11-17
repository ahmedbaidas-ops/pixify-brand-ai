import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Save, Share2, Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RoadmapHeaderProps {
  roadmap: any;
}

export function RoadmapHeader({ roadmap }: RoadmapHeaderProps) {
  const navigate = useNavigate();

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

  return (
    <div className="border-b bg-card/50 backdrop-blur-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/roadmaps")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{roadmap.title}</h1>
              <Badge className={getStatusColor(roadmap.status)}>
                {roadmap.status}
              </Badge>
            </div>
            {roadmap.brand && (
              <p className="text-sm text-muted-foreground mt-1">
                {roadmap.brand.name}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
