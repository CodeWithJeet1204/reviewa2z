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

  const createCard = () => {
    if (!containerRef.current) return null;
    const width = containerRef.current.clientWidth;
    const isLeftSide = Math.random() > 0.5;
    
    return {
      id: cardCountRef.current++,
      x: isLeftSide ? -300 : width + 300, // Start from outside the viewport
      y: Math.random() * (containerRef.current.clientHeight - 100), // Random vertical position
      speed: 1 + Math.random() * 2, // Horizontal speed
      scale: 0.6 + Math.random() * 0.3,
      rotation: 0,
      isLeftSide,
      review: sampleReviews[Math.floor(Math.random() * sampleReviews.length)]
    };
  };

  const animate = (time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    setCards(prevCards => {
      if (!containerRef.current) return prevCards;
      const width = containerRef.current.clientWidth;

      // Update existing cards
      const updatedCards = prevCards
        .map(card => ({
          ...card,
          x: card.x + (card.speed * deltaTime * 0.1 * (card.isLeftSide ? 1 : -1)), // Move horizontally
        }))
        .filter(card => {
          // Remove cards that have moved too far
          if (card.isLeftSide) {
            return card.x < width + 300;
          } else {
            return card.x > -300;
          }
        });

      // Add new cards if needed
      if (updatedCards.length < 10) {
        const newCard = createCard();
        if (newCard) updatedCards.push(newCard);
      }

      return updatedCards;
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Initial cards
    const initialCards = Array.from({ length: 8 }, createCard).filter((card): card is FallingCard => card !== null);
    setCards(initialCards);

    // Start animation
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

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
            transform: `translate3d(${card.x}px, ${card.y}px, 0) 
                       scale(${card.scale})`,
            transition: 'transform 0.1s linear',
            opacity: 0.9,
            willChange: 'transform'
          }}
        >
          <Card className="bg-background/80 backdrop-blur-sm border-background/50">
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