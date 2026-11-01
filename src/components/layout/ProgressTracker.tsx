import React from 'react';

export type AppStage =
  | 'category'
  | 'case-file'
  | 'evidence'
  | 'analysis'
  | 'truth-clash'
  | 'invisible-questions'
  | 'time-traveller'
  | 'evidence-refs'
  | 'confidence'
  | 'report';

interface ProgressTrackerProps {
  currentStage: AppStage;
  onNavigateStage: (stage: AppStage) => void;
  hasAnalyzed: boolean;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentStage,
  onNavigateStage,
  hasAnalyzed,
}) => {
  const steps: { stage: AppStage; label: string; icon: string; short: string }[] = [
    { stage: 'category', label: '1. Questions', icon: '❓', short: 'Questions' },
    { stage: 'case-file', label: '2. Case File', icon: '📓', short: 'Case File' },
    { stage: 'evidence', label: '3. Evidence', icon: '🔍', short: 'Evidence' },
    { stage: 'analysis', label: '4. Analysis', icon: '📊', short: 'Analysis' },
    { stage: 'truth-clash', label: '5. Gap Detection', icon: '⚡', short: 'Gaps' },
    { stage: 'confidence', label: '6. Verification', icon: '🧭', short: 'Verify' },
    { stage: 'report', label: '7. Final Report', icon: '📜', short: 'Report' },
  ];

  const getStageIndex = (stage: AppStage): number => {
    switch (stage) {
      case 'category':
        return 0;
      case 'case-file':
        return 1;
      case 'evidence':
        return 2;
      case 'analysis':
        return 3;
      case 'truth-clash':
      case 'invisible-questions':
      case 'time-traveller':
      case 'evidence-refs':
        return 4;
      case 'confidence':
        return 5;
      case 'report':
        return 6;
      default:
        return 0;
    }
  };

  const currentIndex = getStageIndex(currentStage);

  return (
    <nav
      aria-label="Investigation progress"
      className="no-print bg-[#FFF8E9] border-b-2 border-[#26334A] px-2 sm:px-4 py-2.5 overflow-x-auto scrollbar-none"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between min-w-[580px] gap-2">
        {steps.map((step, idx) => {
          const isActive = currentIndex === idx;
          const isPassed = currentIndex > idx;
          const isClickable = idx <= 2 || hasAnalyzed;

          return (
            <React.Fragment key={step.stage}>
              <button
                type="button"
                onClick={() => isClickable && onNavigateStage(step.stage)}
                disabled={!isClickable}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-heading text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#26334A] text-[#FFD84D] shadow-[2px_2px_0px_#FF9DAB] scale-105'
                    : isPassed
                    ? 'bg-[#D1F2D9] text-[#1E5631] border border-[#276749] hover:bg-[#bbf0c6] cursor-pointer'
                    : isClickable
                    ? 'bg-white text-[#26334A] border border-[#26334A] hover:bg-[#FFF8E9] cursor-pointer'
                    : 'bg-neutral-200 text-neutral-400 border border-neutral-300 cursor-not-allowed opacity-60'
                }`}
              >
                <span>{isPassed ? '✓' : step.icon}</span>
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.short}</span>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 border-t-2 border-dashed ${
                    currentIndex > idx ? 'border-[#276749]' : 'border-[#26334A]/30'
                  }`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
