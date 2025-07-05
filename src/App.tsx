import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Patients from "./pages/Patients";
import Sessions from "./pages/Sessions";
import Reports from "./pages/Reports";
import AITreatment from "./pages/AITreatment";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Finance from './pages/Finance';
import FacilityExpenses from './pages/FacilityExpenses';
import Rooms from './pages/Rooms';
import TestPage from './pages/TestPage';
import SimplePage from './pages/SimplePage';
import WorkingPage from './pages/WorkingPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/simple" element={<SimplePage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<WorkingPage />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/patients" element={
            <ProtectedRoute>
              <Patients />
            </ProtectedRoute>
          } />
          <Route path="/sessions" element={
            <ProtectedRoute>
              <Sessions />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/ai-treatment" element={
            <ProtectedRoute>
              <AITreatment />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin', 'supervisor']}>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/finance" element={
            <ProtectedRoute roles={['admin', 'accountant']}>
              <Finance />
            </ProtectedRoute>
          } />
          <Route path="/facility-expenses" element={
            <ProtectedRoute roles={['admin', 'accountant']}>
              <FacilityExpenses />
            </ProtectedRoute>
          } />
          <Route path="/rooms" element={
            <ProtectedRoute roles={['admin', 'accountant']}>
              <Rooms />
            </ProtectedRoute>
          } />
          <Route path="/admin-login" element={<AdminLogin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
