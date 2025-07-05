import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  title,
  showBackButton = false,
  onBack
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-soft">
        <div className="flex items-center justify-between px-4 py-3">
          {showBackButton && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label={t('back')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {title && (
            <h1 className="text-lg font-semibold text-foreground flex-1 text-center">
              {title}
            </h1>
          )}
          
          <div className="w-10" /> {/* Spacer for balance */}
        </div>
      </header>

      {/* Mobile Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4">
          {children}
        </div>
      </main>

      {/* Mobile Safe Area */}
      <div className="h-safe-area-inset-bottom bg-background" />
    </div>
  );
}; 