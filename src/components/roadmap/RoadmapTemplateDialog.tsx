import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, Megaphone, Sparkles, Calendar, Target, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface RoadmapTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  milestones: number;
  risks: number;
  stages: Array<{ name: string; color: string; order_index: number }>;
  milestoneData: Array<{
    name: string;
    description: string;
    stage_index: number;
    effort_hours: number;
    progress: number;
    status: "PLANNED" | "IN_PROGRESS" | "BLOCKED" | "DONE";
  }>;
  riskData: Array<{
    title: string;
    category: "SCOPE" | "TIMELINE" | "QUALITY" | "RESOURCING" | "TECH" | "CLIENT";
    probability: number;
    impact: number;
    mitigation: string;
    status: "OPEN" | "MITIGATING" | "CLOSED";
  }>;
}

const TEMPLATES: RoadmapTemplate[] = [
  {
    id: "brand-refresh",
    name: "Brand Refresh",
    description: "Complete brand identity overhaul with strategy, design, and activation phases",
    icon: <Sparkles className="w-6 h-6" />,
    duration: "8 weeks",
    milestones: 7,
    risks: 5,
    stages: [
      { name: "Discovery", color: "#3B82F6", order_index: 0 },
      { name: "Strategy", color: "#8B5CF6", order_index: 1 },
      { name: "Design", color: "#EC4899", order_index: 2 },
      { name: "Implementation", color: "#10B981", order_index: 3 },
    ],
    milestoneData: [
      { name: "Brand Audit", description: "Analyze current brand perception and market position", stage_index: 0, effort_hours: 40, progress: 0, status: "PLANNED" },
      { name: "Stakeholder Interviews", description: "Gather insights from key stakeholders", stage_index: 0, effort_hours: 24, progress: 0, status: "PLANNED" },
      { name: "Brand Strategy", description: "Define brand purpose, values, and positioning", stage_index: 1, effort_hours: 60, progress: 0, status: "PLANNED" },
      { name: "Visual Identity", description: "Create logo, color palette, typography system", stage_index: 2, effort_hours: 80, progress: 0, status: "PLANNED" },
      { name: "Brand Guidelines", description: "Develop comprehensive brand guideline document", stage_index: 2, effort_hours: 40, progress: 0, status: "PLANNED" },
      { name: "Asset Creation", description: "Build asset library and templates", stage_index: 3, effort_hours: 60, progress: 0, status: "PLANNED" },
      { name: "Brand Launch", description: "Roll out new brand across all touchpoints", stage_index: 3, effort_hours: 48, progress: 0, status: "PLANNED" },
    ],
    riskData: [
      { title: "Stakeholder alignment", category: "CLIENT", probability: 3, impact: 4, mitigation: "Regular check-ins and approval gates", status: "OPEN" },
      { title: "Timeline delays", category: "TIMELINE", probability: 3, impact: 3, mitigation: "Build buffer time and prioritize critical path", status: "OPEN" },
      { title: "Budget overrun", category: "RESOURCING", probability: 2, impact: 4, mitigation: "Track costs weekly and flag early", status: "OPEN" },
      { title: "Design approval cycles", category: "QUALITY", probability: 4, impact: 2, mitigation: "Set clear approval process and decision makers", status: "OPEN" },
      { title: "Asset production delays", category: "TECH", probability: 2, impact: 3, mitigation: "Prioritize core assets and phase rollout", status: "OPEN" },
    ],
  },
  {
    id: "campaign-launch",
    name: "Campaign Launch",
    description: "Multi-channel marketing campaign from concept to execution",
    icon: <Megaphone className="w-6 h-6" />,
    duration: "6 weeks",
    milestones: 6,
    risks: 4,
    stages: [
      { name: "Planning", color: "#3B82F6", order_index: 0 },
      { name: "Creative", color: "#EC4899", order_index: 1 },
      { name: "Production", color: "#F59E0B", order_index: 2 },
      { name: "Launch", color: "#10B981", order_index: 3 },
    ],
    milestoneData: [
      { name: "Campaign Brief", description: "Define objectives, audience, and key messages", stage_index: 0, effort_hours: 16, progress: 0, status: "PLANNED" },
      { name: "Media Planning", description: "Select channels and allocate budget", stage_index: 0, effort_hours: 24, progress: 0, status: "PLANNED" },
      { name: "Creative Concepts", description: "Develop campaign visuals and messaging", stage_index: 1, effort_hours: 60, progress: 0, status: "PLANNED" },
      { name: "Asset Production", description: "Create all campaign assets across channels", stage_index: 2, effort_hours: 80, progress: 0, status: "PLANNED" },
      { name: "Pre-launch Testing", description: "QA and A/B testing before launch", stage_index: 2, effort_hours: 16, progress: 0, status: "PLANNED" },
      { name: "Campaign Launch", description: "Go live across all channels", stage_index: 3, effort_hours: 24, progress: 0, status: "PLANNED" },
    ],
    riskData: [
      { title: "Creative approval delays", category: "CLIENT", probability: 4, impact: 3, mitigation: "Set clear approval deadlines and decision process", status: "OPEN" },
      { title: "Production bottlenecks", category: "RESOURCING", probability: 3, impact: 4, mitigation: "Stagger production and prioritize critical assets", status: "OPEN" },
      { title: "Channel technical issues", category: "TECH", probability: 2, impact: 4, mitigation: "Test integrations early and have backup plans", status: "OPEN" },
      { title: "Budget constraints", category: "SCOPE", probability: 3, impact: 3, mitigation: "Track spend weekly and prioritize high-impact channels", status: "OPEN" },
    ],
  },
  {
    id: "product-launch",
    name: "Product Launch",
    description: "End-to-end product launch including positioning, marketing, and sales enablement",
    icon: <Rocket className="w-6 h-6" />,
    duration: "10 weeks",
    milestones: 8,
    risks: 6,
    stages: [
      { name: "Research", color: "#3B82F6", order_index: 0 },
      { name: "Positioning", color: "#8B5CF6", order_index: 1 },
      { name: "Enablement", color: "#F59E0B", order_index: 2 },
      { name: "Launch", color: "#10B981", order_index: 3 },
    ],
    milestoneData: [
      { name: "Market Research", description: "Analyze market, competitors, and customer needs", stage_index: 0, effort_hours: 40, progress: 0, status: "PLANNED" },
      { name: "Product Positioning", description: "Define value proposition and messaging", stage_index: 1, effort_hours: 32, progress: 0, status: "PLANNED" },
      { name: "Launch Plan", description: "Create comprehensive launch strategy", stage_index: 1, effort_hours: 24, progress: 0, status: "PLANNED" },
      { name: "Marketing Collateral", description: "Develop all marketing materials", stage_index: 2, effort_hours: 80, progress: 0, status: "PLANNED" },
      { name: "Sales Enablement", description: "Train sales team and create enablement tools", stage_index: 2, effort_hours: 40, progress: 0, status: "PLANNED" },
      { name: "Pre-launch Campaign", description: "Build awareness before launch", stage_index: 2, effort_hours: 60, progress: 0, status: "PLANNED" },
      { name: "Product Launch", description: "Official launch event and activation", stage_index: 3, effort_hours: 48, progress: 0, status: "PLANNED" },
      { name: "Post-launch Analysis", description: "Track metrics and gather feedback", stage_index: 3, effort_hours: 24, progress: 0, status: "PLANNED" },
    ],
    riskData: [
      { title: "Market readiness", category: "CLIENT", probability: 3, impact: 5, mitigation: "Conduct early feedback loops with target customers", status: "OPEN" },
      { title: "Competitive pressure", category: "SCOPE", probability: 4, impact: 3, mitigation: "Monitor competitors and differentiate clearly", status: "OPEN" },
      { title: "Resource allocation", category: "RESOURCING", probability: 3, impact: 4, mitigation: "Secure dedicated team and backup resources", status: "OPEN" },
      { title: "Message clarity", category: "QUALITY", probability: 2, impact: 4, mitigation: "Test messaging with focus groups", status: "OPEN" },
      { title: "Timeline pressure", category: "TIMELINE", probability: 4, impact: 4, mitigation: "Prioritize must-haves and phase nice-to-haves", status: "OPEN" },
      { title: "Sales adoption", category: "CLIENT", probability: 3, impact: 3, mitigation: "Incentivize early adopters and provide ongoing support", status: "OPEN" },
    ],
  },
];

interface RoadmapTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoadmapTemplateDialog({ open, onOpenChange }: RoadmapTemplateDialogProps) {
  const navigate = useNavigate();
  const [isCloning, setIsCloning] = useState(false);

  const handleCloneTemplate = async (template: RoadmapTemplate) => {
    setIsCloning(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      if (!profile?.organization_id) throw new Error("No organization found");

      // Create roadmap
      const { data: roadmap, error: roadmapError } = await supabase
        .from("roadmaps")
        .insert({
          organization_id: profile.organization_id,
          title: template.name,
          description: template.description,
          owner_id: user.id,
          status: "DRAFT",
        })
        .select()
        .single();

      if (roadmapError) throw roadmapError;

      // Create stages
      const stagesData = template.stages.map((stage) => ({
        roadmap_id: roadmap.id,
        name: stage.name,
        color: stage.color,
        order_index: stage.order_index,
      }));

      const { data: stages, error: stagesError } = await supabase
        .from("roadmap_stages")
        .insert(stagesData)
        .select();

      if (stagesError) throw stagesError;

      // Create milestones
      const milestonesData = template.milestoneData.map((milestone) => ({
        roadmap_id: roadmap.id,
        name: milestone.name,
        description: milestone.description,
        stage_id: stages[milestone.stage_index].id,
        effort_hours: milestone.effort_hours,
        progress: milestone.progress,
        status: milestone.status,
      }));

      const { error: milestonesError } = await supabase
        .from("roadmap_milestones")
        .insert(milestonesData);

      if (milestonesError) throw milestonesError;

      // Create risks
      const risksData = template.riskData.map((risk) => ({
        roadmap_id: roadmap.id,
        title: risk.title,
        category: risk.category,
        probability: risk.probability,
        impact: risk.impact,
        mitigation: risk.mitigation,
        status: risk.status,
      }));

      const { error: risksError } = await supabase
        .from("roadmap_risks")
        .insert(risksData);

      if (risksError) throw risksError;

      toast.success(`${template.name} template created successfully`);
      onOpenChange(false);
      navigate(`/roadmaps/${roadmap.id}`);
    } catch (error) {
      console.error("Error cloning template:", error);
      toast.error("Failed to create roadmap from template");
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose a Template</DialogTitle>
          <DialogDescription>
            Start with a pre-built roadmap template and customize it to your needs
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {TEMPLATES.map((template) => (
            <Card
              key={template.id}
              className="p-6 hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  {template.icon}
                </div>
                
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{template.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Target className="w-4 h-4" />
                      <span>{template.milestones} milestones</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{template.risks} risks</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {template.stages.map((stage) => (
                      <Badge
                        key={stage.name}
                        variant="outline"
                        style={{ borderColor: stage.color, color: stage.color }}
                      >
                        {stage.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => handleCloneTemplate(template)}
                  disabled={isCloning}
                  className="flex-shrink-0"
                >
                  Use Template
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
