
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from "@/components/ui/sonner";

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

interface CommentSectionProps {
  reviewId: string;
  initialComments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ reviewId, initialComments }) => {
  const { user, isAuthenticated, login } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    if (!isAuthenticated) {
      toast.error("Please sign in to comment");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCommentObj: Comment = {
        id: `comment_${Date.now()}`,
        author: {
          name: user?.name || 'Anonymous',
          avatar: user?.avatar,
        },
        content: newComment,
        date: new Date().toISOString(),
        likes: 0,
        userLiked: false,
      };
      
      setComments([newCommentObj, ...comments]);
      setNewComment('');
      toast.success("Comment posted successfully!");
    } catch (error) {
      toast.error("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = (commentId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to like comments");
      return;
    }
    
    setComments(prev => 
      prev.map(comment => {
        if (comment.id === commentId) {
          const newLikes = comment.userLiked ? comment.likes - 1 : comment.likes + 1;
          return {
            ...comment,
            likes: newLikes,
            userLiked: !comment.userLiked
          };
        }
        return comment;
      })
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>
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
              <Button type="button" variant="outline" size="sm" onClick={login}>
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
      
      {comments.length > 0 ? (
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
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      <ThumbsUp className={`h-3.5 w-3.5 mr-1 ${comment.userLiked ? 'fill-primary text-primary' : ''}`} />
                      <span>{comment.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto py-1 px-2 text-xs"
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
                          onClick={() => handleLikeComment(reply.id)}
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
