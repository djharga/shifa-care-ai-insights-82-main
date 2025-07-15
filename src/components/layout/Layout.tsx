import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

// منطق تحديد الوقت
const getTimeTheme = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning'; // صباح
  if (hour >= 12 && hour < 18) return 'evening'; // مساء
  return 'night'; // ليل
};

// متغير ثابت مؤقت لدور المستخدم (يمكن ربطه لاحقاً بالمصادقة)
const userRole = localStorage.getItem('userRole') || 'admin'; // أو therapist أو patient

// منطق تحديد نوع الصفحة (بناءً على المسار)
const getPageType = () => {
  if (window.location.pathname.includes('reports')) return 'reports';
  if (window.location.pathname.includes('chat')) return 'chat';
  return 'default';
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const timeTheme = getTimeTheme();
  const pageType = getPageType();
  const rootClass = `min-h-screen font-arabic overflow-x-hidden dir-rtl theme-${timeTheme} role-${userRole} page-${pageType}`;

  return (
    <div className={rootClass}>
      {/* SVG/Gradient خلفية ديناميكية */}
      <div className="fixed inset-0 -z-10 pointer-events-none select-none">
        {timeTheme === 'morning' && (
          <svg width="100%" height="100%" className="absolute inset-0 w-full h-full" style={{opacity:0.12}}><defs><linearGradient id="morning" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#b2ebf2"/><stop offset="100%" stopColor="#e0f7fa"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#morning)"/><circle cx="80%" cy="20%" r="180" fill="#81d4fa" opacity="0.3"/><circle cx="20%" cy="80%" r="120" fill="#a5d6a7" opacity="0.2"/></svg>
        )}
        {timeTheme === 'evening' && (
          <svg width="100%" height="100%" className="absolute inset-0 w-full h-full" style={{opacity:0.13}}><defs><linearGradient id="evening" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ffe082"/><stop offset="100%" stopColor="#ffcc80"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#evening)"/><ellipse cx="70%" cy="30%" rx="160" ry="80" fill="#ffb74d" opacity="0.25"/><ellipse cx="30%" cy="70%" rx="100" ry="60" fill="#ba68c8" opacity="0.18"/></svg>
        )}
        {timeTheme === 'night' && (
          <svg width="100%" height="100%" className="absolute inset-0 w-full h-full" style={{opacity:0.15}}><defs><linearGradient id="night" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#263238"/><stop offset="100%" stopColor="#37474f"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#night)"/><circle cx="85%" cy="15%" r="100" fill="#1976d2" opacity="0.18"/><circle cx="15%" cy="85%" r="80" fill="#90a4ae" opacity="0.13"/></svg>
        )}
      </div>
      {/* Navigation */}
      <Navigation />
      {/* Main Content */}
      <main className="lg:mr-80 transition-all duration-300 fade-in">
        <div className="min-h-screen p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout; 