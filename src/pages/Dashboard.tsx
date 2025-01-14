import { ContentCreation } from "@/components/dashboard/ContentCreation";
import { ProfileSection } from "@/components/dashboard/ProfileSection";
import { Analytics } from "@/components/dashboard/Analytics";
import { PostScheduler } from "@/components/dashboard/PostScheduler";
import { SocialIntegration } from "@/components/dashboard/SocialIntegration";

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
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