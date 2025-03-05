
-- Create functions to increment and decrement counts
CREATE OR REPLACE FUNCTION increment(x integer)
RETURNS integer
LANGUAGE SQL
AS $$
  SELECT x + 1
$$;

CREATE OR REPLACE FUNCTION decrement(x integer)
RETURNS integer
LANGUAGE SQL
AS $$
  SELECT GREATEST(0, x - 1)
$$;
