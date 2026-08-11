import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../store';
import { Hub } from '../components/Hub';
import { EntryGame } from '../components/EntryGame';
import { CampaignBoard } from '../components/CampaignBoard';
import { ChallengeGame } from '../components/ChallengeGame';
import { FocusGame } from '../components/games/FocusGame';
import { Reflection } from '../components/Reflection';
import { MascotAvatar, MASCOTS } from '../components/MascotSystem';
import type { MascotId } from '../components/MascotSystem';
import type { RoleId, ChallengeType } from '../campaign';

type ViewMode = 'hub' | 'campaign' | 'game' | 'reflection' | 'mascotQuest';

export function ChildDashboard() {
  const { selectChoice, childName } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('hub');
  const [playerRole, setPlayerRole] = useState<RoleId | null>(null);
  const [showEntryGame, setShowEntryGame] = useState(true);
  const [insights, setInsights] = useState<{ id: string; date: string; emotion: string; discovery: string; skill: string }[]>([]);

  // Mascot quest state
  const [mascotQuest, setMascotQuest] = useState<{
    mascot: MascotId; gameType: ChallengeType; quest: { title: string; intro: string };
  } | null>(null);

  const handleExplore = (mascot: MascotId, gameType: ChallengeType, quest: { title: string; intro: string }) => {
    setMascotQuest({ mascot, gameType, quest });
    setViewMode('mascotQuest');
  };

  const handleQuestComplete = (_success: boolean, feedback: string) => {
    selectChoice({ id: 'A', text: '', metricTracked: 'focus_attention', feedback });
    // Go to reflection after quest
    setViewMode('reflection');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 pb-12">
      {/* Navigation tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { id: 'hub' as const, label: '🌍 Мир', desc: 'Хаб' },
          { id: 'campaign' as const, label: '⚔️ Поход', desc: playerRole ? `Ты — ${playerRole}` : 'Команда' },
          { id: 'game' as const, label: '🎯 Тренировка', desc: 'Игры' },
          { id: 'reflection' as const, label: '💎 Дневник', desc: `${insights.length}` },
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
      {viewMode === 'hub' && <Hub onExplore={handleExplore} />}

      {/* MASCOT QUEST */}
      {viewMode === 'mascotQuest' && mascotQuest && (
        <div className="max-w-lg mx-auto">
          {/* Quest intro header */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 text-center">
            <MascotAvatar mascot={mascotQuest.mascot} size="lg" />
            <h3 className="text-xl font-bold mt-3">{mascotQuest.quest.title}</h3>
            <p className="text-gray-500 text-sm mt-1">{mascotQuest.quest.intro}</p>
          </motion.div>

          <ChallengeGame
            challengeType={mascotQuest.gameType}
            npcName={MASCOTS[mascotQuest.mascot].name}
            npcEmoji={MASCOTS[mascotQuest.mascot].emoji}
            onResult={(success, feedback) => handleQuestComplete(success, feedback)}
          />

          <button onClick={() => setViewMode('hub')}
            className="w-full mt-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition">
            ← Вернуться на карту
          </button>
        </div>
      )}

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
            context={{ gameType: mascotQuest?.quest.title || 'Приключение', score: 0, skillCategory: mascotQuest ? MASCOTS[mascotQuest.mascot].category : 'Саморегуляция' }}
            onComplete={(insight) => setInsights(prev => [insight, ...prev])}
          />
          {insights.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto mt-8">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Твоя коллекция инсайтов ({insights.length})</h4>
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
              <button onClick={() => setViewMode('hub')}
                className="w-full mt-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition">
                ← На карту
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
