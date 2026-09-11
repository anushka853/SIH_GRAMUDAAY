import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  MessageSquarePlus,
  MessageCircle,
  FileBarChart2,
  HeartHandshake,
  Gift,
  Building2,
  ShieldCheck,
  User,
  Globe,
  Settings,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Award,
  Sparkles,
  LogOut
} from 'lucide-react';

export default function ChatGPTStyleSidebar({
  activeView,
  onSelectView,
  onOpenLogin,
  onOpenGovtSchemes,
  isCollapsed,
  onToggleCollapse
}) {
  const { currentRole, currentUser, switchRole } = useAuth();
  const { lang, changeLanguage, t, languages } = useLanguage();

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-white text-slate-900 border-r border-slate-200/90 transition-all duration-300 flex flex-col justify-between shadow-lg ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Header: Logo & New Chat Button */}
      <div className="p-3.5 space-y-3 border-b border-slate-100 bg-slate-50/50">
        
        {/* Logo & Toggle Collapse Button */}
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-600/20">
                <Landmark className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight text-slate-900 flex items-center gap-1">
                  GramUday AI
                </h1>
                <span className="text-[9px] text-amber-800 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200 block">
                  Govt Approved SCA/CA
                </span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-8 h-8 mx-auto rounded-xl bg-emerald-600 flex items-center justify-center shadow-md">
              <Landmark className="w-4 h-4 text-white" />
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={() => {
            switchRole('entrepreneur');
            onSelectView('entrepreneur-chat');
          }}
          className={`w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
            isCollapsed ? 'px-0' : ''
          }`}
          title="New AI Rural Chat"
        >
          <MessageSquarePlus className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>{t('chatgptNewChat')}</span>}
        </button>
      </div>

      {/* Main Navigation Items / ChatGPT Plugins */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        
        {/* Section 1: Entrepreneur AI Assistant & Reports */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block">
              Rural Enterprise AI
            </span>
          )}

          {/* AI Rural Chat Assistant */}
          <button
            onClick={() => {
              switchRole('entrepreneur');
              onSelectView('entrepreneur-chat');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'entrepreneur-chat' && currentRole === 'entrepreneur'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="AI Rural Chat Assistant"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            {!isCollapsed && <span className="truncate">AI Chat Assistant</span>}
          </button>

          {/* My Generated Reports */}
          <button
            onClick={() => {
              switchRole('entrepreneur');
              onSelectView('entrepreneur-reports');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'entrepreneur-reports' && currentRole === 'entrepreneur'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title={t('chatgptSidebarReports')}
          >
            <FileBarChart2 className="w-4 h-4 text-cyan-600 shrink-0" />
            {!isCollapsed && <span className="truncate">{t('chatgptSidebarReports')}</span>}
          </button>

          {/* Peer Investment Pools */}
          <button
            onClick={() => {
              switchRole('entrepreneur');
              onSelectView('peer-pool');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'peer-pool'
                ? 'bg-teal-50 text-teal-700 border border-teal-200 shadow-xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title={t('chatgptSidebarPeerPool')}
          >
            <HeartHandshake className="w-4 h-4 text-teal-600 shrink-0" />
            {!isCollapsed && <span className="truncate">{t('chatgptSidebarPeerPool')}</span>}
          </button>

          {/* Government Schemes Directory Plugin */}
          <button
            onClick={onOpenGovtSchemes}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-purple-700 hover:bg-purple-50 hover:text-purple-900 transition-all cursor-pointer"
            title={t('chatgptSidebarSchemes')}
          >
            <Gift className="w-4 h-4 text-purple-600 shrink-0" />
            {!isCollapsed && <span className="truncate">{t('chatgptSidebarSchemes')}</span>}
          </button>
        </div>

        {/* Section 2: Roles & Institutional Desks */}
        <div className="space-y-1 border-t border-slate-100 pt-4">
          {!isCollapsed && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block">
              Institutional Portals
            </span>
          )}

          {/* Bank Officer Portal */}
          <button
            onClick={() => {
              switchRole('bank');
              onSelectView('bank-portal');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentRole === 'bank'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                : 'text-slate-700 hover:bg-blue-50/60 hover:text-blue-700'
            }`}
            title={t('chatgptSidebarBankPortal')}
          >
            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
            {!isCollapsed && <span className="truncate">{t('chatgptSidebarBankPortal')}</span>}
          </button>

          {/* System Admin Dashboard */}
          <button
            onClick={() => {
              switchRole('admin');
              onSelectView('admin-portal');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentRole === 'admin'
                ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-xs'
                : 'text-slate-700 hover:bg-amber-50/60 hover:text-amber-800'
            }`}
            title={t('chatgptSidebarAdminPortal')}
          >
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            {!isCollapsed && <span className="truncate">{t('chatgptSidebarAdminPortal')}</span>}
          </button>
        </div>

      </div>

      {/* Footer Controls: Language Dropdown & User Profile */}
      <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/70">
        
        {/* Language Selector */}
        {!isCollapsed ? (
          <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-bold text-slate-700">Language:</span>
            </div>
            <select
              value={lang}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-slate-50 text-xs font-extrabold text-emerald-700 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="w-full py-2 flex items-center justify-center text-slate-500 hover:text-slate-800"
            title="Language & Profile"
          >
            <Globe className="w-4 h-4 text-emerald-600" />
          </button>
        )}

        {/* User Account / Login Button */}
        <button
          onClick={onOpenLogin}
          className="w-full p-2 rounded-xl bg-white hover:bg-slate-100 transition-all flex items-center justify-between text-left cursor-pointer border border-slate-200 shadow-xs"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200">
              <User className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="text-xs font-extrabold text-slate-900 block truncate">
                  {currentUser?.name || 'Guest Entrepreneur'}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold block truncate capitalize">
                  Role: {currentRole}
                </span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <span className="text-[10px] text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              Switch
            </span>
          )}
        </button>
      </div>

    </aside>
  );
}
