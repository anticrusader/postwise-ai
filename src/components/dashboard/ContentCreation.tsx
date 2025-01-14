import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Platform } from "@/types";

export const ContentCreation = () => {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState<Platform>("twitter");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createPost = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.from("posts").insert({
        content,
        platform,
        status: "draft",
      });

      if (error) throw error;

      setContent("");
      toast({
        title: "Post created",
        description: "Your post has been saved as a draft.",
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Create Content</h2>
      <div className="space-y-4">
        <select
          className="w-full p-2 border rounded"
          value={platform}
          onChange={(e) => setPlatform(e.target.value as Platform)}
        >
          <option value="twitter">Twitter</option>
          <option value="linkedin">LinkedIn</option>
          <option value="instagram">Instagram</option>
        </select>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content..."
          className="min-h-[200px]"
        />
        <Button onClick={createPost} disabled={loading || !content}>
          {loading ? "Creating..." : "Create Post"}
        </Button>
      </div>
    </div>
  );
};