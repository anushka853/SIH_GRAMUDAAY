import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Building2, User, Landmark, ShieldCheck, Volume2, VolumeX, Globe, ChevronDown, Award, Gift, LogOut } from 'lucide-react';

export default function Navbar({ onOpenLogin, onOpenGovtSchemes }) {
  const { currentRole, currentUser } = useAuth();
  const { lang, changeLanguage, t, languages, speak, stopAudio, isSpeaking } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white/95 border-b border-slate-200/90 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 min-h-[72px]">
          
          {/* Logo & Government Emblem Branding */}
          <div className="flex items-center space-x-3 cursor-pointer shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  {t('appTitle')}
                </h1>
                <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                  <Award className="w-3 h-3 text-amber-600" /> {t('govtApprovedBadge')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                {t('appSubTitle')}
              </p>
            </div>
          </div>

          {/* Active Role Portal Badge (Strict Role Isolation) */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 shrink-0">
            {currentRole === 'entrepreneur' && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-600 text-white shadow-xs">
                <User className="w-3.5 h-3.5" />
                <span>{t('roleEntrepreneur')}</span>
              </span>
            )}

            {currentRole === 'bank' && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-blue-600 text-white shadow-xs">
                <Building2 className="w-3.5 h-3.5" />
                <span>{t('roleBank')}</span>
              </span>
            )}

            {currentRole === 'admin' && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-amber-600 text-white shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('roleAdmin')}</span>
              </span>
            )}

            {/* Public Government Schemes Explorer Button (Accessible to Everyone) */}
            <button
              onClick={onOpenGovtSchemes}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-all shrink-0 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-purple-600" />
              <span>{t('govtSchemesBtn')}</span>
            </button>
          </div>

          {/* Controls: Audio Assistant, Language Selector & Profile */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Audio Reader Speaker Button */}
            <button
              onClick={() => {
                if (isSpeaking) {
                  stopAudio();
                } else {
                  speak(`Welcome to GramUday AI. You are viewing the ${t('appSubTitle')}. Select your role or fill in your details.`);
                }
              }}
              title={isSpeaking ? t('stopVoice') : t('speakReport')}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-extrabold cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-500 hover:text-emerald-700'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-600" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
              <span className="hidden sm:inline">{isSpeaking ? t('stopVoice') : t('speakReport')}</span>
            </button>

            {/* Language Dropdown Selector */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 hover:border-slate-300 px-3 py-2 rounded-xl cursor-pointer">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-extrabold text-slate-800 uppercase">
                  {languages.find((l) => l.code === lang)?.nativeName || 'EN'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </div>

              {/* Dropdown Options */}
              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden hidden group-hover:block z-50">
                <div className="py-1">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => changeLanguage(l.code)}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                        lang === l.code ? 'text-emerald-700 font-extrabold bg-emerald-50' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.nativeName}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{l.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Account Profile / Switch Role Button */}
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-sm transition-all shrink-0 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{currentUser?.name || t('signUpLogIn')}</span>
              <span className="text-[10px] opacity-80 underline ml-1">{t('switchPortal')}</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
