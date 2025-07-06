import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// ترجمة مباشرة لتجنب مشاكل الاستيراد
const resources = {
  ar: { 
    translation: {
      "dashboard": "لوحة التحكم",
      "patients": "المقيمين",
      "sessions": "الجلسات",
      "reports": "التقارير",
      "ai_assistant": "مساعد الذكاء الاصطناعي",
      "ai_suggestion": "اقتراح من الذكاء الاصطناعي",
      "no_suggestions": "لا توجد اقتراحات بعد",
      "start_asking": "ابدأ بطرح سؤال للحصول على اقتراحات مخصصة",
      "manage_sessions": "إدارة الجلسات",
      "schedule_and_track_therapy_sessions": "جدولة ومتابعة جلسات العلاج",
      "add_new_session": "إضافة جلسة جديدة",
      "patient": "المريض",
      "therapist": "المعالج",
      "choose_patient": "اختر المريض",
      "choose_therapist": "اختر المعالج",
      "session_date": "تاريخ الجلسة",
      "session_time": "وقت الجلسة",
      "session_type": "نوع الجلسة",
      "choose_session_type": "اختر نوع الجلسة",
      "individual": "فردية",
      "group": "جماعية",
      "family": "عائلية",
      "duration": "المدة",
      "notes": "ملاحظات",
      "enter_any_notes_about_the_session": "أدخل أي ملاحظات حول الجلسة",
      "sessions_today": "الجلسات اليوم",
      "completed_sessions": "الجلسات المكتملة",
      "attendance_rate": "معدل الحضور",
      "scheduled_sessions": "الجلسات المجدولة",
      "date": "التاريخ",
      "time": "الوقت",
      "type": "النوع",
      "status": "الحالة"
    }
  },
  'ar-EG': { 
    translation: {
      "dashboard": "لوحة التحكم",
      "patients": "المقيمين",
      "sessions": "الجلسات",
      "reports": "التقارير",
      "ai_assistant": "مساعد الذكاء الاصطناعي",
      "ai_suggestion": "اقتراح من الذكاء الاصطناعي",
      "no_suggestions": "لا توجد اقتراحات بعد",
      "start_asking": "ابدأ بطرح سؤال للحصول على اقتراحات مخصصة",
      "manage_sessions": "إدارة الجلسات",
      "schedule_and_track_therapy_sessions": "جدولة ومتابعة جلسات العلاج",
      "add_new_session": "إضافة جلسة جديدة",
      "patient": "المريض",
      "therapist": "المعالج",
      "choose_patient": "اختر المريض",
      "choose_therapist": "اختر المعالج",
      "session_date": "تاريخ الجلسة",
      "session_time": "وقت الجلسة",
      "session_type": "نوع الجلسة",
      "choose_session_type": "اختر نوع الجلسة",
      "individual": "فردية",
      "group": "جماعية",
      "family": "عائلية",
      "duration": "المدة",
      "notes": "ملاحظات",
      "enter_any_notes_about_the_session": "أدخل أي ملاحظات حول الجلسة",
      "sessions_today": "الجلسات اليوم",
      "completed_sessions": "الجلسات المكتملة",
      "attendance_rate": "معدل الحضور",
      "scheduled_sessions": "الجلسات المجدولة",
      "date": "التاريخ",
      "time": "الوقت",
      "type": "النوع",
      "status": "الحالة"
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