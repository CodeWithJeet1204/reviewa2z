
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Comment, DatabaseComment } from '@/types/comment.types';

export const useComments = (reviewId: string, commentsCount: number = 0) => {
  const { user, isAuthenticated } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', reviewId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id(display_name, avatar_url, username)
        `)
        .eq('review_id', reviewId)
        .order('created_at', { ascending: false })
        .is('parent_id', null);

      if (error) {
        console.error("Error fetching comments:", error);
        toast.error("Failed to load comments");
        throw error;
      }
      
      let userLikes: Record<string, boolean> = {};
      
      if (isAuthenticated && user) {
        const { data: likesData } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', user.id);
          
        if (likesData) {
          userLikes = likesData.reduce((acc: Record<string, boolean>, like) => {
            acc[like.comment_id] = true;
            return acc;
          }, {});
        }
      }
      
      return (data || []).map((comment: DatabaseComment) => ({
        id: comment.id,
        author: {
          name: comment.profiles?.display_name || 'Anonymous',
          avatar: comment.profiles?.avatar_url,
        },
        content: comment.content,
        date: comment.created_at,
        likes: comment.likes_count || 0,
        userLiked: !!userLikes[comment.id],
        replies: [],
      }));
    },
    refetchOnWindowFocus: false,
  });

  const createComment = useMutation({
    mutationFn: async (content: string) => {
      if (!isAuthenticated || !user) {
        throw new Error("You must be logged in to comment");
      }
      
      const { data, error } = await supabase
        .from('comments')
        .insert({
          review_id: reviewId,
          user_id: user.id,
          content: content
        })
        .select();
        
      if (error) throw error;
      
      await supabase
        .from('reviews')
        .update({ comments_count: commentsCount + 1 })
        .eq('id', reviewId);
        
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', reviewId] });
      queryClient.invalidateQueries({ queryKey: ['review', reviewId] });
      setNewComment('');
      toast.success("Comment posted successfully!");
    },
    onError: (error) => {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment. Please try again.");
    }
  });

  const likeComment = useMutation({
    mutationFn: async ({ commentId, liked }: { commentId: string, liked: boolean }) => {
      if (!isAuthenticated || !user) {
        throw new Error("You must be logged in to like comments");
      }
      
      if (liked) {
        const { error: deleteError } = await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);
          
        if (deleteError) throw deleteError;
        
        const { error: updateError } = await supabase
          .from('comments')
          .update({ likes_count: supabase.rpc('decrement', { x: 1 }) })
          .eq('id', commentId);
          
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('comment_likes')
          .insert({
            comment_id: commentId,
            user_id: user.id
          });
          
        if (insertError) throw insertError;
        
        const { error: updateError } = await supabase
          .from('comments')
          .update({ likes_count: supabase.rpc('increment', { x: 1 }) })
          .eq('id', commentId);
          
        if (updateError) throw updateError;
      }
      
      return { commentId, liked };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', reviewId] });
      toast.success(variables.liked ? "Comment unliked" : "Comment liked");
    },
    onError: (error) => {
      console.error("Error liking comment:", error);
      toast.error("Failed to like comment. Please try again.");
    }
  });

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    if (!isAuthenticated) {
      toast.error("Please sign in to comment");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createComment.mutateAsync(newComment);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = (commentId: string, userLiked: boolean) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to like comments");
      return;
    }
    
    likeComment.mutate({ commentId, liked: userLiked });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return {
    comments,
    isLoading,
    newComment,
    setNewComment,
    isSubmitting,
    handleCommentSubmit,
    handleLikeComment,
    formatDate,
    likeComment,
  };
};
