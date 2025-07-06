import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Brain, Lightbulb, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  addiction_type: string;
  status: string;
}

interface AISuggestion {
  type: 'treatment' | 'warning' | 'improvement';
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
}

const OPENAI_API_KEY = "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";

const AITreatment = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPatients();
    loadSampleSuggestions();
  }, []);

  const fetchPatients = async () => {
    try {
      // Mock data for demonstration
      const mockPatients: Patient[] = [
        {
          id: '1',
          name: 'أحمد محمد',
          addiction_type: 'المخدرات',
          status: 'active'
        },
        {
          id: '2',
          name: 'فاطمة علي',
          addiction_type: 'التدخين',
          status: 'active'
        }
      ];
      setPatients(mockPatients);
      
      // Uncomment when database is set up:
      /*
      const { data, error } = await supabase
        .from('patients')
        .select('id, name, addiction_type, status')
        .eq('status', 'active');

      if (error) throw error;
      setPatients(data || []);
      */
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل المرضى",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const loadSampleSuggestions = () => {
    const sampleSuggestions: AISuggestion[] = [
      {
        type: 'treatment',
        title: 'خطة علاجية مخصصة',
        content: 'بناءً على تحليل البيانات، يُنصح بتطبيق برنامج علاج سلوكي معرفي مكثف لمدة 8 أسابيع مع جلسات فردية مرتين أسبوعياً.',
        priority: 'high'
      },
      {
        type: 'warning',
        title: 'تحذير: خطر انتكاس مرتفع',
        content: 'تشير المؤشرات إلى احتمالية انتكاس عالية خلال الأسبوعين القادمين. يُنصح بزيادة المتابعة والدعم النفسي.',
        priority: 'high'
      },
      {
        type: 'improvement',
        title: 'تحسن ملحوظ في الاستجابة',
        content: 'يظهر المريض تحسناً كبيراً في الالتزام بالبرنامج العلاجي. يُمكن الانتقال للمرحلة التالية من العلاج.',
        priority: 'medium'
      }
    ];
    setSuggestions(sampleSuggestions);
  };

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
      const prompt = `معلومات المريض:
الاسم: ${patient?.name}
نوع الإدمان: ${patient?.addiction_type}
الحالة: ${patient?.status}

سؤال الطبيب: ${query}

اقترح خطة علاجية أو نصيحة مناسبة باللهجة المصرية. كن محدداً وقدم خطوات عملية.`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { 
              role: "system", 
              content: "أنت مساعد طبي محترف متخصص في علاج الإدمان. ترد دائماً باللهجة المصرية فقط. قدم نصائح عملية ومحددة بناءً على حالة المريض." 
            },
            { role: "user", content: prompt }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.choices?.[0]?.message?.content || "لم يتم الحصول على اقتراح من الذكاء الاصطناعي.";

      const newSuggestion: AISuggestion = {
        type: 'treatment',
        title: 'اقتراح علاجي من الذكاء الاصطناعي',
        content: aiContent,
        priority: 'high'
      };

      setSuggestions(prev => [newSuggestion, ...prev]);
      setQuery('');

      toast({
        title: "تم إنشاء الاقتراح",
        description: "تم تحليل الحالة وإنتاج اقتراح علاجي مخصص باللهجة المصرية",
      });
    } catch (error: any) {
      console.error('AI Error:', error);
      toast({
        title: "خطأ في الحصول على الاقتراحات",
        description: error.message || "حدث خطأ أثناء معالجة طلبك",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: { label: 'عالية', variant: 'destructive' as const },
      medium: { label: 'متوسطة', variant: 'default' as const },
      low: { label: 'منخفضة', variant: 'secondary' as const }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'treatment':
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'improvement':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      default:
        return <Brain className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <Brain className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">مساعد الذكاء الاصطناعي</h1>
              <p className="text-muted-foreground">اقتراحات علاجية مخصصة بناءً على تحليل البيانات</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Query Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Brain className="h-5 w-5" />
                  <span>استشارة الذكاء الاصطناعي</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">اختر المريض</Label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="query">اكتب استفسارك</Label>
                  <Textarea
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="مثال: ما هي أفضل خطة علاجية لهذا المريض؟"
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleGetSuggestions} 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'جاري التحليل...' : 'احصل على اقتراحات'}
                </Button>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 نصيحة: كن محدداً في أسئلتك للحصول على اقتراحات أكثر دقة ومفيدة
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suggestions Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>الاقتراحات والتوصيات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestions.length === 0 ? (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">لا توجد اقتراحات بعد</p>
                      <p className="text-sm text-muted-foreground">ابدأ بطرح سؤال للحصول على اقتراحات مخصصة</p>
                    </div>
                  ) : (
                    suggestions.map((suggestion, index) => (
                      <Card key={index} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              {getTypeIcon(suggestion.type)}
                              <h3 className="font-semibold">{suggestion.title}</h3>
                            </div>
                            {getPriorityBadge(suggestion.priority)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {suggestion.content}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">استشارات اليوم</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+4 عن الأمس</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">دقة التوقعات</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">متوسط الدقة هذا الشهر</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">اقتراحات مطبقة</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">67</div>
              <p className="text-xs text-muted-foreground">من أصل 89 اقتراح</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AITreatment;