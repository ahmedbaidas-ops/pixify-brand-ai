import { Sparkles, Paperclip, Send, Plus, ArrowUpRight, RefreshCw, AlertTriangle, CheckCircle2, XCircle, Globe, Instagram, Linkedin, Image as ImageIcon, Layers, Video, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const suggestions = [
  "Is #2A8F4C in our approved palette?",
  "What are our logo clear-space rules?",
  "Show all failing assets",
  "Is this post on-brand?",
];

const categories = [
  { name: "Visual Identity", weight: 40, score: 82 },
  { name: "Messaging", weight: 30, score: 74 },
  { name: "Strategic Alignment", weight: 20, score: 80 },
  { name: "Governance", weight: 10, score: 65 },
];

const touchpoints = [
  {
    name: "cokelight.com",
    type: "Website",
    icon: Globe,
    scanned: "Scanned 4h ago",
    status: "issue",
    issues: [
      { text: "Off-palette color #2A8F4C on /promo page — 3 instances", rule: "§3.1 Color" },
      { text: "Outdated logo variant (v2) detected in page header", rule: "§2.1 Logo" },
    ],
  },
  {
    name: "@cocacolalight",
    type: "Instagram",
    icon: Instagram,
    scanned: "Scanned 1h ago",
    status: "pass",
    issues: [],
  },
  {
    name: "Coca-Cola Light",
    type: "LinkedIn",
    icon: Linkedin,
    scanned: "Scanned 2d ago",
    status: "issue",
    issues: [{ text: "Outdated logo variant on cover image", rule: "§2.1 Logo" }],
  },
];

const findings = [
  { sev: "warn", title: "Off-palette color #2A8F4C on cokelight.com/promo", meta: "§3.1 · 2h ago", count: "3 instances" },
  { sev: "warn", title: "Promo Banner — headline font mismatch (Bebas Neue vs Unity Headline)", meta: "§3.2 · 4h ago" },
  { sev: "error", title: "Q4 Email Header — logo clear-space violation + unapproved color", meta: "§2.3, §3.1 · Yesterday" },
];

const checks = [
  { name: "Summer Hero — Red Can", meta: "2h ago", status: "pass", icon: ImageIcon },
  { name: "Promo Banner 1080×1080", meta: "4h ago", status: "issue", icon: ImageIcon },
  { name: "Logo Lockup — Primary", meta: "1d ago", status: "pass", icon: Layers },
  { name: "Product Shot — Red Can", meta: "1d ago", status: "pass", icon: ImageIcon },
];

function Donut({ score = 78 }: { score?: number }) {
  const r = 56;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative h-36 w-36 mx-auto">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={r} stroke="hsl(var(--muted))" strokeWidth="10" fill="none" />
        <circle cx="70" cy="70" r={r} stroke="hsl(35 75% 50%)" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-serif">{score}</div>
        <div className="text-[10px] text-muted-foreground">/ 100</div>
        <div className="text-[10px] text-[hsl(15_70%_45%)] mt-1">↓ 4 this week</div>
      </div>
    </div>
  );
}

const Pill = ({ status }: { status: "pass" | "issue" | "fail" }) => {
  if (status === "pass") return <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[hsl(140_50%_30%)] bg-[hsl(140_40%_92%)] px-2 py-0.5 rounded-md"><CheckCircle2 className="h-3 w-3" />Pass</span>;
  if (status === "fail") return <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[hsl(0_60%_40%)] bg-[hsl(0_60%_95%)] px-2 py-0.5 rounded-md"><XCircle className="h-3 w-3" />Fail</span>;
  return <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[hsl(35_75%_35%)] bg-[hsl(40_70%_92%)] px-2 py-0.5 rounded-md"><AlertTriangle className="h-3 w-3" />1 issue</span>;
};

export default function Dashboard() {
  return (
    <div className="px-8 py-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-1">Pepsi MENA</div>
          <h1 className="text-3xl font-serif">Dashboard</h1>
        </div>
        <Button variant="outline" size="sm" className="rounded-lg"><RefreshCw className="h-3.5 w-3.5 mr-2" />Refresh score</Button>
      </div>

      {/* Ask Pixify */}
      <div className="rounded-2xl border border-border/60 bg-[hsl(35_30%_97%)] p-5 relative">
        <button className="absolute top-4 right-4 inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border border-border/60 hover:bg-muted/40 bg-background">Open full chat <ArrowUpRight className="h-3 w-3" /></button>
        <div className="flex items-start gap-3 mb-4">
          <div className="h-9 w-9 rounded-lg bg-foreground text-background flex items-center justify-center"><Sparkles className="h-4 w-4" /></div>
          <div>
            <div className="font-semibold text-sm">Ask Pixify</div>
            <div className="text-xs text-muted-foreground">Pepsi MENA · Guidelines v3.2 · Brand guardian, not a content creator</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((s) => (
            <button key={s} className="text-xs px-3 py-1.5 rounded-md border border-border/60 bg-background hover:bg-muted/40">{s}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input placeholder="Ask about brand guidelines, assets, compliance..." className="h-10 rounded-lg pr-10 bg-background" />
            <Paperclip className="h-4 w-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <Button className="h-10 rounded-lg bg-foreground hover:bg-foreground/90 text-background"><Send className="h-3.5 w-3.5 mr-2" />Ask</Button>
        </div>
      </div>

      {/* 3 columns */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-3 rounded-2xl border border-border/60 bg-card p-5">
          <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-3">Brand Health Score</div>
          <Donut />
          <div className="mt-5 space-y-3.5">
            {categories.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>{c.name}</span>
                  <span className="text-muted-foreground">{c.weight}% wt <span className="text-foreground font-serif text-sm ml-1">{c.score}</span></span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-[hsl(35_75%_50%)]" style={{ width: `${c.score}%` }} />
                </div>
              </div>
            ))}
          </div>
          <button className="mt-5 w-full text-xs py-2 rounded-md border border-border/60 hover:bg-muted/40 flex items-center justify-center gap-1">Full health report ›</button>
        </div>

        <div className="col-span-6 rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase">Connected Touchpoints</div>
            <button className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border border-border/60 hover:bg-muted/40"><Plus className="h-3 w-3" />Add</button>
          </div>
          <div className="space-y-3">
            {touchpoints.map((t) => (
              <div key={t.name} className="rounded-xl border border-border/60 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <t.icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-[11px] text-muted-foreground">{t.type} · {t.scanned}</div>
                    </div>
                  </div>
                  <Pill status={t.status as any} />
                </div>
                {t.issues.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {t.issues.map((i, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 text-xs bg-muted/30 rounded-md px-2.5 py-1.5">
                        <div className="flex items-center gap-2"><AlertTriangle className="h-3 w-3 text-[hsl(35_75%_45%)]" /><span>{i.text}</span></div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{i.rule}</span>
                      </div>
                    ))}
                    <button className="text-xs text-muted-foreground hover:text-foreground mt-1">View details →</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-3 rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase">Live Findings</div>
            <div className="text-[11px] text-muted-foreground">3 open <button className="ml-1 text-foreground hover:underline">View all →</button></div>
          </div>
          <div className="space-y-3">
            {findings.map((f, i) => (
              <div key={i} className="border-b border-border/40 last:border-0 pb-3 last:pb-0">
                <div className="flex items-start gap-2">
                  {f.sev === "error" ? <XCircle className="h-3.5 w-3.5 text-[hsl(0_60%_50%)] mt-0.5 shrink-0" /> : <AlertTriangle className="h-3.5 w-3.5 text-[hsl(35_75%_45%)] mt-0.5 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs leading-snug">{f.title}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{f.meta}</div>
                  </div>
                  <button className="text-[11px] text-muted-foreground hover:text-foreground shrink-0">Fix →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Check */}
      <div className="rounded-2xl border border-border/60 bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-1">Compliance Check</div>
            <div className="text-sm font-medium">Upload an asset to check against brand guidelines</div>
          </div>
          <Button variant="outline" size="sm" className="rounded-lg"><Upload className="h-3.5 w-3.5 mr-2" />Upload & Check</Button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {checks.map((c) => (
            <div key={c.name} className="rounded-xl border border-border/60 p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="h-9 w-9 rounded-md bg-muted/40 flex items-center justify-center"><c.icon className="h-4 w-4 text-muted-foreground" /></div>
                <Pill status={c.status as any} />
              </div>
              <div className="text-sm font-medium truncate">{c.name}</div>
              <div className="text-[11px] text-muted-foreground">{c.meta}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}