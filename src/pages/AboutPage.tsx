
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Bot, Star, Shield, Sparkles, Database, Code, BarChart, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container px-4 md:px-6 mx-auto py-8 mt-24">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-4 text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground">About</span>
        </div>

        {/* Page Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">About ReviewsA2Z</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We're revolutionizing product reviews through AI-powered analysis, 
            providing unbiased, comprehensive, and data-driven insights to help 
            you make informed purchasing decisions.
          </p>
        </div>

        <Separator className="my-10" />

        {/* Our Mission */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 text-center">Our Mission</h2>
          <div className="glass p-8 rounded-xl max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3 flex justify-center">
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-16 w-16 text-primary" />
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-lg leading-relaxed">
                  At ReviewsA2Z, we believe that traditional review platforms have become 
                  increasingly unreliable due to bias, fake reviews, and incentivized content. 
                  Our mission is to leverage artificial intelligence to analyze vast amounts of 
                  product data and consumer feedback, synthesizing this information into 
                  comprehensive, unbiased reviews that you can trust.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  We're committed to transparency, accuracy, and continually improving our AI 
                  technology to deliver the most reliable product insights possible.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 text-center">How Our AI Reviews Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Database className="h-10 w-10 text-primary" />,
                title: "Data Collection",
                description: "Our AI gathers comprehensive data from multiple sources including product specifications, verified customer feedback, expert opinions, and performance metrics."
              },
              {
                icon: <BarChart className="h-10 w-10 text-primary" />,
                title: "Analysis & Synthesis",
                description: "Advanced algorithms analyze the collected data, identifying patterns, strengths, weaknesses, and overall performance characteristics of each product."
              },
              {
                icon: <Sparkles className="h-10 w-10 text-primary" />,
                title: "Review Generation",
                description: "The AI creates a detailed, unbiased review with clear pros and cons, performance metrics, and helpful recommendations based on the analyzed data."
              }
            ].map((step, index) => (
              <div key={index} className="glass p-6 rounded-xl text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Advantages */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-10 text-center">The ReviewsA2Z Advantage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8 text-primary" />,
                title: "Unbiased Analysis",
                description: "Our AI doesn't have personal preferences or incentives to promote certain products, ensuring truly objective reviews."
              },
              {
                icon: <Search className="h-8 w-8 text-primary" />,
                title: "Comprehensive Coverage",
                description: "We analyze far more data points than a human reviewer could, capturing the full picture of a product's performance."
              },
              {
                icon: <Star className="h-8 w-8 text-primary" />,
                title: "Consistent Evaluation",
                description: "Every product is assessed using the same rigorous criteria, making comparisons more reliable."
              },
              {
                icon: <Code className="h-8 w-8 text-primary" />,
                title: "Continuously Improving",
                description: "Our AI models are constantly learning and improving, incorporating new data and refining analysis methods."
              }
            ].map((advantage, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  {advantage.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{advantage.title}</h3>
                  <p className="text-muted-foreground">{advantage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-16">
          <div className="glass p-10 rounded-xl max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to discover better reviews?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start exploring our AI-generated reviews today and make more informed purchasing decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/search">Browse All Reviews</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/categories">Explore Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
