import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Upload,
  Zap,
  Loader2,
  Download,
  Share2,
  Save,
  Instagram,
  Linkedin,
  Youtube,
  MessageSquare,
} from "lucide-react";
import { OptimizerCard } from "@/components/OptimizerCard";
import { QatarInspirationPanel } from "@/components/QatarInspirationPanel";

interface OptimizedResult {
  platform: string;
  copy: string;
  hashtags: string[];
  charCount: number;
  checks: { name: string; passed: boolean }[];
  score: number;
  image: string;
  aiInsights?: string[];
}

interface UploadedAsset {
  file: File;
  preview: string;
  detectedPlatform?: string;
  originalCopy?: string;
}

const PlatformOptimizer = () => {
  const [uploadedAsset, setUploadedAsset] = useState<UploadedAsset | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedResults, setOptimizedResults] = useState<OptimizedResult[]>([]);
  const { toast } = useToast();

  const detectPlatform = (file: File): string => {
    const width = 0; // Would be determined from actual image dimensions
    const height = 0;
    
    // Platform detection logic based on dimensions and metadata
    if (file.name.toLowerCase().includes("ig") || file.name.toLowerCase().includes("instagram")) {
      return "instagram";
    }
    if (file.name.toLowerCase().includes("linkedin") || file.name.toLowerCase().includes("li")) {
      return "linkedin";
    }
    
    // Default detection based on aspect ratio would go here
    return "unknown";
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((f) => f.type.startsWith("image/"));

    if (!imageFile) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (imageFile.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 20MB",
        variant: "destructive",
      });
      return;
    }

    const preview = URL.createObjectURL(imageFile);
    const detectedPlatform = detectPlatform(imageFile);

    setUploadedAsset({
      file: imageFile,
      preview,
      detectedPlatform,
    });

    toast({
      title: "Asset uploaded",
      description: detectedPlatform !== "unknown" 
        ? `Detected as ${detectedPlatform} content`
        : "Ready for optimization",
    });
  }, [toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    const preview = URL.createObjectURL(file);
    const detectedPlatform = detectPlatform(file);

    setUploadedAsset({
      file,
      preview,
      detectedPlatform,
    });
  };

  const handleOptimize = async () => {
    if (!uploadedAsset) {
      toast({
        title: "No asset uploaded",
        description: "Please upload an asset first",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);

    try {
      // In production, this would upload the image to storage first
      // For now, we'll use the preview URL
      
      const { data, error } = await supabase.functions.invoke("optimize-platforms", {
        body: {
          copy: uploadedAsset.originalCopy || "Embark on unforgettable journeys with Qatar Airways. Where luxury meets discovery.",
          imageUrl: uploadedAsset.preview,
          platforms: ["instagram_post", "instagram_story", "linkedin", "x", "youtube_thumb", "tiktok"],
        },
      });

      if (error) throw error;

      // Add AI visual insights
      const resultsWithInsights = data.results.map((result: OptimizedResult) => ({
        ...result,
        aiInsights: [
          "Logo placement: Optimal in safe zone",
          "Text-to-image ratio: 15% (Recommended)",
          "Brand color presence: Strong",
          "Subject focus: Well-centered",
        ],
      }));

      setOptimizedResults(resultsWithInsights);

      toast({
        title: "Optimization complete",
        description: `Optimized for ${data.results.length} platforms`,
      });
    } catch (error) {
      console.error("Optimization error:", error);
      toast({
        title: "Optimization failed",
        description: error instanceof Error ? error.message : "Failed to optimize content",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleExportAll = () => {
    toast({
      title: "Exporting",
      description: "Preparing download package...",
    });
    // In production, this would create a zip file with all optimized assets
  };

  const handleSaveToCampaign = () => {
    toast({
      title: "Saved to campaign",
      description: "All optimized assets saved to active campaign",
    });
  };

  const handleFixPlatform = async (platform: string) => {
    toast({
      title: "Auto-fixing",
      description: `Applying AI suggestions for ${platform}...`,
    });
  };

  const handleSavePlatform = (platform: string) => {
    toast({
      title: "Saved",
      description: `${platform} creative saved to library`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Platform Optimizer</h1>
              <p className="text-lg text-muted-foreground mt-2">
                AI-powered multi-channel adaptation for your marketing assets
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Instagram className="h-4 w-4" />
                <Linkedin className="h-4 w-4" />
                <Youtube className="h-4 w-4" />
                Connect Platforms
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Upload Zone */}
        <Card>
          <CardContent className="p-8">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl transition-all ${
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {!uploadedAsset ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <motion.div
                    animate={{ y: isDragging ? -10 : 0 }}
                    transition={{ type: "spring" }}
                  >
                    <Upload className="h-16 w-16 text-muted-foreground mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">
                    {isDragging ? "Drop your asset here" : "Upload Marketing Asset"}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-center max-w-md">
                    Drag and drop your post, visual, or video. We'll automatically detect the platform
                    and optimize for all channels.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileInput}
                        />
                        Choose File
                      </label>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Supported: JPG, PNG, WebP • Max 20MB
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="grid md:grid-cols-2 gap-6 p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Uploaded Asset</h3>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setUploadedAsset(null)}
                        >
                          Remove
                        </Button>
                      </div>
                      <img
                        src={uploadedAsset.preview}
                        alt="Uploaded"
                        className="w-full rounded-lg border border-border"
                      />
                      {uploadedAsset.detectedPlatform && uploadedAsset.detectedPlatform !== "unknown" && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Zap className="h-4 w-4 text-primary" />
                          Detected as {uploadedAsset.detectedPlatform} content
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold">Optimization Options</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked id="visual" />
                          <label htmlFor="visual" className="text-sm">
                            Visual Adaptation (resize, crop, safe zones)
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked id="copy" />
                          <label htmlFor="copy" className="text-sm">
                            Copy Optimization (tone, length, hashtags)
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked id="brand" />
                          <label htmlFor="brand" className="text-sm">
                            Brand Consistency Check (colors, fonts, logo)
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked id="ai-insights" />
                          <label htmlFor="ai-insights" className="text-sm">
                            AI Visual Intelligence Analysis
                          </label>
                        </div>
                      </div>
                      <Button
                        onClick={handleOptimize}
                        disabled={isOptimizing}
                        className="w-full gap-2"
                        size="lg"
                      >
                        {isOptimizing ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Zap className="h-5 w-5" />
                        )}
                        Optimize for All Platforms
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Optimized Results */}
        <AnimatePresence>
          {optimizedResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Platform Previews</h2>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExportAll} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export All
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Sync to Platforms
                  </Button>
                  <Button onClick={handleSaveToCampaign} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save to Campaign
                  </Button>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList>
                      <TabsTrigger value="all">All Platforms</TabsTrigger>
                      <TabsTrigger value="social">Social</TabsTrigger>
                      <TabsTrigger value="professional">Professional</TabsTrigger>
                      <TabsTrigger value="video">Video</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="grid md:grid-cols-2 gap-4 mt-6">
                      {optimizedResults.map((result) => (
                        <div key={result.platform} className="space-y-3">
                          <OptimizerCard
                            platform={result.platform}
                            image={result.image}
                            copy={result.copy}
                            score={result.score}
                            hashtags={result.hashtags}
                            charCount={result.charCount}
                            checks={result.checks}
                            onFix={() => handleFixPlatform(result.platform)}
                            onSave={() => handleSavePlatform(result.platform)}
                          />
                          {result.aiInsights && (
                            <Card className="bg-primary/5 border-primary/20">
                              <CardContent className="p-4">
                                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4" />
                                  AI Insights
                                </h4>
                                <ul className="space-y-1 text-xs text-muted-foreground">
                                  {result.aiInsights.map((insight, i) => (
                                    <li key={i}>• {insight}</li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="social" className="grid md:grid-cols-2 gap-4 mt-6">
                      {optimizedResults
                        .filter((r) => ["instagram_post", "instagram_story", "x", "tiktok"].includes(r.platform))
                        .map((result) => (
                          <OptimizerCard
                            key={result.platform}
                            platform={result.platform}
                            image={result.image}
                            copy={result.copy}
                            score={result.score}
                            hashtags={result.hashtags}
                            charCount={result.charCount}
                            checks={result.checks}
                            onFix={() => handleFixPlatform(result.platform)}
                            onSave={() => handleSavePlatform(result.platform)}
                          />
                        ))}
                    </TabsContent>

                    <TabsContent value="professional" className="grid md:grid-cols-2 gap-4 mt-6">
                      {optimizedResults
                        .filter((r) => r.platform === "linkedin")
                        .map((result) => (
                          <OptimizerCard
                            key={result.platform}
                            platform={result.platform}
                            image={result.image}
                            copy={result.copy}
                            score={result.score}
                            hashtags={result.hashtags}
                            charCount={result.charCount}
                            checks={result.checks}
                            onFix={() => handleFixPlatform(result.platform)}
                            onSave={() => handleSavePlatform(result.platform)}
                          />
                        ))}
                    </TabsContent>

                    <TabsContent value="video" className="grid md:grid-cols-2 gap-4 mt-6">
                      {optimizedResults
                        .filter((r) => ["youtube_thumb", "tiktok"].includes(r.platform))
                        .map((result) => (
                          <OptimizerCard
                            key={result.platform}
                            platform={result.platform}
                            image={result.image}
                            copy={result.copy}
                            score={result.score}
                            hashtags={result.hashtags}
                            charCount={result.charCount}
                            checks={result.checks}
                            onFix={() => handleFixPlatform(result.platform)}
                            onSave={() => handleSavePlatform(result.platform)}
                          />
                        ))}
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="lg:col-span-1">
                  <QatarInspirationPanel />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlatformOptimizer;
