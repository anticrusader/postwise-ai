import { ContentCreation } from "@/components/dashboard/ContentCreation";
import { ProfileSection } from "@/components/dashboard/ProfileSection";
import { Analytics } from "@/components/dashboard/Analytics";
import { PostScheduler } from "@/components/dashboard/PostScheduler";
import { SocialIntegration } from "@/components/dashboard/SocialIntegration";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

const Dashboard = () => {
  const { signOut } = useAuth();

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <ProfileSection />
          <ContentCreation />
          <PostScheduler />
        </div>
        
        <div className="space-y-8">
          <Analytics />
          <SocialIntegration />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;