import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Paperclip, Mic, Send, ChevronDown, ChevronUp, Landmark } from 'lucide-react';

export default function ChatWorkspace() {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [reports, setReports] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedReports, setExpandedReports] = useState(new Set());
  const textareaRef = useRef(null);

  const suggestions = [
    t('chat.suggestion1') || 'Analyze enterprise survival in Bihar',
    t('chat.suggestion2') || 'Show government funding distribution',
    t('chat.suggestion3') || 'Compare district performance metrics',
    t('chat.suggestion4') || 'Generate a scheme allocation report',
  ];

  const handleSubmit = async (queryText) => {
    if (!queryText.trim()) return;

    const newReport = {
      id: `report-${Date.now()}`,
      query: queryText,
      createdAt: new Date().toISOString(),
      status: 'loading',
      summary: null,
      keyMetrics: [],
      insights: [],
      sources: [],
    };

    setReports((prev) => [newReport, ...prev]);
    setExpandedReports((prev) => new Set([...prev, newReport.id]));
    setInput('');
    setIsGenerating(true);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setTimeout(() => {
      let mockSummary = (t('chat.mockSummary') || `Analysis completed for: "{query}"`).replace('{query}', queryText);
      let mockMetrics = [
        { label: t('chat.totalEnterprises') || 'Total Enterprises', value: '11,640', trend: '+12%' },
        { label: t('chat.successRate') || 'Success Rate', value: '88.4%', trend: '+5%' },
        { label: t('chat.avgLoanSize') || 'Avg Loan Size', value: '₹8.2L', trend: '+8%' },
      ];
      let mockInsights = [
        t('chat.insight1') || 'Rural enterprise survival rates have improved significantly.',
        t('chat.insight2') || 'Government scheme utilization is increasing across districts.',
        t('chat.insight3') || 'Digital adoption in rural banking is accelerating.',
      ];
      
      const qLower = queryText.toLowerCase();
      
      if (qLower.includes('bihar') || qLower.includes('survival')) {
        mockSummary = 'Enterprise Survival Analysis for Bihar State (2024-2026). The data indicates a steady improvement in enterprise longevity, driven primarily by Food Processing and Handloom sectors.';
        mockMetrics = [
          { label: 'Enterprises Tracked', value: '3,450', trend: '+15%' },
          { label: '3-Year Survival', value: '72.8%', trend: '+8%' },
          { label: 'Top Sector', value: 'Agri-Processing', trend: '' },
        ];
        mockInsights = [
          'Food processing units in Madhubani show the highest 3-year survival rate (81%).',
          'Access to DAY-NRLM subvention loans improved survival rates by 24%.',
          'Logistics constraints remain the primary failure cause for remote blocks.',
        ];
      } else if (qLower.includes('funding distribution') || qLower.includes('distribution')) {
        mockSummary = 'Government Funding Distribution across active rural schemes. PMEGP and DAY-NRLM account for the majority of disbursed capital this fiscal year.';
        mockMetrics = [
          { label: 'Total Disbursed', value: '₹452 Cr', trend: '+22%' },
          { label: 'PMEGP Share', value: '45%', trend: '+5%' },
          { label: 'Avg Subsidy', value: '₹1.8L', trend: '+12%' },
        ];
        mockInsights = [
          'PMEGP utilization is highest in Maharashtra and Gujarat.',
          'Micro-finance loans (under ₹1.40L) have the fastest approval time (avg 8 days).',
          'Solar Agri-enterprises under PM-KUSUM received ₹85 Cr in capital subsidies.',
        ];
      } else if (qLower.includes('compare district') || qLower.includes('metrics')) {
        mockSummary = 'District Performance Comparison: Assessing approval rates, NPA levels, and enterprise growth across top 5 districts.';
        mockMetrics = [
          { label: 'Highest Growth', value: 'Kolhapur', trend: '28%' },
          { label: 'Lowest NPA', value: 'Anand', trend: '1.2%' },
          { label: 'Total Jobs Created', value: '14,200', trend: '+18%' },
        ];
        mockInsights = [
          'Kolhapur shows exceptional growth in Dairy cooperatives.',
          'Anand maintains the lowest NPA due to strong peer-monitoring networks.',
          'Varanasi North exhibits high demand for Textile modernization loans.',
        ];
      } else if (qLower.includes('scheme allocation') || qLower.includes('report')) {
        mockSummary = 'Scheme Allocation Report for FY2026. The data highlights the distribution of concessional credit and subsidies across sectors.';
        mockMetrics = [
          { label: 'Total Allocation', value: '₹1,250 Cr', trend: '0%' },
          { label: 'Utilized', value: '₹890 Cr', trend: '71%' },
          { label: 'Pending Apps', value: '4,520', trend: '-10%' },
        ];
        mockInsights = [
          '71% of the total budget has been utilized by Q3.',
          'Agri-infrastructure holds the largest pending queue due to verification delays.',
          'Women SHGs received 38% of total disbursed subsidies.',
        ];
      }

      setReports((prev) =>
        prev.map((r) =>
          r.id === newReport.id
            ? {
                ...r,
                status: 'success',
                summary: mockSummary,
                keyMetrics: mockMetrics,
                insights: mockInsights,
                sources: [t('chat.source1') || 'Government District Database', t('chat.source2') || 'SCA Bank Records', t('chat.source3') || 'AI Analysis Engine'],
              }
            : r
        )
      );
      setIsGenerating(false);
    }, 1800);
  };

  const toggleReport = (id) => {
    setExpandedReports((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 120px)' }}>
      {/* Content */}
      <div className="flex-1 pb-36">
        {reports.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center pt-20 pb-8 text-center space-y-6 max-w-2xl mx-auto">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--text-primary)' }}
            >
              <Landmark className="w-5.5 h-5.5 text-white" style={{ width: '1.375rem', height: '1.375rem' }} />
            </div>

            <div>
              <h2
                className="text-2xl font-700 mb-2"
                style={{ color: 'var(--text-primary)', fontWeight: 700, letterSpacing: '-0.025em' }}
              >
                {t('chat.askAnything') || 'Ask GramUday AI anything'}
              </h2>
              <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                {t('chat.exploreDesc') || 'Explore rural enterprises, government schemes, district performance, and funding insights.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-4">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubmit(s)}
                  className="p-4 rounded-xl text-left text-sm transition-all"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-strong)';
                    e.currentTarget.style.background = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                    e.currentTarget.style.background = 'var(--bg-surface)';
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {reports.map((report, index) => {
              const isExpanded = expandedReports.has(report.id);
              return (
                <div
                  key={report.id}
                  className="rounded-xl overflow-hidden transition-all"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
                >
                  {/* Report header */}
                  <div
                    className="p-5 cursor-pointer transition-colors"
                    onClick={() => toggleReport(report.id)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {new Date(report.createdAt).toLocaleString('en-US', {
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                            })}
                          </span>
                          {report.status === 'loading' && (
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('chat.analyzing') || 'Analyzing...'}</span>
                          )}
                          {report.status === 'success' && (
                            <span className="text-xs font-500" style={{ color: 'var(--emerald)' }}>{t('chat.complete') || 'Complete'}</span>
                          )}
                        </div>
                        <h3 className="text-base font-600" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                          {report.query}
                        </h3>
                        {report.summary && !isExpanded && (
                          <p className="text-sm mt-1 line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
                            {report.summary}
                          </p>
                        )}
                      </div>
                      <button style={{ color: 'var(--text-muted)' }}>
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Report body */}
                  {isExpanded && (
                    <div
                      className="px-5 pb-5 space-y-5"
                      style={{ borderTop: '1px solid var(--border-subtle)' }}
                    >
                      <div className="pt-5" />
                      {report.status === 'loading' && (
                        <div className="space-y-3">
                          {[0.75, 1, 0.6].map((w, i) => (
                            <div
                              key={i}
                              className="h-3.5 rounded pulse-subtle"
                              style={{ background: 'var(--bg-elevated)', width: `${w * 100}%` }}
                            />
                          ))}
                        </div>
                      )}

                      {report.status === 'success' && (
                        <>
                          {/* Summary */}
                          <div>
                            <h4 className="text-sm font-600 mb-2" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                              {t('chat.summary') || 'Summary'}
                            </h4>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                              {report.summary}
                            </p>
                          </div>

                          {/* Key Metrics */}
                          {report.keyMetrics.length > 0 && (
                            <div>
                              <h4 className="text-sm font-600 mb-3" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                                {t('chat.keyMetrics') || 'Key Metrics'}
                              </h4>
                              <div className="grid grid-cols-3 gap-3">
                                {report.keyMetrics.map((m, i) => (
                                  <div
                                    key={i}
                                    className="p-4 rounded-xl"
                                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
                                  >
                                    <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{m.label}</div>
                                    <div className="text-xl font-700" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{m.value}</div>
                                    {m.trend && (
                                      <div className="text-xs mt-1 font-500" style={{ color: 'var(--emerald)' }}>{m.trend}</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Insights */}
                          {report.insights.length > 0 && (
                            <div>
                              <h4 className="text-sm font-600 mb-2" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                                {t('chat.keyInsights') || 'Key Insights'}
                              </h4>
                              <ul className="space-y-2">
                                {report.insights.map((insight, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--emerald)' }} />
                                    {insight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Sources */}
                          {report.sources.length > 0 && (
                            <div>
                              <h4 className="text-sm font-600 mb-2" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                                {t('chat.sources') || 'Sources'}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {report.sources.map((s, i) => (
                                  <span
                                    key={i}
                                    className="text-xs px-3 py-1 rounded-full"
                                    style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-4 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                            {[
                              t('chat.exportPdf') || 'Export PDF',
                              t('chat.copySummary') || 'Copy Summary',
                              t('chat.askFollowUp') || 'Ask Follow-up'
                            ].map((action, i) => (
                              <button
                                key={action}
                                className="text-xs font-500 transition-colors"
                                style={{ color: i === 2 ? 'var(--emerald)' : 'var(--text-muted)', fontWeight: 500 }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = i === 2 ? '#047857' : 'var(--text-primary)')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = i === 2 ? 'var(--emerald)' : 'var(--text-muted)')}
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Fixed Chat Input ─── */}
      <div
        className="fixed bottom-0 left-0 right-0 md:left-[var(--sidebar-width)] px-4 sm:px-6 lg:px-8 pb-6 pt-4"
        style={{ background: 'var(--bg-page)', borderTop: '1px solid var(--border-subtle)' }}
      >
        <div className="max-w-3xl mx-auto">
          <div
            className="relative rounded-xl"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-md)' }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(input);
                }
              }}
              placeholder={t('chat.placeholder') || 'Ask anything about rural enterprises, schemes, or districts...'}
              rows={1}
              className="w-full resize-none px-4 py-3.5 pr-24 text-sm bg-transparent outline-none"
              style={{ color: 'var(--text-primary)', maxHeight: '140px', overflowY: 'auto' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
              }}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <button
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                disabled={!input.trim() || isGenerating}
                onClick={() => handleSubmit(input)}
                className="p-2 rounded-lg transition-all"
                style={{
                  background: input.trim() && !isGenerating ? 'var(--text-primary)' : 'var(--bg-elevated)',
                  color: input.trim() && !isGenerating ? 'white' : 'var(--text-muted)',
                }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
