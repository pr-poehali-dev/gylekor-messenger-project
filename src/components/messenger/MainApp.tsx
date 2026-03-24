import { useState } from "react";
import Icon from "@/components/ui/icon";
import GylecorLogo from "./GylecorLogo";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import ContactsTab from "./ContactsTab";
import StatusesTab from "./StatusesTab";
import ProfileTab from "./ProfileTab";
import SettingsTab from "./SettingsTab";

type Tab = "chats" | "contacts" | "statuses" | "profile" | "settings";

interface OpenChatInfo {
  chatId?: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  partnerOnline: boolean;
}

interface MainAppProps {
  user: { id: string; phone: string; username: string; name: string };
  onLogout: () => void;
}

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: "chats", icon: "MessageCircle", label: "Чаты" },
  { id: "contacts", icon: "Users", label: "Контакты" },
  { id: "statuses", icon: "Circle", label: "Статусы" },
  { id: "profile", icon: "User", label: "Профиль" },
  { id: "settings", icon: "Settings", label: "Настройки" },
];

export default function MainApp({ user, onLogout }: MainAppProps) {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [openChat, setOpenChat] = useState<OpenChatInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const tabTitle: Record<Tab, string> = {
    chats: "Чаты",
    contacts: "Контакты",
    statuses: "Статусы",
    profile: "Профиль",
    settings: "Настройки",
  };

  if (openChat) {
    return (
      <div className="h-screen flex flex-col" style={{ background: 'hsl(240, 15%, 6%)' }}>
        <ChatWindow
          chatId={openChat.chatId}
          partnerId={openChat.partnerId}
          partnerName={openChat.partnerName}
          partnerAvatar={openChat.partnerAvatar}
          partnerOnline={openChat.partnerOnline}
          currentUser={user}
          onBack={() => setOpenChat(null)}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ background: 'hsl(240, 15%, 6%)' }}>
      {/* Header */}
      <div className="glass border-b border-white/8 flex-shrink-0">
        <div className="flex items-center px-4 py-3 gap-3">
          <GylecorLogo size={32} />
          <div className="flex-1">
            {searchOpen ? (
              <div className="relative animate-fade-in">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Поиск..."
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-white text-sm placeholder:text-white/30 outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            ) : (
              <h1 className="font-display font-black text-lg gradient-brand-text">{tabTitle[activeTab]}</h1>
            )}
          </div>
          <button
            onClick={() => { setSearchOpen(v => !v); setSearchQuery(""); }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${searchOpen ? "bg-purple-500/20 text-purple-400" : "glass text-muted-foreground hover:text-purple-400"}`}>
            <Icon name={searchOpen ? "X" : "Search"} size={18} />
          </button>
          {activeTab === "chats" && !searchOpen && (
            <button className="w-9 h-9 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-purple-400 transition-colors">
              <Icon name="Edit" size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === "chats" && (
          <ChatList userId={user.id} onOpenChat={setOpenChat} searchQuery={searchQuery} />
        )}
        {activeTab === "contacts" && <ContactsTab searchQuery={searchQuery} />}
        {activeTab === "statuses" && <StatusesTab />}
        {activeTab === "profile" && <ProfileTab user={user} onLogout={onLogout} />}
        {activeTab === "settings" && <SettingsTab />}
      </div>

      {/* Bottom Nav */}
      <div className="glass nav-glow border-t border-white/8 flex-shrink-0">
        <div className="flex items-center px-2 py-2">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchQuery(""); setSearchOpen(false); }}
                className="flex-1 flex flex-col items-center gap-1 py-1 rounded-2xl transition-all duration-200">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 ${isActive ? "scale-105" : "scale-100"}`}
                  style={isActive ? { background: 'linear-gradient(135deg, #7c3aed, #ec4899)' } : {}}>
                  <Icon name={tab.icon} size={isActive ? 22 : 20}
                    style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.4)' }} />
                </div>
                <span className="text-[10px] font-medium transition-colors duration-200"
                  style={{ color: isActive ? '#a855f7' : 'rgba(255,255,255,0.35)' }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
