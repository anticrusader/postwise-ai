import { Users, MessageSquare, Zap } from "lucide-react";

const stats = [
  {
    name: "Active Users",
    value: "50,000+",
    icon: Users,
    description: "Trust our platform",
  },
  {
    name: "Posts Created",
    value: "1M+",
    icon: MessageSquare,
    description: "Generated with AI",
  },
  {
    name: "Time Saved",
    value: "1000+",
    icon: Zap,
    description: "Hours per month",
  },
];

export const SocialProof = () => {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by thousands
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Join the growing community of successful social media managers
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {stats.map((stat, index) => (
              <div
                key={stat.name}
                className="flex flex-col items-center animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
                <dd className="mt-2 text-4xl font-bold leading-9 tracking-tight text-gray-900">
                  {stat.value}
                </dd>
                <stat.icon className="mt-4 h-8 w-8 text-primary" />
                <p className="mt-2 text-base leading-7 text-gray-600">{stat.description}</p>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};