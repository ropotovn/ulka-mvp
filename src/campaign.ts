// ───── CAMPAIGN TYPES ─────

export type RoleId = 'leader' | 'analyst' | 'empath' | 'creator' | 'strategist';

export interface Role {
  id: RoleId;
  name: string;
  emoji: string;
  color: string;
  description: string;
  metaskills: string[];
  powerName: string;
  powerDescription: string;
}

export const ROLES: Role[] = [
  {
    id: 'leader',
    name: 'Капитан',
    emoji: '🛡️',
    color: '#5D5FEF',
    description: 'Ведёт команду, принимает решения в кризис, распределяет ресурсы.',
    metaskills: ['leadership', 'negotiation', 'responsibility'],
    powerName: 'Боевой клич',
    powerDescription: 'Один раз за кампанию — перебросить неудачный исход испытания.',
  },
  {
    id: 'analyst',
    name: 'Шифровальщик',
    emoji: '🔍',
    color: '#00D2C4',
    description: 'Ищет закономерности, решает логические загадки, замечает детали.',
    metaskills: ['critical_thinking', 'problem_solving', 'focus'],
    powerName: 'Дешифратор',
    powerDescription: 'Получить подсказку к любому логическому испытанию.',
  },
  {
    id: 'empath',
    name: 'Дипломат',
    emoji: '💜',
    color: '#FF8A65',
    description: 'Понимает эмоции, договаривается с NPC, сглаживает конфликты.',
    metaskills: ['empathy', 'emotional_intelligence', 'conflict_resolution'],
    powerName: 'Эмпатическая связь',
    powerDescription: 'Узнать истинные намерения NPC перед диалогом.',
  },
  {
    id: 'creator',
    name: 'Изобретатель',
    emoji: '🎨',
    color: '#F59E0B',
    description: 'Придумывает нестандартные решения, создаёт инструменты из подручных средств.',
    metaskills: ['creativity', 'initiative', 'systems_thinking'],
    powerName: 'Эврика!',
    powerDescription: 'Превратить провал в успех, предложив альтернативное решение.',
  },
  {
    id: 'strategist',
    name: 'Тактик',
    emoji: '⚡',
    color: '#10B981',
    description: 'Планирует наперёд, считает ресурсы, оптимизирует маршрут.',
    metaskills: ['strategic_thinking', 'self_organization', 'flexibility'],
    powerName: 'План Б',
    powerDescription: 'Заранее подготовить запасной план для одного узла карты.',
  },
];

// ───── CHALLENGE TYPES ─────

export type ChallengeType = 'logic' | 'social' | 'creative' | 'strategy';

export interface ChallengeNode {
  id: number;
  type: ChallengeType;
  title: string;
  description: string;
  bestRole: RoleId;
  x: number; // position on board 0-100
  y: number; // position 0-100
}

export interface CampaignChapter {
  id: number;
  title: string;
  theme: string;
  nodes: ChallengeNode[];
}

// ───── CAMPAIGNS ─────

export const CAMPAIGNS: CampaignChapter[] = [
  {
    id: 1,
    title: 'Глава I: Пробуждение',
    theme: 'Древний лес, где пробудились забытые механизмы.',
    nodes: [
      { id: 1, type: 'logic', title: 'Шифр на вратах', description: 'Древние врата покрыты рунами. Нужно найти закономерность, чтобы открыть проход.', bestRole: 'analyst', x: 25, y: 60 },
      { id: 2, type: 'social', title: 'Лесной дух', description: 'Дух леса преграждает путь. Он зол на пришельцев. Нужно его успокоить.', bestRole: 'empath', x: 40, y: 30 },
      { id: 3, type: 'creative', title: 'Сломанный мост', description: 'Мост через пропасть разрушен. Нужно придумать, как перебраться из подручных материалов.', bestRole: 'creator', x: 55, y: 65 },
      { id: 4, type: 'strategy', title: 'Развилка судьбы', description: 'Три пути ведут к цели. У каждого — свои опасности и награды. Какой выбрать?', bestRole: 'strategist', x: 70, y: 40 },
      { id: 5, type: 'logic', title: 'Механизм древних', description: 'В центре леса — гигантский механизм. Нужно активировать 4 рычага в правильном порядке.', bestRole: 'analyst', x: 85, y: 55 },
    ],
  },
];
