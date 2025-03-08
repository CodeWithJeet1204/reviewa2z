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

  -- Return the new comment with correct variable reference
  RETURN json_build_object(
    'id', v_comment.id,
    'content', v_comment.content,
    'display_name', v_comment.display_name,
    'created_at', v_comment.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 