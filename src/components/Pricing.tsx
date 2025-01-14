import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out our platform",
    features: [
      "5 AI-generated posts per month",
      "Basic post templates",
      "Simple analytics",
      "Single platform connection",
    ],
  },
  {
    name: "Creator",
    price: "$19",
    description: "Great for content creators and small businesses",
    features: [
      "50 AI-generated posts per month",
      "Advanced post templates",
      "Content calendar",
      "Multi-platform posting",
      "Enhanced analytics",
      "Hashtag suggestions",
    ],
  },
  {
    name: "Professional",
    price: "$49",
    description: "For growing teams and businesses",
    features: [
      "Unlimited AI-generated posts",
      "Custom templates",
      "Advanced scheduling",
      "All social platforms",
      "Team collaboration",
      "Advanced analytics",
      "Content recycling",
    ],
  },
  {
    name: "Enterprise",
    price: "$199",
    description: "Custom solutions for large organizations",
    features: [
      "Custom AI training",
      "Multiple workspaces",
      "API access",
      "Dedicated support",
      "White-label options",
      "Custom integrations",
    ],
  },
];

export const Pricing = () => {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Choose the perfect plan for your needs. All plans include our core features.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-6 sm:mt-20 lg:max-w-none lg:grid-cols-4">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8 text-gray-900">
                    {tier.name}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {tier.price}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                className="mt-8 w-full"
                variant={index === 2 ? "default" : "outline"}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};