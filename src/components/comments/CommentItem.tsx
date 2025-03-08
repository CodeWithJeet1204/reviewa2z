import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Comment } from '@/types/comment.types';

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string, liked: boolean) => void;
  isLikeLoading: boolean;
  formatDate: (dateString: string) => string;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  onLike, 
  isLikeLoading, 
  formatDate 
}) => {
  const handleLike = () => {
    onLike(comment.id, comment.userLiked);
  };

  return (
    <Card className="p-5 glass hover:shadow-md transition-shadow">
      <div className="flex space-x-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">{comment.author.name}</h4>
              <p className="text-xs text-muted-foreground">{formatDate(comment.date)}</p>
            </div>
          </div>
          
          <div className="text-sm">
            {comment.content}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-xs px-3 py-2 -ml-3 hover:bg-accent"
              onClick={handleLike}
              disabled={isLikeLoading}
            >
              <ThumbsUp className={`h-3.5 w-3.5 ${comment.userLiked ? 'fill-primary text-primary' : ''}`} />
              <span>{comment.likes} {comment.likes === 1 ? 'Like' : 'Likes'}</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CommentItem;
