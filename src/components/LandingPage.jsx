import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { calculateFinancialScheme, formatINR } from '../utils/financialEngine';
import { INITIAL_BANK_APPLICATIONS, INITIAL_PEER_POOLS } from '../utils/mockData';
import {
  Landmark,
  Globe,
  ChevronDown,
  BriefcaseBusiness,
  TrendingUp,
  BadgeDollarSign,
  FileScan,
  HeartHandshake,
  Mic2,
  AlertTriangle,
  User,
  Building2,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, Tooltip } from 'recharts';

export default function LandingPage({ onStart }) {
  const { switchRole } = useAuth();
  const { lang, changeLanguage, languages, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleRoleSelect = (roleId) => {
    switchRole(roleId);
    onStart();
  };

  // ─── Data Extraction for Capability Panels ───
  const demoApp = INITIAL_BANK_APPLICATIONS[0]; // Ramesh Patel - Counter Proposed
  const demoFeasibility = demoApp.feasibilityReport;
  const demoPool = INITIAL_PEER_POOLS[0]; // Priya Shinde - 50k margin

  // Calculate Loan Advisory demo
  const demoFinancial = demoFeasibility.financial;

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: '#FAF9F6', color: '#1A1A1A' }}>
      
      {/* ─── Minimal Topbar ─── */}
      <header className="flex items-center justify-between px-6 sm:px-10 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#1A1A1A]">
            <Landmark className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight">{t('common.appTitle')}</span>
        </div>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-black/5"
          >
            <Globe className="w-4 h-4 text-[#5B21B6]" />
            <span>{languages.find((l) => l.code === lang)?.nativeName || 'EN'}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showLangMenu && (
            <div className="absolute right-0 mt-1.5 w-44 rounded-xl overflow-hidden z-50 shadow-sm border border-black/5 bg-white">
              <div className="py-1">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { changeLanguage(l.code); setShowLangMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors hover:bg-black/5"
                    style={{ color: lang === l.code ? '#5B21B6' : 'inherit', fontWeight: lang === l.code ? 600 : 400 }}
                  >
                    <span>{l.nativeName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] opacity-60">{l.name}</span>
                      {lang === l.code && <span className="text-xs">✓</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <main className="flex-1 flex flex-col items-center px-6 sm:px-10 pt-20 pb-28">
        
        {/* Eyebrow */}
        <div className="text-[11px] font-bold tracking-[0.1em] uppercase mb-8 text-[#5B21B6]">
          {t('landing.eyebrow')}
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-center leading-[1.1] tracking-[-0.03em] max-w-4xl">
          {t('landing.headlineStart')} <br className="hidden sm:block" />
          <span className="text-[#5B21B6] italic font-medium pr-2">{t('landing.headlineEnd')}</span>
        </h1>

        {/* Sub */}
        <p className="mt-8 text-lg sm:text-xl text-center max-w-2xl leading-relaxed text-[#1A1A1A]/70">
          {t('landing.sub')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-12 mb-28">
          <button
            onClick={() => handleRoleSelect('entrepreneur')}
            className="px-6 py-3.5 rounded-full bg-[#1A1A1A] text-white font-medium text-sm transition-transform hover:scale-105 active:scale-95"
          >
            {t('landing.startAssessment')}
          </button>
          <button
            onClick={() => handleRoleSelect('entrepreneur')}
            className="px-6 py-3.5 rounded-full bg-white border border-black/10 font-medium text-sm transition-colors hover:bg-black/5"
          >
            {t('landing.explorePlatform')}
          </button>
        </div>

        {/* ─── Capability Grid ─── */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Panel 1: Business Feasibility */}
          <div className="bg-white rounded-[24px] border border-black/5 p-8 shadow-[0_4px_40px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-1 group">
            <div className="flex items-center gap-3 mb-4">
              <BriefcaseBusiness className="w-5 h-5 text-[#5B21B6]" />
              <h3 className="text-base font-semibold">{t('landing.businessFeasibility')}</h3>
            </div>
            <p className="text-sm text-[#1A1A1A]/70 leading-relaxed mb-8">
              {t('landing.businessFeasibilityDesc')}
            </p>
            
            {/* Miniature UI */}
            <div className="bg-[#FAF9F6] border border-black/5 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-bold tracking-widest text-[#5B21B6] uppercase">Feasibility</span>
                <span className="bg-[#5B21B6]/10 text-[#5B21B6] text-xs font-bold px-2 py-1 rounded-md">78 / 100</span>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Market demand', val: 'High', w: '85%', color: '#059669' },
                  { label: 'Competition', val: 'Moderate', w: '50%', color: '#D97706' },
                  { label: 'Pricing potential', val: 'Strong', w: '75%', color: '#2563EB' }
                ].map((ind, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-[#1A1A1A]/70">{ind.label}</span>
                      <span style={{ color: ind.color }}>{ind.val}</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: ind.w, backgroundColor: ind.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 text-[11px] text-[#1A1A1A]/50 font-medium">
                AI-assisted assessment
              </div>
            </div>
          </div>

          {/* Panel 2: Market Intelligence */}
          <div className="bg-white rounded-[24px] border border-black/5 p-8 shadow-[0_4px_40px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-1 group">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-[#5B21B6]" />
              <h3 className="text-base font-semibold">{t('landing.marketIntel')}</h3>
            </div>
            <p className="text-sm text-[#1A1A1A]/70 leading-relaxed mb-8">
              {t('landing.marketIntelDesc')}
            </p>
            
            {/* Miniature UI */}
            <div className="bg-[#FAF9F6] border border-black/5 rounded-2xl p-5 flex flex-col justify-between h-[230px]">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-[11px] text-[#1A1A1A]/60 font-medium mb-1">Market radius</div>
                  <div className="text-lg font-bold">{demoFeasibility.marketReach.radiusKm} km</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#1A1A1A]/60 font-medium mb-1">Competitors</div>
                  <div className="text-lg font-bold">{demoFeasibility.competitorMapping.existingSimilarUnits}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#1A1A1A]/60 font-medium mb-1">Estimated demand</div>
                  <div className="text-lg font-bold">{(demoFeasibility.marketReach.consumerBaseEstimate/1000).toFixed(1)}k</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#1A1A1A]/60 font-medium mb-1">Opportunity</div>
                  <div className="text-lg font-bold text-[#059669]">{demoFeasibility.competitorMapping.marketViabilityScore}%</div>
                </div>
              </div>
              
              <div className="h-16 w-full mt-auto opacity-70 group-hover:opacity-100 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demoFeasibility.financial.schedule.slice(0, 5)}>
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '10px' }} />
                    <Bar dataKey="totalEMI" fill="#5B21B6" radius={[4, 4, 0, 0]} opacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Panel 3: Loan Advisory */}
          <div className="bg-white rounded-[24px] border border-black/5 p-8 shadow-[0_4px_40px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-1 group">
            <div className="flex items-center gap-3 mb-4">
              <BadgeDollarSign className="w-5 h-5 text-[#5B21B6]" />
              <h3 className="text-base font-semibold">{t('landing.loanAdvisory')}</h3>
            </div>
            <p className="text-sm text-[#1A1A1A]/70 leading-relaxed mb-8">
              {t('landing.loanAdvisoryDesc')}
            </p>
            
            {/* Miniature UI */}
            <div className="bg-[#FAF9F6] border border-black/5 rounded-2xl p-5">
              <div className="text-[10px] font-bold tracking-widest text-[#5B21B6] uppercase mb-4">Project Cost</div>
              <div className="text-3xl font-bold mb-6 tracking-tight">{formatINR(demoFinancial.totalProjectCost)}</div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm border-b border-black/5 pb-2">
                  <span className="text-[#1A1A1A]/70">Margin capital</span>
                  <span className="font-semibold">{formatINR(demoFinancial.marginCapital)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-black/5 pb-2">
                  <span className="text-[#1A1A1A]/70">Loan required</span>
                  <span className="font-semibold">{formatINR(demoFinancial.maxLoanAmount)}</span>
                </div>
              </div>

              <div className="bg-white border border-black/5 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <div className="text-xs font-semibold text-[#5B21B6] mb-0.5">Recommended: {demoFinancial.schemeType}</div>
                  <div className="text-[11px] text-[#1A1A1A]/60">Estimated EMI: {formatINR(demoFinancial.quarterlyEMI / 3)} / month</div>
                </div>
                <div className="text-sm font-bold bg-[#5B21B6]/10 text-[#5B21B6] px-2 py-1 rounded-md">
                  {demoFinancial.interestRate}%
                </div>
              </div>
            </div>
          </div>

          {/* Panel 4: Smart Scheme Router */}
          <div className="bg-white rounded-[24px] border border-black/5 p-8 shadow-[0_4px_40px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-1 group">
            <div className="flex items-center gap-3 mb-4">
              <FileScan className="w-5 h-5 text-[#5B21B6]" />
              <h3 className="text-base font-semibold">{t('landing.aiCreditReview')}</h3>
            </div>
            <p className="text-sm text-[#1A1A1A]/70 leading-relaxed mb-8">
              {t('landing.aiCreditReviewDesc')}
            </p>
            
            {/* Miniature UI */}
            <div className="bg-[#FAF9F6] border border-black/5 rounded-2xl p-5 flex flex-col justify-between h-[230px]">
              <div className="mb-4">
                <div className="text-[10px] font-bold text-[#1A1A1A]/50 mb-1">PROJECT COST {formatINR(demoFinancial.totalProjectCost)}</div>
                <div className="text-sm font-bold">{demoFinancial.schemeName}</div>
                <div className="text-[11px] text-[#1A1A1A]/60 mt-0.5">Matched based on required loan size</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-white border border-black/5 rounded-lg p-2.5">
                  <div className="text-[10px] text-[#1A1A1A]/60 mb-1">Interest</div>
                  <div className="text-sm font-semibold">{demoFinancial.interestRate}% p.a.</div>
                </div>
                <div className="bg-white border border-black/5 rounded-lg p-2.5">
                  <div className="text-[10px] text-[#1A1A1A]/60 mb-1">Tenure</div>
                  <div className="text-sm font-semibold">{demoFinancial.totalTenureYears} Years</div>
                </div>
              </div>

              <div className="bg-[#059669]/10 border border-[#059669]/20 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1 text-[#059669]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Eligible financing</span>
                </div>
                <div className="text-sm font-bold text-[#059669] ml-1">
                  {formatINR(demoFinancial.sanctionedLoan)}
                </div>
              </div>
            </div>
          </div>

          {/* Panel 5: Repayment Planner */}
          <div className="bg-white rounded-[24px] border border-black/5 p-8 shadow-[0_4px_40px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-1 group">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-[#5B21B6]" />
              <h3 className="text-base font-semibold">{t('landing.communityFunding')}</h3>
            </div>
            <p className="text-sm text-[#1A1A1A]/70 leading-relaxed mb-8">
              {t('landing.communityFundingDesc')}
            </p>
            
            {/* Miniature UI */}
            <div className="bg-[#FAF9F6] border border-black/5 rounded-2xl p-5 flex flex-col justify-between h-[230px]">
              <div className="mb-4">
                <div className="text-sm font-bold mb-1">Repayment Schedule</div>
                <div className="text-[11px] text-[#1A1A1A]/60 flex items-center gap-1.5">
                  <span className="bg-black/5 px-1.5 py-0.5 rounded">Quarterly</span>
                  <span>{demoFinancial.totalQuarters} Periods</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-lg font-bold text-[#D97706]">{demoFinancial.moratoriumMonths} Months</span>
                  <span className="text-xs text-[#1A1A1A]/60">Grace Period</span>
                </div>
                <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-[#D97706] rounded-full" style={{ width: '25%' }} />
                </div>
                <div className="flex justify-between text-[11px] font-medium text-[#1A1A1A]/60">
                  <span>Moratorium</span>
                  <span>Regular EMI</span>
                </div>
              </div>

              <div className="w-full flex items-center justify-between text-xs font-semibold bg-[#1A1A1A] text-white px-4 py-3 rounded-xl mt-auto">
                <span>Estimated EMI</span>
                <span>{formatINR(demoFinancial.quarterlyEMI)} / Qtr</span>
              </div>
            </div>
          </div>

          {/* Panel 6: Voice Advisor */}
          <div className="bg-white rounded-[24px] border border-black/5 p-8 shadow-[0_4px_40px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-1 group">
            <div className="flex items-center gap-3 mb-4">
              <Mic2 className="w-5 h-5 text-[#5B21B6]" />
              <h3 className="text-base font-semibold">{t('landing.voiceAdvisor')}</h3>
            </div>
            <p className="text-sm text-[#1A1A1A]/70 leading-relaxed mb-8">
              {t('landing.voiceAdvisorDesc')}
            </p>
            
            {/* Miniature UI */}
            <div className="bg-[#FAF9F6] border border-black/5 rounded-2xl p-5 flex flex-col justify-end h-[230px]">
              
              <div className="space-y-4 mb-5">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#5B21B6] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mic2 className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-white border border-black/5 rounded-2xl rounded-tl-sm px-3 py-2 text-xs leading-relaxed shadow-sm">
                    Tell me about your business idea.
                  </div>
                </div>
                
                <div className="flex items-start gap-2 flex-row-reverse">
                  <div className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    {lang.toUpperCase()}
                  </div>
                  <div className="bg-[#1A1A1A] text-white rounded-2xl rounded-tr-sm px-3 py-2 text-xs leading-relaxed shadow-sm">
                    I want to start a food processing unit.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#5B21B6] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mic2 className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-white border border-black/5 rounded-2xl rounded-tl-sm px-3 py-2 text-xs leading-relaxed shadow-sm">
                    Your next step is to complete the feasibility assessment.
                  </div>
                </div>
              </div>

              <div className="w-full bg-white border border-black/10 rounded-full h-10 flex items-center justify-between px-3">
                <span className="text-[11px] text-[#1A1A1A]/40">{t('voice.tapToSpeak')}</span>
                <div className="w-6 h-6 rounded-full bg-[#5B21B6]/10 flex items-center justify-center">
                  <Mic2 className="w-3 h-3 text-[#5B21B6]" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ─── Role Entry Points ─── */}
        <div className="mt-32 w-full max-w-5xl">
          <h2 className="text-2xl font-semibold text-center mb-12">{t('landing.builtFor')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Entrepreneur */}
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-2xl bg-[#5B21B6]/5 flex items-center justify-center mb-5">
                <User className="w-5 h-5 text-[#5B21B6]" />
              </div>
              <h4 className="font-semibold mb-2">{t('landing.entrepreneurs')}</h4>
              <p className="text-sm text-[#1A1A1A]/60 leading-relaxed mb-6">
                {t('landing.entrepreneursDesc')}
              </p>
              <button
                onClick={() => handleRoleSelect('entrepreneur')}
                className="text-sm font-medium text-[#5B21B6] hover:underline"
              >
                {t('landing.entrepreneursCTA')}
              </button>
            </div>

            {/* Bank Officer */}
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-2xl bg-[#5B21B6]/5 flex items-center justify-center mb-5">
                <Building2 className="w-5 h-5 text-[#5B21B6]" />
              </div>
              <h4 className="font-semibold mb-2">{t('landing.bankOfficers')}</h4>
              <p className="text-sm text-[#1A1A1A]/60 leading-relaxed mb-6">
                {t('landing.bankOfficersDesc')}
              </p>
              <button
                onClick={() => handleRoleSelect('bank')}
                className="text-sm font-medium text-[#5B21B6] hover:underline"
              >
                {t('landing.bankOfficersCTA')}
              </button>
            </div>

            {/* Admin */}
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-2xl bg-[#5B21B6]/5 flex items-center justify-center mb-5">
                <ShieldCheck className="w-5 h-5 text-[#5B21B6]" />
              </div>
              <h4 className="font-semibold mb-2">{t('landing.admins')}</h4>
              <p className="text-sm text-[#1A1A1A]/60 leading-relaxed mb-6">
                {t('landing.adminsDesc')}
              </p>
              <button
                onClick={() => handleRoleSelect('admin')}
                className="text-sm font-medium text-[#5B21B6] hover:underline"
              >
                {t('landing.adminsCTA')}
              </button>
            </div>

          </div>
        </div>

      </main>

      {/* ─── Footer ─── */}
      <footer className="px-6 sm:px-10 py-8 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#1A1A1A]/50">
        <div className="flex items-center gap-2">
          <Landmark className="w-3.5 h-3.5" />
          <span>{t('common.appTitle')}</span>
        </div>
        <div>
          {t('common.appSubTitle')}
        </div>
      </footer>
    </div>
  );
}
