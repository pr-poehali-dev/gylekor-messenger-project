import { useState } from "react";
import AuthScreen from "@/components/messenger/AuthScreen";
import MainApp from "@/components/messenger/MainApp";

export default function Index() {
  const [user, setUser] = useState<{ phone: string; username: string; name: string } | null>(null);

  if (!user) {
    return <AuthScreen onAuth={setUser} />;
  }

  return <MainApp user={user} onLogout={() => setUser(null)} />;
}
