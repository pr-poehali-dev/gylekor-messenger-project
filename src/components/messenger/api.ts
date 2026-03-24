const AUTH_URL = "https://functions.poehali.dev/f1aa14c5-5242-46cb-b2c1-88c9717904cc";
const MSG_URL = "https://functions.poehali.dev/d7c6f07b-41c9-424b-b1f2-57f1f8f73e1a";

export interface ApiUser {
  id: string;
  phone: string;
  username: string;
  name: string;
  bio: string;
}

export interface ApiMessage {
  id: string;
  sender_id: string;
  text: string;
  time: string;
  chat_id?: string;
}

export interface ApiChat {
  id: string;
  partner_id: string;
  name: string;
  username: string;
  last_message: string;
  last_time: string;
  unread: number;
}

// --- Auth ---

export async function sendOtpCode(phone: string): Promise<{ dev_code?: string }> {
  const res = await fetch(`${AUTH_URL}/send-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка отправки кода");
  return data;
}

export async function verifyOtpCode(phone: string, code: string): Promise<{ need_profile: boolean; user?: ApiUser }> {
  const res = await fetch(`${AUTH_URL}/verify-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Неверный код");
  return data;
}

export async function registerUser(phone: string, username: string, name: string): Promise<ApiUser> {
  const res = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, username, name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка регистрации");
  return data.user;
}

export async function getMe(userId: string): Promise<ApiUser | null> {
  try {
    const res = await fetch(`${AUTH_URL}/me?user_id=${userId}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}

// --- Chats ---

export async function getChats(userId: string): Promise<ApiChat[]> {
  const res = await fetch(`${MSG_URL}/chats?user_id=${userId}`);
  const data = await res.json();
  return data.chats || [];
}

export async function createChat(user1Id: string, user2Id: string): Promise<string> {
  const res = await fetch(`${MSG_URL}/chats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user1_id: user1Id, user2_id: user2Id }),
  });
  const data = await res.json();
  return data.chat_id;
}

// --- Messages ---

export async function getMessages(chatId: string): Promise<ApiMessage[]> {
  const res = await fetch(`${MSG_URL}/?chat_id=${chatId}`);
  const data = await res.json();
  return data.messages || [];
}

export async function sendMessage(chatId: string, senderId: string, text: string): Promise<ApiMessage> {
  const res = await fetch(MSG_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, sender_id: senderId, text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка отправки");
  return data.message;
}
