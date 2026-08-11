import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../store';
import { Hub } from '../components/Hub';
import { EntryGame } from '../components/EntryGame';
import { CampaignBoard } from '../components/CampaignBoard';
import { FocusGame } from '../components/games/FocusGame';
import { Reflection } from '../components/Reflection';
import type { RoleId } from '../campaign';

type ViewMode = 'hub' | 'campaign' | 'game' | 'reflection';

export function ChildDashboard() {
  const { selectChoice, childName } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('hub');
  const [playerRole, setPlayerRole] = useState<RoleId | null>(null);
  const [showEntryGame, setShowEntryGame] = useState(true);
  const [insights, setInsights] = useState<{ id: string; date: string; emotion: string; discovery: string; skill: string }[]>([]);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 pb-12">
      {/* Navigation tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { id: 'hub' as const, label: '🌍 Мир', desc: 'Хаб' },
          { id: 'campaign' as const, label: '⚔️ Поход', desc: playerRole ? `Ты — ${playerRole}` : 'Кампания' },
          { id: 'game' as const, label: '🎯 Тренировка', desc: 'Игры' },
          { id: 'reflection' as const, label: '💎 Дневник', desc: `${insights.length} инсайтов` },
        ].map(tab => (
          <button key={tab.id} onClick={() => setViewMode(tab.id)}
            className={`shrink-0 px-4 py-2.5 rounded-3xl text-sm font-bold transition ${
              viewMode === tab.id
                ? 'bg-[#5D5FEF] text-white shadow-xl shadow-[#5D5FEF]/25'
                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
            }`}>
            <span>{tab.label}</span>
            <span className="block text-[10px] opacity-60 font-normal">{tab.desc}</span>
          </button>
        ))}
      </div>

      {/* HUB */}
      {viewMode === 'hub' && <Hub />}

      {/* CAMPAIGN */}
      {viewMode === 'campaign' && (
        showEntryGame && !playerRole ? (
          <EntryGame childName={childName} onComplete={(role) => { setPlayerRole(role); setShowEntryGame(false); }} />
        ) : playerRole ? (
          <CampaignBoard playerRole={playerRole}
            onComplete={() => { setShowEntryGame(true); setPlayerRole(null); }} />
        ) : null
      )}

      {/* MINI-GAME */}
      {viewMode === 'game' && (
        <div className="max-w-lg mx-auto">
          <FocusGame
            onComplete={(score, maxScore, metrics) => {
              selectChoice({ id: 'A', text: '', metricTracked: 'focus_attention', feedback: `Фокус-реактор: ${score}/${maxScore}, RT ${metrics.avgRt}ms` });
            }}
            onBack={() => setViewMode('hub')}
          />
        </div>
      )}

      {/* REFLECTION */}
      {viewMode === 'reflection' && (
        <>
          <Reflection
            context={{ gameType: 'Фокус-реактор', score: 0, skillCategory: 'Саморегуляция' }}
            onComplete={(insight) => setInsights(prev => [insight, ...prev])}
          />
          {/* Insight collection */}
          {insights.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto mt-8">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Твоя коллекция инсайтов</h4>
              <div className="space-y-3">
                {insights.slice(0, 10).map(insight => (
                  <motion.div key={insight.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-4 bento-shadow border border-gray-100 flex items-start gap-3">
                    <span className="text-2xl shrink-0">{insight.emotion === 'Радость' ? '😊' : insight.emotion === 'Гордость' ? '💪' : '💎'}</span>
                    <div>
                      <p className="text-sm font-bold">«{insight.discovery}»</p>
                      <span className="text-[10px] text-gray-400">{insight.date} · {insight.skill}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
