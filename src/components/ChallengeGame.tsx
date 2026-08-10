import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChallengeType } from '../campaign';
import { SceneIllustration } from './SceneIllustration';

interface Props {
  challengeType: ChallengeType;
  npcName: string;
  npcEmoji: string;
  onResult: (success: boolean, _feedback: string) => void;
}

/* ══════════════════════════════════════════════
   CHALLENGE GAME — actual mini-game per type
   ══════════════════════════════════════════════ */
export function ChallengeGame({ challengeType, npcName, npcEmoji, onResult }: Props) {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [combo, setCombo] = useState(0);
  const totalRounds = challengeType === 'logic' ? 5 : challengeType === 'strategy' ? 1 : 4;

  useEffect(() => {
    const t = setTimeout(() => setPhase('playing'), 2000);
    return () => clearTimeout(t);
  }, []);

  const handleWin = useCallback((msg: string) => {
    const bonus = combo > 2 ? combo * 5 : 0;
    setScore(s => s + 100 + bonus);
    setCombo(c => c + 1);
    if (round + 1 >= totalRounds) {
      setTimeout(() => {
        setPhase('result');
        onResult(true, msg);
      }, 1200);
    } else {
      setTimeout(() => { setRound((r: number) => r + 1); }, 1200);
    }
  }, [round, combo, totalRounds, onResult]);

  const handleLose = useCallback((msg: string) => {
    setCombo(0);
    if (round + 1 >= totalRounds) {
      setTimeout(() => {
        setPhase('result');
        const finalScore = score;
        onResult(finalScore > 100, msg);
      }, 1200);
    } else {
      setTimeout(() => { setRound((r: number) => r + 1); }, 1200);
    }
  }, [round, score, totalRounds, onResult]);

  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl max-w-lg w-full">
      <SceneIllustration type={challengeType} />

      {/* HUD */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-lg">{npcEmoji}</span>
          <span className="text-sm font-bold">{npcName}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">Раунд {round + 1}/{totalRounds}</span>
          <div className="flex items-center gap-1">
            <span className="text-amber-500 text-sm">⭐</span>
            <span className="text-sm font-bold text-amber-500">{score}</span>
          </div>
          {combo > 1 && (
            <motion.span key={combo} initial={{ scale: 2 }} animate={{ scale: 1 }}
              className="text-xs font-bold text-[#FF8A65]">x{combo}!</motion.span>
          )}
        </div>
      </div>

      {/* GAME AREA */}
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-6 text-center">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="text-5xl mb-4">
              {challengeType === 'logic' ? '🧩' : challengeType === 'social' ? '💬' : challengeType === 'creative' ? '🔧' : '🗺️'}
            </motion.div>
            <p className="text-gray-500 text-sm animate-pulse">Приготовься...</p>
          </motion.div>
        )}

        {phase === 'playing' && (
          <motion.div key={round} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
            {challengeType === 'logic' && <LogicGame round={round} onWin={handleWin} onLose={handleLose}  />}
            {challengeType === 'social' && <SocialGame round={round} onWin={handleWin} onLose={handleLose}  />}
            {challengeType === 'creative' && <CreativeGame round={round} onWin={handleWin} onLose={handleLose}  />}
            {challengeType === 'strategy' && <StrategyGame onWin={handleWin} onLose={handleLose}  />}
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="p-6 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
              className="text-6xl mb-3">{score >= 300 ? '🏆' : score >= 150 ? '🌟' : '💪'}</motion.div>
            <h3 className="text-xl font-bold mb-1">{score >= 300 ? 'Великолепно!' : score >= 150 ? 'Хорошая работа!' : 'Ты старался!'}</h3>
            <p className="text-gray-500 text-sm mb-4">Заработано ⭐{score} очков</p>
            <motion.div className="flex justify-center gap-1">
              {[...Array(Math.min(3, Math.ceil(score / 150)))].map((_, i) => (
                <motion.span key={i} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4 + i * 0.2, type: 'spring' }} className="text-2xl">⭐</motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════
   LOGIC GAME — Pattern Matching
   ══════════════════════════════════════════════ */
const RUNE_SEQUENCES = [
  { pattern: ['🔮', '💎', '🔮', '💎', '?'], answer: '🔮', hint: 'Чередование' },
  { pattern: ['🌙', '⭐', '☀️', '🌙', '?'], answer: '⭐', hint: 'Цикл: ночь-звезда-день-ночь-?' },
  { pattern: ['🔥', '💧', '🌿', '🔥', '?'], answer: '💧', hint: 'Огонь-вода-трава-огонь-?' },
  { pattern: ['🦊', '🐰', '🦊', '🐰', '?'], answer: '🦊', hint: 'Лис-заяц-лис-заяц-?' },
  { pattern: ['⬆️', '➡️', '⬇️', '⬅️', '?'], answer: '⬆️', hint: 'Движение по кругу' },
];

function LogicGame({ round, onWin, onLose }: { round: number; onWin: (m: string) => void; onLose: (m: string) => void }) {
  const seq = RUNE_SEQUENCES[round % RUNE_SEQUENCES.length];
  const options = ['🔮', '💎', '⭐', '🔥', '💧', '🦊', '🐰', '⬆️'].filter(o => o !== seq.answer).slice(0, 2);
  const allOptions = [seq.answer, ...options].sort(() => Math.random() - 0.5);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const pick = (s: string) => {
    if (selected) return;
    setSelected(s);
    setShowFeedback(true);
    setTimeout(() => {
      s === seq.answer
        ? onWin('Нашёл закономерность! +100')
        : onLose('Не та руна... попробуй ещё!');
    }, 800);
  };

  return (
    <div className="p-5">
      <p className="text-sm text-gray-500 mb-2 text-center">Какая руна следующая?</p>
      <div className="flex justify-center gap-2 mb-5 text-3xl">
        {seq.pattern.map((r, i) => (
          <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${r === '?' ? 'border-2 border-dashed border-[#5D5FEF] bg-[#5D5FEF]/5' : 'bg-gray-50'}`}>
            {r}
          </motion.div>
        ))}
      </div>
      {!showFeedback && (
        <div className="grid grid-cols-3 gap-2">
          {allOptions.map(opt => (
            <motion.button key={opt} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}
              onClick={() => pick(opt)}
              className="p-4 bg-gray-50 hover:bg-[#5D5FEF]/10 rounded-2xl text-2xl transition border-2 border-transparent hover:border-[#5D5FEF]/30">
              {opt}
            </motion.button>
          ))}
        </div>
      )}
      {showFeedback && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          className={`text-center p-4 rounded-2xl ${selected === seq.answer ? 'bg-[#00D2C4]/10' : 'bg-red-50'}`}>
          <span className="text-2xl">{selected === seq.answer ? '✨' : '💫'}</span>
        </motion.div>
      )}
      {round === 0 && <p className="text-[10px] text-gray-400 text-center mt-3">Подсказка: {seq.hint}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════
   SOCIAL GAME — Emotion Dialogue
   ══════════════════════════════════════════════ */
const DIALOGUES = [
  { npc: 'Дух леса', text: 'Вы топчете мои корни. Зачем вы пришли?', mood: 'angry', correct: 'empathy', responses: [
    { text: '«Я слышу твою боль. Расскажи, что тревожит этот лес.»', type: 'empathy', emoji: '💜' },
    { text: '«У нас важная миссия. Пропусти — или мы пройдём силой.»', type: 'aggressive', emoji: '⚔️' },
    { text: '«Я могу предложить сделку: мы поможем лесу, а ты — нам.»', type: 'diplomatic', emoji: '🤝' },
  ]},
  { npc: 'Каменный голем', text: 'Я охраняю этот мост 300 лет. Никто не проходил.', mood: 'sad', correct: 'empathy', responses: [
    { text: '«300 лет в одиночестве... Хочешь, мы побудем с тобой немного?»', type: 'empathy', emoji: '💜' },
    { text: '«Отойди, каменюка! Нам некогда!»', type: 'aggressive', emoji: '👊' },
    { text: '«Ты отличный страж. Но мир изменился — может, пора и тебе?»', type: 'diplomatic', emoji: '🤝' },
  ]},
  { npc: 'Лесная фея', text: 'Я потеряла свой свет. Без него я не могу летать...', mood: 'sad', correct: 'empathy', responses: [
    { text: '«Давай поищем вместе! Расскажи, где ты видела его в последний раз.»', type: 'empathy', emoji: '💜' },
    { text: '«Извини, у нас нет времени на поиски.»', type: 'aggressive', emoji: '🏃' },
    { text: '«Если мы найдём твой свет, ты проведёшь нас через чащу?»', type: 'diplomatic', emoji: '🤝' },
  ]},
  { npc: 'Мудрый ворон', text: 'Я знаю путь. Но знания не даются бесплатно. Что ты предложишь?', mood: 'curious', correct: 'diplomatic', responses: [
    { text: '«Я расскажу тебе историю из моего мира — ты такой точно не слышал!»', type: 'diplomatic', emoji: '🤝' },
    { text: '«Рассказывай, или я найду дорогу сам!»', type: 'aggressive', emoji: '😤' },
    { text: '«Тебе, наверное, одиноко здесь. Давай просто поболтаем?»', type: 'empathy', emoji: '💜' },
  ]},
];

function SocialGame({ round, onWin, onLose }: { round: number; onWin: (m: string) => void; onLose: (m: string) => void;  }) {
  const d = DIALOGUES[round % DIALOGUES.length];
  const [responded, setResponded] = useState(false);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);

  const pick = (type: string) => {
    if (responded) return;
    setResponded(true);
    const isWin = type === d.correct;
    setResult(isWin ? 'win' : 'lose');
    setTimeout(() => {
      isWin ? onWin('Ты услышал собеседника! +100') : onLose('Не совсем то, что он хотел услышать...');
    }, 900);
  };

  return (
    <div className="p-5">
      {/* NPC mood indicator */}
      <div className="flex items-center gap-2 mb-4 justify-center">
        <span className="text-sm text-gray-400">Настроение:</span>
        <motion.div className={`h-2 rounded-full transition-all ${d.mood === 'angry' ? 'bg-red-400 w-4' : d.mood === 'sad' ? 'bg-blue-400 w-6' : 'bg-amber-400 w-10'}`} />
      </div>

      {/* NPC message */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{['🌳','🗿','🧚','🦉'][round % 4]}</span>
          <span className="font-bold text-sm">{d.npc}</span>
        </div>
        <p className="text-gray-700 text-sm">«{d.text}»</p>
      </div>

      {/* Response options */}
      {!responded && (
        <div className="space-y-2">
          {d.responses.map((r, i) => (
            <motion.button key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => pick(r.type)}
              className="w-full text-left p-3 bg-gray-50 hover:bg-[#FF8A65]/5 rounded-2xl text-sm transition flex items-center gap-3 border border-transparent hover:border-[#FF8A65]/20">
              <span className="text-xl shrink-0">{r.emoji}</span>
              <span>{r.text}</span>
            </motion.button>
          ))}
        </div>
      )}

      {responded && result && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          className={`text-center p-5 rounded-2xl ${result === 'win' ? 'bg-[#00D2C4]/10' : 'bg-[#FF8A65]/10'}`}>
          <motion.span animate={{ scale: [1, 1.3, 1] }} className="text-3xl">{result === 'win' ? '💜' : '😔'}</motion.span>
        </motion.div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   CREATIVE GAME — Bridge Builder
   ══════════════════════════════════════════════ */
const BUILD_CHALLENGES = [
  { task: 'Построй мост через пропасть', items: ['🪵 бревно', '🌿 лиана', '🪨 камень', '🧶 верёвка', '🍄 гриб'], correct: ['🪵 бревно', '🌿 лиана'], slots: 2 },
  { task: 'Собери набор для разведки', items: ['🔦 фонарь', '🗺️ карта', '🍕 пицца', '🧸 игрушка', '🪶 перо'], correct: ['🔦 фонарь', '🗺️ карта'], slots: 2 },
  { task: 'Что поможет пережить ночь в лесу?', items: ['🔥 костёр', '🛖 укрытие', '📱 телефон', '🎮 приставка', '🪞 зеркало'], correct: ['🔥 костёр', '🛖 укрытие'], slots: 2 },
  { task: 'Собери аптечку', items: ['🩹 бинт', '💊 лекарство', '🍬 конфета', '🎀 бантик', '🪥 щётка'], correct: ['🩹 бинт', '💊 лекарство'], slots: 2 },
];

function CreativeGame({ round, onWin, onLose }: { round: number; onWin: (m: string) => void; onLose: (m: string) => void;  }) {
  const challenge = BUILD_CHALLENGES[round % BUILD_CHALLENGES.length];
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);

  const toggle = (item: string) => {
    if (submitted) return;
    setSelected(prev => prev.includes(item) ? prev.filter(i => i !== item) : prev.length < challenge.slots ? [...prev, item] : prev);
  };

  const submit = () => {
    if (selected.length < challenge.slots) return;
    setSubmitted(true);
    const win = selected.every(s => challenge.correct.some(c => s.includes(c)));
    setResult(win ? 'win' : 'lose');
    setTimeout(() => {
      win ? onWin('Отличная сборка! +100') : onLose('Не все предметы подходят...');
    }, 900);
  };

  return (
    <div className="p-5">
      <p className="text-sm text-gray-500 text-center mb-4">{challenge.task}</p>
      <p className="text-xs text-gray-400 text-center mb-3">Выбери {challenge.slots} предмета</p>

      {/* Item grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {challenge.items.map(item => (
          <motion.button key={item} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
            onClick={() => toggle(item)}
            className={`p-3 rounded-2xl text-sm text-center transition border-2 ${
              selected.includes(item)
                ? 'bg-[#5D5FEF]/10 border-[#5D5FEF] shadow-lg shadow-[#5D5FEF]/10'
                : 'bg-gray-50 border-transparent hover:bg-gray-100'
            }`}>
            {item}
          </motion.button>
        ))}
      </div>

      {/* Selected slots */}
      <div className="flex gap-2 justify-center mb-4">
        {[...Array(challenge.slots)].map((_, i) => (
          <div key={i} className={`w-20 h-14 rounded-2xl border-2 border-dashed flex items-center justify-center text-xs transition ${
            selected[i] ? 'border-[#00D2C4] bg-[#00D2C4]/5' : 'border-gray-200'
          }`}>
            {selected[i] || '?'}
          </div>
        ))}
      </div>

      {!submitted && (
        <button onClick={submit} disabled={selected.length < challenge.slots}
          className="w-full py-3 bg-[#5D5FEF] text-white font-bold rounded-2xl disabled:opacity-30 transition hover:shadow-lg">
          Собрать!
        </button>
      )}

      {submitted && result && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          className={`text-center p-4 rounded-2xl ${result === 'win' ? 'bg-[#00D2C4]/10' : 'bg-[#FF8A65]/10'}`}>
          <span className="text-2xl">{result === 'win' ? '🔧✨' : '🤔'}</span>
        </motion.div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   STRATEGY GAME — Resource Allocation
   ══════════════════════════════════════════════ */
function StrategyGame({ onWin, onLose }: { onWin: (m: string) => void; onLose: (m: string) => void;  }) {
  const [energy, setEnergy] = useState(50);
  const [path, setPath] = useState<'safe' | 'risk' | 'treasure' | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const paths = [
    { id: 'safe' as const, name: 'Безопасный путь', cost: 20, risk: 0, reward: 60, icon: '🛡️', color: '#00D2C4' },
    { id: 'risk' as const, name: 'Опасный путь', cost: 15, risk: 40, reward: 120, icon: '⚡', color: '#FF8A65' },
    { id: 'treasure' as const, name: 'Путь сокровищ', cost: 35, risk: 25, reward: 200, icon: '💎', color: '#F59E0B' },
  ];

  const handleEnergy = (delta: number) => setEnergy(e => Math.min(100, Math.max(0, e + delta)));

  const submit = () => {
    if (!path || submitted) return;
    setSubmitted(true);
    const p = paths.find(pp => pp.id === path)!;
    const roll = Math.random() * 100;
    const success = roll > p.risk;

    if (success) {
      setResult(`Успех! +${p.reward} очков`);
      setTimeout(() => onWin(`Путь "${p.name}" — успех! +${p.reward}`), 1500);
    } else {
      setResult('Ловушка! Путь оказался опаснее...');
      setTimeout(() => onLose(`Путь "${p.name}" — провал!`), 1500);
    }
  };

  return (
    <div className="p-5">
      {/* Energy bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs mb-1"><span>⚡ Энергия</span><span className="font-bold">{energy}/100</span></div>
        <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#10B981]" animate={{ width: `${energy}%` }} />
        </div>
      </div>

      {!submitted && (
        <>
          <p className="text-sm text-gray-500 text-center mb-4">Выбери путь и потрать энергию на подготовку:</p>
          <div className="flex gap-2 justify-center mb-4">
            {[10, 20, 30].map(n => (
              <button key={n} onClick={() => handleEnergy(n)}
                className="px-4 py-2 bg-gray-50 hover:bg-[#5D5FEF]/10 rounded-2xl text-sm font-bold transition">+{n}⚡</button>
            ))}
          </div>

          {/* Path cards */}
          <div className="space-y-2 mb-4">
            {paths.map(p => (
              <motion.button key={p.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setPath(p.id)}
                disabled={p.cost > energy}
                className={`w-full p-3 rounded-2xl text-left transition border-2 flex items-center gap-3 ${
                  path === p.id ? 'border-[#5D5FEF] bg-[#5D5FEF]/5' : 'border-transparent bg-gray-50 hover:bg-gray-100'
                } ${p.cost > energy ? 'opacity-30' : ''}`}>
                <span className="text-xl">{p.icon}</span>
                <div className="flex-1">
                  <span className="text-sm font-bold">{p.name}</span>
                  <div className="flex gap-3 text-[10px] text-gray-400">
                    <span>Цена: {p.cost}⚡</span>
                    <span>Риск: {p.risk}%</span>
                    <span>Награда: +{p.reward}⭐</span>
                  </div>
                </div>
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00D2C4] rounded-full" style={{ width: `${100 - p.risk}%` }} />
                </div>
              </motion.button>
            ))}
          </div>

          <button onClick={submit} disabled={!path}
            className="w-full py-3 bg-[#10B981] text-white font-bold rounded-2xl disabled:opacity-30 transition hover:shadow-lg">
            В путь!
          </button>
        </>
      )}

      {submitted && result && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          className={`text-center p-5 rounded-2xl ${result.includes('Успех') ? 'bg-[#00D2C4]/10' : 'bg-[#FF8A65]/10'}`}>
          <motion.div animate={{ rotate: result.includes('Успех') ? [0, 10, -10, 0] : [0, -5, 5, 0] }}
            className="text-4xl mb-2">{result.includes('Успех') ? '🎉' : '💥'}</motion.div>
          <p className="font-bold text-sm">{result}</p>
        </motion.div>
      )}
    </div>
  );
}
