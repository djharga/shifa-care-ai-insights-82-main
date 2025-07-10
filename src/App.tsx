import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Layout from './components/layout/Layout'
import SmartAssistant from './components/ai/SmartAssistant'
import './App.css'

// Error Boundary Component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // يمكن إرسال الخطأ لسيرفر أو تسجيله هنا
    console.error('ErrorBoundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-700 p-8">
          <h1 className="text-2xl font-bold mb-4">حدث خطأ في تحميل الصفحة</h1>
          <pre className="bg-red-100 p-4 rounded max-w-full overflow-x-auto text-xs mb-4">{String(this.state.error)}</pre>
          <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => window.location.reload()}>إعادة تحميل الصفحة</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy load components for better performance
const Index = React.lazy(() => import('./pages/Index'))
const Admin = React.lazy(() => import('./pages/Admin'))
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'))
const Patients = React.lazy(() => import('./pages/Patients'))
const Sessions = React.lazy(() => import('./pages/Sessions'))
const Rooms = React.lazy(() => import('./pages/Rooms'))
const Finance = React.lazy(() => import('./pages/Finance'))
const Reports = React.lazy(() => import('./pages/Reports'))
const AISessionsHub = React.lazy(() => import('./pages/AISessionsHub'))
const AdvancedAITreatment = React.lazy(() => import('./pages/AdvancedAITreatment'))
const AITreatment = React.lazy(() => import('./pages/AITreatment'))
const AdvancedSessions = React.lazy(() => import('./pages/AdvancedSessions'))
const FacilityManagement = React.lazy(() => import('./pages/FacilityManagement'))
const FacilityExpenses = React.lazy(() => import('./pages/FacilityExpenses'))
const StaffManagement = React.lazy(() => import('./pages/StaffManagement'))
const FamilyCommunication = React.lazy(() => import('./pages/FamilyCommunication'))
const AIAssistant = React.lazy(() => import('./pages/AIAssistant'))
const InternalChat = React.lazy(() => import('./pages/InternalChat'))
const PromoDesignPage = React.lazy(() => import('./pages/PromoDesignPage'))
const AdvancedPermissions = React.lazy(() => import('./components/admin/AdvancedPermissions'))
const SystemSettings = React.lazy(() => import('./pages/SystemSettings'))
const TestPage = React.lazy(() => import('./pages/TestPage'))
const SimpleTestPage = React.lazy(() => import('./pages/SimpleTestPage'))
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'))
const NotFound = React.lazy(() => import('./pages/NotFound'))

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
)

function App() {
  return (
    <Layout>
      <ErrorBoundary>
        <Suspense fallback={
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-700 p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
            <h2 className="text-lg font-bold mb-2">جاري تحميل الصفحة...</h2>
            <p className="text-sm">إذا استغرق التحميل وقتًا طويلاً أو ظهرت شاشة بيضاء، أعد تحميل الصفحة أو تواصل مع الدعم.</p>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/ai-sessions" element={<AISessionsHub />} />
            <Route path="/ai-treatment" element={<AITreatment />} />
            <Route path="/advanced-ai-treatment" element={<AdvancedAITreatment />} />
            <Route path="/advanced-sessions" element={<AdvancedSessions />} />
            <Route path="/facility-management" element={<FacilityManagement />} />
            <Route path="/facility-expenses" element={<FacilityExpenses />} />
            <Route path="/staff-management" element={<StaffManagement />} />
            <Route path="/family-communication" element={<FamilyCommunication />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/internal-chat" element={<InternalChat />} />
            <Route path="/promo-design" element={<PromoDesignPage />} />
            <Route path="/advanced-permissions" element={<AdvancedPermissions />} />
            <Route path="/system-settings" element={<SystemSettings />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/simple-test" element={<SimpleTestPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      
      {/* Toast notifications */}
      <Toaster 
        position="top-center"
        richColors
        closeButton
        duration={4000}
      />
      
      {/* Smart Assistant */}
      <SmartAssistant />
    </Layout>
  )
}

export default App
