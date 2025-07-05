import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
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
  BarChart3
} from 'lucide-react';
import { aiService, PatientData, TreatmentPlan, RelapseRisk } from '@/services/ai-service';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';

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

      const patientData: PatientData = {
        id: patient.id,
        name: patient.name,
        age: patient.age,
        addiction_type: patient.addiction_type,
        treatment_history: [],
        current_status: patient.status,
        risk_factors: []
      };

      const plan = await aiService.generateTreatmentPlan(patientData);
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
      const risk = await aiService.assessRelapseRisk(selectedPatient);
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
      const content = await aiService.generateSmartReport(selectedPatient, reportType);
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
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <Brain className="inline-block w-8 h-8 mr-2 text-blue-600" />
            الذكاء الاصطناعي المتقدم
          </h1>
          <p className="text-gray-600">تحليل ذكي وخطط علاجية مخصصة باستخدام الذكاء الاصطناعي</p>
        </div>

        {/* اختيار المريض */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>اختيار المريض</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="w-80">
                  <SelectValue placeholder="اختر المريض" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} - {patient.addiction_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                onClick={generateTreatmentPlan}
                disabled={!selectedPatient || loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                إنشاء خطة علاجية
              </Button>
              
              <Button
                onClick={assessRelapseRisk}
                disabled={!selectedPatient || loading}
                variant="outline"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
                تقييم مخاطر الانتكاس
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* التبويبات */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="treatment-plan" className="flex items-center space-x-2 rtl:space-x-reverse">
              <Target className="h-4 w-4" />
              <span>خطة العلاج</span>
            </TabsTrigger>
            <TabsTrigger value="risk-assessment" className="flex items-center space-x-2 rtl:space-x-reverse">
              <Shield className="h-4 w-4" />
              <span>تقييم المخاطر</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2 rtl:space-x-reverse">
              <FileText className="h-4 w-4" />
              <span>التقارير</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2 rtl:space-x-reverse">
              <BarChart3 className="h-4 w-4" />
              <span>التحليلات</span>
            </TabsTrigger>
          </TabsList>

          {/* خطة العلاج */}
          <TabsContent value="treatment-plan" className="space-y-6">
            {treatmentPlan ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="mr-2 h-5 w-5 text-blue-600" />
                      تفاصيل الخطة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">نوع العلاج</Label>
                        <p className="text-lg font-semibold">
                          {treatmentPlan.plan_type === 'individual' ? 'فردي' : 
                           treatmentPlan.plan_type === 'group' ? 'جماعي' : 'عائلي'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">المدة</Label>
                        <p className="text-lg font-semibold">{treatmentPlan.duration_weeks} أسابيع</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">الجلسات أسبوعياً</Label>
                        <p className="text-lg font-semibold">{treatmentPlan.sessions_per_week} جلسة</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">تاريخ الإنشاء</Label>
                        <p className="text-sm text-gray-600">
                          {new Date(treatmentPlan.created_at).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="mr-2 h-5 w-5 text-yellow-600" />
                      الأهداف العلاجية
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {treatmentPlan.goals.map((goal, index) => (
                        <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-green-600" />
                      التدخلات المطلوبة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {treatmentPlan.interventions.map((intervention, index) => (
                        <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{intervention}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-red-600" />
                      استراتيجيات تقليل المخاطر
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {treatmentPlan.risk_mitigation.map((risk, index) => (
                        <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm">{risk}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Brain className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-center">
                    اختر مريضاً واضغط على "إنشاء خطة علاجية" لبدء التحليل الذكي
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* تقييم المخاطر */}
          <TabsContent value="risk-assessment" className="space-y-6">
            {relapseRisk ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                      مستوى الخطر
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className={`w-4 h-4 rounded-full ${getRiskLevelColor(relapseRisk.risk_level)}`}></div>
                      <div>
                        <p className="text-lg font-semibold">
                          {getRiskLevelText(relapseRisk.risk_level)}
                        </p>
                        <p className="text-sm text-gray-600">
                          احتمالية الانتكاس: {(relapseRisk.probability * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">نسبة الخطر</Label>
                      <Progress value={relapseRisk.probability * 100} className="mt-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-blue-600" />
                      عوامل الخطر
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {relapseRisk.risk_factors.map((factor, index) => (
                        <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="mr-2 h-5 w-5 text-yellow-600" />
                      التوصيات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {relapseRisk.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start space-x-2 rtl:space-x-reverse p-3 bg-yellow-50 rounded-lg">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                          <span className="text-sm">{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-center">
                    اختر مريضاً واضغط على "تقييم مخاطر الانتكاس" لبدء التحليل
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* التقارير */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-green-600" />
                  إنشاء تقرير ذكي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="نوع التقرير" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="progress">تقرير التقدم</SelectItem>
                      <SelectItem value="treatment">تقرير العلاج</SelectItem>
                      <SelectItem value="assessment">تقرير التقييم</SelectItem>
                      <SelectItem value="summary">التقرير الشامل</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    onClick={generateReport}
                    disabled={!selectedPatient || loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                    إنشاء التقرير
                  </Button>
                </div>

                {reportContent && (
                  <div className="mt-6">
                    <Label className="text-sm font-medium">محتوى التقرير</Label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                        {reportContent}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* التحليلات */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                    معدل النجاح
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">85%</div>
                  <p className="text-sm text-gray-600">زيادة 12% عن الشهر الماضي</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                    معدل الانتكاس
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">8%</div>
                  <p className="text-sm text-gray-600">انخفاض 5% عن الشهر الماضي</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-600" />
                    المرضى النشطين
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">156</div>
                  <p className="text-sm text-gray-600">زيادة 23 مريض هذا الشهر</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>تحليل الأداء الشهري</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>سيتم إضافة الرسوم البيانية التفاعلية قريباً</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdvancedAITreatment; 