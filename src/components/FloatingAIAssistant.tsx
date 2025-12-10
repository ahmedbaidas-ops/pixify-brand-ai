import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Mic, Send, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

const FloatingAIAssistant = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const location = useLocation();

  // Don't show on dashboard (has its own AI assistant)
  if (location.pathname === "/dashboard") {
    return null;
  }

  const handleSubmit = () => {
    if (query.trim()) {
      console.log("AI Query:", query);
      setQuery("");
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setIsExpanded(false);
    }
  };

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="collapsed"
            onClick={() => setIsExpanded(true)}
            className="group relative flex items-center gap-3 px-5 py-3 rounded-full 
                       bg-background/60 backdrop-blur-xl border border-border/40
                       shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20
                       transition-all duration-300 hover:bg-background/80"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Plus button */}
            <div className="flex items-center justify-center h-8 w-8 rounded-full 
                            bg-muted/80 text-muted-foreground
                            group-hover:bg-primary/10 group-hover:text-primary
                            transition-colors duration-300">
              <Plus className="h-4 w-4" />
            </div>

            {/* Ask AI text */}
            <span className="text-sm font-medium text-muted-foreground 
                           group-hover:text-foreground transition-colors duration-300
                           pr-2">
              Ask AI
            </span>

            {/* Voice button */}
            <div className="flex items-center justify-center h-10 w-14 rounded-full 
                            bg-foreground text-background
                            group-hover:bg-primary transition-colors duration-300">
              <div className="flex items-center gap-0.5">
                <motion.div
                  className="w-0.5 h-3 bg-current rounded-full"
                  animate={{ scaleY: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                />
                <motion.div
                  className="w-0.5 h-4 bg-current rounded-full"
                  animate={{ scaleY: [1, 0.6, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0.1 }}
                />
                <motion.div
                  className="w-0.5 h-3 bg-current rounded-full"
                  animate={{ scaleY: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                />
              </div>
            </div>

            {/* Sparkle indicator */}
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Sparkles className="h-3 w-3 text-primary" />
            </motion.div>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            className="relative flex items-center gap-2 px-4 py-3 rounded-2xl 
                       bg-background/80 backdrop-blur-xl border border-border/40
                       shadow-2xl shadow-black/20 min-w-[400px] max-w-[500px]"
            initial={{ scale: 0.9, opacity: 0, width: 200 }}
            animate={{ scale: 1, opacity: 1, width: "auto" }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => setIsExpanded(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Input */}
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about brand guidelines, assets..."
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 
                         placeholder:text-muted-foreground/60 text-sm"
            />

            {/* Action buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className={`h-9 w-9 rounded-full transition-colors ${
                  isListening 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsListening(!isListening)}
              >
                <Mic className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                className="h-10 w-10 rounded-full bg-foreground text-background 
                           hover:bg-primary transition-colors"
                onClick={handleSubmit}
                disabled={!query.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FloatingAIAssistant;
