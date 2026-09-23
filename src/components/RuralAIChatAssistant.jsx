import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import VoiceButton from './VoiceButton';
import { generateFeasibilityReport, getAIRecommendationForLocation } from '../utils/aiFeasibilityEngine';
import { formatINR, PREDEFINED_GOVT_SCHEMES } from '../utils/financialEngine';
import { REGIONS_PRESETS, SECTIONS_PRESETS } from '../utils/mockData';
import {
  Sparkles,
  Send,
  MessageCircle,
  MapPin,
  DollarSign,
  Briefcase,
  CheckCircle2,
  FileText,
  ArrowRight,
  User,
  Landmark,
  Gift,
  HelpCircle,
  Lightbulb,
  Award
} from 'lucide-react';

export default function RuralAIChatAssistant({ onViewFullReport, onReportGenerated }) {
  const { currentUser, submitApplication } = useAuth();
  const { t, lang, speak } = useLanguage();

  // Chat message history state
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'ai',
      text: t('chatgptGreetingMsg'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Input states
  const [inputText, setInputText] = useState('');
  const [marginCapital, setMarginCapital] = useState(15000);
  const [selectedRegionIndex, setSelectedRegionIndex] = useState(0);
  const [selectedSectorKey, setSelectedSectorKey] = useState('Dairy');
  
  // Active Generated Report State
  const [activeReport, setActiveReport] = useState(null);

  // Process user chat prompt or quick preset chip
  const handleProcessInput = (customPromptText = null) => {
    const textToSubmit = customPromptText || inputText;
    if (!textToSubmit.trim()) return;

    // 1. Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSubmit,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Extract numerical margin if mentioned in text (e.g. ₹15,000 -> 15000)
    const matchedMargin = textToSubmit.match(/(\d[\d,]*)/);
    let computedMargin = marginCapital;
    if (matchedMargin) {
      const parsed = parseInt(matchedMargin[0].replace(/,/g, ''), 10);
      if (parsed >= 1000) computedMargin = parsed;
    }

    // Determine region matching prompt text if any
    let region = REGIONS_PRESETS[selectedRegionIndex];
    REGIONS_PRESETS.forEach((r, idx) => {
      if (textToSubmit.toLowerCase().includes(r.village.toLowerCase()) || textToSubmit.toLowerCase().includes(r.district.toLowerCase())) {
        region = r;
        setSelectedRegionIndex(idx);
      }
    });

    // Determine business idea
    let businessIdea = 'Micro Enterprise Unit';
    SECTIONS_PRESETS.forEach((s) => {
      if (textToSubmit.toLowerCase().includes(s.label.toLowerCase()) || textToSubmit.toLowerCase().includes(s.key.toLowerCase())) {
        businessIdea = `${s.label} Unit`;
      }
    });
    if (businessIdea === 'Micro Enterprise Unit' && inputText.length > 5) {
      businessIdea = inputText.slice(0, 40);
    }

    // 2. Generate Feasibility Report
    const generated = generateFeasibilityReport({
      location: region,
      marginCapital: computedMargin,
      businessIdea: businessIdea,
      sectorKey: selectedSectorKey,
      chosenSchemeKey: computedMargin <= 14000 ? 'SCA_MICRO' : 'PMEGP_SUBSIDY'
    });

    setActiveReport(generated);
    if (onReportGenerated) onReportGenerated(generated);

    // Speak audio summary for accessibility
    speak(
      `AI Feasibility Report generated for ${generated.businessIdea} in ${region.village}. Total project cost is ${formatINR(
        generated.financial.totalProjectCost
      )}. 90% loan eligibility is ${formatINR(generated.financial.sanctionedLoan)}.`
    );

    // 3. Construct AI response message with financial breakdown card
    const aiMsg = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: `Based on your input, here is your 10% Margin Financial Structure & Government Scheme match for ${region.village}:`,
      reportData: generated,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputText('');
  };

  const handleChipClick = (chipText) => {
    setInputText(chipText);
    handleProcessInput(chipText);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-md overflow-hidden flex flex-col h-[700px] max-w-4xl mx-auto">
      
      {/* Chat Header */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              {t('chatgptRuralAssistantTitle')}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {t('chatgptRuralAssistantSub')}
            </p>
          </div>
        </div>

        {activeReport && (
          <button
            onClick={onViewFullReport}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all cursor-pointer shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>{t('chatgptViewFullReportBtn')}</span>
          </button>
        )}
      </div>

      {/* GENERATED REPORT HINT BANNER ABOVE CHAT (Saves Data & Gives Hint) */}
      {activeReport && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 p-4 border-b border-emerald-200 shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <Lightbulb className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                {t('chatgptReportHintTitle')}
              </span>
              <p className="text-xs font-extrabold text-slate-800 mt-1 leading-snug">
                {t('chatgptReportHintDesc')}
              </p>
              <span className="text-[11px] text-slate-600 font-semibold block mt-0.5">
                Report ID: <strong className="text-emerald-700">{activeReport.id}</strong> | Project Cost: <strong className="text-emerald-700">{formatINR(activeReport.financial.totalProjectCost)}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={onViewFullReport}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-black bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>{t('chatgptViewFullReportBtn')}</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      )}

      {/* Messages Scroll Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Landmark className="w-4 h-4" />}
            </div>

            {/* Bubble Content */}
            <div
              className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed space-y-3 shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white font-medium rounded-tr-none'
                  : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
              }`}
            >
              <p className="font-semibold">{msg.text}</p>

              {/* If message includes dynamic report breakdown card */}
              {msg.reportData && (
                <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                      <Award className="w-4 h-4 text-emerald-600" /> {msg.reportData.businessIdea}
                    </span>
                    <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                      10% Margin Scheme
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Beneficiary Margin (10%)</span>
                      <span className="font-extrabold text-amber-700">{formatINR(msg.reportData.financial.marginCapital)}</span>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Total Feasible Project Cost</span>
                      <span className="font-extrabold text-emerald-700">{formatINR(msg.reportData.financial.totalProjectCost)}</span>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Net Disbursed Bank Loan (90%)</span>
                      <span className="font-extrabold text-blue-700">{formatINR(msg.reportData.financial.sanctionedLoan)}</span>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Govt Scheme Matched</span>
                      <span className="font-extrabold text-purple-700 line-clamp-1">{PREDEFINED_GOVT_SCHEMES[msg.reportData.financial.schemeCategoryKey]?.name || 'PMEGP Subsidy'}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-medium">
                      Location: <strong>{msg.reportData.location}</strong>
                    </span>
                    <button
                      onClick={onViewFullReport}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>View Full Dashboard</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              <span
                className={`text-[9px] block text-right font-medium opacity-70 ${
                  msg.sender === 'user' ? 'text-slate-300' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-3 bg-white border-t border-slate-200 overflow-x-auto flex items-center gap-2 shrink-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> Quick Prompts:
        </span>
        <button
          onClick={() => handleChipClick(t('chatgptPromptChip1'))}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold whitespace-nowrap transition-all border border-slate-200 cursor-pointer"
        >
          {t('chatgptPromptChip1')}
        </button>
        <button
          onClick={() => handleChipClick(t('chatgptPromptChip2'))}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold whitespace-nowrap transition-all border border-slate-200 cursor-pointer"
        >
          {t('chatgptPromptChip2')}
        </button>
        <button
          onClick={() => handleChipClick(t('chatgptPromptChip3'))}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold whitespace-nowrap transition-all border border-slate-200 cursor-pointer"
        >
          {t('chatgptPromptChip3')}
        </button>
      </div>

      {/* Input Bar with Voice Button */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleProcessInput();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('chatgptAskPlaceholder')}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-10 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white shadow-xs font-medium"
            />
          </div>

          <VoiceButton
            onTranscript={(txt) => {
              setInputText(txt);
              handleProcessInput(txt);
            }}
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white shadow-md transition-all cursor-pointer shrink-0"
            title={t('chatgptSendBtn')}
          >
            <Send className="w-4 h-4 text-emerald-400" />
          </button>
        </form>
      </div>

    </div>
  );
}
