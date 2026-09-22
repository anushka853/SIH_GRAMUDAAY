import React, { useState, useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ChatWorkspace from './components/ChatWorkspace';
import LoginModal from './components/LoginModal';
import EntrepreneurPortal from './pages/EntrepreneurPortal';
import BankPortal from './pages/BankPortal';
import AdminPortal from './pages/AdminPortal';
import PeerPooling from './pages/PeerPooling';
import { resolvePageFromNavId, getNavForRole, getActiveNavId, getDefaultNavId } from './config/navConfig';

const LS_COLLAPSED = 'gramudaay_sidebar_collapsed';

function MainApp() {
  const { currentRole } = useAuth();

  // ── UI state ──────────────────────────────────────────────
  const [hasStarted, setHasStarted]           = useState(false);
  const [isLoginOpen, setIsLoginOpen]         = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sidebar collapse — persisted in localStorage
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try { return localStorage.getItem(LS_COLLAPSED) === 'true'; }
    catch { return false; }
  });

  // Routing — activePage drives which component renders
  // activeNavId tracks what's highlighted in the sidebar
  const [activePage, setActivePage]   = useState(() => getDefaultNavId(currentRole));
  const [activeNavId, setActiveNavId] = useState(() => getDefaultNavId(currentRole));

  // Sync collapse preference to localStorage
  useEffect(() => {
    try { localStorage.setItem(LS_COLLAPSED, String(isSidebarCollapsed)); }
    catch { /* ignore */ }
  }, [isSidebarCollapsed]);

  // Reset active nav when role changes (synchronous render-time update)
  const [prevRole, setPrevRole] = useState(currentRole);
  if (currentRole !== prevRole) {
    setPrevRole(currentRole);
    const defaultId = getDefaultNavId(currentRole);
    setActiveNavId(defaultId);
    setActivePage(resolvePageFromNavId(defaultId, currentRole).page);
  }

  // ── Handlers ──────────────────────────────────────────────
  const handleNavItemClick = (navId) => {
    setActiveNavId(navId);

    // Special actions that don't navigate
    if (navId === 'language') {
      alert('Language Settings (Placeholder)');
      return;
    }
    if (navId === 'profile') {
      setIsLoginOpen(true);
      return;
    }
    if (navId === 'help') {
      alert('Help & Support (Placeholder)');
      return;
    }

    const { page } = resolvePageFromNavId(navId, currentRole);
    setActivePage(page);
  };

  // Legacy compatibility — some sub-components may call onNavigate(pageId) directly
  const handleNavigate = (page) => {
    setActivePage(page);
    const newNavId = getActiveNavId(page, currentRole);
    setActiveNavId(newNavId);
  };

  // ── Render the correct page ───────────────────────────────
  const renderPage = () => {
    switch (activePage) {
      // ChatWorkspace handles Dashboards & Insights
      case 'dashboard':
      case 'credit-dashboard':
      case 'national-dashboard':
      case 'market-intel':
      case 'market-intelligence':
      case 'market-activity':
      case 'regional-metrics':
      case 'voice-advisor':
      case 'ai-counter':
      case 'risk-signals':
      case 'feasibility-reports':
      case 'enterprise-categories':
        return <ChatWorkspace />;
        
      // Entrepreneur Portal 
      case 'feasibility':
      case 'assessment':
      case 'financial-structuring':
      case 'loan-recommendation':
      case 'repayment-plan':
      case 'my-applications':
      case 'funding-status':
      case 'enterprise':
      case 'schemes':
        return <EntrepreneurPortal activePage={activePage} />;
        
      // Bank Portal
      case 'bank-portal':
      case 'bank-scheme':
      case 'pending-apps':
      case 'under-review':
      case 'approved':
      case 'rejected':
      case 'loan-portfolio':
      case 'regional-activity':
      case 'documents':
        return <BankPortal activePage={activePage} />;
        
      // Admin Portal
      case 'admin-portal':
      case 'funding-dist':
      case 'scheme-utilization':
      case 'active-users':
      case 'system-alerts':
      case 'exports':
      case 'analytics':
        return <AdminPortal activePage={activePage} />;
        
      // Peer Pooling
      case 'peer-pooling':
      case 'peer-investment':
      case 'funding-opps':
      case 'alerts':
        return <PeerPooling activePage={activePage} />;
        
      default:
        // fallback based on role
        if (currentRole === 'bank') return <BankPortal activePage={activePage} />;
        if (currentRole === 'admin') return <AdminPortal activePage={activePage} />;
        return <ChatWorkspace />;
    }
  };

  // ── Landing page ──────────────────────────────────────────
  if (!hasStarted) {
    return <LandingPage onStart={() => setHasStarted(true)} />;
  }

  const navConfig = getNavForRole(currentRole);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--bg-page)' }}
    >
      {/* ── Sidebar ── */}
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        activeNavId={activeNavId}
        onNavItemClick={handleNavItemClick}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((v) => !v)}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar — mobile + desktop */}
        <Topbar
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onOpenLogin={() => setIsLoginOpen(true)}
          activeNavId={activeNavId}
          navConfig={navConfig}
        />

        {/* Page content */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto scrollbar-thin"
          aria-label="Main content"
        >
          <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto w-full">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* ── Login / Profile Modal ── */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
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
