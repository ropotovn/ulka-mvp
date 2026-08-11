/**
 * AI Router — абстракция над AI-провайдером.
 *
 * Сейчас: Hermes (через backend API).
 * Будущее: бесшовная замена на fine-tuned локальную LLM.
 *
 * Интерфейс единый — реализация меняется.
 */

export type AIProvider = 'hermes' | 'local-llm' | 'openai';


interface AIContext {
  childName: string;
  childAge?: number;
  interests: string[];
  recentChoices: string[];
  skillScores: Record<string, number>;
  sessionHistory: string[];
}

class AIRouter {
  private provider: AIProvider = 'hermes';

  setProvider(p: AIProvider) {
    this.provider = p;
  }

  /**
   * Генерация персонализированной миссии
   */
  async generateMission(ctx: AIContext): Promise<{
    title: string; description: string; type: string;
    npcName: string; npcPhrase: string;
  }> {
    const prompt = this.buildMissionPrompt(ctx);
    return this.call(prompt);
  }

  /**
   * Анализ действия ребёнка
   */
  async analyzeAction(
    action: { type: string; choice: string; timeMs: number; context: string },
    ctx: AIContext
  ): Promise<{
    skillAffected: string;
    delta: number;
    interpretation: string;
    recommendation: string;
  }> {
    const prompt = this.buildAnalysisPrompt(action, ctx);
    return this.call(prompt);
  }

  /**
   * Генерация родительского отчёта
   */
  async generateParentReport(ctx: AIContext): Promise<{
    summary: string;
    highlights: string[];
    recommendations: string[];
    skillChart: Record<string, { before: number; after: number }>;
  }> {
    const prompt = this.buildReportPrompt(ctx);
    return this.call(prompt);
  }

  /**
   * Диалог с ребёнком (как NPC)
   */
  async npcDialog(
    npcName: string, npcPersonality: string,
    childMessage: string, ctx: AIContext
  ): Promise<string> {
    const prompt = [
      `Ты — ${npcName}, персонаж из детской образовательной игры ULKA Platform.`,
      `Твой характер: ${npcPersonality}`,
      `Ты общаешься с ребёнком по имени ${ctx.childName}.`,
      `Отвечай дружелюбно, коротко (1-2 предложения), на русском языке.`,
      `Ребёнок сказал: «${childMessage}»`,
      `Ответь, учитывая характер персонажа.`,
    ].join('\n');
    const resp = await this.call(prompt);
    return resp.text;
  }

  // ▸ Private

  private buildMissionPrompt(ctx: AIContext): string {
    return [
      'Сгенерируй короткую игровую миссию для платформы ULKA.',
      `Ребёнок: ${ctx.childName}, интересы: ${ctx.interests.join(', ')}.`,
      `Недавние выборы: ${ctx.recentChoices.join(', ')}.`,
      `Текущий профиль навыков: ${JSON.stringify(ctx.skillScores)}.`,
      'Формат ответа: JSON { title, description, type, npcName, npcPhrase }.',
      'Миссия должна быть на русском, адаптирована под возраст 8-14 лет.',
    ].join('\n');
  }

  private buildAnalysisPrompt(
    action: { type: string; choice: string; timeMs: number; context: string },
    ctx: AIContext
  ): string {
    return [
      'Проанализируй действие ребёнка в образовательной игре ULKA.',
      `Действие: ${action.type}, выбор: ${action.choice}, время: ${action.timeMs}ms.`,
      `Контекст: ${action.context}.`,
      `Профиль навыков: ${JSON.stringify(ctx.skillScores)}.`,
      'Формат: JSON { skillAffected, delta, interpretation, recommendation }.',
      'Интерпретация — 1 предложение на русском для родителя.',
      'Рекомендация — что делать родителю для развития этого навыка.',
    ].join('\n');
  }

  private buildReportPrompt(ctx: AIContext): string {
    return [
      'Составь еженедельный отчёт для родителя о прогрессе ребёнка в ULKA.',
      `Ребёнок: ${ctx.childName}.`,
      `Профиль навыков: ${JSON.stringify(ctx.skillScores)}.`,
      `История сессий: ${ctx.sessionHistory.join(' | ')}.`,
      'Формат: JSON { summary, highlights[], recommendations[], skillChart }.',
      'Пиши на русском, тёплым языком педагога-психолога.',
    ].join('\n');
  }

  /**
   * Универсальный вызов AI-провайдера.
   * Сейчас — заглушка с локальной генерацией.
   * Замени на fetch() к реальному API.
   */
  private async call(prompt: string): Promise<any> {
    switch (this.provider) {
      case 'hermes':
        // В production: fetch('/api/ai/hermes', { body: prompt })
        return this.mockResponse(prompt);
      case 'local-llm':
        // В production: fetch('http://localhost:11434/api/generate', { body: prompt })
        return this.mockResponse(prompt);
      case 'openai':
        // В production: fetch('https://api.openai.com/v1/chat/completions', { body: prompt })
        return this.mockResponse(prompt);
      default:
        return this.mockResponse(prompt);
    }
  }

  private mockResponse(prompt: string): any {
    // Заглушка для разработки
    return {
      text: 'Ответ AI-роутера (заглушка)',
      metadata: { provider: this.provider, promptLength: prompt.length },
    };
  }
}

export const ai = new AIRouter();
