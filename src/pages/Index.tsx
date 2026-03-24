import { useState } from "react";
import AuthScreen from "@/components/messenger/AuthScreen";
import MainApp from "@/components/messenger/MainApp";

export interface AppUser {
  id: string;
  phone: string;
  username: string;
  name: string;
}

export default function Index() {
  const [user, setUser] = useState<AppUser | null>(null);

  if (!user) {
    return <AuthScreen onAuth={setUser} />;
  }

  return <MainApp user={user} onLogout={() => setUser(null)} />;
}
