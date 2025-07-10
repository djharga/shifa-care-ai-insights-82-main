import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Users, 
  Calendar, 
  Building2, 
  DollarSign, 
  BarChart3, 
  Brain, 
  Settings,
  Menu,
  X,
  Shield,
  FileText,
  Activity,
  Heart,
  Stethoscope,
  Calculator,
  UserPlus,
  MessageSquare,
  Bot,
  Palette,
  Key,
  ArrowLeft
} from 'lucide-react';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    // الصفحة الرئيسية
    { section: 'الرئيسية' },
    {
      title: 'الصفحة الرئيسية',
      href: '/',
      icon: Home,
      description: 'العودة للصفحة الرئيسية'
    },
    // المرضى
    { section: 'المرضى' },
    {
      title: 'كل المرضى',
      href: '/patients',
      icon: Users,
      description: 'إدارة المرضى والمقيمين'
    },
    // الجلسات
    { section: 'الجلسات' },
    {
      title: 'كل الجلسات',
      href: '/sessions',
      icon: Calendar,
      description: 'إدارة الجلسات العلاجية'
    },
    {
      title: 'الجلسات المتقدمة',
      href: '/advanced-sessions',
      icon: Activity,
      description: 'جلسات علاجية متقدمة'
    },
    {
      title: 'جلسات الذكاء الاصطناعي',
      href: '/ai-sessions',
      icon: Brain,
      description: 'جلسات مدعومة بالذكاء الاصطناعي'
    },
    {
      title: 'العلاج بالذكاء الاصطناعي',
      href: '/ai-treatment',
      icon: Stethoscope,
      description: 'خطط علاجية ذكية'
    },
    {
      title: 'العلاج المتقدم بالذكاء الاصطناعي',
      href: '/advanced-ai-treatment',
      icon: Heart,
      description: 'علاج متقدم بالذكاء الاصطناعي'
    },
    // الغرف
    { section: 'الغرف' },
    {
      title: 'كل الغرف',
      href: '/rooms',
      icon: Building2,
      description: 'إدارة الغرف والمرافق'
    },
    {
      title: 'مصاريف المرافق',
      href: '/facility-expenses',
      icon: Calculator,
      description: 'إدارة مصاريف المرافق'
    },
    {
      title: 'إدارة المرافق',
      href: '/facility-management',
      icon: Settings,
      description: 'إدارة المرافق والتجهيزات'
    },
    // المالية
    { section: 'المالية' },
    {
      title: 'الحسابات',
      href: '/finance',
      icon: DollarSign,
      description: 'إدارة الشؤون المالية'
    },
    {
      title: 'التقارير المالية',
      href: '/reports',
      icon: BarChart3,
      description: 'التقارير والإحصائيات'
    },
    // الإدارة
    { section: 'الإدارة' },
    {
      title: 'إدارة الموظفين',
      href: '/staff-management',
      icon: UserPlus,
      description: 'إدارة الموظفين والورديات والإجازات'
    },
    {
      title: 'إدارة الصلاحيات',
      href: '/advanced-permissions',
      icon: Key,
      description: 'إدارة الأدوار والصلاحيات والمستخدمين'
    },
    {
      title: 'التواصل مع الأسر',
      href: '/family-communication',
      icon: MessageSquare,
      description: 'إدارة التواصل مع أسر المرضى والتقارير'
    },
    {
      title: 'الشات الداخلي',
      href: '/internal-chat',
      icon: MessageSquare,
      description: 'شات داخلي للمعالجين والمشرفين والمدير'
    },
    {
      title: 'لوحة الإدارة',
      href: '/admin',
      icon: Shield,
      description: 'لوحة الإدارة'
    },
    // النظام
    { section: 'النظام' },
    {
      title: 'إعدادات النظام',
      href: '/system-settings',
      icon: Settings,
      description: 'إعدادات النظام والمركز العلاجي'
    },
    {
      title: 'المساعد الذكي',
      href: '/ai-assistant',
      icon: Bot,
      description: 'مساعد ذكي للموظفين باللهجة المصرية'
    },
    {
      title: 'التصميم الدعائي',
      href: '/promo-design',
      icon: Palette,
      description: 'تصميمات دعائية للمساعد الذكي'
    },
    {
      title: 'صفحة الاختبار',
      href: '/test',
      icon: FileText,
      description: 'اختبار النظام والواجهة'
    },
    {
      title: 'اختبار التوجيه',
      href: '/simple-test',
      icon: FileText,
      description: 'اختبار التوجيه البسيط'
    },
    {
      title: 'سياسة الخصوصية',
      href: '/privacy-policy',
      icon: Shield,
      description: 'سياسة الخصوصية والاستخدام وحقوق الملكية'
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-background/90 backdrop-blur-sm border-2 shadow-lg hover:bg-background/95"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Back to Home Button - Mobile */}
      {location.pathname !== '/' && (
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBackToHome}
            className="bg-background/90 backdrop-blur-sm border-2 shadow-lg hover:bg-background/95"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/98 backdrop-blur-md">
          <div className="flex flex-col h-full p-4 pt-20">
            {/* Mobile Header */}
            <div className="mb-6 pb-4 border-b border-border">
              <div className="flex items-center space-x-3 space-x-reverse mb-3">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Heart className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">شفاء كير</h1>
                  <p className="text-sm text-muted-foreground">نظام إدارة مراكز العلاج</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                النسخة 2025.2.1
              </Badge>
            </div>

            {/* Mobile Navigation Items */}
            <div className="flex-1 overflow-y-auto space-y-1">
              {navigationItems.map((item, idx) => {
                if (item.section) {
                  return (
                    <div key={item.section + idx} className="py-2 px-2 text-xs font-bold text-muted-foreground/80 border-b border-border mb-2 mt-4">
                      {item.section}
                    </div>
                  );
                }
                // Type guard: skip if item doesn't have href or icon
                if (!item.href || !item.icon) return null;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 space-x-reverse p-4 rounded-xl transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'hover:bg-muted/50 active:bg-muted'
                    }`}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${isActive(item.href) ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className={`text-xs mt-1 ${isActive(item.href) ? 'opacity-80' : 'opacity-60'}`}>
                        {item.description}
                      </div>
                    </div>
                    {isActive(item.href) && (
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        نشط
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Footer */}
            <div className="pt-4 border-t border-border">
              <div className="text-center text-xs text-muted-foreground">
                <p>شفاء كير للذكاء الاصطناعي</p>
                <p className="mt-1">نظام متكامل لإدارة مراكز علاج الإدمان</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="hidden lg:block fixed right-0 top-0 h-full w-80 bg-background border-l border-border p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 space-x-reverse mb-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">شفاء كير</h1>
              <p className="text-sm text-muted-foreground">نظام إدارة مراكز العلاج</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            النسخة 2025.2.1
          </Badge>
        </div>

        {/* Back to Home Button - Desktop */}
        {location.pathname !== '/' && (
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={handleBackToHome}
              className="w-full justify-start"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة للصفحة الرئيسية
            </Button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navigationItems.map((item, idx) => {
            if (item.section) {
              return (
                <div key={item.section + idx} className="py-2 px-2 text-xs font-bold text-muted-foreground/80 border-b border-border mb-2 mt-4">
                  {item.section}
                </div>
              );
            }
            // Type guard: skip if item doesn't have href or icon
            if (!item.href || !item.icon) return null;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`block p-3 rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'hover:bg-muted hover:shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Icon className={`h-5 w-5 ${isActive(item.href) ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className={`text-sm ${isActive(item.href) ? 'opacity-80' : 'opacity-60'}`}>
                      {item.description}
                    </div>
                  </div>
                  {isActive(item.href) && (
                    <Badge variant="secondary" className="text-xs">
                      نشط
                    </Badge>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="text-center text-sm text-muted-foreground">
            <p>شفاء كير للذكاء الاصطناعي</p>
            <p className="mt-1">نظام متكامل لإدارة مراكز علاج الإدمان</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation; 