import React from 'react';
import { Investigation, ChecklistItem } from '../types';
import { CharacterAvatar } from '../components/characters/CharacterAvatar';
import { AppStage } from '../components/layout/ProgressTracker';

interface DashboardPageProps {
  investigation: Investigation;
  savedInvestigations: Investigation[];
  onSelectInvestigation: (inv: Investigation) => void;
  onDeleteInvestigation: (id: string) => void;
  onNavigateStage: (stage: AppStage) => void;
  onNewInvestigation: () => void;
  onLoadDemo: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  investigation,
  savedInvestigations,
  onSelectInvestigation,
  onDeleteInvestigation,
  onNavigateStage,
  onNewInvestigation,
  onLoadDemo,
}) => {
  const pendingTasks = investigation.checklist.filter((c) => !c.completed);
  const completedTasks = investigation.checklist.filter((c) => c.completed);
  const isAnalyzed = investigation.status === 'analyzed';

  const featureCards: {
    id: AppStage;
    title: string;
    charId: string;
    description: string;
    statLabel: string;
    statValue: string | number;
    btnText: string;
    btnColor: string;
    requiresAnalysis: boolean;
  }[] = [
    {
      id: 'truth-clash',
      title: 'Truth Clash',
      charId: 'kazama',
      description: 'Review contradictory claims, opposing deadlines, and incompatible requirements side-by-side.',
      statLabel: 'Clashes Found',
      statValue: investigation.truthClashes?.length || 0,
      btnText: 'Investigate Clashes →',
      btnColor: 'bg-[#8DD9F5] text-[#1E4D69]',
      requiresAnalysis: true,
    },
    {
      id: 'invisible-questions',
      title: 'Invisible Questions',
      charId: 'nene',
      description: 'Audit critical information gaps that sources completely omitted or left unaddressed.',
      statLabel: 'Invisible Gaps',
      statValue:
        investigation.questions.filter((q) => q.status === 'not-found' || q.status === 'partially-answered').length,
      btnText: 'Inspect Dark Spots →',
      btnColor: 'bg-[#FF9DAB] text-[#7A1D2D]',
      requiresAnalysis: true,
    },
    {
      id: 'time-traveller',
      title: 'Time Traveller',
      charId: 'masao',
      description: 'Examine source publication dates, cycle timelines, and stale announcement warnings.',
      statLabel: 'Sources Dated',
      statValue: investigation.sources.filter((s) => s.publicationDate || s.cycleOrYear).length,
      btnText: 'Explore Timeline →',
      btnColor: 'bg-[#FFC49D] text-[#7A3E1B]',
      requiresAnalysis: true,
    },
    {
      id: 'evidence-refs',
      title: 'Evidence References',
      charId: 'bochan',
      description: 'Examine 100% exact substring quotes from your documents verifying answered points.',
      statLabel: 'Answered Findings',
      statValue: investigation.questions.filter((q) => q.status === 'answered').length,
      btnText: 'Trace Excerpts →',
      btnColor: 'bg-[#C8B6F0] text-[#442E70]',
      requiresAnalysis: true,
    },
    {
      id: 'confidence',
      title: 'Confidence Compass',
      charId: 'shinchan',
      description: 'Inspect the transparent mathematical formula that calculates research coverage.',
      statLabel: 'Coverage Score',
      statValue: `${investigation.scoring?.scorePercentage || 0}%`,
      btnText: 'View Formula →',
      btnColor: 'bg-[#FFD84D] text-[#634F0C]',
      requiresAnalysis: true,
    },
    {
      id: 'report',
      title: 'Final Investigation Report',
      charId: 'himawari',
      description: 'Full printable report with exportable verification checklist and source bibliography.',
      statLabel: 'Checklist Tasks',
      statValue: `${completedTasks.length}/${investigation.checklist.length} Done`,
      btnText: 'Open Full Report →',
      btnColor: 'bg-[#FFE680] text-[#634F0C]',
      requiresAnalysis: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Top Welcome Banner with Shinchan & Detective HQ stats */}
      <div className="bg-white rounded-3xl border-3 border-[#26334A] p-6 sm:p-8 shadow-[4px_4px_0px_#26334A] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <CharacterAvatar
              id="shinchan"
              size="lg"
              showBadge
              animated
              bubblePlacement="side"
              speechBubble={
                isAnalyzed
                  ? `Active case: ${investigation.title}. We detected ${investigation.truthClashes?.length || 0} clashes and ${pendingTasks.length} verification tasks!`
                  : `Welcome to HQ! Let's examine evidence and uncover what the internet forgot to tell you!`
              }
            />

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-3 py-0.5 rounded-full font-heading font-black text-xs uppercase bg-[#FFD84D] border border-[#26334A] text-[#26334A]">
                  Kasukabe Detective HQ
                </span>
                {investigation.isDemo && (
                  <span className="px-2.5 py-0.5 rounded-full font-heading font-bold text-xs bg-[#FF9DAB] border border-[#26334A] text-[#7A1D2D]">
                    Demo Case Loaded
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#26334A] leading-tight">
                {investigation.title}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl">
                Category: <strong>{investigation.categoryName || 'General Research'}</strong> • Objective: {investigation.researchObjective}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              type="button"
              onClick={onNewInvestigation}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-2xl bg-[#FFD84D] hover:bg-[#ffcd1f] text-[#26334A] font-heading font-black text-xs sm:text-sm border-2 border-[#26334A] shadow-[2px_2px_0px_#26334A] transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
            >
              + New Case
            </button>
            <button
              type="button"
              onClick={() => onNavigateStage('evidence')}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-2xl bg-white hover:bg-neutral-50 text-[#26334A] font-heading font-bold text-xs sm:text-sm border-2 border-[#26334A] shadow-[2px_2px_0px_#26334A] transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
            >
              📂 Evidence ({investigation.sources.length})
            </button>
            <button
              type="button"
              onClick={() => onNavigateStage('analysis')}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-2xl bg-[#8DD9F5] hover:bg-[#78d0f0] text-[#1E4D69] font-heading font-black text-xs sm:text-sm border-2 border-[#26334A] shadow-[2px_2px_0px_#26334A] transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
            >
              📊 Analysis Overview
            </button>
          </div>
        </div>

        {/* 4 Summary Stats Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-[#26334A]/15">
          <div className="bg-[#FFF8E9] rounded-2xl border-2 border-[#26334A] p-3 text-center">
            <div className="text-xl sm:text-2xl font-heading font-black text-[#26334A]">
              {investigation.scoring?.scorePercentage || 0}%
            </div>
            <div className="text-[11px] font-bold text-neutral-600">Research Coverage</div>
          </div>

          <div className="bg-[#FFF8E9] rounded-2xl border-2 border-[#26334A] p-3 text-center">
            <div className="text-xl sm:text-2xl font-heading font-black text-[#D9384B]">
              {investigation.truthClashes?.length || 0}
            </div>
            <div className="text-[11px] font-bold text-neutral-600">Truth Clashes</div>
          </div>

          <div className="bg-[#FFF8E9] rounded-2xl border-2 border-[#26334A] p-3 text-center">
            <div className="text-xl sm:text-2xl font-heading font-black text-[#26334A]">
              {investigation.sources?.length || 0}
            </div>
            <div className="text-[11px] font-bold text-neutral-600">Sources Analyzed</div>
          </div>

          <div className="bg-[#FFF8E9] rounded-2xl border-2 border-[#26334A] p-3 text-center">
            <div className="text-xl sm:text-2xl font-heading font-black text-[#7A3E1B]">
              {pendingTasks.length}
            </div>
            <div className="text-[11px] font-bold text-neutral-600">Pending Actions</div>
          </div>
        </div>
      </div>

      {/* Six Feature Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-heading font-black text-[#26334A]">
            Detective Investigation Features
          </h2>
          <span className="text-xs font-semibold text-neutral-600">
            Click any feature to inspect specific findings
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((feat) => {
            const disabled = feat.requiresAnalysis && !isAnalyzed;

            return (
              <div
                key={feat.id}
                className="bg-white rounded-3xl border-3 border-[#26334A] p-5 shadow-[4px_4px_0px_#26334A] flex flex-col justify-between hover:-translate-y-1 transition-transform"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <CharacterAvatar id={feat.charId} size="md" showBadge />
                    <div className="text-right">
                      <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                        {feat.statLabel}
                      </div>
                      <div className="text-base font-heading font-black text-[#26334A]">
                        {feat.statValue}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-heading font-black text-lg text-[#26334A] mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#26334A]/10">
                  <button
                    type="button"
                    onClick={() => {
                      if (!disabled) onNavigateStage(feat.id);
                    }}
                    disabled={disabled}
                    className={`w-full py-2.5 rounded-xl font-heading font-bold text-xs border-2 border-[#26334A] shadow-[2px_2px_0px_#26334A] transition-transform active:scale-95 cursor-pointer ${
                      disabled
                        ? 'bg-neutral-100 text-neutral-400 border-neutral-300 shadow-none cursor-not-allowed'
                        : `${feat.btnColor} hover:opacity-90`
                    }`}
                  >
                    {disabled ? 'Run Analysis First' : feat.btnText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Investigations List & Action Checklist preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Saved Investigations List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border-3 border-[#26334A] p-6 shadow-[4px_4px_0px_#26334A]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-black text-lg text-[#26334A] flex items-center gap-2">
              <span>📁 Case Archives</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF8E9] border border-[#26334A] font-bold">
                {savedInvestigations.length}
              </span>
            </h3>
            <button
              type="button"
              onClick={onNewInvestigation}
              className="text-xs font-heading font-bold text-[#D9384B] hover:underline cursor-pointer"
            >
              + Create New Case
            </button>
          </div>

          <div className="space-y-3">
            {savedInvestigations.map((inv) => {
              const isActive = inv.id === investigation.id;

              return (
                <div
                  key={inv.id}
                  className={`rounded-2xl border-2 p-3 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                    isActive
                      ? 'bg-[#FFF8E9] border-[#26334A] shadow-[2px_2px_0px_#26334A]'
                      : 'bg-white border-[#26334A]/30 hover:border-[#26334A]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading font-bold text-sm text-[#26334A] truncate">
                        {inv.title}
                      </span>
                      {inv.isDemo && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FFD84D] border border-[#26334A]">
                          Demo
                        </span>
                      )}
                      {isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D1F2D9] text-[#1E5631] border border-[#276749]">
                          Active Case
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 truncate mt-0.5">
                      {inv.categoryName || 'General'} • {inv.sources.length} sources •{' '}
                      {inv.questions.filter((q) => q.status === 'answered').length} answered
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isActive ? (
                      <button
                        type="button"
                        onClick={() => onSelectInvestigation(inv)}
                        className="px-3 py-1.5 rounded-xl font-heading font-bold text-xs bg-white hover:bg-neutral-50 text-[#26334A] border border-[#26334A] cursor-pointer"
                      >
                        Open
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onNavigateStage('analysis')}
                        className="px-3 py-1.5 rounded-xl font-heading font-bold text-xs bg-[#26334A] text-white cursor-pointer"
                      >
                        Inspect
                      </button>
                    )}

                    {!inv.isDemo && (
                      <button
                        type="button"
                        onClick={() => onDeleteInvestigation(inv.id)}
                        title="Delete investigation"
                        className="p-1.5 text-xs text-neutral-400 hover:text-red-600 rounded-lg cursor-pointer"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Verification Tasks Drawer */}
        <div className="bg-[#FFF8E9] rounded-3xl border-3 border-[#26334A] p-6 shadow-[4px_4px_0px_#26334A] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-black text-lg text-[#26334A] flex items-center gap-2">
                <span>📝 Action Tasks</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFD84D] border border-[#26334A] font-bold">
                  {pendingTasks.length} pending
                </span>
              </h3>
            </div>

            <p className="text-xs text-neutral-600 mb-4">
              Items derived from non-green findings to verify before finalizing decisions.
            </p>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {investigation.checklist.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-xl border border-[#26334A] p-2.5 text-xs flex items-start gap-2 shadow-xs"
                >
                  <span className="text-sm mt-0.5">
                    {task.completed ? '✅' : '⏳'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold ${task.completed ? 'line-through text-neutral-400' : 'text-[#26334A]'}`}>
                      {task.task}
                    </p>
                    <span className="text-[10px] text-neutral-500">{task.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#26334A]/15">
            <button
              type="button"
              onClick={() => onNavigateStage('report')}
              className="w-full py-2 rounded-xl font-heading font-bold text-xs bg-white hover:bg-neutral-50 text-[#26334A] border-2 border-[#26334A] shadow-[2px_2px_0px_#26334A] cursor-pointer"
            >
              Manage Full Checklist in Report →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
