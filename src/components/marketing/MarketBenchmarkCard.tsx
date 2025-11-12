import { motion } from "framer-motion";
import { Target, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MarketBenchmarkCardProps {
  marketScore?: number;
  successRate?: number;
  competitor?: string;
  reasons?: string[];
}

export const MarketBenchmarkCard = ({
  marketScore = 0,
  successRate = 0,
  competitor,
  reasons = []
}: MarketBenchmarkCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Market Benchmark & Success Rate</h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Gauge label="Market Score" value={marketScore} />
            <Gauge label="Campaign Success Rate" value={successRate} accent />
            <div className="rounded-xl bg-muted/50 p-4 space-y-2">
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Closest Competitor
              </div>
              <div className="text-lg font-semibold text-foreground">
                {competitor || "—"}
              </div>
              {reasons.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <TrendingUp className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary/10 hover:bg-primary/20 px-4 py-2.5 text-sm font-medium text-primary transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              Recompute with latest competitor data
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface GaugeProps {
  label: string;
  value: number;
  accent?: boolean;
}

const Gauge = ({ label, value, accent = false }: GaugeProps) => {
  return (
    <div className="rounded-xl bg-muted/50 p-4 space-y-3">
      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
        {label}
      </div>
      <div className="text-3xl font-bold text-foreground">{value}%</div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${accent ? 'bg-primary' : 'bg-foreground/60'}`}
          transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.3 }}
        />
      </div>
    </div>
  );
};
