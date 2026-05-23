import { ArrowLeft, FileText, Upload, Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const nav = [
  { id: "profile", label: "Brand profile" },
  { id: "touchpoints", label: "Touchpoints" },
  { id: "notifications", label: "Notifications" },
  { id: "danger", label: "Danger zone" },
];

export default function Settings() {
  const [active, setActive] = useState("profile");
  return (
    <div className="px-8 py-6 max-w-[1200px] mx-auto">
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm hover:text-muted-foreground mb-3"><ArrowLeft className="h-4 w-4" />Back</Link>
      <div className="text-eyebrow mb-1">Coca-Cola Light</div>
      <h1 className="text-metric mb-6">Settings</h1>

      <div className="flex gap-6">
        <aside className="w-48 shrink-0">
          <nav className="space-y-0.5">
            {nav.map((n) => (
              <button key={n.id} onClick={() => setActive(n.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${active === n.id ? "bg-muted font-medium" : "hover:bg-muted/40 text-muted-foreground"}`}>{n.label}</button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 space-y-5 max-w-2xl">
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="text-eyebrow mb-4">Brand Profile</div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium block mb-1.5">Brand name</label>
                <Input defaultValue="Coca-Cola Light" className="h-10 rounded-lg" />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5">Industry</label>
                <Input defaultValue="Beverages" className="h-10 rounded-lg" />
              </div>
              <Button size="sm" className="h-9 rounded-lg bg-foreground text-background hover:bg-foreground/90">Save changes</Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="text-eyebrow mb-2">Brand Documents</div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">Your brand strategy and guidelines power everything in Pixify — AI context, compliance rules, health scoring. Upload or replace documents here at any time.</p>
            <div className="space-y-2 mb-3">
              {[
                { title: "Brand Strategy", file: "coke-light-strategy-2026.pdf · Uploaded Jan 8, 2026" },
                { title: "Brand Guidelines", file: "coke-light-guidelines-v3.2.pdf · Uploaded Jan 12, 2026" },
              ].map((d) => (
                <div key={d.title} className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                  <FileText className="h-5 w-5 text-[hsl(140_50%_40%)]" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{d.title}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{d.file}</div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 rounded-md text-xs"><Upload className="h-3 w-3 mr-1" />Replace</Button>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-[hsl(35_30%_97%)] border border-border/60 p-3 text-xs text-muted-foreground flex items-center gap-2 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-foreground" />
              Don't have documents yet? Request them from Pixilated — or upload drafts to get started.
            </div>
            <button className="w-full inline-flex items-center justify-center gap-1 text-sm px-3 py-2 rounded-lg border border-dashed border-border/60 hover:bg-muted/30"><Plus className="h-3.5 w-3.5" />Add brand document</button>
          </div>
        </div>
      </div>
    </div>
  );
}