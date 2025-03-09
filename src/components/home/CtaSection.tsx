import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import FallingReviews from './FallingReviews';

const CtaSection = () => {
  return (
    <section className="relative min-h-[60vh] w-full overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      {/* Falling Reviews Background */}
      <FallingReviews />

      {/* Gradient Overlays for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      {/* Content */}
      <div className="relative z-10 container px-4 md:px-6 mx-auto flex items-center min-h-[60vh]">
        <div className="text-center max-w-2xl mx-auto">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold tracking-tighter mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Experience Unbiased, 
            <span className="text-primary block mt-2">AI-Powered Reviews?</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of smart shoppers who trust our AI-driven analysis for their purchasing decisions.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              asChild
              size="lg" 
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 relative z-10"
            >
              <Link to="/categories">
                Explore Reviews
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 backdrop-blur-sm bg-background/50 hover:bg-background/80 transition-all duration-300 hover:scale-105 relative z-10"
            >
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
