import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Activity,
  Brain,
  Heart,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Download,
  Share2,
  Settings,
  Bell,
  Search,
  Filter,
  RefreshCw,
  Zap,
  Star,
  Award,
  Trophy,
  Medal,
  Crown,
  Shield,
  Lock,
  Unlock,
  Key,
  UserCheck,
  UserX,
  UserPlus,
  UserMinus,
  UserCog,
  User,
  AlertCircle,
  Building2,
  DollarSign,
  BarChart3,
  Calculator,
  MessageSquare,
  ArrowRight,
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
      icon: Shield,
      href: '/ai-treatment',
      color: 'bg-orange-500',
      textColor: 'text-orange-500'
    },
    {
      title: 'المساعد الذكي',
      description: 'احصل على مساعدة فورية',
      icon: UserCog,
      href: '/ai-assistant',
      color: 'bg-cyan-500',
      textColor: 'text-cyan-500'
    },
    {
      title: 'الشات الداخلي',
      description: 'تواصل مع المعالجين والمشرفين',
      icon: MessageSquare,
      href: '/internal-chat',
      color: 'bg-pink-500',
      textColor: 'text-pink-500'
    },
    {
      title: 'اختبار التوجيه',
      description: 'اختبار جميع الروابط',
      icon: Settings,
      href: '/simple-test',
      color: 'bg-red-500',
      textColor: 'text-red-500'
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
      icon: Shield,
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
      icon: Shield,
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
      icon: UserCog,
      href: '/ai-assistant',
      stats: '24/7 متاح',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      title: 'الشات الداخلي',
      description: 'تواصل المعالجين والمشرفين والمدير',
      icon: MessageSquare,
      href: '/internal-chat',
      stats: 'تواصل فوري',
      color: 'from-pink-500 to-rose-600'
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

  // Add important alerts section after stats
  const importantAlerts = [
    {
      title: 'مدفوعات معلقة',
      description: '3 مدفوعات تحتاج إلى متابعة',
      icon: AlertTriangle,
      type: 'warning',
      href: '/finance'
    },
    {
      title: 'جلسات اليوم',
      description: '5 جلسات مجدولة لهذا اليوم',
      icon: Calendar,
      type: 'info',
      href: '/sessions'
    },
    {
      title: 'غرف تحتاج صيانة',
      description: 'غرفتان تحتاجان إلى صيانة',
      icon: Building2,
      type: 'warning',
      href: '/rooms'
    },
    {
      title: 'مرضى جدد',
      description: 'مريضان جديدان يحتاجان إلى تقييم',
      icon: UserPlus,
      type: 'success',
      href: '/patients'
    }
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden" dir="rtl">
      <main className="w-full max-w-full">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">{t('dashboard')}</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                أهلاً بيك في نظام شفا كير - هنا هتلاقي كل جديد عن العيانين والجلسات
              </p>
            </div>
            <div className="flex space-x-2 space-x-reverse flex-shrink-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => i18n.changeLanguage('ar')}
                className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
              >
                فصحى
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => i18n.changeLanguage('ar-EG')}
                className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
              >
                مصري
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="mb-4 sm:mb-6 lg:mb-8">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center space-x-2 space-x-reverse text-base sm:text-lg lg:text-xl">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>إجراءات سريعة</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
              {quickActions.map((action, index) => {
                return (
                  <Link key={index} to={action.href}>
                    <Card className="hover:shadow-md transition-all duration-200 cursor-pointer border-2 hover:border-primary h-full">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse">
                          <div className={`p-2 rounded-lg ${action.color} flex-shrink-0`}>
                            <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base">{action.title}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{action.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {mainModules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Link key={index} to={module.href}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 space-x-reverse mb-3 sm:mb-4">
                      <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${module.color} flex-shrink-0`}>
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base lg:text-lg">{module.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{module.description}</p>
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

        {/* Recent Activities & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 space-x-reverse text-base sm:text-lg lg:text-xl">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>النشاطات الأخيرة</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-2 sm:space-x-3 space-x-reverse p-2 sm:p-3 rounded-lg hover:bg-muted/50">
                      <div className="mt-1 flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base">{activity.title}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{activity.description}</p>
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
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 space-x-reverse text-base sm:text-lg lg:text-xl">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>حالة النظام</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-2 sm:p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">قاعدة البيانات</span>
                  </div>
                  <Badge variant="default" className="bg-green-500 text-xs">متصل</Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Brain className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">الذكاء الاصطناعي</span>
                  </div>
                  <Badge variant="default" className="bg-blue-500 text-xs">نشط</Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 sm:p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Users className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">المستخدمين النشطين</span>
                  </div>
                  <Badge variant="default" className="bg-purple-500 text-xs">3 مستخدمين</Badge>
                </div>

                <div className="flex items-center justify-between p-2 sm:p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">آخر تحديث</span>
                  </div>
                  <Badge variant="outline" className="text-xs">منذ 5 دقائق</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* المساعد الذكي */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-4 space-x-reverse">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserCog className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">المساعد الذكي</h3>
                    <p className="text-sm sm:text-base text-gray-600">مساعدك الشخصي في شفا كير - متاح 24/7</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 sm:space-x-reverse">
                  <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    ذكي
                  </Badge>
                  <Button asChild size="sm" className="w-full sm:w-auto h-10 text-base">
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

        {/* التنبيهات المهمة */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            التنبيهات المهمة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {importantAlerts.map((alert, index) => (
              <Link key={index} to={alert.href}>
                <Card className={`border-2 hover:shadow-md transition-shadow cursor-pointer ${getAlertColor(alert.type)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <alert.icon className="h-5 w-5" />
                      <div>
                        <h3 className="font-medium text-sm">{alert.title}</h3>
                        <p className="text-xs opacity-80">{alert.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer with Privacy Policy */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-right">
              <p className="text-sm text-gray-600">
                © 2024 شفا كير - نظام الرعاية الذكي. جميع الحقوق محفوظة.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                مطور بواسطة Claude Sonnet 4 & Islam Ali Dev
              </p>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link 
                to="/privacy-policy"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center"
              >
                <Shield className="w-4 h-4 mr-1" />
                سياسة الخصوصية والاستخدام
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
