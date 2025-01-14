import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Twitter, Linkedin, Instagram } from "lucide-react";

export const SocialIntegration = () => {
  const handleConnect = (platform: string) => {
    // Here you would implement the OAuth flow for each platform
    console.log(`Connecting to ${platform}`);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Connect Social Media</h2>
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleConnect('twitter')}
        >
          <Twitter className="mr-2 h-4 w-4" />
          Connect Twitter
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleConnect('linkedin')}
        >
          <Linkedin className="mr-2 h-4 w-4" />
          Connect LinkedIn
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleConnect('instagram')}
        >
          <Instagram className="mr-2 h-4 w-4" />
          Connect Instagram
        </Button>
      </div>
    </Card>
  );
};