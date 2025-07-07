import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Smile, 
  Frown, 
  Meh,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface EmotionAnalysisProps {
  emotions: {
    primary_emotion: string;
    secondary_emotions: string[];
    intensity: number;
    emotional_state: 'positive' | 'negative' | 'neutral' | 'mixed';
  };
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

export default function EmotionAnalysis({ emotions }: EmotionAnalysisProps) {
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
        <CardTitle className="flex items-center space-x-2">
          <EmotionIcon className={`h-5 w-5 ${emotionColors[emotions.emotional_state]}`} />
          <span>تحليل المشاعر</span>
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