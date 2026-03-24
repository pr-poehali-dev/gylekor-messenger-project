import { useState } from "react";
import Icon from "@/components/ui/icon";
import GylecorLogo from "./GylecorLogo";

interface ProfileTabProps {
  user: { phone: string; username: string; name: string };
  onLogout: () => void;
}

export default function ProfileTab({ user, onLogout }: ProfileTabProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState("Пользователь мессенджера Гылекор 💜");

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Cover gradient */}
      <div className="relative h-36"
        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>

      {/* Avatar */}
      <div className="relative px-5 pb-4">
        <div className="absolute -top-12 left-5">
          <div className="avatar-ring shadow-2xl">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-4xl font-black text-white font-display shadow-lg">
              {user.name[0].toUpperCase()}
            </div>
          </div>
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 rounded-full border-2"
            style={{ borderColor: 'hsl(240, 15%, 6%)' }} />
        </div>

        <div className="pt-16 flex items-start justify-between">
          <div>
            {editing ? (
              <input value={name} onChange={e => setName(e.target.value)}
                className="text-xl font-bold text-white bg-white/10 rounded-lg px-2 py-1 outline-none border border-purple-500"
              />
            ) : (
              <h2 className="text-xl font-bold text-white font-display">{name}</h2>
            )}
            <p className="text-purple-400 text-sm mt-0.5">@{user.username}</p>
          </div>
          <button onClick={() => setEditing(v => !v)}
            className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-purple-500/20 transition-colors">
            <Icon name={editing ? "Check" : "Pencil"} size={16} className="text-purple-400" />
          </button>
        </div>

        {/* Bio */}
        <div className="mt-3 glass rounded-2xl p-3">
          {editing ? (
            <textarea value={bio} onChange={e => setBio(e.target.value)}
              className="w-full bg-transparent text-white/70 text-sm outline-none resize-none"
              rows={2}
            />
          ) : (
            <p className="text-white/70 text-sm">{bio}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "Чатов", value: "5" },
            { label: "Контактов", value: "6" },
            { label: "Статусов", value: "12" },
          ].map(stat => (
            <div key={stat.label} className="glass rounded-2xl p-3 text-center">
              <p className="text-xl font-black gradient-brand-text font-display">{stat.value}</p>
              <p className="text-muted-foreground text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-4 space-y-2">
          <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
            <Icon name="Phone" size={18} className="text-purple-400" />
            <div>
              <p className="text-white/40 text-xs">Телефон</p>
              <p className="text-white text-sm">{user.phone}</p>
            </div>
          </div>
          <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
            <Icon name="AtSign" size={18} className="text-purple-400" />
            <div>
              <p className="text-white/40 text-xs">Ник</p>
              <p className="text-white text-sm">@{user.username}</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full mt-5 py-3 rounded-2xl text-red-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors"
          style={{ border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <Icon name="LogOut" size={18} />
          Выйти из аккаунта
        </button>

        <div className="flex items-center justify-center gap-2 mt-6 pb-4 opacity-40">
          <GylecorLogo size={16} />
          <span className="text-xs text-muted-foreground font-display">Гылекор v1.0</span>
        </div>
      </div>
    </div>
  );
}
