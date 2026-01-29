import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageTransition } from "@/components/PageTransition";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Guideline from "@/pages/Guideline";
import Library from "@/pages/Library";
import Mindmap from "@/pages/Mindmap";
import DesignSystem from "@/pages/DesignSystem";
import BrandHealth from "@/pages/BrandHealth";
import BrandConsistencyMonitor from "@/pages/BrandConsistencyMonitor";
import Marketing from "@/pages/Marketing";
import Competitors from "@/pages/Competitors";
import Generate from "@/pages/Generate";
import PlatformOptimizer from "@/pages/PlatformOptimizer";
import Template from "@/pages/Template";
import Strategy from "@/pages/Strategy";
import Admin from "@/pages/Admin";
import Roadmaps from "@/pages/Roadmaps";
import Roadmap from "@/pages/Roadmap";
import Auth from "@/pages/Auth";
import Onboarding from "@/pages/Onboarding";
import NotFound from "@/pages/NotFound";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuthAndOnboarding = async (userId: string) => {
      // Get user's organization
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", userId)
        .single();

      if (profile?.organization_id) {
        // Check if onboarding is complete
        const { data: workspaceProfile } = await supabase
          .from("workspace_profiles")
          .select("onboarding_complete")
          .eq("organization_id", profile.organization_id)
          .single();

        setOnboardingComplete(workspaceProfile?.onboarding_complete ?? false);
      } else {
        setOnboardingComplete(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAuthAndOnboarding(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAuthAndOnboarding(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to onboarding if not complete
  if (onboardingComplete === false && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="border-b border-border bg-card sticky top-0 z-10">
            <div className="px-6 py-3">
              <SidebarTrigger />
            </div>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />
        <Route
          path="/dashboard"
          element={
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <AppSidebar />
                <main className="flex-1 overflow-auto">
                  <div className="border-b border-border bg-card sticky top-0 z-10">
                    <div className="px-6 py-3">
                      <SidebarTrigger />
                    </div>
                  </div>
                  <PageTransition><Dashboard /></PageTransition>
                </main>
              </div>
            </SidebarProvider>
          }
        />
        <Route
          path="/guideline"
          element={
            <ProtectedLayout>
              <PageTransition><Guideline /></PageTransition>
            </ProtectedLayout>
          }
        />
        <Route
          path="/library"
          element={
            <ProtectedLayout>
              <PageTransition><Library /></PageTransition>
            </ProtectedLayout>
          }
        />
        <Route
          path="/mindmap"
          element={
            <ProtectedLayout>
              <PageTransition><Mindmap /></PageTransition>
            </ProtectedLayout>
          }
        />
        <Route
          path="/design-system"
          element={<PageTransition><DesignSystem /></PageTransition>}
        />
        <Route
          path="/brand-health"
          element={
            <ProtectedLayout>
              <PageTransition><BrandHealth /></PageTransition>
            </ProtectedLayout>
          }
        />
        <Route
          path="/brand-consistency"
          element={
            <ProtectedLayout>
              <PageTransition><BrandConsistencyMonitor /></PageTransition>
            </ProtectedLayout>
          }
        />
        <Route
          path="/marketing"
          element={
            <ProtectedLayout>
              <PageTransition><Marketing /></PageTransition>
            </ProtectedLayout>
          }
        />
        <Route
          path="/marketing/optimizer"
          element={
            <ProtectedLayout>
              <PageTransition><PlatformOptimizer /></PageTransition>
            </ProtectedLayout>
          }
        />
        <Route
          path="/competitors"
          element={
            <ProtectedLayout>
              <PageTransition><Competitors /></PageTransition>
            </ProtectedLayout>
          }
        />
        <Route
          path="/generate"
          element={
            <ProtectedLayout>
              <PageTransition><Generate /></PageTransition>
            </ProtectedLayout>
          }
        />
        <Route
          path="/template"
          element={
            <ProtectedLayout>
              <PageTransition><Template /></PageTransition>
            </ProtectedLayout>
          }
        />
        <Route
          path="/strategy"
          element={
            <ProtectedLayout>
              <PageTransition><Strategy /></PageTransition>
            </ProtectedLayout>
          }
        />
        <Route
          path="/playbook"
          element={
            <ProtectedLayout>
              <PageTransition>
                <div className="p-8">
                  <h1 className="text-4xl font-bold">Playbook</h1>
                  <p className="text-muted-foreground mt-2">Coming soon</p>
                </div>
              </PageTransition>
            </ProtectedLayout>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedLayout>
              <PageTransition>
                <div className="p-8">
                  <h1 className="text-4xl font-bold">Requests</h1>
                  <p className="text-muted-foreground mt-2">Coming soon</p>
                </div>
              </PageTransition>
            </ProtectedLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedLayout>
              <PageTransition><Admin /></PageTransition>
            </ProtectedLayout>
          }
        />
        <Route
          path="/roadmaps"
          element={
            <ProtectedLayout>
              <PageTransition><Roadmaps /></PageTransition>
            </ProtectedLayout>
          }
        />
        <Route
          path="/roadmaps/:id"
          element={
            <ProtectedLayout>
              <PageTransition><Roadmap /></PageTransition>
            </ProtectedLayout>
          }
        />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};
