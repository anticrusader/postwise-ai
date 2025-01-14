import { Bot, Calendar, LineChart, Share2 } from "lucide-react";

const features = [
  {
    name: "AI-Powered Content",
    description: "Generate engaging posts tailored to your brand voice using advanced AI.",
    icon: Bot,
  },
  {
    name: "Smart Scheduling",
    description: "Post at the perfect time with AI-optimized scheduling suggestions.",
    icon: Calendar,
  },
  {
    name: "Multi-Platform Support",
    description: "Manage all your social media accounts from one dashboard.",
    icon: Share2,
  },
  {
    name: "Advanced Analytics",
    description: "Track performance and optimize your content strategy with detailed insights.",
    icon: LineChart,
  },
];

export const Features = () => {
  return (
    <div className="py-24 sm:py-32 bg-secondary">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to succeed on social media
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Powerful tools to help you create, schedule, and analyze your social media content.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col items-start animate-fade-up">
                <div className="rounded-lg bg-white p-2 ring-1 ring-gray-200">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <dt className="mt-4 font-semibold text-gray-900">{feature.name}</dt>
                <dd className="mt-2 leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};