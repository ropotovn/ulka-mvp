import { motion } from 'framer-motion';

export type MascotId = 'felix' | 'tala' | 'sofia' | 'ares' | 'ziggy';

export interface Mascot {
  id: MascotId;
  name: string;
  emoji: string;
  color: string;
  category: string;
  phrase: string;
  gift: string;
}

export const MASCOTS: Record<MascotId, Mascot> = {
  felix: {
    id: 'felix', name: 'Феликс', emoji: '🦊', color: '#5D5FEF',
    category: 'Мышление', phrase: 'Смотри глубже — там паттерн!', gift: 'Показывает скрытые связи',
  },
  tala: {
    id: 'tala', name: 'Тала', emoji: '🐢', color: '#00D2C4',
    category: 'Саморегуляция', phrase: 'Вдох-выдох. Ты справишься.', gift: 'Замедляет время — даёт паузу',
  },
  sofia: {
    id: 'sofia', name: 'София', emoji: '🦉', color: '#FF8A65',
    category: 'Коммуникация', phrase: 'Слова — это мосты. Давай построим.', gift: 'Подсказывает чувства собеседника',
  },
  ares: {
    id: 'ares', name: 'Арес', emoji: '🦁', color: '#F59E0B',
    category: 'Социальные', phrase: 'Вместе мы — сила! Кто со мной?', gift: 'Поднимает боевой дух команды',
  },
  ziggy: {
    id: 'ziggy', name: 'Зигги', emoji: '🦎', color: '#10B981',
    category: 'Адаптивность', phrase: 'План изменился? Будет веселее!', gift: 'Показывает альтернативные пути',
  },
};

interface Props {
  mascot: MascotId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speaking?: boolean;
  onClick?: () => void;
  className?: string;
}

const SIZES = { sm: 'text-3xl', md: 'text-5xl', lg: 'text-7xl', xl: 'text-9xl' };
const CONTAINER = { sm: 'w-14 h-14', md: 'w-20 h-20', lg: 'w-28 h-28', xl: 'w-36 h-36' };

export function MascotAvatar({ mascot, size = 'md', speaking = false, onClick, className = '' }: Props) {
  const m = MASCOTS[mascot];

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.1 } : {}}
      whileTap={onClick ? { scale: 0.9 } : {}}
      onClick={onClick}
      className={`relative rounded-full flex items-center justify-center ${CONTAINER[size]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ backgroundColor: m.color + '18', boxShadow: `0 0 30px ${m.color}22` }}
    >
      {/* Glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: m.color + '30' }}
        animate={speaking ? { scale: [1, 1.1, 1], opacity: [0.3, 0.8, 0.3] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      {/* Inner glow */}
      <motion.div
        className="absolute inset-1 rounded-full blur-sm"
        style={{ backgroundColor: m.color + '10' }}
        animate={speaking ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Emoji */}
      <motion.span
        className={`${SIZES[size]} relative z-10 drop-shadow-lg`}
        animate={speaking ? { y: [0, -3, 0] } : { y: [0, -1, 0] }}
        transition={speaking ? { duration: 0.8, repeat: Infinity } : { duration: 3, repeat: Infinity }}
      >
        {m.emoji}
      </motion.span>
      {/* Speaking indicator */}
      {speaking && (
        <motion.div className="absolute -bottom-1 flex gap-1">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: m.color }}
              animate={{ y: [0, -4, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

interface SpeechProps {
  mascot: MascotId;
  text: string;
}

export function MascotSpeech({ mascot, text }: SpeechProps) {
  const m = MASCOTS[mascot];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3"
    >
      <MascotAvatar mascot={mascot} size="sm" speaking />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold">{m.name}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: m.color }}>{m.category}</span>
        </div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
          style={{ backgroundColor: m.color + '10', border: `1px solid ${m.color}20` }}
        >
          «{text}»
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   Mascot Parade — all 5 on the hub
   ═══════════════════════════════════════ */

interface ParadeProps {
  onSelect?: (mascot: MascotId) => void;
  active?: MascotId;
}

export function MascotParade({ onSelect, active }: ParadeProps) {
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {(Object.entries(MASCOTS) as [MascotId, Mascot][]).map(([id, m]) => (
        <motion.button
          key={id}
          whileHover={{ scale: 1.1, y: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelect?.(id)}
          className={`flex flex-col items-center gap-2 p-3 rounded-3xl transition-all ${
            active === id ? 'bg-white shadow-lg' : 'hover:bg-white/50'
          }`}
          style={{ border: active === id ? `2px solid ${m.color}` : '2px solid transparent' }}
        >
          <MascotAvatar mascot={id} size="md" />
          <span className="text-xs font-bold" style={{ color: m.color }}>{m.name}</span>
        </motion.button>
      ))}
    </div>
  );
}
