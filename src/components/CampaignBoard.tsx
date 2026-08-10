import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CAMPAIGNS, ROLES } from '../campaign';
import type { ChallengeNode, RoleId, ChallengeType } from '../campaign';
import { useApp } from '../store';
import { ChallengeGame } from './ChallengeGame';

interface Props {
  playerRole: RoleId;
  onComplete: (score: number) => void;
}

const CHALLENGE_ICONS: Record<ChallengeType, string> = {
  logic: '🧩', social: '💬', creative: '💡', strategy: '🗺️',
};

const CHALLENGE_COLORS: Record<ChallengeType, string> = {
  logic: '#00D2C4', social: '#FF8A65', creative: '#F59E0B', strategy: '#10B981',
};


export function CampaignBoard({ playerRole, onComplete }: Props) {
  const campaign = CAMPAIGNS[0];
  const [currentNode, setCurrentNode] = useState(0); // index of next uncompleted node
  const [completedNodes, setCompletedNodes] = useState<number[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<ChallengeNode | null>(null);
  const [teamMorale, setTeamMorale] = useState(100);
  const [showRolePower, setShowRolePower] = useState(false);
  const [powerUsed, setPowerUsed] = useState(false);
  const { selectChoice } = useApp();

  const playerRoleData = ROLES.find(r => r.id === playerRole)!;
  const allDone = completedNodes.length === campaign.nodes.length;

  // Simulate teammates
  const teammates = ROLES.filter(r => r.id !== playerRole).slice(0, 2 + Math.floor(Math.random() * 2));

  const openChallenge = (node: ChallengeNode) => {
    if (completedNodes.includes(node.id)) return;
    setActiveChallenge(node);
  };

  const handleChallengeResult = (success: boolean, feedback: string) => {
    if (success) {
      setCompletedNodes(prev => [...prev, activeChallenge!.id]);
      setCurrentNode(prev => prev + 1);
      selectChoice({
        id: 'A', text: '', metricTracked: 'focus_attention',
        feedback: `${activeChallenge!.title}: ${feedback}`,
      });
    } else {
      setTeamMorale(prev => Math.max(0, prev - 10));
      // Allow retry — just close the modal
    }
    setActiveChallenge(null);
  };

  const nodePositions = campaign.nodes;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Campaign header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">{campaign.title}</h2>
        <p className="text-gray-500">{campaign.theme}</p>
      </motion.div>

      {/* Team bar */}
      <div className="bg-white rounded-3xl p-4 bento-shadow border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Отряд «Искатели»</h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Боевой дух:</span>
            <div className="w-24 bg-gray-200 h-2 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full bg-[#00D2C4]" animate={{ width: `${teamMorale}%` }} />
            </div>
            <span className="text-xs font-bold text-[#00D2C4]">{teamMorale}%</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[playerRoleData, ...teammates].map((role, i) => (
            <div key={role.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold ${i === 0 ? 'bg-[#5D5FEF]/10 text-[#5D5FEF] border border-[#5D5FEF]/30' : 'bg-gray-50 text-gray-500'}`}>
              <span>{role.emoji}</span>
              <span>{role.name}</span>
              {i === 0 && <span className="text-[10px]">(ты)</span>}
            </div>
          ))}
        </div>
      </div>

      {/* GAME BOARD */}
      <div className="relative bg-white rounded-[36px] bento-shadow border border-gray-100 p-6 md:p-8 mb-6 overflow-hidden" style={{ minHeight: 420 }}>
        {/* Decorative blobs */}
        <div className="absolute -top-16 -left-16 w-48 h-48 blob-1 bg-[#5D5FEF]/5 pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 blob-2 bg-[#00D2C4]/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 blob-3 bg-[#FF8A65]/5 pointer-events-none" />
        {/* SVG paths between nodes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {nodePositions.slice(0, -1).map((node, i) => {
            const next = nodePositions[i + 1];
            const x1 = `${node.x}%`; const y1 = `${node.y}%`;
            const x2 = `${next.x}%`; const y2 = `${next.y}%`;
            const done = completedNodes.includes(node.id);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={done ? '#00D2C4' : '#E5E7EB'} strokeWidth={done ? 3 : 2}
                strokeDasharray={done ? 'none' : '6 4'} opacity={done ? 1 : 0.5} />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodePositions.map((node, i) => {
          const done = completedNodes.includes(node.id);
          const isCurrent = i === currentNode && !done;
          const isMySpecialty = node.bestRole === playerRole;

          return (
            <motion.button
              key={node.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.15, type: 'spring' }}
              onClick={() => isCurrent && openChallenge(node)}
              disabled={!isCurrent}
              className={`absolute rounded-2xl flex flex-col items-center justify-center p-2 transition-all ${isCurrent ? 'cursor-pointer hover:scale-110' : ''}`}
              style={{
                left: `${node.x}%`, top: `${node.y}%`,
                transform: 'translate(-50%,-50%)',
                width: 72, height: 72,
                zIndex: 10,
                backgroundColor: done ? '#00D2C4' : isCurrent ? '#FFFFFF' : '#F3F4F6',
                border: done ? '3px solid #00D2C4' : isCurrent ? `3px solid ${CHALLENGE_COLORS[node.type]}` : '2px dashed #D1D5DB',
                boxShadow: isCurrent ? `0 0 20px ${CHALLENGE_COLORS[node.type]}33` : done ? '0 2px 8px rgba(0,210,196,0.2)' : 'none',
              }}
            >
              {done ? (
                <span className="text-2xl">✅</span>
              ) : (
                <>
                  <span className="text-xl">{CHALLENGE_ICONS[node.type]}</span>
                  <span className="text-[9px] font-bold text-gray-400 mt-0.5">{isCurrent ? (isMySpecialty ? '⭐ Твоё' : '👥') : '🔒'}</span>
                </>
              )}
            </motion.button>
          );
        })}

        {/* Victory state */}
        {allDone && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-[32px]" style={{ zIndex: 20 }}>
            <div className="text-center">
              <div className="text-7xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-2">Кампания пройдена!</h3>
              <p className="text-gray-500 mb-4">Отряд «Искатели» справился со всеми испытаниями.</p>
              <button onClick={() => onComplete(completedNodes.length * 20)} className="px-8 py-3 bg-[#5D5FEF] text-white font-bold rounded-3xl hover:shadow-lg transition">
                Завершить →
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Power button */}
      {!allDone && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setShowRolePower(true)}
            disabled={powerUsed}
            className={`px-5 py-3 rounded-2xl text-sm font-bold transition ${powerUsed ? 'bg-gray-100 text-gray-400' : 'text-white hover:shadow-lg'}`}
            style={{ backgroundColor: powerUsed ? undefined : playerRoleData.color }}
          >
            ⚡ {playerRoleData.powerName} {powerUsed && '(использовано)'}
          </button>
          {showRolePower && !powerUsed && (
            <button onClick={() => { setPowerUsed(true); setShowRolePower(false); setTeamMorale(prev => Math.min(100, prev + 20)); }}
              className="px-5 py-3 bg-white border-2 rounded-2xl text-sm font-bold hover:bg-gray-50 transition"
              style={{ borderColor: playerRoleData.color, color: playerRoleData.color }}>
              Использовать: {playerRoleData.powerDescription}
            </button>
          )}
        </div>
      )}

      {/* Challenge Modal — AI-powered freeform */}
      <AnimatePresence>
        {activeChallenge && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setActiveChallenge(null)}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg">
              <ChallengeGame
                challengeType={activeChallenge.type}
                npcName={ROLES.find(r => r.id === activeChallenge.bestRole)?.name || 'Наставник'}
                npcEmoji={ROLES.find(r => r.id === activeChallenge.bestRole)?.emoji || '🤖'}
                onResult={(success, feedback) => handleChallengeResult(success, feedback)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
