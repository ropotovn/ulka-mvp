import { motion } from 'framer-motion';
import { useApp, SKILL_CATEGORIES, CATEGORY_COLORS } from '../store';
import { MascotAvatar } from '../components/MascotSystem';
import type { MascotId } from '../components/MascotSystem';

const PITCH_STATS = [
  { value: '65%', label: 'детей будут работать на профессиях, которых ещё нет', source: 'WEF' },
  { value: '85%', label: 'карьерного успеха — soft skills', source: 'Harvard, Stanford' },
  { value: '+26%', label: 'рост спроса на социальные навыки к 2030', source: 'McKinsey' },
];

const NEURO_ANNOTATIONS: Record<string, string> = {
  critical_thinking: 'Лурия (III блок) — программирование и контроль действий',
  creativity: 'Гилфорд — дивергентное мышление',
  systems_thinking: 'Леонтьев — деятельность как система операций',
  problem_solving: 'Пиаже — конкретные операции → формальные',
  emotional_intelligence: 'Гоулман + CASEL — 5 компетенций SEL',
  focus: 'Gazzaley — NeuroRacer, когнитивный тренинг',
  leadership: 'Shallice — Лондонская башня, планирование',
  empathy: 'Барон-Коэн — Theory of Mind',
  flexibility: 'WCST — Wisconsin Card Sorting Test',
};

const AI_REPORT_TEMPLATE = (childName: string, scores: Record<string, number>, firstName: string) => ({
  summary: `${firstName}, за последнюю неделю ${childName || 'ребёнок'} активно развивал несколько ключевых метанавыков. Ниже — детальный разбор от AI-аналитика платформы ULKA.`,
  highlights: [
    'Лидерские качества: ребёнок чаще берёт инициативу в командных миссиях',
    'Эмоциональный интеллект: улучшилось распознавание эмоций NPC в диалогах',
    'Когнитивная гибкость: ребёнок быстрее адаптируется к смене правил в играх',
  ],
  recommendations: [
    'Поощряйте ребёнка объяснять свои решения вслух — это развивает метапознание (Выготский)',
    'Игры с открытым финалом (без правильного ответа) стимулируют креативность (Гилфорд)',
    'Обсуждайте чувства персонажей в фильмах — это углубляет Theory of Mind (Барон-Коэн)',
  ],
  skillChart: Object.fromEntries(
    Object.keys(scores).slice(0, 5).map(k => [k, { before: scores[k] - 5, after: scores[k] }])
  ),
});

interface Props {
  log: { timestamp: string; metric: string; feedback: string }[];
}

export function ParentDashboard({ log }: Props) {
  const { skillScores, childName, firstName } = useApp();
  const report = AI_REPORT_TEMPLATE(childName, skillScores, firstName);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 md:p-8 rounded-[36px] bento-shadow border border-gray-100 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <span className="text-xs font-bold text-[#5D5FEF] uppercase tracking-wider block mb-1">AI-аналитика ULKA</span>
            <h3 className="text-xl md:text-2xl font-bold">{firstName ? `${firstName}, ` : ''}прогресс {childName || 'ребёнка'}</h3>
          </div>
        </div>

        {/* Pitch stats */}
        <div className="grid grid-cols-3 gap-3">
          {PITCH_STATS.map(stat => (
            <div key={stat.source} className="bg-gradient-to-br from-[#5D5FEF]/5 to-[#00D2C4]/5 p-3 rounded-2xl text-center">
              <div className="text-xl font-bold text-[#5D5FEF]">{stat.value}</div>
              <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* AI Report */}
        <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-3xl p-5 border border-indigo-100/50">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🤖</span>
            <span className="text-xs font-bold text-[#5D5FEF] uppercase">AI-отчёт за неделю</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">{report.summary}</p>

          <div className="space-y-3 mb-4">
            <div>
              <span className="text-xs font-bold text-[#00D2C4] uppercase">🌟 Ключевые наблюдения</span>
              <ul className="mt-2 space-y-1">
                {report.highlights.map((h, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                    <span className="text-[#00D2C4] mt-0.5">•</span> {h}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-xs font-bold text-[#FF8A65] uppercase">💡 Рекомендации</span>
              <ul className="mt-2 space-y-1">
                {report.recommendations.map((r, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                    <span className="text-[#FF8A65] mt-0.5">•</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Skill grid with neuro annotations */}
        <div>
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Профиль метанавыков</h4>
          <div className="space-y-3">
            {Object.entries(SKILL_CATEGORIES).map(([catKey, cat]) => {
              const color = CATEGORY_COLORS[catKey] || '#5D5FEF';
              const avg = Math.round(Object.keys(cat.skills).reduce((s, k) => s + (skillScores[k] || 30), 0) / Object.keys(cat.skills).length);
              const mascot = (['felix', 'tala', 'sofia', 'ares', 'ziggy'] as MascotId[])[Object.keys(SKILL_CATEGORIES).indexOf(catKey)];
              return (
                <motion.div key={catKey} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <MascotAvatar mascot={mascot || 'felix'} size="sm" />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm font-bold mb-1">
                        <span>{cat.icon} {cat.name}</span>
                        <span style={{ color }}>{avg}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: color, width: `${avg}%` }}
                          initial={{ width: 0 }} animate={{ width: `${avg}%` }} transition={{ duration: 1 }} />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-3">
                    {Object.entries(cat.skills).map(([skey, sname]) => (
                      <div key={skey} className="text-xs group relative">
                        <span className="text-gray-500">{sname}: </span>
                        <span className="font-bold" style={{ color }}>{skillScores[skey] || 30}%</span>
                        {NEURO_ANNOTATIONS[skey] && (
                          <span className="hidden group-hover:block absolute bottom-full left-0 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-lg whitespace-nowrap z-10 mb-1">
                            {NEURO_ANNOTATIONS[skey]}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Activity log */}
        <div className="bg-gray-50 p-5 rounded-2xl">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">История действий</h4>
          {log.length === 0 ? (
            <p className="text-sm text-gray-400">Пока нет данных.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {log.slice(0, 10).map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400 font-mono">{entry.timestamp}</span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#5D5FEF]/10 text-[#5D5FEF] font-bold">{entry.metric}</span>
                  <span className="text-gray-500 truncate">{entry.feedback}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Re-export for use in ChildDashboard
export { ParentDashboard as default };
