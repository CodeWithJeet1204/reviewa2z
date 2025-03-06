
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, CircleArrowRight } from 'lucide-react';

const CtaSection = () => (
  <div className="bg-primary/5 py-16">
    <div className="container px-4 md:px-6 mx-auto">
      <div className="glass rounded-xl p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute -bottom-16 -right-16 h-64 w-64 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute -top-16 -left-16 h-64 w-64 bg-blue-400/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ready to discover honest, AI-generated reviews?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Start exploring our extensive collection of unbiased product analyses and make informed decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="transition-all duration-300 hover:scale-[1.02]" asChild>
              <Link to="/search">
                <Search className="mr-2 h-5 w-5" /> Explore Reviews
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/categories">
                Browse Categories <CircleArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CtaSection;
