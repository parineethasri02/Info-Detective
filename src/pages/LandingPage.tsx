import React from 'react';
import { CharacterAvatar } from '../components/characters/CharacterAvatar';

interface LandingPageProps {
  onStartInvestigation: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartInvestigation,
  onExploreDemo,
}) => {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featureCards = [
    {
      charId: 'kazama',
      title: 'Truth Clash',
      tagline: 'Pinpoint Contradictory Claims',
      desc: 'When two sources cite different deadlines, prices, or policies, Kazama places them side-by-side without blindly trusting the newer one.',
      color: 'bg-[#8DD9F5]/20 border-[#8DD9F5]',
      badge: 'Logic Investigator',
    },
    {
      charId: 'nene',
      title: 'Invisible Questions',
      tagline: 'Find What Sources Forgot to Tell You',
      desc: 'Nene investigates the critical dark spots: hidden bond clauses, unmentioned renewal rules, or missing appeal procedures.',
      color: 'bg-[#FF9DAB]/20 border-[#FF9DAB]',
      badge: 'Mystery Investigator',
    },
    {
      charId: 'masao',
      title: 'Time Traveller',
      tagline: 'Never Trust an Outdated Cycle',
      desc: 'Masao organizes claims by year and cycle. Warns you when 2024 announcements are masquerading as current 2026 guidelines.',
      color: 'bg-[#FFC49D]/20 border-[#FFC49D]',
      badge: 'Time Investigator',
    },
    {
      charId: 'bochan',
      title: 'Evidence References',
      tagline: '100% Exact Substring Traceability',
      desc: 'Bo-chan insists on proof! Every answered finding points directly to an exact verbatim sentence inside your submitted text.',
      color: 'bg-[#C8B6F0]/20 border-[#C8B6F0]',
      badge: 'Evidence Investigator',
    },
    {
      charId: 'shinchan',
      title: 'Confidence Compass',
      tagline: 'Honest Mathematical Coverage',
      desc: 'No fake AI accuracy scores! See the transparent weighted coverage formula and distinguish facts from unresolved uncertainties.',
      color: 'bg-[#FFD84D]/20 border-[#FFD84D]',
      badge: 'Chief Detective',
    },
    {
      charId: 'himawari',
      title: 'Final Action Report',
      tagline: 'Interactive Verification Checklist',
      desc: 'Receive an exportable case report with a persisted checklist, ready to print as PDF or copy to your clipboard.',
      color: 'bg-[#FFE680]/20 border-[#FFE680]',
      badge: 'Clue Finder',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E9] text-[#26334A] selection:bg-[#FFD84D]">
      {/* Hero Cartoon Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Floating Cartoon Background Accents */}
        <div className="absolute top-10 left-6 text-3xl opacity-40 select-none animate-gentle-bob" aria-hidden="true">
          ⭐
        </div>
        <div className="absolute top-24 right-10 text-4xl opacity-30 select-none animate-gentle-bob" style={{ animationDelay: '1s' }} aria-hidden="true">
          🔍
        </div>
        <div className="absolute bottom-12 left-1/4 text-2xl opacity-35 select-none animate-gentle-bob" style={{ animationDelay: '1.5s' }} aria-hidden="true">
          🐾
        </div>
        <div className="absolute top-1/2 right-6 text-3xl opacity-25 select-none" aria-hidden="true">
          ✨
        </div>

        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Shinchan Chief Detective Avatar & Speech Bubble */}
          <div className="mt-8 mb-6">
            <CharacterAvatar
              id="shinchan"
              size="xl"
              showBadge
              animated
              bubblePlacement="top"
              speechBubble="Action Detective Shinchan reporting! We check what you found against what you NEEDED to know!"
            />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD84D] border-2 border-[#26334A] shadow-[2px_2px_0px_#26334A] text-xs sm:text-sm font-heading font-black mb-4">
            <span>🛡️ AI-Assisted Information Gap Detection</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-neutral-800">Problem: Digital Dark Spot</span>
          </div>

          {/* Main Title & Tagline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading tracking-tight text-[#26334A] leading-[1.08] mb-4">
            INFO-DETECTIVE
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-[#D9384B] mb-5 tracking-tight">
            "Every Answer Has a Missing Piece."
          </p>

          <p className="text-base sm:text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto leading-relaxed mb-8">
            Search engines find information. Summarizers condense it.
            <br className="hidden sm:inline" />
            <strong className="text-[#26334A]"> INFO-DETECTIVE investigates:</strong> it audits what you collected against what you needed to know, revealing what is missing, conflicting, outdated, or unverified before you decide.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <button
              type="button"
              onClick={onStartInvestigation}
              className="px-6 sm:px-8 py-3.5 rounded-2xl bg-[#FFD84D] hover:bg-[#ffcd1f] text-[#26334A] font-heading font-black text-base sm:text-lg border-3 border-[#26334A] shadow-[4px_4px_0px_#26334A] transition-all hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
            >
              🚀 START INVESTIGATION
            </button>

            <button
              type="button"
              onClick={onExploreDemo}
              className="px-6 sm:px-7 py-3.5 rounded-2xl bg-white hover:bg-neutral-50 text-[#26334A] font-heading font-bold text-base sm:text-lg border-3 border-[#26334A] shadow-[4px_4px_0px_#26334A] transition-all hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer flex items-center gap-2"
            >
              <span>⭐</span>
              <span>EXPLORE DEMO CASE</span>
            </button>

            <button
              type="button"
              onClick={scrollToHowItWorks}
              className="px-5 py-3.5 rounded-2xl bg-[#8DD9F5] hover:bg-[#78d0f0] text-[#1E4D69] font-heading font-bold text-sm sm:text-base border-2 border-[#26334A] shadow-[3px_3px_0px_#26334A] transition-all hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
            >
              💡 HOW IT WORKS
            </button>
          </div>

          {/* Demo Callout Strip */}
          <div className="w-full max-w-xl bg-white border-2 border-[#26334A] rounded-2xl p-4 shadow-[3px_3px_0px_#26334A] flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎓</span>
              <div>
                <p className="font-heading font-bold text-sm text-[#26334A]">
                  Preloaded Demo: Global Excellence Scholarship 2026
                </p>
                <p className="text-xs text-neutral-600">
                  Detects 1 Truth Clash (Dec 15 vs 20), 3 Invisible Gaps, and 1 Outdated Source.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onExploreDemo}
              className="text-xs font-heading font-bold px-3 py-1.5 rounded-xl bg-[#FFD84D] border border-[#26334A] text-[#26334A] hover:bg-[#ffcf29] whitespace-nowrap cursor-pointer"
            >
              Inspect →
            </button>
          </div>
        </div>
      </section>

      {/* Six Detective Features Grid */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t-3 border-dashed border-[#26334A]/25">
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 rounded-full bg-[#C8B6F0] text-[#3F2B66] border border-[#26334A] font-heading font-bold text-xs uppercase mb-2">
            The Kasukabe Detective Agency Toolkit
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-[#26334A]">
            Six Specialized Gap Detection Tools
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto mt-1">
            Each detective takes charge of a specific dimension of information reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat) => (
            <div
              key={feat.title}
              className={`rounded-3xl border-3 border-[#26334A] p-6 shadow-[4px_4px_0px_#26334A] bg-white flex flex-col justify-between hover:-translate-y-1 transition-transform`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <CharacterAvatar id={feat.charId} size="md" showBadge />
                  <span className="text-xs font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FFF8E9] border border-[#26334A] text-[#26334A]">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="font-heading font-black text-xl text-[#26334A] mb-1">
                  {feat.title}
                </h3>
                <p className="font-heading font-semibold text-xs text-[#D9384B] mb-3">
                  {feat.tagline}
                </p>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#26334A]/15 flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-500">Live Feature</span>
                <button
                  type="button"
                  onClick={onExploreDemo}
                  className="text-xs font-heading font-black text-[#26334A] hover:text-[#D9384B] flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Demo</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works-section"
        className="py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t-3 border-dashed border-[#26334A]/25"
      >
        <div className="text-center mb-12">
          <span className="px-3 py-1 rounded-full bg-[#FF9DAB] text-[#7A1D2D] border border-[#26334A] font-heading font-bold text-xs uppercase mb-2 inline-block">
            Step-by-step Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-[#26334A]">
            How INFO-DETECTIVE Uncovers the Unknown
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto mt-1">
            A structured investigative pipeline that never guesses and never invents answers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="bg-white rounded-3xl border-3 border-[#26334A] p-5 shadow-[4px_4px_0px_#26334A] text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD84D] border-2 border-[#26334A] flex items-center justify-center font-heading font-black text-xl mx-auto mb-3">
              1
            </div>
            <h3 className="font-heading font-bold text-base text-[#26334A] mb-1">
              Select Question Library
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Choose from 8 curated categories (Scholarships, Career, Travel, Schemes...) or add custom questions to inspect.
            </p>
          </div>

          <div className="bg-white rounded-3xl border-3 border-[#26334A] p-5 shadow-[4px_4px_0px_#26334A] text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#8DD9F5] border-2 border-[#26334A] flex items-center justify-center font-heading font-black text-xl mx-auto mb-3">
              2
            </div>
            <h3 className="font-heading font-bold text-base text-[#26334A] mb-1">
              Provide Evidence
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Add URLs or paste source text from notices, emails, and forum posts. Enter real publication dates without guessing.
            </p>
          </div>

          <div className="bg-white rounded-3xl border-3 border-[#26334A] p-5 shadow-[4px_4px_0px_#26334A] text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#C8B6F0] border-2 border-[#26334A] flex items-center justify-center font-heading font-black text-xl mx-auto mb-3">
              3
            </div>
            <h3 className="font-heading font-bold text-base text-[#26334A] mb-1">
              Audit Every Question
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every question is assigned a strict status: Answered, Conflicting, Outdated, Not Found, or Requires Verification.
            </p>
          </div>

          <div className="bg-white rounded-3xl border-3 border-[#26334A] p-5 shadow-[4px_4px_0px_#26334A] text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FF9DAB] border-2 border-[#26334A] flex items-center justify-center font-heading font-black text-xl mx-auto mb-3">
              4
            </div>
            <h3 className="font-heading font-bold text-base text-[#26334A] mb-1">
              Verify Before Committing
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Review side-by-side Truth Clashes, inspect exact excerpts, and check off your auto-generated verification checklist.
            </p>
          </div>
        </div>

        {/* Start button below steps */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onStartInvestigation}
            className="px-8 py-3.5 rounded-2xl bg-[#FFD84D] hover:bg-[#ffcd1f] text-[#26334A] font-heading font-black text-base border-3 border-[#26334A] shadow-[4px_4px_0px_#26334A] transition-transform active:scale-95 cursor-pointer"
          >
            🔍 Start Your Investigation Now
          </button>
        </div>
      </section>

      {/* Footer / Practical Tips from Misae & Hiroshi */}
      <footer className="bg-[#FFF2F1] border-t-3 border-[#26334A] py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <CharacterAvatar id="misae" size="md" showBadge />
            <div>
              <p className="font-heading font-bold text-sm text-[#26334A]">
                Misae's Golden Research Rule:
              </p>
              <p className="text-xs text-neutral-700 max-w-md">
                "Never let marketing gloss hide missing deadlines! If a scholarship or scheme doesn't mention renewal conditions, ask the office before you sign!"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <CharacterAvatar id="hiroshi" size="md" showBadge />
            <div>
              <p className="font-heading font-bold text-sm text-[#26334A]">
                Hiroshi's Practical Advice:
              </p>
              <p className="text-xs text-neutral-700 max-w-md">
                "Always check the date on circulars. What was true in 2024 might have doubled in price by 2026!"
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-[#26334A]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-600 gap-3">
          <p>
            <strong>INFO-DETECTIVE</strong> — Every Answer Has a Missing Piece. Built with Google AI Studio.
          </p>
          <p>
            Detective theme inspired by the Kasukabe Defense Force. Original cartoon artwork system with asset slots.
          </p>
        </div>
      </footer>
    </div>
  );
};
