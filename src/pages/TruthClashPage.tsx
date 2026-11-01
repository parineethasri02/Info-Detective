import React from 'react';
import { Investigation } from '../types';
import { CharacterAvatar } from '../components/characters/CharacterAvatar';
import { PriorityBadge } from '../components/ui/StatusBadge';

interface TruthClashPageProps {
  investigation: Investigation;
  onNavigateToReport: () => void;
}

export const TruthClashPage: React.FC<TruthClashPageProps> = ({
  investigation,
  onNavigateToReport,
}) => {
  const clashes = investigation.truthClashes || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Header with Kazama Avatar */}
      <div className="bg-white rounded-3xl border-3 border-[#26334A] p-6 sm:p-8 shadow-[4px_4px_0px_#26334A]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <CharacterAvatar
              id="kazama"
              size="lg"
              showBadge
              animated
              bubblePlacement="side"
              speechBubble={
                clashes.length > 0
                  ? `Logic clash detected! Source A and Source B disagree on critical dates or terms! Don't assume the blog is right just because it is newer!`
                  : `No truth clashes detected between your sources. But check for missing questions with Nene!`
              }
            />

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-heading font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#8DD9F5] border border-[#26334A] text-[#1E4D69]">
                  Kazama's Logic Desk
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#991B1B] font-bold border border-[#991B1B]">
                  {clashes.length} Contradiction{clashes.length === 1 ? '' : 's'} Detected
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#26334A]">
                Truth Clash Investigation
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl">
                Contradictory claims between independent sources are displayed side-by-side. We never automatically declare a newer source correct without primary validation.
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

        {/* Honesty Caution Strip */}
        <div className="mt-6 pt-4 border-t border-[#26334A]/15 bg-[#FFF2F1] rounded-2xl p-3 border border-[#FFAAA6] flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <p className="text-xs text-[#7A1D2D] leading-snug">
            <strong>Investigative Caution:</strong> Third-party websites frequently copy older text or misquote official dates. Never rely on an unofficial article for strict legal, academic, or financial deadlines.
          </p>
        </div>
      </div>

      {/* Clashes List */}
      {clashes.length === 0 ? (
        <div className="bg-white rounded-3xl border-3 border-[#26334A] p-12 text-center space-y-3 shadow-[4px_4px_0px_#26334A]">
          <div className="text-4xl">✨</div>
          <h3 className="font-heading font-black text-lg text-[#26334A]">
            No Contradictions Found!
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
            Your reviewed sources do not contain contradictory dates or numerical amounts for the questions tested.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {clashes.map((clash, idx) => (
            <div
              key={clash.id}
              className="bg-white rounded-3xl border-3 border-[#26334A] p-6 shadow-[5px_5px_0px_#26334A] space-y-5"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#26334A]/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-heading font-black px-2 py-0.5 rounded bg-[#FEE2E2] text-[#991B1B] border border-[#991B1B]">
                    Clash #{idx + 1}
                  </span>
                  <span className="text-xs font-heading font-bold text-neutral-600">
                    Topic: {clash.topic} ({clash.attributeName})
                  </span>
                </div>
                <span className="text-xs font-bold text-[#D9384B]">
                  Conflicting Attribute: {clash.attributeName}
                </span>
              </div>

              <h3 className="text-lg font-heading font-black text-[#26334A]">
                {clash.questionText}
              </h3>

              {/* Side-by-Side Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Claim A Card */}
                <div className="bg-[#FFF8E9] rounded-2xl border-2 border-[#26334A] p-4 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-white border border-[#26334A] text-[#26334A]">
                        Claim A • {clash.claimA.sourceType}
                      </span>
                      <span className="text-neutral-500">
                        {clash.claimA.date || clash.claimA.cycleOrYear || 'Date not specified'}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-sm text-[#26334A] mb-1">
                      {clash.claimA.sourceTitle}
                    </h4>

                    <div className="my-3 p-3 bg-white rounded-xl border border-[#26334A]/30">
                      <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                        Extracted Value:
                      </div>
                      <div className="text-base font-heading font-black text-[#D9384B]">
                        "{clash.claimA.value}"
                      </div>
                    </div>

                    <p className="text-xs text-neutral-700 font-serif italic bg-white/70 p-2.5 rounded-lg border border-[#26334A]/15">
                      "{clash.claimA.excerpt}"
                    </p>
                  </div>
                </div>

                {/* Claim B Card */}
                <div className="bg-[#FFF0F2] rounded-2xl border-2 border-[#26334A] p-4 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-white border border-[#26334A] text-[#26334A]">
                        Claim B • {clash.claimB.sourceType}
                      </span>
                      <span className="text-neutral-500">
                        {clash.claimB.date || clash.claimB.cycleOrYear || 'Date not specified'}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-sm text-[#26334A] mb-1">
                      {clash.claimB.sourceTitle}
                    </h4>

                    <div className="my-3 p-3 bg-white rounded-xl border border-[#26334A]/30">
                      <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                        Extracted Value:
                      </div>
                      <div className="text-base font-heading font-black text-[#D9384B]">
                        "{clash.claimB.value}"
                      </div>
                    </div>

                    <p className="text-xs text-neutral-700 font-serif italic bg-white/70 p-2.5 rounded-lg border border-[#26334A]/15">
                      "{clash.claimB.excerpt}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Conflict Analysis & Advice Box */}
              <div className="bg-[#F0F9FF] rounded-2xl border-2 border-[#8DD9F5] p-4 text-xs sm:text-sm space-y-2">
                <div className="font-heading font-bold text-[#1E4D69] flex items-center gap-1.5">
                  <span>🔍 Kazama's Logic Analysis:</span>
                </div>
                <p className="text-neutral-800 leading-relaxed">
                  {clash.conflictReason}
                </p>
                <div className="pt-2 border-t border-[#8DD9F5]/40 flex items-start gap-2 text-xs font-semibold text-[#1E4D69]">
                  <span className="text-base">🛡️</span>
                  <div>
                    <strong>Verification Strategy:</strong> {clash.verificationAdvice}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
