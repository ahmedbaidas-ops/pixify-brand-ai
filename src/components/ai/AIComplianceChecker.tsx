import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, AlertTriangle, CheckCircle2, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { useBrandBrain } from "@/hooks/useBrandBrain";

interface AIComplianceCheckerProps {
  content: string;
  contentType?: "copy" | "design" | "asset" | "general";
  onFix?: (suggestions: string) => void;
  className?: string;
}

const AIComplianceChecker = ({
  content,
  contentType = "general",
  onFix,
  className = ""
}: AIComplianceCheckerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const { isLoading, response, checkCompliance } = useBrandBrain();

  const handleCheck = async () => {
    setIsOpen(true);
    const result = await checkCompliance(
      `Content type: ${contentType}\n\nContent to check:\n${content}`
    );
    
    // Try to extract score from response
    if (result) {
      const scoreMatch = result.match(/(\d{1,3})(?:\/100|%| out of 100)/i);
      if (scoreMatch) {
        setScore(parseInt(scoreMatch[1]));
      }
    }
  };

  const getScoreColor = () => {
    if (!score) return "bg-muted";
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreLabel = () => {
    if (!score) return "Checking...";
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Needs Work";
    return "Non-Compliant";
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 border-primary/20 hover:border-primary/40 ${className}`}
          onClick={handleCheck}
        >
          <ShieldCheck className="h-4 w-4 text-primary" />
          Check Compliance
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] bg-background/95 backdrop-blur-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            Brand Compliance Check
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Score Card */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary"
                />
                <span className="mt-4 text-sm text-muted-foreground">
                  Analyzing brand compliance...
                </span>
              </motion.div>
            ) : score !== null ? (
              <motion.div
                key="score"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={352}
                      initial={{ strokeDashoffset: 352 }}
                      animate={{ strokeDashoffset: 352 - (352 * score) / 100 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      transform="rotate(-90 64 64)"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-bold">{score}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </div>
                <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  score >= 80 
                    ? "bg-green-500/10 text-green-500" 
                    : score >= 60 
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-red-500/10 text-red-500"
                }`}>
                  {score >= 80 ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  {getScoreLabel()}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Detailed Feedback */}
          {response && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h4 className="text-sm font-medium">Detailed Analysis</h4>
              <div className="p-4 rounded-lg bg-muted/30 text-sm leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                {response}
              </div>

              {onFix && score !== null && score < 80 && (
                <Button
                  className="w-full"
                  onClick={() => {
                    onFix(response);
                    setIsOpen(false);
                  }}
                >
                  Apply AI Suggestions
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AIComplianceChecker;
