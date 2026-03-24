import { useState } from "react";
import { STATUSES } from "./data";
import Icon from "@/components/ui/icon";

export default function StatusesTab() {
  const [viewedId, setViewedId] = useState<string | null>(null);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {/* My status */}
      <div className="mb-6">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Мой статус</p>
        <button className="flex items-center gap-3 w-full hover:bg-white/5 p-2 rounded-2xl transition-colors">
          <div className="relative">
            <div className="w-14 h-14 rounded-full glass flex items-center justify-center"
              style={{ border: '2px dashed rgba(124, 58, 237, 0.5)' }}>
              <Icon name="Plus" size={24} className="text-purple-400" />
            </div>
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">Добавить статус</p>
            <p className="text-muted-foreground text-xs">Фото, видео или текст</p>
          </div>
        </button>
      </div>

      {/* Others statuses */}
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Недавние</p>

      <div className="space-y-1">
        {STATUSES.map((status, i) => (
          <button
            key={status.id}
            onClick={() => setViewedId(status.id)}
            className="flex items-center gap-3 w-full hover:bg-white/5 p-3 rounded-2xl transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${i * 0.06}s` }}>

            <div className="relative flex-shrink-0">
              <div className={`p-[3px] rounded-full bg-gradient-to-br ${status.viewed || viewedId === status.id ? "from-gray-600 to-gray-500" : status.gradient}`}>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-700 to-pink-600 flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: 'hsl(240, 12%, 10%)' }}>
                  <span className="text-lg font-bold text-white">{status.avatar}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 text-left">
              <p className="text-white font-semibold text-sm">{status.name}</p>
              <p className="text-muted-foreground text-xs">{status.time}</p>
            </div>

            {!status.viewed && viewedId !== status.id && (
              <div className="w-2 h-2 rounded-full"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }} />
            )}
          </button>
        ))}
      </div>

      {/* Status viewer modal */}
      {viewedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-scale-in"
          style={{ background: 'rgba(0,0,0,0.9)' }}>
          <div className="relative w-full max-w-sm h-[80vh] rounded-3xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f472b6 100%)' }}>

            <div className="absolute top-0 left-0 right-0 flex gap-1 p-4">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex-1 h-0.5 rounded-full bg-white/40">
                  <div className="h-full w-full bg-white rounded-full" style={{ width: s === 1 ? "100%" : "0%" }} />
                </div>
              ))}
            </div>

            <div className="absolute top-8 left-0 right-0 flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold text-white">
                {STATUSES.find(s => s.id === viewedId)?.avatar}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{STATUSES.find(s => s.id === viewedId)?.name}</p>
                <p className="text-white/70 text-xs">{STATUSES.find(s => s.id === viewedId)?.time}</p>
              </div>
              <button onClick={() => setViewedId(null)} className="ml-auto text-white/70 hover:text-white">
                <Icon name="X" size={22} />
              </button>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-8">
                <div className="text-6xl mb-4">✨</div>
                <p className="text-white font-bold text-2xl font-display">Статус недоступен</p>
                <p className="text-white/70 text-sm mt-2">Здесь будет фото или видео</p>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-3">
              <input
                placeholder="Ответить на статус..."
                className="flex-1 bg-white/20 backdrop-blur rounded-full px-4 py-2.5 text-white placeholder:text-white/50 text-sm outline-none border border-white/20"
              />
              <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Icon name="Send" size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
