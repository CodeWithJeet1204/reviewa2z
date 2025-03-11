import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

interface Comment {
  id: string;
  review_id: string;
  user_id?: string;
  content: string;
  parent_id?: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  name?: string;
}

interface CommentSectionProps {
  reviewId: string;
}

const CommentSection = ({ reviewId }: CommentSectionProps) => {
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', reviewId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('review_id', reviewId)
        .is('parent_id', null) // Only get top-level comments for now
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Comment[];
    }
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ content, name }: { content: string; name: string }) => {
      const commentId = uuidv4();
      const now = new Date().toISOString();

      // Store the name in localStorage for this comment ID
      if (name) {
        localStorage.setItem(`comment_name_${commentId}`, name);
      }

      const { data, error } = await supabase
        .from('comments')
        .insert([{
          id: commentId,
          review_id: reviewId,
          user_id: null,
          content: content,
          parent_id: null,
          likes_count: 0,
          created_at: now,
          updated_at: now
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding comment:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', reviewId] });
      setComment('');
      setName('');
    }
  });

  // Get stored names for comments
  const getCommentName = (commentId: string) => {
    return localStorage.getItem(`comment_name_${commentId}`) || 'Anonymous';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addCommentMutation.mutate({ content: comment, name });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-muted rounded-xl mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <Input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-md"
        />
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-[100px]"
          required
        />
        <Button 
          type="submit" 
          disabled={!comment.trim() || addCommentMutation.isPending}
        >
          {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
        </Button>
        {addCommentMutation.isError && (
          <p className="text-red-500 mt-2">
            Failed to add comment: {addCommentMutation.error?.message || 'Please try again.'}
          </p>
        )}
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div 
            key={comment.id} 
            className="glass p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="font-medium">{getCommentName(comment.id)}</div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(comment.created_at), 'MMM d, yyyy')}
              </div>
            </div>
            <p className="text-foreground/90 whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
