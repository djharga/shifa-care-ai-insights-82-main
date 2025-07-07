import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Download, 
  CheckCircle,
  RefreshCw,
  Brain,
  UserCheck,
  Shield
} from 'lucide-react';
import { googleAIService } from '@/services/google-ai-service';

interface SessionData {
  id: string;
  patient_id: string;
  patient_name: string;
  session_date: string;
  session_type: string;
  raw_notes: string;
  ai_processed_notes: string;
  emotions: any;
  therapist_assessment: any;
}

interface ReportData {
  managerReport: string;
  familyReport: string;
  isGenerating: boolean;
  lastGenerated: Date | null;
}

interface SessionReportGeneratorProps {
  sessionData: SessionData;
  onReportGenerated: (reports: { manager: string; family: string }) => void;
}

const SessionReportGenerator: React.FC<SessionReportGeneratorProps> = ({
  sessionData,
  onReportGenerated
}) => {
  const [reportData, setReportData] = useState<ReportData>({
    managerReport: '',
    familyReport: '',
    isGenerating: false,
    lastGenerated: null
  });

  const [selectedReportType, setSelectedReportType] = useState<'manager' | 'family'>('manager');

  // توليد تقرير المدير العلاجي
  const generateManagerReport = async () => {
    const systemPrompt = `أنت خبير في كتابة التقارير الطبية للمديرين العلاجيين. 
    اكتب تقريراً مفصلاً ومهنياً يتضمن:
    - تحليل شامل للجلسة
    - تقييم التقدم العلاجي
    - التوصيات المهنية
    - مؤشرات النجاح
    - المخاطر المحتملة
    
    استخدم لغة طبية مهنية باللهجة المصرية.`;

    const userPrompt = `
    بيانات الجلسة:
    - المقيم: ${sessionData.patient_name}
    - تاريخ الجلسة: ${sessionData.session_date}
    - نوع الجلسة: ${sessionData.session_type}
    - ملاحظات الجلسة: ${sessionData.raw_notes}
    - تحليل المشاعر: ${JSON.stringify(sessionData.emotions)}
    - تقييم المعالج: ${JSON.stringify(sessionData.therapist_assessment)}
    
    اكتب تقريراً مفصلاً للمدير العلاجي يتضمن:
    1. ملخص الجلسة
    2. تحليل المشاعر والسلوك
    3. التقدم المحرز
    4. التحديات والمخاوف
    5. التوصيات العلاجية
    6. خطة المتابعة
    7. مؤشرات النجاح
    
    اكتب باللهجة المصرية المهنية.`;

    try {
      const result = await googleAIService.customCall(systemPrompt, userPrompt);
      
      if (result.success) {
        return result.data || 'فشل في توليد التقرير';
      } else {
        throw new Error(result.error || 'فشل في توليد التقرير');
      }
    } catch (error) {
      console.error('خطأ في توليد تقرير المدير:', error);
      return 'حدث خطأ في توليد التقرير';
    }
  };

  // توليد تقرير الأهل
  const generateFamilyReport = async () => {
    const systemPrompt = `أنت خبير في كتابة التقارير للأهل. 
    اكتب تقريراً مناسباً للأهل يتضمن:
    - ملخص إيجابي للجلسة
    - التقدم المحرز
    - التوصيات للأهل
    - خطوات المتابعة
    
    تجنب:
    - الكشف عن أسرار المقيم
    - تفاصيل حساسة
    - معلومات قد تضر بالخصوصية
    - تشخيصات طبية معقدة
    
    استخدم لغة بسيطة ومشجعة باللهجة المصرية.`;

    const userPrompt = `
    بيانات الجلسة:
    - المقيم: ${sessionData.patient_name}
    - تاريخ الجلسة: ${sessionData.session_date}
    - نوع الجلسة: ${sessionData.session_type}
    - ملاحظات الجلسة: ${sessionData.raw_notes}
    - تقييم المعالج: ${JSON.stringify(sessionData.therapist_assessment)}
    
    اكتب تقريراً مناسباً للأهل يتضمن:
    1. ملخص إيجابي للجلسة
    2. التقدم المحرز (بشكل عام)
    3. التوصيات للأهل
    4. خطوات المتابعة
    5. نصائح للدعم المنزلي
    
    تجنب الكشف عن:
    - تفاصيل المشاكل الشخصية
    - معلومات حساسة
    - تشخيصات معقدة
    - تفاصيل العلاج الدوائي
    
    اكتب باللهجة المصرية البسيطة والمشجعة.`;

    try {
      const result = await googleAIService.customCall(systemPrompt, userPrompt);
      
      if (result.success) {
        return result.data || 'فشل في توليد التقرير';
      } else {
        throw new Error(result.error || 'فشل في توليد التقرير');
      }
    } catch (error) {
      console.error('خطأ في توليد تقرير الأهل:', error);
      return 'حدث خطأ في توليد التقرير';
    }
  };

  // توليد التقارير
  const generateReports = async () => {
    setReportData(prev => ({ ...prev, isGenerating: true }));

    try {
      const [managerReport, familyReport] = await Promise.all([
        generateManagerReport(),
        generateFamilyReport()
      ]);

      setReportData({
        managerReport,
        familyReport,
        isGenerating: false,
        lastGenerated: new Date()
      });

      onReportGenerated({
        manager: managerReport,
        family: familyReport
      });

    } catch (error) {
      console.error('خطأ في توليد التقارير:', error);
      setReportData(prev => ({ ...prev, isGenerating: false }));
    }
  };

  // إعادة توليد تقرير محدد
  const regenerateReport = async (type: 'manager' | 'family') => {
    setReportData(prev => ({ ...prev, isGenerating: true }));

    try {
      let newReport = '';
      
      if (type === 'manager') {
        newReport = await generateManagerReport();
        setReportData(prev => ({ 
          ...prev, 
          managerReport: newReport,
          isGenerating: false 
        }));
      } else {
        newReport = await generateFamilyReport();
        setReportData(prev => ({ 
          ...prev, 
          familyReport: newReport,
          isGenerating: false 
        }));
      }

    } catch (error) {
      console.error(`خطأ في إعادة توليد تقرير ${type}:`, error);
      setReportData(prev => ({ ...prev, isGenerating: false }));
    }
  };

  // تحميل التقرير كملف نصي
  const downloadReport = (type: 'manager' | 'family') => {
    const report = type === 'manager' ? reportData.managerReport : reportData.familyReport;
    const fileName = `تقرير_${type}_${sessionData.patient_name}_${sessionData.session_date}.txt`;
    
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* معلومات الجلسة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>معلومات الجلسة</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium">المقيم:</Label>
              <p className="text-sm text-gray-600">{sessionData.patient_name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">التاريخ:</Label>
              <p className="text-sm text-gray-600">{sessionData.session_date}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">نوع الجلسة:</Label>
              <Badge variant="outline">{sessionData.session_type}</Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">الحالة:</Label>
              <Badge variant="default" className="bg-green-100 text-green-800">
                مكتملة
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* أزرار التحكم */}
      <div className="flex flex-wrap gap-4">
        <Button 
          onClick={generateReports}
          disabled={reportData.isGenerating}
          className="flex items-center space-x-2"
        >
          <Brain className="h-4 w-4" />
          <span>توليد التقارير</span>
        </Button>

        {reportData.lastGenerated && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>آخر تحديث: {reportData.lastGenerated.toLocaleString('ar-EG')}</span>
          </div>
        )}
      </div>

      {/* التقارير */}
      {reportData.managerReport || reportData.familyReport ? (
        <Tabs value={selectedReportType} onValueChange={(value) => setSelectedReportType(value as 'manager' | 'family')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manager" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>تقرير المدير</span>
            </TabsTrigger>
            <TabsTrigger value="family" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>تقرير الأهل</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manager" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                    <span>تقرير المدير العلاجي</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => regenerateReport('manager')}
                      disabled={reportData.isGenerating}
                    >
                      <RefreshCw className="h-4 w-4" />
                      إعادة توليد
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadReport('manager')}
                    >
                      <Download className="h-4 w-4" />
                      تحميل
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                    {reportData.managerReport}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="family" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span>تقرير الأهل</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => regenerateReport('family')}
                      disabled={reportData.isGenerating}
                    >
                      <RefreshCw className="h-4 w-4" />
                      إعادة توليد
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadReport('family')}
                    >
                      <Download className="h-4 w-4" />
                      تحميل
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4 border-green-200 bg-green-50">
                  <Shield className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    هذا التقرير محمي ومصمم خصيصاً للأهل مع الحفاظ على خصوصية المقيم
                  </AlertDescription>
                </Alert>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                    {reportData.familyReport}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">اضغط على "توليد التقارير" لإنشاء تقرير المدير وتقرير الأهل</p>
          </CardContent>
        </Card>
      )}

      {/* مؤشر التحميل */}
      {reportData.isGenerating && (
        <Card>
          <CardContent className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">جاري توليد التقارير بالذكاء الاصطناعي...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionReportGenerator; 