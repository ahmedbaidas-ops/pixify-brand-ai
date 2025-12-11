import { Home, FileText, FolderOpen, Palette, FileStack, Settings, Sparkles, Network, Activity, Plane, Megaphone, Zap, ChevronDown, LayoutTemplate, Map, Shield } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import pixifyLogo from "@/assets/pixify-logo.png";

type NavigationItem = {
  title: string;
  url?: string;
  icon: any;
  badge?: string;
  collapsible?: boolean;
  items?: { title: string; url: string }[];
  mvp?: boolean; // true = show in MVP, false = hidden in MVP
};

// MVP features: Dashboard, Brand Health, Brand Consistency, Guideline, Library, Design System, Admin
// Hidden for MVP: Marketing Suite, Platform Optimizer, Competitors, Roadmaps, Generate, Template, Mindmap View, Playbook, Requests
const navigation: NavigationItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: Home, mvp: true },
  { title: "Brand Health", url: "/brand-health", icon: Activity, badge: "12", mvp: true },
  { title: "Consistency Monitor", url: "/brand-consistency", icon: Shield, badge: "5", mvp: true },
  { 
    title: "Marketing", 
    icon: Megaphone,
    collapsible: true,
    mvp: false, // Hidden for MVP
    items: [
      { title: "Marketing Suite", url: "/marketing" },
      { title: "Platform Optimizer", url: "/marketing/optimizer" },
    ]
  },
  { title: "Competitors", url: "/competitors", icon: Plane, mvp: false },
  { title: "Roadmaps", url: "/roadmaps", icon: Map, mvp: false },
  { title: "Generate", url: "/generate", icon: Sparkles, badge: "5", mvp: false },
  { title: "Template", url: "/template", icon: LayoutTemplate, mvp: false },
  { title: "Mindmap View", url: "/mindmap", icon: Network, mvp: false },
  { title: "Guideline", url: "/guideline", icon: FileText, mvp: true },
  { title: "Library", url: "/library", icon: FolderOpen, mvp: true },
  { title: "Design System", url: "/design-system", icon: Palette, mvp: true },
  { title: "Playbook", url: "/playbook", icon: FileStack, mvp: false },
  { title: "Requests", url: "/requests", icon: Sparkles, mvp: false },
  { title: "Admin", url: "/admin", icon: Settings, mvp: true },
];

// Storage key for feature visibility state
const FEATURE_VISIBILITY_KEY = "pixify_show_all_features";

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [openGroups, setOpenGroups] = useState<string[]>(["Marketing"]);
  const [showAllFeatures, setShowAllFeatures] = useState(() => {
    return localStorage.getItem(FEATURE_VISIBILITY_KEY) === "true";
  });

  // Listen for custom events to toggle feature visibility
  useEffect(() => {
    const handleShowFeatures = () => {
      setShowAllFeatures(true);
      localStorage.setItem(FEATURE_VISIBILITY_KEY, "true");
    };
    
    const handleHideFeatures = () => {
      setShowAllFeatures(false);
      localStorage.setItem(FEATURE_VISIBILITY_KEY, "false");
    };

    window.addEventListener("pixify:show-all-features", handleShowFeatures);
    window.addEventListener("pixify:hide-features", handleHideFeatures);

    return () => {
      window.removeEventListener("pixify:show-all-features", handleShowFeatures);
      window.removeEventListener("pixify:hide-features", handleHideFeatures);
    };
  }, []);

  // Filter navigation based on MVP mode
  const visibleNavigation = showAllFeatures 
    ? navigation 
    : navigation.filter(item => item.mvp === true);

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => 
      prev.includes(title) ? prev.filter(g => g !== title) : [...prev, title]
    );
  };

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 px-4 py-4">
        <div className="flex items-center justify-center">
          <div className="h-12 w-12 rounded-2xl bg-foreground flex items-center justify-center overflow-hidden">
            <img 
              src={pixifyLogo} 
              alt="Pixify" 
              className="h-8 w-8 object-contain brightness-0 invert"
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {visibleNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.collapsible ? (
                    <div>
                      <button
                        onClick={() => toggleGroup(item.title)}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                          "hover:bg-muted/60",
                          openGroups.includes(item.title) && "bg-muted/40"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 text-muted-foreground" />
                          <span className="text-foreground">{item.title}</span>
                        </div>
                        <ChevronDown className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform",
                          openGroups.includes(item.title) && "rotate-180"
                        )} />
                      </button>
                      {openGroups.includes(item.title) && (
                        <div className="mt-1 ml-8 space-y-1">
                          {item.items?.map((subItem) => (
                            <NavLink
                              key={subItem.url}
                              to={subItem.url}
                              className={cn(
                                "block rounded-lg px-3 py-2 text-sm transition-all",
                                "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                              )}
                              activeClassName="bg-muted/80 text-foreground font-medium"
                            >
                              {subItem.title}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url!}
                        end
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-all",
                          "hover:bg-muted/60"
                        )}
                        activeClassName="bg-muted/80 font-medium"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 text-muted-foreground" />
                          <span>{item.title}</span>
                        </div>
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className="h-6 min-w-6 rounded-full px-2 text-xs font-semibold bg-primary/10 text-primary border-0"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 px-4 py-4">
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
