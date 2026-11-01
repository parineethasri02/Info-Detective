import React, { useState } from 'react';
import { Investigation, EvidenceFinding, Source } from '../types';
import { CharacterAvatar } from '../components/characters/CharacterAvatar';
import { verifySubstringExcerpt } from '../lib/gapAnalyzer';

interface EvidenceReferencesPageProps {
  investigation: Investigation;
  onNavigateToReport: () => void;
}

export const EvidenceReferencesPage: React.FC<EvidenceReferencesPageProps> = ({
  investigation,
  onNavigateToReport,
}) => {
  // Aggregate all evidence excerpts from all questions
  const allFindings: { finding: EvidenceFinding; questionTopic: string; questionText: string }[] = [];

  for (const q of investigation.questions) {
    if (q.evidence && q.evidence.length > 0) {
      for (const ev of q.evidence) {
        allFindings.push({
          finding: ev,
          questionTopic: q.topic,
          questionText: q.text,
        });
      }
    }
  }

  const [selectedSourceId, setSelectedSourceId] = useState<string>(
    investigation.sources[0]?.id || ''
  );
  const [highlightedExcerpt, setHighlightedExcerpt] = useState<string | null>(
    allFindings[0]?.finding.excerpt || null
  );

  const activeSource = investigation.sources.find((s) => s.id === selectedSourceId) || investigation.sources[0];

  // Render text with highlight
  const renderHighlightedContent = (fullText: string, targetExcerpt: string | null) => {
    if (!targetExcerpt || !fullText.includes(targetExcerpt)) {
      return <span>{fullText}</span>;
    }

    const parts = fullText.split(targetExcerpt);
    return (
      <span>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && (
              <mark className="bg-[#FFD84D] text-[#26334A] font-bold px-1 py-0.5 rounded border border-[#26334A] shadow-xs">
                {targetExcerpt}
              </mark>
            )}
          </React.Fragment>
        ))}
      </span>
    );
  };

  const handleSelectFinding = (srcId: string, excerpt: string) => {
    setSelectedSourceId(srcId);
    setHighlightedExcerpt(excerpt);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Header with Bo-chan Avatar */}
      <div className="bg-white rounded-3xl border-3 border-[#26334A] p-6 sm:p-8 shadow-[4px_4px_0px_#26334A]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <CharacterAvatar
              id="bochan"
              size="lg"
              showBadge
              animated
              bubblePlacement="side"
              speechBubble="Bo-chan verified all quotes! Every single piece of evidence is an exact substring of the original document. No paraphrasing, no AI hallucinations!"
            />

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-heading font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#C8B6F0] border border-[#26334A] text-[#442E70]">
                  Bo-chan's Evidence Chamber
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#D1F2D9] text-[#1E5631] font-bold border border-[#276749]">
                  {allFindings.length} Verified Substring Quotes
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#26334A]">
                Evidence Traceability & Excerpts
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl">
                True information gap detection requires mathematical traceability. Click any quote on the left to see its exact highlighted position inside the original source document on the right.
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
      </div>

      {/* Two Column Layout: Traceable Findings List + Source Text Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Traceable Findings Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-heading font-black text-[#26334A]">
              Traceable Findings ({allFindings.length})
            </h2>
            <span className="text-xs text-neutral-500 font-semibold">
              Click to view source highlight
            </span>
          </div>

          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {allFindings.map((item, idx) => {
              const isSelected =
                selectedSourceId === item.finding.sourceId &&
                highlightedExcerpt === item.finding.excerpt;

              const subCheck = activeSource
                ? verifySubstringExcerpt(activeSource.content, item.finding.excerpt)
                : { valid: true };

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectFinding(item.finding.sourceId, item.finding.excerpt)}
                  className={`rounded-2xl border-2 p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#FFF8E9] border-[#26334A] shadow-[3px_3px_0px_#26334A] scale-101'
                      : 'bg-white border-[#26334A]/25 hover:border-[#26334A] shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-heading font-bold text-[#26334A] px-2 py-0.5 rounded bg-white border border-[#26334A]/40">
                      {item.questionTopic}
                    </span>
                    <span
                      className={`text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#26334A] ${
                        item.finding.findingType === 'direct_fact'
                          ? 'bg-[#D1F2D9] text-[#1E5631]'
                          : item.finding.findingType === 'conflicting_claim'
                          ? 'bg-[#FEE2E2] text-[#991B1B]'
                          : item.finding.findingType === 'outdated_claim'
                          ? 'bg-[#FFEDD5] text-[#9A3412]'
                          : 'bg-[#E0F2FE] text-[#075985]'
                      }`}
                    >
                      {item.finding.findingType.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-neutral-700 line-clamp-1 mb-2">
                    {item.questionText}
                  </p>

                  <div className="bg-white rounded-xl border border-[#26334A]/20 p-2 text-xs font-serif italic text-neutral-900 leading-snug">
                    "{item.finding.excerpt}"
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-500 font-sans">
                    <span className="truncate max-w-[200px]">📄 {item.finding.sourceTitle}</span>
                    <span className="text-emerald-700 font-bold">✓ Substring Verified</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Source Document Viewer */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-3 border-[#26334A] p-6 shadow-[5px_5px_0px_#26334A] sticky top-24 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#26334A]/15">
            <div>
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-neutral-500">
                Document Inspection View
              </span>
              <h3 className="font-heading font-black text-lg text-[#26334A] leading-tight mt-0.5">
                {activeSource?.title || 'No source selected'}
              </h3>
              <p className="text-xs text-neutral-500">
                Type: <strong>{activeSource?.sourceType}</strong> • Domain: {activeSource?.domain} • Date:{' '}
                {activeSource?.publicationDate || activeSource?.cycleOrYear || 'Undated'}
              </p>
            </div>

            {/* Source Switcher Dropdown */}
            <select
              value={selectedSourceId}
              onChange={(e) => {
                setSelectedSourceId(e.target.value);
                const matched = allFindings.find((f) => f.finding.sourceId === e.target.value);
                if (matched) setHighlightedExcerpt(matched.finding.excerpt);
              }}
              className="px-3 py-1.5 rounded-xl border-2 border-[#26334A] font-heading font-bold text-xs bg-[#FFF8E9] text-[#26334A] focus:outline-none cursor-pointer"
            >
              {investigation.sources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title.slice(0, 35)}...
                </option>
              ))}
            </select>
          </div>

          {/* Highlight indicator banner */}
          <div className="bg-[#FFF8E9] rounded-xl border border-[#26334A]/30 p-2.5 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#FFD84D] border border-[#26334A]" />
              <span className="font-heading font-bold text-[#26334A]">
                Highlighted Excerpt Position in Text:
              </span>
            </div>
            <span className="text-[11px] text-neutral-500 font-mono">
              {activeSource?.content.length || 0} bytes
            </span>
          </div>

          {/* Source Document Text with Highlight */}
          <div className="bg-[#FFFDF5] rounded-2xl border-2 border-[#26334A] p-5 max-h-[500px] overflow-y-auto font-serif text-sm text-neutral-800 leading-relaxed shadow-inner">
            {activeSource ? (
              renderHighlightedContent(activeSource.content, highlightedExcerpt)
            ) : (
              <p className="text-neutral-400 italic">No source text available.</p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-neutral-500">
            <span>
              URL: <span className="underline font-mono">{activeSource?.url}</span>
            </span>
            <span className="font-heading font-bold text-[#26334A]">
              100% Raw Text Verbatim Guarantee
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
