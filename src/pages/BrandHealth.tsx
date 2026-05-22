import { ArrowLeft, RefreshCw, Download, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const categories = [
  { name: "Visual Identity", weight: 40, score: 82, color: "hsl(140 50% 40%)" },
  { name: "Messaging", weight: 30, score: 74, color: "hsl(35 75% 50%)" },
  { name: "Strategic Alignment", weight: 70, score: 80, color: "hsl(140 50% 40%)" },
  { name: "Governance", weight: 10, score: 65, color: "hsl(35 75% 50%)" },
];

const channels = ["Website", "Instagram", "LinkedIn"];

const channelData: Record<string, any> = {
  Website: { pages: 34, issues: 2, lastScan: "4h ago", rate: "83%", bars: [{ k: "Color", v: 78 }, { k: "Logo", v: 88 }, { k: "Typo", v: 91 }], issuesList: ["Off-palette color #2A8F4C on /promo", "Outdated logo variant in header"] },
  Instagram: { pages: 56, issues: 1, lastScan: "1h ago", rate: "92%", bars: [{ k: "Color", v: 88 }, { k: "Logo", v: 94 }, { k: "Typo", v: 96 }], issuesList: ["Heavy warmth filter on product hero"] },
  LinkedIn: { pages: 12, issues: 1, lastScan: "2d ago", rate: "75%", bars: [{ k: "Color", v: 70 }, { k: "Logo", v: 65 }, { k: "Typo", v: 80 }], issuesList: ["Outdated logo variant on cover image"] },
};

function Donut({ score = 78 }) {
  const r = 56; const c = 2 * Math.PI * r; const off = c - (score / 100) * c;
  return (
    <div className="relative h-36 w-36 mx-auto">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={r} stroke="hsl(var(--muted))" strokeWidth="10" fill="none" />
        <circle cx="70" cy="70" r={r} stroke="hsl(35 75% 50%)" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-serif">{score}</div>
        <div className="text-[10px] text-muted-foreground">/ 100</div>
        <div className="text-[10px] text-[hsl(15_70%_45%)] mt-1">↓ 4 this week</div>
      </div>
    </div>
  );
}

function LineChart() {
  const pts = [78, 79, 78, 76, 77, 75, 76, 78, 79, 80, 79, 81, 82, 78];
  const w = 800, h = 90, p = 20;
  const min = 70, max = 85;
  const path = pts.map((v, i) => {
    const x = p + (i / (pts.length - 1)) * (w - 2 * p);
    const y = p + (1 - (v - min) / (max - min)) * (h - 2 * p);
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h + 20}`} className="w-full">
      {Array.from({ length: pts.length }).map((_, i) => {
        const x = p + (i / (pts.length - 1)) * (w - 2 * p);
        return <line key={i} x1={x} y1={p - 4} x2={x} y2={h - p + 4} stroke="hsl(var(--border))" strokeWidth="0.5" />;
      })}
      <path d={path} stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" />
      {pts.map((v, i) => {
        const x = p + (i / (pts.length - 1)) * (w - 2 * p);
        const y = p + (1 - (v - min) / (max - min)) * (h - 2 * p);
        return <circle key={i} cx={x} cy={y} r="2" fill="hsl(var(--foreground))" />;
      })}
    </svg>
  );
}

export default function BrandHealth() {
  const [channel, setChannel] = useState("Website");
  const [range, setRange] = useState("30d");
  const d = channelData[channel];

  return (
    <div className="px-8 py-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm hover:text-muted-foreground mb-3"><ArrowLeft className="h-4 w-4" />Back</Link>
          <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-1">Coca-Cola Light</div>
          <h1 className="text-3xl font-serif">Brand Health Score</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-lg"><RefreshCw className="h-3.5 w-3.5 mr-2" />Refresh</Button>
          <Button variant="outline" size="sm" className="rounded-lg"><Download className="h-3.5 w-3.5 mr-2" />Export PDF</Button>
        </div>
      </div>

      <div className="rounded-xl border border-[hsl(0_60%_85%)] bg-[hsl(0_60%_97%)] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-[hsl(0_60%_50%)]" />
          <div className="text-sm"><span className="font-medium">Score dropped 4 points this week</span> <span className="text-muted-foreground">Visual Identity KPI dragging score down — 2 pages with off-palette colors + 6 posts with imagery issues</span></div>
        </div>
        <Button variant="outline" size="sm" className="rounded-lg bg-background">View issues</Button>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-3 rounded-2xl border border-border/60 bg-card p-5">
          <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-4">Overall Score</div>
          <Donut />
          <p className="text-[11px] text-muted-foreground text-center mt-3 leading-relaxed">Computed from 10 KPIs across 3 live touchpoints · Updated 2h ago</p>
        </div>
        <div className="col-span-9 rounded-2xl border border-border/60 bg-card p-5">
          <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-4">Category Breakdown · click to drill down</div>
          <div className="space-y-5">
            {categories.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{c.weight}% wt <span className="text-foreground font-serif text-base ml-2">{c.score}</span></span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: `${c.score}%`, backgroundColor: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-1">Touchpoint Breakdown</div>
            <div className="text-sm font-medium">Per-channel compliance performance</div>
          </div>
          <Button variant="outline" size="sm" className="rounded-lg">+ Add touchpoint</Button>
        </div>
        <div className="flex gap-1 border-b border-border/60 mb-5">
          {channels.map((c) => (
            <button key={c} onClick={() => setChannel(c)} className={`px-4 py-2 text-sm transition-colors relative ${channel === c ? "font-medium" : "text-muted-foreground hover:text-foreground"}`}>
              {c}
              {channel === c && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[{ v: d.pages, l: "Pages scanned" }, { v: d.issues, l: "Issues found" }, { v: d.lastScan, l: "Last scan" }, { v: d.rate, l: "Compliance rate" }].map((s, i) => (
            <div key={i} className="rounded-lg bg-muted/30 p-3">
              <div className="text-2xl font-serif">{s.v}</div>
              <div className="text-[11px] text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 mb-5">
          {d.bars.map((b: any) => (
            <div key={b.k}>
              <div className="flex items-center justify-between text-xs mb-1"><span>{b.k}</span><span className="font-serif text-sm">{b.v}</span></div>
              <div className="h-1 bg-muted rounded-full overflow-hidden"><div className="h-full bg-[hsl(140_50%_40%)]" style={{ width: `${b.v}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-2">Issues on this touchpoint</div>
        <div className="space-y-1.5">
          {d.issuesList.map((it: string, i: number) => (
            <div key={i} className="flex items-center justify-between text-xs bg-muted/30 rounded-md px-3 py-2">
              <div className="flex items-center gap-2"><AlertTriangle className="h-3 w-3 text-[hsl(35_75%_45%)]" />{it}</div>
              <span className="text-[10px] text-muted-foreground">§3.1</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-1">Score History</div>
            <div className="text-sm font-medium">Last 30 days</div>
          </div>
          <div className="inline-flex rounded-lg border border-border/60 bg-muted/30 p-0.5 text-xs">
            {["7d", "14d", "30d"].map((r) => (
              <button key={r} onClick={() => setRange(r)} className={`px-3 py-1 rounded-md transition-colors ${range === r ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`}>{r}</button>
            ))}
          </div>
        </div>
        <LineChart />
      </div>
    </div>
  );
}