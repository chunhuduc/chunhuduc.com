-- Live chat (human): conversations + messages

CREATE TABLE IF NOT EXISTS live_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_token TEXT NOT NULL,
  visitor_name TEXT,
  visitor_email TEXT,
  page_url TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  owner_last_read_at TIMESTAMPTZ,
  last_notify_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS live_conversations_status_last_msg_idx
  ON live_conversations (status, last_message_at DESC);

CREATE TABLE IF NOT EXISTS live_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES live_conversations (id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('visitor', 'owner')),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS live_messages_conversation_created_idx
  ON live_messages (conversation_id, created_at);
