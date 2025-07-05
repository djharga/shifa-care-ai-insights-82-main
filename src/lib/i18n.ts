import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: { 
    translation: {
      "dashboard": "لوحة التحكم",
      "patients": "المرضى",
      "sessions": "الجلسات",
      "reports": "التقارير",
      "ai_assistant": "مساعد الذكاء الاصطناعي",
      "ai_suggestion": "اقتراح من الذكاء الاصطناعي",
      "no_suggestions": "لا توجد اقتراحات بعد",
      "start_asking": "ابدأ بطرح سؤال للحصول على اقتراحات مخصصة"
    }
  },
  'ar-EG': { 
    translation: {
      "dashboard": "لوحة التحكم",
      "patients": "المرضى",
      "sessions": "الجلسات",
      "reports": "التقارير",
      "ai_assistant": "مساعد الذكاء الاصطناعي",
      "ai_suggestion": "اقتراح من الذكاء الاصطناعي",
      "no_suggestions": "لا توجد اقتراحات بعد",
      "start_asking": "ابدأ بطرح سؤال للحصول على اقتراحات مخصصة"
    }
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar-EG',
    fallbackLng: 'ar-EG',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 