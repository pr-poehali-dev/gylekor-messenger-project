import { useState, useEffect } from "react";
import { getChats, type ApiChat } from "./api";
import Icon from "@/components/ui/icon";

interface OpenChatInfo {
  chatId?: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  partnerOnline: boolean;
}

interface ChatListProps {
  userId: string;
  onOpenChat: (info: OpenChatInfo) => void;
  searchQuery: string;
}

export default function ChatList({ userId, onOpenChat, searchQuery }: ChatListProps) {
  const [chats, setChats] = useState<ApiChat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChats(userId)
      .then(setChats)
      .finally(() => setLoading(false));
  }, [userId]);

  const filtered = chats.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.last_message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 rounded-full border-2 border-purple-500/40 border-t-purple-500 animate-spin" />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-8 text-center">
        <div className="text-5xl mb-4">💬</div>
        <h3 className="text-white font-semibold text-lg mb-2">Пока нет чатов</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Найдите людей через раздел <span className="text-purple-400">Контакты</span> и начните переписку
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-2 py-2">
      {filtered.length === 0 && searchQuery && (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <Icon name="Search" size={36} className="mb-2 opacity-30" />
          <p className="text-sm">Ничего не найдено</p>
        </div>
      )}

      {filtered.map((chat, i) => (
        <button
          key={chat.id}
          onClick={() => onOpenChat({
            chatId: chat.id,
            partnerId: chat.partner_id,
            partnerName: chat.name,
            partnerAvatar: chat.name[0].toUpperCase(),
            partnerOnline: false,
          })}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl mb-1 hover:bg-white/5 transition-all duration-200 animate-fade-in text-left"
          style={{ animationDelay: `${i * 0.05}s` }}>

          <div className="relative flex-shrink-0">
            <div className="avatar-ring">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-xl font-bold text-white">
                {chat.name[0].toUpperCase()}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-semibold text-white text-sm truncate">{chat.name}</span>
              <span className="text-muted-foreground text-xs flex-shrink-0 ml-2">{chat.last_time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs truncate">
                {chat.last_message || "Нет сообщений"}
              </span>
              {chat.unread > 0 && (
                <span className="ml-2 flex-shrink-0 min-w-5 h-5 px-1 rounded-full text-white text-xs flex items-center justify-center font-bold"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                  {chat.unread > 9 ? "9+" : chat.unread}
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
