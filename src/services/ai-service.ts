import { supabase } from '@/integrations/supabase/client';

export interface PatientData {
  id: string;
  name: string;
  age: number;
  addiction_type: string;
  treatment_history: any[];
  current_status: string;
  risk_factors: string[];
}

export interface TreatmentPlan {
  id: string;
  patient_id: string;
  plan_type: 'individual' | 'group' | 'family';
  duration_weeks: number;
  sessions_per_week: number;
  goals: string[];
  interventions: string[];
  risk_mitigation: string[];
  success_metrics: string[];
  created_at: string;
}

export interface RelapseRisk {
  patient_id: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_factors: string[];
  probability: number;
  recommendations: string[];
  next_assessment: string;
}

export class AIService {
  private openaiApiKey = "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";

  async generateTreatmentPlan(patientData: PatientData): Promise<TreatmentPlan> {
    try {
      const prompt = `معلومات المريض:
الاسم: ${patientData.name}
العمر: ${patientData.age}
نوع الإدمان: ${patientData.addiction_type}
الحالة الحالية: ${patientData.current_status}
عوامل الخطر: ${patientData.risk_factors.join(', ')}

قم بإنشاء خطة علاجية شاملة تتضمن:
1. نوع العلاج (فردي/جماعي/عائلي)
2. مدة العلاج بالأسابيع
3. عدد الجلسات أسبوعياً
4. الأهداف العلاجية
5. التدخلات المطلوبة
6. استراتيجيات تقليل المخاطر
7. مؤشرات النجاح

أجب باللغة العربية وبشكل منظم.`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { 
              role: "system", 
              content: "أنت خبير في علاج الإدمان. قدم خطط علاجية شاملة ومخصصة بناءً على حالة المريض." 
            },
            { role: "user", content: prompt }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || "";

      // تحليل الاستجابة وإنشاء خطة علاجية منظمة
      const treatmentPlan: TreatmentPlan = {
        id: Date.now().toString(),
        patient_id: patientData.id,
        plan_type: this.extractPlanType(aiResponse),
        duration_weeks: this.extractDuration(aiResponse),
        sessions_per_week: this.extractSessions(aiResponse),
        goals: this.extractGoals(aiResponse),
        interventions: this.extractInterventions(aiResponse),
        risk_mitigation: this.extractRiskMitigation(aiResponse),
        success_metrics: this.extractSuccessMetrics(aiResponse),
        created_at: new Date().toISOString()
      };

      // حفظ الخطة في قاعدة البيانات
      await this.saveTreatmentPlan(treatmentPlan);

      return treatmentPlan;
    } catch (error) {
      console.error('Error generating treatment plan:', error);
      throw error;
    }
  }

  async assessRelapseRisk(patientId: string): Promise<RelapseRisk> {
    try {
      // جلب بيانات المريض
      const { data: patient } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (!patient) {
        throw new Error('Patient not found');
      }

      // جلب تاريخ الجلسات
      const { data: sessions } = await supabase
        .from('sessions')
        .select('*')
        .eq('patient_id', patientId)
        .order('session_date', { ascending: false });

      // تحليل عوامل الخطر
      const riskFactors = this.analyzeRiskFactors(patient, sessions || []);
      const riskLevel = this.calculateRiskLevel(riskFactors);
      const probability = this.calculateProbability(riskFactors);

      const relapseRisk: RelapseRisk = {
        patient_id: patientId,
        risk_level: riskLevel,
        risk_factors: riskFactors,
        probability,
        recommendations: this.generateRecommendations(riskLevel, riskFactors),
        next_assessment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      // حفظ التقييم
      await this.saveRelapseRisk(relapseRisk);

      return relapseRisk;
    } catch (error) {
      console.error('Error assessing relapse risk:', error);
      throw error;
    }
  }

  async generateSmartReport(patientId: string, reportType: string): Promise<string> {
    try {
      const prompt = `قم بإنشاء تقرير ${reportType} شامل للمريض رقم ${patientId}.
التقرير يجب أن يتضمن:
1. ملخص الحالة
2. التقدم المحرز
3. التحديات
4. التوصيات
5. الخطوات التالية

أجب باللغة العربية وبشكل منظم ومهني.`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { 
              role: "system", 
              content: "أنت خبير في كتابة التقارير الطبية. اكتب تقارير شاملة ومهنية." 
            },
            { role: "user", content: prompt }
          ],
          max_tokens: 800,
          temperature: 0.5
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "لم يتم إنشاء التقرير";
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  // Helper methods
  private extractPlanType(response: string): 'individual' | 'group' | 'family' {
    if (response.includes('فردي')) return 'individual';
    if (response.includes('جماعي')) return 'group';
    if (response.includes('عائلي')) return 'family';
    return 'individual';
  }

  private extractDuration(response: string): number {
    const match = response.match(/(\d+)\s*أسبوع/);
    return match ? parseInt(match[1]) : 8;
  }

  private extractSessions(response: string): number {
    const match = response.match(/(\d+)\s*جلسة/);
    return match ? parseInt(match[1]) : 2;
  }

  private extractGoals(response: string): string[] {
    const goals = response.match(/الهدف[^:]*:\s*([^\n]+)/g);
    return goals ? goals.map(g => g.replace(/الهدف[^:]*:\s*/, '').trim()) : ['تحسين الحالة العامة'];
  }

  private extractInterventions(response: string): string[] {
    const interventions = response.match(/التدخل[^:]*:\s*([^\n]+)/g);
    return interventions ? interventions.map(i => i.replace(/التدخل[^:]*:\s*/, '').trim()) : ['علاج سلوكي معرفي'];
  }

  private extractRiskMitigation(response: string): string[] {
    const risks = response.match(/المخاطر[^:]*:\s*([^\n]+)/g);
    return risks ? risks.map(r => r.replace(/المخاطر[^:]*:\s*/, '').trim()) : ['متابعة دورية'];
  }

  private extractSuccessMetrics(response: string): string[] {
    const metrics = response.match(/المؤشر[^:]*:\s*([^\n]+)/g);
    return metrics ? metrics.map(m => m.replace(/المؤشر[^:]*:\s*/, '').trim()) : ['تحسن الحالة'];
  }

  private analyzeRiskFactors(patient: any, sessions: any[]): string[] {
    const factors: string[] = [];
    
    // تحليل عوامل الخطر
    if (patient.treatment_duration < 3) factors.push('مدة علاج قصيرة');
    if (sessions.length < 10) factors.push('قلة الجلسات');
    if (patient.relapse_count > 2) factors.push('تاريخ انتكاسات متعدد');
    if (patient.support_system === 'weak') factors.push('ضعف النظام الداعم');
    
    return factors;
  }

  private calculateRiskLevel(factors: string[]): 'low' | 'medium' | 'high' | 'critical' {
    if (factors.length >= 4) return 'critical';
    if (factors.length >= 3) return 'high';
    if (factors.length >= 2) return 'medium';
    return 'low';
  }

  private calculateProbability(factors: string[]): number {
    return Math.min(0.9, 0.1 + (factors.length * 0.2));
  }

  private generateRecommendations(riskLevel: string, factors: string[]): string[] {
    const recommendations: string[] = [];
    
    if (riskLevel === 'critical') {
      recommendations.push('زيادة المتابعة اليومية');
      recommendations.push('جلسات علاج مكثفة');
      recommendations.push('دعم عائلي إضافي');
    } else if (riskLevel === 'high') {
      recommendations.push('متابعة أسبوعية');
      recommendations.push('جلسات علاج إضافية');
    } else if (riskLevel === 'medium') {
      recommendations.push('متابعة دورية');
      recommendations.push('تقييم شهري');
    } else {
      recommendations.push('متابعة عادية');
    }
    
    return recommendations;
  }

  private async saveTreatmentPlan(plan: TreatmentPlan): Promise<void> {
    await supabase
      .from('treatment_plans')
      .insert([plan]);
  }

  private async saveRelapseRisk(risk: RelapseRisk): Promise<void> {
    await supabase
      .from('relapse_risks')
      .insert([risk]);
  }
}

export const aiService = new AIService(); 