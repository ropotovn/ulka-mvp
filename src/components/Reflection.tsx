import { useState } from 'react';
import { motion } from 'framer-motion';
import { MascotSpeech } from './MascotSystem';
import type { MascotId } from './MascotSystem';

interface Insight {
  id: string;
  date: string;
  emotion: string;
  discovery: string;
  skill: string;
}

interface Props {
  onComplete: (insight: Insight) => void;
  context: { gameType: string; score: number; skillCategory: string };
}

const EMOTIONS = [
  { emoji: '😊', label: 'Радость' },
  { emoji: '🤔', label: 'Задумчивость' },
  { emoji: '😤', label: 'Вызов' },
  { emoji: '😌', label: 'Спокойствие' },
  { emoji: '🤩', label: 'Восторг' },
  { emoji: '💪', label: 'Гордость' },
];

const DISCOVERIES = [
  'Я умею находить необычные решения',
  'Я могу слушать и слышать других',
  'Я не сдаюсь, даже когда сложно',
  'Я могу быть лидером и вести команду',
  'Я быстро перестраиваюсь, если план меняется',
  'Я замечаю детали, которые другие пропускают',
  'Я могу успокоиться и собраться',
  'Я умею договариваться и находить компромисс',
];

export function Reflection({ onComplete, context }: Props) {
  const [step, setStep] = useState<'emotion' | 'discovery' | 'apply' | 'done'>('emotion');
  const [emotion, setEmotion] = useState('');
  const [discovery, setDiscovery] = useState('');
  const [customDiscovery, setCustomDiscovery] = useState('');
  const [application, setApplication] = useState('');

  const mascot: MascotId = 'tala';

  const handleComplete = () => {
    onComplete({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ru'),
      emotion,
      discovery: discovery || customDiscovery,
      skill: context.skillCategory,
    });
    setStep('done');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto px-4 py-8">
      {/* Mascot greeting */}
      <div className="mb-8">
        <MascotSpeech mascot={mascot}
          text={step === 'emotion' ? 'Давай остановимся на минутку. Что ты сейчас чувствуешь?' :
                step === 'discovery' ? 'Ты молодец! А что нового ты узнал о себе?' :
                step === 'apply' ? 'Как это поможет тебе завтра?' :
                'Ты делаешь важные открытия. Я запомню это для тебя.'} />
      </div>

      {/* Step: Emotion */}
      {step === 'emotion' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {EMOTIONS.map(e => (
              <motion.button key={e.emoji} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                onClick={() => { setEmotion(e.label); setStep('discovery'); }}
                className={`p-4 rounded-2xl text-center transition border-2 ${
                  emotion === e.label ? 'border-[#00D2C4] bg-[#00D2C4]/5' : 'border-gray-100 bg-white hover:bg-gray-50'
                }`}>
                <span className="text-2xl block mb-1">{e.emoji}</span>
                <span className="text-xs font-bold text-gray-600">{e.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step: Discovery */}
      {step === 'discovery' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-gray-400 mb-3">Выбери или напиши своё:</p>
          <div className="space-y-2 mb-4">
            {DISCOVERIES.filter((_, i) => i < 4).map(d => (
              <motion.button key={d} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setDiscovery(d); setStep('apply'); }}
                className="w-full text-left p-3 bg-white border border-gray-100 rounded-2xl text-sm hover:border-[#5D5FEF]/30 transition">
                «{d}»
              </motion.button>
            ))}
          </div>
          <textarea value={customDiscovery} onChange={e => setCustomDiscovery(e.target.value)}
            placeholder="Или напиши своё открытие..."
            rows={2} className="w-full p-3 bg-gray-50 rounded-2xl text-sm border border-gray-200 focus:border-[#5D5FEF] outline-none resize-none" />
          <button onClick={() => setStep('apply')} disabled={!discovery && !customDiscovery}
            className="w-full mt-3 py-3 bg-[#00D2C4] text-white font-bold rounded-2xl disabled:opacity-30 transition">
            Дальше →
          </button>
        </motion.div>
      )}

      {/* Step: Apply */}
      {step === 'apply' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <textarea value={application} onChange={e => setApplication(e.target.value)}
            placeholder="Например: завтра на уроке я попробую..."
            rows={3} className="w-full p-4 bg-gray-50 rounded-2xl text-sm border border-gray-200 focus:border-[#00D2C4] outline-none resize-none" />
          <button onClick={handleComplete}
            className="w-full mt-3 py-3 bg-[#00D2C4] text-white font-bold rounded-2xl transition hover:shadow-lg">
            Запомнить это открытие ✨
          </button>
        </motion.div>
      )}

      {/* Done */}
      {step === 'done' && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center py-8">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4">💎</motion.div>
          <p className="text-gray-500">Инсайт сохранён в твою коллекцию.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
