import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Menu,
  Globe,
  Bell,
  ChevronDown,
  Volume2,
  VolumeX,
  ChevronRight,
  Landmark,
} from 'lucide-react';

/** Build breadcrumbs from active nav item info */
function buildBreadcrumbs(activeNavId, currentRole, allNavConfig, t) {
  if (!activeNavId || !allNavConfig) return [];
  for (const group of allNavConfig) {
    const item = group.items.find((i) => i.id === activeNavId);
    if (item) {
      return [
        { label: item.labelKey ? t(item.labelKey) : item.label, current: true },
      ];
    }
  }
  return [];
}

// Remove unused PAGE_TITLES

export default function Topbar({
  onMenuClick,
  onOpenLogin,
  activeNavId,
  navConfig,
}) {
  const { currentRole, currentUser } = useAuth();
  const { lang, changeLanguage, languages, isSpeaking, stopAudio, speak, t } = useLanguage();

  const [showLang, setShowLang] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const langRef = useRef(null);
  const notifsRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setShowLang(false);
      if (notifsRef.current && !notifsRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const roleColor = { entrepreneur: '#059669', bank: '#2563EB', admin: '#D97706' }[currentRole] || '#6B6B6B';
  const currentLang = languages?.find((l) => l.code === lang);
  const breadcrumbs = buildBreadcrumbs(activeNavId, currentRole, navConfig, t);
  const initial = (currentUser?.name || 'U').charAt(0).toUpperCase();

  const mockNotifications = [
    { id: 1, text: 'Your feasibility report is ready', time: '2m ago', unread: true },
    { id: 2, text: 'New scheme: PM-KUSUM update available', time: '1h ago', unread: true },
    { id: 3, text: 'Application APP-72381 approved', time: '3h ago', unread: false },
  ];
  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  return (
    <>
      {/* ─── MOBILE TOPBAR (hidden on md+) ─── */}
      <header
        className="md:hidden flex items-center justify-between px-4 sticky top-0 z-30 flex-shrink-0"
        style={{
          height: '56px',
          background: '#FFFFFF',
          borderBottom: '1px solid var(--border-default)',
        }}
        role="banner"
      >
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Menu style={{ width: '20px', height: '20px' }} aria-hidden="true" />
          </button>

          <div className="flex items-center gap-2">
            <div
              className="rounded-lg flex items-center justify-center"
              style={{ width: '28px', height: '28px', background: 'var(--text-primary)' }}
            >
              <Landmark style={{ width: '14px', height: '14px', color: 'white' }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
              {t('common.appTitle')}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => isSpeaking ? stopAudio() : speak(t('voice.advisorGreeting'))}
            aria-label={isSpeaking ? 'Stop audio' : 'Start voice advisor'}
            className="p-2 rounded-lg transition-colors"
            style={{ color: isSpeaking ? 'var(--warning)' : 'var(--text-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {isSpeaking
              ? <VolumeX style={{ width: '18px', height: '18px' }} />
              : <Volume2 style={{ width: '18px', height: '18px' }} />}
          </button>

          <button
            onClick={onOpenLogin}
            aria-label="Profile and settings"
            className="rounded-full flex items-center justify-center text-sm font-700 focus:outline-none focus-visible:ring-2"
            style={{
              width: '32px',
              height: '32px',
              background: `${roleColor}20`,
              color: roleColor,
              fontWeight: 700,
              border: `1.5px solid ${roleColor}40`,
            }}
          >
            {initial}
          </button>
        </div>
      </header>

      {/* ─── DESKTOP TOPBAR (hidden on mobile) ─── */}
      <header
        className="hidden md:flex items-center justify-between px-6 flex-shrink-0"
        style={{
          height: '60px',
          background: '#FFFFFF',
          borderBottom: '1px solid var(--border-default)',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
        role="banner"
      >
        {/* Left: Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
          {breadcrumbs.length > 0 ? (
            breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <ChevronRight
                    style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }}
                    aria-hidden="true"
                  />
                )}
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: crumb.current ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: crumb.current ? 600 : 400,
                  }}
                  aria-current={crumb.current ? 'page' : undefined}
                >
                  {crumb.label}
                </span>
              </React.Fragment>
            ))
          ) : (
            <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              {t('common.appTitle')}
            </span>
          )}
        </nav>

        {/* Right: Language + Notifications + Profile */}
        <div className="flex items-center gap-2">
          {/* Audio */}
          <button
            onClick={() => isSpeaking ? stopAudio() : speak(t('voice.advisorGreeting'))}
            aria-label={isSpeaking ? 'Stop audio' : 'Start voice'}
            className="p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2"
            style={{ color: isSpeaking ? 'var(--warning)' : 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {isSpeaking
              ? <VolumeX style={{ width: '17px', height: '17px' }} />
              : <Volume2 style={{ width: '17px', height: '17px' }} />}
          </button>

          {/* Language selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setShowLang((v) => !v)}
              aria-label="Change language"
              aria-expanded={showLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors focus:outline-none focus-visible:ring-2"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Globe style={{ width: '16px', height: '16px' }} aria-hidden="true" />
              <span style={{ fontWeight: 500 }}>{currentLang?.code?.toUpperCase() || 'EN'}</span>
              <ChevronDown style={{ width: '13px', height: '13px' }} aria-hidden="true" />
            </button>

            {showLang && (
              <div
                role="listbox"
                aria-label="Language options"
                className="absolute right-0 mt-1.5 rounded-xl overflow-hidden z-50"
                style={{
                  width: '180px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                {languages?.map((l) => (
                  <button
                    key={l.code}
                    role="option"
                    aria-selected={lang === l.code}
                    onClick={() => { changeLanguage(l.code); setShowLang(false); }}
                    className="w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors"
                    style={{
                      fontSize: '0.875rem',
                      color: lang === l.code ? 'var(--accent)' : 'var(--text-secondary)',
                      background: lang === l.code ? 'var(--accent-light)' : 'transparent',
                      fontWeight: lang === l.code ? 600 : 400,
                    }}
                    onMouseEnter={(e) => { if (lang !== l.code) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = lang === l.code ? 'var(--accent-light)' : 'transparent'; }}
                  >
                    <span>{l.nativeName}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{l.name}</span>
                      {lang === l.code && <span className="text-xs">✓</span>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifsRef}>
            <button
              onClick={() => setShowNotifs((v) => !v)}
              aria-label={`Notifications, ${unreadCount} unread`}
              aria-expanded={showNotifs}
              className="relative p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Bell style={{ width: '17px', height: '17px' }} aria-hidden="true" />
              {unreadCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 right-1.5 rounded-full"
                  style={{
                    width: '7px',
                    height: '7px',
                    background: 'var(--danger)',
                  }}
                />
              )}
            </button>

            {showNotifs && (
              <div
                role="region"
                aria-label="Notifications"
                className="absolute right-0 mt-1.5 rounded-xl overflow-hidden z-50"
                style={{
                  width: '300px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                <div
                  className="px-4 py-3"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                >
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {t('common.notifications')}
                  </span>
                </div>
                {mockNotifications.map((n) => (
                  <div
                    key={n.id}
                    className="px-4 py-3 flex items-start gap-3"
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: n.unread ? '#FAFAF8' : 'transparent',
                    }}
                  >
                    {n.unread && (
                      <span
                        aria-hidden="true"
                        className="mt-1.5 rounded-full flex-shrink-0"
                        style={{ width: '6px', height: '6px', background: 'var(--accent)' }}
                      />
                    )}
                    {!n.unread && <span style={{ width: '6px', flexShrink: 0 }} />}
                    <div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                        {n.text}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {n.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-2.5">
                  <button
                    style={{ fontSize: '0.8125rem', color: 'var(--accent)', fontWeight: 500 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                  >
                    {t('common.viewAll')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile avatar */}
          <button
            onClick={onOpenLogin}
            aria-label="Open profile settings"
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2"
            style={{ border: '1px solid var(--border-default)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div
              className="rounded-full flex items-center justify-center text-xs font-700"
              style={{
                width: '26px',
                height: '26px',
                background: `${roleColor}20`,
                color: roleColor,
                fontWeight: 700,
                border: `1.5px solid ${roleColor}40`,
              }}
              aria-hidden="true"
            >
              {initial}
            </div>
            <span
              className="text-sm"
              style={{ color: 'var(--text-primary)', fontWeight: 500, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {currentUser?.name?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown style={{ width: '13px', height: '13px', color: 'var(--text-muted)' }} aria-hidden="true" />
          </button>
        </div>
      </header>
    </>
  );
}
