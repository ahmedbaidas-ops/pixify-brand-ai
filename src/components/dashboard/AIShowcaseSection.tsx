import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Wand2, ShieldCheck, Lightbulb, MessageSquare, 
  Play, ChevronRight, Copy, Check, RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBrandBrain } from "@/hooks/useBrandBrain";
import { toast } from "sonner";

interface DemoItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  prompt: string;
  category: "understand" | "create" | "check";
}

const demoItems: DemoItem[] = [
  {
    id: "explain-tone",
    title: "Explain brand tone",
    description: "Understand your voice guidelines",
    icon: MessageSquare,
    prompt: "Explain our brand tone of voice in simple terms with examples",
    category: "understand"
  },
  {
    id: "rewrite-copy",
    title: "Rewrite in brand voice",
    description: "Transform any text",
    icon: Wand2,
    prompt: "Rewrite this in Qatar Airways brand voice: 'Book a flight today and get cheap tickets!'",
    category: "create"
  },
  {
    id: "check-compliance",
    title: "Check brand compliance",
    description: "Audit content for consistency",
    icon: ShieldCheck,
    prompt: "Check brand compliance for this headline: 'AMAZING DEALS! Fly cheap with us NOW!!!'",
    category: "check"
  },
  {
    id: "color-usage",
    title: "Color usage rules",
    description: "Learn when to use each color",
    icon: Sparkles,
    prompt: "When should I use Qatar Maroon vs Desert Sand in my designs?",
    category: "understand"
  },
  {
    id: "suggest-headline",
    title: "Suggest headlines",
    description: "Get brand-aligned options",
    icon: Lightbulb,
    prompt: "Suggest 3 headlines for a Ramadan campaign that match our brand archetype",
    category: "create"
  }
];

const AIShowcaseSection = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [demoResponse, setDemoResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { isLoading, ask } = useBrandBrain();

  const handleDemoClick = async (demo: DemoItem) => {
    setActiveDemo(demo.id);
    setDemoResponse(null);
    
    const result = await ask(demo.prompt, 
      demo.category === "create" ? "rewrite" : 
      demo.category === "check" ? "check" : "explain"
    );
    
    if (result) {
      setDemoResponse(result);
    }
  };

  const handleCopy = () => {
    if (demoResponse) {
      navigator.clipboard.writeText(demoResponse);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setActiveDemo(null);
    setDemoResponse(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "understand": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "create": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "check": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-primary/5 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Brand Brain AI</CardTitle>
              <CardDescription className="text-sm">
                See what AI can do for your brand
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Powered by Lovable AI
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Category Pills */}
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">Understand</span>
          <span className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-500">Create</span>
          <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500">Check</span>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {demoItems.map((demo) => (
            <motion.button
              key={demo.id}
              onClick={() => handleDemoClick(demo)}
              disabled={isLoading}
              className={`group relative text-left p-4 rounded-xl border transition-all duration-200
                ${activeDemo === demo.id 
                  ? "border-primary bg-primary/5 shadow-md" 
                  : "border-border/50 bg-background/50 hover:border-primary/30 hover:bg-muted/30"
                }
                ${isLoading && activeDemo === demo.id ? "animate-pulse" : ""}
              `}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-start gap-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${getCategoryColor(demo.category)}`}>
                  <demo.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium mb-0.5 truncate">{demo.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{demo.description}</p>
                </div>
                <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 mt-0.5
                  ${activeDemo === demo.id ? "rotate-90" : "group-hover:translate-x-0.5"}`} 
                />
              </div>
              
              {/* Play indicator */}
              {activeDemo !== demo.id && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-medium text-primary">
                    <Play className="h-4 w-4" />
                    Try this
                  </div>
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Response Area */}
        <AnimatePresence mode="wait">
          {(isLoading || demoResponse) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl bg-muted/50 border border-border/50 p-4">
                {isLoading ? (
                  <div className="flex items-center gap-3 py-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <RefreshCw className="h-5 w-5 text-primary" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-medium">Brand Brain is thinking...</p>
                      <p className="text-xs text-muted-foreground">
                        Analyzing against Qatar Airways brand guidelines
                      </p>
                    </div>
                  </div>
                ) : demoResponse ? (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">AI Response</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={handleCopy}
                        >
                          {copied ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <Copy className="h-3 w-3 mr-1" />
                          )}
                          {copied ? "Copied" : "Copy"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={handleClear}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 max-h-64 overflow-y-auto">
                      {demoResponse}
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint */}
        {!activeDemo && !demoResponse && (
          <p className="text-xs text-muted-foreground text-center py-2">
            Click any card above to see Brand Brain AI in action
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AIShowcaseSection;
