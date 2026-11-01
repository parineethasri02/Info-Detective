import React, { useState } from 'react';
import { CharacterAvatar } from '../characters/CharacterAvatar';
import { AppStage } from './ProgressTracker';

interface NavbarProps {
  currentStage: AppStage | 'landing' | 'dashboard';
  onNavigate: (stage: AppStage | 'landing' | 'dashboard') => void;
  onNewInvestigation: () => void;
  onLoadDemo: () => void;
  isDemo: boolean;
  hasAnalyzed: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStage,
  onNavigate,
  onNewInvestigation,
  onLoadDemo,
  isDemo,
  hasAnalyzed,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: AppStage | 'dashboard'; label: string; icon: string; charId: string; requiresAnalysis?: boolean }[] = [
    { id: 'dashboard', label: 'Cartoon HQ', icon: '🏠', charId: 'shinchan' },
    { id: 'truth-clash', label: 'Truth Clash', icon: '⚡', charId: 'kazama', requiresAnalysis: true },
    { id: 'invisible-questions', label: 'Invisible Qs', icon: '❓', charId: 'nene', requiresAnalysis: true },
    { id: 'time-traveller', label: 'Time Traveller', icon: '⏳', charId: 'masao', requiresAnalysis: true },
    { id: 'evidence-refs', label: 'Evidence Refs', icon: '🔎', charId: 'bochan', requiresAnalysis: true },
    { id: 'confidence', label: 'Compass', icon: '🧭', charId: 'shinchan', requiresAnalysis: true },
    { id: 'report', label: 'Final Report', icon: '📜', charId: 'himawari', requiresAnalysis: true },
  ];

  return (
    <header className="no-print bg-[#FFF8E9] border-b-3 border-[#26334A] sticky top-0 z-30 shadow-[0_2px_0px_#26334A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            aria-label="Info Detective Home"
          >
            <div className="relative w-10 h-10 rounded-2xl bg-[#FFD84D] border-2 border-[#26334A] flex items-center justify-center shadow-[2px_2px_0px_#26334A] group-hover:rotate-6 transition-transform">
              <span className="text-xl">🔍</span>
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#FF9DAB] border border-[#26334A] flex items-center justify-center text-[9px] font-black">
                ★
              </div>
            </div>
            <div>
              <div className="font-heading font-black text-lg sm:text-xl text-[#26334A] tracking-tight leading-none flex items-center gap-1.5">
                <span>INFO-DETECTIVE</span>
                <span className="text-[10px] bg-[#8DD9F5] text-[#1E4D69] px-1.5 py-0.5 rounded border border-[#26334A] font-bold">
                  AI HQ
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-neutral-600 leading-tight">
                Every Answer Has a Missing Piece.
              </p>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = currentStage === link.id;
            const disabled = link.requiresAnalysis && !hasAnalyzed;

            return (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  if (!disabled) onNavigate(link.id);
                }}
                disabled={disabled}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-heading text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#26334A] text-[#FFD84D] shadow-[2px_2px_0px_#FF9DAB]'
                    : disabled
                    ? 'text-neutral-400 opacity-50 cursor-not-allowed'
                    : 'text-[#26334A] hover:bg-white border border-transparent hover:border-[#26334A] shadow-none hover:shadow-[2px_2px_0px_#26334A] cursor-pointer'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNewInvestigation}
            aria-label="Create new case"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-heading font-black text-xs bg-[#FFD84D] hover:bg-[#ffcf29] text-[#26334A] border-2 border-[#26334A] shadow-[2px_2px_0px_#26334A] transition-transform active:scale-95 cursor-pointer"
          >
            <span>+</span>
            <span className="hidden sm:inline">New Case</span>
            <span className="sm:hidden">New</span>
          </button>

          {!isDemo && (
            <button
              type="button"
              onClick={onLoadDemo}
              title="Load demo scholarship investigation"
              className="px-2.5 py-1.5 rounded-xl font-heading font-bold text-xs bg-white hover:bg-neutral-50 text-[#26334A] border-2 border-[#26334A] shadow-[2px_2px_0px_#26334A] cursor-pointer"
            >
              Demo Case
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl border-2 border-[#26334A] bg-white shadow-[2px_2px_0px_#26334A] text-[#26334A] font-bold"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFF8E9] border-t-2 border-[#26334A] px-4 py-3 flex flex-col gap-1.5 shadow-lg">
          {navLinks.map((link) => {
            const isActive = currentStage === link.id;
            const disabled = link.requiresAnalysis && !hasAnalyzed;

            return (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  if (!disabled) {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }
                }}
                disabled={disabled}
                className={`flex items-center justify-between px-3 py-2 rounded-xl font-heading text-sm font-bold text-left ${
                  isActive
                    ? 'bg-[#26334A] text-[#FFD84D]'
                    : disabled
                    ? 'text-neutral-400 opacity-50 cursor-not-allowed'
                    : 'text-[#26334A] hover:bg-white border border-[#26334A]/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </div>
                {disabled ? (
                  <span className="text-[10px] text-neutral-400 font-normal">Needs Analysis</span>
                ) : (
                  <span className="text-xs">→</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
