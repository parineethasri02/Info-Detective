import React from 'react';
import { Investigation } from '../types';
import { CharacterAvatar } from '../components/characters/CharacterAvatar';

interface ConfidenceCompassPageProps {
  investigation: Investigation;
  onNavigateToReport: () => void;
}

export const ConfidenceCompassPage: React.FC<ConfidenceCompassPageProps> = ({
  investigation,
  onNavigateToReport,
}) => {
  const scoring = investigation.scoring;
  const questions = investigation.questions.filter((q) => q.isSelected !== false);

  const officialSourcesCount = investigation.sources.filter((s) => s.sourceType === 'official').length;
  const thirdPartySourcesCount = investigation.sources.filter(
    (s) => s.sourceType === 'third-party' || s.sourceType === 'news'
  ).length;

  const answeredWithQuotesCount = questions.filter(
    (q) => q.status === 'answered' && q.evidence && q.evidence.length > 0
  ).length;

  const traceabilityPercentage =
    questions.length > 0 ? Math.round((answeredWithQuotesCount / questions.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Header with Shinchan Chief Detective Avatar */}
      <div className="bg-white rounded-3xl border-3 border-[#26334A] p-6 sm:p-8 shadow-[4px_4px_0px_#26334A]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <CharacterAvatar
              id="shinchan"
              size="lg"
              showBadge
              animated
              bubblePlacement="side"
              speechBubble="Here is our Confidence Compass! No fake AI confidence numbers here—every percentage is calculated from transparent math!"
            />

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-heading font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFD84D] border border-[#26334A] text-[#26334A]">
                  Completeness Dashboard
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF8E9] border border-[#26334A] font-bold text-[#26334A]">
                  {scoring?.scorePercentage || 0}% Weighted Coverage
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#26334A]">
                Confidence Compass & Metric Breakdown
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl">
                A transparent reliability overview based solely on what the submitted sources actually proved.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToReport}
            className="px-4 py-2.5 rounded-2xl font-heading font-black text-xs sm:text-sm bg-[#FFD84D] hover:bg-[#ffcf29] text-[#26334A] border-2 border-[#26334A] shadow-[2px_2px_0px_#26334A] cursor-pointer whitespace-nowrap"
          >
            Checklist in Report →
          </button>
        </div>

        {/* Mandatory Transparency Label */}
        <div className="mt-6 pt-4 border-t border-[#26334A]/15 bg-[#FFF8E9] rounded-2xl p-4 border-2 border-[#FFD84D] flex items-center gap-3">
          <span className="text-2xl">🧭</span>
          <div>
            <p className="text-xs sm:text-sm font-heading font-bold text-[#26334A]">
              Estimate of research coverage, not a guarantee of truth.
            </p>
            <p className="text-xs text-neutral-600 mt-0.5">
              This score measures the percentage of your essential questions covered by verifiable evidence in your submitted sources. It never pretends to be a psychic guarantee of real-world outcome.
            </p>
          </div>
        </div>
      </div>

      {/* Main Score Visual & Four-Part Legend */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Coverage Compass Gauge Card */}
        <div className="md:col-span-5 bg-white rounded-3xl border-3 border-[#26334A] p-6 sm:p-8 shadow-[4px_4px_0px_#26334A] flex flex-col items-center justify-center text-center">
          <span className="text-xs font-heading font-black uppercase tracking-wider text-neutral-500 mb-2">
            Research Coverage Indicator
          </span>

          {/* Compass Dial SVG */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center my-3">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="12"
              />
              {/* Progress arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#FFD84D"
                strokeWidth="12"
                strokeDasharray={`${(scoring?.scorePercentage || 0) * 2.51} 251.2`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-5xl font-heading font-black text-[#26334A]">
                {scoring?.scorePercentage || 0}%
              </span>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Coverage
              </span>
            </div>
          </div>

          <p className="text-xs font-semibold text-neutral-700 mt-2">
            Earned {scoring?.totalEarnedWeight || 0} pts out of {scoring?.maxPossibleWeight || 0} max weighted points.
          </p>
        </div>

        {/* Four-Part Legend & Transparency Taxonomy Card */}
        <div className="md:col-span-7 bg-white rounded-3xl border-3 border-[#26334A] p-6 sm:p-8 shadow-[4px_4px_0px_#26334A] flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-black text-lg text-[#26334A] mb-1">
              Evidence Taxonomy Legend
            </h3>
            <p className="text-xs text-neutral-600 mb-4">
              Clear distinction between facts backed by quotes, automated checks, and unverified elements.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#D1F2D9]/40 border border-[#276749]">
                <span className="text-lg">🟢</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-xs text-[#1E5631]">
                      Sourced Facts ({scoring?.legend.sourcedFacts || 0})
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#D1F2D9] text-[#1E5631] font-bold">
                      Exact Quotes
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Backed by verbatim substring quotes extracted from your submitted documents.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FEE2E2]/40 border border-[#991B1B]">
                <span className="text-lg">🔴</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-xs text-[#991B1B]">
                      Automated Comparisons ({scoring?.legend.automatedComparisons || 0})
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#FEE2E2] text-[#991B1B] font-bold">
                      Truth Clash
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Regex & sentence attribute comparison detecting conflicting dates or financial values.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#E0F2FE]/40 border border-[#075985]">
                <span className="text-lg">💡</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-xs text-[#075985]">
                      AI-Generated Suggestions ({scoring?.legend.aiSuggestions || 0})
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#E0F2FE] text-[#075985] font-bold">
                      Hypothesis Only
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Suggested investigation angles. Never presented or counted as verified facts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F3E8FF]/40 border border-[#581C87]">
                <span className="text-lg">🟣</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-xs text-[#581C87]">
                      Unresolved Uncertainties ({scoring?.legend.unresolvedUncertainties || 0})
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#F3E8FF] text-[#581C87] font-bold">
                      Needs Verification
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Questions completely absent, partially covered, or sourced from undated/unofficial notes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Key Completeness Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border-2 border-[#26334A] p-4 text-center shadow-xs">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-xl font-heading font-black text-[#26334A]">
            {scoring?.scorePercentage || 0}%
          </div>
          <div className="text-[11px] font-bold text-neutral-600">Info Coverage</div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-[#26334A] p-4 text-center shadow-xs">
          <div className="text-2xl mb-1">❓</div>
          <div className="text-xl font-heading font-black text-[#581C87]">
            {scoring?.notFoundCount || 0}
          </div>
          <div className="text-[11px] font-bold text-neutral-600">Unanswered Gaps</div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-[#26334A] p-4 text-center shadow-xs">
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-xl font-heading font-black text-[#991B1B]">
            {scoring?.conflictCount || 0}
          </div>
          <div className="text-[11px] font-bold text-neutral-600">Potential Conflicts</div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-[#26334A] p-4 text-center shadow-xs">
          <div className="text-2xl mb-1">🕰️</div>
          <div className="text-xl font-heading font-black text-[#9A3412]">
            {scoring?.outdatedCount || 0}
          </div>
          <div className="text-[11px] font-bold text-neutral-600">Potentially Outdated</div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-[#26334A] p-4 text-center shadow-xs">
          <div className="text-2xl mb-1">🏛️</div>
          <div className="text-xl font-heading font-black text-[#1E5631]">
            {officialSourcesCount}/{investigation.sources.length}
          </div>
          <div className="text-[11px] font-bold text-neutral-600">Official Sources</div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-[#26334A] p-4 text-center shadow-xs">
          <div className="text-2xl mb-1">🔎</div>
          <div className="text-xl font-heading font-black text-[#442E70]">
            {traceabilityPercentage}%
          </div>
          <div className="text-[11px] font-bold text-neutral-600">Traceability Rate</div>
        </div>
      </div>

      {/* Visible Mathematical Scoring Formula (Section 4 & 5 Requirement) */}
      <div className="bg-[#FFFDF5] rounded-3xl border-3 border-[#26334A] p-6 shadow-[4px_4px_0px_#26334A] space-y-4">
        <h3 className="font-heading font-black text-lg text-[#26334A] flex items-center gap-2">
          <span>📐 The Mathematical Coverage Formula</span>
          <span className="text-xs px-2 py-0.5 rounded bg-[#FFD84D] border border-[#26334A] font-bold">
            Transparent Rules
          </span>
        </h3>

        <div className="p-4 bg-white rounded-2xl border-2 border-[#26334A] font-mono text-xs text-neutral-800 space-y-2">
          <p className="font-bold text-[#26334A] text-sm">
            Research Coverage Score = (∑ Earned Weights / ∑ Maximum Possible Weights) × 100
          </p>
          <div className="border-t border-neutral-200 pt-2 space-y-1 text-[11px]">
            <p>• High Priority Question = 3 pts maximum weight</p>
            <p>• Medium Priority Question = 2 pts maximum weight</p>
            <p>• Low Priority Question = 1 pt maximum weight</p>
            <p className="text-emerald-700 font-bold">
              • Status "Answered with Evidence" = 100% of weight earned (1.0 × weight)
            </p>
            <p className="text-amber-700 font-bold">
              • Status "Partially Answered" = 50% of weight earned (0.5 × weight)
            </p>
            <p className="text-red-700 font-bold">
              • Statuses "Conflicting", "Outdated", "Requires Verification", "Not Found" = 0% of verified coverage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
