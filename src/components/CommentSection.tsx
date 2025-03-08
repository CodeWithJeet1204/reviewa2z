import React, { useState } from 'react';
import { useComments } from '@/hooks/useComments';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
  reviewId: string;
  commentsCount: number;
}

const CommentSection = ({ reviewId, commentsCount }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const [displayName, setDisplayName] = useState('');
  const { comments, isLoading, addComment, isAddingComment } = useComments(reviewId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment({
        content: newComment.trim(),
        display_name: displayName.trim() || undefined
      });
      setNewComment('');
      setDisplayName('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-8 text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <MessageSquare className="h-6 w-6" />
        Comments ({commentsCount})
      </h2>

      {/* Comment Form */}
      <Card className="p-4 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={50}
            />
          </div>
          <div>
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isAddingComment}>
              {isAddingComment ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {comment.display_name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <p className="mt-2 whitespace-pre-wrap">{comment.content}</p>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
