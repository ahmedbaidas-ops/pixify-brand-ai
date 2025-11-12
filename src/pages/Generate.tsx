import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Sparkles,
  Image as ImageIcon,
  Type,
  Loader2,
  Download,
  Copy,
  RefreshCw,
  Save,
  Wand2,
  Zap,
} from "lucide-react";
import { OptimizerCard } from "@/components/OptimizerCard";
import { QatarInspirationPanel } from "@/components/QatarInspirationPanel";

interface GeneratedContent {
  type: "image" | "copy";
  content: string;
  prompt: string;
}

interface OptimizedResult {
  platform: string;
  copy: string;
  hashtags: string[];
  charCount: number;
  checks: { name: string; passed: boolean }[];
  score: number;
  image: string;
}

const Generate = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [activeTab, setActiveTab] = useState("visual");
  const [optimizedResults, setOptimizedResults] = useState<OptimizedResult[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  const visualChips = [
    "Instagram photo",
    "LinkedIn banner",
    "Story ad",
    "Email banner",
    "YouTube thumbnail",
    "Website hero",
  ];

  const copyChips = [
    "LinkedIn post",
    "Instagram caption",
    "Twitter thread",
    "Press headline",
    "Newsletter paragraph",
  ];

  const hybridChips = [
    "Campaign key visual + caption",
    "Flight offer ad set",
    "CSR post",
    "Loyalty push creative",
  ];

  const handleChipClick = (chip: string) => {
    setPrompt(chip);
    // Simulate typing animation
    const text = chip;
    setPrompt("");
    let i = 0;
    const interval = setInterval(() => {
      setPrompt(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, 30);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter what you'd like to generate",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      if (activeTab === "visual" || activeTab === "hybrid") {
        // Generate image
        const { data: imageData, error: imageError } = await supabase.functions.invoke(
          "generate-brand-image",
          {
            body: { prompt, brandContext: "Qatar Airways" },
          }
        );

        if (imageError) throw imageError;

        if (imageData?.image) {
          setGeneratedContent((prev) => [
            ...prev,
            {
              type: "image",
              content: imageData.image,
              prompt,
            },
          ]);
        }
      }

      if (activeTab === "copy" || activeTab === "hybrid") {
        // Generate copy
        const { data: copyData, error: copyError } = await supabase.functions.invoke(
          "generate-brand-copy",
          {
            body: { prompt, brandContext: "Qatar Airways" },
          }
        );

        if (copyError) throw copyError;

        if (copyData?.copy) {
          setGeneratedContent((prev) => [
            ...prev,
            {
              type: "copy",
              content: copyData.copy,
              prompt,
            },
          ]);
        }
      }

      toast({
        title: "Generated successfully",
        description: "Your brand-aligned content is ready",
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate content",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Content copied successfully",
    });
  };

  const downloadImage = (imageUrl: string, promptText: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${promptText.slice(0, 30).replace(/\s/g, "-")}.png`;
    link.click();
  };

  const handleOptimize = async () => {
    const lastImage = generatedContent.find((item) => item.type === "image");
    const lastCopy = generatedContent.find((item) => item.type === "copy");

    if (!lastImage && !lastCopy) {
      toast({
        title: "No content to optimize",
        description: "Generate some content first",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);

    try {
      const { data, error } = await supabase.functions.invoke("optimize-platforms", {
        body: {
          copy: lastCopy?.content || prompt,
          imageUrl: lastImage?.content || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1080",
          platforms: ["instagram_post", "instagram_story", "linkedin", "x", "youtube_thumb", "tiktok"],
        },
      });

      if (error) throw error;

      setOptimizedResults(data.results);
      toast({
        title: "Optimized successfully",
        description: "Content optimized for all platforms",
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

  const handleFixPlatform = async (platform: string) => {
    toast({
      title: "Auto-fixing",
      description: `Applying fixes for ${platform}...`,
    });
    // In production, this would re-optimize with stricter constraints
  };

  const handleSavePlatform = (platform: string) => {
    toast({
      title: "Saved to DAM",
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
          className="text-center space-y-3"
        >
          <div className="flex items-center justify-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles className="h-10 w-10 text-primary" />
            </motion.div>
            <h1 className="text-4xl font-bold">AI Brand Generator</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Create brand-aligned visuals and copy powered by your brand guidelines
          </p>
        </motion.div>

        {/* Type Selection */}
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="visual" className="gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Visual
                </TabsTrigger>
                <TabsTrigger value="copy" className="gap-2">
                  <Type className="h-4 w-4" />
                  Copy
                </TabsTrigger>
                <TabsTrigger value="hybrid" className="gap-2">
                  <Wand2 className="h-4 w-4" />
                  Both
                </TabsTrigger>
                <TabsTrigger value="optimize" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Optimize
                </TabsTrigger>
              </TabsList>

              {/* Prompt Input */}
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    placeholder="What would you like to create?"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="pr-24 text-lg py-6"
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  />
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 gap-2"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    Generate
                  </Button>
                </div>

                {/* Context Chips */}
                <TabsContent value="visual" className="mt-4 space-y-3">
                  <p className="text-sm text-muted-foreground font-medium">Suggested formats:</p>
                  <div className="flex flex-wrap gap-2">
                    {visualChips.map((chip) => (
                      <motion.div
                        key={chip}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors py-2"
                          onClick={() => handleChipClick(chip)}
                        >
                          {chip}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="copy" className="mt-4 space-y-3">
                  <p className="text-sm text-muted-foreground font-medium">Suggested formats:</p>
                  <div className="flex flex-wrap gap-2">
                    {copyChips.map((chip) => (
                      <motion.div
                        key={chip}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors py-2"
                          onClick={() => handleChipClick(chip)}
                        >
                          {chip}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="hybrid" className="mt-4 space-y-3">
                  <p className="text-sm text-muted-foreground font-medium">Campaign suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {hybridChips.map((chip) => (
                      <motion.div
                        key={chip}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors py-2"
                          onClick={() => handleChipClick(chip)}
                        >
                          {chip}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="optimize" className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Auto-adapt your content to platform-specific best practices
                    </p>
                    <Button
                      onClick={handleOptimize}
                      disabled={isOptimizing || generatedContent.length === 0}
                      className="gap-2"
                    >
                      {isOptimizing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Zap className="h-4 w-4" />
                      )}
                      Optimize All
                    </Button>
                  </div>

                  {optimizedResults.length > 0 && (
                    <div className="grid lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 grid md:grid-cols-2 gap-4">
                        {optimizedResults.map((result) => (
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
                      </div>
                      <div className="lg:col-span-1">
                        <QatarInspirationPanel />
                      </div>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Generated Content */}
        <AnimatePresence>
          {generatedContent.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold">Generated Content</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {generatedContent.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <Badge variant="secondary" className="gap-1">
                            {item.type === "image" ? (
                              <ImageIcon className="h-3 w-3" />
                            ) : (
                              <Type className="h-3 w-3" />
                            )}
                            {item.type}
                          </Badge>
                          <div className="flex gap-2">
                            {item.type === "image" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadImage(item.content, item.prompt)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(item.content)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Save className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {item.type === "image" ? (
                          <div className="rounded-lg overflow-hidden border border-border">
                            <img
                              src={item.content}
                              alt={item.prompt}
                              className="w-full h-auto"
                            />
                          </div>
                        ) : (
                          <Textarea
                            value={item.content}
                            readOnly
                            className="min-h-[200px] font-mono text-sm"
                          />
                        )}

                        <p className="text-xs text-muted-foreground">
                          Prompt: {item.prompt}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brand Guidelines Reference */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Brand Context Applied
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Colors</p>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded bg-[#5C0A3A] border border-border" title="#5C0A3A" />
                  <div className="w-8 h-8 rounded bg-[#CBB59C] border border-border" title="#CBB59C" />
                  <div className="w-8 h-8 rounded bg-[#0F1020] border border-border" title="#0F1020" />
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Tone</p>
                <p className="font-medium">Warm, Elegant, Trustworthy</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Archetype</p>
                <p className="font-medium">Caregiver + Explorer</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Generate;
