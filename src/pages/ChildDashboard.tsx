import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp, SKILL_CATEGORIES, CATEGORY_COLORS } from '../store';
import { FocusGame } from '../components/games/FocusGame';
import { EntryGame } from '../components/EntryGame';
import { CampaignBoard } from '../components/CampaignBoard';
import type { RoleId } from '../campaign';

type ViewMode = 'mission' | 'game' | 'campaign';

export function ChildDashboard() {
  const { theme, mission, selectChoice, log, skillScores, interest, setInterest, childName } = useApp();
  const [chosen, setChosen] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('campaign');
  const [gameResult, setGameResult] = useState<{ score: number; avgRt: number } | null>(null);
  const [playerRole, setPlayerRole] = useState<RoleId | null>(null);
  const [showEntryGame, setShowEntryGame] = useState(true);

  if (!theme || !mission) return null;

  const handleChoice = (choice: typeof mission.choices[0]) => {
    setSelectedChoice(choice.id); setChosen(true);
    selectChoice(choice);
    setTimeout(() => { setChosen(false); setSelectedChoice(null); }, 2500);
  };

  // Entry game takes over the whole screen
  if (viewMode === 'campaign' && showEntryGame && !playerRole) {
    return <EntryGame childName={childName} onComplete={(role) => { setPlayerRole(role); setShowEntryGame(false); }} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 pb-12">
      {/* Mode Tabs — redesigned */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { id: 'campaign' as const, label: '⚔️ Кампания', desc: viewMode === 'campaign' && playerRole ? `Ты — ${playerRole}` : 'Совместная игра' },
          { id: 'mission' as const, label: '📖 Квест', desc: 'Сюжетная миссия' },
          { id: 'game' as const, label: '🎯 Тренировка', desc: 'Мини-игры' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setViewMode(tab.id)}
            className={`shrink-0 px-5 py-3 rounded-3xl text-sm font-bold transition text-left relative overflow-hidden ${
              viewMode === tab.id
                ? 'bg-[#5D5FEF] text-white shadow-xl shadow-[#5D5FEF]/25'
                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
            }`}>
            <div className="relative z-10">{tab.label}</div>
            <div className="text-[10px] opacity-60 font-normal relative z-10">{tab.desc}</div>
            {viewMode === tab.id && (
              <motion.div layoutId="tab-bg" className="absolute inset-0 bg-[#5D5FEF]" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
            )}
          </button>
        ))}
      </div>

      {/* CAMPAIGN MODE */}
      {viewMode === 'campaign' && playerRole && (
        <CampaignBoard playerRole={playerRole}
          onComplete={(score) => { setShowEntryGame(true); setPlayerRole(null); }}
        />
      )}

      {/* GAME MODE */}
      {viewMode === 'game' && (
        <div className="max-w-lg mx-auto">
          <FocusGame
            onComplete={(score, maxScore, metrics) => {
              setGameResult({ score, avgRt: metrics.avgRt });
              selectChoice({ id: 'A', text: '', metricTracked: 'focus_attention', feedback: `Фокус-реактор: ${score}/${maxScore}, RT ${metrics.avgRt}ms` });
            }}
            onBack={() => setViewMode('mission')}
          />
        </div>
      )}

      {/* MISSION MODE */}
      {viewMode === 'mission' && (
        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div key={mission.questTitle} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="md:col-span-2 bg-white p-6 md:p-8 rounded-[36px] bento-shadow border border-gray-100 flex flex-col justify-between relative overflow-hidden">
            {/* Decorative blob */}
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-[#5D5FEF]/5 blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="px-4 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: theme.badgeColor }}>{theme.name}</span>
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D2C4] opacity-75" /><span className="relative inline-flex rounded-full h-3 w-3 bg-[#00D2C4]" /></span>
                  <span className="text-xs font-bold text-[#00D2C4] uppercase tracking-wider bg-[#00D2C4]/5 px-3 py-1 rounded-full">Скрытый анализ</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1F2937]">{mission.questTitle}</h3>
              <div className="text-base text-gray-600 mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: mission.questText }} />
            </div>
            <div className="space-y-3 relative z-10">
              {mission.choices.map(choice => (
                <motion.button key={choice.id} whileTap={{ scale: 0.98 }}
                  onClick={() => !chosen && handleChoice(choice)} disabled={chosen}
                  className={`w-full text-left p-4 rounded-3xl border-2 transition-all flex items-start gap-3 font-medium text-sm text-gray-700 ${
                    selectedChoice === choice.id ? 'bg-[#5D5FEF]/10 border-[#5D5FEF] shadow-lg shadow-[#5D5FEF]/10' :
                    chosen ? 'bg-gray-50 border-gray-100 opacity-50' :
                    'bg-gray-50 border-transparent hover:bg-indigo-50 hover:border-[#5D5FEF]/40 hover:shadow-md'
                  }`}>
                  <span className={`font-bold px-3 py-1 rounded-xl text-sm shadow-sm transition shrink-0 ${
                    selectedChoice === choice.id ? 'bg-[#5D5FEF] text-white' : 'bg-white text-[#5D5FEF]'
                  }`}>{choice.id}</span>
                  <span>{choice.text}</span>
                </motion.button>
              ))}
            </div>
            {chosen && selectedChoice && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-gradient-to-r from-[#00D2C4]/10 to-[#5D5FEF]/5 border border-[#00D2C4]/30 rounded-2xl relative z-10">
                <p className="text-sm font-bold text-[#00D2C4]">{mission.choices.find(c => c.id === selectedChoice)?.feedback}</p>
                <button onClick={() => interest && setInterest(interest)} className="mt-2 text-xs font-bold text-[#5D5FEF] underline">Попробовать ещё раз →</button>
              </motion.div>
            )}
          </motion.div>

          <div className="space-y-6">
            {/* NPC Card — decorative blob version */}
            <div className="bg-white p-6 rounded-[36px] bento-shadow border border-gray-100 text-center relative overflow-hidden">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-gradient-to-b from-[#5D5FEF]/10 to-transparent blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="text-6xl mb-3 animate-float drop-shadow-lg">{theme.npcEmoji}</div>
                <h4 className="font-bold text-lg">{theme.npcName}</h4>
                <p className="text-xs font-bold uppercase tracking-wider text-[#00D2C4] mb-3">Твой наставник</p>
                <p className="text-sm text-gray-500 italic bg-gradient-to-br from-gray-50 to-[#5D5FEF]/5 p-3 rounded-2xl">«{mission.npcPhrase}»</p>
              </div>
            </div>

            {/* Skill categories */}
            <div className="bg-white p-5 rounded-[36px] bento-shadow border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#00D2C4]/5 blur-2xl pointer-events-none" />
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 relative z-10">
                {Object.keys(SKILL_CATEGORIES).length} категорий · 20+ метанавыков
              </h4>
              <div className="space-y-4 relative z-10">
                {Object.entries(SKILL_CATEGORIES).map(([catKey, cat]) => {
                  const avg = Object.keys(cat.skills).reduce((s, k) => s + (skillScores[k] || 30), 0) / Object.keys(cat.skills).length;
                  const color = CATEGORY_COLORS[catKey] || '#5D5FEF';
                  return (
                    <div key={catKey}>
                      <div className="flex justify-between text-xs font-semibold mb-1"><span>{cat.icon} {cat.name}</span><span className="text-[10px] text-gray-400">{Math.round(avg)}%</span></div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: color, width: `${avg}%` }} initial={{ width: 0 }} animate={{ width: `${avg}%` }} transition={{ duration: 0.8 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stealth Log — glass morphism */}
            <div className="bg-gray-900/95 backdrop-blur text-gray-300 p-5 rounded-[36px] bento-shadow text-xs font-mono relative overflow-hidden border border-gray-800">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#00D2C4]/10 blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-2 relative z-10">
                <span className="text-[#00D2C4] font-bold">STEALTH ASSESSMENT LOG</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-mint" />
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto relative z-10">
                {log.length === 0 ? <p className="text-gray-500">// Ожидание первого действия...</p> :
                  log.map((entry, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="border-l-2 border-[#00D2C4] pl-2">
                      <p className="text-white font-semibold">[{entry.timestamp}] {entry.choiceId}</p>
                      <p className="text-gray-400">&gt; <span className="text-amber-400">{entry.metric}</span> | RT: {entry.rt}ms</p>
                      <p className="text-[#00D2C4]">&gt; {entry.feedback}</p>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
