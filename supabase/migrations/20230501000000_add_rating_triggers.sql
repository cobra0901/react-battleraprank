-- Create a function to recalculate battler attribute averages
CREATE OR REPLACE FUNCTION recalculate_battler_attribute_average()
RETURNS TRIGGER AS $$
BEGIN
  -- This is a simplified version - in a real app, you'd implement the full weighted average logic
  INSERT INTO battler_attributes (battler_id, category, attribute, overall_average, updated_at)
  SELECT 
    NEW.battler_id,
    NEW.category,
    NEW.attribute,
    (SELECT AVG(value) FROM ratings WHERE battler_id = NEW.battler_id AND category = NEW.category AND attribute = NEW.attribute),
    NOW()
  ON CONFLICT (battler_id, category, attribute) 
  DO UPDATE SET
    overall_average = (SELECT AVG(value) FROM ratings WHERE battler_id = NEW.battler_id AND category = NEW.category AND attribute = NEW.attribute),
    updated_at = NOW();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to run the function after ratings are inserted or updated
CREATE TRIGGER update_battler_attribute_average
AFTER INSERT OR UPDATE ON ratings
FOR EACH ROW
EXECUTE FUNCTION recalculate_battler_attribute_average();

-- Create a function to recalculate all battler averages (for bulk operations)
CREATE OR REPLACE FUNCTION recalculate_all_battler_averages()
RETURNS void AS $$
BEGIN
  -- For each unique battler_id, category, attribute combination
  INSERT INTO battler_attributes (battler_id, category, attribute, overall_average, updated_at)
  SELECT 
    battler_id,
    category,
    attribute,
    AVG(value),
    NOW()
  FROM ratings
  GROUP BY battler_id, category, attribute
  ON CONFLICT (battler_id, category, attribute) 
  DO UPDATE SET
    overall_average = EXCLUDED.overall_average,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

