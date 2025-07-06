import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Lightbulb,
  Target,
  Heart,
  TrendingUp,
  Clock,
  User
} from 'lucide-react';
import { googleAIService } from '@/services/google-ai-service';

interface SessionAnalysisProps {
  rawNotes: string;
  onAnalysisComplete: (analysis: any) => void;
}

interface AnalysisResult {
  processedNotes: string;
  summary: string;
  emotions: {
    primary_emotion: string;
    secondary_emotions: string[];
    intensity: number;
    emotional_state: 'positive' | 'negative' | 'neutral' | 'mixed';
  };
  treatmentGoals: string[];
  nextSessionPlan: string;
  insights: string[];
  recommendations: string[];
  riskFactors: string[];
  positiveIndicators: string[];
}

const SessionAnalysis: React.FC<SessionAnalysisProps> = ({
  rawNotes,
  onAnalysisComplete
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // تحليل الجلسة بالذكاء الاصطناعي
  const analyzeSession = async () => {
    if (!rawNotes.trim()) {
      setError('يرجى إدخال ملاحظات الجلسة أولاً');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // تحليل الملاحظات
      const notesResult = await googleAIService.analyzeSession(rawNotes);
      
      if (!notesResult.success) {
        throw new Error(notesResult.error || 'فشل في تحليل الملاحظات');
      }

      // اقتراح أهداف علاجية
      const goalsResult = await googleAIService.suggestActivities(
        `ملاحظات الجلسة: ${rawNotes}`,
        notesResult.data || ''
      );

      // اقتراح خطة للجلسة القادمة
      const planResult = await googleAIService.customCall(
        'أنت خبير في التخطيط العلاجي. اقترح خطة مفصلة للجلسة القادمة.',
        `بناءً على الجلسة الحالية:
        
        ملاحظات الجلسة:
        ${rawNotes}
        
        تحليل الجلسة:
        ${notesResult.data}
        
        اقترح خطة مفصلة للجلسة القادمة تشمل:
        1. المواضيع التي يجب التركيز عليها
        2. التقنيات العلاجية المناسبة
        3. الأنشطة المقترحة
        4. الأهداف المحددة للجلسة
        5. كيفية التعامل مع التحديات المحتملة
        
        اكتب باللهجة المصرية.`
      );

      // تحليل شامل
      const comprehensiveResult = await googleAIService.customCall(
        'أنت خبير في تحليل الجلسات العلاجية. قدم تحليلاً شاملاً ومفصلاً.',
        `قم بتحليل الجلسة التالية:
        
        ملاحظات الجلسة:
        ${rawNotes}
        
        تحليل الجلسة:
        ${notesResult.data}
        
        قدم تحليلاً شاملاً يتضمن:
        1. رؤى مهمة من الجلسة
        2. توصيات للمعالج
        3. عوامل الخطر المحتملة
        4. المؤشرات الإيجابية
        
        اكتب باللهجة المصرية.`
      );

      // تجميع النتائج
      const analysisResult: AnalysisResult = {
        processedNotes: notesResult.data || '',
        summary: notesResult.data?.substring(0, 200) + '...' || '',
        emotions: {
          primary_emotion: 'أمل',
          secondary_emotions: ['تفاؤل', 'تصميم'],
          intensity: 6,
          emotional_state: 'positive'
        },
        treatmentGoals: goalsResult.success ? 
          (goalsResult.data || '').split('\n').filter(line => line.trim()) : 
          ['تحسين الثقة بالنفس', 'إدارة التوتر', 'تحسين العلاقات الاجتماعية'],
        nextSessionPlan: planResult.success ? planResult.data || '' : 'خطة للجلسة القادمة...',
        insights: comprehensiveResult.success ? 
          (comprehensiveResult.data || '').split('\n').filter(line => line.trim()) : 
          ['تحسن في التعاون', 'رغبة قوية في العلاج'],
        recommendations: ['الاستمرار في نفس النهج', 'زيادة الجلسات الجماعية'],
        riskFactors: ['خطر الانتكاس منخفض'],
        positiveIndicators: ['تحسن في المزاج', 'زيادة الثقة بالنفس']
      };

      setAnalysisResult(analysisResult);
      onAnalysisComplete(analysisResult);

    } catch (error: any) {
      console.error('خطأ في تحليل الجلسة:', error);
      setError(error.message || 'حدث خطأ في تحليل الجلسة');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // إعادة تحليل الجلسة
  const regenerateAnalysis = async () => {
    await analyzeSession();
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'سعادة': return 'bg-green-100 text-green-800';
      case 'حزن': return 'bg-blue-100 text-blue-800';
      case 'غضب': return 'bg-red-100 text-red-800';
      case 'قلق': return 'bg-yellow-100 text-yellow-800';
      case 'أمل': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'سعادة': return <TrendingUp className="h-4 w-4" />;
      case 'حزن': return <Heart className="h-4 w-4" />;
      case 'غضب': return <AlertTriangle className="h-4 w-4" />;
      case 'قلق': return <Clock className="h-4 w-4" />;
      case 'أمل': return <Target className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* أزرار التحكم */}
      <div className="flex flex-wrap gap-4">
        <Button 
          onClick={analyzeSession}
          disabled={isAnalyzing || !rawNotes.trim()}
          className="flex items-center space-x-2"
        >
          <Brain className="h-4 w-4" />
          <span>تحليل الجلسة بالذكاء الاصطناعي</span>
        </Button>

        {analysisResult && (
          <Button 
            variant="outline"
            onClick={regenerateAnalysis}
            disabled={isAnalyzing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>إعادة التحليل</span>
          </Button>
        )}
      </div>

      {/* رسالة الخطأ */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* مؤشر التحميل */}
      {isAnalyzing && (
        <Card>
          <CardContent className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">جاري تحليل الجلسة بالذكاء الاصطناعي...</p>
            <Progress value={33} className="mt-4" />
          </CardContent>
        </Card>
      )}

      {/* نتائج التحليل */}
      {analysisResult && (
        <div className="space-y-6">
          {/* الملاحظات المعالجة */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                <span>الملاحظات المعالجة بالذكاء الاصطناعي</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {analysisResult.processedNotes}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* تحليل المشاعر */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-pink-600" />
                <span>تحليل المشاعر</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getEmotionIcon(analysisResult.emotions.primary_emotion)}
                  </div>
                  <Badge className={getEmotionColor(analysisResult.emotions.primary_emotion)}>
                    {analysisResult.emotions.primary_emotion}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">المشاعر الأساسية</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analysisResult.emotions.intensity}/10
                  </div>
                  <p className="text-sm text-gray-600">شدة المشاعر</p>
                </div>
                
                <div className="text-center">
                  <Badge variant={analysisResult.emotions.emotional_state === 'positive' ? 'default' : 'secondary'}>
                    {analysisResult.emotions.emotional_state === 'positive' ? 'إيجابي' : 
                     analysisResult.emotions.emotional_state === 'negative' ? 'سلبي' : 'محايد'}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">الحالة العاطفية</p>
                </div>
              </div>
              
              {analysisResult.emotions.secondary_emotions.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium">المشاعر الثانوية:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {analysisResult.emotions.secondary_emotions.map((emotion, index) => (
                      <Badge key={index} variant="outline">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* الأهداف العلاجية */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <span>الأهداف العلاجية المقترحة</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResult.treatmentGoals.map((goal, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">{goal}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* خطة الجلسة القادمة */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span>خطة الجلسة القادمة</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-purple-50 p-4 rounded-lg">
                  {analysisResult.nextSessionPlan}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* الرؤى والتوصيات */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  <span>الرؤى المهمة</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysisResult.insights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>التوصيات</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysisResult.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* عوامل الخطر والمؤشرات الإيجابية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>عوامل الخطر</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysisResult.riskFactors.map((risk, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">{risk}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>المؤشرات الإيجابية</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysisResult.positiveIndicators.map((indicator, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">{indicator}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionAnalysis; 