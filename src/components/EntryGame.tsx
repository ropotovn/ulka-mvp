import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROLES } from '../campaign';
import type { RoleId } from '../campaign';
import { SceneIllustration } from './SceneIllustration';

interface Props {
  onComplete: (roleId: RoleId) => void;
  childName: string;
}

// ───── SCENES ─────
interface Scene {
  id: number;
  title: string;
  text: string;
  background: string;
  choices: { text: string; affinities: Partial<Record<RoleId, number>>; emoji: string }[];
}

const SCENES: Scene[] = [
  {
    id: 1,
    title: 'Портал открылся',
    text: 'Ты стоишь перед сияющей аркой. Из неё доносятся голоса — кто-то просит о помощи. Что ты сделаешь?',
    background: 'from-indigo-900 via-purple-900 to-violet-800',
    choices: [
      { text: 'Сразу шагну в портал — нужно спешить!', affinities: { leader: 2, strategist: 1 }, emoji: '⚡' },
      { text: 'Сначала осмотрюсь — что за символы вокруг арки?', affinities: { analyst: 2, strategist: 1 }, emoji: '🔍' },
      { text: 'Прислушаюсь к голосам — кто именно зовёт?', affinities: { empath: 2, leader: 1 }, emoji: '💜' },
    ],
  },
  {
    id: 2,
    title: 'Разрушенный мост',
    text: 'Ты в древнем лесу. Мост через пропасть рухнул. Рядом — поваленные деревья, лианы, камни. Что будешь делать?',
    background: 'from-emerald-900 via-teal-900 to-cyan-900',
    choices: [
      { text: 'Придумаю, как построить новый мост из подручных материалов.', affinities: { creator: 2, strategist: 1 }, emoji: '🎨' },
      { text: 'Изучу карту местности — может, есть обходной путь.', affinities: { analyst: 2, strategist: 1 }, emoji: '🗺️' },
      { text: 'Позову на помощь — вдруг здесь есть другие путешественники.', affinities: { leader: 2, empath: 1 }, emoji: '📣' },
    ],
  },
  {
    id: 3,
    title: 'Страж леса',
    text: 'Огромный каменный голем преградил путь. Он выглядит грозно, но в его глазах — грусть. Что скажешь?',
    background: 'from-amber-900 via-orange-900 to-red-900',
    choices: [
      { text: '«Кто тебя обидел? Расскажи, что случилось.»', affinities: { empath: 2, leader: 1 }, emoji: '🤗' },
      { text: '«У нас нет времени! Пропусти — или мы пройдём силой.»', affinities: { leader: 2, strategist: 1 }, emoji: '⚔️' },
      { text: '«Ты — часть древнего механизма? Я могу тебя починить.»', affinities: { creator: 2, analyst: 1 }, emoji: '🔧' },
    ],
  },
  {
    id: 4,
    title: 'Развилка судьбы',
    text: 'Три тропы ведут к Храму Знаний. Левая — безопасная, но длинная. Средняя — опасная, но быстрая. Правая — неизвестная. Твой выбор?',
    background: 'from-blue-900 via-indigo-900 to-purple-900',
    choices: [
      { text: 'Левая тропа — надёжность важнее скорости.', affinities: { strategist: 2, analyst: 1 }, emoji: '🛡️' },
      { text: 'Средняя — риск оправдан, если экономит время.', affinities: { leader: 2, creator: 1 }, emoji: '⚡' },
      { text: 'Правая — неизвестность манит! Там может быть клад.', affinities: { creator: 2, analyst: 1 }, emoji: '💡' },
    ],
  },
  {
    id: 5,
    title: 'Храм Знаний',
    text: 'Ты у цели. В центре зала — пять кристаллов. Один из них начинает светиться, resonating с твоей внутренней силой...',
    background: 'from-violet-900 via-fuchsia-900 to-pink-900',
    choices: [
      { text: 'Подойти и коснуться кристалла.', affinities: {}, emoji: '✨' },
    ],
  },
];

// Floating particles
function Particles({ count = 20, colors }: { count?: number; colors: string[] }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + Math.random() * 8,
            height: 4 + Math.random() * 8,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 60],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
}

export function EntryGame({ onComplete, childName }: Props) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [affinities, setAffinities] = useState<Record<RoleId, number>>({
    leader: 0, analyst: 0, empath: 0, creator: 0, strategist: 0,
  });
  const [revealedRole, setRevealedRole] = useState<RoleId | null>(null);
  const [showChoice, setShowChoice] = useState(false);

  const scene = SCENES[sceneIndex];

  useEffect(() => {
    setShowChoice(false);
    const timer = setTimeout(() => setShowChoice(true), 800);
    return () => clearTimeout(timer);
  }, [sceneIndex]);

  const handleChoice = (choiceAffinities: Partial<Record<RoleId, number>>) => {
    if (sceneIndex === SCENES.length - 1) {
      // Final scene — calculate role
      const newAff = { ...affinities };
      for (const [role, val] of Object.entries(choiceAffinities)) {
        newAff[role as RoleId] = (newAff[role as RoleId] || 0) + val;
      }
      const topRole = Object.entries(newAff).sort((a, b) => b[1] - a[1])[0][0] as RoleId;
      setRevealedRole(topRole);
      return;
    }

    setAffinities(prev => {
      const next = { ...prev };
      for (const [role, val] of Object.entries(choiceAffinities)) {
        next[role as RoleId] = (next[role as RoleId] || 0) + val;
      }
      return next;
    });
    setSceneIndex(prev => prev + 1);
  };

  // Role reveal screen
  if (revealedRole) {
    const role = ROLES.find(r => r.id === revealedRole)!;
    return (
      <div className={`min-h-screen bg-gradient-to-b ${scene.background} flex items-center justify-center relative overflow-hidden`}>
        <Particles colors={['#ffffff', role.color, '#FFD166', '#00D2C4']} count={40} />
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', duration: 1.5 }}
          className="text-center px-6 relative z-10">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl mb-6 drop-shadow-2xl">{role.emoji}</motion.div>
          <h2 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">{childName}, твоя роль —</h2>
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-xl" style={{ textShadow: `0 0 40px ${role.color}` }}>{role.name}</h1>
          <p className="text-white/80 max-w-md mx-auto mb-3 text-lg">{role.description}</p>
          <div className="bg-white/10 backdrop-blur rounded-3xl p-4 max-w-sm mx-auto mb-8 border border-white/20">
            <p className="text-white/60 text-sm mb-1">Твоя способность:</p>
            <p className="text-white font-bold">⚡ {role.powerName}</p>
            <p className="text-white/70 text-sm mt-1">{role.powerDescription}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => onComplete(revealedRole)}
            className="px-10 py-4 rounded-3xl text-white font-bold text-lg shadow-2xl transition"
            style={{ backgroundColor: role.color }}>
            Войти в мир Улки →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${scene.background} flex flex-col items-center justify-center relative overflow-hidden`}>
      <Particles colors={['#ffffff', '#FFD166', '#00D2C4', '#5D5FEF']} count={25} />

      {/* Blob decorations */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

      {/* Scene content */}
      <div className="relative z-10 max-w-lg mx-auto px-6 text-center">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {SCENES.map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: i === sceneIndex ? 1.2 : 1 }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i < sceneIndex ? 'bg-white/60' : i === sceneIndex ? 'bg-white' : 'bg-white/20'}`}
            />
          ))}
        </div>

        {/* Scene illustration */}
        {scene.id === 1 && <SceneIllustration type="portal" className="mb-6 -mx-6" />}

        {/* Title */}
        <AnimatePresence mode="wait">
          <motion.div key={scene.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 0.6 }}
              className="text-5xl mb-6 drop-shadow-lg">
              {scene.id === 1 ? '🌀' : scene.id === 2 ? '🌉' : scene.id === 3 ? '🗿' : scene.id === 4 ? '⚡' : '💎'}
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">{scene.title}</h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">{scene.text}</p>
          </motion.div>
        </AnimatePresence>

        {/* Choices */}
        <AnimatePresence>
          {showChoice && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {scene.choices.map((choice, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.2)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleChoice(choice.affinities)}
                  className="w-full text-left p-4 bg-white/10 backdrop-blur border border-white/20 rounded-3xl text-white font-medium flex items-center gap-3 hover:bg-white/15 transition-all"
                >
                  <span className="text-2xl shrink-0">{choice.emoji}</span>
                  <span>{choice.text}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scene number */}
      <div className="absolute bottom-8 text-white/30 text-sm font-bold">
        Шаг {sceneIndex + 1} из {SCENES.length}
      </div>
    </div>
  );
}
