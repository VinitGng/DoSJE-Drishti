/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { DemoTourModal } from './components/DemoTourModal';
import { GovernmentDashboard } from './components/government/GovernmentDashboard';
import { InspectorApp } from './components/inspector/InspectorApp';
import { NGODashboard } from './components/ngo/NGODashboard';
import { LoginPage } from './components/auth/LoginPage';
import { ToastContainer } from './components/common/ToastContainer';
import { ShieldCheck, HeartHandshake, Sparkles, Building, Landmark } from 'lucide-react';

const MainContent: React.FC = () => {
  const { role, currentUser } = useApp();

  // If user is not authenticated, show separate LoginPage with selection of options
  if (!currentUser) {
    return <LoginPage initialRole={role} />;
  }

  return (
    <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {role === 'government' && <GovernmentDashboard />}
      {role === 'inspector' && <InspectorApp />}
      {role === 'ngo' && <NGODashboard />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        <Header />
        
        <MainContent />

        {/* Presentation Walkthrough Modal */}
        <DemoTourModal />

        {/* Real-time Toast Notifications Container */}
        <ToastContainer />

        {/* Official Portal Footer */}
        <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                दृ
              </div>
              <span>
                <strong>Project DRISHTI</strong> • Department of Social Justice & Empowerment (DoSJE)
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-400 text-[11px]">
              <span className="flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5 text-amber-500" />
                Ministry of Social Justice & Empowerment, Govt. of India
              </span>
              <span>•</span>
              <span className="font-mono text-[10px] text-emerald-400">National Monitoring Portal v2.4</span>
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}
