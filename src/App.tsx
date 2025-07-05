import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import './App.css';

// صفحة بسيطة للاختبار
const SimpleHome = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          شفاء كير
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          نظام إدارة العيادة الطبية مع الذكاء الاصطناعي
        </p>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">{t('dashboard')}</h2>
            <p className="text-gray-600">{t('ai_assistant')}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">{t('patients')}</h2>
            <p className="text-gray-600">إدارة المرضى والجلسات</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">{t('sessions')}</h2>
            <p className="text-gray-600">جدولة ومتابعة الجلسات</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    // تعيين اتجاه النص بناءً على اللغة
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SimpleHome />} />
        <Route path="*" element={<SimpleHome />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
