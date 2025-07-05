import { User, Calendar, FileText, BarChart3, Brain, Users, Menu, X, Settings, DollarSign, Zap, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // جلب بيانات المستخدم الحالي من Supabase أو localStorage
    const fetchUserRole = async () => {
      // مثال: جلب أول مستخدم (في التطبيق الحقيقي استخدم بيانات الجلسة)
      const { data } = await supabase.from('profiles').select('role').limit(1);
      setUserRole(data?.[0]?.role || null);
    };
    fetchUserRole();
  }, []);

  const navItems = [
    { to: "/", icon: BarChart3, label: "الرئيسية" },
    { to: "/patients", icon: User, label: "العيانين" },
    { to: "/sessions", icon: Calendar, label: "الجلسات" },
    { to: "/advanced-sessions", icon: Brain, label: "الجلسات بالذكاء الاصطناعي" },
    { to: "/ai-treatment", icon: Brain, label: "ذكاء صناعي" },
    { to: "/reports", icon: FileText, label: "تقارير" },
  ];

  // أضف رابط إدارة المرافق الموحد إذا كان المستخدم مدير أو محاسب
  if (userRole === 'admin' || userRole === 'accountant') {
    navItems.push({ to: "/facility-management", icon: Building, label: "إدارة المرافق" });
  }

  // أضف رابط الحسابات المالية إذا كان المستخدم مدير أو محاسب
  if (userRole === 'admin' || userRole === 'accountant') {
    navItems.push({ to: "/finance", icon: DollarSign, label: "الحسابات المالية" });
    navItems.push({ to: "/facility-expenses", icon: Zap, label: "مصاريف المصحة" });
  }
  
  // أضف رابط الغرف إذا كان المستخدم مدير أو محاسب
  if (userRole === 'admin' || userRole === 'accountant') {
    navItems.push({ to: "/rooms", icon: Building, label: "الغرف والأسرّة" });
  }

  // أضف رابط لوحة التحكم إذا كان المستخدم مدير أو مشرف
  if (userRole === 'admin' || userRole === 'supervisor') {
    navItems.push({ to: "/admin", icon: Settings, label: "لوحة التحكم" });
  }

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">شفا كير</h1>
                <p className="text-xs text-muted-foreground">نظام إدارة المصحة</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to}>
                <Button 
                  variant={location.pathname === item.to ? 'default' : 'ghost'} 
                  className="flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">د. أحمد محمد</p>
              <p className="text-xs text-muted-foreground">مدير المصحة</p>
            </div>
            <Link to="/auth">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
            </Link>
            {/* زر دخول المدير */}
            <Link to="/admin-login">
              <Button variant="outline" size="sm" className="ml-2">دخول المدير</Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant={location.pathname === item.to ? 'default' : 'ghost'}
                    className="w-full justify-start flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;