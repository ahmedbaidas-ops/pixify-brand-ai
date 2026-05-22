import { LayoutDashboard, BookOpen, FolderOpen, ShieldCheck, Activity, UserCog, Settings as SettingsIcon, Sparkles, ChevronDown, Check, Plus } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navigation = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Guidelines", url: "/guideline", icon: BookOpen },
  { title: "Asset Library", url: "/library", icon: FolderOpen },
  { title: "Governance", url: "/governance", icon: ShieldCheck, badge: "5" },
  { title: "Brand Health", url: "/brand-health", icon: Activity, badge: "2" },
  { title: "Admin Portal", url: "/admin", icon: UserCog },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
];

const brands = [
  { code: "CCL", name: "Coca-Cola Light", industry: "Beverages", score: 78, color: "hsl(0 75% 45%)" },
  { code: "PEP", name: "Pepsi MENA", industry: "Beverages", score: 82, color: "hsl(220 70% 25%)", active: true },
  { code: "ARX", name: "Aramex", industry: "Logistics", score: 71, color: "hsl(15 75% 55%)" },
  { code: "TLB", name: "Talabat", industry: "Food Delivery", score: 88, color: "hsl(28 90% 55%)" },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const active = brands.find((b) => b.active) ?? brands[0];
  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">Pixi<span className="italic font-serif">fy</span></span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        {/* Brand switcher */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="mx-2 mb-4 rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5 flex items-center gap-2.5 cursor-pointer hover:bg-muted/50 transition-colors w-[calc(100%-1rem)]">
              <div className="h-8 w-8 rounded-md text-white text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: active.color }}>{active.code}</div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-medium truncate">{active.name}</div>
                <div className="text-[11px] text-muted-foreground">Switch brand</div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" align="start" sideOffset={8} className="w-72 p-2 rounded-xl">
            <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase px-2 py-1.5">Leo Burnett · Switch brand</div>
            <div className="space-y-0.5">
              {brands.map((b) => (
                <button key={b.code} className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted/50 text-left">
                  <div className="h-8 w-8 rounded-md text-white text-[10px] font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: b.color }}>{b.code}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{b.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{b.industry} · {b.score}/100</div>
                  </div>
                  {b.active && <Check className="h-4 w-4 text-muted-foreground" />}
                </button>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-border/60">
              <button onClick={() => navigate("/onboarding")} className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-muted/50 text-sm">
                <div className="h-8 w-8 rounded-md border border-dashed border-border flex items-center justify-center"><Plus className="h-4 w-4 text-muted-foreground" /></div>
                <span className="font-medium">Add new brand</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-muted/60"
                      )}
                      activeClassName="bg-muted/70 font-semibold"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-[18px] w-[18px] text-foreground/80" />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <span className="h-5 min-w-5 rounded-full px-1.5 text-[10px] font-semibold bg-[hsl(15_75%_55%)]/15 text-[hsl(15_75%_45%)] flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4 space-y-2">
        <button className="w-full flex items-center justify-between gap-2 rounded-lg bg-muted/40 hover:bg-muted/60 px-3 py-2 text-sm transition-colors">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-foreground/80" />
            <span className="font-medium">Ask Pixify</span>
          </div>
          <kbd className="text-[10px] text-muted-foreground bg-background border border-border/60 rounded px-1.5 py-0.5">⌘K</kbd>
        </button>
        <div className="flex items-center gap-2 px-2">
          <div className="flex -space-x-1.5">
            {["SA", "KH", "NP"].map((i) => (
              <div key={i} className="h-5 w-5 rounded-full bg-muted border-2 border-background text-[8px] font-semibold flex items-center justify-center text-foreground/70">{i}</div>
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">3 members online</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
