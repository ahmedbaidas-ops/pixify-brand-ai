import { ArrowLeft, Upload, Search, Filter, Grid3x3, List, AtSign, Hash, FolderOpen, Image as ImageIcon, FileText, Layers, Video, CheckCircle2, AlertTriangle, XCircle, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const tree = [
  { label: "All Assets", icon: Grid3x3, count: 247, active: true },
  { label: "Social Media", icon: AtSign, count: 98, children: [
    { label: "Instagram", count: 54 },
    { label: "Stories", count: 28 },
    { label: "TikTok", count: 16 },
  ]},
  { label: "Campaigns", icon: Hash, count: 63, children: [
    { label: "Summer '26", count: 31 },
    { label: "Ramadan '26", count: 22 },
    { label: "Q4 Promo", count: 10 },
  ]},
  { label: "Brand Assets", icon: FolderOpen, count: 41, children: [
    { label: "Logos", count: 12 },
    { label: "Colors", count: 8 },
    { label: "Fonts", count: 6 },
  ]},
  { label: "Email", icon: FileText, count: 28 },
  { label: "Display Ads", icon: ImageIcon, count: 17 },
];

const assets = [
  { name: "Summer Hero — Red Can", meta: "2h ago · 2.4 MB", tags: ["hero", "product"], status: "pass", icon: ImageIcon, badge: "Summer '26" },
  { name: "Promo Banner 1080×1080", meta: "4h ago · 1.8 MB", tags: ["promo", "banner"], status: "issue", icon: ImageIcon, badge: "Q4 Promo" },
  { name: "Logo Lockup — Primary", meta: "1d ago · 48 KB", tags: ["logo", "primary"], status: "pass", icon: Layers },
  { name: "Product Shot — Red Can", meta: "1d ago · 3.1 MB", tags: ["product", "photography"], status: "pass", icon: ImageIcon, badge: "Summer '26" },
  { name: "Q4 Email Header", meta: "2d ago · 800 KB", tags: ["email", "header"], status: "fail", icon: FileText, badge: "Q4 Promo" },
  { name: "Brand Guidelines v3.2", meta: "5d ago · 14 MB", tags: ["guidelines", "official"], status: "pass", icon: Layers },
  { name: "TikTok Story 9:16", meta: "5d ago · 22 MB", tags: ["tiktok", "video"], status: "pass", icon: Video, badge: "Summer '26" },
  { name: "Tagline Lockup — Dark", meta: "6d ago · 52 KB", tags: ["tagline", "dark"], status: "issue", icon: Layers, badge: "Q4 Promo" },
  { name: "Instagram Carousel Frame 1", meta: "1w ago · 1.9 MB", tags: ["carousel", "ramadan"], status: "pass", icon: ImageIcon, badge: "Ramadan '26" },
  { name: "Display Banner 728×90", meta: "2d ago · 420 KB", tags: ["display", "banner"], status: "pass", icon: ImageIcon, badge: "Q4 Promo" },
  { name: "Ramadan Key Visual", meta: "4d ago · 5.2 MB", tags: ["key-visual", "ramadan"], status: "issue", icon: ImageIcon, badge: "Ramadan '26" },
  { name: "Hero Font Specimen", meta: "1w ago · 3.1 MB", tags: ["font", "specimen"], status: "pass", icon: FileText },
];

const Pill = ({ s }: { s: string }) => {
  if (s === "pass") return <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[hsl(140_50%_30%)] bg-[hsl(140_40%_92%)] px-2 py-0.5 rounded-md"><CheckCircle2 className="h-3 w-3" />Pass</span>;
  if (s === "fail") return <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[hsl(0_60%_40%)] bg-[hsl(0_60%_95%)] px-2 py-0.5 rounded-md"><XCircle className="h-3 w-3" />Fail</span>;
  return <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[hsl(35_75%_35%)] bg-[hsl(40_70%_92%)] px-2 py-0.5 rounded-md"><AlertTriangle className="h-3 w-3" />1 issue</span>;
};

export default function Library() {
  return (
    <div className="flex">
      <aside className="w-64 border-r border-border/60 bg-background min-h-[calc(100vh-56px)] p-5 sticky top-[56px]">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm hover:text-muted-foreground mb-5"><ArrowLeft className="h-4 w-4" />Back</Link>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase">Library</div>
          <button className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border border-border/60 hover:bg-muted/40"><Upload className="h-3 w-3" />Upload</button>
        </div>
        <nav className="space-y-0.5">
          {tree.map((node) => (
            <div key={node.label}>
              <div className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-muted/40 ${node.active ? "bg-muted font-medium" : ""}`}>
                <div className="flex items-center gap-2"><node.icon className="h-4 w-4 text-muted-foreground" />{node.label}</div>
                <span className="text-[10px] text-muted-foreground">{node.count}</span>
              </div>
              {node.children && (
                <div className="ml-3 pl-2 border-l border-border/40 space-y-0.5 mt-0.5">
                  {node.children.map((c) => (
                    <div key={c.label} className="flex items-center justify-between px-2 py-1.5 rounded text-xs text-muted-foreground hover:bg-muted/30 cursor-pointer">
                      <span># {c.label}</span><span className="text-[10px]">{c.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="mt-8 pt-4 border-t border-border/60">
          <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-2">Filters</div>
          <div className="space-y-1 text-xs">
            <div className="px-2 py-1.5 rounded hover:bg-muted/30 cursor-pointer">All statuses</div>
            <div className="px-2 py-1.5 rounded hover:bg-muted/30 cursor-pointer text-[hsl(35_75%_45%)]">Compliance issues</div>
            <div className="px-2 py-1.5 rounded hover:bg-muted/30 cursor-pointer text-[hsl(140_50%_30%)]">Passed</div>
          </div>
        </div>
      </aside>

      <main className="flex-1 px-8 py-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, tag, campaign, color..." className="pl-9 h-9 rounded-lg bg-muted/30 border-border/60" />
          </div>
          <Button variant="outline" size="sm" className="rounded-lg"><Filter className="h-3.5 w-3.5 mr-2" />Filter</Button>
          <div className="flex rounded-lg border border-border/60 overflow-hidden">
            <button className="px-2.5 py-2 bg-muted/40"><Grid3x3 className="h-3.5 w-3.5" /></button>
            <button className="px-2.5 py-2 hover:bg-muted/40"><List className="h-3.5 w-3.5" /></button>
          </div>
          <Button className="h-9 rounded-lg bg-foreground hover:bg-foreground/90 text-background"><Upload className="h-3.5 w-3.5 mr-2" />Upload</Button>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span><span className="text-foreground font-medium">12 assets</span></span>
          <span className="text-[hsl(140_50%_30%)]">✓ 8 passed</span>
          <span className="text-[hsl(35_75%_45%)]">⚠ 3 warnings</span>
          <span className="text-[hsl(0_60%_50%)]">✗ 1 failed</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {assets.map((a) => (
            <div key={a.name} className="rounded-xl border border-border/60 bg-card overflow-hidden hover:border-border transition-colors cursor-pointer">
              <div className="relative aspect-square bg-muted/30 flex items-center justify-center">
                <a.icon className="h-8 w-8 text-muted-foreground/50" />
                <div className="absolute top-2 right-2"><Pill s={a.status} /></div>
                {a.badge && <div className="absolute bottom-2 left-2 text-[9px] bg-background/90 border border-border/60 px-1.5 py-0.5 rounded">{a.badge}</div>}
              </div>
              <div className="p-2.5">
                <div className="text-xs font-medium truncate">{a.name}</div>
                <div className="text-[10px] text-muted-foreground">{a.meta}</div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {a.tags.map((t) => <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-muted/40 text-muted-foreground">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}