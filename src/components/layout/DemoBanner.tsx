import React from 'react';
import { CharacterAvatar } from '../characters/CharacterAvatar';

interface DemoBannerProps {
  isDemo: boolean;
  onStartRealInvestigation: () => void;
  onResetDemo: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  isDemo,
  onStartRealInvestigation,
  onResetDemo,
}) => {
  if (!isDemo) return null;

  return (
    <aside
      aria-label="Demo mode notice"
      className="no-print bg-[#FFD84D] border-b-2 border-[#26334A] py-2.5 px-4 sticky top-0 z-40 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CharacterAvatar id="shinchan" size="sm" />
          <div className="text-xs sm:text-sm text-[#26334A]">
            <span className="font-heading font-bold uppercase tracking-wider bg-[#26334A] text-white px-2 py-0.5 rounded-full mr-2 text-xs">
              Demo Mode
            </span>
            <span className="font-semibold">
              Sample Data: Global Excellence Scholarship 2026.
            </span>
            <span className="hidden md:inline text-neutral-800 ml-1">
              (DEMONSTRATION DATA, not genuine verified scholarship information).
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetDemo}
            className="text-xs font-heading font-bold px-3 py-1.5 rounded-xl border border-[#26334A] bg-white hover:bg-neutral-50 text-[#26334A] transition-transform active:scale-95 cursor-pointer"
          >
            ↺ Reset Demo
          </button>
          <button
            type="button"
            onClick={onStartRealInvestigation}
            className="text-xs font-heading font-bold px-3.5 py-1.5 rounded-xl border-2 border-[#26334A] bg-[#FF9DAB] hover:bg-[#FF8495] text-[#26334A] shadow-[2px_2px_0px_#26334A] transition-transform active:scale-95 cursor-pointer"
          >
            ✨ Start Real Investigation
          </button>
        </div>
      </div>
    </aside>
  );
};
