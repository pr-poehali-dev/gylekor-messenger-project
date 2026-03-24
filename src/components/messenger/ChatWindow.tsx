import { useState, useRef, useEffect } from "react";
import { type Chat, type Message } from "./data";
import Icon from "@/components/ui/icon";

interface ChatWindowProps {
  chat: Chat;
  onBack: () => void;
  currentUser: { name: string; username: string };
}

const STICKERS = ["😂", "❤️", "🔥", "👍", "😍", "🤔", "😎", "🎉", "💯", "🚀"];

export default function ChatWindow({ chat, onBack, currentUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const [input, setInput] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      text,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      out: true,
    };
    setMessages(prev => [...prev, msg]);
    setInput("");

    // Simulate reply
    setTimeout(() => {
      const replies = ["Понял 👍", "Отлично!", "Да, конечно", "Хорошо, принято 💜", "Окей!"];
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
        out: false,
      };
      setMessages(prev => [...prev, reply]);
    }, 1000 + Math.random() * 1000);
  };

  const sendSticker = (sticker: string) => {
    sendMessage(sticker);
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
              {chat.avatar}
            </div>
          </div>
          {chat.online && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2"
              style={{ borderColor: 'hsl(240, 12%, 10%)' }} />
          )}
        </div>

        <div className="flex-1">
          <div className="font-semibold text-white text-sm">{chat.name}</div>
          <div className="text-xs" style={{ color: chat.online ? '#4ade80' : '#6b7280' }}>
            {chat.online ? "онлайн" : "был(а) недавно"}
          </div>
        </div>

        <div className="flex gap-3">
          <button className="text-muted-foreground hover:text-purple-400 transition-colors">
            <Icon name="Phone" size={20} />
          </button>
          <button className="text-muted-foreground hover:text-purple-400 transition-colors">
            <Icon name="Video" size={20} />
          </button>
          <button className="text-muted-foreground hover:text-purple-400 transition-colors">
            <Icon name="MoreVertical" size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.map((msg, i) => (
          <div key={msg.id}
            className={`flex ${msg.out ? "justify-end" : "justify-start"} animate-fade-in`}
            style={{ animationDelay: `${i * 0.02}s` }}>
            <div className={`max-w-[75%] px-4 py-2.5 text-sm ${msg.out ? "msg-bubble-out text-white" : "msg-bubble-in text-white"}`}>
              <p className="leading-relaxed">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.out ? "text-white/60 text-right" : "text-white/40"}`}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Sticker panel */}
      {showStickers && (
        <div className="glass border-t border-white/8 px-4 py-3 animate-fade-in">
          <div className="flex gap-3 flex-wrap">
            {STICKERS.map(s => (
              <button key={s} onClick={() => sendSticker(s)}
                className="text-2xl hover:scale-125 transition-transform duration-150">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="glass border-t border-white/8 px-3 py-3 flex items-end gap-2">
        <button
          onClick={() => setShowStickers(v => !v)}
          className={`flex-shrink-0 transition-colors ${showStickers ? "text-purple-400" : "text-muted-foreground hover:text-purple-400"}`}>
          <Icon name="Smile" size={22} />
        </button>

        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Сообщение..."
            rows={1}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-white placeholder:text-white/30 text-sm outline-none focus:border-purple-500 transition-colors resize-none"
            style={{ maxHeight: '120px' }}
          />
        </div>

        <button
          onClick={() => input.trim() ? sendMessage(input) : setIsRecording(v => !v)}
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
          {input.trim() ? (
            <Icon name="Send" size={18} />
          ) : (
            <Icon name={isRecording ? "Square" : "Mic"} size={18} />
          )}
        </button>
      </div>
    </div>
  );
}
