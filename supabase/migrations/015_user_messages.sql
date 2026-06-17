-- ============================================================
-- USER MESSAGES (Send us a Message)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_messages ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE user_messages ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE user_messages ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE user_messages ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE user_messages ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE user_messages ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE user_messages ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE user_messages ALTER COLUMN user_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_user_messages_user_id ON user_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_user_messages_created_at ON user_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_messages_email ON user_messages(email);

ALTER TABLE user_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own messages" ON user_messages;
DROP POLICY IF EXISTS "Anyone can create user messages" ON user_messages;
DROP POLICY IF EXISTS "Authenticated users can view user messages" ON user_messages;

CREATE POLICY "Anyone can create user messages"
  ON user_messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view user messages"
  ON user_messages
  FOR SELECT
  TO authenticated
  USING (true);
