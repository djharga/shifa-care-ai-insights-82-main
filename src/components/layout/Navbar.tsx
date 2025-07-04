import { User, Calendar, FileText, BarChart3, Brain, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
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
              <div>
                <h1 className="text-xl font-bold text-foreground">شفا كير</h1>
                <p className="text-xs text-muted-foreground">نظام إدارة المصحة</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <Link to="/">
              <Button variant={location.pathname === '/' ? 'default' : 'ghost'} className="flex items-center space-x-2 rtl:space-x-reverse">
                <BarChart3 className="h-4 w-4" />
                <span>الرئيسية</span>
              </Button>
            </Link>
            
            <Link to="/patients">
              <Button variant={location.pathname === '/patients' ? 'default' : 'ghost'} className="flex items-center space-x-2 rtl:space-x-reverse">
                <User className="h-4 w-4" />
                <span>العيانين</span>
              </Button>
            </Link>
            
            <Link to="/sessions">
              <Button variant={location.pathname === '/sessions' ? 'default' : 'ghost'} className="flex items-center space-x-2 rtl:space-x-reverse">
                <Calendar className="h-4 w-4" />
                <span>الجلسات</span>
              </Button>
            </Link>
            
            <Link to="/ai-treatment">
              <Button variant={location.pathname === '/ai-treatment' ? 'default' : 'ghost'} className="flex items-center space-x-2 rtl:space-x-reverse">
                <Brain className="h-4 w-4" />
                <span>ذكاء صناعي</span>
              </Button>
            </Link>
            
            <Link to="/reports">
              <Button variant={location.pathname === '/reports' ? 'default' : 'ghost'} className="flex items-center space-x-2 rtl:space-x-reverse">
                <FileText className="h-4 w-4" />
                <span>تقارير</span>
              </Button>
            </Link>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">د. أحمد محمد</p>
              <p className="text-xs text-muted-foreground">مدير المصحة</p>
            </div>
            <Link to="/auth">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;