import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminRoles() {
  const { data: abilities, isLoading: loadingAbilities } = useQuery({
    queryKey: ["abilities"],
    queryFn: async () => {
      const { data } = await supabase
        .from("abilities")
        .select("*")
        .order("category", { ascending: true });
      return data || [];
    },
  });

  const { data: roleAbilities, isLoading: loadingRoles } = useQuery({
    queryKey: ["role-abilities"],
    queryFn: async () => {
      const { data } = await supabase
        .from("role_abilities")
        .select("*, abilities(*)");
      return data || [];
    },
  });

  if (loadingAbilities || loadingRoles) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const rolesList = ["admin", "editor", "viewer"];

  const getRoleAbilities = (role: string) => {
    return roleAbilities
      ?.filter((ra) => ra.role === role)
      .map((ra) => ra.abilities)
      .filter(Boolean) || [];
  };

  const groupByCategory = (abs: any[]) => {
    const grouped: Record<string, any[]> = {};
    abs.forEach((ability) => {
      if (!grouped[ability.category]) {
        grouped[ability.category] = [];
      }
      grouped[ability.category].push(ability);
    });
    return grouped;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Roles & Abilities</h2>
        <p className="text-muted-foreground">
          View role-based access control (RBAC) permissions across the system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rolesList.map((role) => {
          const abs = getRoleAbilities(role);
          const grouped = groupByCategory(abs);

          return (
            <Card key={role}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="capitalize">{role}</span>
                  <Badge variant="outline">{abs.length} abilities</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(grouped).map(([category, catAbilities]) => (
                    <div key={category}>
                      <h4 className="text-sm font-semibold capitalize mb-2 text-muted-foreground">
                        {category}
                      </h4>
                      <div className="space-y-1">
                        {catAbilities.map((ability: any) => (
                          <div
                            key={ability.id}
                            className="text-sm flex items-center gap-2"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <span>{ability.description || ability.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}