import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SchemeBadge from '../components/SchemeBadge';
import { formatINR, compareGovernmentSchemes, calculateFinancialScheme, PREDEFINED_GOVT_SCHEMES } from '../utils/financialEngine';
import {
  Building2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
  Search,
  FileText,
  Users,
  Briefcase,
  Award,
  Gift,
  Calculator,
  Percent,
  Check,
  ChevronDown
} from 'lucide-react';

export default function BankPortal() {
  const { applications, approveApplication, triggerCounterProposal } = useAuth();
  const { t, speak } = useLanguage();

  const [selectedAppId, setSelectedAppId] = useState(applications[0]?.id || 'APP-98421');
  const [activeCounterProposal, setActiveCounterProposal] = useState(null);
  const [proposalSentAppIds, setProposalSentAppIds] = useState([]);
  
  // Custom Scheme Selection by Bank Officer
  const [selectedSchemeKey, setSelectedSchemeKey] = useState(null);

  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  // Calculate scheme comparisons for the selected application
  const marginCap = selectedApp?.availableMarginCapital || 100000;
  const sectorKey = selectedApp?.sectorKey || 'Dairy';
  const schemeOptions = compareGovernmentSchemes(marginCap, sectorKey);

  // Active calculated financial metrics based on officer scheme selection
  const activeFinancial = calculateFinancialScheme(marginCap, selectedSchemeKey || selectedApp?.feasibilityReport?.financial?.schemeType);

  const handleTriggerAI = () => {
    if (!selectedApp) return;
    const proposal = triggerCounterProposal(selectedApp.id);
    setActiveCounterProposal(proposal);
    speak(
      `AI Counter-Proposal generated for ${selectedApp.applicantName}. The original idea ${selectedApp.originalBusinessIdea} is oversaturated in ${selectedApp.location?.blockName || 'this block'}. AI recommends 3 alternative models with up to 55 percent profit margins and government subsidies.`
    );
  };

  const handleSendProposalToUser = (appId) => {
    setProposalSentAppIds((prev) => [...prev, appId]);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner Header - Airtable Style */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Channelizing Agency (SCA / CA) Staff Desk
            </span>
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-extrabold px-3 py-1 rounded-full">
              Phase 2 & Phase 3 Bank Evaluation
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Bank Employee Portal & Predefined Govt Scheme Router
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Assess rural entrepreneur applications, run AI competitor saturation density checks, select optimal predefined government schemes (PMEGP, MUDRA, SCA), and trigger low-competition counter-proposals.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-right">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Bank Queue</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{applications.length} Applications</div>
        </div>
      </div>

      {/* Main Layout: Applications Queue Sidebar + Detail Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Sidebar: Applicant Queue */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <FileText className="w-4 h-4 text-blue-500" />
            Applicant Queue
          </h2>

          <div className="space-y-3">
            {applications.map((app) => {
              const isSelected = app.id === selectedAppId;
              const isOversaturated = app.feasibilityReport?.competitorMapping?.isOversaturated;

              return (
                <div
                  key={app.id}
                  onClick={() => {
                    setSelectedAppId(app.id);
                    setSelectedSchemeKey(null);
                    setActiveCounterProposal(app.counterProposal || null);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-slate-800 border-blue-500/60 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-slate-50/50 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-mono font-bold text-slate-400">{app.id}</span>
                    {app.status === 'APPROVED' ? (
                      <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold rounded-full">
                        Sanctioned
                      </span>
                    ) : isOversaturated ? (
                      <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Saturation Flag
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[10px] font-extrabold rounded-full">
                        Under Review
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-2">{app.applicantName}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{app.originalBusinessIdea}</p>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 font-semibold">
                    <span>Margin: {formatINR(app.availableMarginCapital)}</span>
                    <span className="text-slate-900 dark:text-slate-200 font-bold">Cost: {formatINR(app.availableMarginCapital / 0.10)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Content Area: Application Desk & AI Government Scheme Evaluator */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Selected Application Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Applicant Reference: {selectedApp.id}</span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{selectedApp.applicantName}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Address: {selectedApp.address} | Contact: {selectedApp.contact}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => approveApplication(selectedApp.id)}
                  disabled={selectedApp.status === 'APPROVED'}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                    selectedApp.status === 'APPROVED'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-lg'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedApp.status === 'APPROVED' ? 'Loan Sanctioned' : 'Sanction Loan under Selected Scheme'}</span>
                </button>
              </div>
            </div>

            {/* Scheme Badge Display */}
            <SchemeBadge financial={activeFinancial} />

            {/* Predefined Government Schemes AI Recommender Engine */}
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                    Math & AI Scheme Recommender
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Government Predefined Schemes Matching Matrix
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-semibold">Select scheme to override</span>
              </div>

              {/* Side-by-Side Scheme Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {schemeOptions.map((opt) => {
                  const isSelectedScheme = (selectedSchemeKey || activeFinancial.schemeType) === opt.schemeKey;

                  return (
                    <div
                      key={opt.schemeKey}
                      onClick={() => setSelectedSchemeKey(opt.schemeKey)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2.5 ${
                        isSelectedScheme
                          ? 'bg-white dark:bg-slate-900 border-purple-500 shadow-md ring-2 ring-purple-500/20'
                          : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase">{opt.category}</span>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{opt.schemeName}</h4>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-black border ${
                            opt.suitabilityScore >= 95
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                          }`}
                        >
                          {opt.suitabilityScore}/100 Match
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-slate-400 text-[10px] block">Interest</span>
                          <span className="font-bold text-amber-600 dark:text-amber-400">{opt.interestRate}% p.a.</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Tenure</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{opt.tenureYears} Yrs</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Subsidy</span>
                          <span className="font-bold text-purple-600 dark:text-purple-400">
                            {opt.govtSubsidyAmount > 0 ? formatINR(opt.govtSubsidyAmount) : 'None'}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[11px] pt-1">
                        <span className="text-slate-500 dark:text-slate-400">Net Sanctioned Loan:</span>
                        <strong className="text-slate-900 dark:text-slate-100 font-extrabold">{formatINR(opt.sanctionedLoan)}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bank Market Saturation Analysis */}
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Bank-Side AI Market Saturation Radar
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedApp.feasibilityReport?.competitorMapping?.isOversaturated
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {selectedApp.feasibilityReport?.competitorMapping?.saturationStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Existing Units in Block</span>
                  <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                    {selectedApp.feasibilityReport?.competitorMapping?.existingSimilarUnits} Units
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Threshold Limit</span>
                  <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                    {selectedApp.feasibilityReport?.competitorMapping?.saturationThreshold} Units
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Block Density Score</span>
                  <span className="text-lg font-black text-amber-500">
                    {selectedApp.feasibilityReport?.competitorMapping?.densityScore}%
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Repayment Score</span>
                  <span className="text-lg font-black text-cyan-500">
                    {selectedApp.feasibilityReport?.competitorMapping?.marketViabilityScore}/100
                  </span>
                </div>
              </div>

              {/* AI Counter-Proposal Trigger Button */}
              {selectedApp.feasibilityReport?.competitorMapping?.isOversaturated && (
                <div className="pt-2">
                  <button
                    onClick={handleTriggerAI}
                    className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>Trigger AI Counter-Proposal Generator for Oversaturated Business Idea</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* AI Counter-Proposal View Card */}
          {(activeCounterProposal || selectedApp.counterProposal) && (
            <div className="bg-white dark:bg-slate-900 border border-amber-500/40 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 w-fit mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Counter-Proposal Triggered
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                    Low-Competition High-Profit Alternative Counter-Proposals
                  </h3>
                </div>

                <button
                  onClick={() => handleSendProposalToUser(selectedApp.id)}
                  disabled={proposalSentAppIds.includes(selectedApp.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 ${
                    proposalSentAppIds.includes(selectedApp.id)
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {proposalSentAppIds.includes(selectedApp.id) ? 'Sent to Entrepreneur Portal' : 'Send Counter-Proposal to User'}
                  </span>
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/20 leading-relaxed font-medium">
                {(activeCounterProposal || selectedApp.counterProposal).saturationNote}
              </p>

              <div className="space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Top 3 AI Recommended High-Profit Alternatives:
                </h4>

                <div className="grid grid-cols-1 gap-4">
                  {(activeCounterProposal || selectedApp.counterProposal).alternatives.map((alt, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase">Option {idx + 1} • {alt.schemeRecommendation}</span>
                          <h5 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{alt.title}</h5>
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-extrabold rounded-full">
                          Score: {alt.viabilityScore}/100
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{alt.reasoning}</p>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800">
                          <span className="text-slate-400 text-[10px] block">Profit Margin</span>
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{alt.expectedProfitMargin}</span>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800">
                          <span className="text-slate-400 text-[10px] block">Payback Period</span>
                          <span className="font-extrabold text-cyan-600 dark:text-cyan-400">{alt.paybackPeriodYears}</span>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800">
                          <span className="text-slate-400 text-[10px] block">Density Level</span>
                          <span className="font-extrabold text-purple-600 dark:text-purple-300">{alt.competitionDensity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

