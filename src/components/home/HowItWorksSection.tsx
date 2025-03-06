
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Search, Bot, Star } from 'lucide-react';

const HowItWorksSection = () => (
  <div className="container px-4 md:px-6 mx-auto py-16">
    <div className="space-y-2 text-center mb-12">
      <h2 className="text-3xl font-bold tracking-tight">How ReviewsA2Z Works</h2>
      <p className="text-muted-foreground max-w-[700px] mx-auto">
        We leverage advanced AI to create unbiased, data-driven reviews
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          title: "Data Collection",
          description: "Our AI gathers product specifications, customer feedback, and performance metrics from multiple sources.",
          icon: <Search className="h-8 w-8 text-primary" />,
        },
        {
          title: "AI Analysis",
          description: "Advanced algorithms analyze the data to identify strengths, weaknesses, and overall performance.",
          icon: <Bot className="h-8 w-8 text-primary" />,
        },
        {
          title: "Review Generation",
          description: "The AI creates a comprehensive, unbiased review with pros, cons, and detailed analysis.",
          icon: <Star className="h-8 w-8 text-primary" />,
        },
      ].map((step, i) => (
        <div 
          key={i}
          className="glass p-6 rounded-xl text-center transition-all duration-300 hover:shadow-md animate-fade-in"
          style={{ animationDelay: `${i * 200}ms` }}
        >
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
            {step.icon}
          </div>
          <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
          <p className="text-muted-foreground">{step.description}</p>
        </div>
      ))}
    </div>
    
    <div className="mt-12 text-center">
      <Button variant="outline" asChild>
        <Link to="/about">
          Learn More About Our Process <ChevronRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </div>
  </div>
);

export default HowItWorksSection;
