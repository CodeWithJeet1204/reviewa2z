import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Shield, Bot, Star, Sparkles, Quote } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, useAnimation, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface ParticleProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  x: string;
  y: string;
  size: number;
}

interface FloatingOrbProps {
  delay: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

interface ParticlesBackgroundProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

interface FloatingReviewProps {
  delay: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
  index: number;
}

// Sample review data
const sampleReviews = [
  {
    title: "Incredible Experience",
    rating: 5,
    text: "This product completely transformed how I work. The AI-powered features are truly revolutionary...",
    author: "Sarah J.",
    category: "Electronics"
  },
  {
    title: "Outstanding Quality",
    rating: 5,
    text: "The attention to detail and premium materials make this worth every penny. Exactly what I was looking for...",
    author: "Mike R.",
    category: "Home & Living"
  },
  {
    title: "Game Changer",
    rating: 5,
    text: "Never experienced anything like this before. The smart features are incredibly intuitive...",
    author: "Alex M.",
    category: "Tech"
  },
  {
    title: "Exceeded Expectations",
    rating: 4,
    text: "The innovative design and seamless integration with my workflow has made this indispensable...",
    author: "Emma L.",
    category: "Productivity"
  },
  {
    title: "Simply Amazing",
    rating: 5,
    text: "The perfect balance of form and function. Every detail has been thoughtfully considered...",
    author: "James K.",
    category: "Design"
  },
  {
    title: "Life-Changing Product",
    rating: 5,
    text: "This has revolutionized my daily routine. The smart features are incredibly well implemented...",
    author: "Lisa M.",
    category: "Lifestyle"
  },
  {
    title: "Brilliant Innovation",
    rating: 5,
    text: "The AI capabilities are truly next-level. It learns and adapts to your preferences perfectly...",
    author: "David R.",
    category: "AI & Tech"
  },
  {
    title: "Worth Every Penny",
    rating: 4,
    text: "The premium quality and attention to detail are immediately apparent. Highly recommended...",
    author: "Sophie T.",
    category: "Premium"
  },
  {
    title: "Perfect Choice",
    rating: 5,
    text: "Couldn't be happier with this purchase. The smart features work flawlessly...",
    author: "Chris P.",
    category: "Smart Home"
  }
];

// Particle component with mouse interaction
const Particle = ({ mouseX, mouseY, x, y, size = 3 }: ParticleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const distanceThreshold = 100;
  const springConfig = { damping: 15, stiffness: 150 };
  
  const dx = useTransform(mouseX, (mx: number) => {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    const distance = Math.abs(mx - (rect.left + (size/2)));
    return distance < distanceThreshold ? (mx - (rect.left + (size/2))) * 0.2 : 0;
  });
  
  const dy = useTransform(mouseY, (my: number) => {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    const distance = Math.abs(my - (rect.top + (size/2)));
    return distance < distanceThreshold ? (my - (rect.top + (size/2))) * 0.2 : 0;
  });
  
  const springX = useSpring(dx, springConfig);
  const springY = useSpring(dy, springConfig);

  return (
    <motion.div
      ref={ref}
      className="absolute rounded-full bg-primary/20"
      style={{
        width: size,
        height: size,
        x: springX,
        y: springY,
        left: x,
        top: y,
      }}
      animate={{
        opacity: [0.2, 0.5, 0.2],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: Math.random() * 2 + 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

const FloatingOrb = ({ delay = 0, mouseX, mouseY }: FloatingOrbProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const springConfig = { damping: 25, stiffness: 200 };
  
  const dx = useTransform(mouseX, (mx: number) => {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    return (mx - (rect.left + rect.width/2)) * 0.1;
  });
  
  const dy = useTransform(mouseY, (my: number) => {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    return (my - (rect.top + rect.height/2)) * 0.1;
  });
  
  const springX = useSpring(dx, springConfig);
  const springY = useSpring(dy, springConfig);

  return (
    <motion.div
      ref={ref}
      className="absolute rounded-full bg-primary/10 backdrop-blur-sm"
      style={{
        width: Math.random() * 100 + 50,
        height: Math.random() * 100 + 50,
        x: springX,
        y: springY,
      }}
      initial={{ scale: 0.8, opacity: 0.3 }}
      animate={{
        scale: [0.8, 1, 0.8],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    />
  );
};

// Glowing dots background
const ParticlesBackground = ({ mouseX, mouseY }: ParticlesBackgroundProps) => {
  const particles = Array.from({ length: 50 }).map(() => ({
    x: Math.random() * 100 + '%',
    y: Math.random() * 100 + '%',
    size: Math.random() * 4 + 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden hidden md:block">
      {particles.map((particle, index) => (
        <Particle
          key={index}
          mouseX={mouseX}
          mouseY={mouseY}
          x={particle.x}
          y={particle.y}
          size={particle.size}
        />
      ))}
    </div>
  );
};

const FloatingReview = ({ delay = 0, mouseX, mouseY, position, index }: FloatingReviewProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const review = sampleReviews[index % sampleReviews.length];
  
  return (
    <motion.div
      ref={ref}
      className="absolute w-72 hidden md:block"
      style={{
        ...position,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 0.9,
        scale: 1,
        y: [-10, 10],
        x: [index % 2 === 0 ? -10 : 10, index % 2 === 0 ? 10 : -10],
        rotate: [index % 2 === 0 ? -1 : 1, index % 2 === 0 ? 1 : -1],
      }}
      whileHover={{
        scale: 1.05,
        opacity: 1,
        rotate: 0,
        transition: { duration: 0.2 }
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    >
      <Card className="bg-background/60 backdrop-blur-sm border-background/50 hover:bg-background/70 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2 mt-1">
              <Quote className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                ))}
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">{review.title}</h3>
              <p className="text-sm text-foreground/80 line-clamp-2 mb-2">{review.text}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-primary/90">{review.author}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{review.category}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 768 : false;
  const [isDesktopView, setIsDesktopView] = useState(isDesktop);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsDesktopView(window.innerWidth >= 768);
    };
    
    if (isDesktopView) {
      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      };
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isDesktopView]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Review card positions - adjusted for side layout
  const reviewPositions = [
    // Left side reviews
    { top: '5%', left: '2%' },
    { top: '30%', left: '5%' },
    { top: '55%', left: '3%' },
    { bottom: '15%', left: '8%' },
    { top: '20%', left: '15%' },
    // Right side reviews
    { top: '10%', right: '3%' },
    { top: '35%', right: '6%' },
    { top: '60%', right: '4%' },
    { bottom: '20%', right: '7%' },
    { top: '25%', right: '12%' }
  ];

  return (
    <div className="relative bg-gradient-to-b from-blue-50 via-background to-transparent dark:from-gray-900 min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background with Particles - Desktop Only */}
      {isDesktopView && <ParticlesBackground mouseX={mouseX} mouseY={mouseY} />}
      
      {/* Floating Review Cards - Desktop Only */}
      {isDesktopView && (
        <div className="absolute inset-0 overflow-visible px-12">
          {reviewPositions.slice(0, isDesktopView ? 10 : 0).map((position, index) => (
            <FloatingReview
              key={index}
              index={index}
              delay={index * 0.1}
              mouseX={mouseX}
              mouseY={mouseY}
              position={position}
            />
          ))}
        </div>
      )}
            
      {/* Gradient Overlay - Desktop Only */}
      {isDesktopView && (
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/30 to-background pointer-events-none" />
      )}

      {/* Content */}
      <div className="relative text-center max-w-2xl mx-auto space-y-8 md:space-y-12 px-4 z-10">
        {/* Search Bar */}
        <div className="relative flex gap-2 max-w-xl mx-auto">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
            <Input
              type="text"
              placeholder="Search for reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-4 w-full transition-all border-2 bg-background/90 backdrop-blur-sm hover:bg-background focus:bg-background shadow-lg"
            />
          </div>
          <Button 
            onClick={() => handleSearch()} 
            size="icon"
            className="shrink-0 transition-all duration-300 hover:scale-110 hover:shadow-lg bg-primary hover:bg-primary/90"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Content with Glass Effect */}
        <div className="relative backdrop-blur-md bg-background/40 rounded-3xl p-6 md:p-8 shadow-lg border border-background/50">
          <div className="relative inline-block">
            {isDesktopView && (
              <div className="absolute -top-6 -right-6 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-foreground">
              AI-Powered Reviews <br />
              <span className="relative inline-block mt-2 text-primary">
                You Can Trust
                <div className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-primary to-primary/50" />
              </span>
            </h1>
          </div>
          <p className="text-foreground/90 text-lg md:text-xl mt-4">
            Discover unbiased, data-driven reviews generated by advanced AI. No human bias, just factual analysis.
          </p>
        </div>
        
        {/* Trust Indicators */}
        <div className="space-y-4">
          <div className="flex justify-center items-center gap-4 md:gap-6">
            <div className="h-10 md:h-12 w-10 md:w-12 rounded-xl bg-primary/20 flex items-center justify-center backdrop-blur-sm">
              <Shield className="h-5 md:h-6 w-5 md:w-6 text-primary" />
            </div>
            <div className="h-10 md:h-12 w-10 md:w-12 rounded-xl bg-primary/20 flex items-center justify-center backdrop-blur-sm">
              <Bot className="h-5 md:h-6 w-5 md:w-6 text-primary" />
            </div>
            <div className="h-10 md:h-12 w-10 md:w-12 rounded-xl bg-primary/20 flex items-center justify-center backdrop-blur-sm">
              <Star className="h-5 md:h-6 w-5 md:w-6 text-primary" />
            </div>
          </div>
          <p className="text-sm md:text-base text-muted-foreground">
            Trusted by <span className="font-medium text-foreground">People Across the Globe</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
