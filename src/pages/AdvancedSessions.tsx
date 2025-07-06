import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Target, 
  Activity, 
  Calendar, 
  FileText,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Save,
  Loader2
} from 'lucide-react';
import { SessionAIService } from '@/services/session-ai-service';
import { SupabaseService } from '@/services/supabase-service';
import { Session, TreatmentGoal, Activity as ActivityType } from '@/types/session';
import SessionAnalysis from '@/components/ai/SessionAnalysis';
import SessionReportGenerator from '@/components/ai/SessionReportGenerator';

export default function AdvancedSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // إنشاء instances من الخدمات
  const aiService = new SessionAIService();
  const supabaseService = new SupabaseService();

  // حالة الجلسة الجديدة
  const [newSession, setNewSession] = useState({
    patient_id: '',
    session_type: 'individual' as const,
    duration: 60,
    raw_notes: '',
    therapist_assessment: {
      patient_cooperation: 5,
      session_effectiveness: 5,
      challenges_faced: [] as string[],
      positive_developments: [] as string[]
    }
  });

  // جلب الجلسات عند تحميل الصفحة
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const sessionsData = await supabaseService.getSessions();
      // تحويل البيانات لتتوافق مع نوع Session
      const typedSessions = sessionsData.map(session => ({
        ...session,
        session_type: session.session_type as 'individual' | 'group' | 'family',
        status: session.status as 'scheduled' | 'completed' | 'cancelled'
      })) as Session[];
      setSessions(typedSessions);
    } catch (error) {
      console.error('خطأ في جلب الجلسات:', error);
      setError('فشل في جلب الجلسات');
      // استخدام بيانات وهمية في حالة الخطأ
      const mockData = supabaseService.getMockData();
      const typedMockSessions = mockData.sessions.map(session => ({
        ...session,
        session_type: session.session_type as 'individual' | 'group' | 'family',
        status: session.status as 'scheduled' | 'completed' | 'cancelled'
      })) as Session[];
      setSessions(typedMockSessions);
    } finally {
      setIsLoading(false);
    }
  };

  // معالجة الجلسة بالذكاء الاصطناعي
  const processSessionWithAI = async () => {
    if (!newSession.raw_notes.trim()) {
      setError('يرجى إدخال ملاحظات الجلسة أولاً');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      // معالجة الملاحظات
      const processedData = await aiService.processSessionNotes(newSession.raw_notes);
      
      // إنشاء كائن Session مؤقت للاستخدام في الخدمات
      const tempSession: Partial<Session> = {
        patient_id: newSession.patient_id || 'patient-1',
        therapist_id: 'therapist-1',
        session_date: new Date().toISOString().split('T')[0],
        session_time: new Date().toLocaleTimeString(),
        duration: newSession.duration,
        session_type: newSession.session_type,
        status: 'completed',
        raw_notes: newSession.raw_notes,
        ai_processed_notes: processedData.processedNotes,
        session_summary: processedData.summary,
        emotions: processedData.emotions,
        treatment_goals: [],
        current_progress: 0,
        next_session_plan: '',
        therapist_assessment: newSession.therapist_assessment,
        center_goals: [],
        activities_planned: []
      };
      
      // اقتراح أهداف علاجية
      const treatmentGoals = await aiService.suggestTreatmentGoals(
        tempSession as Session,
        {} // تاريخ المريض
      );

      // اقتراح أنشطة
      const activities = await aiService.suggestCenterActivities(
        tempSession as Session,
        {} // ملف المريض
      );

      // اقتراح خطة للجلسة القادمة
      const nextSessionPlan = await aiService.suggestNextSessionPlan(
        tempSession as Session,
        {} // تقدم المريض
      );

      // تحليل شامل
      const analysis = await aiService.comprehensiveSessionAnalysis(
        tempSession as Session
      );

      setAiInsights({
        processedData,
        treatmentGoals,
        activities,
        nextSessionPlan,
        analysis
      });

    } catch (error) {
      console.error('خطأ في معالجة الجلسة:', error);
      setError('حدث خطأ في معالجة الجلسة');
    } finally {
      setIsProcessing(false);
    }
  };

  // معالجة التقارير المولدة
  const handleReportGenerated = (reports: { manager: string; family: string }) => {
    // Implementation needed
  };

  // حفظ الجلسة
  const saveSession = async () => {
    if (!aiInsights) {
      setError('يرجى معالجة الجلسة بالذكاء الاصطناعي أولاً');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const sessionData: Omit<Session, 'id' | 'created_at' | 'updated_at'> = {
        patient_id: newSession.patient_id || 'patient-1',
        therapist_id: 'therapist-1',
        session_date: new Date().toISOString().split('T')[0],
        session_time: new Date().toLocaleTimeString(),
        duration: newSession.duration,
        session_type: newSession.session_type,
        status: 'completed',
        raw_notes: newSession.raw_notes,
        ai_processed_notes: aiInsights.processedData.processedNotes,
        session_summary: aiInsights.processedData.summary,
        emotions: aiInsights.processedData.emotions,
        treatment_goals: aiInsights.treatmentGoals,
        current_progress: 0,
        next_session_plan: aiInsights.nextSessionPlan,
        therapist_assessment: newSession.therapist_assessment,
        center_goals: [],
        activities_planned: aiInsights.activities
      };

      const savedSession = await supabaseService.createSession(sessionData);
      setSessions([savedSession, ...sessions]);
      
      // إعادة تعيين النموذج
      setNewSession({
        patient_id: '',
        session_type: 'individual',
        duration: 60,
        raw_notes: '',
        therapist_assessment: {
          patient_cooperation: 5,
          session_effectiveness: 5,
          challenges_faced: [],
          positive_developments: []
        }
      });
      setAiInsights(null);

    } catch (error) {
      console.error('خطأ في حفظ الجلسة:', error);
      setError('فشل في حفظ الجلسة');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الجلسات العلاجية المتقدمة</h1>
          <p className="text-gray-600 mt-2">نظام الجلسات مع الذكاء الاصطناعي</p>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-blue-600" />
          <span className="text-lg font-semibold text-blue-600">AI Powered</span>
        </div>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="new-session" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="new-session">جلسة جديدة</TabsTrigger>
          <TabsTrigger value="ai-analysis">تحليل الذكاء الاصطناعي</TabsTrigger>
          <TabsTrigger value="reports">التقارير المخصصة</TabsTrigger>
          <TabsTrigger value="sessions-history">تاريخ الجلسات</TabsTrigger>
        </TabsList>

        {/* جلسة جديدة */}
        <TabsContent value="new-session" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>إدخال بيانات الجلسة</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="patient_id">رقم المريض</Label>
                  <Input
                    id="patient_id"
                    value={newSession.patient_id}
                    onChange={(e) => setNewSession({...newSession, patient_id: e.target.value})}
                    placeholder="أدخل رقم المريض"
                  />
                </div>
                <div>
                  <Label htmlFor="session_type">نوع الجلسة</Label>
                  <Select
                    value={newSession.session_type}
                    onValueChange={(value: any) => setNewSession({...newSession, session_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">فردية</SelectItem>
                      <SelectItem value="group">جماعية</SelectItem>
                      <SelectItem value="family">عائلية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">مدة الجلسة (دقيقة)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newSession.duration}
                    onChange={(e) => setNewSession({...newSession, duration: parseInt(e.target.value)})}
                    min="15"
                    max="180"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="raw_notes">ملاحظات الجلسة (الملاحظات الخام)</Label>
                <Textarea
                  id="raw_notes"
                  value={newSession.raw_notes}
                  onChange={(e) => setNewSession({...newSession, raw_notes: e.target.value})}
                  placeholder="اكتب ملاحظات الجلسة كما حدثت بالتفصيل..."
                  rows={8}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cooperation">تعاون المريض (1-10)</Label>
                  <Input
                    id="cooperation"
                    type="number"
                    min="1"
                    max="10"
                    value={newSession.therapist_assessment.patient_cooperation}
                    onChange={(e) => setNewSession({
                      ...newSession,
                      therapist_assessment: {
                        ...newSession.therapist_assessment,
                        patient_cooperation: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="effectiveness">فعالية الجلسة (1-10)</Label>
                  <Input
                    id="effectiveness"
                    type="number"
                    min="1"
                    max="10"
                    value={newSession.therapist_assessment.session_effectiveness}
                    onChange={(e) => setNewSession({
                      ...newSession,
                      therapist_assessment: {
                        ...newSession.therapist_assessment,
                        session_effectiveness: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>

              <Button 
                onClick={processSessionWithAI}
                disabled={isProcessing || !newSession.raw_notes.trim()}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    جاري المعالجة بالذكاء الاصطناعي...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    معالجة الجلسة بالذكاء الاصطناعي
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تحليل الذكاء الاصطناعي */}
        <TabsContent value="ai-analysis" className="space-y-6">
          {aiInsights ? (
            <>
              {/* الملاحظات المعالجة */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <span>الملاحظات المعالجة بالذكاء الاصطناعي</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">الملاحظات المنظمة:</Label>
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                        {aiInsights.processedData.processedNotes}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">ملخص الجلسة:</Label>
                      <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                        {aiInsights.processedData.summary}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* تحليل المشاعر */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>تحليل المشاعر</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">المشاعر الأساسية:</Label>
                      <Badge variant="outline" className="mt-2">
                        {aiInsights.processedData.emotions.primary_emotion}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">شدة المشاعر:</Label>
                      <div className="mt-2">
                        <Progress value={aiInsights.processedData.emotions.intensity * 10} />
                        <span className="text-sm text-gray-600">{aiInsights.processedData.emotions.intensity}/10</span>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium">المشاعر الثانوية:</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {aiInsights.processedData.emotions.secondary_emotions.map((emotion: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {emotion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* الأهداف العلاجية */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    <span>الأهداف العلاجية المقترحة</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiInsights.treatmentGoals.map((goal: TreatmentGoal) => (
                      <div key={goal.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{goal.title}</h4>
                          <Badge variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'}>
                            {goal.priority === 'high' ? 'عالية' : goal.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{goal.description}</p>
                        <div className="mt-2">
                          <Progress value={goal.progress} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* الأنشطة المقترحة */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-orange-600" />
                    <span>الأنشطة المقترحة للمركز</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiInsights.activities.map((activity: ActivityType) => (
                      <div key={activity.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{activity.title}</h4>
                          <Badge variant="outline">{activity.type === 'individual' ? 'فردي' : activity.type === 'group' ? 'جماعي' : 'عائلي'}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{activity.description}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>المدة: {activity.duration} دقيقة</span>
                          <span>التكرار: {activity.frequency === 'daily' ? 'يومي' : activity.frequency === 'weekly' ? 'أسبوعي' : 'شهري'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* خطة الجلسة القادمة */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                    <span>خطة الجلسة القادمة</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    {aiInsights.nextSessionPlan}
                  </div>
                </CardContent>
              </Card>

              {/* التحليل الشامل */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    <span>التحليل الشامل والتوصيات</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">الرؤى المهمة</h4>
                      <ul className="space-y-1">
                        {aiInsights.analysis.insights.map((insight: string, index: number) => (
                          <li key={index} className="text-sm flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700 mb-2">التوصيات</h4>
                      <ul className="space-y-1">
                        {aiInsights.analysis.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-sm flex items-start">
                            <Lightbulb className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-700 mb-2">عوامل الخطر</h4>
                      <ul className="space-y-1">
                        {aiInsights.analysis.riskFactors.map((risk: string, index: number) => (
                          <li key={index} className="text-sm flex items-start">
                            <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">المؤشرات الإيجابية</h4>
                      <ul className="space-y-1">
                        {aiInsights.analysis.positiveIndicators.map((indicator: string, index: number) => (
                          <li key={index} className="text-sm flex items-start">
                            <TrendingUp className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            {indicator}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={saveSession} disabled={isProcessing} className="w-full">
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    حفظ الجلسة
                  </>
                )}
              </Button>
            </>
          ) : (
            <Alert>
              <AlertDescription>
                قم بمعالجة جلسة جديدة أولاً لعرض التحليل
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* التقارير المخصصة */}
        <TabsContent value="reports" className="space-y-6">
          {aiInsights ? (
            <SessionReportGenerator 
              sessionData={{
                id: 'temp-session',
                patient_id: newSession.patient_id,
                patient_name: `المقيم ${newSession.patient_id}`,
                session_date: new Date().toLocaleDateString('ar-EG'),
                session_type: newSession.session_type,
                raw_notes: newSession.raw_notes,
                ai_processed_notes: aiInsights.processedData?.processedNotes || '',
                emotions: aiInsights.processedData?.emotions || {},
                therapist_assessment: newSession.therapist_assessment
              }}
              onReportGenerated={handleReportGenerated}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">قم بإنشاء جلسة جديدة أولاً لتوليد التقارير المخصصة</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* تاريخ الجلسات */}
        <TabsContent value="sessions-history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تاريخ الجلسات</CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">لا توجد جلسات محفوظة</p>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">مريض رقم: {session.patient_id}</h4>
                          <p className="text-sm text-gray-600">
                            {session.session_date} - {session.session_time}
                          </p>
                        </div>
                        <Badge variant="outline">{session.session_type}</Badge>
                      </div>
                      <p className="text-sm mt-2">{session.session_summary}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-sm text-gray-500">المدة: {session.duration} دقيقة</span>
                        <span className="text-sm text-gray-500">التقدم: {session.current_progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 