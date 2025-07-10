import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Smile, 
  Frown, 
  Meh,
  TrendingUp,
  TrendingDown,
  Minus,
  Save,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmotionData {
  id: string;
  patient_id: string;
  session_id?: string;
  primary_emotion: string;
  secondary_emotions: string[];
  intensity: number;
  emotional_state: 'positive' | 'negative' | 'neutral' | 'mixed';
  session_date: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface EmotionAnalysisProps {
  patientId?: string;
  sessionId?: string;
}

const emotionColors = {
  positive: 'text-green-600',
  negative: 'text-red-600',
  neutral: 'text-gray-600',
  mixed: 'text-yellow-600'
};

const emotionIcons = {
  positive: Smile,
  negative: Frown,
  neutral: Meh,
  mixed: Heart
};

const intensityColors = [
  'bg-red-100 text-red-800',
  'bg-red-200 text-red-800',
  'bg-orange-100 text-orange-800',
  'bg-orange-200 text-orange-800',
  'bg-yellow-100 text-yellow-800',
  'bg-yellow-200 text-yellow-800',
  'bg-blue-100 text-blue-800',
  'bg-blue-200 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-green-200 text-green-800'
];

export default function EmotionAnalysis({ patientId, sessionId }: EmotionAnalysisProps) {
  const { toast } = useToast();
  const [emotions, setEmotions] = useState<EmotionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (patientId && sessionId) {
      fetchEmotionData();
    }
  }, [patientId, sessionId]);

  const fetchEmotionData = async () => {
    if (!patientId || !sessionId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('emotion_analysis')
        .select('*')
        .eq('patient_id', patientId)
        .eq('session_id', sessionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      
      if (data) {
        setEmotions(data);
      } else {
        // إنشاء تحليل مشاعر افتراضي إذا لم يكن موجوداً
        const defaultEmotions: EmotionData = {
          id: '',
          patient_id: patientId,
          session_id: sessionId,
          primary_emotion: 'قلق',
          secondary_emotions: ['توتر', 'خوف'],
          intensity: 6,
          emotional_state: 'negative',
          session_date: new Date().toISOString().split('T')[0],
          notes: 'تحليل مشاعر افتراضي'
        };
        setEmotions(defaultEmotions);
      }
    } catch (error: any) {
      console.error('Error fetching emotion data:', error);
      toast({
        title: "خطأ في تحميل تحليل المشاعر",
        description: error.message || "حدث خطأ أثناء تحميل تحليل المشاعر",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveEmotionData = async () => {
    if (!emotions || !patientId || !sessionId) return;

    try {
      setSaving(true);
      const emotionData = {
        ...emotions,
        updated_at: new Date().toISOString()
      };

      let error;
      if (emotions.id) {
        // تحديث البيانات الموجودة
        const { error: updateError } = await supabase
          .from('emotion_analysis')
          .update(emotionData)
          .eq('id', emotions.id);
        error = updateError;
      } else {
        // إضافة بيانات جديدة
        const { error: insertError } = await supabase
          .from('emotion_analysis')
          .insert([emotionData]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "تم حفظ تحليل المشاعر",
        description: "تم حفظ البيانات بنجاح",
      });

      fetchEmotionData(); // إعادة تحميل البيانات
    } catch (error: any) {
      console.error('Error saving emotion data:', error);
      toast({
        title: "خطأ في حفظ تحليل المشاعر",
        description: error.message || "حدث خطأ أثناء حفظ تحليل المشاعر",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateEmotionState = (field: keyof EmotionData, value: any) => {
    if (!emotions) return;
    setEmotions(prev => prev ? { ...prev, [field]: value } : null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-purple-600" />
            <span>تحليل المشاعر</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            جاري تحميل تحليل المشاعر...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!emotions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-purple-600" />
            <span>تحليل المشاعر</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            لا توجد بيانات تحليل مشاعر متاحة
          </div>
        </CardContent>
      </Card>
    );
  }

  const EmotionIcon = emotionIcons[emotions.emotional_state];
  
  const getIntensityColor = (intensity: number) => {
    return intensityColors[Math.min(intensity - 1, 9)];
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity <= 2) return 'منخفضة جداً';
    if (intensity <= 4) return 'منخفضة';
    if (intensity <= 6) return 'متوسطة';
    if (intensity <= 8) return 'عالية';
    return 'عالية جداً';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <EmotionIcon className={`h-5 w-5 ${emotionColors[emotions.emotional_state]}`} />
            <span>تحليل المشاعر</span>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchEmotionData}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={saveEmotionData}
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-1" />
              حفظ
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* المشاعر الأساسية */}
        <div>
          <h4 className="text-sm font-medium mb-2">المشاعر الأساسية:</h4>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-lg px-4 py-2">
              {emotions.primary_emotion}
            </Badge>
            <Badge 
              variant="outline" 
              className={`${getIntensityColor(emotions.intensity)}`}
            >
              {getIntensityLabel(emotions.intensity)}
            </Badge>
          </div>
        </div>

        {/* شدة المشاعر */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">شدة المشاعر:</h4>
            <span className="text-sm text-gray-600">{emotions.intensity}/10</span>
          </div>
          <Progress 
            value={emotions.intensity * 10} 
            className="h-3"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>منخفضة</span>
            <span>متوسطة</span>
            <span>عالية</span>
          </div>
        </div>

        {/* المشاعر الثانوية */}
        {emotions.secondary_emotions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">المشاعر الثانوية:</h4>
            <div className="flex flex-wrap gap-2">
              {emotions.secondary_emotions.map((emotion, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {emotion}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* الحالة العاطفية العامة */}
        <div>
          <h4 className="text-sm font-medium mb-2">الحالة العاطفية العامة:</h4>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className={`${emotionColors[emotions.emotional_state]} border-current`}
            >
              {emotions.emotional_state === 'positive' && 'إيجابية'}
              {emotions.emotional_state === 'negative' && 'سلبية'}
              {emotions.emotional_state === 'neutral' && 'محايدة'}
              {emotions.emotional_state === 'mixed' && 'مختلطة'}
            </Badge>
            {emotions.emotional_state === 'positive' && <TrendingUp className="h-4 w-4 text-green-600" />}
            {emotions.emotional_state === 'negative' && <TrendingDown className="h-4 w-4 text-red-600" />}
            {emotions.emotional_state === 'neutral' && <Minus className="h-4 w-4 text-gray-600" />}
            {emotions.emotional_state === 'mixed' && <Heart className="h-4 w-4 text-yellow-600" />}
          </div>
        </div>

        {/* توصيات سريعة */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">توصيات سريعة:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {emotions.emotional_state === 'negative' && (
              <>
                <li>• التركيز على تقنيات الاسترخاء</li>
                <li>• زيادة الجلسات الفردية</li>
                <li>• مراقبة علامات الاكتئاب</li>
              </>
            )}
            {emotions.emotional_state === 'positive' && (
              <>
                <li>• تعزيز السلوكيات الإيجابية</li>
                <li>• زيادة الأنشطة الجماعية</li>
                <li>• العمل على الأهداف طويلة المدى</li>
              </>
            )}
            {emotions.emotional_state === 'neutral' && (
              <>
                <li>• استكشاف المشاعر العميقة</li>
                <li>• تجربة تقنيات علاجية جديدة</li>
                <li>• تقييم فعالية العلاج الحالي</li>
              </>
            )}
            {emotions.emotional_state === 'mixed' && (
              <>
                <li>• فهم أسباب التناقض العاطفي</li>
                <li>• العمل على الاستقرار العاطفي</li>
                <li>• مراجعة الأهداف العلاجية</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}