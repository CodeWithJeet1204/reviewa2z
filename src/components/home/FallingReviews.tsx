import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, Star } from 'lucide-react';

interface FallingCard {
  id: number;
  x: number;
  y: number;
  speed: number;
  scale: number;
  rotation: number;
  isLeftSide: boolean;
  review: {
    title: string;
    rating: number;
    text: string;
    author: string;
  };
}

const sampleReviews = [
  {
    title: "Amazing Product",
    rating: 5,
    text: "This exceeded all my expectations...",
    author: "Alex M."
  },
  {
    title: "Great Value",
    rating: 4,
    text: "Really impressed with the quality...",
    author: "Sarah K."
  },
  {
    title: "Excellent Choice",
    rating: 5,
    text: "Couldn't be happier with this...",
    author: "Mike R."
  },
  {
    title: "Perfect Purchase",
    rating: 5,
    text: "Absolutely love this product...",
    author: "Emma L."
  },
  {
    title: "Highly Recommend",
    rating: 5,
    text: "Best purchase I've made this year...",
    author: "John D."
  }
];

const FallingReviews = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cards, setCards] = useState<FallingCard[]>([]);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const cardCountRef = useRef<number>(0);
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 768 : false;

  const createCard = () => {
    if (!containerRef.current) return null;
    const width = containerRef.current.clientWidth;
    const isLeftSide = Math.random() > 0.5;
    
    return {
      id: cardCountRef.current++,
      x: isLeftSide ? -300 : width + 300,
      y: Math.random() * (containerRef.current.clientHeight - 100),
      speed: 0.8 + Math.random() * 1.2, // Reduced speed range
      scale: 0.7 + Math.random() * 0.2, // More consistent scale
      rotation: 0,
      isLeftSide,
      review: sampleReviews[Math.floor(Math.random() * sampleReviews.length)]
    };
  };

  const animate = (time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = Math.min(time - lastTimeRef.current, 32); // Cap at ~30fps
    lastTimeRef.current = time;

    setCards(prevCards => {
      if (!containerRef.current) return prevCards;
      const width = containerRef.current.clientWidth;

      // Update existing cards
      const updatedCards = prevCards
        .map(card => ({
          ...card,
          x: card.x + (card.speed * deltaTime * 0.08 * (card.isLeftSide ? 1 : -1)),
        }))
        .filter(card => {
          if (card.isLeftSide) {
            return card.x < width + 300;
          } else {
            return card.x > -300;
          }
        });

      // Add new cards if needed, but limit total number based on screen size
      const maxCards = Math.min(8, Math.floor(width / 300));
      if (updatedCards.length < maxCards) {
        const newCard = createCard();
        if (newCard) updatedCards.push(newCard);
      }

      return updatedCards;
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!isDesktop) return;

    // Initial cards - reduced number for better performance
    const initialCards = Array.from({ length: 4 }, createCard).filter((card): card is FallingCard => card !== null);
    setCards(initialCards);

    // Start animation
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  if (!isDesktop) return null;

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ perspective: '1000px' }}
    >
      {cards.map(card => (
        <div
          key={card.id}
          className="absolute w-[250px]"
          style={{
            transform: `translate3d(${card.x}px, ${card.y}px, 0) scale(${card.scale})`,
            transition: 'transform 0.1s linear',
            opacity: 0.8,
            willChange: 'transform'
          }}
        >
          <Card className="bg-background/70 backdrop-blur-sm border-background/50">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <div className="rounded-full bg-primary/10 p-1.5 mt-1">
                  <Quote className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-0.5 mb-1">
                    {Array.from({ length: card.review.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-primary fill-primary" />
                    ))}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-0.5">{card.review.title}</h3>
                  <p className="text-xs text-foreground/80 line-clamp-2 mb-1">{card.review.text}</p>
                  <div className="text-xs">
                    <span className="font-medium text-primary/90">{card.review.author}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default FallingReviews; 