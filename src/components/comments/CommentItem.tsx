
import React from 'react';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Comment } from '@/types/comment.types';
import { toast } from 'sonner';

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string, userLiked: boolean) => void;
  isLikeLoading?: boolean;
  formatDate: (dateString: string) => string;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  onLike, 
  isLikeLoading = false,
  formatDate 
}) => {
  return (
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
              onClick={() => onLike(comment.id, comment.userLiked)}
              disabled={isLikeLoading}
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
                  onClick={() => onLike(reply.id, reply.userLiked)}
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
  );
};

export default CommentItem;
