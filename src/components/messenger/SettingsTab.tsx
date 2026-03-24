import { useState } from "react";
import Icon from "@/components/ui/icon";

interface SettingItem {
  icon: string;
  label: string;
  description?: string;
  type: "toggle" | "link";
  defaultValue?: boolean;
  color?: string;
}

const SETTINGS: { group: string; items: SettingItem[] }[] = [
  {
    group: "Уведомления",
    items: [
      { icon: "Bell", label: "Уведомления", description: "Звук и вибрация", type: "toggle", defaultValue: true },
      { icon: "VolumeX", label: "Беззвучный режим", type: "toggle", defaultValue: false },
      { icon: "Moon", label: "Не беспокоить", description: "23:00 — 8:00", type: "toggle", defaultValue: true },
    ]
  },
  {
    group: "Конфиденциальность",
    items: [
      { icon: "Eye", label: "Читаемость сообщений", description: "Показывать галочки", type: "toggle", defaultValue: true },
      { icon: "Clock", label: "Последняя активность", description: "Только контакты", type: "link" },
      { icon: "Lock", label: "Двухфакторная аутентификация", type: "toggle", defaultValue: false, color: "#ec4899" },
    ]
  },
  {
    group: "Внешний вид",
    items: [
      { icon: "Palette", label: "Тема оформления", description: "Тёмная", type: "link" },
      { icon: "Type", label: "Размер шрифта", description: "Средний", type: "link" },
      { icon: "Zap", label: "Анимации", type: "toggle", defaultValue: true },
    ]
  },
  {
    group: "Хранилище",
    items: [
      { icon: "HardDrive", label: "Очистить кэш", description: "Занято 128 МБ", type: "link" },
      { icon: "Download", label: "Автозагрузка медиа", description: "Только Wi-Fi", type: "link" },
    ]
  },
];

export default function SettingsTab() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    SETTINGS.forEach(g => g.items.forEach(item => {
      if (item.type === "toggle") {
        init[item.label] = item.defaultValue ?? false;
      }
    }));
    return init;
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3">
      {SETTINGS.map((group, gi) => (
        <div key={group.group} className="mb-5 animate-fade-in" style={{ animationDelay: `${gi * 0.08}s` }}>
          <p className="text-xs font-bold gradient-brand-text uppercase tracking-wider mb-2 px-1">{group.group}</p>
          <div className="glass rounded-2xl overflow-hidden">
            {group.items.map((item, ii) => (
              <div key={item.label}>
                {ii > 0 && <div className="border-t border-white/5 mx-3" />}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: item.color ? `${item.color}22` : 'rgba(124, 58, 237, 0.15)' }}>
                    <Icon name={item.icon} fallback="Settings" size={18}
                      style={{ color: item.color ?? '#a855f7' }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{item.label}</p>
                    {item.description && (
                      <p className="text-muted-foreground text-xs">{item.description}</p>
                    )}
                  </div>

                  {item.type === "toggle" ? (
                    <button
                      onClick={() => setToggles(prev => ({ ...prev, [item.label]: !prev[item.label] }))}
                      className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0`}
                      style={{ background: toggles[item.label] ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : 'rgba(255,255,255,0.1)' }}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${toggles[item.label] ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  ) : (
                    <Icon name="ChevronRight" size={18} className="text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="glass rounded-2xl overflow-hidden mb-5">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
            <Icon name="HelpCircle" size={18} style={{ color: '#ef4444' }} />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Поддержка</p>
            <p className="text-muted-foreground text-xs">Связаться с командой</p>
          </div>
          <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}