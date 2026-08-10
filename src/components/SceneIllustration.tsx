import { motion } from 'framer-motion';
import type { ChallengeType } from '../campaign';

interface Props {
  type: ChallengeType | 'portal';
  className?: string;
}

export function SceneIllustration({ type, className = '' }: Props) {
  return (
    <div className={`relative overflow-hidden rounded-3xl ${className}`}>
      {type === 'portal' && <PortalScene />}
      {type === 'logic' && <AncientGateScene />}
      {type === 'social' && <ForestSpiritScene />}
      {type === 'creative' && <BrokenBridgeScene />}
      {type === 'strategy' && <CrossroadsScene />}
    </div>
  );
}

/* ───── PORTAL ───── */
function PortalScene() {
  return (
    <div className="relative h-56 bg-gradient-to-b from-indigo-950 via-purple-950 to-violet-900 flex items-center justify-center overflow-hidden">
      {/* Stars */}
      {[...Array(30)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white"
          style={{ width: 1 + Math.random() * 3, height: 1 + Math.random() * 3, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }} />
      ))}
      {/* Portal ring */}
      <motion.div className="absolute w-32 h-48 border-[3px] border-cyan-400/60 rounded-full"
        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, scale: { duration: 3, repeat: Infinity } }}
        style={{ boxShadow: '0 0 60px rgba(0,210,196,0.4), 0 0 120px rgba(93,95,239,0.3), inset 0 0 40px rgba(0,210,196,0.15)' }} />
      {/* Inner glow */}
      <motion.div className="absolute w-24 h-40 rounded-full bg-gradient-to-b from-cyan-300/30 via-purple-400/20 to-transparent"
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }} />
      {/* Particles flowing in */}
      {[...Array(15)].map((_, i) => (
        <motion.div key={`p${i}`} className="absolute w-1.5 h-1.5 rounded-full bg-cyan-300"
          style={{ left: `${40 + Math.random() * 20}%`, top: `${70 + Math.random() * 20}%` }}
          animate={{ y: [-20, -120], x: [0, (Math.random() - 0.5) * 30], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }} />
      ))}
      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
    </div>
  );
}

/* ───── ANCIENT GATE ───── */
function AncientGateScene() {
  return (
    <div className="relative h-56 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center overflow-hidden">
      {/* Fog layers */}
      <motion.div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-300/10 to-transparent"
        animate={{ x: [-10, 10, -10] }} transition={{ duration: 8, repeat: Infinity }} />
      {/* Stone pillars */}
      <div className="absolute left-[20%] bottom-0 w-8 h-40 bg-gradient-to-t from-slate-600 via-slate-500 to-slate-400 rounded-t-lg"
        style={{ boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.3)' }} />
      <div className="absolute right-[20%] bottom-0 w-8 h-40 bg-gradient-to-t from-slate-600 via-slate-500 to-slate-400 rounded-t-lg"
        style={{ boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.3)' }} />
      {/* Arch */}
      <div className="absolute top-8 left-[18%] right-[18%] h-6 bg-gradient-to-b from-slate-400 to-slate-500 rounded-t-full"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
      {/* Runes on pillars */}
      {[...Array(4)].map((_, i) => (
        <motion.div key={i} className="absolute w-2 h-3 bg-cyan-400/60 rounded-sm"
          style={{ left: i < 2 ? '22%' : '78%', top: `${30 + i * 25}%` }}
          animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2 + i, repeat: Infinity }} />
      ))}
      {/* Glow between pillars */}
      <motion.div className="absolute bottom-4 w-20 h-24 bg-gradient-to-t from-cyan-400/15 to-transparent rounded-full"
        animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
    </div>
  );
}

/* ───── FOREST SPIRIT ───── */
function ForestSpiritScene() {
  return (
    <div className="relative h-56 bg-gradient-to-b from-emerald-950 via-teal-900 to-green-950 flex items-center justify-center overflow-hidden">
      {/* Trees */}
      {[15, 35, 55, 75, 90].map((x, i) => (
        <div key={i} className="absolute bottom-0" style={{ left: `${x}%` }}>
          <div className="w-4 h-32 bg-gradient-to-t from-emerald-900 to-emerald-700 rounded-t-full mx-auto" />
          <div className="w-20 h-20 bg-gradient-to-b from-emerald-600 to-emerald-800 rounded-full -mt-16 -ml-8 opacity-80" />
        </div>
      ))}
      {/* Spirit glow */}
      <motion.div className="absolute w-24 h-24 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,138,101,0.4) 0%, rgba(255,138,101,0.1) 50%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }} />
      {/* Fireflies */}
      {[...Array(12)].map((_, i) => (
        <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-amber-300/80"
          style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 70}%` }}
          animate={{ y: [0, -8, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }} />
      ))}
      {/* Ground moss */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-emerald-800/40 to-transparent" />
    </div>
  );
}

/* ───── BROKEN BRIDGE ───── */
function BrokenBridgeScene() {
  return (
    <div className="relative h-56 bg-gradient-to-b from-amber-950 via-orange-900 to-yellow-950 flex items-center justify-center overflow-hidden">
      {/* Canyon walls */}
      <div className="absolute left-0 bottom-0 w-[40%] h-full bg-gradient-to-t from-stone-800 via-stone-700 to-stone-600"
        style={{ clipPath: 'polygon(0 100%, 100% 100%, 80% 40%, 0 60%)' }} />
      <div className="absolute right-0 bottom-0 w-[40%] h-full bg-gradient-to-t from-stone-800 via-stone-700 to-stone-600"
        style={{ clipPath: 'polygon(100% 100%, 0 100%, 20% 30%, 100% 50%)' }} />
      {/* Broken bridge planks */}
      <div className="absolute left-[30%] top-[45%] w-16 h-2 bg-amber-700 rotate-[-15deg] rounded" />
      <div className="absolute left-[38%] top-[43%] w-12 h-2 bg-amber-600 rotate-[-10deg] rounded" />
      {/* Rope */}
      <div className="absolute left-[30%] top-[42%] w-10 h-0.5 bg-amber-400/60 -rotate-[20deg]" />
      {/* Depth glow */}
      <div className="absolute bottom-0 left-[30%] right-[30%] h-32 bg-gradient-to-t from-orange-400/10 to-transparent" />
      {/* Vines hanging */}
      {[28, 34, 65, 72].map((x, i) => (
        <motion.div key={i} className="absolute w-0.5 bg-green-700/50" style={{ left: `${x}%`, top: 0, height: 40 + i * 15 }}
          animate={{ rotate: [0, 2, -1, 0] }} transition={{ duration: 4 + i, repeat: Infinity }} />
      ))}
    </div>
  );
}

/* ───── CROSSROADS ───── */
function CrossroadsScene() {
  return (
    <div className="relative h-56 bg-gradient-to-b from-blue-950 via-indigo-900 to-slate-900 flex items-center justify-center overflow-hidden">
      {/* Sky gradient */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-indigo-800/30 to-transparent" />
      {/* Three paths */}
      <div className="absolute bottom-0 left-[15%] w-3 h-32 bg-gradient-to-t from-amber-700/60 via-amber-600/30 to-transparent rotate-[-25deg] origin-bottom"
        style={{ clipPath: 'polygon(30% 0, 70% 0, 100% 100%, 0 100%)' }} />
      <div className="absolute bottom-0 left-[45%] w-3 h-40 bg-gradient-to-t from-slate-500/40 to-transparent"
        style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)' }} />
      <div className="absolute bottom-0 right-[15%] w-3 h-28 bg-gradient-to-t from-emerald-600/40 via-emerald-500/20 to-transparent rotate-[20deg] origin-bottom"
        style={{ clipPath: 'polygon(30% 0, 70% 0, 100% 100%, 0 100%)' }} />
      {/* Signpost */}
      <div className="absolute bottom-8 left-[44%] w-1 h-16 bg-amber-800" />
      <div className="absolute bottom-20 left-[40%] w-12 h-5 bg-amber-700 rounded-sm flex items-center justify-center text-[8px] text-amber-200 font-bold">← → ?</div>
      {/* Path markers */}
      {['safe', 'risk', 'unknown'].map((label, i) => (
        <div key={label} className="absolute bottom-2 text-[9px] font-bold text-white/40"
          style={{ left: `${15 + i * 33}%` }}>{['🛡️', '⚡', '💡'][i]}</div>
      ))}
    </div>
  );
}
