import React from 'react';
import { useTranslation } from 'react-i18next';

const TestPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {t('test_title')}
        </h1>
        <p className="text-muted-foreground mb-8">
          {t('test_desc')}
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-card rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{t('test_login_data')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('test_login_admin')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('test_login_test')}
            </p>
          </div>
          <div className="p-4 bg-card rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{t('test_status')}</h2>
            <p className="text-green-600">{t('test_status_ok')}</p>
            <p className="text-green-600">{t('test_status_auth')}</p>
            <p className="text-green-600">{t('test_status_pwa')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 