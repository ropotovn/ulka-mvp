import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, SKILL_CATEGORIES, CATEGORY_COLORS } from '../store';
import { MascotAvatar, MASCOTS } from './MascotSystem';
import type { MascotId } from './MascotSystem';
import type { ChallengeType } from '../campaign';

type Island = {
  id: MascotId;
  label: string;
  desc: string;
  x: string; y: string;
  gameType: ChallengeType;
  questTitle: string;
  questIntro: string;
};

const ISLANDS: Island[] = [
  { id: 'felix', label: 'Башня Логики', desc: 'Головоломки', x: '15%', y: '25%', gameType: 'logic',
    questTitle: 'Шифр древних', questIntro: 'Феликс нашёл запертую башню. Руны на двери — это код. Поможешь разгадать?' },
  { id: 'tala', label: 'Озеро Спокойствия', desc: 'Фокус и медитация', x: '70%', y: '20%', gameType: 'strategy',
    questTitle: 'Вдох-выдох', questIntro: 'Тала учит дышать. Но озеро замутилось — нужно найти источник спокойствия.' },
  { id: 'sofia', label: 'Мост Диалогов', desc: 'Общение и эмпатия', x: '45%', y: '55%', gameType: 'social',
    questTitle: 'Разговор с ветром', questIntro: 'София слышит, как ветер шепчет чью-то просьбу. Поможешь понять, что он хочет?' },
  { id: 'ares', label: 'Арена Команды', desc: 'Лидерство', x: '20%', y: '65%', gameType: 'social',
    questTitle: 'Испытание капитана', questIntro: 'Арес собирает отряд. Нужен тот, кто поведёт. Готов доказать, что ты лидер?' },
  { id: 'ziggy', label: 'Лабиринт Перемен', desc: 'Адаптивность', x: '75%', y: '60%', gameType: 'creative',
    questTitle: 'Стены движутся', questIntro: 'Зигги смеётся: лабиринт живёт своей жизнью. Правила меняются каждую минуту. Справишься?' },
];

interface Props {
  onExplore: (mascot: MascotId, gameType: ChallengeType, quest: { title: string; intro: string }) => void;
}

export function Hub({ onExplore }: Props) {
  const { skillScores, childName } = useApp();
  const [activeMascot, setActiveMascot] = useState<MascotId | null>(null);
  const [selectedIsland, setSelectedIsland] = useState<Island | null>(null);
  const [questPhase, setQuestPhase] = useState<'idle' | 'intro' | 'ready'>('idle');

  const handleIslandClick = (island: Island) => {
    setActiveMascot(island.id);
    setSelectedIsland(island);
    setQuestPhase('intro');
    setTimeout(() => setQuestPhase('ready'), 3000);
  };

  const handleStartQuest = () => {
    if (!selectedIsland) return;
    onExplore(selectedIsland.id, selectedIsland.gameType, {
      title: selectedIsland.questTitle,
      intro: selectedIsland.questIntro,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 pb-12">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 pt-6">
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity }}
          className="text-6xl mb-4 drop-shadow-xl">🌍</motion.div>
        <h1 className="text-3xl font-bold mb-2">Куда отправимся, {childName || 'исследователь'}?</h1>
        <p className="text-gray-500 max-w-md mx-auto">Выбери остров — и Хранитель откроет тебе задание.</p>
      </motion.div>

      {/* World Map */}
      <div className="relative bg-white rounded-[40px] bento-shadow border border-gray-100 p-8 overflow-hidden mb-8" style={{ minHeight: 440 }}>
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-[#5D5FEF]/5 blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-56 h-56 rounded-full bg-[#00D2C4]/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#F59E0B]/5 blur-3xl" />
        </div>

        {/* SVG paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {[
            [ISLANDS[0], ISLANDS[2]], [ISLANDS[2], ISLANDS[1]],
            [ISLANDS[0], ISLANDS[3]], [ISLANDS[2], ISLANDS[4]],
            [ISLANDS[3], ISLANDS[2]], [ISLANDS[1], ISLANDS[4]],
          ].map(([a, b], i) => (
            <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="#E5E7EB" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.4} />
          ))}
        </svg>

        {/* Islands */}
        {ISLANDS.map((island, i) => {
          const m = MASCOTS[island.id];
          const isActive = activeMascot === island.id;
          return (
            <motion.button key={island.id}
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.12, type: 'spring' }}
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={() => handleIslandClick(island)}
              className={`absolute flex flex-col items-center gap-2 group ${isActive ? 'z-20' : 'z-10'}`}
              style={{ left: island.x, top: island.y, transform: 'translate(-50%,-50%)' }}>
              <motion.div className="absolute inset-0 rounded-full blur-xl"
                style={{ backgroundColor: m.color + (isActive ? '30' : '10') }}
                animate={{ scale: isActive ? [1, 1.3, 1] : [1, 1.15, 1] }}
                transition={{ duration: isActive ? 1.5 : 3, repeat: Infinity }} />
              <MascotAvatar mascot={island.id} size={isActive ? 'lg' : 'md'} />
              <div className={`text-center transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} -mt-1`}>
                <span className="text-xs font-bold block" style={{ color: m.color }}>{island.label}</span>
                <span className="text-[10px] text-gray-400">{island.desc}</span>
              </div>
              {/* Selection indicator */}
              {isActive && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center text-xs">✓</motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Quest panel — appears when island selected */}
      <AnimatePresence>
        {selectedIsland && questPhase !== 'idle' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white rounded-[32px] bento-shadow border border-gray-100 p-6 max-w-lg mx-auto">
            <div className="flex items-start gap-4 mb-4">
              <MascotAvatar mascot={selectedIsland.id} size="md" speaking />
              <div className="flex-1">
                <h3 className="text-lg font-bold">{selectedIsland.questTitle}</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedIsland.questIntro}</p>
              </div>
            </div>

            {questPhase === 'intro' && (
              <div className="flex items-center gap-2 text-sm text-gray-400 animate-pulse">
                <div className="w-4 h-4 rounded-full border-2 border-[#5D5FEF] border-t-transparent animate-spin" />
                {MASCOTS[selectedIsland.id].name} готовит задание...
              </div>
            )}

            {questPhase === 'ready' && (
              <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                onClick={handleStartQuest}
                className="w-full py-3 text-white font-bold rounded-2xl transition hover:shadow-lg"
                style={{ backgroundColor: MASCOTS[selectedIsland.id].color }}>
                {MASCOTS[selectedIsland.id].emoji} В путь с {MASCOTS[selectedIsland.id].name}!
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skill summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-[32px] bento-shadow border border-gray-100 p-5">
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
                      initial={{ width: 0 }} animate={{ width: `${avg}%` }} transition={{ duration: 0.8 }} />
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
