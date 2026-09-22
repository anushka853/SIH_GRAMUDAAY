import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Landmark,
  User,
  Building2,
  ShieldCheck,
  LogOut,
  Mic2,
  Sparkles,
} from 'lucide-react';
import {
  getNavForRole,
  resolvePageFromNavId,
  getActiveNavId,
  getDefaultNavId,
} from '../config/navConfig';

/* ================================================================
   CONSTANTS
   ================================================================ */
const COLLAPSED_WIDTH = 72;
const EXPANDED_WIDTH  = 264;
const LS_KEY = 'gramudaay_sidebar_collapsed';

// roleLabels will be translated via t('roles.roleName')
const roleColors = {
  entrepreneur: { bg: '#DCFCE7', color: '#059669' },
  bank:         { bg: '#DBEAFE', color: '#2563EB' },
  admin:        { bg: '#FEF3C7', color: '#D97706' },
};

/* ================================================================
   SUB-COMPONENTS
   ================================================================ */

/** Single nav item button */
function SidebarItem({ item, isActive, isCollapsed, onClick, t }) {
  const Icon = item.icon;
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  return (
    <div className="relative">
      <button
        onClick={() => onClick(item.id)}
        aria-label={item.label}
        aria-current={isActive ? 'page' : undefined}
        onMouseEnter={() => isCollapsed && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => isCollapsed && setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="w-full flex items-center gap-3 rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 group"
        style={{
          height: '40px',
          padding: isCollapsed ? '0 12px' : '0 10px',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          background: isActive ? 'var(--bg-elevated)' : 'transparent',
          color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
          fontWeight: isActive ? 600 : 400,
          position: 'relative',
        }}
        onMouseEnterCapture={(e) => {
          if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)';
        }}
        onMouseLeaveCapture={(e) => {
          if (!isActive) e.currentTarget.style.background = 'transparent';
        }}
      >
        {/* Active indicator bar */}
        {isActive && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
            style={{
              width: '3px',
              height: '20px',
              background: 'var(--accent)',
            }}
            aria-hidden="true"
          />
        )}

        <Icon
          className="flex-shrink-0"
          style={{
            width: '18px',
            height: '18px',
            color: isActive ? 'var(--accent)' : 'inherit',
          }}
          aria-hidden="true"
        />

        {!isCollapsed && (
          <span className="text-sm flex-1 text-left whitespace-normal leading-tight">{item.labelKey ? t(item.labelKey) : item.label}</span>
        )}

        {/* Pending badge */}
        {!isCollapsed && item.badge === 'pending' && (
          <span
            className="text-xs font-700 px-1.5 py-0.5 rounded-full"
            style={{ background: 'var(--warning-light)', color: 'var(--warning)', fontWeight: 700 }}
          >
            !
          </span>
        )}
      </button>

      {/* Collapsed tooltip */}
      {isCollapsed && showTooltip && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap z-50 pointer-events-none"
          style={{
            background: 'var(--text-primary)',
            color: 'white',
            boxShadow: 'var(--shadow-md)',
            fontSize: '0.8125rem',
          }}
        >
          {item.labelKey ? t(item.labelKey) : item.label}
          <span
            aria-hidden="true"
            className="absolute right-full top-1/2 -translate-y-1/2"
            style={{
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderRight: '5px solid var(--text-primary)',
              width: 0,
              height: 0,
            }}
          />
        </div>
      )}
    </div>
  );
}

/** Section group with label */
function SidebarSection({ section, items, activeNavId, isCollapsed, onItemClick, t }) {
  return (
    <div className="mb-1">
      {/* Section label */}
      {!isCollapsed && (
        <div
          className="px-3 pt-4 pb-1.5"
          style={{
            fontSize: '0.625rem',
            fontWeight: 700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          {section}
        </div>
      )}
      {isCollapsed && (
        <div
          className="mx-auto my-3"
          style={{ width: '24px', height: '1px', background: 'var(--border-default)' }}
          aria-hidden="true"
        />
      )}

      <div className="space-y-0.5 px-2">
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={activeNavId === item.id}
            isCollapsed={isCollapsed}
            onClick={onItemClick}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}

/** Fintech Advisor CTA — only for entrepreneurs */
function AdvisorCTA({ isCollapsed, onVoiceAdvisor, t }) {
  if (isCollapsed) return (
    <div className="mx-2 mb-3">
      <button
        onClick={onVoiceAdvisor}
        aria-label="Ask the GramUday voice advisor"
        className="w-full flex items-center justify-center p-2 rounded-lg transition-all focus:outline-none focus-visible:ring-2"
        style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
      >
        <Mic2 style={{ width: '18px', height: '18px' }} aria-hidden="true" />
      </button>
    </div>
  );
  return (
    <div className="mx-3 mb-3">
      <button
        onClick={onVoiceAdvisor}
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-600 transition-all focus:outline-none focus-visible:ring-2"
        style={{
          background: 'linear-gradient(135deg, #F0FDF4 0%, #EDE9FE 100%)',
          color: 'var(--text-primary)',
          border: '1px solid #D1FAE5',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
      >
        <Sparkles style={{ width: '16px', height: '16px', color: 'var(--accent)' }} aria-hidden="true" />
        <span className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">{t('voice.askGramUday')}</span>
        <Mic2 style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} aria-hidden="true" />
      </button>
    </div>
  );
}

/** User profile footer */
function SidebarFooter({ isCollapsed, onOpenLogin, onSwitchRole }) {
  const { currentUser, currentRole, switchRole } = useAuth();
  const { t } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  const roleColor = roleColors[currentRole] || roleColors.entrepreneur;
  const initial = (currentUser?.name || 'U').charAt(0).toUpperCase();

  return (
    <div
      className="px-3 py-3 relative"
      ref={menuRef}
      style={{ borderTop: '1px solid var(--border-subtle)' }}
    >
      {/* User row */}
      <button
        onClick={() => setShowMenu((v) => !v)}
        aria-label="Open user menu"
        aria-expanded={showMenu}
        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2"
        style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <div
          className="rounded-full flex items-center justify-center flex-shrink-0 text-sm font-700"
          style={{
            width: '30px',
            height: '30px',
            background: roleColor.bg,
            color: roleColor.color,
            fontWeight: 700,
            border: `1.5px solid ${roleColor.color}40`,
          }}
          aria-hidden="true"
        >
          {initial}
        </div>
        {!isCollapsed && (
          <>
            <div className="flex-1 min-w-0 text-left">
              <div
                className="text-sm truncate"
                style={{ color: 'var(--text-primary)', fontWeight: 600 }}
              >
                {currentUser?.name || 'User'}
              </div>
              <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                {t(`roles.${currentRole}`)}
              </div>
            </div>
            <ChevronDown
              className="flex-shrink-0"
              style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }}
              aria-hidden="true"
            />
          </>
        )}
      </button>

      {/* Popup menu */}
      {showMenu && (
        <div
          role="menu"
          aria-label="User options"
          className="absolute bottom-full left-3 right-3 mb-2 rounded-xl overflow-hidden z-50"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Role switcher */}
          <div className="px-3 pt-3 pb-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {t('common.switchRole')}
            </p>
            {Object.keys(roleColors).map((role) => {
              const rc = roleColors[role];
              const label = t(`roles.${role}`);
              return (
                <button
                  key={role}
                  role="menuitem"
                  onClick={() => { switchRole(role); setShowMenu(false); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 mb-0.5 transition-colors"
                  style={{
                    color: currentRole === role ? rc.color : 'var(--text-secondary)',
                    background: currentRole === role ? rc.bg : 'transparent',
                    fontWeight: currentRole === role ? 600 : 400,
                  }}
                  onMouseEnter={(e) => { if (currentRole !== role) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = currentRole === role ? rc.bg : 'transparent'; }}
                >
                  {role === 'entrepreneur' ? <User style={{ width: '14px', height: '14px' }} aria-hidden="true" /> :
                   role === 'bank' ? <Building2 style={{ width: '14px', height: '14px' }} aria-hidden="true" /> :
                   <ShieldCheck style={{ width: '14px', height: '14px' }} aria-hidden="true" />}
                  {label}
                  {currentRole === role && (
                    <span className="ml-auto text-xs">✓</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="py-1.5">
            <button
              role="menuitem"
              onClick={() => { onOpenLogin(); setShowMenu(false); }}
              className="w-full px-4 py-2.5 text-sm text-left transition-colors flex items-center gap-2"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <User style={{ width: '15px', height: '15px' }} aria-hidden="true" />
              {t('common.profileSettings')}
            </button>
            <button
              role="menuitem"
              onClick={() => { switchRole('entrepreneur'); setShowMenu(false); }}
              className="w-full px-4 py-2.5 text-sm text-left transition-colors flex items-center gap-2"
              style={{ color: 'var(--danger)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--danger-light)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <LogOut style={{ width: '15px', height: '15px' }} aria-hidden="true" />
              {t('common.signOut')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   MAIN SIDEBAR COMPONENT
   ================================================================ */
export default function Sidebar({
  activePage,
  onNavigate,
  activeNavId,
  onNavItemClick,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
  onOpenLogin,
}) {
  const { currentRole } = useAuth();
  const { speak, t } = useLanguage();
  const navConfig = getNavForRole(currentRole);

  // Close mobile drawer on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && isMobileOpen) onMobileClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isMobileOpen, onMobileClose]);

  const handleVoiceAdvisor = () => {
    speak('Welcome to GramUday Advisor. Ask me about your business idea, loan options, or market opportunities in your area.');
    onNavItemClick('voice-advisor');
  };

  const sidebarContent = (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: '#FFFFFF',
        borderRight: '1px solid var(--border-default)',
        width: isCollapsed ? `${COLLAPSED_WIDTH}px` : `${EXPANDED_WIDTH}px`,
        transition: 'width 200ms ease',
      }}
    >
      {/* ── Logo + Collapse Toggle ── */}
      <div
        className="flex items-center px-3 flex-shrink-0"
        style={{
          height: '60px',
          borderBottom: '1px solid var(--border-subtle)',
          justifyContent: isCollapsed ? 'center' : 'space-between',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => onNavItemClick(getDefaultNavId(currentRole))}
          aria-label="GramUday AI home"
          className="flex items-center gap-2.5 min-w-0 focus:outline-none focus-visible:ring-2 rounded-lg"
        >
          <div
            className="rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ width: '32px', height: '32px', background: 'var(--text-primary)' }}
          >
            <Landmark style={{ width: '16px', height: '16px', color: 'white' }} aria-hidden="true" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span
                className="text-sm truncate leading-tight"
                style={{ color: 'var(--text-primary)', fontWeight: 700, letterSpacing: '-0.01em' }}
              >
                GramUday AI
              </span>
              <span className="text-[9px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded w-max mt-0.5">
                DEMO ENVIRONMENT
              </span>
            </div>
          )}
        </button>

        {/* Collapse button (desktop only) */}
        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
            className="hidden md:flex items-center justify-center rounded-lg transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2"
            style={{ width: '28px', height: '28px', color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <ChevronLeft style={{ width: '16px', height: '16px' }} aria-hidden="true" />
          </button>
        )}
        {isCollapsed && (
          <button
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            className="hidden md:flex items-center justify-center rounded-lg transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2"
            style={{ width: '28px', height: '28px', color: 'var(--text-muted)', marginTop: '4px' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <ChevronRight style={{ width: '16px', height: '16px' }} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* ── Nav Sections ── */}
      <nav
        aria-label="Main navigation"
        className="flex-1 overflow-y-auto py-1"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--border-default) transparent' }}
      >
        {navConfig.map((group) => (
          <SidebarSection
            key={group.section}
            section={group.section}
            items={group.items}
            activeNavId={activeNavId}
            isCollapsed={isCollapsed}
            onItemClick={onNavItemClick}
            t={t}
          />
        ))}
        {/* Bottom padding inside scroll area */}
        <div style={{ height: '12px' }} />
      </nav>

      {/* ── Advisor CTA (entrepreneurs only) ── */}
      {currentRole === 'entrepreneur' && (
        <AdvisorCTA isCollapsed={isCollapsed} onVoiceAdvisor={handleVoiceAdvisor} t={t} />
      )}

      {/* ── User Profile Footer ── */}
      <SidebarFooter
        isCollapsed={isCollapsed}
        onOpenLogin={onOpenLogin}
        onSwitchRole={() => {}}
      />
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        aria-label="Sidebar navigation"
        className="hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0 overflow-hidden"
        style={{
          width: isCollapsed ? `${COLLAPSED_WIDTH}px` : `${EXPANDED_WIDTH}px`,
          transition: 'width 200ms ease',
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)' }}
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        aria-label="Mobile sidebar navigation"
        aria-hidden={!isMobileOpen}
        className="fixed top-0 left-0 h-full z-50 md:hidden"
        style={{
          width: `${EXPANDED_WIDTH}px`,
          transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 220ms ease',
          boxShadow: isMobileOpen ? 'var(--shadow-lg)' : 'none',
        }}
      >
        {/* Force expanded in mobile */}
        <div
          className="flex flex-col h-full overflow-hidden"
          style={{ background: '#FFFFFF', borderRight: '1px solid var(--border-default)' }}
        >
          {/* Mobile header with close */}
          <div
            className="flex items-center justify-between px-4 flex-shrink-0"
            style={{ height: '60px', borderBottom: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="rounded-xl flex items-center justify-center"
                style={{ width: '32px', height: '32px', background: 'var(--text-primary)' }}
              >
                <Landmark style={{ width: '16px', height: '16px', color: 'white' }} />
              </div>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9375rem' }}>
                GramUday AI
              </span>
            </div>
            <button
              onClick={onMobileClose}
              aria-label="Close navigation menu"
              className="rounded-lg transition-colors focus:outline-none focus-visible:ring-2 flex items-center justify-center"
              style={{ width: '32px', height: '32px', color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              ✕
            </button>
          </div>

          {/* Nav */}
          <nav
            aria-label="Mobile navigation"
            className="flex-1 overflow-y-auto py-1"
            style={{ scrollbarWidth: 'thin' }}
          >
            {navConfig.map((group) => (
              <SidebarSection
                key={group.section}
                section={group.section}
                items={group.items}
                activeNavId={activeNavId}
                isCollapsed={false}
                onItemClick={(id) => { onNavItemClick(id); onMobileClose(); }}
                t={t}
              />
            ))}
            <div style={{ height: '12px' }} />
          </nav>

          {/* Advisor CTA */}
          {currentRole === 'entrepreneur' && (
            <AdvisorCTA
              isCollapsed={false}
              onVoiceAdvisor={() => { handleVoiceAdvisor(); onMobileClose(); }}
              t={t}
            />
          )}

          {/* Footer */}
          <SidebarFooter
            isCollapsed={false}
            onOpenLogin={() => { onOpenLogin(); onMobileClose(); }}
            onSwitchRole={() => {}}
          />
        </div>
      </aside>
    </>
  );
}
