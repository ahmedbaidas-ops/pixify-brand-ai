import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface TypewriterTextProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

const TypewriterText = ({
  texts,
  typingSpeed = 50,
  deletingSpeed = 30,
  pauseDuration = 2000,
  className = ""
}: TypewriterTextProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentFullText = texts[currentTextIndex];

  useEffect(() => {
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    if (isDeleting) {
      if (displayText.length === 0) {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        return;
      }
      const deleteTimer = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
      }, deletingSpeed);
      return () => clearTimeout(deleteTimer);
    }

    if (displayText.length === currentFullText.length) {
      setIsPaused(true);
      return;
    }

    const typeTimer = setTimeout(() => {
      setDisplayText(currentFullText.slice(0, displayText.length + 1));
    }, typingSpeed);

    return () => clearTimeout(typeTimer);
  }, [displayText, isDeleting, isPaused, currentFullText, texts.length, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle"
      />
    </span>
  );
};

// Animated example prompts that cycle through suggestions
const AnimatedAIExamples = ({ onExampleClick }: { onExampleClick: (text: string) => void }) => {
  const allExamples = [
    "Explain our brand tone of voice",
    "Rewrite this in brand voice: Book flights now!",
    "Is this headline on-brand?",
    "What are our primary colors?",
    "Suggest headlines for a campaign",
    "When should I use Qatar Maroon?",
  ];

  const [currentExample, setCurrentExample] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % allExamples.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-8 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.button
          key={currentExample}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          onClick={() => onExampleClick(allExamples[currentExample])}
          className="absolute inset-0 flex items-center gap-2 text-sm text-muted-foreground 
                     hover:text-primary transition-colors cursor-pointer group"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary/60 group-hover:text-primary shrink-0" />
          <span className="truncate">Try: &quot;{allExamples[currentExample]}&quot;</span>
        </motion.button>
      </AnimatePresence>
    </div>
  );
};

export { TypewriterText, AnimatedAIExamples };
