import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background font-arabic overflow-x-hidden" dir="rtl">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="lg:mr-80 transition-all duration-300 fade-in">
        <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout; 