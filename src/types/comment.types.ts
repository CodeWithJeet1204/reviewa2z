
export interface Comment {
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

export interface DatabaseComment {
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

export interface CommentSectionProps {
  reviewId: string;
  commentsCount?: number;
}
