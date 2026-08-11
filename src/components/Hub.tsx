import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, SKILL_CATEGORIES, CATEGORY_COLORS } from '../store';
import { MascotAvatar, MascotParade, MascotSpeech, MASCOTS } from './MascotSystem';
import type { MascotId } from './MascotSystem';

type Island = {
  id: MascotId;
  label: string;
  desc: string;
  x: string; y: string;
  unlocked: boolean;
};

const ISLANDS: Island[] = [
  { id: 'felix', label: 'Башня Логики', desc: 'Головоломки и загадки', x: '15%', y: '25%', unlocked: true },
  { id: 'tala', label: 'Озеро Спокойствия', desc: 'Медитация и фокус', x: '70%', y: '20%', unlocked: true },
  { id: 'sofia', label: 'Мост Диалогов', desc: 'Общение и эмпатия', x: '45%', y: '55%', unlocked: true },
  { id: 'ares', label: 'Арена Команды', desc: 'Лидерство и дружба', x: '20%', y: '65%', unlocked: true },
  { id: 'ziggy', label: 'Лабиринт Перемен', desc: 'Адаптивность и гибкость', x: '75%', y: '60%', unlocked: true },
];

export function Hub() {
  const { skillScores, childName } = useApp();
  const [activeMascot, setActiveMascot] = useState<MascotId | null>(null);
  const [showMascotSpeech, setShowMascotSpeech] = useState(false);

  const handleIslandClick = (island: Island) => {
    setActiveMascot(island.id);
    setShowMascotSpeech(true);
    setTimeout(() => setShowMascotSpeech(false), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 pb-12">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 pt-6">
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity }}
          className="text-6xl mb-4 drop-shadow-xl">🌍</motion.div>
        <h1 className="text-3xl font-bold mb-2">Добро пожаловать, {childName || 'исследователь'}!</h1>
        <p className="text-gray-500 max-w-md mx-auto">Мир Улки ждёт тебя. Выбери остров — и Хранитель проведёт тебя к новым открытиям.</p>
      </motion.div>

      {/* Mascot Parade */}
      <div className="mb-8">
        <MascotParade active={activeMascot || undefined} onSelect={id => { setActiveMascot(id); setShowMascotSpeech(true); setTimeout(() => setShowMascotSpeech(false), 5000); }} />
      </div>

      {/* Mascot speech bubble */}
      <AnimatePresence>
        {showMascotSpeech && activeMascot && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="max-w-md mx-auto mb-8">
            <MascotSpeech mascot={activeMascot} text={MASCOTS[activeMascot].phrase} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* World Map */}
      <div className="relative bg-white rounded-[40px] bento-shadow border border-gray-100 p-8 overflow-hidden" style={{ minHeight: 440 }}>
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-[#5D5FEF]/5 blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-56 h-56 rounded-full bg-[#00D2C4]/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#F59E0B]/5 blur-3xl" />
        </div>

        {/* SVG paths between islands */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {[
            [ISLANDS[0], ISLANDS[2]], [ISLANDS[2], ISLANDS[1]],
            [ISLANDS[0], ISLANDS[3]], [ISLANDS[2], ISLANDS[4]],
            [ISLANDS[3], ISLANDS[2]], [ISLANDS[1], ISLANDS[4]],
          ].map(([a, b], i) => (
            <line key={i}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="#E5E7EB" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.4} />
          ))}
        </svg>

        {/* Islands */}
        {ISLANDS.map((island, i) => {
          const m = MASCOTS[island.id];
          return (
            <motion.button
              key={island.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.12, type: 'spring' }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleIslandClick(island)}
              className="absolute flex flex-col items-center gap-2 group"
              style={{ left: island.x, top: island.y, transform: 'translate(-50%,-50%)', zIndex: 10 }}
            >
              {/* Island glow */}
              <motion.div
                className="absolute inset-0 rounded-full blur-xl"
                style={{ backgroundColor: m.color + '15' }}
                animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity }}
              />
              {/* Avatar */}
              <MascotAvatar mascot={island.id} size="md" />
              {/* Label */}
              <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity -mt-1">
                <span className="text-xs font-bold block" style={{ color: m.color }}>{island.label}</span>
                <span className="text-[10px] text-gray-400">{island.desc}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Skill summary — compact */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="mt-8 bg-white rounded-[32px] bento-shadow border border-gray-100 p-5">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Твой прогресс</h4>
        <div className="space-y-3">
          {Object.entries(SKILL_CATEGORIES).map(([catKey, cat]) => {
            const color = CATEGORY_COLORS[catKey] || '#5D5FEF';
            const avg = Math.round(Object.keys(cat.skills).reduce((s, k) => s + (skillScores[k] || 30), 0) / Object.keys(cat.skills).length);
            const mascot = (['felix', 'tala', 'sofia', 'ares', 'ziggy'] as MascotId[])[Object.keys(SKILL_CATEGORIES).indexOf(catKey)] || 'felix';
            return (
              <div key={catKey} className="flex items-center gap-3">
                <MascotAvatar mascot={mascot} size="sm" />
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>{cat.icon} {cat.name}</span>
                    <span className="text-[10px] text-gray-400">{avg}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: color, width: `${avg}%` }}
                      initial={{ width: 0 }} animate={{ width: `${avg}%` }} transition={{ duration: 0.8, delay: 0.6 }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
