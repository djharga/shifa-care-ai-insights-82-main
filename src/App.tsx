import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import BasicPage from './pages/BasicPage';
import WorkingPage from './pages/WorkingPage';
import SimplePage from './pages/SimplePage';
import TestPage from './pages/TestPage';
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Patients from "./pages/Patients";
import Sessions from "./pages/Sessions";
import Reports from "./pages/Reports";
import AITreatment from "./pages/AITreatment";
import AdvancedAITreatment from "./pages/AdvancedAITreatment";
import AdvancedSessions from "./pages/AdvancedSessions";
import AISessionsHub from "./pages/AISessionsHub";
import NotFound from "./pages/NotFound";
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Finance from './pages/Finance';
import FacilityExpenses from './pages/FacilityExpenses';
import Rooms from './pages/Rooms';
import FacilityManagement from './pages/FacilityManagement';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import './App.css';

const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // تعيين اتجاه النص بناءً على اللغة
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;

    // تسجيل Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // طلب إذن الإشعارات
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, [i18n.language]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/working" element={<WorkingPage />} />
            <Route path="/simple" element={<SimplePage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/advanced-sessions" element={<AISessionsHub />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/ai-treatment" element={<AITreatment />} />
            <Route path="/advanced-ai" element={<AdvancedAITreatment />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/facility-expenses" element={<FacilityExpenses />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/facility-management" element={<FacilityManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
