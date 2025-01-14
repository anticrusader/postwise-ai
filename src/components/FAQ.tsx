import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What platforms do you support?",
    answer: "We currently support Twitter, Instagram, LinkedIn, and Facebook, with more platforms being added regularly.",
  },
  {
    question: "How does the AI content generation work?",
    answer: "Our AI analyzes your brand voice, past content, and industry trends to generate relevant and engaging posts that resonate with your audience.",
  },
  {
    question: "Can I schedule posts in advance?",
    answer: "Yes! You can schedule posts weeks or months in advance across all connected platforms, with smart scheduling suggestions for optimal posting times.",
  },
  {
    question: "What analytics do you provide?",
    answer: "We provide comprehensive analytics including engagement rates, reach, follower growth, best performing content types, and optimal posting times.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, we offer a 14-day free trial with access to all features so you can experience the full power of our platform.",
  },
];

export const FAQ = () => {
  return (
    <div className="py-24 sm:py-32 bg-secondary">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Find answers to common questions about our platform
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl animate-fade-up">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};