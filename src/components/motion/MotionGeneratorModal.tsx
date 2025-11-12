import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Video, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MotionGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetId?: string;
  brandId: string;
}

const stylePresets = [
  { id: "cinematic-glide", name: "Cinematic Glide", description: "Slow dolly, soft flare, premium texture" },
  { id: "maroon-silk", name: "Maroon Silk", description: "Fabric-like movement, elegant curved light" },
  { id: "doha-skyline", name: "Doha Skyline", description: "Horizon reveal, gentle parallax, gold hour tint" },
  { id: "product-parallax", name: "Product Parallax", description: "Shallow DOF, velvet texture, gentle pan" },
];

export function MotionGeneratorModal({ open, onOpenChange, assetId, brandId }: MotionGeneratorModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [outputId, setOutputId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("idle");

  // Animation params
  const [title, setTitle] = useState("");
  const [stylePreset, setStylePreset] = useState("cinematic-glide");
  const [duration, setDuration] = useState([5]);
  const [intensity, setIntensity] = useState([50]);
  const [cameraPath, setCameraPath] = useState("pan");

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title for your motion project");
      return;
    }

    setIsGenerating(true);
    setStatus("queued");

    try {
      const { data, error } = await supabase.functions.invoke('motion-create', {
        body: {
          title,
          brandId,
          sourceAssetId: assetId,
          mode: 'ANIMATE_THIS',
          params: {
            stylePreset,
            duration: duration[0],
            intensity: intensity[0],
            cameraPath,
          }
        }
      });

      if (error) throw error;

      setProjectId(data.project.id);
      setOutputId(data.output.id);
      setStatus(data.output.status);
      
      toast.success("Motion generation started!");
      
      // Poll for status
      pollStatus(data.output.id);
    } catch (error: any) {
      console.error('Error generating motion:', error);
      toast.error(error.message || "Failed to start motion generation");
      setIsGenerating(false);
      setStatus("failed");
    }
  };

  const pollStatus = async (outputId: string) => {
    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase.functions.invoke('motion-status', {
          body: { outputId }
        });

        if (error) throw error;

        setStatus(data.output.status);

        if (data.output.status === 'DONE') {
          clearInterval(interval);
          setIsGenerating(false);
          toast.success("Motion generated successfully!", {
            description: "Your animated asset is ready"
          });
        } else if (data.output.status === 'FAILED') {
          clearInterval(interval);
          setIsGenerating(false);
          toast.error("Motion generation failed");
        }
      } catch (error: any) {
        console.error('Error polling status:', error);
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 3000);

    // Clean up after 60 seconds
    setTimeout(() => clearInterval(interval), 60000);
  };

  const getStatusDisplay = () => {
    switch (status) {
      case 'QUEUED':
        return { text: 'Queued...', icon: Loader2, color: 'text-yellow-500' };
      case 'RENDERING':
        return { text: 'Rendering...', icon: Loader2, color: 'text-blue-500' };
      case 'DONE':
        return { text: 'Complete!', icon: Video, color: 'text-green-500' };
      case 'FAILED':
        return { text: 'Failed', icon: Video, color: 'text-red-500' };
      default:
        return null;
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Motion Asset Generator
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="animate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="animate">Animate This</TabsTrigger>
            <TabsTrigger value="script" disabled>Script-to-Video (Coming Soon)</TabsTrigger>
          </TabsList>

          <TabsContent value="animate" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Qatar Airways Hero Banner Animation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Style Preset</Label>
                <Select value={stylePreset} onValueChange={setStylePreset} disabled={isGenerating}>
                  <SelectTrigger id="style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stylePresets.map((preset) => (
                      <SelectItem key={preset.id} value={preset.id}>
                        <div>
                          <div className="font-medium">{preset.name}</div>
                          <div className="text-xs text-muted-foreground">{preset.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration: {duration[0]}s</Label>
                  <Slider
                    value={duration}
                    onValueChange={setDuration}
                    min={3}
                    max={7}
                    step={1}
                    disabled={isGenerating}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Motion Intensity: {intensity[0]}%</Label>
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    min={0}
                    max={100}
                    step={10}
                    disabled={isGenerating}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="camera">Camera Path</Label>
                <Select value={cameraPath} onValueChange={setCameraPath} disabled={isGenerating}>
                  <SelectTrigger id="camera">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pan">Smooth Pan</SelectItem>
                    <SelectItem value="dolly">Dolly Forward</SelectItem>
                    <SelectItem value="parallax">Parallax Effect</SelectItem>
                    <SelectItem value="zoom">Subtle Zoom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <AnimatePresence>
              {statusDisplay && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-4 rounded-lg bg-muted"
                >
                  <statusDisplay.icon className={`h-5 w-5 ${statusDisplay.color} ${status === 'RENDERING' ? 'animate-spin' : ''}`} />
                  <span className="font-medium">{statusDisplay.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Motion
                  </>
                )}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <strong>Note:</strong> This is a Phase 1 MVP with mock generation. In production, this will connect to Runway Gen-3 API for real video generation.
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}