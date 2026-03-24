import { useState, useEffect } from "react";
import AuthScreen from "@/components/messenger/AuthScreen";
import MainApp from "@/components/messenger/MainApp";
import { getMe } from "@/components/messenger/api";

export interface AppUser {
  id: string;
  phone: string;
  username: string;
  name: string;
}

const SESSION_KEY = "gylekor_user_id";

export default function Index() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [checking, setChecking] = useState(true);

  // Восстанавливаем сессию при загрузке
  useEffect(() => {
    const savedId = localStorage.getItem(SESSION_KEY);
    if (savedId) {
      getMe(savedId).then(u => {
        if (u) setUser(u);
        setChecking(false);
      });
    } else {
      setChecking(false);
    }
  }, []);

  const handleAuth = (u: AppUser) => {
    localStorage.setItem(SESSION_KEY, u.id);
    setUser(u);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(240, 15%, 6%)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500/40 border-t-purple-500 animate-spin" />
          <p className="text-muted-foreground text-sm">Загружаем Гылекор...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  return <MainApp user={user} onLogout={handleLogout} />;
}
