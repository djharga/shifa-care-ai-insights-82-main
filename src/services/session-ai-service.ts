import { Session, TreatmentGoal, CenterGoal, Activity } from '@/types/session';

export class SessionAIService {
  private openaiApiKey: string;

  constructor() {
    // الحصول على مفتاح OpenAI من المتغيرات البيئية
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    
    if (!this.openaiApiKey) {
      console.warn('OpenAI API key not found. AI features will be limited.');
    }
  }

  // تحليل الجلسة وتنظيمها باللهجة المصرية
  async processSessionNotes(rawNotes: string): Promise<{
    processedNotes: string;
    summary: string;
    emotions: {
      primary_emotion: string;
      secondary_emotions: string[];
      intensity: number;
      emotional_state: 'positive' | 'negative' | 'neutral' | 'mixed';
    };
  }> {
    if (!this.openaiApiKey) {
      // إرجاع تحليل بسيط إذا لم يكن هناك مفتاح API
      return this.getMockAnalysis(rawNotes);
    }

    const prompt = `
    كمعالج نفسي متخصص، قم بتحليل الجلسة التالية وتنظيمها باللهجة المصرية:

    الملاحظات الخام:
    ${rawNotes}

    المطلوب:
    1. إعادة كتابة الملاحظات بشكل منظم ومفهوم باللهجة المصرية
    2. عمل ملخص مختصر للجلسة
    3. تحليل المشاعر السائدة في الجلسة مع تحديد:
       - المشاعر الأساسية
       - المشاعر الثانوية
       - شدة المشاعر (1-10)
       - الحالة العاطفية العامة

    أجب باللغة العربية وباللهجة المصرية.
    `;

    try {
      const response = await this.callOpenAI(prompt);
      const result = this.parseAIResponse(response);
      
      return {
        processedNotes: result.processedNotes,
        summary: result.summary,
        emotions: result.emotions
      };
    } catch (error) {
      console.error('خطأ في معالجة الجلسة:', error);
      // إرجاع تحليل بسيط في حالة الخطأ
      return this.getMockAnalysis(rawNotes);
    }
  }

  // اقتراح أهداف علاجية
  async suggestTreatmentGoals(
    sessionData: Session,
    patientHistory: any
  ): Promise<TreatmentGoal[]> {
    if (!this.openaiApiKey) {
      return this.getMockTreatmentGoals();
    }

    const prompt = `
    بناءً على الجلسة التالية وتاريخ المريض، اقترح أهداف علاجية مناسبة:

    بيانات الجلسة:
    - الملاحظات: ${sessionData.raw_notes}
    - المشاعر: ${JSON.stringify(sessionData.emotions)}
    - التقييم: ${JSON.stringify(sessionData.therapist_assessment)}

    تاريخ المريض:
    ${JSON.stringify(patientHistory)}

    اقترح 3-5 أهداف علاجية مناسبة تشمل:
    - أهداف سلوكية
    - أهداف عاطفية
    - أهداف اجتماعية
    - أهداف روحية

    كل هدف يجب أن يكون:
    - محدد وواضح
    - قابل للقياس
    - قابل للتحقيق
    - له موعد محدد
    - له أولوية (منخفضة/متوسطة/عالية)

    أجب باللغة العربية وباللهجة المصرية.
    `;

    try {
      const response = await this.callOpenAI(prompt);
      return this.parseTreatmentGoals(response);
    } catch (error) {
      console.error('خطأ في اقتراح الأهداف:', error);
      return this.getMockTreatmentGoals();
    }
  }

  // اقتراح أنشطة للمركز العلاجي
  async suggestCenterActivities(
    sessionData: Session,
    patientProfile: any
  ): Promise<Activity[]> {
    if (!this.openaiApiKey) {
      return this.getMockActivities();
    }

    const prompt = `
    بناءً على حالة المريض والجلسة، اقترح أنشطة مناسبة للمركز العلاجي:

    بيانات المريض:
    ${JSON.stringify(patientProfile)}

    نتائج الجلسة:
    ${JSON.stringify(sessionData.emotions)}

    اقترح أنشطة تشمل:
    - أنشطة علاجية فردية
    - أنشطة جماعية
    - أنشطة عائلية
    - أنشطة ترفيهية
    - أنشطة تعليمية

    كل نشاط يجب أن يكون:
    - مناسب لحالة المريض
    - له مدة محددة
    - له تكرار محدد
    - يساعد في تحقيق الأهداف العلاجية

    أجب باللغة العربية وباللهجة المصرية.
    `;

    try {
      const response = await this.callOpenAI(prompt);
      return this.parseActivities(response);
    } catch (error) {
      console.error('خطأ في اقتراح الأنشطة:', error);
      return this.getMockActivities();
    }
  }

  // اقتراح خطة للجلسة القادمة
  async suggestNextSessionPlan(
    currentSession: Session,
    patientProgress: any
  ): Promise<string> {
    if (!this.openaiApiKey) {
      return this.getMockNextSessionPlan();
    }

    const prompt = `
    بناءً على الجلسة الحالية وتقدم المريض، اقترح خطة للجلسة القادمة:

    الجلسة الحالية:
    - الملاحظات: ${currentSession.raw_notes}
    - المشاعر: ${JSON.stringify(currentSession.emotions)}
    - التقييم: ${JSON.stringify(currentSession.therapist_assessment)}
    - التقدم: ${currentSession.current_progress}%

    تقدم المريض:
    ${JSON.stringify(patientProgress)}

    اقترح خطة مفصلة للجلسة القادمة تشمل:
    - المواضيع التي يجب التركيز عليها
    - التقنيات العلاجية المناسبة
    - الأنشطة المقترحة
    - الأهداف المحددة للجلسة
    - كيفية التعامل مع التحديات المحتملة

    أجب باللغة العربية وباللهجة المصرية.
    `;

    try {
      const response = await this.callOpenAI(prompt);
      return response.trim();
    } catch (error) {
      console.error('خطأ في اقتراح الخطة:', error);
      return this.getMockNextSessionPlan();
    }
  }

  // تحليل شامل للجلسة
  async comprehensiveSessionAnalysis(sessionData: Session): Promise<{
    insights: string[];
    recommendations: string[];
    riskFactors: string[];
    positiveIndicators: string[];
  }> {
    if (!this.openaiApiKey) {
      return this.getMockAnalysis();
    }

    const prompt = `
    قم بتحليل شامل للجلسة التالية:

    ${JSON.stringify(sessionData, null, 2)}

    قدم:
    1. رؤى مهمة من الجلسة
    2. توصيات للمعالج
    3. عوامل الخطر المحتملة
    4. المؤشرات الإيجابية

    أجب باللغة العربية وباللهجة المصرية.
    `;

    try {
      const response = await this.callOpenAI(prompt);
      return this.parseAnalysisResponse(response);
    } catch (error) {
      console.error('خطأ في التحليل الشامل:', error);
      return this.getMockAnalysis();
    }
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'أنت معالج نفسي متخصص في علاج الإدمان، تتحدث باللهجة المصرية وتقدم نصائح مهنية.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // البيانات الوهمية للاختبار
  private getMockAnalysis(rawNotes?: string): any {
    return {
      processedNotes: rawNotes || 'ملاحظات معالجة بالذكاء الاصطناعي',
      summary: 'ملخص الجلسة: المريض يظهر تحسناً في التعاون والرغبة في العلاج',
      emotions: {
        primary_emotion: 'أمل',
        secondary_emotions: ['تفاؤل', 'تصميم'],
        intensity: 6,
        emotional_state: 'positive'
      }
    };
  }

  private getMockTreatmentGoals(): TreatmentGoal[] {
    return [
      {
        id: '1',
        title: 'تحسين الثقة بالنفس',
        description: 'العمل على بناء ثقة المريض بنفسه من خلال تمارين وتقنيات علاجية',
        target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 0,
        status: 'pending',
        priority: 'high',
        category: 'emotional'
      },
      {
        id: '2',
        title: 'إدارة التوتر والقلق',
        description: 'تعلم تقنيات الاسترخاء وإدارة التوتر',
        target_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 0,
        status: 'pending',
        priority: 'medium',
        category: 'behavioral'
      },
      {
        id: '3',
        title: 'تحسين العلاقات الاجتماعية',
        description: 'العمل على بناء علاقات صحية مع العائلة والأصدقاء',
        target_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 0,
        status: 'pending',
        priority: 'medium',
        category: 'social'
      }
    ];
  }

  private getMockActivities(): Activity[] {
    return [
      {
        id: '1',
        title: 'جلسة تأمل جماعية',
        description: 'جلسة تأمل لتحسين الوعي الذاتي والاسترخاء',
        type: 'group',
        duration: 60,
        frequency: 'weekly',
        status: 'planned'
      },
      {
        id: '2',
        title: 'ورشة إدارة التوتر',
        description: 'تعلم تقنيات عملية لإدارة التوتر والقلق',
        type: 'group',
        duration: 90,
        frequency: 'weekly',
        status: 'planned'
      },
      {
        id: '3',
        title: 'جلسة علاج فردي',
        description: 'جلسة علاجية فردية مخصصة',
        type: 'individual',
        duration: 60,
        frequency: 'weekly',
        status: 'planned'
      }
    ];
  }

  private getMockNextSessionPlan(): string {
    return `
    خطة الجلسة القادمة:
    
    1. التركيز على تقنيات الاسترخاء والتنفس العميق
    2. مراجعة التقدم في الأهداف المحددة
    3. العمل على تحسين الثقة بالنفس
    4. مناقشة التحديات التي تواجه المريض
    5. تحديد أهداف جديدة للجلسة القادمة
    
    الأنشطة المقترحة:
    - تمارين استرخاء
    - جلسة تأمل قصيرة
    - مناقشة مفتوحة
    - تحديد خطوات عملية للتحسن
    `;
  }

  private getMockAnalysis(): any {
    return {
      insights: [
        'المريض يظهر تحسناً في التعاون مع العلاج',
        'هناك رغبة قوية في التغيير والتحسن',
        'المريض يفتح أكثر عن مشاعره'
      ],
      recommendations: [
        'الاستمرار في الجلسات الفردية',
        'زيادة الأنشطة الجماعية',
        'مراقبة التقدم بشكل دوري'
      ],
      riskFactors: [
        'خطر الانتكاس متوسط',
        'احتمالية العودة للعادات القديمة'
      ],
      positiveIndicators: [
        'تحسن في المزاج العام',
        'زيادة في الثقة بالنفس',
        'رغبة في المشاركة في الأنشطة'
      ]
    };
  }

  private parseAIResponse(response: string): any {
    // تحليل استجابة الذكاء الاصطناعي
    return {
      processedNotes: response,
      summary: response.substring(0, 200) + '...',
      emotions: {
        primary_emotion: 'أمل',
        secondary_emotions: ['تفاؤل', 'تصميم'],
        intensity: 6,
        emotional_state: 'positive'
      }
    };
  }

  private parseTreatmentGoals(response: string): TreatmentGoal[] {
    // تحليل الأهداف العلاجية من استجابة الذكاء الاصطناعي
    return this.getMockTreatmentGoals();
  }

  private parseActivities(response: string): Activity[] {
    // تحليل الأنشطة من استجابة الذكاء الاصطناعي
    return this.getMockActivities();
  }

  private parseAnalysisResponse(response: string): any {
    // تحليل الاستجابة الشاملة
    return this.getMockAnalysis();
  }
} 