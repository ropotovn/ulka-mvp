import { motion } from 'framer-motion';
import { useApp, SKILL_CATEGORIES, CATEGORY_COLORS } from '../store';

const PITCH_STATS = [
  { value: '65%', label: 'детей будут работать на профессиях, которых ещё не существует', source: 'WEF' },
  { value: '85%', label: 'успеха в карьере определяется soft skills', source: 'Harvard, Stanford' },
  { value: '+26%', label: 'рост спроса на социальные и эмоциональные навыки к 2030 году', source: 'McKinsey' },
];

const LEVEL_LABELS = ['Начальный', 'Базовый', 'Уверенный', 'Продвинутый', 'Мастер'];

function getLevel(pct: number) {
  if (pct < 25) return 0; if (pct < 45) return 1; if (pct < 65) return 2; if (pct < 85) return 3; return 4;
}

export function ParentDashboard() {
  const { skillScores, log, childName, firstName, mission } = useApp();

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 md:p-8 rounded-[32px] bento-shadow border border-gray-100 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <span className="text-xs font-bold text-[#5D5FEF] uppercase tracking-wider block mb-1">Аналитика ULKA.Platform</span>
            <h3 className="text-xl md:text-2xl font-bold">
              {firstName ? `${firstName}, ` : ''}профиль метанавыков {childName || 'ребёнка'}
            </h3>
            <p className="text-xs text-gray-400 mt-1">По 20+ метанавыкам · 5-уровневая шкала · Динамика обновляется после каждой миссии</p>
          </div>
          <div className="bg-gray-50 px-4 py-2 rounded-2xl shrink-0">
            <span className="text-xs text-gray-400 font-semibold block">Активный квест:</span>
            <span className="text-sm font-bold text-gray-700">{mission?.questTitle || '—'}</span>
          </div>
        </div>

        {/* Pitch Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PITCH_STATS.map(stat => (
            <div key={stat.source} className="bg-gradient-to-br from-[#5D5FEF]/5 to-[#00D2C4]/5 p-4 rounded-2xl text-center">
              <div className="text-2xl font-bold text-[#5D5FEF]">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{stat.label}</p>
              <span className="text-[10px] text-gray-400 font-bold mt-1 block">{stat.source}</span>
            </div>
          ))}
        </div>

        {/* 5 Categories — skill grid */}
        <div>
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Профиль по 5 категориям</h4>
          <div className="space-y-4">
            {Object.entries(SKILL_CATEGORIES).map(([catKey, cat]) => {
              const color = CATEGORY_COLORS[catKey] || '#5D5FEF';
              const avg = Object.keys(cat.skills).reduce((s, k) => s + (skillScores[k] || 30), 0) / Object.keys(cat.skills).length;
              const level = getLevel(avg);
              return (
                <motion.div key={catKey} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-gray-50 p-4 rounded-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold">{cat.icon} {cat.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400">{Math.round(avg)}%</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold text-white" style={{ backgroundColor: color }}>{LEVEL_LABELS[level]}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-3">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: color, width: `${avg}%` }}
                      initial={{ width: 0 }} animate={{ width: `${avg}%` }} transition={{ duration: 1, delay: 0.1 }} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(cat.skills).map(([skey, sname]) => (
                      <div key={skey} className="flex justify-between text-xs">
                        <span className="text-gray-500">{sname}</span>
                        <span className="font-bold" style={{ color }}>{skillScores[skey] || 30}%</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 5-level Scale Reference */}
        <div className="bg-gray-50 p-5 rounded-2xl">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Шкала оценки (5 уровней)</h4>
          <div className="flex gap-1">
            {LEVEL_LABELS.map((l, i) => (
              <div key={i} className="flex-1 text-center">
                <div className="text-[10px] font-bold text-gray-500 mb-1">{l}</div>
                <div className="h-1.5 rounded-full" style={{ background: `linear-gradient(to right, ${CATEGORY_COLORS.thinking}${20+i*20}, ${CATEGORY_COLORS.thinking})`, opacity: 0.3 + i * 0.18 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Action History */}
        <div className="bg-gray-50 p-5 rounded-2xl">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">История действий</h4>
          {log.length === 0 ? (
            <p className="text-sm text-gray-400">Пока нет данных. Пройдите первую миссию!</p>
          ) : (
            <div className="space-y-2">
              {log.slice(0, 5).map((entry, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="text-xs text-gray-400 font-mono">{entry.timestamp}</span>
                  <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-[#5D5FEF]/10 text-[#5D5FEF]">{entry.metric}</span>
                  <span className="text-gray-500">Выбор {entry.choiceId} · {entry.feedback}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
