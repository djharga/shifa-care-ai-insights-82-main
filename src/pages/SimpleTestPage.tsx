import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Heart, 
  Target, 
  Users, 
  Loader2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { SessionAIService } from '@/services/session-ai-service';
import { AIAnalysisResult } from '@/types/session';

export default function SimpleTestPage() {
  const [rawNotes, setRawNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const aiService = new SessionAIService();

  const handleProcess = async () => {
    if (!rawNotes.trim()) {
      setError('يرجى إدخال ملاحظات الجلسة أولاً');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await aiService.processSessionNotes(rawNotes);
      setResult(analysisResult);
    } catch (error) {
      console.error('خطأ في المعالجة:', error);
      setError('حدث خطأ في معالجة الجلسة');
    } finally {
      setIsProcessing(false);
    }
  };

  const loadExample = () => {
    setRawNotes(`النهاردة المقيم دخل الجلسة وهو مش في مود. قعد ساكت 10 دقايق، وبعدين قال إنه حاسس إنه لو خرج من هنا هيبوظ تاني. اتكلم شوية عن أهله بس كان بيهرب من التفاصيل، وحسيت إنه خايف يقول اللي جواه.`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">اختبار الذكاء الاصطناعي الجديد</h1>
        <p className="text-gray-600 text-sm sm:text-base">نظام تحليل الجلسات باللهجة المصرية</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>إدخال ملاحظات الجلسة</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">ملاحظات الجلسة الخام:</label>
            <Textarea
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              placeholder="اكتب ملاحظات الجلسة كما حدثت بالتفصيل..."
              rows={6}
              className="mt-2"
            />
          </div>

                     <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 sm:space-x-reverse">
             <Button 
               onClick={handleProcess}
               disabled={isProcessing || !rawNotes.trim()}
               className="flex-1 h-12 text-base"
             >
               {isProcessing ? (
                 <>
                   <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                   جاري المعالجة بالذكاء الاصطناعي...
                 </>
               ) : (
                 <>
                   <Brain className="h-5 w-5 mr-2" />
                   معالجة الجلسة
                 </>
               )}
             </Button>
             <Button 
               onClick={loadExample}
               variant="outline"
               disabled={isProcessing}
               className="h-12 text-base"
             >
               تحميل مثال
             </Button>
           </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* إعادة صياغة باللهجة المصرية */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Brain className="h-5 w-5 text-blue-600" />
                <span>إعادة صياغة باللهجة المصرية</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg text-right">
                {result.processedNotes}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">المشاعر الأساسية:</label>
                  <Badge variant="outline" className="mt-2">
                    {result.emotions.primary_emotion}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">شدة المشاعر:</label>
                  <div className="mt-2">
                    <Progress value={result.emotions.intensity * 10} />
                    <span className="text-sm text-gray-600">{result.emotions.intensity}/10</span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">المشاعر الثانوية:</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.emotions.secondary_emotions.map((emotion, index) => (
                      <Badge key={index} variant="secondary">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">نمط التفكير:</label>
                  <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                    {result.thinkingPattern}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">الحالة النفسية العامة:</label>
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    {result.psychologicalState}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* خطة علاجية بسيطة */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Target className="h-5 w-5 text-purple-600" />
                <span>خطة علاجية بسيطة</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">أهداف الجلسة القادمة:</label>
                  <div className="mt-2 space-y-2">
                    {result.treatmentPlan.goals.map((goal, index) => (
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
                  <label className="text-sm font-medium">الاتجاه العلاجي:</label>
                  <div className="mt-2 p-3 bg-indigo-50 rounded-lg">
                    {result.treatmentPlan.direction}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">تمرين أو نشاط مقترح:</label>
                  <div className="mt-2 p-3 bg-orange-50 rounded-lg">
                    {result.treatmentPlan.exercise}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* تقرير مختصر للأهل */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-teal-600" />
                <span>تقرير مختصر للأهل</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-teal-50 rounded-lg border-l-4 border-teal-500">
                <div className="text-sm text-gray-700 leading-relaxed">
                  {result.familyReport}
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                هذا التقرير محمي بخصوصية المقيم ولا يحتوي على معلومات حساسة
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 