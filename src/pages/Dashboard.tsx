import { ContentCreation } from "@/components/dashboard/ContentCreation";
import { ProfileSection } from "@/components/dashboard/ProfileSection";
import { Analytics } from "@/components/dashboard/Analytics";
import { PostScheduler } from "@/components/dashboard/PostScheduler";
import { SocialIntegration } from "@/components/dashboard/SocialIntegration";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={signOut}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
      
      <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <ProfileSection />
              <ContentCreation />
            </div>
            <div className="space-y-8">
              <Analytics />
              <PostScheduler />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <SocialIntegration />
            </div>
            <div className="space-y-8">
              <Analytics />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;