-- Add reply columns to member_messages
ALTER TABLE member_messages ADD COLUMN IF NOT EXISTS reply_to_id INTEGER REFERENCES member_messages(id);
ALTER TABLE member_messages ADD COLUMN IF NOT EXISTS sender_id UUID REFERENCES users(id);

CREATE INDEX IF NOT EXISTS idx_member_messages_reply_to ON member_messages(reply_to_id);
CREATE INDEX IF NOT EXISTS idx_member_messages_sender ON member_messages(sender_id);
