
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  date: string;
  likes: number;
  userLiked: boolean;
  replies?: Comment[];
}

interface DatabaseComment {
  id: string;
  review_id: string;
  user_id: string;
  content: string;
  created_at: string;
  likes_count: number;
  parent_id: string | null;
  profiles?: {
    display_name: string;
    avatar_url: string;
    username: string;
  };
}

interface CommentSectionProps {
  reviewId: string;
  commentsCount?: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ reviewId, commentsCount = 0 }) => {
  const { user, isAuthenticated, login } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Fetch comments for this review
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
      
      // Fetch user likes for these comments if user is authenticated
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
      
      // Transform database comments to our Comment interface
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
        // We'll fetch replies separately if needed
        replies: [],
      }));
    },
    refetchOnWindowFocus: false,
  });

  // Create a new comment
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
      
      // Update the review comments count
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

  // Like a comment
  const likeComment = useMutation({
    mutationFn: async ({ commentId, liked }: { commentId: string, liked: boolean }) => {
      if (!isAuthenticated || !user) {
        throw new Error("You must be logged in to like comments");
      }
      
      if (liked) {
        // Unlike: delete the like
        const { error: deleteError } = await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);
          
        if (deleteError) throw deleteError;
        
        // Decrement likes count
        const { error: updateError } = await supabase
          .from('comments')
          .update({ likes_count: supabase.rpc('decrement', { x: 1 }) })
          .eq('id', commentId);
          
        if (updateError) throw updateError;
      } else {
        // Like: insert a new like
        const { error: insertError } = await supabase
          .from('comment_likes')
          .insert({
            comment_id: commentId,
            user_id: user.id
          });
          
        if (insertError) throw insertError;
        
        // Increment likes count
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

  // Wrapper function to handle login button click
  const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Comments ({comments.length || commentsCount})</h3>
      </div>
      
      <Card className="p-5 glass">
        <form onSubmit={handleCommentSubmit} className="space-y-4">
          {isAuthenticated ? (
            <div className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.name}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center mb-2">
              <p className="text-muted-foreground text-sm">Sign in to join the conversation</p>
              <Button type="button" variant="outline" size="sm" onClick={handleLoginClick}>
                Sign In
              </Button>
            </div>
          )}
          
          <Textarea
            placeholder={isAuthenticated ? "Add a comment..." : "Sign in to comment"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!isAuthenticated || isSubmitting}
            className="resize-none"
            rows={3}
          />
          
          <div className="flex justify-end">
            <Button 
              type="submit"
              disabled={!isAuthenticated || !newComment.trim() || isSubmitting}
              className="transition-all duration-300 hover:scale-[1.02]"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      </Card>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4 staggered-fade">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-5 transition-all duration-300 hover:shadow-md">
              <div className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">{comment.author.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(comment.date)}</p>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                  <div className="flex items-center space-x-4 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto py-1 px-2 text-xs"
                      onClick={() => handleLikeComment(comment.id, comment.userLiked)}
                      disabled={likeComment.isPending}
                    >
                      <ThumbsUp className={`h-3.5 w-3.5 mr-1 ${comment.userLiked ? 'fill-primary text-primary' : ''}`} />
                      <span>{comment.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto py-1 px-2 text-xs"
                      onClick={() => toast.info("Reply feature coming soon!")}
                    >
                      <MessageSquare className="h-3.5 w-3.5 mr-1" />
                      <span>Reply</span>
                    </Button>
                  </div>
                </div>
              </div>
              
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-11 mt-3 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex space-x-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                        <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-medium">{reply.author.name}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(reply.date)}</p>
                        </div>
                        <p className="text-xs">{reply.content}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto py-1 px-2 text-xs"
                          onClick={() => handleLikeComment(reply.id, reply.userLiked)}
                        >
                          <ThumbsUp className={`h-3 w-3 mr-1 ${reply.userLiked ? 'fill-primary text-primary' : ''}`} />
                          <span>{reply.likes}</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium mb-1">No comments yet</h3>
          <p className="text-muted-foreground">Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
