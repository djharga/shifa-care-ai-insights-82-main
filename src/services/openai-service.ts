import { GoogleAIConfig, DEFAULT_GOOGLE_AI_CONFIG, validateGoogleAIConfig, createPrompt, AI_PROMPTS } from '@/config/openai-config';

export interface GoogleAIResponse {
  success: boolean;
  data?: any;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class GoogleAIService {
  private config: GoogleAIConfig;
  private retryCount: number = 0;

  constructor(config?: Partial<GoogleAIConfig>) {
    this.config = { ...DEFAULT_GOOGLE_AI_CONFIG, ...config };
  }

  // استدعاء Google AI API مع إدارة الأخطاء
  async callGoogleAI(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options?: {
      maxTokens?: number;
      temperature?: number;
      model?: string;
    }
  ): Promise<GoogleAIResponse> {
    if (!validateGoogleAIConfig(this.config)) {
      return {
        success: false,
        error: 'Google AI API key not configured'
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          contents: messages.map(msg => ({
            role: msg.role === 'system' ? 'user' : msg.role,
            parts: [{ text: msg.content }]
          })),
          generationConfig: {
            maxOutputTokens: options?.maxTokens || this.config.maxTokens,
            temperature: options?.temperature || this.config.temperature
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Google AI API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
        usage: {
          prompt_tokens: data.usageMetadata?.promptTokenCount || 0,
          completion_tokens: data.usageMetadata?.candidatesTokenCount || 0,
          total_tokens: data.usageMetadata?.totalTokenCount || 0
        }
      };

    } catch (error: any) {
      console.error('Google AI API Error:', error);
      
      // إعادة المحاولة في حالة أخطاء معينة
      if (this.shouldRetry(error) && this.retryCount < this.config.retries) {
        this.retryCount++;
        console.log(`Retrying Google AI call (${this.retryCount}/${this.config.retries})...`);
        await this.delay(1000 * this.retryCount); // تأخير متزايد
        return this.callGoogleAI(messages, options);
      }

      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  // تحليل الجلسات
  async analyzeSession(rawNotes: string): Promise<GoogleAIResponse> {
    const prompt = createPrompt(AI_PROMPTS.SESSION_ANALYSIS, {
      rawNotes
    });

    return this.callGoogleAI([
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
  }): Promise<GoogleAIResponse> {
    const prompt = createPrompt(AI_PROMPTS.TREATMENT_PLAN, {
      patientName: patientData.name,
      age: patientData.age.toString(),
      addictionType: patientData.addictionType,
      currentStatus: patientData.currentStatus,
      riskFactors: patientData.riskFactors.join(', ')
    });

    return this.callGoogleAI([
      { role: 'system', content: AI_PROMPTS.TREATMENT_PLAN.system },
      { role: 'user', content: prompt }
    ]);
  }

  // تقييم مخاطر الانتكاس
  async assessRelapseRisk(patientData: string, sessionsHistory: string): Promise<GoogleAIResponse> {
    const prompt = createPrompt(AI_PROMPTS.RELAPSE_RISK, {
      patientData,
      sessionsHistory
    });

    return this.callGoogleAI([
      { role: 'system', content: AI_PROMPTS.RELAPSE_RISK.system },
      { role: 'user', content: prompt }
    ]);
  }

  // إنشاء تقرير ذكي
  async generateSmartReport(reportType: string, patientId: string): Promise<GoogleAIResponse> {
    const prompt = createPrompt(AI_PROMPTS.SMART_REPORT, {
      reportType,
      patientId
    });

    return this.callGoogleAI([
      { role: 'system', content: AI_PROMPTS.SMART_REPORT.system },
      { role: 'user', content: prompt }
    ]);
  }

  // اقتراح أنشطة علاجية
  async suggestActivities(patientProfile: string, sessionResults: string): Promise<GoogleAIResponse> {
    const prompt = createPrompt(AI_PROMPTS.THERAPEUTIC_ACTIVITIES, {
      patientProfile,
      sessionResults
    });

    return this.callGoogleAI([
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
  ): Promise<GoogleAIResponse> {
    return this.callGoogleAI([
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
  updateConfig(newConfig: Partial<GoogleAIConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.retryCount = 0; // إعادة تعيين عداد المحاولات
  }

  // الحصول على الإعدادات الحالية
  getConfig(): GoogleAIConfig {
    return { ...this.config };
  }
}

// تصدير نسخة افتراضية من الخدمة
export const googleAIService = new GoogleAIService(); 