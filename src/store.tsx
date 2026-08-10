import { useState, createContext, useContext, ReactNode } from 'react';

export type Interest = 'sport' | 'tech' | 'art' | 'music' | 'friends' | 'games';

// ───── 20+ МЕТАНАВЫКОВ из питч-дека ─────
export const SKILL_CATEGORIES = {
  thinking: {
    name: 'Мышление',
    icon: '🧠',
    skills: {
      critical_thinking: 'Критическое мышление',
      creativity: 'Креативность',
      problem_solving: 'Решение проблем',
      systems_thinking: 'Системное мышление',
    },
  },
  communication: {
    name: 'Коммуникация',
    icon: '💬',
    skills: {
      clarity: 'Ясность изложения',
      active_listening: 'Активное слушание',
      persuasion: 'Убеждение',
      teamwork: 'Работа в команде',
    },
  },
  self_regulation: {
    name: 'Саморегуляция',
    icon: '🧘',
    skills: {
      emotional_intelligence: 'Эмоциональный интеллект',
      stress_resilience: 'Стрессоустойчивость',
      self_organization: 'Самоорганизация',
      focus: 'Фокус внимания',
    },
  },
  social: {
    name: 'Социальные',
    icon: '🤝',
    skills: {
      leadership: 'Лидерство',
      empathy: 'Эмпатия',
      negotiation: 'Переговоры',
      conflict_resolution: 'Разрешение конфликтов',
    },
  },
  adaptability: {
    name: 'Адаптивность',
    icon: '🔄',
    skills: {
      flexibility: 'Гибкость',
      learning_ability: 'Обучаемость',
      initiative: 'Инициативность',
      responsibility: 'Ответственность',
    },
  },
} as const;

export const CATEGORY_COLORS: Record<string, string> = {
  thinking: '#5D5FEF',
  communication: '#00D2C4',
  self_regulation: '#FF8A65',
  social: '#F59E0B',
  adaptability: '#10B981',
};

interface Theme {
  name: string; accent: string; badgeColor: string;
  npcName: string; npcEmoji: string; npcPhrase: string;
}

interface MissionChoice {
  id: 'A' | 'B' | 'C';
  text: string;
  metricTracked: 'leadership' | 'focus_attention' | 'empathy_sel';
  feedback: string;
}

interface Mission {
  questTitle: string; questText: string; npcPhrase: string;
  choices: MissionChoice[];
}

interface LogEntry {
  timestamp: string; choiceId: string; metric: string; rt: number; feedback: string;
}

interface AppState {
  view: 'onboarding' | 'child' | 'parent';
  interest: Interest | null;
  theme: Theme | null;
  mission: Mission | null;
  log: LogEntry[];
  skillScores: Record<string, number>;
  childName: string;
  firstName: string;
  setView: (v: 'onboarding' | 'child' | 'parent') => void;
  setInterest: (i: Interest) => void;
  selectChoice: (choice: MissionChoice) => void;
  setChildName: (n: string) => void;
  setFirstName: (n: string) => void;
}

const AppCtx = createContext<AppState>(null!);
export const useApp = () => useContext(AppCtx);

function genInitialScores(): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const cat of Object.values(SKILL_CATEGORIES)) {
    for (const [key] of Object.entries(cat.skills)) {
      scores[key] = Math.floor(Math.random() * 35 + 30); // 30-65 base
    }
  }
  return scores;
}

const MISSION_DB: Record<Interest, Mission> = {
  sport: {
    questTitle: 'Капитанский кризис на поле 🏆',
    questText: 'Твоя команда проигрывает важный матч. В перерыве лучший нападающий <b>сильно расстроился</b> из-за промаха и хочет уйти со стадиона. Что ты сделаешь как капитан?',
    npcPhrase: 'Эй! Команда теряет настрой перед финалом. Нужен лидер!',
    choices: [
      { id: 'A', text: 'Сказать: «Мы одна команда! Твой промах — общий опыт. Соберёмся и отыграемся!»', metricTracked: 'leadership', feedback: 'Лидерство +1: Мотивация команды через поддержку.' },
      { id: 'B', text: 'Спокойно изучить расстановку соперника и предложить новую тактику атаки.', metricTracked: 'focus_attention', feedback: 'Внимание +1: Анализ ситуации без лишних эмоций.' },
      { id: 'C', text: 'Сесть рядом, выслушать его обиду, дать воды и сказать, что понимаешь его чувства.', metricTracked: 'empathy_sel', feedback: 'Эмпатия +1: Распознавание чужих эмоций.' },
    ],
  },
  tech: {
    questTitle: 'Сбой на Хакатоне 🚀',
    questText: 'Вы программируете робота для выставки. За 10 минут до старта код полностью <b>ломается из-за ошибки</b> напарника. Он замер в ступоре от страха. Твои действия?',
    npcPhrase: 'Мои нейросети обнаружили критический сбой в коде проекта!',
    choices: [
      { id: 'A', text: 'Сказать: «Без паники! Я беру презентацию на себя, а ты открывай бэкап кода».', metricTracked: 'leadership', feedback: 'Лидерство +1: Управление командой в цейтноте.' },
      { id: 'B', text: 'Открыть консоль и строчка за строчкой искать синтаксическую ошибку.', metricTracked: 'focus_attention', feedback: 'Внимание +1: Поиск ошибок, концентрация.' },
      { id: 'C', text: 'Сказать напарнику: «Спокойно, ты крутой кодер, мы найдем этот баг вместе».', metricTracked: 'empathy_sel', feedback: 'Эмпатия +1: Стабилизация эмоций партнёра.' },
    ],
  },
  art: {
    questTitle: 'Испорченное граффити 🧱', questText: 'Вы рисуете большой мурал. Прохожий задел банку с краской и <b>залил центр</b> эскиза. Что делаешь?',
    npcPhrase: 'Краски разлились, но истинный художник видит в этом шедевр!',
    choices: [
      { id: 'A', text: 'Организовать команду, раздать кисти и переделать кляксу в стильную тень.', metricTracked: 'leadership', feedback: 'Лидерство +1: Креативное управление кризисом.' },
      { id: 'B', text: 'Изучить края пятна — можно ли аккуратно соскоблить слой до высыхания.', metricTracked: 'focus_attention', feedback: 'Внимание +1: Анализ параметров задачи.' },
      { id: 'C', text: 'Подойти к плачущей девочке, чей кусок рисунка пострадал, и успокоить её.', metricTracked: 'empathy_sel', feedback: 'Эмпатия +1: Поддержка автора.' },
    ],
  },
  music: {
    questTitle: 'Шоу должно продолжаться 🎸', questText: 'Ваша группа на сцене. У гитариста рвётся струна, он в панике замер. Толпа перешёптывается. Что делаешь?',
    npcPhrase: 'Ритм сбился, а до конца концерта всего пара песен!',
    choices: [
      { id: 'A', text: 'Выйти вперёд, завести толпу хлопками, пока гитарист меняет инструмент.', metricTracked: 'leadership', feedback: 'Лидерство +1: Удержание инициативы на публике.' },
      { id: 'B', text: 'Сфокусироваться на своей партии и продолжать играть без ошибок.', metricTracked: 'focus_attention', feedback: 'Внимание +1: Помехоустойчивость.' },
      { id: 'C', text: 'Подойти к гитаристу, ободряюще улыбнуться и поддержать.', metricTracked: 'empathy_sel', feedback: 'Эмпатия +1: Поддержка в стрессе.' },
    ],
  },
  friends: {
    questTitle: 'Спор посреди парка 🎡', questText: 'Вы гуляете компанией. Половина хочет в комнату страха, а один друг <b>очень боится</b> и стесняется сказать.',
    npcPhrase: 'Когда друзей много, всегда сложно выбрать!',
    choices: [
      { id: 'A', text: 'Предложить компромисс: сначала тир, потом делимся по интересам.', metricTracked: 'leadership', feedback: 'Лидерство +1: Решение групповых конфликтов.' },
      { id: 'B', text: 'Посчитать по карте время очередей и оптимизировать маршрут.', metricTracked: 'focus_attention', feedback: 'Внимание +1: Аналитическое планирование.' },
      { id: 'C', text: 'Громко сказать: «Выберем то, что нравится всем, чтобы никому не было страшно».', metricTracked: 'empathy_sel', feedback: 'Эмпатия +1: Защита чужих границ.' },
    ],
  },
  games: {
    questTitle: 'Финальный рейд в кибермире ⚔️', questText: 'Друг случайно <b>удалил редкую броню</b> гильдии. Он напуган и молчит. Твои действия?',
    npcPhrase: 'О нет! Наш клан застрял на боссе. Нужен план!',
    choices: [
      { id: 'A', text: 'Взять управление, распределить новые роли и перезапустить рейд.', metricTracked: 'leadership', feedback: 'Лидерство +1: Антикризисное управление.' },
      { id: 'B', text: 'Просчитать по логам, за сколько минут нафармим новую броню.', metricTracked: 'focus_attention', feedback: 'Внимание +1: Аналитический фокус.' },
      { id: 'C', text: 'Написать в ЛС: «Это просто пиксели, не переживай, всё исправим вместе!»', metricTracked: 'empathy_sel', feedback: 'Эмпатия +1: Снижение стресса.' },
    ],
  },
};

const THEME_DB: Record<Interest, Theme> = {
  sport: { name: 'Спортивная Академия', accent: '#5D5FEF', badgeColor: '#5D5FEF', npcName: 'Тренер Макс', npcEmoji: '🏃‍♂️', npcPhrase: '' },
  tech: { name: 'Лаборатория Будущего', accent: '#5D5FEF', badgeColor: '#1F2937', npcName: 'ИИ Эва', npcEmoji: '🤖', npcPhrase: '' },
  art: { name: 'Арт-Креатив', accent: '#5D5FEF', badgeColor: '#5D5FEF', npcName: 'Муза Кира', npcEmoji: '🎨', npcPhrase: '' },
  music: { name: 'Музыкальная Студия', accent: '#FF8A65', badgeColor: '#FF8A65', npcName: 'Диджей Волна', npcEmoji: '🎧', npcPhrase: '' },
  friends: { name: 'Клуб Друзей', accent: '#00D2C4', badgeColor: '#00D2C4', npcName: 'Аватар Дружбы', npcEmoji: '👥', npcPhrase: '' },
  games: { name: 'Игровая Вселенная', accent: '#00D2C4', badgeColor: '#00D2C4', npcName: 'Гейм-мастер Пиксель', npcEmoji: '👾', npcPhrase: '' },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AppState['view']>('onboarding');
  const [interest, setInterest] = useState<Interest | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [mission, setMission] = useState<Mission | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [skillScores, setSkillScores] = useState<Record<string, number>>(genInitialScores());
  const [childName, setChildName] = useState('');
  const [firstName, setFirstName] = useState('');

  const handleSetInterest = (i: Interest) => {
    setInterest(i);
    const t = { ...THEME_DB[i] };
    const m = MISSION_DB[i];
    t.npcPhrase = m.npcPhrase;
    setTheme(t);
    setMission(m);
    setLog([]);
    setView('child');
  };

  const selectChoice = (choice: MissionChoice) => {
    const ts = new Date().toLocaleTimeString();
    const rt = Math.floor(Math.random() * 1800 + 1200);
    const entry: LogEntry = { timestamp: ts, choiceId: choice.id, metric: choice.metricTracked, rt, feedback: choice.feedback };
    setLog(prev => [entry, ...prev]);
    setSkillScores(prev => ({
      ...prev,
      [choice.metricTracked === 'leadership' ? 'leadership' : choice.metricTracked === 'focus_attention' ? 'focus' : 'empathy']:
        Math.min(100, (prev[choice.metricTracked === 'leadership' ? 'leadership' : choice.metricTracked === 'focus_attention' ? 'focus' : 'empathy'] || 0) + 5),
    }));
  };

  return (
    <AppCtx.Provider value={{ view, interest, theme, mission, log, skillScores, childName, firstName, setView, setInterest: handleSetInterest, selectChoice, setChildName, setFirstName }}>
      {children}
    </AppCtx.Provider>
  );
}
