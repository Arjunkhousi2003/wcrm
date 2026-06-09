-- Inbox reliability: one conversation per (user, contact) and
-- idempotent webhook inserts on Meta message_id replays.

-- 1. Deduplicate conversations before adding the unique constraint.
--    Keep the row with the most recent activity (or the oldest if tied).
DELETE FROM conversations c
WHERE c.id IN (
  SELECT id
  FROM (
    SELECT
      id,
      ROW_NUMBER() OVER (
        PARTITION BY user_id, contact_id
        ORDER BY
          last_message_at DESC NULLS LAST,
          created_at ASC
      ) AS rn
    FROM conversations
  ) ranked
  WHERE rn > 1
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_user_contact_unique
  ON conversations (user_id, contact_id);

-- 2. Meta wamids are globally unique — reject webhook replays at the DB.
CREATE UNIQUE INDEX IF NOT EXISTS idx_messages_meta_message_id_unique
  ON messages (message_id)
  WHERE message_id IS NOT NULL;
