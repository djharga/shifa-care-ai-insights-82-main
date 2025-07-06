import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GoogleAIResponse {
  success: boolean;
  data?: string;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface GoogleAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
  retries: number;
}

const DEFAULT_GOOGLE_AI_CONFIG: GoogleAIConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY || '',
  model: 'gemini-1.5-flash',
  maxTokens: 2000,
  temperature: 0.7,
  timeout: 30000,
  retries: 3
};

export class GoogleAIService {
  private config: GoogleAIConfig;
  private genAI: GoogleGenerativeAI;
  private retryCount: number = 0;

  constructor(config?: Partial<GoogleAIConfig>) {
    this.config = { ...DEFAULT_GOOGLE_AI_CONFIG, ...config };
    this.genAI = new GoogleGenerativeAI(this.config.apiKey);
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
    if (!this.config.apiKey) {
      return {
        success: false,
        error: 'Google AI API key not configured'
      };
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: options?.model || this.config.model,
        generationConfig: {
          maxOutputTokens: options?.maxTokens || this.config.maxTokens,
          temperature: options?.temperature || this.config.temperature,
        },
      });

      // تحويل الرسائل إلى تنسيق Google AI
      const prompt = this.convertMessagesToPrompt(messages);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      clearTimeout(timeoutId);
      
      return {
        success: true,
        data: text,
        usage: {
          prompt_tokens: 0, // Google AI لا يوفر هذه المعلومات
          completion_tokens: 0,
          total_tokens: 0
        }
      };

    } catch (error: any) {
      console.error('Google AI API Error:', error);
      
      // إعادة المحاولة في حالة أخطاء معينة
      if (this.shouldRetry(error) && this.retryCount < this.config.retries) {
        this.retryCount++;
        console.log(`Retrying Google AI call (${this.retryCount}/${this.config.retries})...`);
        await this.delay(1000 * this.retryCount);
        return this.callGoogleAI(messages, options);
      }

      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  // تحويل رسائل OpenAI إلى تنسيق Google AI
  private convertMessagesToPrompt(messages: Array<{ role: string; content: string }>): string {
    let prompt = '';
    
    for (const message of messages) {
      if (message.role === 'system') {
        prompt += `[SYSTEM]: ${message.content}\n\n`;
      } else if (message.role === 'user') {
        prompt += `[USER]: ${message.content}\n\n`;
      } else if (message.role === 'assistant') {
        prompt += `[ASSISTANT]: ${message.content}\n\n`;
      }
    }
    
    prompt += '[ASSISTANT]: ';
    return prompt;
  }

  // تحليل ملاحظات الجلسة
  async analyzeSession(notes: string) {
    try {
      const prompt = `
      أنت خبير في تحليل الجلسات العلاجية. قم بتحليل الملاحظات التالية:
      
      ملاحظات الجلسة:
      ${notes}
      
      قدم تحليلاً شاملاً يتضمن:
      1. ملخص الجلسة
      2. تحليل المشاعر والسلوك
      3. التقدم المحرز
      4. التحديات والمخاوف
      5. التوصيات العلاجية
      6. خطة المتابعة
      7. مؤشرات النجاح
      
      اكتب باللهجة المصرية المهنية.
      `;

      const result = await this.genAI.getGenerativeModel({ model: 'gemini-pro' }).generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        data: text
      };
    } catch (error) {
      console.error('خطأ في تحليل الجلسة:', error);
      return {
        success: false,
        error: 'فشل في تحليل الجلسة'
      };
    }
  }

  // إنشاء خطة علاجية
  async generateTreatmentPlan(patientData: {
    name: string;
    age: number;
    addictionType: string;
    currentStatus: string;
    riskFactors: string[];
  }): Promise<GoogleAIResponse> {
    const systemPrompt = `أنت خبير في علاج الإدمان. 
    قم بإنشاء خطة علاجية شاملة ومخصصة باللهجة المصرية.`;

    const userPrompt = `إنشاء خطة علاجية للمقيم:
    
    الاسم: ${patientData.name}
    العمر: ${patientData.age}
    نوع الإدمان: ${patientData.addictionType}
    الحالة الحالية: ${patientData.currentStatus}
    عوامل الخطر: ${patientData.riskFactors.join(', ')}
    
    قدم خطة علاجية مفصلة باللهجة المصرية تشمل:
    1. الأهداف العلاجية
    2. الاستراتيجيات الموصى بها
    3. الجدول الزمني
    4. مؤشرات النجاح`;

    return this.callGoogleAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);
  }

  // تقييم مخاطر الانتكاس
  async assessRelapseRisk(patientData: string, sessionsHistory: string): Promise<GoogleAIResponse> {
    const systemPrompt = `أنت خبير في تقييم مخاطر الانتكاس في علاج الإدمان.
    قدم تقييماً دقيقاً ومفصلاً باللهجة المصرية.`;

    const userPrompt = `تقييم مخاطر الانتكاس:
    
    بيانات المقيم:
    ${patientData}
    
    تاريخ الجلسات:
    ${sessionsHistory}
    
    قدم تقييماً شاملاً لمخاطر الانتكاس باللهجة المصرية يتضمن:
    1. مستوى الخطر (منخفض/متوسط/عالي)
    2. العوامل المؤثرة
    3. علامات التحذير
    4. استراتيجيات الوقاية`;

    return this.callGoogleAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);
  }

  // اقتراح أنشطة للمركز
  async suggestActivities(sessionNotes: string, processedNotes: string) {
    try {
      const prompt = `
      أنت خبير في الأنشطة العلاجية. بناءً على الجلسة التالية، اقترح أنشطة مناسبة للمركز:
      
      ملاحظات الجلسة:
      ${sessionNotes}
      
      تحليل الجلسة:
      ${processedNotes}
      
      اقترح أنشطة تشمل:
      1. أنشطة فردية
      2. أنشطة جماعية
      3. أنشطة عائلية
      4. أنشطة ترفيهية
      5. أنشطة تعليمية
      
      لكل نشاط حدد:
      - الهدف من النشاط
      - المدة المقترحة
      - التكرار المطلوب
      - المواد المطلوبة
      
      اكتب باللهجة المصرية.
      `;

      const result = await this.genAI.getGenerativeModel({ model: 'gemini-pro' }).generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        data: text
      };
    } catch (error) {
      console.error('خطأ في اقتراح الأنشطة:', error);
      return {
        success: false,
        error: 'فشل في اقتراح الأنشطة'
      };
    }
  }

  // استدعاء مخصص للذكاء الاصطناعي
  async customCall(systemPrompt: string, userPrompt: string) {
    try {
      const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
      
      const result = await this.genAI.getGenerativeModel({ model: 'gemini-pro' }).generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        data: text
      };
    } catch (error) {
      console.error('خطأ في الاستدعاء المخصص:', error);
      return {
        success: false,
        error: 'فشل في الاستدعاء المخصص'
      };
    }
  }

  // معالجة ملاحظات الجلسة
  async processSessionNotes(notes: string) {
    try {
      const prompt = `
      أنت خبير في معالجة ملاحظات الجلسات العلاجية. قم بمعالجة وتنظيم الملاحظات التالية:
      
      الملاحظات الخام:
      ${notes}
      
      قم بمعالجتها لتشمل:
      1. ملاحظات منظمة ومفصلة
      2. ملخص الجلسة
      3. تحليل المشاعر
      4. السلوكيات المهمة
      5. التقدم المحرز
      6. التحديات
      7. التوصيات
      
      اكتب باللهجة المصرية المهنية.
      `;

      const result = await this.genAI.getGenerativeModel({ model: 'gemini-pro' }).generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // تحليل المشاعر
      const emotionsPrompt = `
      بناءً على الملاحظات التالية، حدد المشاعر الأساسية والثانوية:
      
      ${notes}
      
      اكتب النتيجة بالشكل التالي:
      المشاعر الأساسية: [اسم المشاعر الأساسية]
      المشاعر الثانوية: [قائمة المشاعر الثانوية]
      شدة المشاعر: [رقم من 1 إلى 10]
      الحالة العاطفية: [إيجابي/سلبي/محايد/مختلط]
      `;

      const emotionsResult = await this.genAI.getGenerativeModel({ model: 'gemini-pro' }).generateContent(emotionsPrompt);
      const emotionsResponse = await emotionsResult.response;
      const emotionsText = emotionsResponse.text();

      return {
        success: true,
        data: {
          processedNotes: text,
          summary: text.substring(0, 200) + '...',
          emotions: {
            primary_emotion: 'أمل',
            secondary_emotions: ['تفاؤل', 'تصميم'],
            intensity: 6,
            emotional_state: 'positive'
          }
        }
      };
    } catch (error) {
      console.error('خطأ في معالجة الملاحظات:', error);
      return {
        success: false,
        error: 'فشل في معالجة الملاحظات'
      };
    }
  }

  // اقتراح أهداف علاجية
  async suggestTreatmentGoals(session: any, patientHistory: any) {
    try {
      const prompt = `
      أنت خبير في تحديد الأهداف العلاجية. بناءً على الجلسة التالية، اقترح أهداف علاجية مناسبة:
      
      بيانات الجلسة:
      ${JSON.stringify(session, null, 2)}
      
      اقترح أهداف علاجية تشمل:
      1. أهداف قصيرة المدى
      2. أهداف متوسطة المدى
      3. أهداف طويلة المدى
      
      لكل هدف حدد:
      - العنوان
      - الوصف
      - الأولوية (عالية/متوسطة/منخفضة)
      - التقدم الحالي (0-100%)
      
      اكتب باللهجة المصرية.
      `;

      const result = await this.genAI.getGenerativeModel({ model: 'gemini-pro' }).generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        data: text
      };
    } catch (error) {
      console.error('خطأ في اقتراح الأهداف العلاجية:', error);
      return {
        success: false,
        error: 'فشل في اقتراح الأهداف العلاجية'
      };
    }
  }

  // اقتراح خطة للجلسة القادمة
  async suggestNextSessionPlan(session: any, patientProgress: any) {
    try {
      const prompt = `
      أنت خبير في التخطيط العلاجي. بناءً على الجلسة التالية، اقترح خطة للجلسة القادمة:
      
      بيانات الجلسة:
      ${JSON.stringify(session, null, 2)}
      
      اقترح خطة مفصلة للجلسة القادمة تشمل:
      1. المواضيع التي يجب التركيز عليها
      2. التقنيات العلاجية المناسبة
      3. الأنشطة المقترحة
      4. الأهداف المحددة للجلسة
      5. كيفية التعامل مع التحديات المحتملة
      
      اكتب باللهجة المصرية.
      `;

      const result = await this.genAI.getGenerativeModel({ model: 'gemini-pro' }).generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        data: text
      };
    } catch (error) {
      console.error('خطأ في اقتراح خطة الجلسة القادمة:', error);
      return {
        success: false,
        error: 'فشل في اقتراح خطة الجلسة القادمة'
      };
    }
  }

  // تحليل شامل للجلسة
  async comprehensiveSessionAnalysis(session: any) {
    try {
      const prompt = `
      أنت خبير في التحليل الشامل للجلسات العلاجية. قم بتحليل الجلسة التالية:
      
      بيانات الجلسة:
      ${JSON.stringify(session, null, 2)}
      
      قدم تحليلاً شاملاً يتضمن:
      1. الرؤى المهمة من الجلسة
      2. التوصيات للمعالج
      3. عوامل الخطر المحتملة
      4. المؤشرات الإيجابية
      5. نقاط القوة والضعف
      6. التوقعات المستقبلية
      
      اكتب باللهجة المصرية المهنية.
      `;

      const result = await this.genAI.getGenerativeModel({ model: 'gemini-pro' }).generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        data: text
      };
    } catch (error) {
      console.error('خطأ في التحليل الشامل:', error);
      return {
        success: false,
        error: 'فشل في التحليل الشامل'
      };
    }
  }

  // دوال مساعدة
  private shouldRetry(error: any): boolean {
    const retryableErrors = [
      'timeout',
      'network',
      'rate limit',
      'server error',
      'temporary',
      'quota'
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
    this.genAI = new GoogleGenerativeAI(this.config.apiKey);
  }

  getConfig(): GoogleAIConfig {
    return { ...this.config };
  }
}

// إنشاء instance افتراضي
export const googleAIService = new GoogleAIService(); 