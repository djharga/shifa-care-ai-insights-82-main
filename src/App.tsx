import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Layout from './components/layout/Layout'
import SmartAssistant from './components/ai/SmartAssistant'
import './App.css'

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
const PromoDesignPage = React.lazy(() => import('./pages/PromoDesignPage'))
const AdvancedPermissions = React.lazy(() => import('./components/admin/AdvancedPermissions'))
const SystemSettings = React.lazy(() => import('./pages/SystemSettings'))
const TestPage = React.lazy(() => import('./pages/TestPage'))
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
      <Suspense fallback={<LoadingSpinner />}>
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
          <Route path="/promo-design" element={<PromoDesignPage />} />
          <Route path="/advanced-permissions" element={<AdvancedPermissions />} />
          <Route path="/system-settings" element={<SystemSettings />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      
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
