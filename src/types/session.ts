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
  
  // الأهداف والخطط
  treatment_goals: TreatmentGoal[];
  current_progress: number; // 0-100
  next_session_plan: string;
  
  // تقييم المعالج
  therapist_assessment: {
    patient_cooperation: number; // 1-10
    session_effectiveness: number; // 1-10
    challenges_faced: string[];
    positive_developments: string[];
  };
  
  // إعدادات المركز العلاجي
  center_goals: CenterGoal[];
  activities_planned: Activity[];
  
  created_at: string;
  updated_at: string;
}

export interface TreatmentGoal {
  id: string;
  title: string;
  description: string;
  target_date: string;
  progress: number; // 0-100
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  category: 'behavioral' | 'emotional' | 'social' | 'physical' | 'spiritual';
}

export interface CenterGoal {
  id: string;
  title: string;
  description: string;
  target_date: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed';
  category: 'therapy' | 'education' | 'recreation' | 'support';
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'group' | 'family';
  duration: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  status: 'planned' | 'completed' | 'cancelled';
  effectiveness_rating?: number; // 1-10
} 