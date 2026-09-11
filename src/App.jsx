import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import GovtSchemesModal from './components/GovtSchemesModal';
import AirtableWorkflowNav from './components/AirtableWorkflowNav';
import EntrepreneurPortal from './pages/EntrepreneurPortal';
import BankPortal from './pages/BankPortal';
import AdminPortal from './pages/AdminPortal';
import PeerPooling from './pages/PeerPooling';
import { Users, HeartHandshake, Calculator, ShieldCheck, Landmark, Sparkles } from 'lucide-react';

import ChatGPTStyleSidebar from './components/ChatGPTStyleSidebar';

function MainApp() {
  const { currentRole, switchRole } = useAuth();
  const { t } = useLanguage();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isGovtSchemesOpen, setIsGovtSchemesOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // activeView: 'entrepreneur-chat' | 'entrepreneur-reports' | 'peer-pool' | 'bank-portal' | 'admin-portal'
  const [activeView, setActiveView] = useState('entrepreneur-chat');
  const [activePhase, setActivePhase] = useState('phase1');

  const handlePhaseChange = (phaseId) => {
    setActivePhase(phaseId);
    if (phaseId === 'phase1') {
      switchRole('entrepreneur');
      setActiveView('entrepreneur-chat');
    } else if (phaseId === 'phase2' || phaseId === 'phase3') {
      switchRole('bank');
      setActiveView('bank-portal');
    } else if (phaseId === 'phase4') {
      switchRole('admin');
      setActiveView('admin-portal');
    }
  };

  const handleSelectSidebarView = (viewKey) => {
    setActiveView(viewKey);
    if (viewKey === 'entrepreneur-chat' || viewKey === 'entrepreneur-reports' || viewKey === 'peer-pool') {
      switchRole('entrepreneur');
      setActivePhase('phase1');
    } else if (viewKey === 'bank-portal') {
      switchRole('bank');
      setActivePhase('phase2');
    } else if (viewKey === 'admin-portal') {
      switchRole('admin');
      setActivePhase('phase4');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white">
      
      {/* ChatGPT-Style Left Sidebar */}
      <ChatGPTStyleSidebar
        activeView={activeView}
        onSelectView={handleSelectSidebarView}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenGovtSchemes={() => setIsGovtSchemesOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main App Layout Offset by Sidebar */}
      <div className={`transition-all duration-300 flex flex-col justify-between min-h-screen ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <div>
          <Navbar
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenGovtSchemes={() => setIsGovtSchemesOpen(true)}
          />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 space-y-6">
            
            {/* Top Operational Workflow Phase Navigator */}
            <AirtableWorkflowNav activePhase={activePhase} onPhaseChange={handlePhaseChange} />

            {/* Render Active View based on Sidebar & Role Selection */}
            {currentRole === 'entrepreneur' && (
              activeView === 'peer-pool' ? (
                <PeerPooling />
              ) : activeView === 'entrepreneur-reports' ? (
                <EntrepreneurPortal initialSubTab="feasibility" />
              ) : (
                <EntrepreneurPortal initialSubTab="chat" />
              )
            )}

            {currentRole === 'bank' && <BankPortal />}
            {currentRole === 'admin' && <AdminPortal />}

          </main>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-600" />
              <span className="font-extrabold text-slate-800">GramUday AI</span> — National Rural Enterprise Feasibility & Credit Advisory System
            </div>
            <div className="text-center md:text-right">
              State Channelizing Agencies (SCAs) Guidelines | Micro Finance (≤ ₹1.40L) & Term Loan (≤ ₹50L) Scheme Router
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <GovtSchemesModal isOpen={isGovtSchemesOpen} onClose={() => setIsGovtSchemesOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </AuthProvider>
  );
}
