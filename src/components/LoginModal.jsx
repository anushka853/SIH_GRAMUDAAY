import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import VoiceButton from './VoiceButton';
import { REGIONS_PRESETS } from '../utils/mockData';
import { X, User, Building2, ShieldCheck, ArrowRight, UserPlus, LogIn, Sparkles, MapPin, Phone, Globe, CheckCircle2 } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { switchRole, currentUser } = useAuth();
  const { lang, changeLanguage, t, languages } = useLanguage();

  const [authMode, setAuthMode] = useState('signup'); // 'signup' | 'login'
  const [selectedRole, setSelectedRole] = useState('entrepreneur'); // 'entrepreneur' | 'bank' | 'admin'
  
  // User Form fields
  const [name, setName] = useState(currentUser?.name || 'Ramesh Patel');
  const [age, setAge] = useState(currentUser?.age || 34);
  const [contact, setContact] = useState(currentUser?.contact || '+91 98765 43210');
  const [address, setAddress] = useState(currentUser?.address || 'At Post Sualkuchi, Kamrup Rural');
  const [selectedRegionIdx, setSelectedRegionIdx] = useState(0);

  // Bank & Admin credentials
  const [staffId, setStaffId] = useState('BANK-ANAND-402');
  const [adminKey, setAdminKey] = useState('ADM-GOVT-SCA-99');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const region = REGIONS_PRESETS[selectedRegionIdx] || REGIONS_PRESETS[0];
    const userDetails = {
      name: selectedRole === 'entrepreneur' ? name : selectedRole === 'bank' ? `Officer (${staffId})` : 'System Administrator',
      age: Number(age),
      contact,
      address,
      staffId,
      adminKey,
      location: { villageName: region.village, blockName: region.block, districtName: region.district, stateName: region.state }
    };
    switchRole(selectedRole, userDetails);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-slate-900 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <span className="text-[11px] uppercase font-extrabold tracking-wider px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            GramUday AI Access Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
            {t('authPortalTitle')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t('authPortalSub')}
          </p>
        </div>

        {/* Dynamic Form Content */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Main User Input Fields */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('fullNameLabel')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter full name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
              <VoiceButton onTranscript={(txt) => setName(txt)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('ageLabel')}</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('contactLabel')}</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('addressLabel')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
              <VoiceButton onTranscript={(txt) => setAddress(txt)} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Select Village / Region
            </label>
            <select
              value={selectedRegionIdx}
              onChange={(e) => setSelectedRegionIdx(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
            >
              {REGIONS_PRESETS.map((r, idx) => (
                <option key={idx} value={idx}>
                  {r.village}, {r.block} ({r.district}, {r.state})
                </option>
              ))}
            </select>
          </div>

          {/* LOWER SECTION: Mode Switcher, Role Selection & Multilingual Selector */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            
            {/* 1. Multilingual Sign Up vs Log In Mode Switcher */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-900">
                1. Access Mode / प्रवेश प्रकार:
              </label>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/60'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <UserPlus className="w-4 h-4 text-emerald-600" />
                  <span>{t('multilingualSignUp')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LogIn className="w-4 h-4 text-blue-600" />
                  <span>{t('secureLogIn')}</span>
                </button>
              </div>
            </div>

            {/* 2. Account Role Selection (User / Bank Officer / System Admin) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>2. Select Account Role / खाता भूमिका चुनें:</span>
                </label>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                  selectedRole === 'entrepreneur' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  selectedRole === 'bank' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {selectedRole === 'entrepreneur' ? 'User (Entrepreneur)' : selectedRole === 'bank' ? 'Bank Officer' : 'System Admin'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200/90">
                <button
                  type="button"
                  onClick={() => setSelectedRole('entrepreneur')}
                  className={`py-3 px-2 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    selectedRole === 'entrepreneur'
                      ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="text-[11px] leading-tight text-center">{t('roleEntrepreneur')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('bank')}
                  className={`py-3 px-2 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    selectedRole === 'bank'
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-[11px] leading-tight text-center">{t('roleBank')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`py-3 px-2 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-500/20'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[11px] leading-tight text-center">{t('roleAdmin')}</span>
                </button>
              </div>
            </div>

            {/* Bank Employee Credentials Field */}
            {selectedRole === 'bank' && (
              <div className="space-y-1.5 bg-blue-50/70 p-3 rounded-2xl border border-blue-200">
                <label className="block text-xs font-bold text-slate-700">{t('bankStaffIdLabel')}</label>
                <input
                  type="text"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            )}

            {/* System Admin Credentials Field */}
            {selectedRole === 'admin' && (
              <div className="space-y-1.5 bg-amber-50/70 p-3 rounded-2xl border border-amber-200">
                <label className="block text-xs font-bold text-slate-700">{t('adminKeyLabel')}</label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            )}

            {/* 3. Multilingual Language Bar placed in lower Sign-Up section */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/90">
              <div className="flex items-center gap-1.5 mb-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-700">3. Multilingual Language / भाषा चुनें:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => changeLanguage(l.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      lang === l.code
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {l.nativeName}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            <span>{authMode === 'signup' ? t('completeSignUpBtn') : t('logInPortalBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
