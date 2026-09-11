import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Building2, User, Landmark, ShieldCheck, Volume2, VolumeX, Globe, ChevronDown, Award } from 'lucide-react';

export default function Navbar({ onOpenLogin }) {
  const { currentRole, switchRole, currentUser } = useAuth();
  const { lang, changeLanguage, t, languages, speak, stopAudio, isSpeaking } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Government Emblem Branding - Airtable Aesthetic */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => switchRole('entrepreneur')}>
            <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white dark:bg-emerald-600 flex items-center justify-center shadow-md">
              <Landmark className="w-6 h-6 text-emerald-400 dark:text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                  {t('appTitle')}
                </h1>
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-500" /> Govt Approved (SCA/CA)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                {t('appSubTitle')}
              </p>
            </div>
          </div>

          {/* Role Navigation Switcher Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <button
              onClick={() => switchRole('entrepreneur')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                currentRole === 'entrepreneur'
                  ? 'bg-slate-900 text-white dark:bg-emerald-600 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{t('roleEntrepreneur')}</span>
            </button>

            <button
              onClick={() => switchRole('bank')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                currentRole === 'bank'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{t('roleBank')}</span>
            </button>

            <button
              onClick={() => switchRole('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                currentRole === 'admin'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('roleAdmin')}</span>
            </button>
          </nav>

          {/* Controls: Audio Assistant, Language Selector & Profile */}
          <div className="flex items-center gap-3">
            
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
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                isSpeaking
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/50 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-500" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
              <span className="hidden md:inline">{isSpeaking ? 'Stop Voice' : 'Audio Guide'}</span>
            </button>

            {/* Language Dropdown Selector */}
            <div className="relative group">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl cursor-pointer">
                <Globe className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase">
                  {languages.find((l) => l.code === lang)?.nativeName || 'EN'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Dropdown Options */}
              <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden hidden group-hover:block z-50">
                <div className="py-1">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => changeLanguage(l.code)}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        lang === l.code ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{l.nativeName}</span>
                      <span className="text-[10px] text-slate-400">{l.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Account Profile / Login Button - High Contrast Black Button */}
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-md transition-all"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{currentUser?.name || 'Sign Up / Log In'}</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}

