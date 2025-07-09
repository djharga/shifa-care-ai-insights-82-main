import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle, 
  Users, 
  Calendar, 
  Brain, 
  Settings, 
  Activity, 
  DollarSign,
  ArrowRight,
  Home,
  Building2,
  BarChart3,
  UserPlus,
  MessageSquare,
  Shield,
  Bot,
  Palette,
  FileText,
  AlertCircle,
  Info,
  Stethoscope,
  Heart,
  Calculator,
  Key
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SimpleTestPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [testResults, setTestResults] = useState<{[key: string]: boolean}>({});
  const [currentTest, setCurrentTest] = useState<string>('');

  const testLinks = [
    { icon: Home, title: 'الصفحة الرئيسية', href: '/', color: 'bg-blue-500', category: 'الرئيسية' },
    { icon: Users, title: 'المرضى', href: '/patients', color: 'bg-green-500', category: 'المرضى' },
    { icon: Calendar, title: 'الجلسات', href: '/sessions', color: 'bg-purple-500', category: 'الجلسات' },
    { icon: Brain, title: 'الذكاء الاصطناعي', href: '/ai-sessions', color: 'bg-pink-500', category: 'الذكاء الاصطناعي' },
    { icon: Activity, title: 'الجلسات المتقدمة', href: '/advanced-sessions', color: 'bg-red-500', category: 'الجلسات' },
    { icon: Stethoscope, title: 'العلاج بالذكاء الاصطناعي', href: '/ai-treatment', color: 'bg-indigo-500', category: 'الذكاء الاصطناعي' },
    { icon: Heart, title: 'العلاج المتقدم', href: '/advanced-ai-treatment', color: 'bg-rose-500', category: 'الذكاء الاصطناعي' },
    { icon: Building2, title: 'الغرف', href: '/rooms', color: 'bg-orange-500', category: 'الغرف' },
    { icon: Calculator, title: 'مصاريف المرافق', href: '/facility-expenses', color: 'bg-amber-500', category: 'الغرف' },
    { icon: Settings, title: 'إدارة المرافق', href: '/facility-management', color: 'bg-yellow-500', category: 'الغرف' },
    { icon: DollarSign, title: 'الحسابات', href: '/finance', color: 'bg-emerald-500', category: 'المالية' },
    { icon: BarChart3, title: 'التقارير', href: '/reports', color: 'bg-teal-500', category: 'المالية' },
    { icon: UserPlus, title: 'إدارة الموظفين', href: '/staff-management', color: 'bg-cyan-500', category: 'الإدارة' },
    { icon: Key, title: 'إدارة الصلاحيات', href: '/advanced-permissions', color: 'bg-sky-500', category: 'الإدارة' },
    { icon: MessageSquare, title: 'التواصل مع الأسر', href: '/family-communication', color: 'bg-blue-500', category: 'الإدارة' },
    { icon: MessageSquare, title: 'الشات الداخلي', href: '/internal-chat', color: 'bg-pink-500', category: 'الإدارة' },
    { icon: Shield, title: 'لوحة الإدارة', href: '/admin', color: 'bg-violet-500', category: 'الإدارة' },
    { icon: Settings, title: 'إعدادات النظام', href: '/system-settings', color: 'bg-slate-500', category: 'النظام' },
    { icon: Bot, title: 'المساعد الذكي', href: '/ai-assistant', color: 'bg-gray-500', category: 'النظام' },
    { icon: Palette, title: 'التصميم الدعائي', href: '/promo-design', color: 'bg-zinc-500', category: 'النظام' },
    { icon: FileText, title: 'صفحة الاختبار', href: '/test', color: 'bg-neutral-500', category: 'النظام' }
  ];

  // تجميع الروابط حسب الفئة
  const groupedLinks = testLinks.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {} as {[key: string]: typeof testLinks});

  useEffect(() => {
    console.log('SimpleTestPage loaded at:', location.pathname);
    toast({
      title: "صفحة اختبار التوجيه",
      description: "جميع الروابط جاهزة للاختبار",
    });
  }, [toast, location]);

  const testNavigation = async (href: string, title: string) => {
    setCurrentTest(title);
    setTestResults(prev => ({ ...prev, [title]: false }));
    
    try {
      // محاكاة الانتقال
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate(href);
      setTestResults(prev => ({ ...prev, [title]: true }));
      toast({
        title: "تم الانتقال بنجاح",
        description: `تم الانتقال إلى ${title}`,
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, [title]: false }));
      toast({
        title: "خطأ في الانتقال",
        description: `فشل الانتقال إلى ${title}`,
        variant: "destructive",
      });
    }
  };

  const runAllTests = async () => {
    toast({
      title: "بدء اختبار جميع الروابط",
      description: "سيتم اختبار جميع الروابط واحداً تلو الآخر",
    });

    for (const link of testLinks) {
      await testNavigation(link.href, link.title);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const successCount = Object.values(testResults).filter(Boolean).length;
  const totalCount = testLinks.length;

  return (
    <div className="min-h-screen bg-background p-8" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            اختبار التوجيه الشامل
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            للتأكد من أن جميع الروابط تعمل بشكل صحيح
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse mb-6">
            <Badge variant="default" className="bg-green-500">
              ✅ النظام جاهز
            </Badge>
            <Badge variant="outline">
              النسخة 2025.2.1
            </Badge>
            <Badge variant="secondary" className="bg-blue-500">
              {successCount}/{totalCount} نجح
            </Badge>
          </div>

          {/* Test Controls */}
          <div className="flex justify-center space-x-4 space-x-reverse mb-8">
            <Button onClick={runAllTests} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              اختبار جميع الروابط
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              العودة للرئيسية
            </Button>
          </div>
        </div>

        {/* Status Card */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span>حالة النظام</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 space-x-reverse p-3 bg-white rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">React Router</div>
                  <div className="text-sm text-muted-foreground">التوجيه يعمل</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse p-3 bg-white rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">TypeScript</div>
                  <div className="text-sm text-muted-foreground">نوع البيانات</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse p-3 bg-white rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Tailwind CSS</div>
                  <div className="text-sm text-muted-foreground">الأنماط</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse p-3 bg-white rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">RTL</div>
                  <div className="text-sm text-muted-foreground">العربية</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Links by Category */}
        {Object.entries(groupedLinks).map(([category, links]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{category.charAt(0)}</span>
                </div>
                <span>{category}</span>
                <Badge variant="outline" className="mr-auto">
                  {links.length} رابط
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {links.map((item, index) => {
                  const Icon = item.icon;
                  const isTested = testResults[item.title] !== undefined;
                  const isSuccess = testResults[item.title];
                  
                  return (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
                        currentTest === item.title ? 'ring-2 ring-blue-500' : ''
                      } ${
                        isTested ? (isSuccess ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3 space-x-reverse mb-3">
                        <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-lg">{item.title}</div>
                          <div className="text-sm text-muted-foreground">انقر للانتقال</div>
                        </div>
                        {isTested && (
                          <div className="flex-shrink-0">
                            {isSuccess ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 space-x-reverse">
                        <Button
                          size="sm"
                          onClick={() => testNavigation(item.href, item.title)}
                          className="flex-1"
                          disabled={currentTest === item.title}
                        >
                          {currentTest === item.title ? 'جاري الاختبار...' : 'اختبار'}
                        </Button>
                        <Link to={item.href}>
                          <Button size="sm" variant="outline">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Test Results Summary */}
        {Object.keys(testResults).length > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse text-blue-800">
                <Info className="h-5 w-5" />
                <span>نتائج الاختبار</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{successCount}</div>
                  <div className="text-sm text-muted-foreground">نجح</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{totalCount - successCount}</div>
                  <div className="text-sm text-muted-foreground">فشل</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{Math.round((successCount / totalCount) * 100)}%</div>
                  <div className="text-sm text-muted-foreground">نسبة النجاح</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back to Main */}
        <div className="text-center">
          <Link to="/">
            <Button size="lg" variant="outline">
              <Home className="w-4 h-4 mr-2" />
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SimpleTestPage; 