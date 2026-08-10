import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../store';
import type { Interest } from '../store';

const INTERESTS: { key: Interest; emoji: string; label: string; color: string }[] = [
  { key: 'sport', emoji: '⚽', label: 'Спорт', color: '#5D5FEF' },
  { key: 'games', emoji: '🎮', label: 'Игры', color: '#00D2C4' },
  { key: 'tech', emoji: '🤖', label: 'Технологии и ИИ', color: '#FF8A65' },
  { key: 'art', emoji: '🎨', label: 'Творчество', color: '#5D5FEF' },
  { key: 'music', emoji: '🎧', label: 'Музыка', color: '#FF8A65' },
  { key: 'friends', emoji: '👥', label: 'Гулять с друзьями', color: '#00D2C4' },
];

export function Onboarding() {
  const { setInterest, setChildName, setFirstName, childName, firstName } = useApp();
  const [name, setName] = useState(childName);
  const [pname, setPName] = useState(firstName);
  const [age, setAge] = useState('10');
  const [step, setStep] = useState<'name' | 'interests'>('name');

  if (step === 'name') {
    return (
      <div className="max-w-xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="text-7xl mb-6 animate-float">🦒</div>
          <h1 className="text-3xl font-bold mb-3">Добро пожаловать в Улку!</h1>
          <p className="text-gray-500 text-lg">Давай познакомимся. Как тебя зовут?</p>
        </motion.div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Имя ребёнка</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Например: Маша"
              className="w-full p-4 rounded-3xl bg-white border border-gray-100 text-lg font-semibold focus:outline-none focus:border-[#5D5FEF] transition"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Имя родителя</label>
            <input
              type="text"
              value={pname}
              onChange={e => setPName(e.target.value)}
              placeholder="Ваше имя"
              className="w-full p-4 rounded-3xl bg-white border border-gray-100 text-lg font-semibold focus:outline-none focus:border-[#5D5FEF] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Возраст ребёнка</label>
            <select
              value={age}
              onChange={e => setAge(e.target.value)}
              className="w-full p-4 rounded-3xl bg-white border border-gray-100 text-lg font-semibold focus:outline-none focus:border-[#5D5FEF] transition"
            >
              {[7,8,9,10,11,12,13,14].map(a => (
                <option key={a} value={a}>{a} лет</option>
              ))}
            </select>
          </div>
          <button
            disabled={!name.trim()}
            onClick={() => { setChildName(name); setFirstName(pname); setStep('interests'); }}
            className="w-full py-4 rounded-3xl bg-[#5D5FEF] text-white font-bold text-lg disabled:opacity-40 transition hover:shadow-lg"
          >
            Далее →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="text-6xl mb-6">{['🎯','🎲','🎸','🎨','⚡','🌟'][Math.floor(Math.random()*6)]}</div>
        <h1 className="text-2xl font-bold mb-2">Привет, {name || 'друг'}!</h1>
        <p className="text-gray-500">Чему посвятим сегодняшнюю миссию?</p>
        <p className="text-sm text-gray-400 mt-1">Выбери свой главный интерес, и ИИ подстроит мир под тебя:</p>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {INTERESTS.map((int, i) => (
          <motion.button
            key={int.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => setInterest(int.key)}
            className="p-4 bg-white hover:bg-[#5D5FEF]/5 rounded-3xl text-center font-semibold text-sm flex flex-col items-center gap-2 border-2 border-transparent hover:border-[#5D5FEF]/30 transition-all bento-shadow"
          >
            <span className="text-3xl">{int.emoji}</span>
            <span>{int.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
