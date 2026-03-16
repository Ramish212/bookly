/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BusinessProvider } from './BusinessContext';
import { AuthProvider } from './AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { PricingPage } from './pages/PricingPage';
import { OnboardingWizard } from './pages/OnboardingWizard';
import { SiteCustomizer } from './pages/SiteCustomizer';
import { GoogleCalendarPage } from './pages/GoogleCalendarPage';
import { CalendarPage } from './pages/CalendarPage';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { CustomerBookingPage } from './pages/CustomerBookingPage';
import { ServicesPage } from './pages/ServicesPage';
import { CustomersPage } from './pages/CustomersPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { isSupabaseConfigured } from './lib/supabase';
import { useState } from 'react';
import { X, Database, AlertCircle } from 'lucide-react';

const SupabaseBanner = () => {
  const [showModal, setShowModal] = useState(false);

  if (isSupabaseConfigured) return null;

  return (
    <>
      <div className="bg-amber-light border-b border-amber-brand/20 px-4 py-2 flex items-center justify-center gap-3 text-sm">
        <AlertCircle size={16} className="text-amber-brand" />
        <span className="text-amber-brand font-medium">Supabase not connected — Data will not persist.</span>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-amber-brand text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-amber-700 transition-colors"
        >
          Connect Supabase
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-text-muted hover:text-text-main">
              <X size={20} />
            </button>
            <div className="w-12 h-12 bg-amber-light rounded-xl flex items-center justify-center text-amber-brand mb-6">
              <Database size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Connect Supabase</h3>
            <p className="text-text-secondary text-sm mb-6">
              To enable real data persistence, you need to add your Supabase credentials to the <code className="bg-bg-secondary px-1.5 py-0.5 rounded">.env</code> file or environment variables.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="p-4 bg-bg-secondary rounded-xl border border-border-main">
                <p className="text-[10px] font-bold text-text-muted uppercase mb-2">Required Variables</p>
                <code className="text-[11px] block text-p font-mono">VITE_SUPABASE_URL</code>
                <code className="text-[11px] block text-p font-mono">VITE_SUPABASE_ANON_KEY</code>
              </div>
              
              <div className="p-4 bg-p-light/30 rounded-xl border border-p-muted">
                <p className="text-[10px] font-bold text-p uppercase mb-2">SQL Setup</p>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Run the provided SQL in your Supabase SQL Editor to create the <code className="font-mono">sites</code> and <code className="font-mono">services</code> tables.
                </p>
              </div>
            </div>

            <button 
              onClick={() => setShowModal(false)}
              className="w-full bg-p text-white py-3 rounded-xl font-bold hover:bg-p-dark transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BusinessProvider>
        <Router>
          <div className="min-h-screen bg-bg-main">
            <SupabaseBanner />
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/onboarding" element={<ProtectedRoute><OnboardingWizard /></ProtectedRoute>} />
              <Route path="/customizer" element={<ProtectedRoute><SiteCustomizer /></ProtectedRoute>} />
              <Route path="/gcal" element={<ProtectedRoute><GoogleCalendarPage /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
              <Route path="/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
              <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/booking" element={<CustomerBookingPage />} />
          </Routes>
        </div>
      </Router>
    </BusinessProvider>
  </AuthProvider>
);
}
