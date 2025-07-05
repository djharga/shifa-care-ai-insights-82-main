import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Finance from './pages/Finance';
import FacilityExpenses from './pages/FacilityExpenses';
import Rooms from './pages/Rooms';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/working" element={<WorkingPage />} />
      <Route path="/simple" element={<SimplePage />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/dashboard" element={<Index />} />
      <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
      <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/ai-treatment" element={<ProtectedRoute><AITreatment /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      <Route path="/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
      <Route path="/facility-expenses" element={<ProtectedRoute><FacilityExpenses /></ProtectedRoute>} />
      <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
