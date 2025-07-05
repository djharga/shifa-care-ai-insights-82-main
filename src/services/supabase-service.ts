import { supabase } from '@/integrations/supabase/client';
import { Session, TreatmentGoal, Activity, CenterGoal } from '@/types/session';

export class SupabaseService {
  // إدارة الجلسات
  async createSession(sessionData: Omit<Session, 'id' | 'created_at' | 'updated_at'>): Promise<Session> {
    const { data, error } = await supabase
      .from('sessions')
      .insert([sessionData])
      .select()
      .single();

    if (error) {
      console.error('خطأ في إنشاء الجلسة:', error);
      throw new Error(`فشل في إنشاء الجلسة: ${error.message}`);
    }

    return data;
  }

  async getSessions(patientId?: string): Promise<Session[]> {
    let query = supabase.from('sessions').select('*').order('created_at', { ascending: false });
    
    if (patientId) {
      query = query.eq('patient_id', patientId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('خطأ في جلب الجلسات:', error);
      throw new Error(`فشل في جلب الجلسات: ${error.message}`);
    }

    return data || [];
  }

  async updateSession(sessionId: string, updates: Partial<Session>): Promise<Session> {
    const { data, error } = await supabase
      .from('sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('خطأ في تحديث الجلسة:', error);
      throw new Error(`فشل في تحديث الجلسة: ${error.message}`);
    }

    return data;
  }

  async deleteSession(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', sessionId);

    if (error) {
      console.error('خطأ في حذف الجلسة:', error);
      throw new Error(`فشل في حذف الجلسة: ${error.message}`);
    }
  }

  // إدارة الأهداف العلاجية
  async createTreatmentGoal(goalData: Omit<TreatmentGoal, 'id' | 'created_at' | 'updated_at'>): Promise<TreatmentGoal> {
    const { data, error } = await supabase
      .from('treatment_goals')
      .insert([goalData])
      .select()
      .single();

    if (error) {
      console.error('خطأ في إنشاء الهدف العلاجي:', error);
      throw new Error(`فشل في إنشاء الهدف العلاجي: ${error.message}`);
    }

    return data;
  }

  async getTreatmentGoals(patientId?: string): Promise<TreatmentGoal[]> {
    let query = supabase.from('treatment_goals').select('*').order('created_at', { ascending: false });
    
    if (patientId) {
      query = query.eq('patient_id', patientId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('خطأ في جلب الأهداف العلاجية:', error);
      throw new Error(`فشل في جلب الأهداف العلاجية: ${error.message}`);
    }

    return data || [];
  }

  async updateTreatmentGoal(goalId: string, updates: Partial<TreatmentGoal>): Promise<TreatmentGoal> {
    const { data, error } = await supabase
      .from('treatment_goals')
      .update(updates)
      .eq('id', goalId)
      .select()
      .single();

    if (error) {
      console.error('خطأ في تحديث الهدف العلاجي:', error);
      throw new Error(`فشل في تحديث الهدف العلاجي: ${error.message}`);
    }

    return data;
  }

  async deleteTreatmentGoal(goalId: string): Promise<void> {
    const { error } = await supabase
      .from('treatment_goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      console.error('خطأ في حذف الهدف العلاجي:', error);
      throw new Error(`فشل في حذف الهدف العلاجي: ${error.message}`);
    }
  }

  // إدارة أنشطة المركز
  async createActivity(activityData: Omit<Activity, 'id' | 'created_at' | 'updated_at'>): Promise<Activity> {
    const { data, error } = await supabase
      .from('center_activities')
      .insert([activityData])
      .select()
      .single();

    if (error) {
      console.error('خطأ في إنشاء النشاط:', error);
      throw new Error(`فشل في إنشاء النشاط: ${error.message}`);
    }

    return data;
  }

  async getActivities(patientId?: string): Promise<Activity[]> {
    let query = supabase.from('center_activities').select('*').order('created_at', { ascending: false });
    
    if (patientId) {
      query = query.eq('patient_id', patientId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('خطأ في جلب الأنشطة:', error);
      throw new Error(`فشل في جلب الأنشطة: ${error.message}`);
    }

    return data || [];
  }

  async updateActivity(activityId: string, updates: Partial<Activity>): Promise<Activity> {
    const { data, error } = await supabase
      .from('center_activities')
      .update(updates)
      .eq('id', activityId)
      .select()
      .single();

    if (error) {
      console.error('خطأ في تحديث النشاط:', error);
      throw new Error(`فشل في تحديث النشاط: ${error.message}`);
    }

    return data;
  }

  async deleteActivity(activityId: string): Promise<void> {
    const { error } = await supabase
      .from('center_activities')
      .delete()
      .eq('id', activityId);

    if (error) {
      console.error('خطأ في حذف النشاط:', error);
      throw new Error(`فشل في حذف النشاط: ${error.message}`);
    }
  }

  // إدارة أهداف المركز
  async createCenterGoal(goalData: Omit<CenterGoal, 'id' | 'created_at' | 'updated_at'>): Promise<CenterGoal> {
    const { data, error } = await supabase
      .from('center_goals')
      .insert([goalData])
      .select()
      .single();

    if (error) {
      console.error('خطأ في إنشاء هدف المركز:', error);
      throw new Error(`فشل في إنشاء هدف المركز: ${error.message}`);
    }

    return data;
  }

  async getCenterGoals(): Promise<CenterGoal[]> {
    const { data, error } = await supabase
      .from('center_goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('خطأ في جلب أهداف المركز:', error);
      throw new Error(`فشل في جلب أهداف المركز: ${error.message}`);
    }

    return data || [];
  }

  async updateCenterGoal(goalId: string, updates: Partial<CenterGoal>): Promise<CenterGoal> {
    const { data, error } = await supabase
      .from('center_goals')
      .update(updates)
      .eq('id', goalId)
      .select()
      .single();

    if (error) {
      console.error('خطأ في تحديث هدف المركز:', error);
      throw new Error(`فشل في تحديث هدف المركز: ${error.message}`);
    }

    return data;
  }

  async deleteCenterGoal(goalId: string): Promise<void> {
    const { error } = await supabase
      .from('center_goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      console.error('خطأ في حذف هدف المركز:', error);
      throw new Error(`فشل في حذف هدف المركز: ${error.message}`);
    }
  }

  // إحصائيات
  async getSessionStats(): Promise<{
    totalSessions: number;
    thisWeek: number;
    thisMonth: number;
    avgProgress: number;
  }> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // إجمالي الجلسات
    const { count: totalSessions } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });

    // جلسات هذا الأسبوع
    const { count: thisWeek } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString());

    // جلسات هذا الشهر
    const { count: thisMonth } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthAgo.toISOString());

    // متوسط التقدم
    const { data: sessions } = await supabase
      .from('sessions')
      .select('current_progress');

    const avgProgress = sessions && sessions.length > 0
      ? sessions.reduce((sum, session) => sum + (session.current_progress || 0), 0) / sessions.length
      : 0;

    return {
      totalSessions: totalSessions || 0,
      thisWeek: thisWeek || 0,
      thisMonth: thisMonth || 0,
      avgProgress: Math.round(avgProgress)
    };
  }

  async getGoalStats(): Promise<{
    totalGoals: number;
    completedGoals: number;
    pendingGoals: number;
    highPriorityGoals: number;
  }> {
    // إجمالي الأهداف
    const { count: totalGoals } = await supabase
      .from('treatment_goals')
      .select('*', { count: 'exact', head: true });

    // الأهداف المكتملة
    const { count: completedGoals } = await supabase
      .from('treatment_goals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    // الأهداف المعلقة
    const { count: pendingGoals } = await supabase
      .from('treatment_goals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // الأهداف عالية الأولوية
    const { count: highPriorityGoals } = await supabase
      .from('treatment_goals')
      .select('*', { count: 'exact', head: true })
      .eq('priority', 'high');

    return {
      totalGoals: totalGoals || 0,
      completedGoals: completedGoals || 0,
      pendingGoals: pendingGoals || 0,
      highPriorityGoals: highPriorityGoals || 0
    };
  }

  // بيانات وهمية للاختبار (إذا لم تكن قاعدة البيانات متاحة)
  getMockData() {
    return {
      sessions: [
        {
          id: '1',
          patient_id: 'patient-1',
          therapist_id: 'therapist-1',
          session_date: '2025-07-05',
          session_time: '10:00:00',
          duration: 60,
          session_type: 'individual',
          status: 'completed',
          raw_notes: 'المريض يبدو متوتراً اليوم، تحدث عن مشاكل في العمل',
          ai_processed_notes: 'المريض يظهر توتراً واضحاً في الجلسة اليوم. تحدث عن ضغوط العمل التي تؤثر على حالته النفسية.',
          session_summary: 'جلسة إيجابية مع تحسن في التعاون',
          emotions: {
            primary_emotion: 'قلق',
            secondary_emotions: ['توتر', 'إرادة'],
            intensity: 7,
            emotional_state: 'mixed'
          },
          treatment_goals: [],
          current_progress: 65,
          next_session_plan: 'التركيز على تقنيات إدارة التوتر',
          therapist_assessment: {
            patient_cooperation: 7,
            session_effectiveness: 8,
            challenges_faced: ['التوتر الشديد'],
            positive_developments: ['تحسن في التعاون']
          },
          center_goals: [],
          activities_planned: [],
          created_at: '2025-07-05T10:00:00Z',
          updated_at: '2025-07-05T10:00:00Z'
        }
      ],
      treatmentGoals: [
        {
          id: '1',
          session_id: '1',
          patient_id: 'patient-1',
          title: 'تحسين الثقة بالنفس',
          description: 'العمل على بناء ثقة المريض بنفسه',
          target_date: '2025-08-05',
          progress: 60,
          status: 'in_progress',
          priority: 'high',
          category: 'emotional',
          created_at: '2025-07-05T10:00:00Z',
          updated_at: '2025-07-05T10:00:00Z'
        }
      ],
      activities: [
        {
          id: '1',
          session_id: '1',
          patient_id: 'patient-1',
          title: 'جلسة تأمل جماعية',
          description: 'جلسة تأمل لتحسين الوعي الذاتي',
          type: 'group',
          duration: 60,
          frequency: 'weekly',
          status: 'planned',
          effectiveness_rating: 8,
          created_at: '2025-07-05T10:00:00Z',
          updated_at: '2025-07-05T10:00:00Z'
        }
      ]
    };
  }
} 