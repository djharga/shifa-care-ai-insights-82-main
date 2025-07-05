import { OpenAIConfig, DEFAULT_OPENAI_CONFIG, validateOpenAIConfig, createPrompt, AI_PROMPTS } from '@/config/openai-config';

export interface OpenAIResponse {
  success: boolean;
  data?: any;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIService {
  private config: OpenAIConfig;
  private retryCount: number = 0;

  constructor(config?: Partial<OpenAIConfig>) {
    this.config = { ...DEFAULT_OPENAI_CONFIG, ...config };
  }

  // استدعاء OpenAI API مع إدارة الأخطاء
  async callOpenAI(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options?: {
      maxTokens?: number;
      temperature?: number;
      model?: string;
    }
  ): Promise<OpenAIResponse> {
    if (!validateOpenAIConfig(this.config)) {
      return {
        success: false,
        error: 'OpenAI API key not configured'
      };
    }

    const requestConfig = {
      model: options?.model || this.config.model,
      messages,
      max_tokens: options?.maxTokens || this.config.maxTokens,
      temperature: options?.temperature || this.config.temperature
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify(requestConfig),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data.choices?.[0]?.message?.content || '',
        usage: data.usage
      };

    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      
      // إعادة المحاولة في حالة أخطاء معينة
      if (this.shouldRetry(error) && this.retryCount < this.config.retries) {
        this.retryCount++;
        console.log(`Retrying OpenAI call (${this.retryCount}/${this.config.retries})...`);
        await this.delay(1000 * this.retryCount); // تأخير متزايد
        return this.callOpenAI(messages, options);
      }

      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  // تحليل الجلسات
  async analyzeSession(rawNotes: string): Promise<OpenAIResponse> {
    const prompt = createPrompt(AI_PROMPTS.SESSION_ANALYSIS, {
      rawNotes
    });

    return this.callOpenAI([
      { role: 'system', content: AI_PROMPTS.SESSION_ANALYSIS.system },
      { role: 'user', content: prompt }
    ]);
  }

  // إنشاء خطة علاجية
  async generateTreatmentPlan(patientData: {
    name: string;
    age: number;
    addictionType: string;
    currentStatus: string;
    riskFactors: string[];
  }): Promise<OpenAIResponse> {
    const prompt = createPrompt(AI_PROMPTS.TREATMENT_PLAN, {
      patientName: patientData.name,
      age: patientData.age.toString(),
      addictionType: patientData.addictionType,
      currentStatus: patientData.currentStatus,
      riskFactors: patientData.riskFactors.join(', ')
    });

    return this.callOpenAI([
      { role: 'system', content: AI_PROMPTS.TREATMENT_PLAN.system },
      { role: 'user', content: prompt }
    ]);
  }

  // تقييم مخاطر الانتكاس
  async assessRelapseRisk(patientData: string, sessionsHistory: string): Promise<OpenAIResponse> {
    const prompt = createPrompt(AI_PROMPTS.RELAPSE_RISK, {
      patientData,
      sessionsHistory
    });

    return this.callOpenAI([
      { role: 'system', content: AI_PROMPTS.RELAPSE_RISK.system },
      { role: 'user', content: prompt }
    ]);
  }

  // إنشاء تقرير ذكي
  async generateSmartReport(reportType: string, patientId: string): Promise<OpenAIResponse> {
    const prompt = createPrompt(AI_PROMPTS.SMART_REPORT, {
      reportType,
      patientId
    });

    return this.callOpenAI([
      { role: 'system', content: AI_PROMPTS.SMART_REPORT.system },
      { role: 'user', content: prompt }
    ]);
  }

  // اقتراح أنشطة علاجية
  async suggestActivities(patientProfile: string, sessionResults: string): Promise<OpenAIResponse> {
    const prompt = createPrompt(AI_PROMPTS.THERAPEUTIC_ACTIVITIES, {
      patientProfile,
      sessionResults
    });

    return this.callOpenAI([
      { role: 'system', content: AI_PROMPTS.THERAPEUTIC_ACTIVITIES.system },
      { role: 'user', content: prompt }
    ]);
  }

  // استدعاء مخصص
  async customCall(
    systemPrompt: string,
    userPrompt: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
      model?: string;
    }
  ): Promise<OpenAIResponse> {
    return this.callOpenAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], options);
  }

  // دوال مساعدة
  private shouldRetry(error: any): boolean {
    const retryableErrors = [
      'timeout',
      'network',
      'rate limit',
      'server error',
      'temporary'
    ];
    
    return retryableErrors.some(keyword => 
      error.message?.toLowerCase().includes(keyword)
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // تحديث الإعدادات
  updateConfig(newConfig: Partial<OpenAIConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // الحصول على الإعدادات الحالية
  getConfig(): OpenAIConfig {
    return { ...this.config };
  }
}

// إنشاء instance افتراضي
export const openAIService = new OpenAIService(); 