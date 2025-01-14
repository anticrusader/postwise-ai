import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Twitter, Linkedin, Instagram, Youtube, Facebook, Globe } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Platform = {
  id: string;
  name: string;
  icon: React.ElementType;
  connected: boolean;
};

export const SocialIntegration = () => {
  const { toast } = useToast();
  const [platforms, setPlatforms] = useState<Platform[]>([
    { id: "twitter", name: "Twitter", icon: Twitter, connected: false },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, connected: false },
    { id: "instagram", name: "Instagram", icon: Instagram, connected: false },
    { id: "youtube", name: "YouTube", icon: Youtube, connected: false },
    { id: "facebook", name: "Facebook", icon: Facebook, connected: false },
  ]);
  const [webhookUrl, setWebhookUrl] = useState("");

  const handleConnect = (platformId: string) => {
    // Here you would implement the OAuth flow for each platform
    setPlatforms(platforms.map(p => 
      p.id === platformId ? { ...p, connected: !p.connected } : p
    ));
    
    toast({
      title: "Platform Connected",
      description: `Successfully connected to ${platformId}`,
    });
  };

  const handleWebhookSave = () => {
    if (!webhookUrl) return;
    
    toast({
      title: "Webhook Saved",
      description: "Your webhook URL has been saved successfully.",
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Connect Social Media</h2>
      
      <div className="space-y-4">
        {platforms.map((platform) => (
          <Button
            key={platform.id}
            variant={platform.connected ? "default" : "outline"}
            className="w-full"
            onClick={() => handleConnect(platform.id)}
          >
            <platform.icon className="mr-2 h-4 w-4" />
            {platform.connected ? `Disconnect ${platform.name}` : `Connect ${platform.name}`}
          </Button>
        ))}

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Globe className="mr-2 h-4 w-4" />
              Configure Webhook
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configure Webhook</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Webhook URL</label>
                <Input
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-webhook-url.com"
                />
              </div>
              <Button onClick={handleWebhookSave} className="w-full">
                Save Webhook
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};