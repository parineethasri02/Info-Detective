import React from 'react';
import { Investigation } from '../types';
import { CharacterAvatar } from '../components/characters/CharacterAvatar';
import { PriorityBadge } from '../components/ui/StatusBadge';

interface TimeTravellerPageProps {
  investigation: Investigation;
  onNavigateToReport: () => void;
}

export const TimeTravellerPage: React.FC<TimeTravellerPageProps> = ({
  investigation,
  onNavigateToReport,
}) => {
  const sources = [...investigation.sources].sort((a, b) => {
    const dateA = a.publicationDate || '0000-00-00';
    const dateB = b.publicationDate || '0000-00-00';
    return dateB.localeCompare(dateA);
  });

  const outdatedQuestions = investigation.questions.filter(
    (q) => q.status === 'outdated' || q.secondaryFlags?.includes('outdated')
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Header with Masao Avatar */}
      <div className="bg-white rounded-3xl border-3 border-[#26334A] p-6 sm:p-8 shadow-[4px_4px_0px_#26334A]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <CharacterAvatar
              id="masao"
              size="lg"
              showBadge
              animated
              bubblePlacement="side"
              speechBubble={
                outdatedQuestions.length > 0
                  ? `Watch out! Some of your sources are from earlier years or cycles! Don't let old circulars trick you!`
                  : `Timeline checked! All dated sources appear synchronized, but remember to verify undated posts!`
              }
            />

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-heading font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFC49D] border border-[#26334A] text-[#7A3E1B]">
                  Masao's Chronology Bureau
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFEDD5] text-[#9A3412] font-bold border border-[#9A3412]">
                  {sources.length} Sources in Timeline
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#26334A]">
                Time Traveller (Freshness & Cycle Timeline)
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl">
                Policies, costs, and deadlines change every cycle. Masao maps each source to its true cycle and flags outdated remnants.
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

        {/* Masao's Rule Banner */}
        <div className="mt-6 pt-4 border-t border-[#26334A]/15 bg-[#FFF6EF] rounded-2xl p-3 border border-[#FFC49D] flex items-center gap-3">
          <span className="text-2xl">⏳</span>
          <p className="text-xs text-[#7A3E1B] leading-snug">
            <strong>Chronological Honesty Rule:</strong> NEVER assume an undated source is outdated without proof. We label it <span className="underline font-bold">"Undated, needs verification"</span>. And we never declare a newer source correct solely because it was published recently.
          </p>
        </div>
      </div>

      {/* Outdated Questions Alert Deck */}
      {outdatedQuestions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-black text-[#9A3412] flex items-center gap-2">
            <span>🕰️ Findings Sourced from Older Cycles ({outdatedQuestions.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outdatedQuestions.map((q) => (
              <div
                key={q.id}
                className="bg-[#FFF8E9] rounded-3xl border-3 border-[#9A3412] p-5 shadow-[4px_4px_0px_#9A3412] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-heading font-bold px-2 py-0.5 rounded-full bg-white border border-[#9A3412] text-[#9A3412]">
                    {q.topic}
                  </span>
                  <PriorityBadge priority={q.priority} size="sm" />
                </div>

                <h3 className="font-heading font-black text-base text-[#26334A]">
                  {q.text}
                </h3>

                <div className="p-3 bg-white rounded-xl border border-[#9A3412]/30 text-xs text-neutral-800">
                  <p className="font-semibold text-[#9A3412] mb-1">Outdated Cycle Warning:</p>
                  <p>{q.findingSummary}</p>
                </div>

                <div className="text-xs text-neutral-600 bg-white/70 p-2 rounded-lg">
                  <strong>Verification Step:</strong> {q.suggestedNextStep}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Timeline of Sources */}
      <div className="bg-white rounded-3xl border-3 border-[#26334A] p-6 sm:p-8 shadow-[4px_4px_0px_#26334A] space-y-6">
        <h2 className="text-xl font-heading font-black text-[#26334A] flex items-center gap-2">
          <span>📅 Source Chronology & Freshness Spectrum</span>
        </h2>

        <div className="relative pl-6 sm:pl-8 border-l-3 border-[#26334A] space-y-8">
          {sources.map((src, idx) => {
            const hasDate = Boolean(src.publicationDate);
            const isPriorYear = src.cycleOrYear?.includes('2025') || src.publicationDate?.startsWith('2024');
            const isCurrentYear = src.cycleOrYear?.includes('2026') || src.publicationDate?.startsWith('2025');

            return (
              <div key={src.id} className="relative group">
                {/* Timeline Node Dot */}
                <div
                  className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 rounded-full border-2 border-[#26334A] flex items-center justify-center text-xs font-bold shadow-[1px_1px_0px_#26334A] ${
                    isCurrentYear
                      ? 'bg-[#8DD9F5] text-[#1E4D69]'
                      : isPriorYear
                      ? 'bg-[#FFC49D] text-[#7A3E1B]'
                      : 'bg-[#C8B6F0] text-[#3F2B66]'
                  }`}
                >
                  {idx + 1}
                </div>

                <div className="bg-[#FFF8E9] rounded-2xl border-2 border-[#26334A] p-5 shadow-[3px_3px_0px_#26334A] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading font-bold text-sm text-[#26334A]">
                        {src.title}
                      </span>
                      <span
                        className={`text-[10px] font-heading font-bold px-2 py-0.5 rounded-full border border-[#26334A] uppercase ${
                          src.sourceType === 'official'
                            ? 'bg-[#D1F2D9] text-[#1E5631]'
                            : 'bg-white text-neutral-700'
                        }`}
                      >
                        {src.sourceType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-heading font-bold px-2.5 py-0.5 rounded-full border ${
                          hasDate
                            ? 'bg-white border-[#26334A] text-[#26334A]'
                            : 'bg-[#FFEDD5] border-[#9A3412] text-[#9A3412]'
                        }`}
                      >
                        {hasDate
                          ? `Published: ${src.publicationDate}`
                          : 'Undated, needs verification'}
                      </span>
                      {src.cycleOrYear && (
                        <span className="text-xs font-heading font-bold px-2.5 py-0.5 rounded-full bg-[#FFD84D] border border-[#26334A] text-[#26334A]">
                          {src.cycleOrYear}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-700 font-serif line-clamp-2 bg-white/70 p-2.5 rounded-xl border border-[#26334A]/10">
                    "{src.content}"
                  </p>

                  <div className="text-[11px] text-neutral-500 flex items-center justify-between">
                    <span>Domain: {src.domain}</span>
                    <span>Retrieved by user: {src.retrievedDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
