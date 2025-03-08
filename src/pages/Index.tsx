import React from 'react';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedReviewsSection from '@/components/home/FeaturedReviewsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import CtaSection from '@/components/home/CtaSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <FeaturedReviewsSection />
        <HowItWorksSection />
      </main>
    </div>
  );
};

export default Index;
