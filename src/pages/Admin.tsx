import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Flag, Gauge, Key, Webhook, Shield, Activity } from "lucide-react";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminFeatureFlags } from "@/components/admin/AdminFeatureFlags";
import { AdminQuotas } from "@/components/admin/AdminQuotas";
import { AdminSecrets } from "@/components/admin/AdminSecrets";
import { AdminWebhooks } from "@/components/admin/AdminWebhooks";
import { AdminRoles } from "@/components/admin/AdminRoles";
import { AdminAudit } from "@/components/admin/AdminAudit";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your organization settings, users, features, and integrations
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Roles</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="gap-2">
              <Flag className="h-4 w-4" />
              <span className="hidden sm:inline">Features</span>
            </TabsTrigger>
            <TabsTrigger value="quotas" className="gap-2">
              <Gauge className="h-4 w-4" />
              <span className="hidden sm:inline">Quotas</span>
            </TabsTrigger>
            <TabsTrigger value="secrets" className="gap-2">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">Secrets</span>
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="gap-2">
              <Webhook className="h-4 w-4" />
              <span className="hidden sm:inline">Webhooks</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Audit</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="roles">
            <AdminRoles />
          </TabsContent>

          <TabsContent value="features">
            <AdminFeatureFlags />
          </TabsContent>

          <TabsContent value="quotas">
            <AdminQuotas />
          </TabsContent>

          <TabsContent value="secrets">
            <AdminSecrets />
          </TabsContent>

          <TabsContent value="webhooks">
            <AdminWebhooks />
          </TabsContent>

          <TabsContent value="audit">
            <AdminAudit />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}