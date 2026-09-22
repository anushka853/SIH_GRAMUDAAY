import React from 'react';
import { ChevronDown, ChevronUp, FileText, Download, Share2 } from 'lucide-react';

export default function ReportCard({ report, isExpanded, onToggle }) {
  if (!report) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-sm">
      {/* Header */}
      <div
        className="p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold text-slate-400">
                {new Date(report.createdAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {report.id}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
              {report.title || report.businessIdea || 'Analysis Report'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {report.location || report.summary}
            </p>
          </div>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-slate-200 dark:border-slate-800 pt-6">
          {report.children}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors flex items-center gap-1.5">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors flex items-center gap-1.5">
              <Share2 className="w-4 h-4" />
              Share Report
            </button>
            <button className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
              Ask Follow-up Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
