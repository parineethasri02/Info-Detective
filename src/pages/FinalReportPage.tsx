import React from 'react';
import { Investigation, ChecklistItem } from '../types';
import { CharacterAvatar } from '../components/characters/CharacterAvatar';
import { StatusBadge, PriorityBadge } from '../components/ui/StatusBadge';

interface FinalReportPageProps {
  investigation: Investigation;
  onToggleChecklist: (checklistId: string) => void;
  onSaveInvestigation: () => void;
  onReturnToDashboard: () => void;
  onCopyReport: () => void;
}

export const FinalReportPage: React.FC<FinalReportPageProps> = ({
  investigation,
  onToggleChecklist,
  onSaveInvestigation,
  onReturnToDashboard,
  onCopyReport,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const completedCount = investigation.checklist.filter((c) => c.completed).length;
  const questions = investigation.questions.filter((q) => q.isSelected !== false);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Action Bar (Top) - Hidden in Print */}
      <div className="no-print bg-white rounded-3xl border-3 border-[#26334A] p-4 sm:p-6 shadow-[4px_4px_0px_#26334A] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CharacterAvatar id="himawari" size="md" showBadge />
          <div>
            <h2 className="font-heading font-black text-lg text-[#26334A]">
              Final Investigation Dossier
            </h2>
            <p className="text-xs text-neutral-600">
              Export, print, or review your complete verified gap report and checklist.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl font-heading font-bold text-xs bg-white hover:bg-neutral-50 text-[#26334A] border-2 border-[#26334A] shadow-[2px_2px_0px_#26334A] cursor-pointer flex items-center gap-1.5"
          >
            <span>🖨️</span>
            <span>Download / Print PDF</span>
          </button>

          <button
            type="button"
            onClick={onCopyReport}
            className="px-3.5 py-2 rounded-xl font-heading font-bold text-xs bg-white hover:bg-neutral-50 text-[#26334A] border-2 border-[#26334A] shadow-[2px_2px_0px_#26334A] cursor-pointer flex items-center gap-1.5"
          >
            <span>📋</span>
            <span>Copy Text Report</span>
          </button>

          <button
            type="button"
            onClick={onSaveInvestigation}
            className="px-3.5 py-2 rounded-xl font-heading font-bold text-xs bg-[#8DD9F5] hover:bg-[#77cdee] text-[#1E4D69] border-2 border-[#26334A] shadow-[2px_2px_0px_#26334A] cursor-pointer flex items-center gap-1.5"
          >
            <span>💾</span>
            <span>Save Case</span>
          </button>

          <button
            type="button"
            onClick={onReturnToDashboard}
            className="px-4 py-2 rounded-xl font-heading font-black text-xs bg-[#FFD84D] hover:bg-[#ffcf29] text-[#26334A] border-2 border-[#26334A] shadow-[2px_2px_0px_#26334A] cursor-pointer flex items-center gap-1.5"
          >
            <span>🏠</span>
            <span>HQ Dashboard</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Body */}
      <div className="bg-white rounded-3xl border-3 border-[#26334A] p-6 sm:p-10 shadow-[6px_6px_0px_#26334A] space-y-8 print-card print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b-3 border-[#26334A] pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-heading font-black text-xs uppercase px-2.5 py-0.5 rounded-full bg-[#FFD84D] border border-[#26334A] text-[#26334A]">
                Official Case Audit Report
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                ID: {investigation.id}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-black text-[#26334A]">
              {investigation.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Subject Domain: <strong>{investigation.categoryName || 'General Research'}</strong> • Analysis Engine:{' '}
              <strong className="uppercase">{investigation.analysisEngine || 'Rule-Based Substring'}</strong>
            </p>
          </div>

          <div className="text-right sm:self-center bg-[#FFF8E9] p-3 rounded-2xl border-2 border-[#26334A]">
            <div className="text-xs font-bold text-neutral-500">Research Coverage</div>
            <div className="text-2xl font-heading font-black text-[#26334A]">
              {investigation.scoring?.scorePercentage || 0}%
            </div>
            <div className="text-[10px] text-neutral-500">Weighted Estimate</div>
          </div>
        </div>

        {/* Section 1: Objective & Context */}
        <div className="space-y-3">
          <h2 className="text-lg font-heading font-black text-[#26334A] uppercase tracking-wide border-b border-[#26334A]/20 pb-1">
            1. Research Objective & Core Query
          </h2>
          <div className="bg-[#FFFDF5] rounded-2xl border-2 border-[#26334A] p-4 text-xs sm:text-sm space-y-2">
            <p>
              <strong>Core Question:</strong> {investigation.mainQuestion}
            </p>
            <p>
              <strong>Investigation Objective:</strong> {investigation.researchObjective}
            </p>
            {investigation.optionalContext && (
              <p className="text-neutral-600">
                <strong>Recorded Context:</strong> {investigation.optionalContext}
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Sources Reviewed Bibliography */}
        <div className="space-y-3">
          <h2 className="text-lg font-heading font-black text-[#26334A] uppercase tracking-wide border-b border-[#26334A]/20 pb-1">
            2. Sources Reviewed ({investigation.sources.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {investigation.sources.map((src, idx) => (
              <div
                key={src.id}
                className="rounded-2xl border-2 border-[#26334A] p-3 text-xs bg-[#FFF8E9] space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="uppercase px-1.5 py-0.5 rounded bg-white border border-[#26334A]">
                    Source #{idx + 1} • {src.sourceType}
                  </span>
                  <span>{src.cycleOrYear || 'Cycle N/A'}</span>
                </div>
                <h4 className="font-heading font-bold text-xs text-[#26334A] line-clamp-1">
                  {src.title}
                </h4>
                <p className="text-[11px] text-neutral-600 truncate">Domain: {src.domain}</p>
                <p className="text-[11px] text-neutral-500">
                  Published: <strong>{src.publicationDate || 'Undated (needs verification)'}</strong>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Truth Clashes & Conflicts */}
        {investigation.truthClashes && investigation.truthClashes.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-heading font-black text-[#991B1B] uppercase tracking-wide border-b border-[#991B1B]/30 pb-1 flex items-center gap-2">
              <span>⚡ 3. Truth Clashes & Contradictions ({investigation.truthClashes.length})</span>
            </h2>
            <div className="space-y-3">
              {investigation.truthClashes.map((clash, idx) => (
                <div
                  key={clash.id}
                  className="rounded-2xl border-2 border-[#991B1B] bg-[#FFF0F2] p-4 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between font-heading font-bold text-xs text-[#991B1B]">
                    <span>Clash #{idx + 1}: {clash.topic}</span>
                    <span>Attribute: {clash.attributeName}</span>
                  </div>
                  <p className="font-heading font-black text-sm text-[#26334A]">
                    {clash.questionText}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-[#991B1B]/30">
                      <strong>Claim A ({clash.claimA.sourceTitle}):</strong>
                      <p className="text-[#D9384B] font-bold mt-0.5">"{clash.claimA.value}"</p>
                      <p className="text-[11px] text-neutral-500 italic mt-0.5 font-serif">"{clash.claimA.excerpt}"</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-[#991B1B]/30">
                      <strong>Claim B ({clash.claimB.sourceTitle}):</strong>
                      <p className="text-[#D9384B] font-bold mt-0.5">"{clash.claimB.value}"</p>
                      <p className="text-[11px] text-neutral-500 italic mt-0.5 font-serif">"{clash.claimB.excerpt}"</p>
                    </div>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg text-[11px] text-[#7A1D2D]">
                    <strong>Verification Guidance:</strong> {clash.verificationAdvice}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Full Question Results Table */}
        <div className="space-y-3">
          <h2 className="text-lg font-heading font-black text-[#26334A] uppercase tracking-wide border-b border-[#26334A]/20 pb-1">
            4. Detailed Question Evaluation Table
          </h2>
          <div className="overflow-x-auto rounded-2xl border-2 border-[#26334A]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#FFF8E9] border-b-2 border-[#26334A] font-heading font-black text-[#26334A]">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Question</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Finding Summary</th>
                  <th className="p-3">Evidence Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {questions.map((q, idx) => (
                  <tr key={q.id} className="hover:bg-neutral-50">
                    <td className="p-3 font-mono font-bold">{idx + 1}</td>
                    <td className="p-3 font-semibold text-[#26334A] max-w-[220px]">
                      {q.text}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <PriorityBadge priority={q.priority} size="sm" />
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <StatusBadge status={q.status || 'not-found'} size="sm" />
                    </td>
                    <td className="p-3 text-neutral-700 max-w-[260px]">
                      {q.findingSummary}
                    </td>
                    <td className="p-3 text-[11px] text-neutral-500 whitespace-nowrap">
                      {q.evidence && q.evidence.length > 0 ? q.evidence[0].sourceTitle.slice(0, 20) + '...' : 'None'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Prioritized Verification Checklist (Tick-able & Persisted!) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#26334A]/20 pb-1">
            <h2 className="text-lg font-heading font-black text-[#26334A] uppercase tracking-wide flex items-center gap-2">
              <span>✅ 5. Prioritized Action & Verification Checklist</span>
            </h2>
            <span className="text-xs font-heading font-bold px-2.5 py-0.5 rounded-full bg-[#FFD84D] border border-[#26334A]">
              {completedCount} of {investigation.checklist.length} Completed
            </span>
          </div>

          <p className="text-xs text-neutral-600">
            Auto-generated from all unconfirmed, conflicting, or missing questions. Check each off as you verify primary gazettes.
          </p>

          <div className="space-y-2.5">
            {investigation.checklist.map((item) => (
              <label
                key={item.id}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  item.completed
                    ? 'bg-neutral-50 border-neutral-300 opacity-60'
                    : 'bg-[#FFFDF5] border-[#26334A] shadow-[2px_2px_0px_#26334A]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => onToggleChecklist(item.id)}
                  className="mt-0.5 w-5 h-5 rounded-lg border-2 border-[#26334A] accent-[#1E5631] cursor-pointer"
                />
                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`font-semibold ${
                        item.completed ? 'line-through text-neutral-400' : 'text-[#26334A]'
                      }`}
                    >
                      {item.task}
                    </span>
                    <PriorityBadge priority={item.priority} size="sm" />
                    <span className="text-[10px] px-2 py-0.2 rounded bg-neutral-100 border border-neutral-300 font-bold">
                      {item.category}
                    </span>
                  </div>
                  {item.sourceToConsult && (
                    <p className="text-[11px] text-neutral-500">
                      Primary Source to Consult:{' '}
                      <strong className="text-neutral-700">{item.sourceToConsult}</strong>
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Footer Advice */}
        <div className="pt-6 border-t-3 border-[#26334A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
          <div className="flex items-center gap-3">
            <CharacterAvatar id="shinchan" size="sm" />
            <p>
              <strong>Kasukabe Detective Seal of Completeness:</strong> Report generated by INFO-DETECTIVE.
            </p>
          </div>
          <p className="font-mono text-[11px]">
            Generated on: {new Date().toLocaleDateString()} • AI Studio Build
          </p>
        </div>
      </div>
    </div>
  );
};
