
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useComments } from '@/hooks/useComments';
import CommentForm from '@/components/comments/CommentForm';
import CommentItem from '@/components/comments/CommentItem';
import EmptyComments from '@/components/comments/EmptyComments';
import { CommentSectionProps } from '@/types/comment.types';

const CommentSection: React.FC<CommentSectionProps> = ({ reviewId, commentsCount = 0 }) => {
  const { user, isAuthenticated, login } = useAuth();
  
  const {
    comments,
    isLoading,
    newComment,
    setNewComment,
    isSubmitting,
    handleCommentSubmit,
    handleLikeComment,
    formatDate,
    likeComment,
    error
  } = useComments(reviewId, commentsCount);

  const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Comments ({comments?.length || commentsCount || 0})</h3>
      </div>
      
      <CommentForm
        user={user}
        isAuthenticated={isAuthenticated}
        newComment={newComment}
        setNewComment={setNewComment}
        isSubmitting={isSubmitting}
        onSubmit={handleCommentSubmit}
        onLogin={handleLoginClick}
      />
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-4 staggered-fade">
          {comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              onLike={handleLikeComment} 
              isLikeLoading={likeComment.isPending}
              formatDate={formatDate}
            />
          ))}
        </div>
      ) : (
        <EmptyComments />
      )}
    </div>
  );
};

export default CommentSection;
