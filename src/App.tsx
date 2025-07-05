import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import './App.css';

// صفحة بسيطة للاختبار
const SimpleHome = () => {
  const { t } = useTranslation();
  
  console.log('SimpleHome component rendered');
  
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-blue-900 mb-6">
          شفاء كير
        </h1>
        <p className="text-xl text-blue-700 mb-8">
          نظام إدارة العيادة الطبية مع الذكاء الاصطناعي
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">{t('dashboard')}</h2>
            <p className="text-blue-600">{t('ai_assistant')}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">{t('patients')}</h2>
            <p className="text-blue-600">إدارة المرضى والجلسات</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">{t('sessions')}</h2>
            <p className="text-blue-600">جدولة ومتابعة الجلسات</p>
          </div>
        </div>
        <div className="mt-8 text-sm text-blue-500">
          تم التطوير بنجاح! 🎉
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    console.log('App component mounted');
    console.log('Current language:', i18n.language);
    
    // تعيين اتجاه النص بناءً على اللغة
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    
    console.log('Document direction set to:', document.documentElement.dir);
  }, [i18n.language]);

  console.log('App component rendering');

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
