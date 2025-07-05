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

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<BasicPage />} />
      <Route path="/working" element={<WorkingPage />} />
      <Route path="/simple" element={<SimplePage />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Index />} />
      <Route path="/patients" element={<Patients />} />
      <Route path="/sessions" element={<Sessions />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/ai-treatment" element={<AITreatment />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/finance" element={<Finance />} />
      <Route path="/facility-expenses" element={<FacilityExpenses />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
