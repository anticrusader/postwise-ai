import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export const ProfileSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const updateProfile = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    try {
      setPasswordLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      setNewPassword("");
      setCurrentPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profile Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <Input value={user?.email || ""} disabled />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <Button onClick={updateProfile} disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </Button>

        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <Button 
              onClick={changePassword} 
              disabled={passwordLoading || !newPassword || !currentPassword}
            >
              {passwordLoading ? "Changing Password..." : "Change Password"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};