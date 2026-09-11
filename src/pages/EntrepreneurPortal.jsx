import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import VoiceButton from '../components/VoiceButton';
import SchemeBadge from '../components/SchemeBadge';
import RuralAIChatAssistant from '../components/RuralAIChatAssistant';
import { generateFeasibilityReport, getAIRecommendationForLocation } from '../utils/aiFeasibilityEngine';
import { formatINR, PREDEFINED_GOVT_SCHEMES } from '../utils/financialEngine';
import { SECTIONS_PRESETS, REGIONS_PRESETS } from '../utils/mockData';
import {
  Sparkles,
  Calculator,
  MessageCircle,
  TrendingUp,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  Search,
  DollarSign,
  Briefcase,
  Activity,
  HeartHandshake,
  Gift
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function EntrepreneurPortal({ initialSubTab = 'chat' }) {
  const { currentUser, submitApplication, applications } = useAuth();
  const { t, speak } = useLanguage();

  // Input states
  const [marginCapital, setMarginCapital] = useState(100000); // Default ₹1L
  const [businessIdea, setBusinessIdea] = useState('Dairy Enterprise & Organic Milk Unit');
  const [sectorKey, setSectorKey] = useState('Dairy');
  const [selectedRegionIndex, setSelectedRegionIndex] = useState(0);
  const [chosenSchemeKey, setChosenSchemeKey] = useState('SCA_MICRO');

  // Active view tab: 'chat' | 'feasibility' | 'repayment'
  const [activeTab, setActiveTab] = useState(initialSubTab);

  // Generated report state
  const [report, setReport] = useState(() =>
    generateFeasibilityReport({
      location: REGIONS_PRESETS[0],
      marginCapital: 100000,
      businessIdea: 'Dairy Enterprise & Organic Milk Unit',
      sectorKey: 'Dairy',
      chosenSchemeKey: 'SCA_MICRO'
    })
  );

  // AI Location Recommendation state
  const [aiRec, setAiRec] = useState(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const handleGetAIRecommendation = () => {
    const region = REGIONS_PRESETS[selectedRegionIndex];
    const rec = getAIRecommendationForLocation(region);
    setAiRec(rec);
    speak(
      `AI analyzed ${region.village} dataset. Recommended enterprise is ${rec.idea}. Required capital is ${formatINR(
        rec.totalCapitalRequired
      )} with ${formatINR(rec.marginCapitalRequired)} margin capital.`
    );
  };

  const handleApplyAIRecommendation = () => {
    if (!aiRec) return;
    setBusinessIdea(aiRec.idea);
    setSectorKey(aiRec.sectorKey);
    setMarginCapital(aiRec.marginCapitalRequired);
    setChosenSchemeKey(aiRec.schemeKey);

    const region = REGIONS_PRESETS[selectedRegionIndex];
    const generated = generateFeasibilityReport({
      location: region,
      marginCapital: Number(aiRec.marginCapitalRequired),
      businessIdea: aiRec.idea,
      sectorKey: aiRec.sectorKey,
      chosenSchemeKey: aiRec.schemeKey
    });
    setReport(generated);
    setApplicationSubmitted(false);
  };

  const handleGenerate = (e) => {
    if (e) e.preventDefault();
    const region = REGIONS_PRESETS[selectedRegionIndex];
    const generated = generateFeasibilityReport({
      location: region,
      marginCapital: Number(marginCapital),
      businessIdea,
      sectorKey,
      chosenSchemeKey
    });
    setReport(generated);
    setApplicationSubmitted(false);

    speak(
      `AI Feasibility Report generated for ${businessIdea} in ${region.village}. Total project cost is ${formatINR(
        generated.financial.totalProjectCost
      )}, requiring ${formatINR(generated.financial.marginCapital)} margin money.`
    );
  };

  const handleApply = () => {
    const newApp = {
      id: `APP-${Math.floor(10000 + Math.random() * 90000)}`,
      applicantName: currentUser?.name || 'Ramesh Patel',
      age: currentUser?.age || 34,
      contact: currentUser?.contact || '+91 98765 43210',
      address: currentUser?.address || 'At Post Sualkuchi',
      location: report.rawLocation,
      originalBusinessIdea: report.businessIdea,
      sectorKey,
      availableMarginCapital: report.financial.marginCapital,
      status: report.competitorMapping.isOversaturated ? 'COUNTER_PROPOSED' : 'PENDING_REVIEW',
      appliedAt: new Date().toISOString(),
      feasibilityReport: report
    };

    submitApplication(newApp);
    setApplicationSubmitted(true);
  };

  // Find user's existing application status
  const userApp = applications.find((a) => a.applicantName === currentUser?.name) || applications[0];

  return (
    <div className="space-y-8 pb-16 text-slate-900">
      
      {/* Top Hero Banner - Crisp Light Theme */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-emerald-500/10 via-amber-500/5 to-white border border-emerald-200/80 shadow-sm overflow-hidden text-slate-900">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs font-extrabold px-3.5 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Rural Advisory AI • Phase 1
              </span>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold px-3.5 py-1 rounded-full">
                10% Margin Money Scheme
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mt-2 leading-relaxed font-medium">
              {t('heroSub')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <MessageCircle className="w-4 h-4 text-amber-300" />
              <span>AI Chat Assistant</span>
            </button>

            <button
              onClick={() => setActiveTab('feasibility')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'feasibility'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Calculator className="w-4 h-4 text-emerald-500" />
              <span>Feasibility & Calculator</span>
            </button>

            <button
              onClick={() => setActiveTab('repayment')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'repayment'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Activity className="w-4 h-4 text-cyan-500" />
              <span>Repayment Tracker</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render AI Conversational Chat Assistant */}
      {activeTab === 'chat' && (
        <RuralAIChatAssistant
          onViewFullReport={() => setActiveTab('feasibility')}
          onReportGenerated={(genReport) => setReport(genReport)}
        />
      )}

      {/* Main Form & Interactive Calculation Hub */}
      {activeTab === 'feasibility' && (
        <>
          <form onSubmit={handleGenerate} className="bg-white border border-slate-200/90 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-emerald-600" />
                  {t('step1Title')}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {t('step1Sub')}
                </p>
              </div>

              {/* Hyper-Local AI Recommendation Button */}
              <button
                type="button"
                onClick={handleGetAIRecommendation}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{t('askAiRecommendBtn')}</span>
              </button>
            </div>

            {/* AI Location Recommendation Result Card */}
            {aiRec && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-slate-50 to-white border border-emerald-300 text-slate-900 space-y-3 shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Hyper-Local AI Recommended Business Idea
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-1">{aiRec.idea}</h3>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-200 text-xs font-black rounded-full">
                    {aiRec.marketDemandScore}/100 Demand Score
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {aiRec.whyItFits}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold pt-1">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Total Capital</span>
                    <span className="font-extrabold text-emerald-700">{formatINR(aiRec.totalCapitalRequired)}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">10% Margin Money</span>
                    <span className="font-extrabold text-amber-700">{formatINR(aiRec.marginCapitalRequired)}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">90% Bank Loan</span>
                    <span className="font-extrabold text-blue-700">{formatINR(aiRec.loanRequired)}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Govt Subsidy</span>
                    <span className="font-extrabold text-purple-700">{aiRec.subsidyBenefit}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-slate-600">Monthly Revenue Est: <strong className="text-emerald-700 font-extrabold">{aiRec.monthlyRevenueEst}</strong></span>
                  <button
                    type="button"
                    onClick={handleApplyAIRecommendation}
                    className="px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Apply AI Recommendation</span>
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Geographic Location Preset Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  {t('locationLabel')}
                </label>
                <select
                  value={selectedRegionIndex}
                  onChange={(e) => setSelectedRegionIndex(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                >
                  {REGIONS_PRESETS.map((r, idx) => (
                    <option key={idx} value={idx}>
                      {r.village}, {r.block} ({r.district}, {r.state})
                    </option>
                  ))}
                </select>
              </div>

              {/* Available Margin Capital */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  {t('marginCapitalLabel')}
                </label>
                <div className="flex gap-2">
                  <div className="relative w-full">
                    <span className="absolute left-3.5 top-3 text-slate-400 text-sm font-bold">₹</span>
                    <input
                      type="number"
                      step="5000"
                      min="10000"
                      max="500000"
                      value={marginCapital}
                      onChange={(e) => setMarginCapital(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-sm font-black text-emerald-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <VoiceButton onTranscript={(txt) => setMarginCapital(txt.replace(/[^0-9]/g, ''))} />
                </div>
              </div>

              {/* Business Sector & Idea Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                  <Briefcase className="w-4 h-4 text-cyan-600" />
                  {t('businessIdeaLabel')}
                </label>
                <div className="flex gap-2">
                  <select
                    value={sectorKey}
                    onChange={(e) => {
                      setSectorKey(e.target.value);
                      const sec = SECTIONS_PRESETS.find((s) => s.key === e.target.value);
                      if (sec) setBusinessIdea(`${sec.label} Unit`);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  >
                    {SECTIONS_PRESETS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <VoiceButton onTranscript={(txt) => setBusinessIdea(txt)} />
                </div>
              </div>
            </div>

            {/* Predefined Government Schemes Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                <Gift className="w-4 h-4 text-purple-600" />
                {t('selectGovtSchemeLabel')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {Object.keys(PREDEFINED_GOVT_SCHEMES).map((key) => {
                  const s = PREDEFINED_GOVT_SCHEMES[key];
                  const isSelected = chosenSchemeKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setChosenSchemeKey(key)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-[9px] font-extrabold uppercase text-slate-400 block">{s.category}</span>
                      <span className="text-xs font-extrabold block leading-tight line-clamp-1 mt-0.5">{s.name}</span>
                      <span className="text-[10px] font-bold text-emerald-600 block mt-1">
                        {s.subsidyPercent > 0 ? `${s.subsidyPercent}% Subsidy` : `${s.interestRate}% Interest`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl font-extrabold text-base bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{t('generateReportBtn')}</span>
            </button>
          </form>

          {/* Module 2: Smart Financial Calculator Output & Scheme Badge */}
          <div className="space-y-6">
            <SchemeBadge financial={report.financial} />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">{t('marginMoney')}</span>
                <div className="text-2xl font-black text-amber-600 mt-2">{formatINR(report.financial.marginCapital)}</div>
                <p className="text-xs text-slate-500 mt-1">Cash equity provided by entrepreneur.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">{t('totalProjectCost')}</span>
                <div className="text-2xl font-black text-emerald-600 mt-2">{formatINR(report.financial.totalProjectCost)}</div>
                <p className="text-xs text-slate-500 mt-1">Margin Capital / 10%.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">{t('govtSubsidy')}</span>
                <div className="text-2xl font-black text-purple-600 mt-2">{formatINR(report.financial.govtSubsidyAmount)}</div>
                <p className="text-xs text-slate-500 mt-1">{report.financial.subsidyPercent}% direct grant.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">{t('sanctionedLoan')}</span>
                <div className="text-2xl font-black text-cyan-600 mt-2">{formatINR(report.financial.sanctionedLoan)}</div>
                <p className="text-xs text-slate-500 mt-1">Disbursed by SCA Bank.</p>
              </div>

            </div>
          </div>

          {/* Module 1: 6-Part Hyper-Local AI Feasibility Report View */}
          <div className="bg-white border border-slate-200/90 p-6 sm:p-8 rounded-3xl space-y-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold px-3 py-1 rounded-full">
                  Report ID: {report.id}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                  Hyper-Local Market Feasibility Strategy: {report.businessIdea}
                </h2>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {report.location}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => speak(`Reading Feasibility Strategy for ${report.businessIdea}. Market reach covers a radius of ${report.marketReach.radiusKm} kilometers with an estimated consumer base of ${report.marketReach.consumerBaseEstimate} people.`)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-extrabold flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" /> Listen Audio Strategy
                </button>

                <button
                  onClick={handleApply}
                  disabled={applicationSubmitted}
                  className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                    applicationSubmitted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{applicationSubmitted ? t('applicationSubmittedMsg') : t('applyForLoan')}</span>
                </button>
              </div>
            </div>

            {/* AI Counter-Proposal Notification Banner if Oversaturated */}
            {report.competitorMapping.isOversaturated && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-extrabold text-amber-900">
                    High Market Saturation Flag ({report.competitorMapping.existingSimilarUnits} Existing Units in Block)
                  </h4>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    AI Market Radar flagged high competitor density in {report.rawLocation.blockName}. In the Bank Employee Portal, an automated AI Counter-Proposal will suggest 3 higher-profit, low-competition alternative enterprise models!
                  </p>
                </div>
              </div>
            )}

            {/* Grid of 6 Feasibility Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Module 1: Market Reach */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" /> {t('marketReachTitle')}
                  </h3>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                    {report.marketReach.radiusKm} km Catchment
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{report.marketReach.targetDemographics}</p>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-xs text-slate-500">
                  <span>Estimated Consumer Base:</span>
                  <span className="font-extrabold text-slate-900">{report.marketReach.consumerBaseEstimate.toLocaleString()} Residents</span>
                </div>
              </div>

              {/* Module 2: Underserved Opportunity Analysis */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-600" /> {t('opportunityTitle')}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{report.opportunityAnalysis.marketGaps}</p>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-xs font-bold text-amber-700 block mb-1">Recommended Underserved Niches:</span>
                  <ul className="space-y-1">
                    {report.opportunityAnalysis.underservedNiches.map((n, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span>{n}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Module 3: Dynamic SWOT Analysis */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3 col-span-1 md:col-span-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-cyan-600" /> {t('swotTitle')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-800 block mb-1">Strengths</span>
                    <ul className="space-y-1 text-slate-700 text-[11px]">
                      {report.swot.strengths.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
                    <span className="font-bold text-rose-800 block mb-1">Weaknesses</span>
                    <ul className="space-y-1 text-slate-700 text-[11px]">
                      {report.swot.weaknesses.map((w, i) => (
                        <li key={i}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-cyan-50 p-3 rounded-xl border border-cyan-200">
                    <span className="font-bold text-cyan-800 block mb-1">Opportunities</span>
                    <ul className="space-y-1 text-slate-700 text-[11px]">
                      {report.swot.opportunities.map((o, i) => (
                        <li key={i}>• {o}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                    <span className="font-bold text-amber-800 block mb-1">Threats</span>
                    <ul className="space-y-1 text-slate-700 text-[11px]">
                      {report.swot.threats.map((t, i) => (
                        <li key={i}>• {t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </div>

            {/* Quarterly EMI Repayment Schedule Preview Chart */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-600" />
                  Quarterly EMI & Moratorium Breakdown Chart
                </h3>
                <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                  Moratorium: {report.financial.moratoriumMonths} Months Grace
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={report.financial.schedule.slice(0, 12)}>
                    <XAxis dataKey="periodName" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
                      formatter={(val) => formatINR(val)}
                    />
                    <Bar dataKey="principalPayment" name="Principal Payment" fill="#059669" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="interestPayment" name="Interest Payment" fill="#d97706" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </>
      )}

      {/* Repayment Progress Tracker Tab */}
      {activeTab === 'repayment' && (
        <div className="bg-white border border-slate-200/90 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Activity className="w-6 h-6 text-emerald-600" />
                {t('repaymentTrackerTitle')}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {t('repaymentTrackerSub')}
              </p>
            </div>
            <button
              onClick={() => speak(`Your loan for ${userApp.originalBusinessIdea} is in active repayment mode.`)}
              className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" /> Audio EMI Alert
            </button>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400">Active Borrower</span>
                <h3 className="text-lg font-extrabold text-slate-900">{userApp.applicantName}</h3>
                <p className="text-xs text-slate-500">{userApp.originalBusinessIdea}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400">Total Sanctioned Loan</span>
                <div className="text-2xl font-black text-emerald-700">
                  {formatINR(userApp.feasibilityReport.financial.sanctionedLoan)}
                </div>
              </div>
            </div>

            {/* Repayment Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-700 font-semibold">
                <span>Repayment Completion: 25% (Q3 Completed)</span>
                <span>Remaining Principal: {formatINR(userApp.feasibilityReport.financial.sanctionedLoan * 0.75)}</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden border border-slate-300">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full w-1/4"></div>
              </div>
            </div>
          </div>

          {/* Quarterly Repayment Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Quarter</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Principal</th>
                  <th className="px-4 py-3">Interest</th>
                  <th className="px-4 py-3">Total EMI</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userApp.feasibilityReport.financial.schedule.slice(0, 8).map((q) => (
                  <tr key={q.quarter} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{q.periodName}</td>
                    <td className="px-4 py-3">
                      {q.isMoratorium ? (
                        <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[10px] font-extrabold">
                          Moratorium Grace
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[10px] font-extrabold">
                          Standard Repayment
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">{formatINR(q.principalPayment)}</td>
                    <td className="px-4 py-3 text-amber-700 font-semibold">{formatINR(q.interestPayment)}</td>
                    <td className="px-4 py-3 font-extrabold text-emerald-700">{formatINR(q.totalEMI)}</td>
                    <td className="px-4 py-3">
                      {q.quarter === 1 ? (
                        <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                        </span>
                      ) : q.quarter === 2 ? (
                        <span className="text-amber-700 font-extrabold">Due Nov 30</span>
                      ) : (
                        <span className="text-slate-400">Upcoming</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
