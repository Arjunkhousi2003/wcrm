-- ============================================================
-- MARKETING MEDIA (broadcast / template header images)
-- ============================================================
CREATE TABLE IF NOT EXISTS marketing_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketing_media_user_id ON marketing_media(user_id);
CREATE INDEX IF NOT EXISTS idx_marketing_media_created_at ON marketing_media(created_at DESC);

ALTER TABLE marketing_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own marketing media" ON marketing_media;
CREATE POLICY "Users can manage own marketing media"
  ON marketing_media
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Persist the header image URL on each broadcast for audit / resume.
ALTER TABLE broadcasts ADD COLUMN IF NOT EXISTS header_media_url TEXT;
ALTER TABLE broadcasts ADD COLUMN IF NOT EXISTS header_media_type TEXT;
