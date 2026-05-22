import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageTransition } from "@/components/PageTransition";

import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Guideline from "@/pages/Guideline";
import Library from "@/pages/Library";
import BrandHealth from "@/pages/BrandHealth";
import Governance from "@/pages/Governance";
import Admin from "@/pages/Admin";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import { Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border/60 bg-background sticky top-0 z-10">
          <div className="px-6 py-3 flex items-center gap-3">
            <SidebarTrigger />
            <div className="flex-1 max-w-2xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets, guidelines, anything..."
                className="pl-9 pr-12 h-9 bg-muted/40 border-border/60 rounded-lg"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-background border border-border/60 rounded px-1.5 py-0.5">⌘F</kbd>
            </div>
            <button className="h-9 w-9 rounded-full hover:bg-muted/60 flex items-center justify-center">
              <Bell className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="h-9 w-9 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold">SA</div>
          </div>
        </div>
        {children}
      </main>
    </div>
  </SidebarProvider>
);

export const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/auth" element={<Navigate to="/dashboard" replace />} />
        <Route path="/onboarding" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<AppLayout><PageTransition><Dashboard /></PageTransition></AppLayout>} />
        <Route path="/guideline" element={<AppLayout><PageTransition><Guideline /></PageTransition></AppLayout>} />
        <Route path="/library" element={<AppLayout><PageTransition><Library /></PageTransition></AppLayout>} />
        <Route path="/governance" element={<AppLayout><PageTransition><Governance /></PageTransition></AppLayout>} />
        <Route path="/brand-health" element={<AppLayout><PageTransition><BrandHealth /></PageTransition></AppLayout>} />
        <Route path="/admin" element={<AppLayout><PageTransition><Admin /></PageTransition></AppLayout>} />
        <Route path="/settings" element={<AppLayout><PageTransition><Settings /></PageTransition></AppLayout>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};
