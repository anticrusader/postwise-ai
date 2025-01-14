import { Bot, Calendar, LineChart, Share2 } from "lucide-react";

const steps = [
  {
    title: "Connect Your Accounts",
    description: "Link your social media accounts in one place for seamless management",
    icon: Share2,
  },
  {
    title: "Generate Content",
    description: "Use AI to create engaging posts tailored to your brand voice",
    icon: Bot,
  },
  {
    title: "Schedule Posts",
    description: "Plan and schedule your content for optimal posting times",
    icon: Calendar,
  },
  {
    title: "Track Performance",
    description: "Monitor engagement and optimize your strategy with detailed analytics",
    icon: LineChart,
  },
];

export const HowItWorks = () => {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Get started in minutes with our simple four-step process
          </p>
        </div>
        <div className="mt-16 flow-root">
          <div className="relative">
            <div className="absolute inset-0 h-3 top-1/2 transform -translate-y-1/2 bg-gray-100" />
            <ul className="relative grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="relative flex flex-col items-center bg-white p-6 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-center text-gray-600">{step.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};