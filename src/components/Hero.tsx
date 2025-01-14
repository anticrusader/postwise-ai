import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFE29F] via-[#FFA99F] to-[#FF719A] opacity-5" />
      <div className="relative container mx-auto px-4 py-24 sm:py-32">
        <div className="text-center animate-fade-up">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Create Engaging Social Content with AI
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Automate your social media content creation with AI-powered tools. Generate engaging posts, optimize scheduling, and grow your audience faster.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Sparkles className="mr-2 h-4 w-4" /> Get Started Free
            </Button>
            <Button variant="outline" size="lg">
              View Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};