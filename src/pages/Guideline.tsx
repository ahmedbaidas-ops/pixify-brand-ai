import { ArrowLeft, Download, BookOpen, Layers, Palette, Type, MessageSquare, Image as ImageIcon, Ruler, Star, Target, Award, Users, Quote } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const sections = [
  { id: "introduction", title: "Introduction", icon: BookOpen },
  { id: "logo", title: "Logo", icon: Layers },
  { id: "colors", title: "Colors", icon: Palette },
  { id: "typography", title: "Typography", icon: Type },
  { id: "voice", title: "Voice & Tone", icon: MessageSquare },
  { id: "imagery", title: "Imagery", icon: ImageIcon },
  { id: "spacing", title: "Spacing", icon: Ruler },
  { id: "examples", title: "Examples", icon: Star },
];

const introCards = [
  { icon: Target, label: "Brand Purpose", text: '"To make the light choice feel like the right choice — always."' },
  { icon: Award, label: "Brand Positioning", text: '"Premium, low-calorie cola for health-conscious adults. The lighter choice without compromise."' },
  { icon: Users, label: "Primary Audience", text: '"Health-conscious adults 25–45, active lifestyle, GCC + LEVANT region."' },
  { icon: Quote, label: "Brand Promise", text: '"Zero guilt, full taste. Every time."' },
];

const logoVariants = [
  { label: "Primary", desc: "Default. Red on white.", bg: "bg-[hsl(0_75%_50%)]", color: "text-white" },
  { label: "Reversed", desc: "White on red.", bg: "bg-white border", color: "text-[hsl(0_75%_50%)]" },
  { label: "Monochrome", desc: "Print use.", bg: "bg-white border", color: "text-foreground" },
  { label: "Dark", desc: "Dark backgrounds.", bg: "bg-foreground", color: "text-white" },
];

export default function Guideline() {
  const [active, setActive] = useState("introduction");

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/60 bg-background min-h-[calc(100vh-56px)] p-5 sticky top-[56px]">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-foreground hover:text-muted-foreground mb-5">
          <ArrowLeft className="h-4 w-4" />Back
        </Link>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase">Sections</div>
          <button className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border border-border/60 hover:bg-muted/40"><Download className="h-3 w-3" />PDF</button>
        </div>
        <nav className="space-y-0.5">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                active === s.id ? "bg-muted font-medium" : "hover:bg-muted/40"
              }`}
            >
              <s.icon className="h-4 w-4 text-muted-foreground" />
              {s.title}
            </button>
          ))}
        </nav>
        <div className="mt-8 pt-4 border-t border-border/60">
          <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-1">Version</div>
          <div className="text-sm font-medium">v3.2</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Published · Jan 12, 2026</div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 px-10 py-8 max-w-4xl">
        {active === "introduction" && (
          <div className="space-y-6">
            <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase">Coca-Cola Light · Brand Guidelines v3.2</div>
            <h1 className="text-3xl font-serif">Introduction</h1>
            <p className="text-sm leading-relaxed text-foreground/80 max-w-2xl">
              This document is the single source of truth for the Coca-Cola Light brand. Every element here is a rule — not a suggestion. Consistent application of these guidelines builds the brand equity that makes Coca-Cola Light the leading light cola in the GCC and LEVANT region.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {introCards.map((c) => (
                <div key={c.label} className="rounded-xl border border-border/60 bg-card p-4">
                  <div className="flex items-center gap-2 mb-2 text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                    <c.icon className="h-3.5 w-3.5" />{c.label}
                  </div>
                  <p className="text-sm italic text-foreground/85 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-4">
              <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-3">Brand Values</div>
              <div className="flex flex-wrap gap-2">
                {["Freedom", "Lightness", "Authenticity", "Balance", "Refreshment"].map((v) => (
                  <span key={v} className="text-xs px-3 py-1 rounded-md bg-muted/50 border border-border/60">{v}</span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-[hsl(35_30%_97%)] p-4">
              <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-2">How to use these guidelines</div>
              <p className="text-sm leading-relaxed text-foreground/80">
                Navigate sections using the sidebar. Each section contains structured rules — not descriptive text. Rules reference §section.subsection numbers and are the same references cited by Pixify's compliance engine. When you update a rule here, compliance checks update immediately.
              </p>
            </div>
          </div>
        )}

        {active === "logo" && (
          <div className="space-y-6">
            <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase">§2 Logo System</div>
            <h1 className="text-3xl font-serif">Logo</h1>
            <p className="text-sm leading-relaxed text-foreground/80 max-w-2xl">
              The Coca-Cola Light logo is the most protected brand asset. It may not be altered, stretched, recolored, or placed on unapproved backgrounds.
            </p>

            <div>
              <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-3">§2.1 Approved Variants</div>
              <div className="grid grid-cols-4 gap-3">
                {logoVariants.map((v) => (
                  <div key={v.label}>
                    <div className={`${v.bg} ${v.color} h-24 rounded-lg flex items-center justify-center font-serif italic text-sm`}>Coca-Cola Light</div>
                    <div className="mt-2 text-sm font-medium">{v.label}</div>
                    <div className="text-[11px] text-muted-foreground">{v.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[hsl(35_60%_70%)] bg-[hsl(40_70%_96%)] p-4">
              <div className="text-sm font-medium mb-1">§2.3 Clear Space Rule</div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Minimum clear space around all logo variants = <strong>logo height</strong>. No text, graphics, or other elements may appear within this zone. Minimum: <strong>24px</strong> in digital, <strong>6mm</strong> in print.
              </p>
            </div>

            <div className="rounded-xl border border-[hsl(0_60%_85%)] bg-[hsl(0_60%_97%)] p-4">
              <div className="text-sm font-medium mb-2 text-[hsl(0_60%_40%)]">§2.6 Prohibited Uses</div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-[hsl(0_60%_40%)]">
                {["Do not stretch or distort", "Do not change colors", "Do not add shadows or effects", "Do not place on busy backgrounds", "Do not use outline-only version", "Do not rotate the logo"].map((r) => (
                  <div key={r} className="flex items-center gap-2"><span>⊗</span>{r}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!["introduction", "logo"].includes(active) && (
          <div className="space-y-4">
            <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase">Coca-Cola Light · Brand Guidelines v3.2</div>
            <h1 className="text-3xl font-serif">{sections.find((s) => s.id === active)?.title}</h1>
            <p className="text-sm text-muted-foreground max-w-2xl">Section content for {sections.find((s) => s.id === active)?.title} — structured rules cited by Pixify's compliance engine.</p>
            <div className="rounded-xl border border-border/60 bg-card p-8 text-sm text-muted-foreground">Rules and visual references will be displayed here.</div>
          </div>
        )}
      </main>
    </div>
  );
}