import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background font-arabic" dir="rtl">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="lg:mr-80 transition-all duration-300">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout; 