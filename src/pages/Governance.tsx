import { ArrowLeft, Upload, FolderOpen, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const stats = [
  { value: "4", label: "Open findings", sub: "across all touchpoints", color: "text-[hsl(0_60%_50%)]" },
  { value: "71%", label: "Asset pass rate", sub: "29% have compliance issues", color: "text-[hsl(35_75%_45%)]" },
  { value: "3", label: "Touchpoints monitored", sub: "Last scan 4h ago", color: "text-[hsl(140_50%_30%)]" },
  { value: "47", label: "Active rules", sub: "from guidelines v3.2", color: "text-foreground" },
];

const open = [
  { sev: "warn", title: "Off-palette color #2A8F4C — 3 instances detected", source: "cokelight.com/promo", channel: "Website", detected: "2h ago", rule: "§3.1 Color" },
  { sev: "warn", title: "Headline uses Bebas Neue, not Coca-Cola Unity Headline", source: "Promo Banner 1080×1080", channel: "Asset", detected: "4h ago", rule: "§3.2 Typography" },
  { sev: "error", title: "Off-palette color + logo clear-space violation (12px, min 24px)", source: "Q4 Email Header", channel: "Asset", detected: "1d ago", rule: "§3.1 · §2.3" },
  { sev: "warn", title: "Heavy warmth filter on product hero image", source: "@cocacolalight post", channel: "Instagram", detected: "2d ago", rule: "§6.2 Imagery" },
];

export default function Governance() {
  const [tab, setTab] = useState<"open" | "resolved" | "rules">("open");

  return (
    <div className="px-8 py-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm hover:text-muted-foreground mb-3"><ArrowLeft className="h-4 w-4" />Back</Link>
          <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-1">Coca-Cola Light</div>
          <h1 className="text-3xl font-serif">Brand Governance</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-lg"><Upload className="h-3.5 w-3.5 mr-2" />Check asset</Button>
          <Button variant="outline" size="sm" className="rounded-lg"><RefreshCw className="h-3.5 w-3.5 mr-2" />Re-scan touchpoints</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border/60 bg-card p-5">
            <div className={`text-3xl font-serif ${s.color}`}>{s.value}</div>
            <div className="text-sm font-medium mt-1">{s.label}</div>
            <div className="text-[11px] text-muted-foreground">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5 flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-muted/40 flex items-center justify-center"><Upload className="h-5 w-5 text-muted-foreground" /></div>
        <div className="flex-1">
          <div className="text-sm font-medium">Drop an asset here to check compliance</div>
          <div className="text-xs text-muted-foreground">AI checks color, typography, logo, tone of voice, imagery — in seconds. Compliant assets go straight to the library.</div>
        </div>
        <Button variant="outline" size="sm" className="rounded-lg"><FolderOpen className="h-3.5 w-3.5 mr-2" />Browse files</Button>
      </div>

      <div className="space-y-3">
        <div className="inline-flex rounded-lg border border-border/60 bg-muted/30 p-0.5 text-xs">
          {[{ k: "open", l: `Open (4)` }, { k: "resolved", l: `Resolved (1)` }, { k: "rules", l: `Rules (47)` }].map((t) => (
            <button key={t.k} onClick={() => setTab(t.k as any)} className={`px-3 py-1.5 rounded-md transition-colors ${tab === t.k ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`}>{t.l}</button>
          ))}
        </div>

        {tab === "open" && (
          <div className="space-y-2">
            {open.map((f, i) => (
              <div key={i} className="rounded-xl border border-border/60 bg-card p-4 flex items-center gap-4">
                <div className={`h-8 w-8 rounded-md flex items-center justify-center ${f.sev === "error" ? "bg-[hsl(0_60%_95%)]" : "bg-[hsl(40_70%_92%)]"}`}>
                  {f.sev === "error" ? <XCircle className="h-4 w-4 text-[hsl(0_60%_50%)]" /> : <AlertTriangle className="h-4 w-4 text-[hsl(35_75%_45%)]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{f.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Source: <span className="text-foreground">{f.source}</span> &nbsp;·&nbsp; Channel: <span className="text-foreground">{f.channel}</span> &nbsp;·&nbsp; Detected: <span className="text-foreground">{f.detected}</span></div>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-md bg-muted/40 text-muted-foreground whitespace-nowrap">{f.rule}</span>
                <Button size="sm" className="h-8 rounded-full bg-foreground text-background hover:bg-foreground/90 text-xs px-4">Resolve</Button>
              </div>
            ))}
          </div>
        )}
        {tab === "resolved" && (
          <div className="rounded-xl border border-border/60 bg-card p-8 text-center text-sm text-muted-foreground">1 resolved finding</div>
        )}
        {tab === "rules" && (
          <div className="rounded-xl border border-border/60 bg-card p-8 text-center text-sm text-muted-foreground">47 active rules from guidelines v3.2</div>
        )}
      </div>
    </div>
  );
}