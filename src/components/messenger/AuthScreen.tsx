import { useState } from "react";
import Icon from "@/components/ui/icon";
import GylecorLogo from "./GylecorLogo";
import { sendOtpCode, verifyOtpCode, registerUser } from "./api";
import type { AppUser } from "@/pages/Index";

interface AuthScreenProps {
  onAuth: (user: AppUser) => void;
}

type Step = "phone" | "code" | "profile";

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState("");

  const formatPhone = (val: string) => {
    const d = val.replace(/\D/g, "").slice(0, 11);
    if (!d) return "";
    if (d.length <= 1) return `+${d}`;
    if (d.length <= 4) return `+${d[0]} (${d.slice(1)}`;
    if (d.length <= 7) return `+${d[0]} (${d.slice(1, 4)}) ${d.slice(4)}`;
    if (d.length <= 9) return `+${d[0]} (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
    return `+${d[0]} (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9)}`;
  };

  const handleSendCode = async () => {
    if (phone.length < 10) return;
    setLoading(true);
    setError("");
    try {
      const res = await sendOtpCode(`+${phone}`);
      if (res.dev_code) setDevCode(res.dev_code);
      setStep("code");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка отправки");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length < 6) return;
    setLoading(true);
    setError("");
    try {
      const res = await verifyOtpCode(`+${phone}`, code);
      if (res.need_profile) {
        setStep("profile");
      } else if (res.user) {
        onAuth(res.user);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Неверный код");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim() || !username.trim()) return;
    setLoading(true);
    setError("");
    try {
      const user = await registerUser(`+${phone}`, username, name);
      onAuth(user);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  const Spinner = () => (
    <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'hsl(240, 15%, 6%)' }}>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 animate-float"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }} />
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
              <p className="text-muted-foreground text-sm mb-5">Пришлём код подтверждения</p>
              <input
                type="tel"
                value={formatPhone(phone)}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                onKeyDown={e => e.key === "Enter" && handleSendCode()}
                placeholder="+7 (___) ___-__-__"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 text-lg font-medium outline-none focus:border-purple-500 transition-colors mb-4"
              />
              {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}
              <button onClick={handleSendCode} disabled={phone.length < 10 || loading}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                {loading
                  ? <span className="flex items-center justify-center gap-2"><Spinner />Отправляем...</span>
                  : "Получить код"}
              </button>
            </div>
          </div>
        )}

        {/* Step: Code */}
        {step === "code" && (
          <div className="animate-fade-in">
            <div className="glass-strong rounded-2xl p-6">
              <button onClick={() => { setStep("phone"); setError(""); setCode(""); setDevCode(""); }}
                className="flex items-center gap-1 text-purple-400 text-sm mb-4 hover:text-purple-300 transition-colors">
                <Icon name="ArrowLeft" size={16} />Назад
              </button>
              <h2 className="text-white font-semibold text-lg mb-1">Код подтверждения</h2>
              <p className="text-muted-foreground text-sm mb-1">
                Отправили на <span className="text-purple-400">{formatPhone(phone)}</span>
              </p>

              {/* Показываем код в режиме разработки */}
              {devCode && (
                <div className="mb-4 mt-2 px-3 py-2 rounded-xl flex items-center gap-2"
                  style={{ background: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.3)' }}>
                  <Icon name="MessageSquare" size={14} className="text-purple-400 flex-shrink-0" />
                  <span className="text-xs text-purple-300">Ваш код: </span>
                  <span className="text-purple-200 font-bold tracking-widest text-sm">{devCode}</span>
                </div>
              )}

              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setCode(val);
                  if (val.length === 6) setError("");
                }}
                onKeyDown={e => e.key === "Enter" && handleVerifyCode()}
                placeholder="• • • • • •"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 text-2xl font-bold tracking-[0.6em] text-center outline-none focus:border-purple-500 transition-colors mb-4"
              />
              {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}
              <button onClick={handleVerifyCode} disabled={code.length < 6 || loading}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                {loading
                  ? <span className="flex items-center justify-center gap-2"><Spinner />Проверяем...</span>
                  : "Подтвердить"}
              </button>
              <button
                onClick={handleSendCode}
                disabled={loading}
                className="w-full mt-3 text-center text-muted-foreground text-xs hover:text-purple-400 transition-colors">
                Отправить код повторно
              </button>
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
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-3xl font-bold text-white">
                    {name ? name[0].toUpperCase() : "?"}
                  </div>
                </div>
              </div>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Ваше имя"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 outline-none focus:border-purple-500 transition-colors mb-3"
              />
              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 font-medium">@</span>
                <input type="text" value={username}
                  onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase())}
                  placeholder="ваш_ник"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3.5 text-white placeholder:text-white/30 outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}
              <button onClick={handleRegister} disabled={!name.trim() || !username.trim() || loading}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                {loading
                  ? <span className="flex items-center justify-center gap-2"><Spinner />Создаём...</span>
                  : "Войти в Гылекор 🚀"}
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
