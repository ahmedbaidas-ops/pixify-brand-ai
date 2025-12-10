import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Mic, Send, X, Sparkles, RefreshCw, Copy, Wand2, ShieldCheck, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useBrandBrain } from "@/hooks/useBrandBrain";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickActions = [
  { icon: Wand2, label: "Rewrite in brand voice", action: "rewrite" },
  { icon: ShieldCheck, label: "Check compliance", action: "check" },
  { icon: Lightbulb, label: "Get suggestions", action: "suggest" },
];

const FloatingAIAssistant = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showChat, setShowChat] = useState(false);
  const location = useLocation();
  const { isLoading, ask } = useBrandBrain();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Don't show on dashboard (has its own AI assistant)
  if (location.pathname === "/dashboard") {
    return null;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!query.trim() || isLoading) return;

    const userMessage = query.trim();
    setQuery("");
    setShowChat(true);
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);

    const result = await ask(userMessage, "general");
    if (result) {
      setMessages(prev => [...prev, { role: "assistant", content: result }]);
    }
  };

  const handleQuickAction = async (action: string) => {
    const selectedText = window.getSelection()?.toString() || "";
    const prompt = selectedText 
      ? `${action === "rewrite" ? "Rewrite this in brand voice" : action === "check" ? "Check brand compliance" : "Suggest improvements for"}: ${selectedText}`
      : `Help me ${action === "rewrite" ? "rewrite content in Qatar Airways brand voice" : action === "check" ? "check something for brand compliance" : "get brand suggestions"}`;
    
    setShowChat(true);
    setMessages(prev => [...prev, { role: "user", content: prompt }]);
    
    const result = await ask(prompt, action as any);
    if (result) {
      setMessages(prev => [...prev, { role: "assistant", content: result }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setIsExpanded(false);
      setShowChat(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleClose = () => {
    setIsExpanded(false);
    setShowChat(false);
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
              Ask Brand Brain
            </span>

            {/* Voice indicator */}
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
            className="relative flex flex-col rounded-2xl 
                       bg-background/95 backdrop-blur-xl border border-border/40
                       shadow-2xl shadow-black/20 w-[420px] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, height: 60 }}
            animate={{ scale: 1, opacity: 1, height: showChat ? 400 : "auto" }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm font-medium">Brand Brain</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            {!showChat && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2 px-4 py-3"
              >
                {quickActions.map((action) => (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs gap-1.5 border-border/40 hover:bg-primary/5 hover:border-primary/30"
                    onClick={() => handleQuickAction(action.action)}
                    disabled={isLoading}
                  >
                    <action.icon className="h-3 w-3" />
                    {action.label.split(" ")[0]}
                  </Button>
                ))}
              </motion.div>
            )}

            {/* Chat Messages */}
            {showChat && (
              <ScrollArea className="flex-1 px-4 py-3">
                <div className="space-y-4">
                  {messages.map((message, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted/60 text-foreground rounded-bl-md"
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        {message.role === "assistant" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 mt-2 text-xs opacity-60 hover:opacity-100"
                            onClick={() => handleCopy(message.content)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </motion.div>
                      Thinking...
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-border/30">
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about brand guidelines, tone, colors..."
                className="flex-1 border-0 bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary/30 
                           placeholder:text-muted-foreground/50 text-sm h-10 rounded-xl"
                disabled={isLoading}
              />
              <Button
                size="icon"
                className="h-10 w-10 rounded-xl bg-foreground text-background 
                           hover:bg-primary transition-colors shrink-0"
                onClick={handleSubmit}
                disabled={!query.trim() || isLoading}
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
