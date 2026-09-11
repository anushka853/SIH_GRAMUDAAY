import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SchemeBadge from '../components/SchemeBadge';
import { formatINR, compareGovernmentSchemes, calculateFinancialScheme, PREDEFINED_GOVT_SCHEMES } from '../utils/financialEngine';
import { evaluateMarketSituation } from '../utils/aiFeasibilityEngine';
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
  const [marketCheckResult, setMarketCheckResult] = useState(null);
  
  // Custom Scheme Selection by Bank Officer
  const [selectedSchemeKey, setSelectedSchemeKey] = useState(null);

  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  const handleRunMarketCheck = () => {
    if (!selectedApp) return;
    const res = evaluateMarketSituation(selectedApp.originalBusinessIdea, selectedApp.location);
    setMarketCheckResult(res);
    speak(
      `AI Market Check completed for ${selectedApp.applicantName}. Verdict is ${res.verdict} with a market viability score of ${res.viabilityScore} out of 100.`
    );
  };

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
      `AI Counter-Proposal generated for ${selectedApp.applicantName}. AI recommends 3 alternative models with up to 55 percent profit margins and government subsidies.`
    );
  };

  const handleSendProposalToUser = (appId) => {
    setProposalSentAppIds((prev) => [...prev, appId]);
  };

  return (
    <div className="space-y-8 pb-16 text-slate-900">
      
      {/* Top Banner Header - Light Theme */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-50 text-blue-800 border border-blue-200 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" /> Channelizing Agency (SCA / CA) Staff Desk
            </span>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold px-3 py-1 rounded-full">
              Phase 2 & Phase 3 Bank Evaluation
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {t('bankPortalTitle')}
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-1 leading-relaxed">
            {t('bankPortalSub')}
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-right shrink-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Bank Queue</span>
          <div className="text-2xl font-black text-blue-700">{applications.length} Applications</div>
        </div>
      </div>

      {/* Main Layout: Applications Queue Sidebar + Detail Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Sidebar: Applicant Queue */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-3xl space-y-4 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-4 h-4 text-blue-600" />
            {t('applicantQueue')}
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
                      ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-mono font-bold text-slate-400">{app.id}</span>
                    {app.status === 'APPROVED' ? (
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold rounded-full">
                        Sanctioned
                      </span>
                    ) : isOversaturated ? (
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" /> Saturation Flag
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-extrabold rounded-full">
                        Under Review
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 mt-2">{app.applicantName}</h3>
                  <p className="text-xs text-slate-500">{app.originalBusinessIdea}</p>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200/80 font-semibold">
                    <span>Margin: {formatINR(app.availableMarginCapital)}</span>
                    <span className="text-slate-900 font-bold">Cost: {formatINR(app.availableMarginCapital / 0.10)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Content Area: Application Desk & AI Government Scheme Evaluator */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Selected Application Card */}
          <div className="bg-white border border-slate-200/90 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Applicant Reference: {selectedApp.id}</span>
                <h2 className="text-2xl font-black text-slate-900">{selectedApp.applicantName}</h2>
                <p className="text-xs text-slate-500">
                  Address: {selectedApp.address} | Contact: {selectedApp.contact}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleRunMarketCheck}
                  className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>{t('runMarketCheckBtn')}</span>
                </button>

                <button
                  onClick={() => approveApplication(selectedApp.id)}
                  disabled={selectedApp.status === 'APPROVED'}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                    selectedApp.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedApp.status === 'APPROVED' ? 'Loan Sanctioned' : t('sanctionLoanBtn')}</span>
                </button>
              </div>
            </div>

            {/* AI Market Situation Evaluation Modal / Card */}
            {marketCheckResult && (
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3 text-slate-900 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
                      Bank Officer AI Market Evaluation Report
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-1">Idea: {marketCheckResult.businessIdea} ({marketCheckResult.village})</h3>
                  </div>
                  <span className={`px-3 py-1 text-xs font-black rounded-full border ${
                    marketCheckResult.viabilityScore >= 70
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-rose-100 text-rose-800 border-rose-200'
                  }`}>
                    {marketCheckResult.viabilityScore}/100 Viability
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-200">
                  {marketCheckResult.keyFinding}
                </p>

                <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-400 text-[10px] block">Units in Block</span>
                    <span className="font-extrabold text-slate-900">{marketCheckResult.existingUnits} Units</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-400 text-[10px] block">Saturation Limit</span>
                    <span className="font-extrabold text-amber-700">{marketCheckResult.maxThreshold} Units</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-400 text-[10px] block">Bank Verdict</span>
                    <span className={`font-extrabold ${marketCheckResult.viabilityScore >= 70 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {marketCheckResult.verdict}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Scheme Badge Display */}
            <SchemeBadge financial={activeFinancial} />

            {/* Predefined Government Schemes AI Recommender Engine */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                    Math & AI Scheme Recommender
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
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
                          ? 'bg-white border-purple-500 shadow-md ring-2 ring-purple-500/20'
                          : 'bg-white/70 border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase">{opt.category}</span>
                          <h4 className="text-sm font-extrabold text-slate-900">{opt.schemeName}</h4>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-black border ${
                            opt.suitabilityScore >= 95
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}
                        >
                          {opt.suitabilityScore}/100 Match
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                        <div>
                          <span className="text-slate-400 text-[10px] block">Interest</span>
                          <span className="font-bold text-amber-700">{opt.interestRate}% p.a.</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Tenure</span>
                          <span className="font-bold text-emerald-700">{opt.tenureYears} Yrs</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Subsidy</span>
                          <span className="font-bold text-purple-700">
                            {opt.govtSubsidyAmount > 0 ? formatINR(opt.govtSubsidyAmount) : 'None'}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[11px] pt-1">
                        <span className="text-slate-500">Net Sanctioned Loan:</span>
                        <strong className="text-slate-900 font-extrabold">{formatINR(opt.sanctionedLoan)}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bank Market Saturation Analysis */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Bank-Side AI Market Saturation Radar
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedApp.feasibilityReport?.competitorMapping?.isOversaturated
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {selectedApp.feasibilityReport?.competitorMapping?.saturationStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Existing Units in Block</span>
                  <span className="text-lg font-black text-slate-900">
                    {selectedApp.feasibilityReport?.competitorMapping?.existingSimilarUnits} Units
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Threshold Limit</span>
                  <span className="text-lg font-black text-slate-900">
                    {selectedApp.feasibilityReport?.competitorMapping?.saturationThreshold} Units
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Block Density Score</span>
                  <span className="text-lg font-black text-amber-600">
                    {selectedApp.feasibilityReport?.competitorMapping?.densityScore}%
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Repayment Score</span>
                  <span className="text-lg font-black text-cyan-600">
                    {selectedApp.feasibilityReport?.competitorMapping?.marketViabilityScore}/100
                  </span>
                </div>
              </div>

              {/* AI Counter-Proposal Trigger Button */}
              {selectedApp.feasibilityReport?.competitorMapping?.isOversaturated && (
                <div className="pt-2">
                  <button
                    onClick={handleTriggerAI}
                    className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>{t('triggerCounterProposalBtn')}</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* AI Counter-Proposal View Card */}
          {(activeCounterProposal || selectedApp.counterProposal) && (
            <div className="bg-white border border-amber-300 p-6 sm:p-8 rounded-3xl space-y-6 shadow-md">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 w-fit mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> AI Counter-Proposal Triggered
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Low-Competition High-Profit Alternative Counter-Proposals
                  </h3>
                </div>

                <button
                  onClick={() => handleSendProposalToUser(selectedApp.id)}
                  disabled={proposalSentAppIds.includes(selectedApp.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer ${
                    proposalSentAppIds.includes(selectedApp.id)
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-600 hover:bg-amber-700 text-white shadow-md'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {proposalSentAppIds.includes(selectedApp.id) ? 'Sent to Entrepreneur Portal' : t('sendProposalToUserBtn')}
                  </span>
                </button>
              </div>

              <p className="text-xs text-slate-700 bg-amber-50 p-3.5 rounded-2xl border border-amber-200 leading-relaxed font-medium">
                {(activeCounterProposal || selectedApp.counterProposal).saturationNote}
              </p>

              <div className="space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900">
                  Top 3 AI Recommended High-Profit Alternatives:
                </h4>

                <div className="grid grid-cols-1 gap-4">
                  {(activeCounterProposal || selectedApp.counterProposal).alternatives.map((alt, idx) => (
                    <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-extrabold text-amber-700 uppercase">Option {idx + 1} • {alt.schemeRecommendation}</span>
                          <h5 className="text-base font-extrabold text-slate-900">{alt.title}</h5>
                        </div>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-extrabold rounded-full">
                          Score: {alt.viabilityScore}/100
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{alt.reasoning}</p>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400 text-[10px] block">Profit Margin</span>
                          <span className="font-extrabold text-emerald-700">{alt.expectedProfitMargin}</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400 text-[10px] block">Payback Period</span>
                          <span className="font-extrabold text-blue-700">{alt.paybackPeriodYears}</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400 text-[10px] block">Density Level</span>
                          <span className="font-extrabold text-purple-700">{alt.competitionDensity}</span>
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
