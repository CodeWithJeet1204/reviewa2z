-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    name TEXT DEFAULT 'Anonymous',
    review_id BIGINT REFERENCES reviews(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS comments_review_id_idx ON comments(review_id);

-- Create function to handle comments
CREATE OR REPLACE FUNCTION public.handle_comment(
    p_content TEXT,
    p_name TEXT,
    p_review_id BIGINT
)
RETURNS TABLE (
    id BIGINT,
    content TEXT,
    name TEXT,
    review_id BIGINT,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO comments (content, name, review_id)
    VALUES (
        p_content,
        CASE 
            WHEN p_name IS NULL OR p_name = '' THEN 'Anonymous'
            ELSE p_name
        END,
        p_review_id
    )
    RETURNING *;
END;
$$;

-- Create function to get comments
CREATE OR REPLACE FUNCTION public.get_comments(p_review_id BIGINT)
RETURNS TABLE (
    id BIGINT,
    content TEXT,
    name TEXT,
    review_id BIGINT,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT c.id, c.content, c.name, c.review_id, c.created_at
    FROM comments c
    WHERE c.review_id = p_review_id
    ORDER BY c.created_at DESC;
END;
$$;

-- Enable RLS but allow all operations
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Everyone can do everything with comments
CREATE POLICY "Anyone can do anything with comments"
    ON comments
    FOR ALL
    USING (true)
    WITH CHECK (true); 