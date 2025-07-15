import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  DollarSign, 
  Building, 
  Brain, 
  FileText, 
  Settings,
  HelpCircle,
  Play,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Share2,
  Keyboard,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UserGuide = () => {
  const quickStart = [
    {
      title: 'إضافة مريض جديد',
      description: 'تسجيل مريض جديد في النظام',
      steps: [
        'اذهب إلى صفحة المرضى',
        'اضغط على "إضافة مريض جديد"',
        'املأ البيانات المطلوبة',
        'اضغط "حفظ"'
      ],
      icon: Plus,
      href: '/patients'
    },
    {
      title: 'جدولة جلسة',
      description: 'إنشاء جلسة علاجية جديدة',
      steps: [
        'اذهب إلى صفحة الجلسات',
        'اضغط على "إضافة جلسة جديدة"',
        'اختر المريض والمعالج',
        'حدد التاريخ والوقت',
        'اضغط "حفظ"'
      ],
      icon: Calendar,
      href: '/sessions'
    },
    {
      title: 'إدارة الغرف',
      description: 'تتبع حالة الغرف والأسرّة',
      steps: [
        'اذهب إلى صفحة الغرف',
        'راجع حالة كل غرفة',
        'حدث الحالة حسب الحاجة',
        'أضف غرف جديدة إذا لزم الأمر'
      ],
      icon: Building,
      href: '/rooms'
    }
  ];

  const userRoles = [
    {
      role: 'مدير المصحة',
      permissions: ['إدارة المرضى', 'إدارة الموظفين', 'التقارير المالية', 'إدارة الغرف'],
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      role: 'معالج',
      permissions: ['إدارة الجلسات', 'تحديث بيانات المرضى', 'إنشاء خطط علاجية'],
      icon: Brain,
      color: 'bg-green-500'
    },
    {
      role: 'محاسب',
      permissions: ['إدارة المدفوعات', 'التقارير المالية', 'إدارة المصاريف'],
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      role: 'مشرف',
      permissions: ['إدارة المرضى', 'إدارة الجلسات', 'التقارير الأساسية'],
      icon: Settings,
      color: 'bg-orange-500'
    }
  ];

  const keyboardShortcuts = [
    { key: 'Alt + N', description: 'إضافة جديد' },
    { key: 'Ctrl + S', description: 'حفظ' },
    { key: 'Ctrl + F', description: 'بحث' },
    { key: 'Escape', description: 'إغلاق النوافذ المنبثقة' },
    { key: 'F5', description: 'تحديث الصفحة' },
    { key: 'Delete', description: 'حذف' }
  ];

  const troubleshooting = [
    {
      problem: 'لا يمكن تسجيل الدخول',
      solution: 'تأكد من صحة اسم المستخدم وكلمة المرور، أو اتصل بالمدير'
    },
    {
      problem: 'الصفحة لا تتحمل',
      solution: 'اضغط F5 لتحديث الصفحة، أو امسح ذاكرة التخزين المؤقت'
    },
    {
      problem: 'لا تظهر البيانات',
      solution: 'تأكد من الاتصال بالإنترنت، أو جرب تحديث الصفحة'
    },
    {
      problem: 'خطأ في الحفظ',
      solution: 'تأكد من ملء جميع الحقول المطلوبة، أو تحقق من صحة البيانات'
    }
  ];

  const tips = [
    {
      title: 'استخدم البحث الذكي',
      description: 'استخدم شريط البحث في أعلى كل صفحة للعثور على المعلومات بسرعة',
      icon: Search
    },
    {
      title: 'اختصارات لوحة المفاتيح',
      description: 'تعلم الاختصارات لتسريع عملك (Alt+N للإضافة، Ctrl+S للحفظ)',
      icon: Keyboard
    },
    {
      title: 'التحديث التلقائي',
      description: 'الصفحات تتحدث تلقائياً، لكن يمكنك الضغط على F5 للتحديث اليدوي',
      icon: RefreshCw
    },
    {
      title: 'التصميم المتجاوب',
      description: 'النظام يعمل على جميع الأجهزة: الهاتف، التابلت، والكمبيوتر',
      icon: Smartphone
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">دليل المستخدم</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            دليل شامل لاستخدام نظام شفاء كير لإدارة المصحة. تعلم كيفية استخدام جميع الميزات والوظائف المتاحة.
          </p>
        </div>

        {/* Quick Start */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Play className="h-6 w-6 mr-2" />
            البداية السريعة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickStart.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  <div className="space-y-2">
                    {item.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start space-x-2">
                        <Badge variant="secondary" className="mt-0.5">{stepIndex + 1}</Badge>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                  <Link to={item.href}>
                    <Button className="w-full mt-4">
                      ابدأ الآن
                      <ArrowRight className="h-4 w-4 mr-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* User Roles */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Users className="h-6 w-6 mr-2" />
            أدوار المستخدمين
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userRoles.map((role, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${role.color}`}>
                      <role.icon className="h-5 w-5 text-white" />
                    </div>
                    <span>{role.role}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {role.permissions.map((permission, permIndex) => (
                      <div key={permIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{permission}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips and Tricks */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Info className="h-6 w-6 mr-2" />
            نصائح وحيل
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <tip.icon className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Keyboard className="h-6 w-6 mr-2" />
            اختصارات لوحة المفاتيح
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {keyboardShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">{shortcut.description}</span>
                    <kbd className="px-2 py-1 text-xs font-semibold bg-background border rounded">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Troubleshooting */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2" />
            حل المشاكل الشائعة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {troubleshooting.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2 text-red-600">{item.problem}</h3>
                  <p className="text-sm text-muted-foreground">{item.solution}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6">
              <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">هل تحتاج مساعدة إضافية؟</h3>
              <p className="text-sm text-muted-foreground mb-4">
                إذا لم تجد الإجابة هنا، لا تتردد في التواصل مع فريق الدعم
              </p>
              <Button className="w-full">
                تواصل مع الدعم
                <ArrowRight className="h-4 w-4 mr-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserGuide; 