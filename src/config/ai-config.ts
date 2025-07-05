import i18n from 'i18next';

// دالة للحصول على النص المترجم
const t = (key: string) => i18n.t(key);

// تكوين الذكاء الاصطناعي للنظام العلاجي

export const AI_CONFIG = {
  // إعدادات OpenAI
  openai: {
    model: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.7,
    systemPrompt: `أنت معالج نفسي متخصص في علاج الإدمان، تتحدث باللهجة المصرية وتقدم نصائح مهنية. 
    مهمتك هي تحليل الجلسات العلاجية وتقديم توصيات مفيدة للمعالجين.
    استخدم لغة بسيطة ومفهومة، وتجنب المصطلحات المعقدة.`
  },

  // قوالب الرسائل للذكاء الاصطناعي
  prompts: {
    // تحليل الجلسة
    sessionAnalysis: `
    كمعالج نفسي متخصص، قم بتحليل الجلسة التالية وتنظيمها باللهجة المصرية:

    الملاحظات الخام:
    {rawNotes}

    المطلوب:
    1. إعادة كتابة الملاحظات بشكل منظم ومفهوم باللهجة المصرية
    2. عمل ملخص مختصر للجلسة
    3. تحليل المشاعر السائدة في الجلسة مع تحديد:
       - المشاعر الأساسية
       - المشاعر الثانوية
       - شدة المشاعر (1-10)
       - الحالة العاطفية العامة

    أجب باللغة العربية وباللهجة المصرية.
    `,

    // اقتراح الأهداف العلاجية
    treatmentGoals: `
    بناءً على الجلسة التالية وتاريخ المريض، اقترح أهداف علاجية مناسبة:

    بيانات الجلسة:
    - الملاحظات: {sessionNotes}
    - المشاعر: {emotions}
    - التقييم: {assessment}

    تاريخ المريض:
    {patientHistory}

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
    `,

    // اقتراح الأنشطة
    centerActivities: `
    بناءً على حالة المريض والجلسة، اقترح أنشطة مناسبة للمركز العلاجي:

    بيانات المريض:
    {patientProfile}

    نتائج الجلسة:
    {sessionEmotions}

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
    `,

    // خطة الجلسة القادمة
    nextSessionPlan: `
    بناءً على الجلسة الحالية وتقدم المريض، اقترح خطة للجلسة القادمة:

    الجلسة الحالية:
    - الملاحظات: {currentSessionNotes}
    - المشاعر: {currentEmotions}
    - التقييم: {currentAssessment}
    - التقدم: {currentProgress}%

    تقدم المريض:
    {patientProgress}

    اقترح خطة مفصلة للجلسة القادمة تشمل:
    - المواضيع التي يجب التركيز عليها
    - التقنيات العلاجية المناسبة
    - الأنشطة المقترحة
    - الأهداف المحددة للجلسة
    - كيفية التعامل مع التحديات المحتملة

    أجب باللغة العربية وباللهجة المصرية.
    `,

    // التحليل الشامل
    comprehensiveAnalysis: `
    قم بتحليل شامل للجلسة التالية:

    {sessionData}

    قدم:
    1. رؤى مهمة من الجلسة
    2. توصيات للمعالج
    3. عوامل الخطر المحتملة
    4. المؤشرات الإيجابية

    أجب باللغة العربية وباللهجة المصرية.
    `
  },

  // قوالب الاستجابة
  responseTemplates: {
    // قالب تحليل المشاعر
    emotions: {
      primary_emotion: '',
      secondary_emotions: [],
      intensity: 5,
      emotional_state: 'neutral'
    },

    // قالب تقييم المعالج
    therapistAssessment: {
      patient_cooperation: 5,
      session_effectiveness: 5,
      challenges_faced: [],
      positive_developments: []
    },

    // قالب التحليل الشامل
    analysis: {
      insights: [],
      recommendations: [],
      riskFactors: [],
      positiveIndicators: []
    }
  },

  // إعدادات التصنيف
  categories: {
    // فئات الأهداف العلاجية
    treatmentGoals: {
      behavioral: 'سلوكي',
      emotional: 'عاطفي',
      social: 'اجتماعي',
      physical: 'جسدي',
      spiritual: 'روحي'
    },

    // أولويات الأهداف
    priorities: {
      low: 'منخفضة',
      medium: 'متوسطة',
      high: 'عالية'
    },

    // حالات الأهداف
    goalStatus: {
      pending: t('ai_goal_status_pending'),
      in_progress: t('ai_goal_status_in_progress'),
      completed: t('ai_goal_status_completed'),
      failed: t('ai_goal_status_failed')
    },

    // أنواع الأنشطة
    activityTypes: {
      individual: t('ai_activity_individual'),
      group: t('ai_activity_group'),
      family: t('ai_activity_family')
    },

    // تكرار الأنشطة
    activityFrequency: {
      daily: t('ai_frequency_daily'),
      weekly: t('ai_frequency_weekly'),
      monthly: t('ai_frequency_monthly')
    },

    // حالات الأنشطة
    activityStatus: {
      planned: t('ai_status_planned'),
      completed: t('ai_status_completed'),
      cancelled: t('ai_status_cancelled')
    }
  },

  // إعدادات التحليل
  analysis: {
    // مستويات شدة المشاعر
    emotionIntensity: {
      veryLow: { min: 1, max: 2, label: t('ai_emotion_very_low') },
      low: { min: 3, max: 4, label: t('ai_emotion_low') },
      medium: { min: 5, max: 6, label: t('ai_emotion_medium') },
      high: { min: 7, max: 8, label: t('ai_emotion_high') },
      veryHigh: { min: 9, max: 10, label: t('ai_emotion_very_high') }
    },

    // الحالات العاطفية
    emotionalStates: {
      positive: { label: t('ai_state_positive'), color: 'green' },
      negative: { label: t('ai_state_negative'), color: 'red' },
      neutral: { label: t('ai_state_neutral'), color: 'gray' },
      mixed: { label: t('ai_state_mixed'), color: 'yellow' }
    }
  },

  // إعدادات الواجهة
  ui: {
    // ألوان المشاعر
    emotionColors: {
      positive: 'text-green-600',
      negative: 'text-red-600',
      neutral: 'text-gray-600',
      mixed: 'text-yellow-600'
    },

    // ألوان الأولويات
    priorityColors: {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    },

    // ألوان الفئات
    categoryColors: {
      behavioral: 'bg-blue-100 text-blue-800',
      emotional: 'bg-purple-100 text-purple-800',
      social: 'bg-green-100 text-green-800',
      physical: 'bg-orange-100 text-orange-800',
      spiritual: 'bg-indigo-100 text-indigo-800'
    }
  },

  // إعدادات التحقق
  validation: {
    // حدود القيم
    limits: {
      sessionDuration: { min: 15, max: 180 },
      emotionIntensity: { min: 1, max: 10 },
      progress: { min: 0, max: 100 },
      cooperation: { min: 1, max: 10 },
      effectiveness: { min: 1, max: 10 }
    },

    // رسائل الخطأ
    errorMessages: {
      requiredField: t('validation_required_field'),
      invalidDuration: t('validation_invalid_duration'),
      invalidIntensity: t('validation_invalid_intensity'),
      invalidProgress: t('validation_invalid_progress'),
      invalidRating: t('validation_invalid_rating')
    }
  }
};

// دالة لاستبدال المتغيرات في القوالب
export function replaceTemplateVariables(template: string, variables: Record<string, any>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), String(value));
  }
  return result;
}

// دالة لتحليل استجابة الذكاء الاصطناعي
export function parseAIResponse(response: string, type: 'emotions' | 'goals' | 'activities' | 'analysis'): any {
  try {
    // محاولة تحليل JSON إذا كان متاحاً
    if (response.includes('{') && response.includes('}')) {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    // تحليل نصي بسيط
    switch (type) {
      case 'emotions':
        return parseEmotionsFromText(response);
      case 'goals':
        return parseGoalsFromText(response);
      case 'activities':
        return parseActivitiesFromText(response);
      case 'analysis':
        return parseAnalysisFromText(response);
      default:
        return response;
    }
  } catch (error) {
    console.error(t('ai_parse_error'), error);
    return response;
  }
}

// دوال التحليل النصي
function parseEmotionsFromText(text: string): any {
  // تحليل بسيط للنص لاستخراج المشاعر
  const emotions = {
    primary_emotion: t('ai_emotion_undefined'),
    secondary_emotions: [],
    intensity: 5,
    emotional_state: 'neutral' as const
  };

  // البحث عن المشاعر الأساسية
  const emotionKeywords = {
    'قلق': 'قلق',
    'خوف': 'خوف',
    'غضب': 'غضب',
    'حزن': 'حزن',
    'فرح': 'فرح',
    'سعادة': 'سعادة',
    'اكتئاب': 'اكتئاب',
    'توتر': 'توتر'
  };

  for (const [keyword, emotion] of Object.entries(emotionKeywords)) {
    if (text.includes(keyword)) {
      emotions.primary_emotion = emotion;
      break;
    }
  }

  return emotions;
}

function parseGoalsFromText(text: string): any[] {
  // تحليل بسيط للأهداف
  return [
    {
      id: Date.now().toString(),
      title: t('ai_goal_therapeutic'),
      description: text.substring(0, 100),
      target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 0,
      status: 'pending' as const,
      priority: 'medium' as const,
      category: 'behavioral' as const
    }
  ];
}

function parseActivitiesFromText(text: string): any[] {
  // تحليل بسيط للأنشطة
  return [
    {
      id: Date.now().toString(),
      title: t('ai_activity_therapeutic'),
      description: text.substring(0, 100),
      type: 'individual' as const,
      duration: 60,
      frequency: 'weekly' as const,
      status: 'planned' as const
    }
  ];
}

function parseAnalysisFromText(text: string): any {
  return {
    insights: [text.substring(0, 100)],
    recommendations: ['توصية عامة'],
    riskFactors: ['خطر محتمل'],
    positiveIndicators: ['مؤشر إيجابي']
  };
} 