
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { User } from '@/hooks/useAuth';

interface CommentFormProps {
  user: User | null;
  isAuthenticated: boolean;
  newComment: string;
  setNewComment: (comment: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onLogin: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  user,
  isAuthenticated,
  newComment,
  setNewComment,
  isSubmitting,
  onSubmit,
  onLogin
}) => {
  return (
    <Card className="p-5 glass">
      <form onSubmit={onSubmit} className="space-y-4">
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
            <Button type="button" variant="outline" size="sm" onClick={onLogin}>
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
  );
};

export default CommentForm;
