import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface FocusGameProps {
  onComplete: (score: number, maxScore: number, metrics: { avgRt: number; correct: number; wrong: number; missed: number }) => void;
  onBack: () => void;
}

type TargetState = 'target' | 'distractor' | 'none';

interface Stimulus {
  id: number;
  shape: 'sphere' | 'cube' | 'torus';
  color: 'green' | 'red' | 'blue';
  x: number;
  y: number;
  state: TargetState;
}

const TOTAL_ROUNDS = 20;

export function FocusGame({ onComplete, onBack }: FocusGameProps) {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'done'>('intro');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [stimulus, setStimulus] = useState<Stimulus | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'missed' | null>(null);
  const [countdown, setCountdown] = useState(3);
  const timeouts = useRef<number[]>([]);
  const stimStart = useRef(0);
  const metrics = useRef({ rts: [] as number[], correct: 0, wrong: 0, missed: 0 });

  const cleanup = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  }, []);

  const spawnStimulus = useCallback(() => {
    const isTarget = Math.random() < 0.55; // 55% targets
    const shapes: Stimulus['shape'][] = ['sphere', 'cube', 'torus'];
    const colors: Stimulus['color'][] = ['green', 'red', 'blue'];

    const s: Stimulus = {
      id: Date.now(),
      shape: shapes[Math.floor(Math.random() * 3)],
      color: isTarget ? 'green' : (Math.random() < 0.5 ? 'red' : 'blue'),
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 70,
      state: isTarget ? 'target' : 'distractor',
    };

    setStimulus(s);
    setFeedback(null);
    stimStart.current = performance.now();

    // Auto-miss after 1.2s
    const missTimer = setTimeout(() => {
      setStimulus(prev => {
        if (prev && prev.id === s.id && prev.state === 'target') {
          metrics.current.missed++;
          setFeedback('missed');
          return null;
        }
        return prev;
      });
      setTimeout(() => nextRound(), 400);
    }, 1200);
    timeouts.current.push(missTimer);

    return s;
  }, []);

  const nextRound = useCallback(() => {
    cleanup();
    setStimulus(null);
    if (round >= TOTAL_ROUNDS - 1) {
      setPhase('done');
      return;
    }
    setRound(r => r + 1);
    setTimeout(() => spawnStimulus(), 600 + Math.random() * 600);
  }, [round, cleanup, spawnStimulus]);

  const handleTap = useCallback(() => {
    if (!stimulus || feedback) return;
    const rt = performance.now() - stimStart.current;

    if (stimulus.state === 'target') {
      metrics.current.rts.push(rt);
      metrics.current.correct++;
      setScore(s => s + 10);
      setFeedback('correct');
    } else {
      metrics.current.wrong++;
      setFeedback('wrong');
    }
    cleanup();
    setStimulus(null);
    setTimeout(() => nextRound(), 400);
  }, [stimulus, feedback, cleanup, nextRound]);

  const startGame = () => {
    cleanup();
    setScore(0);
    setRound(0);
    metrics.current = { rts: [], correct: 0, wrong: 0, missed: 0 };
    setPhase('playing');
    setCountdown(3);

    // Countdown
    let c = 3;
    const cd = setInterval(() => {
      c--;
      setCountdown(c);
      if (c === 0) {
        clearInterval(cd);
        setTimeout(() => spawnStimulus(), 300);
      }
    }, 700);
  };

  useEffect(() => {
    if (phase === 'done') {
      const avgRt = metrics.current.rts.length
        ? Math.round(metrics.current.rts.reduce((a, b) => a + b, 0) / metrics.current.rts.length)
        : 0;
      onComplete(score, TOTAL_ROUNDS * 10, { avgRt, ...metrics.current });
    }
    return cleanup;
  }, [phase]);

  // Shape renderer
  const renderShape = (s: Stimulus) => {
    const base = "absolute transition-all duration-75";
    const size = 56 + Math.random() * 10;
    const colorMap = { green: '#00D2C4', red: '#FF6B6B', blue: '#5D5FEF' };
    const c = colorMap[s.color];

    switch (s.shape) {
      case 'sphere':
        return <div className={base} style={{ width: size, height: size, borderRadius: '50%', background: c, left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%,-50%)', boxShadow: `0 0 20px ${c}44` }} />;
      case 'cube':
        return <div className={base} style={{ width: size, height: size, borderRadius: 12, background: c, left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%,-50%) rotate(15deg)', boxShadow: `0 0 16px ${c}44` }} />;
      case 'torus':
        return <div className={base} style={{ width: size, height: size, borderRadius: '50%', border: `10px solid ${c}`, background: 'transparent', left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%,-50%)' }} />;
    }
  };

  if (phase === 'intro') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="text-7xl mb-6">🎯</div>
        <h2 className="text-3xl font-bold mb-4">Фокус-реактор</h2>
        <p className="text-gray-500 mb-2 text-lg">Тренировка внимания и самоконтроля</p>
        <div className="bg-gray-50 rounded-3xl p-5 mb-8 text-left text-sm text-gray-600 space-y-2">
          <p><b>🟢 Зелёный шар</b> — нажимай как можно быстрее!</p>
          <p><b>🔴🔵 Другие фигуры</b> — не нажимай.</p>
          <p className="text-xs text-gray-400">Это игра Go/No-Go. Тренирует способность тормозить импульсивные реакции.</p>
        </div>
        <button onClick={startGame} className="w-full py-4 bg-[#5D5FEF] text-white font-bold text-lg rounded-3xl hover:shadow-lg transition">
          Начать игру →
        </button>
      </div>
    );
  }

  if (phase === 'done') {
    const m = metrics.current;
    const totalTargets = m.correct + m.missed;
    const acc = totalTargets > 0 ? Math.round((m.correct / totalTargets) * 100) : 0;
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-7xl mb-4">{score > 100 ? '🏆' : '🎯'}</motion.div>
        <h2 className="text-3xl font-bold mb-2">Тренировка завершена!</h2>
        <div className="grid grid-cols-2 gap-3 my-6">
          <div className="bg-[#5D5FEF]/10 p-4 rounded-2xl"><div className="text-2xl font-bold text-[#5D5FEF]">{score}</div><div className="text-xs text-gray-500">Очки</div></div>
          <div className="bg-[#00D2C4]/10 p-4 rounded-2xl"><div className="text-2xl font-bold text-[#00D2C4]">{acc}%</div><div className="text-xs text-gray-500">Точность</div></div>
          <div className="bg-amber-50 p-4 rounded-2xl"><div className="text-2xl font-bold text-amber-500">{m.missed}</div><div className="text-xs text-gray-500">Пропущено</div></div>
          <div className="bg-red-50 p-4 rounded-2xl"><div className="text-2xl font-bold text-red-400">{m.wrong}</div><div className="text-xs text-gray-500">Ложных</div></div>
        </div>
        <div className="flex gap-3">
          <button onClick={startGame} className="flex-1 py-3 bg-[#5D5FEF] text-white font-bold rounded-3xl">Ещё раз</button>
          <button onClick={onBack} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-3xl">Назад</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* HUD */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-bold text-gray-400">{round + 1}/{TOTAL_ROUNDS}</span>
        <span className="text-lg font-bold text-[#5D5FEF]">{score}</span>
        <div className="flex gap-1">
          {[...Array(TOTAL_ROUNDS)].map((_, i) => (
            <div key={i} className={`w-1.5 h-5 rounded-full transition ${i < round ? 'bg-[#00D2C4]' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      {/* Countdown */}
      {countdown > 0 && (
        <motion.div key={countdown} initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center text-6xl font-bold text-[#5D5FEF] py-20">
          {countdown}
        </motion.div>
      )}

      {/* Game area */}
      {countdown === 0 && (
        <div
          className="relative bg-[#FAF9F6] rounded-[32px] border-2 border-dashed border-gray-200 h-80 overflow-hidden cursor-pointer"
          onClick={handleTap}
        >
          {stimulus && renderShape(stimulus)}
          {!stimulus && !feedback && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-lg">
              Жди фигуру...
            </div>
          )}
          {/* Feedback overlay */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`absolute inset-0 flex items-center justify-center text-4xl font-bold ${
                feedback === 'correct' ? 'text-[#00D2C4] bg-[#00D2C4]/5' :
                feedback === 'wrong' ? 'text-red-400 bg-red-50' :
                'text-amber-400 bg-amber-50'
              }`}
            >
              {feedback === 'correct' ? '✓' : feedback === 'wrong' ? '✗' : '⏰'}
            </motion.div>
          )}

          {/* Instruction */}
          <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400">
            Нажимай только на <span className="text-[#00D2C4] font-bold">зелёные шары</span>
          </div>
        </div>
      )}
    </div>
  );
}
