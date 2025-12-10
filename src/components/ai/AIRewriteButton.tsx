import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Copy, Check, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useBrandBrain } from "@/hooks/useBrandBrain";
import { toast } from "sonner";

interface AIRewriteButtonProps {
  selectedText: string;
  onRewrite?: (newText: string) => void;
  context?: string;
  className?: string;
}

const AIRewriteButton = ({
  selectedText,
  onRewrite,
  context = "general marketing copy",
  className = ""
}: AIRewriteButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedResult, setEditedResult] = useState("");
  const { isLoading, response, rewrite, clearResponse } = useBrandBrain();

  const handleRewrite = async () => {
    setIsOpen(true);
    const result = await rewrite(selectedText, context);
    if (result) {
      setEditedResult(result);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedResult || response || "");
    toast.success("Copied to clipboard");
  };

  const handleApply = () => {
    if (onRewrite && (editedResult || response)) {
      onRewrite(editedResult || response || "");
      toast.success("Applied brand voice rewrite");
    }
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditedResult("");
    clearResponse();
  };

  const handleRegenerate = async () => {
    const result = await rewrite(selectedText, context);
    if (result) {
      setEditedResult(result);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={`gap-2 text-muted-foreground hover:text-primary ${className}`}
        onClick={handleRewrite}
        disabled={!selectedText}
      >
        <Wand2 className="h-4 w-4" />
        Rewrite in Brand Voice
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg bg-background/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Wand2 className="h-4 w-4 text-primary" />
              </div>
              Brand Voice Rewrite
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Original text */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Original
              </label>
              <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                {selectedText}
              </div>
            </div>

            {/* AI Result */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Brand Voice Version
              </label>
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-6 rounded-lg bg-muted/30"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <RefreshCw className="h-4 w-4 text-primary" />
                    </motion.div>
                    <span className="text-sm text-muted-foreground">
                      Rewriting in Qatar Airways brand voice...
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Textarea
                      value={editedResult || response || ""}
                      onChange={(e) => setEditedResult(e.target.value)}
                      className="min-h-[120px] resize-none"
                      placeholder="AI rewrite will appear here..."
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Regenerate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!response && !editedResult}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleApply}
                  disabled={!response && !editedResult}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIRewriteButton;
