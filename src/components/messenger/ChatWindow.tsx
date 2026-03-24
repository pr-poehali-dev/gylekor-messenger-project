import { useState, useRef, useEffect } from "react";
import { type ApiMessage, getMessages, sendMessage, createChat } from "./api";
import Icon from "@/components/ui/icon";

interface ChatWindowProps {
  chatId?: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  partnerOnline: boolean;
  currentUser: { id: string; name: string; username: string };
  onBack: () => void;
}

const STICKERS = ["😂", "❤️", "🔥", "👍", "😍", "🤔", "😎", "🎉", "💯", "🚀"];

export default function ChatWindow({
  chatId: initialChatId,
  partnerId,
  partnerName,
  partnerAvatar,
  partnerOnline,
  currentUser,
  onBack,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [chatId, setChatId] = useState<string | undefined>(initialChatId);
  const [input, setInput] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      let cid = chatId;
      if (!cid) {
        cid = await createChat(currentUser.id, partnerId);
        setChatId(cid);
      }
      const msgs = await getMessages(cid);
      setMessages(msgs);
      setLoading(false);
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim() || !chatId) return;
    setInput("");
    const optimistic: ApiMessage = {
      id: Date.now().toString(),
      sender_id: currentUser.id,
      text,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, optimistic]);
    try {
      const msg = await sendMessage(chatId, currentUser.id, text);
      setMessages(prev => prev.map(m => m.id === optimistic.id ? msg : m));
    } catch {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
    }
  };

  const handleSticker = (s: string) => {
    handleSend(s);
    setShowStickers(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="glass border-b border-white/8 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-purple-400 hover:text-purple-300 transition-colors mr-1">
          <Icon name="ArrowLeft" size={22} />
        </button>
        <div className="relative">
          <div className="avatar-ring">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-lg font-bold text-white">
              {partnerAvatar}
            </div>
          </div>
          {partnerOnline && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2"
              style={{ borderColor: 'hsl(240, 12%, 10%)' }} />
          )}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white text-sm">{partnerName}</div>
          <div className="text-xs" style={{ color: partnerOnline ? '#4ade80' : '#6b7280' }}>
            {partnerOnline ? "онлайн" : "был(а) недавно"}
          </div>
        </div>
        <div className="flex gap-3">
          <button className="text-muted-foreground hover:text-purple-400 transition-colors">
            <Icon name="Phone" size={20} />
          </button>
          <button className="text-muted-foreground hover:text-purple-400 transition-colors">
            <Icon name="Video" size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 rounded-full border-2 border-purple-500/40 border-t-purple-500 animate-spin" />
          </div>
        )}
        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-sm">Начните переписку!</p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isOut = msg.sender_id === currentUser.id;
          return (
            <div key={msg.id}
              className={`flex ${isOut ? "justify-end" : "justify-start"} animate-fade-in`}
              style={{ animationDelay: `${i * 0.01}s` }}>
              <div className={`max-w-[75%] px-4 py-2.5 text-sm ${isOut ? "msg-bubble-out text-white" : "msg-bubble-in text-white"}`}>
                <p className="leading-relaxed">{msg.text}</p>
                <p className={`text-xs mt-1 ${isOut ? "text-white/60 text-right" : "text-white/40"}`}>{msg.time}</p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Stickers */}
      {showStickers && (
        <div className="glass border-t border-white/8 px-4 py-3 animate-fade-in">
          <div className="flex gap-3 flex-wrap">
            {STICKERS.map(s => (
              <button key={s} onClick={() => handleSticker(s)}
                className="text-2xl hover:scale-125 transition-transform duration-150">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="glass border-t border-white/8 px-3 py-3 flex items-end gap-2">
        <button onClick={() => setShowStickers(v => !v)}
          className={`flex-shrink-0 transition-colors ${showStickers ? "text-purple-400" : "text-muted-foreground hover:text-purple-400"}`}>
          <Icon name="Smile" size={22} />
        </button>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(input); } }}
          placeholder="Сообщение..."
          rows={1}
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-white placeholder:text-white/30 text-sm outline-none focus:border-purple-500 transition-colors resize-none"
          style={{ maxHeight: '120px' }}
        />
        <button
          onClick={() => handleSend(input)}
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
          <Icon name={input.trim() ? "Send" : "Mic"} size={18} />
        </button>
      </div>
    </div>
  );
}
