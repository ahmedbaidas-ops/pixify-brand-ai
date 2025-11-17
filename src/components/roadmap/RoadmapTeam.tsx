import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface RoadmapTeamProps {
  roadmapId: string;
  members: any[];
}

const ROLES = [
  "Product Manager",
  "Designer",
  "Developer",
  "Marketing Manager",
  "Content Writer",
  "QA Engineer",
  "Stakeholder"
];

export function RoadmapTeam({ roadmapId, members }: RoadmapTeamProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [capacity, setCapacity] = useState("40");
  const [availability, setAvailability] = useState("100");
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch available users from the organization
  const { data: availableUsers } = useQuery({
    queryKey: ["available-users", roadmapId],
    queryFn: async () => {
      const { data: roadmap } = await supabase
        .from("roadmaps")
        .select("organization_id")
        .eq("id", roadmapId)
        .single();

      if (!roadmap) return [];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .eq("organization_id", roadmap.organization_id);

      // Filter out users already in the team
      const memberUserIds = members.map(m => m.user_id);
      return profiles?.filter(p => !memberUserIds.includes(p.id)) || [];
    },
    enabled: isAddDialogOpen,
  });

  const addMemberMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("roadmap_members")
        .insert({
          roadmap_id: roadmapId,
          user_id: selectedUserId,
          role: selectedRole,
          capacity: parseInt(capacity),
          availability: parseInt(availability),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap", roadmapId] });
      toast.success("Team member added successfully");
      setIsAddDialogOpen(false);
      setSelectedUserId("");
      setSelectedRole("");
      setCapacity("40");
      setAvailability("100");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add team member");
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from("roadmap_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap", roadmapId] });
      toast.success("Team member removed successfully");
      setMemberToRemove(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove team member");
    },
  });

  const handleAddMember = () => {
    if (!selectedUserId || !selectedRole) {
      toast.error("Please select a user and role");
      return;
    }
    addMemberMutation.mutate();
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Team Members</h2>
            <p className="text-sm text-muted-foreground">
              Manage team roles and capacity
            </p>
          </div>
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No team members assigned yet
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.user?.avatar_url} />
                    <AvatarFallback className="bg-primary/20 text-sm font-semibold">
                      {member.user?.display_name?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.user?.display_name || "Unknown"}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    {member.capacity}h/week • {member.availability}% available
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setMemberToRemove(member.id)}
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Select a user and assign them a role on this roadmap
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user">User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger id="user">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.display_name || "Unknown"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (hours/week)</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  min="1"
                  max="80"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Availability (%)</Label>
                <Input
                  id="availability"
                  type="number"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={addMemberMutation.isPending}>
              {addMemberMutation.isPending ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this team member from the roadmap? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => memberToRemove && removeMemberMutation.mutate(memberToRemove)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
