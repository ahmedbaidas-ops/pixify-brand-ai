import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Download, Wand2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OptimizerCardProps {
  platform: string;
  image: string;
  copy: string;
  score: number;
  hashtags: string[];
  charCount: number;
  checks: { name: string; passed: boolean }[];
  onFix: () => void;
  onSave: () => void;
}

export function OptimizerCard({
  platform,
  image,
  copy,
  score,
  hashtags,
  charCount,
  checks,
  onFix,
  onSave,
}: OptimizerCardProps) {
  const pass = score >= 85;
  const platformName = platform.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className="rounded-2xl border border-border bg-card p-4 shadow-lg transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold">{platformName}</div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            pass ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
          }`}
        >
          {pass ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
          {score}%
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative rounded-lg overflow-hidden mb-3"
      >
        <img src={image} className="w-full h-48 object-cover" alt={platformName} />
      </motion.div>

      <div className="space-y-2 mb-3">
        <p className="text-xs text-muted-foreground line-clamp-3">{copy}</p>
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {hashtags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          Characters: <span className="font-medium">{charCount}</span>
        </div>
      </div>

      <div className="space-y-1 mb-3">
        {checks.map((check, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            {check.passed ? (
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-3 w-3 text-amber-400" />
            )}
            <span className={check.passed ? "text-emerald-400" : "text-amber-400"}>{check.name}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onFix} className="flex-1">
          <Wand2 className="h-3.5 w-3.5 mr-1" />
          Auto-Fix
        </Button>
        <Button size="sm" variant="outline" onClick={onSave}>
          <Save className="h-3.5 w-3.5 mr-1" />
          Save
        </Button>
        <Button size="sm" variant="outline" asChild>
          <a href={image} download={`${platform}.png`}>
            <Download className="h-3.5 w-3.5" />
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
