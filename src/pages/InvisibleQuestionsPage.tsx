import React, { useState } from 'react';
import { Investigation, Question } from '../types';
import { CharacterAvatar } from '../components/characters/CharacterAvatar';
import { PriorityBadge } from '../components/ui/StatusBadge';

interface InvisibleQuestionsPageProps {
  investigation: Investigation;
  onNavigateToReport: () => void;
}

export const InvisibleQuestionsPage: React.FC<InvisibleQuestionsPageProps> = ({
  investigation,
  onNavigateToReport,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'not-found' | 'ambiguous'>('all');

  // Filter questions that are non-green / gaps
  const gapQuestions = investigation.questions.filter(
    (q) =>
      q.isSelected !== false &&
      (q.status === 'not-found' ||
        q.status === 'partially-answered' ||
        q.status === 'requires-verification')
  );

  const confirmedMissing = gapQuestions.filter((q) => q.gapCategory === 'confirmed-missing');
  const notFound = gapQuestions.filter((q) => q.gapCategory === 'not-found' || !q.gapCategory);
  const ambiguous = gapQuestions.filter(
    (q) => q.gapCategory === 'ambiguous' || q.status === 'requires-verification' || q.status === 'partially-answered'
  );

  const displayedQuestions =
    activeTab === 'confirmed'
      ? confirmedMissing
      : activeTab === 'not-found'
      ? notFound
      : activeTab === 'ambiguous'
      ? ambiguous
      : gapQuestions;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Header with Nene Avatar */}
      <div className="bg-white rounded-3xl border-3 border-[#26334A] p-6 sm:p-8 shadow-[4px_4px_0px_#26334A]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <CharacterAvatar
              id="nene"
              size="lg"
              showBadge
              animated
              bubblePlacement="side"
              speechBubble={
                gapQuestions.length > 0
                  ? `Nene found ${gapQuestions.length} invisible questions! The websites you checked didn't mention these at all!`
                  : `Incredible! Every single question in your library was found in your sources!`
              }
            />

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-heading font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FF9DAB] border border-[#26334A] text-[#7A1D2D]">
                  Nene's Mystery Desk
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF0F2] text-[#872535] font-bold border border-[#FF9DAB]">
                  {gapQuestions.length} Invisible Question{gapQuestions.length === 1 ? '' : 's'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#26334A]">
                Invisible Questions (Information Dark Spots)
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl">
                The biggest decision mistakes happen not from wrong answers, but from questions you forgot to ask. Here are the gaps omitted from your sources.
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

        {/* 3 Categories Tabs */}
        <div className="mt-8 pt-5 border-t border-[#26334A]/15 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-2xl font-heading font-bold text-xs border-2 transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#26334A] text-white border-[#26334A] shadow-[2px_2px_0px_#FF9DAB]'
                : 'bg-white text-[#26334A] border-[#26334A]/30 hover:border-[#26334A]'
            }`}
          >
            All Gaps ({gapQuestions.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('confirmed')}
            className={`px-3.5 py-2 rounded-2xl font-heading font-bold text-xs border-2 transition-all cursor-pointer ${
              activeTab === 'confirmed'
                ? 'bg-[#FF9DAB] text-[#7A1D2D] border-[#7A1D2D] shadow-[2px_2px_0px_#26334A]'
                : 'bg-white text-neutral-700 border-[#26334A]/30 hover:border-[#26334A]'
            }`}
          >
            Confirmed Missing from Sources ({confirmedMissing.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('not-found')}
            className={`px-3.5 py-2 rounded-2xl font-heading font-bold text-xs border-2 transition-all cursor-pointer ${
              activeTab === 'not-found'
                ? 'bg-[#C8B6F0] text-[#3F2B66] border-[#3F2B66] shadow-[2px_2px_0px_#26334A]'
                : 'bg-white text-neutral-700 border-[#26334A]/30 hover:border-[#26334A]'
            }`}
          >
            Not Found in Reviewed Sources ({notFound.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ambiguous')}
            className={`px-3.5 py-2 rounded-2xl font-heading font-bold text-xs border-2 transition-all cursor-pointer ${
              activeTab === 'ambiguous'
                ? 'bg-[#8DD9F5] text-[#1E4D69] border-[#1E4D69] shadow-[2px_2px_0px_#26334A]'
                : 'bg-white text-neutral-700 border-[#26334A]/30 hover:border-[#26334A]'
            }`}
          >
            May Exist, Needs Further Verification ({ambiguous.length})
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {displayedQuestions.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white rounded-3xl border-3 border-[#26334A] p-6 shadow-[4px_4px_0px_#26334A] space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#26334A]/10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-heading font-black text-neutral-400">
                  Gap #{idx + 1}
                </span>
                <span className="text-xs font-heading font-bold px-2.5 py-0.5 rounded-full bg-[#FFF8E9] border border-[#26334A]/30 text-[#26334A]">
                  {q.topic}
                </span>
                <PriorityBadge priority={q.priority} size="sm" />
              </div>

              <span
                className={`text-xs font-heading font-bold px-3 py-1 rounded-full border ${
                  q.gapCategory === 'confirmed-missing'
                    ? 'bg-[#FEE2E2] text-[#991B1B] border-[#991B1B]'
                    : q.status === 'requires-verification'
                    ? 'bg-[#E0F2FE] text-[#075985] border-[#075985]'
                    : 'bg-[#F3E8FF] text-[#581C87] border-[#581C87]'
                }`}
              >
                {q.gapCategory === 'confirmed-missing'
                  ? 'Confirmed Missing'
                  : q.status === 'requires-verification'
                  ? 'Unverified Hint'
                  : 'Not Found in Provided Text'}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-heading font-black text-[#26334A]">
              {q.text}
            </h3>

            {/* Why It Matters */}
            <div className="bg-[#FFF0F2] rounded-2xl border border-[#FF9DAB] p-3.5 text-xs sm:text-sm">
              <span className="font-heading font-bold text-[#872535] block mb-0.5">
                💡 Why this omission matters:
              </span>
              <p className="text-neutral-800 leading-relaxed font-medium">
                {q.whyItMatters}
              </p>
            </div>

            {/* Finding / Context */}
            <div className="text-xs text-neutral-600 bg-neutral-50 rounded-xl p-3 border border-neutral-200">
              <strong>Audit Observation:</strong> {q.findingSummary}
            </div>

            {/* Suggested Source to Consult */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-[#26334A]/10">
              <div className="flex items-center gap-2 text-[#26334A]">
                <span className="text-base">🏛️</span>
                <span>
                  <strong>Suggested Primary Source:</strong>{' '}
                  <span className="underline font-semibold">{q.suggestedSource || 'Official Primary Authority'}</span>
                </span>
              </div>

              <span className="text-neutral-500 italic">
                (Rule: "Not found in the sources you gave us", never "does not exist")
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
