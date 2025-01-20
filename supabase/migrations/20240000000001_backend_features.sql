-- Create analytics table
CREATE TABLE analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES posts(id),
    engagement INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies for analytics
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics" ON analytics
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM posts WHERE id = analytics.post_id
        )
    );

CREATE POLICY "Users can insert own analytics" ON analytics
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM posts WHERE id = analytics.post_id
        )
    );

-- Add scheduled_for column to posts if not exists
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMP WITH TIME ZONE;

-- Create index for scheduled posts
CREATE INDEX IF NOT EXISTS idx_posts_scheduled 
ON posts(scheduled_for) 
WHERE status = 'scheduled';