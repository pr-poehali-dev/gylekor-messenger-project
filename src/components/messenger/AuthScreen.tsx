import { useState } from "react";
import Icon from "@/components/ui/icon";
import GylecorLogo from "./GylecorLogo";

interface AuthScreenProps {
  onAuth: (user: { phone: string; username: string; name: string }) => void;
}

type Step = "phone" | "code" | "profile";

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhone = () => {
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("code");
    }, 1200);
  };

  const handleCode = () => {
    if (code.length < 4) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("profile");
    }, 900);
  };

  const handleProfile = () => {
    if (!name.trim() || !username.trim()) return;
    onAuth({ phone, username: username.replace("@", ""), name });
  };

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    if (digits.length === 0) return "";
    if (digits.length <= 1) return `+${digits}`;
    if (digits.length <= 4) return `+${digits[0]} (${digits.slice(1)}`;
    if (digits.length <= 7) return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 9) return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'hsl(240, 15%, 6%)' }}>

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 animate-float"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent)', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
      </div>

      <div className="w-full max-w-sm px-6 relative z-10 animate-scale-in">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <GylecorLogo size={80} className="mb-4 animate-pulse-glow" />
          <h1 className="font-display text-3xl font-black gradient-brand-text tracking-tight">Гылекор</h1>
          <p className="text-muted-foreground text-sm mt-1">Мессенджер нового поколения</p>
        </div>

        {/* Step: Phone */}
        {step === "phone" && (
          <div className="animate-fade-in">
            <div className="glass-strong rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-1">Введите номер</h2>
              <p className="text-muted-foreground text-sm mb-5">Мы отправим код подтверждения</p>
              <div className="relative mb-4">
                <input
                  type="tel"
                  value={formatPhone(phone)}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="+7 (___) ___-__-__"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 text-lg font-medium outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <button
                onClick={handlePhone}
                disabled={phone.length < 10 || loading}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Отправляем...
                  </span>
                ) : "Получить код"}
              </button>
            </div>
          </div>
        )}

        {/* Step: Code */}
        {step === "code" && (
          <div className="animate-fade-in">
            <div className="glass-strong rounded-2xl p-6">
              <button onClick={() => setStep("phone")} className="flex items-center gap-1 text-purple-400 text-sm mb-4 hover:text-purple-300 transition-colors">
                <Icon name="ArrowLeft" size={16} />
                Назад
              </button>
              <h2 className="text-white font-semibold text-lg mb-1">Код из СМС</h2>
              <p className="text-muted-foreground text-sm mb-5">Отправили на <span className="text-purple-400">{formatPhone(phone)}</span></p>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="_ _ _ _ _ _"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 text-2xl font-bold tracking-[0.5em] text-center outline-none focus:border-purple-500 transition-colors mb-4"
              />
              <button
                onClick={handleCode}
                disabled={code.length < 4 || loading}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Проверяем...
                  </span>
                ) : "Подтвердить"}
              </button>
              <p className="text-center text-muted-foreground text-xs mt-3">Не пришло? <button className="text-purple-400 hover:text-purple-300">Отправить снова</button></p>
            </div>
          </div>
        )}

        {/* Step: Profile */}
        {step === "profile" && (
          <div className="animate-fade-in">
            <div className="glass-strong rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-1">Создайте профиль</h2>
              <p className="text-muted-foreground text-sm mb-5">Как вас зовут в Гылекор?</p>

              <div className="flex justify-center mb-5">
                <div className="avatar-ring">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-3xl">
                    {name ? name[0].toUpperCase() : "?"}
                  </div>
                </div>
              </div>

              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ваше имя"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 outline-none focus:border-purple-500 transition-colors mb-3"
              />
              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 font-medium">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase())}
                  placeholder="ваш_ник"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3.5 text-white placeholder:text-white/30 outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <button
                onClick={handleProfile}
                disabled={!name.trim() || !username.trim()}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                Войти в Гылекор 🚀
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-muted-foreground text-xs mt-6">
          Регистрируясь, вы соглашаетесь с условиями использования
        </p>
      </div>
    </div>
  );
}
