import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChallengeType } from '../campaign';
import { SceneIllustration } from './SceneIllustration';

interface Props {
  challengeType: ChallengeType;
  npcName: string;
  npcEmoji: string;
  npcQuestion: string;
  context: string;
  keywords: { win: string[]; neutral: string[] };
  onResult: (success: boolean, feedback: string) => void;
}

function evaluateResponse(input: string, type: ChallengeType, keywords: Props['keywords']): { success: boolean; feedback: string } {
  const lower = input.toLowerCase();
  const hasWin = keywords.win.some(k => lower.includes(k));
  const hasNeutral = keywords.neutral.some(k => lower.includes(k));

  const feedbacks: Record<ChallengeType, { win: string; neutral: string; fail: string }> = {
    logic: {
      win: 'Отличное аналитическое мышление! Ты заметил закономерность и нашёл решение. Логика +5.',
      neutral: 'Интересный подход. Ты на верном пути — присмотрись к рунам внимательнее. Логика +2.',
      fail: 'Пока не совсем. Но ты пробуешь — а это главное. Поищи закономерность в символах на вратах.',
    },
    social: {
      win: 'Превосходно! Ты услышал эмоции за словами и нашёл правильный тон. Эмпатия +5.',
      neutral: 'Хорошая попытка. Ты пытаешься понять духа — это уже шаг. Эмпатия +2.',
      fail: 'Дух леса нахмурился. Попробуй понять, что он чувствует, а не что говорит.',
    },
    creative: {
      win: 'Гениально! Ты придумал нестандартное решение. Креативность +5.',
      neutral: 'Любопытная идея. В ней есть зерно — доработай детали. Креативность +2.',
      fail: 'Идея рискованная. Оглядись: что вокруг можно использовать как инструмент?',
    },
    strategy: {
      win: 'Тактический гений! Ты взвесил риски и выбрал оптимальный путь. Стратегия +5.',
      neutral: 'Разумно. Но есть ли путь, который даст больше при тех же затратах? Стратегия +2.',
      fail: 'Подумай о ресурсах. Сколько энергии уйдёт и что ты получишь взамен?',
    },
  };

  const f = feedbacks[type];
  if (hasWin) return { success: true, feedback: f.win };
  if (hasNeutral) return { success: true, feedback: f.neutral };
  return { success: false, feedback: f.fail };
}

export function AIChallenge({ challengeType, npcName, npcEmoji, npcQuestion, keywords, onResult }: Props) {
  const [phase, setPhase] = useState<'scene' | 'dialogue' | 'typing' | 'thinking' | 'result'>('scene');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ success: boolean; feedback: string } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Scene plays → NPC speaks → typing enabled
    const t1 = setTimeout(() => setPhase('dialogue'), 1500);
    const t2 = setTimeout(() => { setPhase('typing'); inputRef.current?.focus(); }, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) return;
    setPhase('thinking');
    setTimeout(() => {
      const evaluation = evaluateResponse(input, challengeType, keywords);
      setResult(evaluation);
      setPhase('result');
      setTimeout(() => onResult(evaluation.success, evaluation.feedback), 3000);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl max-w-lg w-full">
      {/* SCENE ILLUSTRATION */}
      <SceneIllustration type={challengeType} />

      {/* NPC DIALOGUE OVERLAY on scene */}
      <AnimatePresence mode="wait">
        {phase === 'scene' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="px-5 py-4 text-center">
            <p className="text-sm text-gray-400 animate-pulse">Вы входите в локацию...</p>
          </motion.div>
        )}

        {phase === 'dialogue' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="px-5 py-4">
            <div className="flex items-start gap-3">
              <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 bg-[#5D5FEF]/10">
                {npcEmoji}
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-bold text-sm">{npcName}</span>
                  <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                    className="text-[10px] text-[#00D2C4] font-bold">● говорит</motion.span>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-gray-700 leading-relaxed bg-gray-50 rounded-2xl px-4 py-3 text-sm"
                >
                  {npcQuestion}
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}

        {/* TYPING AREA */}
        {phase === 'typing' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-5 pb-5">
            {/* Keep NPC message visible */}
            <div className="flex items-start gap-3 mb-3 opacity-60">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg shrink-0 bg-[#5D5FEF]/10">{npcEmoji}</div>
              <div className="bg-gray-50 rounded-2xl px-3 py-2 text-xs text-gray-500">{npcQuestion}</div>
            </div>
            {/* Input */}
            <div className="relative">
              <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                placeholder="Опиши свои действия или скажи что-то в ответ..."
                rows={3}
                className="w-full p-4 bg-[#FAF9F6] rounded-2xl text-sm border-2 border-gray-200 focus:border-[#5D5FEF] focus:ring-4 focus:ring-[#5D5FEF]/10 resize-none transition outline-none"
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }} />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-gray-400">Enter — отправить</span>
                <div className="flex gap-2">
                  <button disabled className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 cursor-not-allowed" title="Голосовой ввод — скоро">🎤</button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSubmit} disabled={!input.trim()}
                    className="px-5 py-2 bg-[#5D5FEF] text-white font-bold text-sm rounded-2xl disabled:opacity-30 transition hover:shadow-lg hover:shadow-[#5D5FEF]/25">
                    Ответить →
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* THINKING */}
        {phase === 'thinking' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-5 text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-[#5D5FEF] border-t-transparent" />
            <p className="text-sm text-gray-500">{npcName} обдумывает твой ответ...</p>
          </motion.div>
        )}

        {/* RESULT */}
        {phase === 'result' && result && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className={`px-5 pb-5`}>
            <div className={`rounded-2xl p-4 ${
              result.success ? 'bg-gradient-to-br from-[#00D2C4]/10 to-[#5D5FEF]/5 border border-[#00D2C4]/20' :
              'bg-gradient-to-br from-[#FF8A65]/10 to-amber-50 border border-[#FF8A65]/20'
            }`}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: result.success ? '#00D2C420' : '#FF8A6520' }}>{npcEmoji}</div>
                <div>
                  <span className="font-bold text-sm">{npcName}</span>
                  <p className="text-gray-700 mt-1 text-sm leading-relaxed">{result.feedback}</p>
                  <span className={`inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-lg ${
                    result.success ? 'bg-[#00D2C4]/10 text-[#00D2C4]' : 'bg-[#FF8A65]/10 text-[#FF8A65]'
                  }`}>{result.success ? '✓ Принято' : '↺ Попробуй иначе'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
