-- Update schema for anonymous comments

-- Drop RLS policies
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."comments";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."comments";
DROP POLICY IF EXISTS "Enable delete for comment owners" ON "public"."comments";

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous comments
CREATE POLICY "Enable read access for all users"
ON "public"."comments"
FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert for all users"
ON "public"."comments"
FOR INSERT
TO public
WITH CHECK (true);

-- Update comments table
ALTER TABLE comments
ADD COLUMN IF NOT EXISTS display_name text,
ADD COLUMN IF NOT EXISTS anonymous_id uuid DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS content text NOT NULL,
ADD COLUMN IF NOT EXISTS review_id uuid NOT NULL REFERENCES reviews(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS comments_review_id_idx ON comments(review_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at DESC);

-- Update function to handle anonymous comments
CREATE OR REPLACE FUNCTION handle_comment(
  p_review_id uuid,
  p_content text,
  p_display_name text DEFAULT NULL
) RETURNS json AS $$
DECLARE
  v_comment comments;
BEGIN
  -- Insert the new comment
  INSERT INTO comments (
    review_id,
    content,
    display_name,
    anonymous_id
  ) VALUES (
    p_review_id,
    p_content,
    p_display_name,
    gen_random_uuid()
  )
  RETURNING * INTO v_comment;

  -- Update the comments count in the reviews table
  UPDATE reviews 
  SET comments_count = comments_count + 1
  WHERE id = p_review_id;

  -- Return the new comment
  RETURN json_build_object(
    'id', v_comment.id,
    'content', v_comment.content,
    'display_name', v_comment.display_name,
    'created_at', v_comment.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 