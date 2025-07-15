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
  Heart, 
  CheckCircle,
  AlertTriangle,
  Users,
  FileText,
  Save,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SessionAIService } from '@/services/session-ai-service';
import { SupabaseService } from '@/services/supabase-service';
import { Session, AIAnalysisResult } from '@/types/session';


export default function AdvancedSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<{
    processedData: AIAnalysisResult;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // إنشاء instances من الخدمات
  const aiService = new SessionAIService();
  const supabaseService = new SupabaseService();
  const { toast } = useToast();

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
        session_summary: processedData.processedNotes.substring(0, 200) + '...',
        emotions: processedData.emotions,
        therapist_assessment: newSession.therapist_assessment
      };
      


              setAiInsights({
          processedData
        });

    } catch (error) {
      console.error('خطأ في معالجة الجلسة:', error);
      setError('حدث خطأ في معالجة الجلسة');
    } finally {
      setIsProcessing(false);
    }
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
        session_summary: aiInsights.processedData.processedNotes.substring(0, 200) + '...',
        emotions: aiInsights.processedData.emotions,
        therapist_assessment: newSession.therapist_assessment,
        // تم حذف الخصائص القديمة
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">الجلسات العلاجية المتقدمة</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">نظام الجلسات مع الذكاء الاصطناعي</p>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          <span className="text-base sm:text-lg font-semibold text-blue-600">AI Powered</span>
        </div>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="new-session" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="new-session" className="text-sm sm:text-base">جلسة جديدة</TabsTrigger>
          <TabsTrigger value="ai-analysis" className="text-sm sm:text-base">تحليل الذكاء الاصطناعي</TabsTrigger>
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
                className="w-full h-12 text-base"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    جاري المعالجة بالذكاء الاصطناعي...
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5 mr-2" />
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
              {/* إعادة صياغة باللهجة المصرية */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <span>إعادة صياغة باللهجة المصرية</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">الملاحظات المعاد صياغتها:</Label>
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg text-right">
                        {aiInsights.processedData.processedNotes}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* تحليل المشاعر ونمط التفكير */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    <Heart className="h-5 w-5 text-red-600" />
                    <span>تحليل المشاعر ونمط التفكير</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium">نمط التفكير:</Label>
                      <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                        {aiInsights.processedData.thinkingPattern}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium">الحالة النفسية العامة:</Label>
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        {aiInsights.processedData.psychologicalState}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* خطة علاجية بسيطة */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    <Heart className="h-5 w-5 text-purple-600" />
                    <span>خطة علاجية بسيطة</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">أهداف الجلسة القادمة:</Label>
                      <div className="mt-2 space-y-2">
                        {aiInsights.processedData.treatmentPlan.goals.map((goal: string, index: number) => (
                          <div key={index} className="p-3 bg-green-50 rounded-lg">
                            <div className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{goal}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">الاتجاه العلاجي:</Label>
                      <div className="mt-2 p-3 bg-indigo-50 rounded-lg">
                        {aiInsights.processedData.treatmentPlan.direction}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">تمرين أو نشاط مقترح:</Label>
                      <div className="mt-2 p-3 bg-orange-50 rounded-lg">
                        {aiInsights.processedData.treatmentPlan.exercise}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* تقرير مختصر للأهل */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    <Users className="h-5 w-5 text-teal-600" />
                    <span>تقرير مختصر للأهل</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-teal-50 rounded-lg border-l-4 border-teal-500">
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {aiInsights.processedData.familyReport}
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    <AlertTriangle className="h-3 w-3 inline mr-1" />
                    هذا التقرير محمي بخصوصية المقيم ولا يحتوي على معلومات حساسة
                  </div>
                </CardContent>
              </Card>



              <Button onClick={saveSession} disabled={isProcessing} className="w-full h-12 text-base">
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
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


      </Tabs>
    </div>
  );
} 