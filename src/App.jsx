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

function MainApp() {
  const { currentRole, switchRole } = useAuth();
  const { t } = useLanguage();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isGovtSchemesOpen, setIsGovtSchemesOpen] = useState(false);
  const [entrepreneurSubTab, setEntrepreneurSubTab] = useState('feasibility'); // 'feasibility' | 'peerPool'
  const [activePhase, setActivePhase] = useState('phase1');

  const handlePhaseChange = (phaseId) => {
    setActivePhase(phaseId);
    if (phaseId === 'phase1') {
      switchRole('entrepreneur');
      setEntrepreneurSubTab('feasibility');
    } else if (phaseId === 'phase2' || phaseId === 'phase3') {
      switchRole('bank');
    } else if (phaseId === 'phase4') {
      switchRole('admin');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white">
      <div>
        <Navbar
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenGovtSchemes={() => setIsGovtSchemesOpen(true)}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 space-y-6">
          
          {/* Top Operational Workflow Phase Navigator */}
          <AirtableWorkflowNav activePhase={activePhase} onPhaseChange={handlePhaseChange} />

          {/* Sub-navigation for Entrepreneur Role: Feasibility vs Peer Pool */}
          {currentRole === 'entrepreneur' && (
            <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-sm w-fit">
              <button
                onClick={() => {
                  setEntrepreneurSubTab('feasibility');
                  setActivePhase('phase1');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                  entrepreneurSubTab === 'feasibility'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Calculator className="w-4 h-4 text-emerald-300" />
                <span>{t('subTabFeasibility')}</span>
              </button>

              <button
                onClick={() => setEntrepreneurSubTab('peerPool')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                  entrepreneurSubTab === 'peerPool'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <HeartHandshake className="w-4 h-4 text-teal-300" />
                <span>{t('subTabPeerPool')}</span>
              </button>
            </div>
          )}

          {/* Render Active View based on Selected Role */}
          {currentRole === 'entrepreneur' && (entrepreneurSubTab === 'feasibility' ? <EntrepreneurPortal /> : <PeerPooling />)}
          {currentRole === 'bank' && <BankPortal />}
          {currentRole === 'admin' && <AdminPortal />}

        </main>
      </div>

      {/* Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <GovtSchemesModal isOpen={isGovtSchemesOpen} onClose={() => setIsGovtSchemesOpen(false)} />

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
