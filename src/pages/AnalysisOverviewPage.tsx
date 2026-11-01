import React, { useState } from 'react';
import { Investigation, Question, QuestionStatus, QuestionPriority } from '../types';
import { CharacterAvatar } from '../components/characters/CharacterAvatar';
import { StatusBadge, PriorityBadge } from '../components/ui/StatusBadge';
import { AppStage } from '../components/layout/ProgressTracker';

interface AnalysisOverviewPageProps {
  investigation: Investigation;
  onNavigateStage: (stage: AppStage) => void;
  onSelectQuestionForEvidence?: (questionId: string) => void;
}

export const AnalysisOverviewPage: React.FC<AnalysisOverviewPageProps> = ({
  investigation,
  onNavigateStage,
  onSelectQuestionForEvidence,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [expandedDecisionId, setExpandedDecisionId] = useState<string | null>(null);

  const questions = investigation.questions.filter((q) => q.isSelected !== false);

  // Status counts
  const answeredCount = questions.filter((q) => q.status === 'answered').length;
  const partialCount = questions.filter((q) => q.status === 'partially-answered').length;
  const notFoundCount = questions.filter((q) => q.status === 'not-found').length;
  const conflictCount = questions.filter((q) => q.status === 'conflicting').length;
  const outdatedCount = questions.filter((q) => q.status === 'outdated').length;
  const verifyCount = questions.filter((q) => q.status === 'requires-verification').length;

  const filteredQuestions = questions.filter((q) => {
    if (statusFilter !== 'all' && q.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && q.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Top Banner & Reaction from Chief Detective */}
      <div className="bg-white rounded-3xl border-3 border-[#26334A] p-6 sm:p-8 shadow-[4px_4px_0px_#26334A]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <CharacterAvatar
              id="shinchan"
              size="lg"
              showBadge
              animated
              bubblePlacement="side"
              speechBubble={investigation.characterReactions?.shinchan || "Investigation complete! Let's examine every piece of evidence!"}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-heading font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#8DD9F5] border border-[#26334A] text-[#1E4D69]">
                  Phase 3: Gap Detection Results
                </span>
                <span className="text-xs text-neutral-500 font-semibold">
                  Grounded in {investigation.sources.length} sources
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#26334A]">
                Investigative Findings by Question
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl">
                Every question tested has been evaluated against the text provided. Only facts backed by explicit evidence quotes receive green status.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              type="button"
              onClick={() => onNavigateStage('truth-clash')}
              className="px-3.5 py-2 rounded-xl font-heading font-bold text-xs bg-[#FEE2E2] hover:bg-[#fed1d1] text-[#991B1B] border-2 border-[#991B1B] shadow-[2px_2px_0px_#991B1B] cursor-pointer"
            >
              ⚡ Truth Clash ({conflictCount})
            </button>
            <button
              type="button"
              onClick={() => onNavigateStage('invisible-questions')}
              className="px-3.5 py-2 rounded-xl font-heading font-bold text-xs bg-[#F3E8FF] hover:bg-[#eedbfd] text-[#581C87] border-2 border-[#581C87] shadow-[2px_2px_0px_#581C87] cursor-pointer"
            >
              ❓ Invisible Gaps ({notFoundCount + partialCount})
            </button>
            <button
              type="button"
              onClick={() => onNavigateStage('report')}
              className="px-4 py-2 rounded-xl font-heading font-black text-xs bg-[#FFD84D] hover:bg-[#ffcf29] text-[#26334A] border-2 border-[#26334A] shadow-[2px_2px_0px_#26334A] cursor-pointer"
            >
              📜 View Final Report →
            </button>
          </div>
        </div>

        {/* Real Status Summary Strip */}
        <div className="mt-6 pt-5 border-t border-[#26334A]/15 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <div className="p-2.5 rounded-2xl bg-[#D1F2D9] border border-[#276749] text-center">
            <div className="font-heading font-black text-lg text-[#1E5631]">{answeredCount}</div>
            <div className="text-[11px] font-bold text-[#1E5631]">✅ Answered</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FEF08A] border border-[#854D0E] text-center">
            <div className="font-heading font-black text-lg text-[#854D0E]">{partialCount}</div>
            <div className="text-[11px] font-bold text-[#854D0E]">🟡 Partial</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#F3E8FF] border border-[#581C87] text-center">
            <div className="font-heading font-black text-lg text-[#581C87]">{notFoundCount}</div>
            <div className="text-[11px] font-bold text-[#581C87]">⚪ Not Found</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FEE2E2] border border-[#991B1B] text-center">
            <div className="font-heading font-black text-lg text-[#991B1B]">{conflictCount}</div>
            <div className="text-[11px] font-bold text-[#991B1B]">🔴 Conflict</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FFEDD5] border border-[#9A3412] text-center">
            <div className="font-heading font-black text-lg text-[#9A3412]">{outdatedCount}</div>
            <div className="text-[11px] font-bold text-[#9A3412]">🕰️ Outdated</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#E0F2FE] border border-[#075985] text-center">
            <div className="font-heading font-black text-lg text-[#075985]">{verifyCount}</div>
            <div className="text-[11px] font-bold text-[#075985]">🔍 To Verify</div>
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="bg-[#FFF8E9] rounded-2xl border-2 border-[#26334A] p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-heading font-bold text-[#26334A] mr-1">Filter Status:</span>
          {[
            { id: 'all', label: 'All Statuses' },
            { id: 'answered', label: 'Answered' },
            { id: 'conflicting', label: 'Conflicts' },
            { id: 'not-found', label: 'Not Found' },
            { id: 'outdated', label: 'Outdated' },
            { id: 'requires-verification', label: 'To Verify' },
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setStatusFilter(btn.id)}
              className={`text-xs font-heading font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                statusFilter === btn.id
                  ? 'bg-[#26334A] text-white border-[#26334A]'
                  : 'bg-white text-[#26334A] border-[#26334A]/30 hover:border-[#26334A]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-heading font-bold text-[#26334A] mr-1">Priority:</span>
          {['all', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriorityFilter(p)}
              className={`text-xs font-heading font-bold px-2.5 py-1 rounded-full border uppercase transition-all cursor-pointer ${
                priorityFilter === p
                  ? 'bg-[#FFD84D] text-[#26334A] border-[#26334A] font-black'
                  : 'bg-white text-neutral-600 border-[#26334A]/30 hover:border-[#26334A]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Results Cards */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const isDecExpanded = expandedDecisionId === q.id;

          return (
            <div
              key={q.id}
              className={`rounded-3xl border-3 border-[#26334A] p-5 sm:p-6 shadow-[4px_4px_0px_#26334A] bg-white transition-all`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#26334A]/10">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-heading font-black text-neutral-400">
                    Q{idx + 1}
                  </span>
                  <span className="text-xs font-heading font-bold px-2.5 py-0.5 rounded-full bg-[#FFF8E9] border border-[#26334A]/40 text-[#26334A]">
                    {q.topic}
                  </span>
                  <PriorityBadge priority={q.priority} size="sm" />
                </div>

                <StatusBadge status={q.status || 'not-found'} />
              </div>

              {/* Main Question Text */}
              <h3 className="text-base sm:text-lg font-heading font-black text-[#26334A] mt-3 mb-2">
                {q.text}
              </h3>

              {/* Finding Summary */}
              <div className="bg-[#FFF8E9] rounded-2xl border border-[#26334A]/25 p-3.5 mb-3">
                <span className="text-[11px] font-heading font-black uppercase tracking-wider text-[#26334A]">
                  Investigative Finding:
                </span>
                <p className="text-xs sm:text-sm text-neutral-800 font-semibold mt-0.5">
                  {q.findingSummary || 'No data recorded.'}
                </p>
              </div>

              {/* Exact Evidence Excerpts (if any) */}
              {q.evidence && q.evidence.length > 0 && (
                <div className="space-y-2 mb-3">
                  <span className="text-[11px] font-heading font-black uppercase tracking-wider text-[#1E5631]">
                    Exact Substring Evidence Quotes:
                  </span>
                  {q.evidence.map((ev, evIdx) => (
                    <div
                      key={evIdx}
                      className="bg-white rounded-xl border border-[#26334A] p-3 text-xs shadow-xs font-serif"
                    >
                      <div className="flex items-center justify-between text-[11px] font-sans font-bold text-neutral-600 mb-1">
                        <span>📄 {ev.sourceTitle}</span>
                        <span className="text-neutral-500 font-normal">
                          {ev.sourceDate}
                        </span>
                      </div>
                      <p className="text-neutral-900 bg-[#FEF9C3]/50 p-1.5 rounded border border-[#FEF08A]">
                        "{ev.excerpt}"
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Next Step / Verification Action */}
              {q.suggestedNextStep && (
                <div className="flex items-start gap-2 bg-[#F0FDF4] rounded-xl border border-[#86EFAC] p-2.5 text-xs text-[#166534] mb-3">
                  <span className="text-sm">🧭</span>
                  <div>
                    <strong>Suggested Action:</strong> {q.suggestedNextStep}
                  </div>
                </div>
              )}

              {/* "How we decided" Drawer (Section 5 Requirement) */}
              <div className="pt-2 border-t border-[#26334A]/10">
                <button
                  type="button"
                  onClick={() => setExpandedDecisionId(isDecExpanded ? null : q.id)}
                  className="text-xs font-heading font-bold text-neutral-600 hover:text-[#26334A] flex items-center gap-1 cursor-pointer"
                >
                  <span>{isDecExpanded ? '▼ Hide' : '▶ How we decided'}</span>
                  <span className="text-[11px] text-neutral-500 font-normal">
                    (transparent rule logic)
                  </span>
                </button>

                {isDecExpanded && (
                  <div className="mt-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 space-y-1">
                    <p>
                      <strong>Rule Triggered:</strong> {q.decisionReason || 'Direct keyword & sentence evaluation.'}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Keywords matched:{' '}
                      {q.keywords ? q.keywords.slice(0, 5).join(', ') : 'none'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
