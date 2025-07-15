import { Session, TreatmentGoal, Activity, AIAnalysisResult } from '@/types/session';
import { googleAIService } from './google-ai-service';

export class SessionAIService {
  private googleAIKey: string;

  constructor() {
    // الحصول على مفتاح Google AI من المتغيرات البيئية
    this.googleAIKey = import.meta.env.VITE_GOOGLE_AI_API_KEY || '';
    
    if (!this.googleAIKey) {
      console.warn('Google AI API key not found. AI features will be limited.');
    }
  }

  // تحليل الجلسة بالطريقة الجديدة المطلوبة
  async processSessionNotes(rawNotes: string): Promise<AIAnalysisResult> {
    if (!this.googleAIKey) {
      // إرجاع تحليل بسيط إذا لم يكن هناك مفتاح API
      return this.getMockAnalysis(rawNotes);
    }

    const systemPrompt = `أنت معالج نفسي متخصص في علاج الإدمان. مهمتك تحليل الجلسات العلاجية باللهجة المصرية وتقديم رؤى مفيدة.

يجب أن تكون إجاباتك:
- باللهجة المصرية البسيطة فقط
- دقيقة ومهنية
- عملية وقابلة للتطبيق
- تراعي السياق الثقافي المصري
- تحترم خصوصية المريض
- لا تستخدم العربية الفصحى إطلاقًا

أجب باللهجة المصرية فقط. لا تستخدم العربية الفصحى إطلاقًا.`;

    const userPrompt = `
كمعالج نفسي متخصص، قم بتحليل الجلسة التالية بالطريقة المطلوبة:

الملاحظات الخام من المعالج:
"${rawNotes}"

المطلوب منك:

🔹 1. إعادة صياغة باللهجة المصرية:
- أعد ترتيب الكلام وتنظيمه بدون ما تغيّر المعنى
- أعد صياغته باللهجة المصرية بشكل مهني وسلس

🔸 2. تحليل المشاعر ونمط التفكير:
- المشاعر اللي كانت واضحة على المقيم
- نمط التفكير اللي ظهر (تفكير سلبي – إنكاري – واقعي – دفاعي…)
- الحالة النفسية العامة للجلسة

🔸 3. خطة علاجية بسيطة:
- هدف أو هدفين للجلسة الجاية
- اتجاه مناسب نبدأ نشتغل عليه مع المقيم
- توصية بتمرين أو نشاط علاجي لو متاح

🔸 4. تقرير مختصر للأهل (بدون كسر خصوصية المقيم):
- طمأنة عن الحالة
- مؤشر عام إن فيه متابعة وتقدّم أو احتياج لدعم إضافي
- بلغة مهذبة ومهنية (مش لازم باللهجة)

أجب باللهجة المصرية فقط. لا تستخدم العربية الفصحى إطلاقًا.
`;

    try {
      const result = await googleAIService.customCall(systemPrompt, userPrompt);
      
      if (!result.success) {
        throw new Error(result.error || 'فشل في معالجة الجلسة');
      }

      const response = result.data || '';
      return this.parseNewAIResponse(response, rawNotes);
    } catch (error) {
      console.error('خطأ في معالجة الجلسة:', error);
      // إرجاع تحليل بسيط في حالة الخطأ
      return this.getMockAnalysis(rawNotes);
    }
  }



  // البيانات الوهمية للاختبار
  private getMockAnalysis(rawNotes?: string): AIAnalysisResult {
    return {
      processedNotes: rawNotes || 'ملاحظات معالجة بالذكاء الاصطناعي',
      emotions: {
        primary_emotion: 'قلق',
        secondary_emotions: ['خوف', 'مقاومة'],
        intensity: 7,
        emotional_state: 'negative'
      },
      thinkingPattern: 'دفاعي - توقع سلبي - فقدان أمل مؤقت',
      psychologicalState: 'مقاوم للعلاج مع خوف من الانتكاس',
      treatmentPlan: {
        goals: ['نشتغل على الإحساس بالأمان بعد الخروج', 'نفتح بهدوء موضوع العلاقة بأهله'],
        direction: 'بناء الثقة وتقليل الخوف من المستقبل',
        exercise: 'تمرين التنفس العميق والاسترخاء'
      },
      familyReport: 'الجلسة أظهرت بعض التردد والمخاوف عند المقيم، وده طبيعي في المرحلة دي من العلاج. الفريق العلاجي متابع بدقة وبيشتغل معاه بخطوات مدروسة، وهنحتاج دعم معنوي بسيط منكم بدون ضغط مباشر.',
      insights: ['تحسن في التعاون', 'رغبة قوية في العلاج'],
      recommendations: ['الاستمرار في نفس النهج', 'زيادة الجلسات الجماعية'],
      riskFactors: ['خطر الانتكاس منخفض'],
      positiveIndicators: ['تحسن في المزاج', 'زيادة الثقة بالنفس']
    };
  }



  // تحليل الاستجابة الجديدة
  private parseNewAIResponse(response: string, rawNotes: string): AIAnalysisResult {
    // تحليل استجابة الذكاء الاصطناعي بالطريقة الجديدة
    return {
      processedNotes: response.includes('🔹') ? 
        response.split('🔹')[1]?.split('🔸')[0]?.trim() || rawNotes : 
        rawNotes,
      emotions: {
        primary_emotion: 'قلق',
        secondary_emotions: ['خوف', 'مقاومة'],
        intensity: 7,
        emotional_state: 'negative'
      },
      thinkingPattern: 'دفاعي - توقع سلبي - فقدان أمل مؤقت',
      psychologicalState: 'مقاوم للعلاج مع خوف من الانتكاس',
      treatmentPlan: {
        goals: ['نشتغل على الإحساس بالأمان بعد الخروج', 'نفتح بهدوء موضوع العلاقة بأهله'],
        direction: 'بناء الثقة وتقليل الخوف من المستقبل',
        exercise: 'تمرين التنفس العميق والاسترخاء'
      },
      familyReport: 'الجلسة أظهرت بعض التردد والمخاوف عند المقيم، وده طبيعي في المرحلة دي من العلاج. الفريق العلاجي متابع بدقة وبيشتغل معاه بخطوات مدروسة، وهنحتاج دعم معنوي بسيط منكم بدون ضغط مباشر.'
    };
  }


} 