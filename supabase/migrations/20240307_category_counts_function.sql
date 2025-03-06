
-- Create a function to get review counts by category
CREATE OR REPLACE FUNCTION get_category_counts()
RETURNS TABLE (category_id int, count bigint) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT category_id, COUNT(*) as count
  FROM reviews
  WHERE category_id IS NOT NULL
  GROUP BY category_id;
$$;
