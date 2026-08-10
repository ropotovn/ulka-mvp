import { motion } from 'framer-motion';
import { ROLES } from '../campaign';
import type { RoleId } from '../campaign';

interface Props {
  onSelect: (roleId: RoleId) => void;
  selected: RoleId | null;
}

export function RoleSelect({ onSelect, selected }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="text-6xl mb-4">⚔️</div>
        <h2 className="text-3xl font-bold mb-3">Выбери свою роль</h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          В Улка-кампании у каждого своя роль. Выбери ту, которая ближе тебе по духу.
          От твоего выбора зависит, какие испытания ты будешь проходить и как поможешь команде победить.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROLES.map((role, i) => (
          <motion.button
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => onSelect(role.id)}
            className={`text-left p-5 rounded-3xl border-2 transition-all ${
              selected === role.id
                ? 'border-[#5D5FEF] bg-[#5D5FEF]/5 shadow-lg'
                : 'border-transparent bg-white hover:border-gray-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: role.color + '20' }}
              >
                {role.emoji}
              </div>
              <div>
                <h3 className="font-bold text-lg">{role.name}</h3>
                <span className="text-xs text-gray-400">Роль в команде</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-3">{role.description}</p>
            <div className="bg-gray-50 rounded-2xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold" style={{ color: role.color }}>⚡ {role.powerName}</span>
              </div>
              <p className="text-xs text-gray-400">{role.powerDescription}</p>
            </div>
            {selected === role.id && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-3 text-center">
                <span className="text-xs font-bold text-[#5D5FEF] bg-[#5D5FEF]/10 px-3 py-1 rounded-full">Выбрано ✓</span>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
