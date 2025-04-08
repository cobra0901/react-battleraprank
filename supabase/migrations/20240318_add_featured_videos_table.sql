-- Create featured_videos table
CREATE TABLE IF NOT EXISTS featured_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  video_id TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on order for faster sorting
CREATE INDEX IF NOT EXISTS featured_videos_order_idx ON featured_videos ("order");

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_featured_videos_updated_at
BEFORE UPDATE ON featured_videos
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

