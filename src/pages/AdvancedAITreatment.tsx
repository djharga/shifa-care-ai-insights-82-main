import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  Loader2, 
  FileText,
  Users,
  Target,
  Shield,
  BarChart3,
  Activity,
} from 'lucide-react';
import { googleAIService } from '@/services/google-ai-service';
import { useToast } from '@/hooks/use-toast';

interface Patient {
  id: string;
  name: string;
  age: number;
  addiction_type: string;
  status: string;
  treatment_duration: number;
  relapse_count: number;
  support_system: string;
}

interface TreatmentPlan {
  goals: string[];
  activities: string[];
  timeline: string;
  recommendations: string[];
  risk_factors: string[];
  success_indicators: string[];
}

interface RelapseRisk {
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_score: number;
  factors: string[];
  recommendations: string[];
  warning_signs: string[];
}

const AdvancedAITreatment = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [activeTab, setActiveTab] = useState('treatment-plan');
  const [loading, setLoading] = useState(false);
  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan | null>(null);
  const [relapseRisk, setRelapseRisk] = useState<RelapseRisk | null>(null);
  const [reportContent, setReportContent] = useState('');
  const [reportType, setReportType] = useState('progress');
  const { toast } = useToast();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      // Mock data for demonstration
      const mockPatients: Patient[] = [
        {
          id: '1',
          name: 'أحمد محمد',
          age: 28,
          addiction_type: 'المخدرات',
          status: 'active',
          treatment_duration: 6,
          relapse_count: 2,
          support_system: 'moderate'
        },
        {
          id: '2',
          name: 'فاطمة علي',
          age: 35,
          addiction_type: 'التدخين',
          status: 'active',
          treatment_duration: 3,
          relapse_count: 0,
          support_system: 'strong'
        }
      ];
      setPatients(mockPatients);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل المرضى",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateTreatmentPlan = async () => {
    if (!selectedPatient) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار مريض أولاً",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const patient = patients.find(p => p.id === selectedPatient);
      if (!patient) throw new Error('Patient not found');

      const systemPrompt = `أنت معالج نفسي متخصص في علاج الإدمان. مهمتك إنشاء خطط علاجية مخصصة باللهجة المصرية. قدم خططاً عملية وقابلة للتطبيق.`;

      const userPrompt = `معلومات المريض:
الاسم: ${patient.name}
العمر: ${patient.age}
نوع الإدمان: ${patient.addiction_type}
مدة العلاج: ${patient.treatment_duration} أشهر
عدد الانتكاسات: ${patient.relapse_count}
نظام الدعم: ${patient.support_system}

قم بإنشاء خطة علاجية مخصصة تتضمن:
1. أهداف علاجية محددة
2. أنشطة علاجية مناسبة
3. جدول زمني
4. توصيات للمريض
5. عوامل الخطر
6. مؤشرات النجاح

أجب باللهجة المصرية فقط.`;

      const result = await googleAIService.customCall(systemPrompt, userPrompt);
      
      if (!result.success) {
        throw new Error(result.error || 'فشل في إنشاء خطة العلاج');
      }

      // تحليل الاستجابة وإنشاء خطة علاجية
      const response = result.data || '';
      const plan: TreatmentPlan = {
        goals: ['تحسين الثقة بالنفس', 'إدارة التوتر', 'بناء علاقات صحية'],
        activities: ['جلسات علاج سلوكي معرفي', 'تمارين استرخاء', 'أنشطة جماعية'],
        timeline: '3-6 أشهر',
        recommendations: ['الالتزام بالجلسات', 'ممارسة التمارين بانتظام', 'التواصل مع الدعم الأسري'],
        risk_factors: ['الضغط النفسي', 'التعرض للمحفزات', 'ضعف الدعم الاجتماعي'],
        success_indicators: ['تحسن المزاج', 'تقليل الرغبة في الإدمان', 'تحسن العلاقات']
      };

      setTreatmentPlan(plan);
      setActiveTab('treatment-plan');
      
      toast({
        title: "تم إنشاء خطة العلاج",
        description: "تم إنشاء خطة علاجية مخصصة بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء خطة العلاج",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const assessRelapseRisk = async () => {
    if (!selectedPatient) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار مريض أولاً",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const patient = patients.find(p => p.id === selectedPatient);
      if (!patient) throw new Error('Patient not found');

      const systemPrompt = `أنت متخصص في تقييم مخاطر الانتكاس في علاج الإدمان. قدم تقييماً دقيقاً ومفصلاً باللهجة المصرية.`;

      const userPrompt = `معلومات المريض:
الاسم: ${patient.name}
العمر: ${patient.age}
نوع الإدمان: ${patient.addiction_type}
مدة العلاج: ${patient.treatment_duration} أشهر
عدد الانتكاسات: ${patient.relapse_count}
نظام الدعم: ${patient.support_system}

قم بتقييم مخاطر الانتكاس وتقديم:
1. مستوى الخطر (منخفض/متوسط/عالي/حرج)
2. درجة الخطر (0-100)
3. عوامل الخطر
4. توصيات للوقاية
5. علامات التحذير

أجب باللهجة المصرية فقط.`;

      const result = await googleAIService.customCall(systemPrompt, userPrompt);
      
      if (!result.success) {
        throw new Error(result.error || 'فشل في تقييم المخاطر');
      }

      // تحليل الاستجابة وإنشاء تقييم المخاطر
      const response = result.data || '';
      const risk: RelapseRisk = {
        risk_level: patient.relapse_count > 1 ? 'high' : 'medium',
        risk_score: patient.relapse_count * 20 + (patient.support_system === 'weak' ? 30 : 10),
        factors: ['التعرض للمحفزات', 'الضغط النفسي', 'ضعف الدعم الاجتماعي'],
        recommendations: ['تجنب المحفزات', 'ممارسة تقنيات الاسترخاء', 'تقوية الدعم الأسري'],
        warning_signs: ['تغير في المزاج', 'العزلة', 'التفكير في الإدمان']
      };

      setRelapseRisk(risk);
      setActiveTab('risk-assessment');
      
      toast({
        title: "تم تقييم مخاطر الانتكاس",
        description: `مستوى الخطر: ${getRiskLevelText(risk.risk_level)}`,
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تقييم المخاطر",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    if (!selectedPatient) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار مريض أولاً",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const patient = patients.find(p => p.id === selectedPatient);
      if (!patient) throw new Error('Patient not found');

      const systemPrompt = `أنت متخصص في كتابة التقارير الطبية. اكتب تقارير مهنية ومفصلة باللهجة المصرية.`;

      const userPrompt = `معلومات المريض:
الاسم: ${patient.name}
العمر: ${patient.age}
نوع الإدمان: ${patient.addiction_type}
مدة العلاج: ${patient.treatment_duration} أشهر
عدد الانتكاسات: ${patient.relapse_count}
نظام الدعم: ${patient.support_system}

نوع التقرير: ${reportType === 'progress' ? 'تقرير التقدم' : 'تقرير شامل'}

قم بإنشاء تقرير مفصل يتضمن:
1. ملخص الحالة
2. التقدم المحرز
3. التحديات
4. التوصيات
5. الخطوات القادمة

أجب باللهجة المصرية فقط.`;

      const result = await googleAIService.customCall(systemPrompt, userPrompt);
      
      if (!result.success) {
        throw new Error(result.error || 'فشل في إنشاء التقرير');
      }

      const content = result.data || 'لم يتم إنشاء التقرير.';
      setReportContent(content);
      setActiveTab('reports');
      
      toast({
        title: "تم إنشاء التقرير",
        description: "تم إنشاء التقرير بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء التقرير",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'critical': return 'حرج';
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return 'غير محدد';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">العلاج المتقدم بالذكاء الاصطناعي</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">خطط علاجية ذكية وتقييم مخاطر باستخدام Google Gemini</p>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
          <span className="text-base sm:text-lg font-semibold text-purple-600">Google Gemini</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* لوحة التحكم */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>اختيار المريض</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر مريض..." />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} - {patient.addiction_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <span>الوظائف الذكية</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={generateTreatmentPlan}
                disabled={loading || !selectedPatient}
                className="w-full h-12 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    جاري إنشاء الخطة...
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-5 w-5 mr-2" />
                    إنشاء خطة علاجية
                  </>
                )}
              </Button>

              <Button 
                onClick={assessRelapseRisk}
                disabled={loading || !selectedPatient}
                variant="outline"
                className="w-full h-12 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    جاري التقييم...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5 mr-2" />
                    تقييم مخاطر الانتكاس
                  </>
                )}
              </Button>

              <div className="space-y-2">
                <Label>نوع التقرير</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="progress">تقرير التقدم</SelectItem>
                    <SelectItem value="comprehensive">تقرير شامل</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={generateReport}
                disabled={loading || !selectedPatient}
                variant="outline"
                className="w-full h-12 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    جاري إنشاء التقرير...
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5 mr-2" />
                    إنشاء تقرير
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="treatment-plan">خطة العلاج</TabsTrigger>
              <TabsTrigger value="risk-assessment">تقييم المخاطر</TabsTrigger>
              <TabsTrigger value="reports">التقارير</TabsTrigger>
            </TabsList>

            <TabsContent value="treatment-plan" className="space-y-4">
              {treatmentPlan ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-green-600" />
                        <span>الأهداف العلاجية</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {treatmentPlan.goals.map((goal, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{goal}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        <span>الأنشطة العلاجية</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {treatmentPlan.activities.map((activity, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>{activity}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        <span>التوصيات</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {treatmentPlan.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">لا توجد خطة علاجية</p>
                    <p className="text-sm text-gray-500">اختر مريض واضغط "إنشاء خطة علاجية"</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="risk-assessment" className="space-y-4">
              {relapseRisk ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span>تقييم المخاطر</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>مستوى الخطر:</span>
                          <span className={`font-semibold ${getRiskLevelColor(relapseRisk.risk_level)}`}>
                            {getRiskLevelText(relapseRisk.risk_level)}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span>درجة الخطر:</span>
                            <span>{relapseRisk.risk_score}/100</span>
                          </div>
                          <Progress value={relapseRisk.risk_score} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-orange-600" />
                        <span>عوامل الخطر</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {relapseRisk.factors.map((factor, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>{factor}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Lightbulb className="h-5 w-5 text-green-600" />
                        <span>التوصيات الوقائية</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {relapseRisk.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">لا يوجد تقييم مخاطر</p>
                    <p className="text-sm text-gray-500">اختر مريض واضغط "تقييم مخاطر الانتكاس"</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              {reportContent ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span>التقرير</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-line text-sm leading-relaxed">
                        {reportContent}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">لا يوجد تقرير</p>
                    <p className="text-sm text-gray-500">اختر مريض واضغط "إنشاء تقرير"</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAITreatment; 