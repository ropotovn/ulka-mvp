import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════
   DETECTIVE GAME — «Дело о пропавшем артефакте»
   Развивает: критическое мышление (Лурия),
   системное мышление (Леонтьев),
   активное слушание (Роджерс).

   Ребёнок собирает улики → выдвигает гипотезу
   → проверяет → делает вывод.
   ═══════════════════════════════════════ */

interface Evidence {
  id: string;
  name: string;
  emoji: string;
  description: string;
  location: string;
  implicates: string[]; // suspect ids
}

interface Suspect {
  id: string;
  name: string;
  emoji: string;
  role: string;
  testimony: string;
  guilty: boolean;
  motive: string;
}

interface Props {
  onComplete: (score: number, analytics: { evidenceFound: number; interviewsDone: number; correctAccusation: boolean }) => void;
}

const LOCATIONS = ['🏛️ Зал артефактов', '🌿 Сад', '📚 Библиотека', '🔬 Лаборатория', '🗿 Подземелье'];

const EVIDENCE: Evidence[] = [
  { id: 'e1', name: 'Следы лап', emoji: '🐾', description: 'Мелкие отпечатки ведут от витрины к выходу. Слишком маленькие для взрослого.', location: '🏛️ Зал артефактов', implicates: ['s2', 's4'] },
  { id: 'e2', name: 'Сломанный замок', emoji: '🔓', description: 'Замок витрины вскрыт аккуратно, инструментом. Никаких следов взлома.', location: '🏛️ Зал артефактов', implicates: ['s1', 's3'] },
  { id: 'e3', name: 'Перо', emoji: '🪶', description: 'Ярко-синее перо на полу. Не местной птицы.', location: '🏛️ Зал артефактов', implicates: ['s1', 's4'] },
  { id: 'e4', name: 'Пролитые чернила', emoji: '🖋️', description: 'Лужа синих чернил на столе. Кто-то очень спешил.', location: '📚 Библиотека', implicates: ['s3', 's4'] },
  { id: 'e5', name: 'Пропавшая книга', emoji: '📕', description: 'С полки исчез старинный том «Тайны древних». Кому он понадобился?', location: '📚 Библиотека', implicates: ['s1', 's3'] },
  { id: 'e6', name: 'Странный запах', emoji: '👃', description: 'В лаборатории пахнет серой. Кто-то проводил эксперименты ночью.', location: '🔬 Лаборатория', implicates: ['s3', 's5'] },
  { id: 'e7', name: 'Разбитая колба', emoji: '🧪', description: 'На полу осколки. На одном — отпечаток перчатки.', location: '🔬 Лаборатория', implicates: ['s1', 's3'] },
  { id: 'e8', name: 'Письмо', emoji: '✉️', description: '«Артефакт нужно вернуть до полуночи, иначе...» — записка без подписи.', location: '🗿 Подземелье', implicates: ['s2', 's5'] },
];

const SUSPECTS: Suspect[] = [
  { id: 's1', name: 'Профессор Мур', emoji: '🦉', role: 'Хранитель музея', testimony: 'Я был в библиотеке всю ночь. Работал над каталогом.', guilty: false, motive: 'Нет мотива. Он любит артефакты и никогда бы не украл.' },
  { id: 's2', name: 'Лисёнок Рыжик', emoji: '🦊', role: 'Помощник смотрителя', testimony: 'Я... я ничего не видел. Просто гулял по саду.', guilty: false, motive: 'Слишком мал и наивен. Но он что-то скрывает.' },
  { id: 's3', name: 'Доктор Штейн', emoji: '🧪', role: 'Алхимик', testimony: 'Артефакт? Он мне нужен для экспериментов! Но я бы попросил, а не украл.', guilty: false, motive: 'Одержим наукой. Мог бы взять «на время», но не вор.' },
  { id: 's4', name: 'Сорока Блестяшка', emoji: '🐦', role: 'Коллекционер', testimony: 'Я просто люблю красивые вещи! Но я ничего не брала, клянусь перьями!', guilty: true, motive: 'Не могла устоять перед блестящим артефактом. Взяла «посмотреть» и не вернула.' },
  { id: 's5', name: 'Страж Грог', emoji: '🗿', role: 'Ночной охранник', testimony: 'Моя смена — ничего необычного. Хотя... какая-то тень мелькнула у витрины.', guilty: false, motive: 'Спал на посту. Не хочет признаваться в халатности.' },
];

type Phase = 'briefing' | 'investigate' | 'interview' | 'accuse' | 'result';

export function DetectiveGame({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('briefing');
  const [collectedEvidence, setCollectedEvidence] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState(0);
  const [interviewedSuspects, setInterviewedSuspects] = useState<string[]>([]);
  const [accusedSuspect, setAccusedSuspect] = useState<string | null>(null);
  const [hypothesis, setHypothesis] = useState('');

  const locationEvidence = EVIDENCE.filter(e => e.location === LOCATIONS[currentLocation]);
  const foundHere = locationEvidence.filter(e => collectedEvidence.includes(e.id));

  const collectEvidence = (evidenceId: string) => {
    if (!collectedEvidence.includes(evidenceId)) {
      setCollectedEvidence(prev => [...prev, evidenceId]);
      if (currentLocation < LOCATIONS.length - 1 && foundHere.length + 1 >= locationEvidence.length) {
        // Auto-advance to next location after collecting all evidence here
        setTimeout(() => setCurrentLocation(prev => Math.min(prev + 1, LOCATIONS.length - 1)), 500);
      }
    }
  };

  const interviewSuspect = (suspectId: string) => {
    if (!interviewedSuspects.includes(suspectId)) {
      setInterviewedSuspects(prev => [...prev, suspectId]);
    }
  };

  const handleAccuse = (suspectId: string) => {
    setAccusedSuspect(suspectId);
    const suspect = SUSPECTS.find(s => s.id === suspectId)!;
    setTimeout(() => {
      setPhase('result');
      onComplete(suspect.guilty ? 300 : 100, {
        evidenceFound: collectedEvidence.length,
        interviewsDone: interviewedSuspects.length,
        correctAccusation: suspect.guilty,
      });
    }, 1500);
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Phase: Briefing */}
      {phase === 'briefing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[32px] bento-shadow border border-gray-100 p-6 text-center">
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 0.6 }}
            className="text-6xl mb-4">🔍</motion.div>
          <h2 className="text-2xl font-bold mb-3">Дело о пропавшем артефакте</h2>
          <p className="text-gray-500 mb-2">Из музея Улки исчез древний Кристалл Знаний.</p>
          <p className="text-sm text-gray-400 mb-6">Твоя задача: собрать улики, опросить подозреваемых, выдвинуть гипотезу и найти виновного.</p>
          <div className="bg-[#5D5FEF]/5 rounded-2xl p-3 mb-6 text-xs text-gray-500">
            🧠 <b>Что тренируем:</b> критическое мышление (Лурия) · системный анализ (Леонтьев) · активное слушание (Роджерс)
          </div>
          <button onClick={() => setPhase('investigate')}
            className="w-full py-3 bg-[#5D5FEF] text-white font-bold rounded-2xl hover:shadow-lg transition">
            Начать расследование →
          </button>
        </motion.div>
      )}

      {/* Phase: Investigate — collect evidence */}
      {phase === 'investigate' && (
        <div className="space-y-4">
          {/* Location header */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 bento-shadow border border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xl">{LOCATIONS[currentLocation]}</span>
              <span className="text-xs text-gray-400">{currentLocation + 1}/{LOCATIONS.length}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span>🧩 {collectedEvidence.length}/{EVIDENCE.length}</span>
            </div>
          </div>

          {/* Evidence cards */}
          <div className="space-y-2">
            {locationEvidence.map(ev => {
              const collected = collectedEvidence.includes(ev.id);
              return (
                <motion.button key={ev.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => !collected && collectEvidence(ev.id)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition ${
                    collected ? 'bg-[#00D2C4]/5 border-[#00D2C4]/30' : 'bg-white border-gray-100 hover:border-[#5D5FEF]/30 bento-shadow'
                  }`}>
                  <div className="flex items-start gap-3">
                    <span className={`text-2xl shrink-0 ${collected ? '' : 'grayscale opacity-50'}`}>{ev.emoji}</span>
                    <div>
                      <span className="font-bold text-sm">{ev.name}</span>
                      {collected ? (
                        <p className="text-xs text-gray-500 mt-1">{ev.description}</p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1 italic">Нажми, чтобы осмотреть...</p>
                      )}
                    </div>
                    {collected && <span className="ml-auto text-[#00D2C4] text-sm">✓</span>}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button onClick={() => setCurrentLocation(prev => Math.max(0, prev - 1))}
              disabled={currentLocation === 0}
              className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm disabled:opacity-30">
              ← Назад
            </button>
            <button onClick={() => setCurrentLocation(prev => Math.min(LOCATIONS.length - 1, prev + 1))}
              disabled={currentLocation === LOCATIONS.length - 1}
              className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm disabled:opacity-30">
              Вперёд →
            </button>
          </div>

          <button onClick={() => setPhase('interview')}
            disabled={collectedEvidence.length < 3}
            className="w-full py-3 bg-[#00D2C4] text-white font-bold rounded-2xl disabled:opacity-30 transition">
            Опросить подозреваемых ({collectedEvidence.length} улик)
          </button>

          {/* Evidence log */}
          {collectedEvidence.length > 0 && (
            <div className="bg-gray-900 text-gray-300 p-4 rounded-2xl text-xs font-mono">
              <span className="text-[#00D2C4] font-bold">УЛИКИ: {collectedEvidence.length}/{EVIDENCE.length}</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {collectedEvidence.map(id => {
                  const ev = EVIDENCE.find(e => e.id === id)!;
                  return <span key={id} className="text-gray-400">{ev.emoji}</span>;
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Phase: Interview */}
      {phase === 'interview' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 bento-shadow border border-gray-100">
            <h3 className="font-bold mb-1">👥 Опросить подозреваемых</h3>
            <p className="text-xs text-gray-400">Поговори с каждым. Сопоставь показания с уликами.</p>
          </div>

          {SUSPECTS.map(suspect => {
            const interviewed = interviewedSuspects.includes(suspect.id);
            // Which evidence implicates this suspect
            const implicatingEvidence = collectedEvidence.filter(eid => {
              const ev = EVIDENCE.find(e => e.id === eid)!;
              return ev.implicates.includes(suspect.id);
            });

            return (
              <motion.div key={suspect.id} whileHover={{ scale: 1.01 }}
                className={`bg-white rounded-2xl border-2 transition overflow-hidden ${
                  interviewed ? 'border-[#FF8A65]/30' : 'border-gray-100 hover:border-[#5D5FEF]/20 bento-shadow'
                }`}>
                <button onClick={() => interviewSuspect(suspect.id)}
                  className="w-full text-left p-4 flex items-start gap-3">
                  <span className="text-2xl shrink-0">{suspect.emoji}</span>
                  <div className="flex-1">
                    <span className="font-bold text-sm">{suspect.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{suspect.role}</span>
                    {interviewed ? (
                      <p className="text-sm text-gray-600 mt-1">«{suspect.testimony}»</p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-1 italic">Нажми, чтобы поговорить...</p>
                    )}
                    {implicatingEvidence.length > 0 && interviewed && (
                      <div className="flex gap-1 mt-2">
                        {implicatingEvidence.map(eid => {
                          const ev = EVIDENCE.find(e => e.id === eid)!;
                          return <span key={eid} className="text-xs bg-[#FF8A65]/10 text-[#FF8A65] px-2 py-0.5 rounded-lg" title={ev.description}>{ev.emoji} {ev.name}</span>;
                        })}
                      </div>
                    )}
                  </div>
                  {interviewed && <span className="text-[#FF8A65] text-sm">✓</span>}
                </button>
              </motion.div>
            );
          })}

          <button onClick={() => setPhase('accuse')}
            disabled={interviewedSuspects.length < 3}
            className="w-full py-3 bg-[#FF8A65] text-white font-bold rounded-2xl disabled:opacity-30 transition">
            Выдвинуть обвинение →
          </button>
        </div>
      )}

      {/* Phase: Accuse */}
      {phase === 'accuse' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-white rounded-2xl p-5 bento-shadow border border-gray-100">
            <h3 className="font-bold text-lg mb-2">⚖️ Кто украл Кристалл?</h3>
            <p className="text-sm text-gray-500 mb-4">Собери все факты в голове и выбери виновного.</p>

            {/* Hypothesis input */}
            <textarea value={hypothesis} onChange={e => setHypothesis(e.target.value)}
              placeholder="Почему ты так думаешь? (например: 'У Сороки есть перо и доступ к витрине...')"
              rows={2} className="w-full p-3 bg-gray-50 rounded-2xl text-sm border border-gray-200 focus:border-[#5D5FEF] outline-none resize-none mb-4" />

            <div className="space-y-2">
              {SUSPECTS.map(suspect => (
                <motion.button key={suspect.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => handleAccuse(suspect.id)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-[#FF8A65]/5 rounded-2xl transition flex items-center gap-3 border-2 border-transparent hover:border-[#FF8A65]/30">
                  <span className="text-xl">{suspect.emoji}</span>
                  <div>
                    <span className="text-sm font-bold">{suspect.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{suspect.role}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Phase: Result */}
      <AnimatePresence>
        {phase === 'result' && accusedSuspect && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[32px] bento-shadow border border-gray-100 p-8 text-center">
            {SUSPECTS.find(s => s.id === accusedSuspect)!.guilty ? (
              <>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }}
                  className="text-7xl mb-4">🎉</motion.div>
                <h2 className="text-2xl font-bold mb-2">Дело раскрыто!</h2>
                <p className="text-gray-500 mb-4">Сорока Блестяшка не устояла перед блеском артефакта. Кристалл возвращён в музей.</p>
              </>
            ) : (
              <>
                <motion.div className="text-7xl mb-4">🤔</motion.div>
                <h2 className="text-2xl font-bold mb-2">Почти...</h2>
                <p className="text-gray-500 mb-4">Это не {SUSPECTS.find(s => s.id === accusedSuspect)!.name}. Настоящий виновник — Сорока Блестяшка.</p>
              </>
            )}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gray-50 rounded-2xl p-3">
                <div className="text-xl font-bold text-[#5D5FEF]">{collectedEvidence.length}/{EVIDENCE.length}</div>
                <div className="text-[10px] text-gray-400">Улик</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-3">
                <div className="text-xl font-bold text-[#FF8A65]">{interviewedSuspects.length}/{SUSPECTS.length}</div>
                <div className="text-[10px] text-gray-400">Опросов</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-3">
                <div className="text-xl font-bold text-[#00D2C4]">{hypothesis ? '✓' : '—'}</div>
                <div className="text-[10px] text-gray-400">Гипотеза</div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-4">🧠 Критическое мышление · Системный анализ · Активное слушание</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
