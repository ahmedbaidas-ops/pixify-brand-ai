import { ArrowLeft, Plus, MoreHorizontal, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const members = [
  { initials: "SA", name: "Sarah Al-Amin", email: "sarah@leoburnett.com", role: "Admin", online: true },
  { initials: "KH", name: "Karim Hassan", email: "karim@pixilated.com", role: "Editor", online: true },
  { initials: "NP", name: "Nina Petrov", email: "nina@designstudio.com", role: "Editor", online: true },
  { initials: "LW", name: "Lena Weber", email: "lena@freelance.com", role: "Viewer", online: false },
];

const audit = [
  { title: "Asset uploaded", body: "Ramadan_KV_v3.png — flagged (imagery §6.2)", who: "Nina Petrov · 4h ago" },
  { title: "Guideline updated", body: "Typography §4.2 — headline font changed", who: "Sarah Al-Amin · 1d ago" },
  { title: "Compliance check", body: "Q4 Email Header — 2 issues (color + clear-space)", who: "Karim Hassan · 3d ago" },
  { title: "Member invited", body: "lena@freelance.com invited as Viewer", who: "Sarah Al-Amin · 3d ago" },
  { title: "Asset deleted", body: "Old logo v1.svg permanently removed", who: "Sarah Al-Amin · 5d ago" },
];

const permissions = [
  { role: "Admin", color: "text-[hsl(220_70%_45%)]", perms: ["Manage members & roles", "Edit guidelines", "Delete assets", "View audit log", "Archive brand"] },
  { role: "Editor", color: "text-[hsl(220_70%_45%)]", perms: ["Upload assets", "Run compliance checks", "Edit guidelines", "View audit log"] },
  { role: "Viewer", color: "text-[hsl(220_70%_45%)]", perms: ["View assets", "View guidelines", "View health score", "Download assets"] },
];

export default function Admin() {
  return (
    <div className="px-8 py-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm hover:text-muted-foreground mb-3"><ArrowLeft className="h-4 w-4" />Back</Link>
          <div className="text-eyebrow mb-1">Coca-Cola Light</div>
          <h1 className="text-page-title">Admin Portal</h1>
        </div>
        <Button size="sm" className="h-9 rounded-lg bg-foreground hover:bg-foreground/90 text-background"><Plus className="h-3.5 w-3.5 mr-2" />Invite member</Button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium">Team Members</div>
            <div className="text-xs text-muted-foreground">{members.length} members</div>
          </div>
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.email} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30">
                <div className="h-9 w-9 rounded-full bg-muted/50 text-xs font-semibold flex items-center justify-center">{m.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${m.online ? "bg-[hsl(140_60%_45%)]" : "bg-[hsl(35_75%_55%)]"}`} />
                    {m.name}
                  </div>
                  <div className="text-meta">{m.email}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md border border-border/60 bg-muted/30">{m.role}</span>
                <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm font-medium">Audit Log</div>
            <button className="text-xs text-muted-foreground hover:text-foreground">View all →</button>
          </div>
          <div className="text-[11px] text-muted-foreground mb-4">Compliance-grade trail · Admins only</div>
          <div className="space-y-4">
            {audit.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.body}</div>
                  <div className="text-[10px] text-[hsl(35_50%_45%)] mt-0.5">{a.who}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5">
        <div className="text-eyebrow mb-4">Role Permissions</div>
        <div className="grid grid-cols-3 gap-4">
          {permissions.map((p) => (
            <div key={p.role} className="rounded-xl bg-muted/30 p-4">
              <div className={`text-sm font-semibold mb-3 ${p.color}`}>{p.role}</div>
              <div className="space-y-1.5">
                {p.perms.map((perm) => (
                  <div key={perm} className="flex items-center gap-2 text-xs"><Check className="h-3 w-3 text-[hsl(140_50%_40%)]" />{perm}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}