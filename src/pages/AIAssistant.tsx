import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  MessageSquare, 
  HelpCircle, 
  Lightbulb, 
  BookOpen, 
  Sparkles,
  TrendingUp,
  Users,
  FileText,
  Calendar,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AIAssistant = () => {
  const { toast } = useToast();

  const features = [
    {
      title: 'مساعدة فورية',
      description: 'إجابات سريعة على جميع أسئلتك',
      icon: Lightbulb,
      color: 'text-blue-600'
    },
    {
      title: 'دليل تفاعلي',
      description: 'تعلم النظام خطوة بخطوة',
      icon: BookOpen,
      color: 'text-green-600'
    },
    {
      title: 'نصائح ذكية',
      description: 'اقتراحات لتحسين العمل',
      icon: Lightbulb,
      color: 'text-yellow-600'
    },
    {
      title: 'حل المشاكل',
      description: 'مساعدة في حل أي مشكلة',
      icon: HelpCircle,
      color: 'text-red-600'
    }
  ];

  const commonQuestions = [
    {
      question: 'إزاي أضيف مريض جديد؟',
      answer: 'روح على صفحة "إدارة المرضى" واضغط "إضافة مريض جديد" واملأ البيانات المطلوبة.',
      category: 'المرضى'
    },
    {
      question: 'إزاي أجدول وردية؟',
      answer: 'روح على "إدارة الموظفين والورديات" واضغط "جدولة وردية جديدة" واختار الموظف والتاريخ.',
      category: 'الورديات'
    },
    {
      question: 'إزاي أرسل رسالة لأسرة المريض؟',
      answer: 'روح على "التواصل مع الأسر" واضغط "إرسال رسالة جديدة" واختار العائلة ونوع الرسالة.',
      category: 'التواصل'
    },
    {
      question: 'إزاي أعمل تقرير؟',
      answer: 'روح على "التقارير والإحصائيات" واختار نوع التقرير والفترة الزمنية واضغط "إنشاء".',
      category: 'التقارير'
    },
    {
      question: 'إزاي أدير الإجازات؟',
      answer: 'روح على "إدارة الموظفين والورديات" وشوف تبويب "الإجازات" واعمل الموافقة أو الرفض.',
      category: 'الإجازات'
    },
    {
      question: 'إزاي أتتبع تقدم المريض؟',
      answer: 'روح على صفحة المريض وشوف تبويب "التقدم" هتلاقي الرسوم البيانية والتقارير.',
      category: 'التقدم'
    }
  ];

  const tips = [
    {
      title: 'نصيحة سريعة',
      content: 'استخدم البحث السريع للوصول لأي صفحة بسرعة!',
      type: 'tip'
    },
    {
      title: 'تحسين الأداء',
      content: 'احفظ البيانات بشكل دوري لتجنب فقدان المعلومات.',
      type: 'performance'
    },
    {
      title: 'نصيحة أمان',
      content: 'تأكد من تسجيل الخروج عند الانتهاء من العمل.',
      type: 'security'
    },
    {
      title: 'نصيحة تواصل',
      content: 'راسل أسر المرضى بانتظام لتحسين الرعاية.',
      type: 'communication'
    }
  ];

  const handleFeatureClick = (feature: any) => {
    toast({
      title: feature.title,
      description: feature.description,
    });
  };

  const handleQuestionClick = (question: any) => {
    toast({
      title: question.question,
      description: question.answer,
    });
  };

  const handleTipClick = (tip: any) => {
    toast({
      title: tip.title,
      description: tip.content,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">المساعد الذكي</h1>
            <p className="text-xl text-gray-600">مساعدك الشخصي في شفا كير</p>
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2">
          <Sparkles className="w-4 h-4 mr-2" />
          مدعوم بالذكاء الاصطناعي
        </Badge>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => handleFeatureClick(feature)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gray-100 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="questions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="questions">الأسئلة الشائعة</TabsTrigger>
          <TabsTrigger value="tips">النصائح الذكية</TabsTrigger>
          <TabsTrigger value="help">الدليل الشامل</TabsTrigger>
        </TabsList>

        {/* الأسئلة الشائعة */}
        <TabsContent value="questions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commonQuestions.map((item, index) => (
              <Card 
                key={index} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleQuestionClick(item)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{item.question}</h3>
                      <p className="text-gray-600 text-sm">{item.answer}</p>
                    </div>
                    <Badge variant="outline" className="mr-3">
                      {item.category}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    اضغط للتفاصيل
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* النصائح الذكية */}
        <TabsContent value="tips" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip, index) => (
              <Card 
                key={index} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleTipClick(tip)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tip.type === 'tip' ? 'bg-blue-100' :
                      tip.type === 'performance' ? 'bg-green-100' :
                      tip.type === 'security' ? 'bg-red-100' :
                      'bg-purple-100'
                    }`}>
                      <Lightbulb className={`w-5 h-5 ${
                        tip.type === 'tip' ? 'text-blue-600' :
                        tip.type === 'performance' ? 'text-green-600' :
                        tip.type === 'security' ? 'text-red-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{tip.title}</h3>
                      <p className="text-gray-600">{tip.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* الدليل الشامل */}
        <TabsContent value="help" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* إدارة المرضى */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  إدارة المرضى
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p>• إضافة مريض جديد</p>
                  <p>• تعديل بيانات المريض</p>
                  <p>• تتبع تقدم العلاج</p>
                  <p>• إدارة الملفات الطبية</p>
                </div>
                <Button size="sm" className="w-full">
                  اقرأ الدليل
                </Button>
              </CardContent>
            </Card>

            {/* إدارة الموظفين */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  إدارة الموظفين
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p>• إضافة موظف جديد</p>
                  <p>• جدولة الورديات</p>
                  <p>• إدارة الإجازات</p>
                  <p>• تقييم الأداء</p>
                </div>
                <Button size="sm" className="w-full">
                  اقرأ الدليل
                </Button>
              </CardContent>
            </Card>

            {/* التواصل مع الأسر */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                  التواصل مع الأسر
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p>• إرسال رسائل</p>
                  <p>• جدولة زيارات</p>
                  <p>• إرسال تقارير</p>
                  <p>• إدارة التفضيلات</p>
                </div>
                <Button size="sm" className="w-full">
                  اقرأ الدليل
                </Button>
              </CardContent>
            </Card>

            {/* التقارير */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-orange-600" />
                  التقارير
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p>• تقارير المرضى</p>
                  <p>• تقارير الموظفين</p>
                  <p>• تقارير مالية</p>
                  <p>• إحصائيات عامة</p>
                </div>
                <Button size="sm" className="w-full">
                  اقرأ الدليل
                </Button>
              </CardContent>
            </Card>

            {/* الجلسات */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-red-600" />
                  الجلسات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p>• جدولة الجلسات</p>
                  <p>• إدارة المواعيد</p>
                  <p>• تسجيل النتائج</p>
                  <p>• متابعة التقدم</p>
                </div>
                <Button size="sm" className="w-full">
                  اقرأ الدليل
                </Button>
              </CardContent>
            </Card>

            {/* الذكاء الاصطناعي */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-pink-600" />
                  الذكاء الاصطناعي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p>• جلسات ذكية</p>
                  <p>• تحليل المشاعر</p>
                  <p>• اقتراحات علاجية</p>
                  <p>• تقارير ذكية</p>
                </div>
                <Button size="sm" className="w-full">
                  اقرأ الدليل
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* إحصائيات المساعد */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            إحصائيات المساعد الذكي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1,234</div>
              <div className="text-sm text-gray-600">سؤال تمت الإجابة عليه</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">567</div>
              <div className="text-sm text-gray-600">مشكلة تم حلها</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">89%</div>
              <div className="text-sm text-gray-600">معدل الرضا</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-600">متاح على مدار الساعة</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant; 