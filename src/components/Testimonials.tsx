import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Social Media Manager",
    company: "TechCorp",
    image: "/placeholder.svg",
    quote: "This platform has revolutionized how we manage our social media presence. The AI-powered content suggestions are incredibly accurate.",
  },
  {
    name: "Michael Chen",
    role: "Marketing Director",
    company: "GrowthLabs",
    image: "/placeholder.svg",
    quote: "The analytics insights have helped us increase our engagement by 150%. Best investment for our social media strategy.",
  },
  {
    name: "Emma Davis",
    role: "Content Creator",
    company: "CreativeHub",
    image: "/placeholder.svg",
    quote: "The scheduling features save me hours every week. It's like having a personal assistant for social media.",
  },
];

export const Testimonials = () => {
  return (
    <div className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by creators worldwide
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            See what our users are saying about their experience
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={testimonial.name} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-base font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 italic">&quot;{testimonial.quote}&quot;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};