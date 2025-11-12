import { Home, FileText, FolderOpen, Palette, FileStack, Settings, Sparkles, Network, Activity, Plane, Megaphone } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import pixifyLogo from "@/assets/pixify-logo.png";

const navigation = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Brand Health", url: "/brand-health", icon: Activity },
  { title: "Marketing Suite", url: "/marketing", icon: Megaphone },
  { title: "Competitors", url: "/competitors", icon: Plane },
  { title: "Generate", url: "/generate", icon: Sparkles },
  { title: "Mindmap View", url: "/mindmap", icon: Network },
  { title: "Guideline", url: "/guideline", icon: FileText },
  { title: "Library", url: "/library", icon: FolderOpen },
  { title: "Design System", url: "/design-system", icon: Palette },
  { title: "Playbook", url: "/playbook", icon: FileStack },
  { title: "Requests", url: "/requests", icon: Sparkles },
  { title: "Admin", url: "/admin", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-6 py-6">
        <img 
          src={pixifyLogo} 
          alt="Pixify" 
          className="h-10 w-auto object-contain"
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
