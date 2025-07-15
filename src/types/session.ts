export interface Session {
  id: string;
  patient_id: string;
  therapist_id: string;
  session_date: string;
  session_time: string;
  duration: number; // بالدقائق
  session_type: 'individual' | 'group' | 'family';
  status: 'scheduled' | 'completed' | 'cancelled';
  
  // محتوى الجلسة
  raw_notes: string; // الملاحظات الخام من المعالج
  ai_processed_notes: string; // الملاحظات المعالجة بالذكاء الاصطناعي
  session_summary: string; // ملخص الجلسة
  
  // تحليل المشاعر
  emotions: {
    primary_emotion: string;
    secondary_emotions: string[];
    intensity: number; // 1-10
    emotional_state: 'positive' | 'negative' | 'neutral' | 'mixed';
  };
  
  // تقييم المعالج
  therapist_assessment: {
    patient_cooperation: number; // 1-10
    session_effectiveness: number; // 1-10
    challenges_faced: string[];
    positive_developments: string[];
  };
  
  created_at: string;
  updated_at: string;
}

// نوع البيانات الجديد للنتيجة المطلوبة من الذكاء الاصطناعي
export interface AIAnalysisResult {
  processedNotes: string;
  emotions: {
    primary_emotion: string;
    secondary_emotions: string[];
    intensity: number;
    emotional_state: 'positive' | 'negative' | 'neutral' | 'mixed';
  };
  thinkingPattern: string;
  psychologicalState: string;
  treatmentPlan: {
    goals: string[];
    direction: string;
    exercise: string;
  };
  familyReport: string;
}

 