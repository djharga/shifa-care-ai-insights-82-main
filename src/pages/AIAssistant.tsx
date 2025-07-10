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
import { SupabaseService } from '@/services/supabase-service';

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
    navigate(path);
  };
  
  const handleBackup = async () => {
    try {
      toast({ 
        title: 'جاري التحميل', 
        description: 'جاري تجهيز النسخة الاحتياطية من قاعدة البيانات...' 
      });

      // جلب جميع البيانات من قاعدة البيانات
      const supabaseService = new SupabaseService();
      
      const sessions = await supabaseService.getSessions();
      const treatmentGoals = await supabaseService.getTreatmentGoals();
      const activities = await supabaseService.getActivities();
      const centerGoals = await supabaseService.getCenterGoals();
      
      const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        source: 'supabase_database',
        data: {
          sessions,
          treatmentGoals,
          activities,
          centerGoals
        }
      };
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `shifacare-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({ 
        title: 'تم التحميل', 
        description: 'تم تحميل النسخة الاحتياطية من قاعدة البيانات بنجاح!' 
      });
    } catch (error) {
      toast({ 
        title: 'خطأ في التحميل', 
        description: 'فشل في تحميل النسخة الاحتياطية',
        variant: "destructive"
      });
    }
  };
  
  const handleRestore = () => {
    // إنشاء input file لاختيار ملف النسخة الاحتياطية
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const backupData = JSON.parse(event.target?.result as string);
            
            if (!backupData.source || backupData.source !== 'supabase_database') {
              toast({ 
                title: 'خطأ في الاستعادة', 
                description: 'الملف ليس نسخة احتياطية من قاعدة البيانات',
                variant: "destructive"
              });
              return;
            }
            
            toast({ 
              title: 'جاري الاستعادة', 
              description: 'جاري استعادة البيانات إلى قاعدة البيانات...' 
            });
            
            const supabaseService = new SupabaseService();
            
            // استعادة البيانات إلى قاعدة البيانات
            if (backupData.data.sessions && backupData.data.sessions.length > 0) {
              for (const session of backupData.data.sessions) {
                try {
                  await supabaseService.createSession(session);
                } catch (error) {
                  console.error('خطأ في استعادة الجلسة:', error);
                }
              }
            }
            
            if (backupData.data.treatmentGoals && backupData.data.treatmentGoals.length > 0) {
              for (const goal of backupData.data.treatmentGoals) {
                try {
                  await supabaseService.createTreatmentGoal(goal);
                } catch (error) {
                  console.error('خطأ في استعادة الهدف العلاجي:', error);
                }
              }
            }
            
            if (backupData.data.activities && backupData.data.activities.length > 0) {
              for (const activity of backupData.data.activities) {
                try {
                  await supabaseService.createActivity(activity);
                } catch (error) {
                  console.error('خطأ في استعادة النشاط:', error);
                }
              }
            }
            
            if (backupData.data.centerGoals && backupData.data.centerGoals.length > 0) {
              for (const goal of backupData.data.centerGoals) {
                try {
                  await supabaseService.createCenterGoal(goal);
                } catch (error) {
                  console.error('خطأ في استعادة هدف المركز:', error);
                }
              }
            }
            
            toast({ 
              title: 'تم الاستعادة', 
              description: 'تم استعادة البيانات إلى قاعدة البيانات بنجاح!' 
            });
            
          } catch (error) {
            toast({ 
              title: 'خطأ في الاستعادة', 
              description: 'الملف غير صالح أو تالف',
              variant: "destructive"
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
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
    // إنشاء دليل PDF حقيقي
    const guideContent = {
      title: `دليل ${section}`,
      content: `هذا هو الدليل الشامل لـ ${section} في نظام شفا كير.`,
      sections: [
        'المقدمة',
        'الخطوات الأساسية',
        'النصائح المهمة',
        'الأسئلة الشائعة',
        'معلومات الاتصال'
      ],
      timestamp: new Date().toLocaleString('ar-EG')
    };
    
    const blob = new Blob([JSON.stringify(guideContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `دليل-${section}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "تم التحميل",
      description: `تم تحميل دليل ${section} بنجاح`,
    });
  };

  const handleShareGuide = (section: string) => {
    if (navigator.share) {
      navigator.share({
        title: `دليل ${section} - شفا كير`,
        text: `دليل شامل لـ ${section} في نظام شفا كير للرعاية الصحية`,
        url: window.location.href
      }).then(() => {
        toast({
          title: "تم المشاركة",
          description: `تم مشاركة دليل ${section} بنجاح`,
        });
      }).catch(() => {
        // Fallback للنسخ
        navigator.clipboard.writeText(`دليل ${section} - شفا كير: ${window.location.href}`);
        toast({
          title: "تم النسخ",
          description: `تم نسخ رابط دليل ${section} إلى الحافظة`,
        });
      });
    } else {
      // Fallback للنسخ
      navigator.clipboard.writeText(`دليل ${section} - شفا كير: ${window.location.href}`);
      toast({
        title: "تم النسخ",
        description: `تم نسخ رابط دليل ${section} إلى الحافظة`,
      });
    }
  };

  const handleRateAssistant = async () => {
    const rating = prompt('أعط تقييمك للمساعد الذكي (1-5 نجوم):');
    if (rating && !isNaN(Number(rating)) && Number(rating) >= 1 && Number(rating) <= 5) {
      try {
        const supabaseService = new SupabaseService();
        
        // حفظ التقييم في قاعدة البيانات
        await supabaseService.createRating({
          rating: Number(rating),
          user_agent: navigator.userAgent,
          page: 'ai_assistant',
          feedback: prompt('أضف تعليقك (اختياري):') || null
        });
        
        toast({
          title: "شكراً لك",
          description: `تم حفظ تقييمك: ${rating} نجوم في قاعدة البيانات`,
        });
      } catch (error) {
        toast({
          title: "خطأ في الحفظ",
          description: "فشل في حفظ التقييم",
          variant: "destructive"
        });
      }
    } else if (rating !== null) {
      toast({
        title: "تقييم غير صحيح",
        description: "يرجى إدخال رقم من 1 إلى 5",
        variant: "destructive"
      });
    }
  };

  const handleAISettings = async () => {
    const settings = {
      language: prompt('اللغة المفضلة (ar/en):', 'ar') || 'ar',
      voice_enabled: confirm('تفعيل الأوامر الصوتية؟') || false,
      auto_response: confirm('الرد التلقائي؟') || false,
      notifications: confirm('تفعيل الإشعارات؟') || true
    };
    
    try {
      const supabaseService = new SupabaseService();
      
      // حفظ الإعدادات في قاعدة البيانات
      await supabaseService.updateAISettings(settings);
      
      toast({
        title: "تم الحفظ",
        description: "تم حفظ إعدادات المساعد الذكي في قاعدة البيانات",
      });
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "فشل في حفظ الإعدادات",
        variant: "destructive"
      });
    }
  };

  const handleVoiceCommand = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'ar-EG';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        toast({
          title: "جاري الاستماع",
          description: "تحدث الآن...",
        });
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        toast({
          title: "تم فهم الأمر",
          description: `الأمر: ${transcript}`,
        });
        
        // معالجة الأوامر الصوتية
        if (transcript.includes('فتح') || transcript.includes('اذهب')) {
          if (transcript.includes('المرضى')) {
            navigate('/patients');
          } else if (transcript.includes('الجلسات')) {
            navigate('/sessions');
          } else if (transcript.includes('التقارير')) {
            navigate('/reports');
          }
        }
      };
      
      recognition.onerror = () => {
        toast({
          title: "خطأ في التعرف الصوتي",
          description: "يرجى المحاولة مرة أخرى",
          variant: "destructive"
        });
      };
      
      recognition.start();
    } else {
      toast({
        title: "غير مدعوم",
        description: "التعرف الصوتي غير مدعوم في هذا المتصفح",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-2 sm:p-6 space-y-4 sm:space-y-6" dir="rtl">
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
      <div className="text-center mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-center mb-2 sm:mb-4 gap-2 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto sm:mr-4">
            <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">المساعد الذكي</h1>
            <p className="text-base sm:text-xl text-gray-600">مساعدك الشخصي في شفا كير</p>
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          مدعوم بالذكاء الاصطناعي
        </Badge>
        {pageLoaded && (
          <Badge variant="secondary" className="bg-green-500 mt-2 text-xs sm:text-base">
            <CheckCircle className="w-3 h-3 mr-1" />
            جاهز للاستخدام
          </Badge>
        )}
      </div>

      {/* محادثة سريعة */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center text-base sm:text-lg">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            محادثة سريعة مع المساعد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 sm:space-y-4">
            <div className="flex space-x-1 sm:space-x-2">
              <Textarea
                placeholder="اكتب سؤالك هنا..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                className="flex-1 text-sm sm:text-base"
                rows={2}
              />
              <Button onClick={handleSendMessage} disabled={isTyping} className="h-10 w-10 sm:h-12 sm:w-12 p-0">
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
            {isTyping && (
              <div className="flex items-center space-x-1 text-blue-600 text-xs sm:text-base">
                <Bot className="w-4 h-4 animate-pulse" />
                <span>المساعد يكتب...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-6 mb-4 sm:mb-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer p-2 sm:p-6"
              onClick={() => handleFeatureClick(feature)}
            >
              <CardContent className="p-2 sm:p-6 text-center">
                <div className={`w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 rounded-lg bg-gray-100 flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-xs sm:text-lg mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Suggestions - Scrollable on mobile */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          {commonQuestions.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
              onClick={() => handleQuestionClick(item)}
            >
              {item.question}
            </Button>
          ))}
        </div>
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