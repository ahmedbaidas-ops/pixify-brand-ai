import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, Check, RefreshCw, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBrandBrain, BrandBrainAction } from "@/hooks/useBrandBrain";
import { toast } from "sonner";

interface AIActionButtonProps {
  content: string;
  context?: string;
  action?: BrandBrainAction;
  variant?: "icon" | "button" | "chip";
  label?: string;
  onResult?: (result: string) => void;
  className?: string;
}

const AIActionButton = ({
  content,
  context,
  action = "general",
  variant = "icon",
  label = "AI",
  onResult,
  className = ""
}: AIActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, response, ask, clearResponse } = useBrandBrain();

  const handleAction = async () => {
    const result = await ask(content, action, context);
    if (result && onResult) {
      onResult(result);
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      toast.success("Copied to clipboard");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    clearResponse();
  };

  const renderTrigger = () => {
    switch (variant) {
      case "chip":
        return (
          <Button
            variant="outline"
            size="sm"
            className={`h-7 px-3 gap-1.5 rounded-full text-xs font-medium 
                       border-primary/20 bg-primary/5 text-primary 
                       hover:bg-primary/10 hover:border-primary/40 
                       transition-all ${className}`}
          >
            <Sparkles className="h-3 w-3" />
            {label}
          </Button>
        );
      case "button":
        return (
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 text-muted-foreground hover:text-primary ${className}`}
          >
            <Wand2 className="h-4 w-4" />
            {label}
          </Button>
        );
      default:
        return (
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full text-muted-foreground 
                       hover:text-primary hover:bg-primary/10 
                       transition-all ${className}`}
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        );
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild onClick={() => !response && handleAction()}>
        {renderTrigger()}
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl"
        align="end"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm font-medium">Brand Brain</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleClose}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 py-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <RefreshCw className="h-4 w-4 text-primary" />
                </motion.div>
                <span className="text-sm text-muted-foreground">
                  Analyzing with Brand Brain...
                </span>
              </motion.div>
            ) : response ? (
              <motion.div
                key="response"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-sm text-foreground leading-relaxed max-h-64 overflow-y-auto pr-2 whitespace-pre-wrap">
                  {response}
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 text-xs"
                    onClick={handleCopy}
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 text-xs"
                    onClick={handleAction}
                  >
                    <RefreshCw className="h-3 w-3" />
                    Regenerate
                  </Button>
                  {onResult && (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 gap-1.5 text-xs ml-auto"
                      onClick={() => {
                        onResult(response);
                        handleClose();
                      }}
                    >
                      <Check className="h-3 w-3" />
                      Apply
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-4 text-sm text-muted-foreground text-center"
              >
                Click to analyze with AI
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AIActionButton;
