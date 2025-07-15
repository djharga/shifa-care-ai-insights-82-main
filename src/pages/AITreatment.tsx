import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  Heart, 
  Target, 
  Users, 
  Loader2,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Calendar,
  TrendingUp,
  Shield,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { googleAIService } from '@/services/google-ai-service';

interface Patient {
  id: string;
  name: string;
  addiction_type: string;
  status: string;
}

interface AISuggestion {
  type: 'treatment' | 'activity' | 'assessment';
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
}

const AITreatment = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // تحميل قائمة المرضى
  useEffect(() => {
    // في التطبيق الحقيقي، سيتم جلب المرضى من قاعدة البيانات
    setPatients([
      { id: '1', name: 'أحمد محمد', addiction_type: 'مخدرات', status: 'نشط' },
      { id: '2', name: 'سارة أحمد', addiction_type: 'كحول', status: 'نشط' },
      { id: '3', name: 'علي حسن', addiction_type: 'تدخين', status: 'مكتمل' },
    ]);
  }, []);

  const handleGetSuggestions = async () => {
    if (!selectedPatient || !query.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار مريض وكتابة استفسارك",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const patient = patients.find((p) => p.id === selectedPatient);
      const systemPrompt = `أنت مساعد طبي محترف متخصص في علاج الإدمان. ترد دائماً باللهجة المصرية فقط. قدم نصائح عملية ومحددة بناءً على حالة المريض.`;
      
      const userPrompt = `معلومات المريض:
الاسم: ${patient?.name}
نوع الإدمان: ${patient?.addiction_type}
الحالة: ${patient?.status}

سؤال الطبيب: ${query}

اقترح خطة علاجية أو نصيحة مناسبة باللهجة المصرية. كن محدداً وقدم خطوات عملية.`;

      const result = await googleAIService.customCall(systemPrompt, userPrompt);
      
      if (!result.success) {
        throw new Error(result.error || 'فشل في الحصول على اقتراح من الذكاء الاصطناعي');
      }

      const aiContent = result.data || "لم يتم الحصول على اقتراح من الذكاء الاصطناعي.";

      const newSuggestion: AISuggestion = {
        type: 'treatment',
        title: 'اقتراح علاجي من الذكاء الاصطناعي',
        content: aiContent,
        priority: 'high',
        timestamp: new Date()
      };

      setSuggestions(prev => [newSuggestion, ...prev]);
      
      toast({
        title: "تم الحصول على اقتراح",
        description: "تم إنشاء اقتراح علاجي جديد",
      });

    } catch (error: any) {
      console.error('خطأ في الحصول على اقتراح:', error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ في الحصول على اقتراح من الذكاء الاصطناعي",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'treatment': return <Brain className="h-4 w-4" />;
      case 'activity': return <Activity className="h-4 w-4" />;
      case 'assessment': return <Target className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">العلاج بالذكاء الاصطناعي</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">اقتراحات ذكية للعلاج باستخدام Google Gemini</p>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
          <span className="text-base sm:text-lg font-semibold text-purple-600">Google Gemini</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* لوحة التحكم */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span>طلب اقتراح علاجي</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="patient">اختر المريض</Label>
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
              </div>

              <div>
                <Label htmlFor="query">استفسارك أو طلبك</Label>
                <Textarea
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="اكتب استفسارك هنا... مثال: اقترح خطة علاجية للمريض أو أنشطة مناسبة..."
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleGetSuggestions}
                disabled={isLoading || !selectedPatient || !query.trim()}
                className="w-full h-12 text-base"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    جاري الحصول على اقتراح...
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5 mr-2" />
                    احصل على اقتراح ذكي
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* إحصائيات سريعة */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>إحصائيات سريعة</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">إجمالي الاقتراحات</span>
                  <Badge variant="secondary">{suggestions.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">المرضى النشطين</span>
                  <Badge variant="secondary">{patients.filter(p => p.status === 'نشط').length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">العلاجات المكتملة</span>
                  <Badge variant="secondary">{patients.filter(p => p.status === 'مكتمل').length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* قائمة الاقتراحات */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <span>الاقتراحات العلاجية</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {suggestions.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">لا توجد اقتراحات بعد</p>
                  <p className="text-sm text-gray-500">اختر مريض واكتب استفسارك للحصول على اقتراح ذكي</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <Card key={index} className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(suggestion.type)}
                            <h3 className="font-semibold">{suggestion.title}</h3>
                          </div>
                          <Badge className={getPriorityColor(suggestion.priority)}>
                            {suggestion.priority === 'high' ? 'عالية' : 
                             suggestion.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                          </Badge>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <p className="whitespace-pre-line text-sm leading-relaxed">
                            {suggestion.content}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{suggestion.timestamp.toLocaleString('ar-EG')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              تطبيق
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              مشاركة
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AITreatment;