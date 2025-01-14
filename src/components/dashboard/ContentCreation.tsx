import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Platform } from "@/types";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateContent, postToTwitter } from "@/lib/api-integration";
import { Wand2 } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type LLMProvider = "openai" | "perplexity" | "ollama";

const templates = [
  {
    id: 1,
    name: "Announcement",
    content: "🎉 Exciting news! We're thrilled to announce...",
  },
  {
    id: 2,
    name: "Tip",
    content: "💡 Pro tip: Here's how you can...",
  },
  {
    id: 3,
    name: "Question",
    content: "🤔 What do you think about...?",
  },
];

export const ContentCreation = () => {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState<Platform>("twitter");
  const [llmProvider, setLLMProvider] = useState<LLMProvider>("openai");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createPost = async () => {
    try {
      setLoading(true);
      
      if (platform === "twitter") {
        await postToTwitter(content);
      }

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

  const generatePostContent = async () => {
    try {
      setGenerating(true);
      setError(null);
      const prompt = `Generate a social media post about ${platform}. Keep it engaging and professional.`;
      const generatedContent = await generateContent(prompt, llmProvider);
      setContent(generatedContent);
      toast({
        title: "Content generated",
        description: "AI-generated content has been added to your post.",
      });
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error generating content",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const applyTemplate = (templateContent: string) => {
    setContent(templateContent);
  };

  const PreviewCard = ({ content }: { content: string }) => (
    <Card className="p-4 max-w-md mx-auto">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div>
            <p className="font-semibold">Your Name</p>
            <p className="text-sm text-gray-500">@yourhandle</p>
          </div>
        </div>
        <p className="text-gray-900">{content}</p>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Create Content</h2>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Templates</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choose a Template</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => applyTemplate(template.content)}
                  >
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.content}</p>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Select value={llmProvider} onValueChange={(value) => setLLMProvider(value as LLMProvider)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select AI Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI GPT-4</SelectItem>
              <SelectItem value="perplexity">Perplexity</SelectItem>
              <SelectItem value="ollama">Ollama (Local)</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={generatePostContent}
            disabled={generating}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {generating ? "Generating..." : "Generate with AI"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Select value={platform} onValueChange={(value) => setPlatform(value as Platform)}>
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="twitter">Twitter</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
          </SelectContent>
        </Select>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content..."
          className="min-h-[200px]"
        />

        <Tabs defaultValue="edit">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <Button onClick={createPost} disabled={loading || !content} className="w-full">
              {loading ? "Creating..." : "Create Post"}
            </Button>
          </TabsContent>
          <TabsContent value="preview">
            <PreviewCard content={content} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
