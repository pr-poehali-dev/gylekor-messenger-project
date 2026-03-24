
CREATE TABLE IF NOT EXISTS t_p31859391_gylekor_messenger_pr.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  bio TEXT DEFAULT 'Пользователь мессенджера Гылекор 💜',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p31859391_gylekor_messenger_pr.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES t_p31859391_gylekor_messenger_pr.users(id),
  user2_id UUID NOT NULL REFERENCES t_p31859391_gylekor_messenger_pr.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

CREATE TABLE IF NOT EXISTS t_p31859391_gylekor_messenger_pr.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES t_p31859391_gylekor_messenger_pr.chats(id),
  sender_id UUID NOT NULL REFERENCES t_p31859391_gylekor_messenger_pr.users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_chat_created ON t_p31859391_gylekor_messenger_pr.messages(chat_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chats_user1 ON t_p31859391_gylekor_messenger_pr.chats(user1_id);
CREATE INDEX IF NOT EXISTS idx_chats_user2 ON t_p31859391_gylekor_messenger_pr.chats(user2_id);
