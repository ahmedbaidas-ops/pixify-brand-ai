import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { ThemeProvider } from "next-themes";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Guideline from "./pages/Guideline";
import Library from "./pages/Library";
import Mindmap from "./pages/Mindmap";
import DesignSystem from "./pages/DesignSystem";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedLayout>
                  <Dashboard />
                </ProtectedLayout>
              }
            />
            <Route
              path="/guideline"
              element={
                <ProtectedLayout>
                  <Guideline />
                </ProtectedLayout>
              }
            />
            <Route
              path="/library"
              element={
                <ProtectedLayout>
                  <Library />
                </ProtectedLayout>
              }
            />
            <Route
              path="/mindmap"
              element={
                <ProtectedLayout>
                  <Mindmap />
                </ProtectedLayout>
              }
            />
            <Route
              path="/design-system"
              element={
                <DesignSystem />
              }
            />
            <Route
              path="/playbook"
              element={
                <ProtectedLayout>
                  <div className="p-8">
                    <h1 className="text-4xl font-bold">Playbook</h1>
                    <p className="text-muted-foreground mt-2">Coming soon</p>
                  </div>
                </ProtectedLayout>
              }
            />
            <Route
              path="/requests"
              element={
                <ProtectedLayout>
                  <div className="p-8">
                    <h1 className="text-4xl font-bold">Requests</h1>
                    <p className="text-muted-foreground mt-2">Coming soon</p>
                  </div>
                </ProtectedLayout>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedLayout>
                  <div className="p-8">
                    <h1 className="text-4xl font-bold">Admin</h1>
                    <p className="text-muted-foreground mt-2">Coming soon</p>
                  </div>
                </ProtectedLayout>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
