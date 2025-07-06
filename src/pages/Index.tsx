import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  Building2, 
  DollarSign, 
  BarChart3, 
  Brain, 
  Settings,
  Activity,
  Heart,
  Stethoscope,
  Calculator,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Shield,
  UserPlus,
  MessageSquare,
  Bot,
  Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '../lib/i18n';

const Index = () => {
  const { t } = useTranslation();
  const stats = {
    totalPatients: 45,
    activeSessions: 12,
    availableRooms: 8,
    monthlyRevenue: 125000,
    aiSessions: 23,
    treatmentPlans: 18
  };

  const quickActions = [
    {
      title: 'إضافة مريض جديد',
      description: 'تسجيل مريض جديد في النظام',
      icon: Plus,
      href: '/patients',
      color: 'bg-blue-500',
      textColor: 'text-blue-500'
    },
    {
      title: 'جدولة جلسة',
      description: 'إنشاء جلسة علاجية جديدة',
      icon: Calendar,
      href: '/sessions',
      color: 'bg-green-500',
      textColor: 'text-green-500'
    },
    {
      title: 'جلسة بالذكاء الاصطناعي',
      description: 'بدء جلسة مدعومة بالذكاء الاصطناعي',
      icon: Brain,
      href: '/ai-sessions',
      color: 'bg-purple-500',
      textColor: 'text-purple-500'
    },
    {
      title: 'إنشاء خطة علاجية',
      description: 'وضع خطة علاجية جديدة',
      icon: Stethoscope,
      href: '/ai-treatment',
      color: 'bg-orange-500',
      textColor: 'text-orange-500'
    },
    {
      title: 'المساعد الذكي',
      description: 'احصل على مساعدة فورية',
      icon: Bot,
      href: '/ai-assistant',
      color: 'bg-cyan-500',
      textColor: 'text-cyan-500'
    }
  ];

  const recentActivities = [
    {
      title: 'تم إضافة مريض جديد',
      description: 'أحمد محمد - تم التسجيل في 10:30 ص',
      icon: User,
      time: 'منذ 5 دقائق',
      type: 'success'
    },
    {
      title: 'جلسة علاجية مكتملة',
      description: 'جلسة المريض علي حسن - تم الانتهاء بنجاح',
      icon: CheckCircle,
      time: 'منذ 15 دقيقة',
      type: 'success'
    },
    {
      title: 'تحديث خطة علاجية',
      description: 'تم تحديث خطة العلاج للمريض سارة أحمد',
      icon: Stethoscope,
      time: 'منذ ساعة',
      type: 'info'
    },
    {
      title: 'تنبيه: غرفة تحتاج صيانة',
      description: 'الغرفة رقم 3 تحتاج إلى صيانة عاجلة',
      icon: AlertCircle,
      time: 'منذ ساعتين',
      type: 'warning'
    }
  ];

  const mainModules = [
    {
      title: 'إدارة المرضى',
      description: 'إدارة بيانات المرضى والمقيمين',
      icon: Users,
      href: '/patients',
      stats: `${stats.totalPatients} مريض`,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'الجلسات العلاجية',
      description: 'إدارة الجلسات والمواعيد',
      icon: Calendar,
      href: '/sessions',
      stats: `${stats.activeSessions} جلسة نشطة`,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'الجلسات المتقدمة',
      description: 'جلسات علاجية متقدمة ومتخصصة',
      icon: Activity,
      href: '/advanced-sessions',
      stats: 'جلسات متقدمة',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'إدارة الغرف',
      description: 'إدارة الغرف والمرافق',
      icon: Building2,
      href: '/rooms',
      stats: `${stats.availableRooms} غرفة متاحة`,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'الشؤون المالية',
      description: 'إدارة الميزانية والإيرادات',
      icon: DollarSign,
      href: '/finance',
      stats: `${stats.monthlyRevenue.toLocaleString()} ريال`,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'التقارير والإحصائيات',
      description: 'تقارير مفصلة وإحصائيات',
      icon: BarChart3,
      href: '/reports',
      stats: 'تقارير شاملة',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'جلسات الذكاء الاصطناعي',
      description: 'جلسات مدعومة بالذكاء الاصطناعي',
      icon: Brain,
      href: '/ai-sessions',
      stats: `${stats.aiSessions} جلسة ذكية`,
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: 'العلاج بالذكاء الاصطناعي',
      description: 'خطط علاجية ذكية ومتطورة',
      icon: Stethoscope,
      href: '/ai-treatment',
      stats: `${stats.treatmentPlans} خطة علاجية`,
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      title: 'العلاج المتقدم بالذكاء الاصطناعي',
      description: 'علاج متقدم ومتخصص',
      icon: Heart,
      href: '/advanced-ai-treatment',
      stats: 'علاج متقدم',
      color: 'from-rose-500 to-rose-600'
    },
    {
      title: 'إدارة المرافق',
      description: 'إدارة المرافق والتجهيزات',
      icon: Settings,
      href: '/facility-management',
      stats: 'إدارة شاملة',
      color: 'from-slate-500 to-slate-600'
    },
    {
      title: 'مصاريف المرافق',
      description: 'إدارة مصاريف المرافق',
      icon: Calculator,
      href: '/facility-expenses',
      stats: 'مصاريف المرافق',
      color: 'from-amber-500 to-amber-600'
    },
    {
      title: 'إدارة الموظفين والورديات',
      description: 'إدارة الموظفين والورديات والإجازات',
      icon: UserPlus,
      href: '/staff-management',
      stats: 'إدارة شاملة',
      color: 'from-teal-500 to-teal-600'
    },
    {
      title: 'التواصل مع الأسر',
      description: 'إدارة التواصل مع أسر المرضى والتقارير',
      icon: MessageSquare,
      href: '/family-communication',
      stats: 'تواصل آمن',
      color: 'from-violet-500 to-violet-600'
    },
    {
      title: 'المساعد الذكي',
      description: 'مساعد ذكي للموظفين باللهجة المصرية',
      icon: Bot,
      href: '/ai-assistant',
      stats: '24/7 متاح',
      color: 'from-cyan-500 to-blue-600'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'info':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('dashboard')}</h1>
            <p className="text-muted-foreground">
              أهلاً بيك في نظام شفا كير - هنا هتلاقي كل جديد عن العيانين والجلسات
            </p>
          </div>
          <div>
            <button onClick={() => i18n.changeLanguage('ar')}>فصحى</button>
            <button onClick={() => i18n.changeLanguage('ar-EG')} style={{marginRight: 8}}>مصري</button>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <TrendingUp className="h-5 w-5" />
              <span>إجراءات سريعة</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                return (
                  <Link key={index} to={action.href}>
                    <Card className="hover:shadow-md transition-all duration-200 cursor-pointer border-2 hover:border-primary">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className={`p-2 rounded-lg ${action.color}`}>
                            <action.icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{action.title}</h3>
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mainModules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Link key={index} to={module.href}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 space-x-reverse mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${module.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{module.title}</h3>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {module.stats}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <Activity className="h-5 w-5" />
                <span>النشاطات الأخيرة</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 space-x-reverse p-3 rounded-lg hover:bg-muted/50">
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <Shield className="h-5 w-5" />
                <span>حالة النظام</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">قاعدة البيانات</span>
                  </div>
                  <Badge variant="default" className="bg-green-500">متصل</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Brain className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">الذكاء الاصطناعي</span>
                  </div>
                  <Badge variant="default" className="bg-blue-500">نشط</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">المستخدمين النشطين</span>
                  </div>
                  <Badge variant="default" className="bg-purple-500">3 مستخدمين</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">آخر تحديث</span>
                  </div>
                  <Badge variant="outline">منذ 5 دقائق</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* المساعد الذكي */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">المساعد الذكي</h3>
                    <p className="text-gray-600">مساعدك الشخصي في شفا كير - متاح 24/7</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    ذكي
                  </Badge>
                  <Button asChild>
                    <Link to="/ai-assistant">
                      ابدأ المحادثة
                      <ArrowRight className="w-4 h-4 mr-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
