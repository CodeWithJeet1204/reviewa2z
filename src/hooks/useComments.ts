import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Comment {
  id: string;
  content: string;
  display_name: string | null;
  created_at: string;
}

interface AddCommentParams {
  content: string;
  display_name?: string;
}

export function useComments(reviewId: string) {
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading, error } = useQuery({
    queryKey: ['comments', reviewId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('review_id', reviewId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Comment[];
    }
  });

  const addComment = useMutation({
    mutationFn: async ({ content, display_name }: AddCommentParams) => {
      const { data, error } = await supabase.rpc('handle_comment', {
        p_review_id: reviewId,
        p_content: content,
        p_display_name: display_name
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', reviewId] });
      toast.success('Comment added successfully');
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment', { description: error.message });
    }
  });

  return {
    comments,
    isLoading,
    error,
    addComment: addComment.mutate,
    isAddingComment: addComment.isPending
  };
}
