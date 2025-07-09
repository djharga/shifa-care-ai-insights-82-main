import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Brain,
  Send,
  User,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Download,
  Share,
  Star,
  Settings,
  Play,
  Pause,
  Volume2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AIAssistant = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isAIActive, setIsAIActive] = useState(true);
  const [userMessage, setUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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

  // اختبار تحميل الصفحة
  useEffect(() => {
    console.log('AIAssistant component loaded successfully');
    setPageLoaded(true);
    toast({
      title: "تم تحميل المساعد الذكي",
      description: "المساعد جاهز لمساعدتك!",
    });
  }, [toast]);

  // وظائف الأزرار
  const handleBackToHome = () => {
    navigate('/');
    toast({
      title: "العودة للرئيسية",
      description: "سيتم نقلك إلى الصفحة الرئيسية",
    });
  };

  // وظائف إضافية للأزرار الجديدة
  const handleNavigate = (path: string, title: string, description: string) => {
    toast({ title, description });
    setTimeout(() => {
      navigate(path);
    }, 1000);
  };
  const handleBackup = () => {
    toast({ title: 'تحميل نسخة احتياطية', description: 'جاري تجهيز النسخة الاحتياطية...' });
    setTimeout(() => {
      toast({ title: 'تم التحميل', description: 'تم تحميل النسخة الاحتياطية بنجاح!' });
    }, 2000);
  };
  const handleRestore = () => {
    toast({ title: 'استعادة نسخة احتياطية', description: 'جاري استعادة النسخة الاحتياطية...' });
    setTimeout(() => {
      toast({ title: 'تم الاستعادة', description: 'تم استعادة النسخة الاحتياطية بنجاح!' });
    }, 2000);
  };

  // تحديث وظائف الميزات
  const handleFeatureClick = (feature: any) => {
    switch (feature.title) {
      case 'مساعدة فورية':
        handleNavigate('/help', 'مساعدة فورية', 'سيتم نقلك إلى صفحة المساعدة الفورية');
        break;
      case 'دليل تفاعلي':
        handleNavigate('/guide', 'الدليل التفاعلي', 'سيتم نقلك إلى الدليل التفاعلي');
        break;
      case 'نصائح ذكية':
        handleNavigate('/tips', 'نصائح ذكية', 'سيتم نقلك إلى صفحة النصائح الذكية');
        break;
      case 'حل المشاكل':
        handleNavigate('/support', 'حل المشاكل', 'سيتم نقلك إلى صفحة الدعم وحل المشاكل');
        break;
      default:
        toast({ title: feature.title, description: feature.description });
    }
  };

  // تحديث وظائف الأسئلة الشائعة
  const handleQuestionClick = (question: any) => {
    let path = '/';
    switch (question.category) {
      case 'المرضى':
        path = '/patients';
        break;
      case 'الورديات':
        path = '/staff-management';
        break;
      case 'التواصل':
        path = '/family-communication';
        break;
      case 'التقارير':
        path = '/reports';
        break;
      case 'الإجازات':
        path = '/staff-management';
        break;
      case 'التقدم':
        path = '/patients';
        break;
      default:
        path = '/';
    }
    toast({ title: question.question, description: question.answer });
    setTimeout(() => {
      navigate(path);
    }, 1200);
  };

  const handleTipClick = (tip: any) => {
    toast({
      title: tip.title,
      description: tip.content,
    });
  };

  // تحديث وظائف الدليل الشامل
  const handleReadGuide = (section: string) => {
    let path = '/';
    switch (section) {
      case 'إدارة المرضى':
        path = '/patients';
        break;
      case 'إدارة الموظفين':
        path = '/staff-management';
        break;
      case 'التواصل مع الأسر':
        path = '/family-communication';
        break;
      case 'التقارير':
        path = '/reports';
        break;
      case 'الجلسات':
        path = '/sessions';
        break;
      case 'الذكاء الاصطناعي':
        path = '/ai';
        break;
      default:
        path = '/';
    }
    toast({ title: 'فتح الدليل', description: `سيتم فتح دليل ${section}` });
    setTimeout(() => {
      navigate(path);
    }, 1200);
  };

  const handleSendMessage = () => {
    if (!userMessage.trim()) {
      toast({
        title: "رسالة فارغة",
        description: "يرجى كتابة رسالة قبل الإرسال",
        variant: "destructive",
      });
      return;
    }

    setIsTyping(true);
    toast({
      title: "إرسال الرسالة",
      description: "جاري إرسال رسالتك للمساعد الذكي...",
    });

    // محاكاة معالجة الرسالة
    setTimeout(() => {
      setIsTyping(false);
      toast({
        title: "تم الإرسال",
        description: "تم إرسال رسالتك وسيتم الرد قريباً",
      });
      setUserMessage('');
    }, 3000);
  };

  const handleToggleAI = () => {
    setIsAIActive(!isAIActive);
    toast({
      title: isAIActive ? "إيقاف المساعد" : "تشغيل المساعد",
      description: isAIActive ? "تم إيقاف المساعد الذكي" : "تم تشغيل المساعد الذكي",
    });
  };

  const handleDownloadGuide = (section: string) => {
    toast({
      title: "تحميل الدليل",
      description: `جاري تحميل دليل ${section}...`,
    });
    
    setTimeout(() => {
      toast({
        title: "تم التحميل",
        description: `تم تحميل دليل ${section} بنجاح`,
      });
    }, 2000);
  };

  const handleShareGuide = (section: string) => {
    toast({
      title: "مشاركة الدليل",
      description: `سيتم مشاركة دليل ${section}`,
    });
  };

  const handleRateAssistant = () => {
    toast({
      title: "تقييم المساعد",
      description: "سيتم فتح نموذج التقييم",
    });
  };

  const handleAISettings = () => {
    toast({
      title: "إعدادات المساعد",
      description: "سيتم فتح إعدادات المساعد الذكي",
    });
  };

  const handleVoiceCommand = () => {
    toast({
      title: "الأمر الصوتي",
      description: "جاري الاستماع لأمرك الصوتي...",
    });
    
    setTimeout(() => {
      toast({
        title: "تم الاستماع",
        description: "تم فهم أمرك الصوتي بنجاح",
      });
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* أزرار الإدارة والصلاحيات وسجل النشاط والنسخ الاحتياطية */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <Button variant="outline" onClick={() => handleNavigate('/user-management', 'إدارة المستخدمين', 'سيتم نقلك إلى صفحة إدارة المستخدمين')}>إدارة المستخدمين</Button>
        <Button variant="outline" onClick={() => handleNavigate('/permissions', 'إدارة الصلاحيات', 'سيتم نقلك إلى صفحة إدارة الصلاحيات')}>إدارة الصلاحيات</Button>
        <Button variant="outline" onClick={() => handleNavigate('/activity-log', 'سجل النشاط', 'سيتم نقلك إلى سجل النشاط')}>سجل النشاط</Button>
        <Button variant="outline" onClick={handleBackup}>تحميل نسخة احتياطية</Button>
        <Button variant="outline" onClick={handleRestore}>استعادة نسخة احتياطية</Button>
        <Button variant="outline" onClick={() => handleNavigate('/internal-chat', 'الشات الداخلي', 'سيتم نقلك إلى الشات الداخلي للمعالجين')}>
          <MessageSquare className="w-4 h-4 mr-2" />
          الشات الداخلي
        </Button>
      </div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={handleBackToHome} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة للرئيسية
          </Button>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant={isAIActive ? "default" : "secondary"} 
              onClick={handleToggleAI}
              className="flex items-center"
            >
              {isAIActive ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
              {isAIActive ? "المساعد نشط" : "المساعد متوقف"}
            </Button>
            
            <Button variant="outline" onClick={handleVoiceCommand}>
              <Volume2 className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" onClick={handleAISettings}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

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

        {pageLoaded && (
          <Badge variant="secondary" className="bg-green-500 mt-2">
            <CheckCircle className="w-3 h-3 mr-1" />
            جاهز للاستخدام
          </Badge>
        )}
      </div>

      {/* محادثة سريعة */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            محادثة سريعة مع المساعد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Textarea
                placeholder="اكتب سؤالك هنا..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                className="flex-1"
                rows={3}
              />
              <Button onClick={handleSendMessage} disabled={isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {isTyping && (
              <div className="flex items-center space-x-2 text-blue-600">
                <Bot className="w-4 h-4 animate-pulse" />
                <span>المساعد يكتب...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1" onClick={() => handleReadGuide('إدارة المرضى')}>
                    اقرأ الدليل
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDownloadGuide('إدارة المرضى')}>
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleShareGuide('إدارة المرضى')}>
                    <Share className="w-3 h-3" />
                  </Button>
                </div>
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
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1" onClick={() => handleReadGuide('إدارة الموظفين')}>
                    اقرأ الدليل
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDownloadGuide('إدارة الموظفين')}>
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleShareGuide('إدارة الموظفين')}>
                    <Share className="w-3 h-3" />
                  </Button>
                </div>
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
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1" onClick={() => handleReadGuide('التواصل مع الأسر')}>
                    اقرأ الدليل
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDownloadGuide('التواصل مع الأسر')}>
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleShareGuide('التواصل مع الأسر')}>
                    <Share className="w-3 h-3" />
                  </Button>
                </div>
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
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1" onClick={() => handleReadGuide('التقارير')}>
                    اقرأ الدليل
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDownloadGuide('التقارير')}>
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleShareGuide('التقارير')}>
                    <Share className="w-3 h-3" />
                  </Button>
                </div>
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
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1" onClick={() => handleReadGuide('الجلسات')}>
                    اقرأ الدليل
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDownloadGuide('الجلسات')}>
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleShareGuide('الجلسات')}>
                    <Share className="w-3 h-3" />
                  </Button>
                </div>
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
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1" onClick={() => handleReadGuide('الذكاء الاصطناعي')}>
                    اقرأ الدليل
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDownloadGuide('الذكاء الاصطناعي')}>
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleShareGuide('الذكاء الاصطناعي')}>
                    <Share className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* إحصائيات المساعد */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              إحصائيات المساعد الذكي
            </div>
            <Button variant="outline" size="sm" onClick={handleRateAssistant}>
              <Star className="w-4 h-4 mr-1" />
              قيّم المساعد
            </Button>
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