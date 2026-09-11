import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import EntrepreneurPortal from './pages/EntrepreneurPortal';
import BankPortal from './pages/BankPortal';
import AdminPortal from './pages/AdminPortal';
import PeerPooling from './pages/PeerPooling';
import { Users, HeartHandshake, Calculator, ShieldCheck, Landmark } from 'lucide-react';

function MainApp() {
  const { currentRole } = useAuth();
  const { t } = useLanguage();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [entrepreneurSubTab, setEntrepreneurSubTab] = useState('feasibility'); // 'feasibility' | 'peerPool'

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      <div>
        <Navbar onOpenLogin={() => setIsLoginOpen(true)} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          
          {/* Sub-navigation for Entrepreneur Role: Feasibility vs Peer Pool */}
          {currentRole === 'entrepreneur' && (
            <div className="flex items-center gap-2 mb-6 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-fit">
              <button
                onClick={() => setEntrepreneurSubTab('feasibility')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  entrepreneurSubTab === 'feasibility'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>Module 1 & 2: Feasibility & Loan Calculator</span>
              </button>

              <button
                onClick={() => setEntrepreneurSubTab('peerPool')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  entrepreneurSubTab === 'peerPool'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Peer Micro-Investment Pool (Bypass Brokers)</span>
              </button>
            </div>
          )}

          {/* Render Active View based on Selected Role */}
          {currentRole === 'entrepreneur' && (entrepreneurSubTab === 'feasibility' ? <EntrepreneurPortal /> : <PeerPooling />)}
          {currentRole === 'bank' && <BankPortal />}
          {currentRole === 'admin' && <AdminPortal />}

        </main>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-400">GramUday AI</span> — National Rural Enterprise & Concessional Credit Advisory System
          </div>
          <div>
            State Channelizing Agencies (SCAs) & Channelizing Agencies (CAs) Guidelines | Micro Finance & Term Loan Routing
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
