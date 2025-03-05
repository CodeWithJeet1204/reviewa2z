
import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface LikeButtonProps {
  reviewId: string;
  initialLikesCount: number;
  initialLikedByUser?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ 
  reviewId, 
  initialLikesCount = 0,
  initialLikedByUser = false
}) => {
  const [isLiked, setIsLiked] = useState(initialLikedByUser);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleLikeToggle = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like reviews",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (isLiked) {
        // Remove like
        const { error: deleteLikeError } = await supabase
          .from('review_likes')
          .delete()
          .eq('review_id', reviewId)
          .eq('user_id', user.id);

        if (deleteLikeError) throw deleteLikeError;

        // Update review likes count
        const { error: updateReviewError } = await supabase
          .rpc('decrement', { x: likesCount })
          .then(({ data }) => {
            return supabase
              .from('reviews')
              .update({ likes_count: data })
              .eq('id', reviewId);
          });

        if (updateReviewError) throw updateReviewError;
        
        setLikesCount(prev => Math.max(0, prev - 1));
        setIsLiked(false);
      } else {
        // Add like
        const { error: insertLikeError } = await supabase
          .from('review_likes')
          .insert({
            review_id: reviewId,
            user_id: user.id,
          });

        if (insertLikeError) throw insertLikeError;

        // Update review likes count
        const { error: updateReviewError } = await supabase
          .rpc('increment', { x: likesCount })
          .then(({ data }) => {
            return supabase
              .from('reviews')
              .update({ likes_count: data })
              .eq('id', reviewId);
          });

        if (updateReviewError) throw updateReviewError;
        
        setLikesCount(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLikeToggle}
      disabled={isLoading}
      className={`flex items-center gap-1 transition-colors ${
        isLiked ? 'text-primary hover:text-primary/80' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      <span>{likesCount}</span>
    </Button>
  );
};

export default LikeButton;
