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
      pending: 'في الانتظار',
      in_progress: 'قيد التنفيذ',
      completed: 'مكتمل',
      failed: 'فشل'
    },

    // أنواع الأنشطة
    activityTypes: {
      individual: 'فردي',
      group: 'جماعي',
      family: 'عائلي'
    },

    // تكرار الأنشطة
    activityFrequency: {
      daily: 'يومي',
      weekly: 'أسبوعي',
      monthly: 'شهري'
    },

    // حالات الأنشطة
    activityStatus: {
      planned: 'مخطط',
      completed: 'مكتمل',
      cancelled: 'ملغي'
    }
  },

  // إعدادات التحليل
  analysis: {
    // مستويات شدة المشاعر
    emotionIntensity: {
      veryLow: { min: 1, max: 2, label: 'منخفضة جداً' },
      low: { min: 3, max: 4, label: 'منخفضة' },
      medium: { min: 5, max: 6, label: 'متوسطة' },
      high: { min: 7, max: 8, label: 'عالية' },
      veryHigh: { min: 9, max: 10, label: 'عالية جداً' }
    },

    // الحالات العاطفية
    emotionalStates: {
      positive: { label: 'إيجابية', color: 'green' },
      negative: { label: 'سلبية', color: 'red' },
      neutral: { label: 'محايدة', color: 'gray' },
      mixed: { label: 'مختلطة', color: 'yellow' }
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
      requiredField: 'هذا الحقل مطلوب',
      invalidDuration: 'المدة يجب أن تكون بين 15 و 180 دقيقة',
      invalidIntensity: 'الشدة يجب أن تكون بين 1 و 10',
      invalidProgress: 'التقدم يجب أن يكون بين 0 و 100',
      invalidRating: 'التقييم يجب أن يكون بين 1 و 10'
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
    console.error('خطأ في تحليل استجابة الذكاء الاصطناعي:', error);
    return AI_CONFIG.responseTemplates[type] || response;
  }
}

// دوال التحليل النصي
function parseEmotionsFromText(text: string): any {
  // تحليل بسيط للنص لاستخراج المشاعر
  const emotions = {
    primary_emotion: 'غير محدد',
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
      title: 'هدف علاجي',
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
      title: 'نشاط علاجي',
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