import { useState } from "react";
import { CHATS, type Chat } from "./data";
import Icon from "@/components/ui/icon";

interface ChatListProps {
  onOpenChat: (chat: Chat) => void;
  searchQuery: string;
}

export default function ChatList({ onOpenChat, searchQuery }: ChatListProps) {
  const filtered = CHATS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto px-2 py-2">
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <Icon name="MessageCircle" size={40} className="mb-2 opacity-30" />
          <p className="text-sm">Чаты не найдены</p>
        </div>
      )}
      {filtered.map((chat, i) => (
        <button
          key={chat.id}
          onClick={() => onOpenChat(chat)}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl mb-1 hover:bg-white/5 transition-all duration-200 animate-fade-in text-left"
          style={{ animationDelay: `${i * 0.05}s` }}>

          <div className="relative flex-shrink-0">
            <div className="avatar-ring">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-xl font-bold text-white">
                {chat.avatar}
              </div>
            </div>
            {chat.online && (
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2"
                style={{ borderColor: 'hsl(240, 15%, 6%)' }} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-semibold text-white text-sm truncate">{chat.name}</span>
              <span className="text-muted-foreground text-xs flex-shrink-0 ml-2">{chat.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs truncate">{chat.lastMessage}</span>
              {chat.unread > 0 && (
                <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
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
