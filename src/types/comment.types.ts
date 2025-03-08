export interface Comment {
  id: string;
  content: string;
  created_at: string;
}

export interface CommentSectionProps {
  reviewId: string;
  commentsCount?: number;
}
