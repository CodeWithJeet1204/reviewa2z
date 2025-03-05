
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export function useUserLikes() {
  const [userLikes, setUserLikes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchUserLikes() {
      if (!user) {
        setUserLikes([]);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('review_likes')
          .select('review_id')
          .eq('user_id', user.id);

        if (error) throw error;
        
        const likedReviewIds = data.map(like => like.review_id);
        setUserLikes(likedReviewIds);
      } catch (error) {
        console.error('Error fetching user likes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserLikes();
  }, [user]);

  return { userLikes, isLoading };
}
