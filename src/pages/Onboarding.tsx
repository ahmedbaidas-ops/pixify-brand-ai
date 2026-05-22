import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, FileCheck, BookOpen, BookCheck, Globe, Search, CheckCircle2, FileEdit, Upload, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const steps = [
  { id: 1, title: "Name workspace", sub: "Brand name & industry", icon: FileEdit },
  { id: 2, title: "Upload strategy", sub: "Positioning, purpose, audience", icon: FileText },
  { id: 3, title: "Confirm strategy", sub: "Review 6 extracted sections", icon: FileCheck },
  { id: 4, title: "Upload guidelines", sub: "Visual identity & voice rules", icon: BookOpen },
  { id: 5, title: "Confirm guidelines", sub: "Review 8 extracted sections", icon: BookCheck },
  { id: 6, title: "Connect channels", sub: "Website & social accounts", icon: Globe },
  { id: 7, title: "Baseline scan", sub: "~5 min, runs in background", icon: Search },
  { id: 8, title: "Ready", sub: "Dashboard unlocked", icon: CheckCircle2 },
];

const industries = ["Beverages", "Food Delivery", "Logistics", "Retail", "Tech & SaaS", "Finance", "Healthcare", "Hospitality", "Telecom", "Other"];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");

  const next = () => (step < 8 ? setStep(step + 1) : navigate("/dashboard"));
  const workspaceName = brandName || "Pepsi MENA";

  return (
    <div className="min-h-screen bg-[hsl(35_30%_96%)] flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border/50 px-6 py-8 bg-[hsl(35_25%_94%)] flex flex-col">
        <div className="mb-8">
          <div className="text-xl font-bold tracking-tight mb-3">Pixi<span className="italic font-serif">fy</span></div>
          <div className="text-[11px] text-muted-foreground">Setting up</div>
          <div className="text-sm font-serif">{workspaceName}</div>
        </div>

        <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-3">Setup Progress</div>
        <nav className="space-y-1 flex-1">
          {steps.map((s) => {
            const done = s.id < step;
            const active = s.id === step;
            return (
              <div key={s.id} className={`flex items-start gap-3 px-2.5 py-2 rounded-lg transition-colors ${active ? "bg-[hsl(40_70%_88%)]" : ""}`}>
                <div className={`h-7 w-7 rounded-md flex items-center justify-center shrink-0 ${done ? "bg-[hsl(140_40%_92%)] text-[hsl(140_50%_30%)]" : active ? "bg-background border border-border/60" : "bg-muted/40"}`}>
                  {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <s.icon className="h-3.5 w-3.5 text-muted-foreground" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-[13px] leading-tight ${active || done ? "font-medium" : "text-muted-foreground"}`}>{s.title}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</div>
                </div>
              </div>
            );
          })}
        </nav>

        <p className="text-[10px] text-muted-foreground mt-6 leading-relaxed">
          Progress saves automatically. Key features unlock progressively as you add brand context.
        </p>
      </aside>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center pt-20 px-10">
        <div className="w-full max-w-xl">
          <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-2">Step {step}</div>

          {step === 1 && (
            <>
              <h1 className="text-3xl font-serif mb-3">What's this brand called?</h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md">
                This creates a sealed workspace. Every asset, guideline, and health score will live inside it — separate from every other brand in your organisation.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium block mb-1.5">Brand name</label>
                  <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. Coca-Cola Light" className="h-11 rounded-lg bg-background" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1.5">Industry <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full h-11 rounded-lg border border-border/60 bg-background px-3 text-sm">
                    <option value="">Select an industry...</option>
                    {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <Button onClick={next} disabled={!brandName.trim()} className="w-full h-11 rounded-lg bg-foreground text-background hover:bg-foreground/90 disabled:bg-muted-foreground/40">
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <UploadStep title="Upload your brand strategy" desc="Drop a PDF, deck, or doc. Pixify will extract positioning, purpose, audience, brand promise, and values in seconds." cta="Upload strategy" onNext={next} onSkip={next} />
          )}
          {step === 3 && (
            <ConfirmStep title="Confirm strategy" desc="We extracted 6 sections from your strategy. Review and edit before continuing." items={["Brand Purpose", "Brand Positioning", "Primary Audience", "Brand Promise", "Brand Values", "Tone of Voice"]} onNext={next} />
          )}
          {step === 4 && (
            <UploadStep title="Upload your brand guidelines" desc="PDF or deck. Pixify extracts logo rules, color tokens, typography, imagery and voice rules — and turns them into machine-readable compliance rules." cta="Upload guidelines" onNext={next} onSkip={next} />
          )}
          {step === 5 && (
            <ConfirmStep title="Confirm guidelines" desc="We extracted 8 sections. Compliance checks will reference these rules." items={["Logo System", "Color Palette", "Typography", "Voice & Tone", "Imagery", "Spacing & Grid", "Iconography", "Motion"]} onNext={next} />
          )}
          {step === 6 && <ConnectStep onNext={next} />}
          {step === 7 && <ScanStep onNext={next} />}
          {step === 8 && <ReadyStep workspaceName={workspaceName} onNext={() => navigate("/dashboard")} />}
        </div>
      </main>
    </div>
  );
}

function UploadStep({ title, desc, cta, onNext, onSkip }: any) {
  return (
    <>
      <h1 className="text-3xl font-serif mb-3">{title}</h1>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md">{desc}</p>
      <div className="rounded-2xl border-2 border-dashed border-border/60 bg-background p-10 text-center">
        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <div className="text-sm font-medium mb-1">Drop your file here</div>
        <div className="text-xs text-muted-foreground mb-4">PDF, DOCX, PPTX up to 50MB</div>
        <Button variant="outline" size="sm" className="rounded-lg">{cta}</Button>
      </div>
      <div className="flex items-center gap-3 mt-6">
        <Button onClick={onNext} className="flex-1 h-11 rounded-lg bg-foreground text-background hover:bg-foreground/90">Continue <ArrowRight className="h-4 w-4 ml-2" /></Button>
        <button onClick={onSkip} className="text-sm text-muted-foreground hover:text-foreground">Skip for now</button>
      </div>
    </>
  );
}

function ConfirmStep({ title, desc, items, onNext }: any) {
  return (
    <>
      <h1 className="text-3xl font-serif mb-3">{title}</h1>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md">{desc}</p>
      <div className="rounded-2xl border border-border/60 bg-background divide-y divide-border/60">
        {items.map((i: string) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-[hsl(140_50%_40%)]" />
              <span className="text-sm">{i}</span>
            </div>
            <button className="text-xs text-muted-foreground hover:text-foreground">Edit</button>
          </div>
        ))}
      </div>
      <Button onClick={onNext} className="w-full h-11 rounded-lg bg-foreground text-background hover:bg-foreground/90 mt-6">Confirm & continue <ArrowRight className="h-4 w-4 ml-2" /></Button>
    </>
  );
}

function ConnectStep({ onNext }: any) {
  return (
    <>
      <h1 className="text-3xl font-serif mb-3">Connect your channels</h1>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md">Pixify monitors these touchpoints continuously and surfaces compliance issues live on your dashboard.</p>
      <div className="space-y-2">
        {[{ l: "Website", p: "https://yourbrand.com" }, { l: "Instagram", p: "@handle" }, { l: "LinkedIn", p: "Company page URL" }, { l: "TikTok", p: "@handle" }].map((c) => (
          <div key={c.l} className="rounded-lg border border-border/60 bg-background p-3 flex items-center gap-3">
            <div className="text-sm font-medium w-24">{c.l}</div>
            <Input placeholder={c.p} className="h-9 rounded-md flex-1" />
            <Button variant="outline" size="sm" className="h-9 rounded-md">Connect</Button>
          </div>
        ))}
      </div>
      <Button onClick={onNext} className="w-full h-11 rounded-lg bg-foreground text-background hover:bg-foreground/90 mt-6">Continue <ArrowRight className="h-4 w-4 ml-2" /></Button>
    </>
  );
}

function ScanStep({ onNext }: any) {
  return (
    <>
      <h1 className="text-3xl font-serif mb-3">Running baseline scan</h1>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md">We're scanning your touchpoints against the rules extracted from your guidelines. This takes ~5 minutes and runs in the background — you can continue to your dashboard now.</p>
      <div className="rounded-2xl border border-border/60 bg-background p-6 space-y-3">
        {[{ l: "Crawling website", v: 100 }, { l: "Analyzing visual identity", v: 80 }, { l: "Checking typography rules", v: 45 }, { l: "Scoring touchpoints", v: 12 }].map((s) => (
          <div key={s.l}>
            <div className="flex items-center justify-between text-xs mb-1"><span>{s.l}</span><span className="text-muted-foreground">{s.v}%</span></div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-foreground" style={{ width: `${s.v}%` }} /></div>
          </div>
        ))}
      </div>
      <Button onClick={onNext} className="w-full h-11 rounded-lg bg-foreground text-background hover:bg-foreground/90 mt-6">Continue in background <ArrowRight className="h-4 w-4 ml-2" /></Button>
    </>
  );
}

function ReadyStep({ workspaceName, onNext }: any) {
  return (
    <>
      <div className="h-14 w-14 rounded-2xl bg-[hsl(140_40%_92%)] text-[hsl(140_50%_30%)] flex items-center justify-center mb-5"><CheckCircle2 className="h-7 w-7" /></div>
      <h1 className="text-3xl font-serif mb-3">{workspaceName} is ready</h1>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md">Your workspace is live. Brand health score, compliance findings, and the Ask Pixify assistant are now active.</p>
      <Button onClick={onNext} className="w-full h-11 rounded-lg bg-foreground text-background hover:bg-foreground/90">Open dashboard <ArrowRight className="h-4 w-4 ml-2" /></Button>
    </>
  );
}