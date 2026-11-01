import React, { useState } from 'react';
import { CharacterAvatar } from '../components/characters/CharacterAvatar';
import { QuestionCategory } from '../types';

interface CaseFilePageProps {
  category: QuestionCategory;
  initialTopic?: string;
  initialMainQuestion?: string;
  initialObjective?: string;
  initialContext?: string;
  onProceedToEvidence: (data: {
    topic: string;
    mainQuestion: string;
    objective: string;
    context: string;
  }) => void;
  onBackToQuestions: () => void;
}

export const CaseFilePage: React.FC<CaseFilePageProps> = ({
  category,
  initialTopic,
  initialMainQuestion,
  initialObjective,
  initialContext = '',
  onProceedToEvidence,
  onBackToQuestions,
}) => {
  const [topic, setTopic] = useState(
    initialTopic || category.suggestedPrompt?.topic || ''
  );
  const [mainQuestion, setMainQuestion] = useState(
    initialMainQuestion || category.suggestedPrompt?.mainQuestion || ''
  );
  const [objective, setObjective] = useState(
    initialObjective || category.suggestedPrompt?.objective || ''
  );
  const [context, setContext] = useState(initialContext);

  const handleUsePrompt = (prompt: { topic: string; mainQuestion: string; objective: string }) => {
    setTopic(prompt.topic);
    setMainQuestion(prompt.mainQuestion);
    setObjective(prompt.objective);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !mainQuestion.trim() || !objective.trim()) return;

    onProceedToEvidence({
      topic: topic.trim(),
      mainQuestion: mainQuestion.trim(),
      objective: objective.trim(),
      context: context.trim(),
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Notebook Wrapper */}
      <div className="relative bg-[#FFFDF5] rounded-3xl border-3 border-[#26334A] p-6 sm:p-10 shadow-[6px_6px_0px_#26334A]">
        {/* Notebook Spiral Accent Top */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-[#26334A]/30 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">📓</span>
            <span className="font-heading font-black text-sm uppercase tracking-wider text-[#26334A]">
              Detective Case Docket #{category.id.toUpperCase()}-2026
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF9DAB] border border-[#26334A]" />
            <div className="w-3 h-3 rounded-full bg-[#FFD84D] border border-[#26334A]" />
            <div className="w-3 h-3 rounded-full bg-[#8DD9F5] border border-[#26334A]" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#26334A]">
              Case File Specification
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Define your primary research query and mission objective. This anchors the gap detection engine.
            </p>
          </div>

          <CharacterAvatar
            id="shinchan"
            size="md"
            showBadge
            bubblePlacement="side"
            speechBubble="Write down what you really need to know! No detail is too small for our magnifying glasses!"
          />
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs sm:text-sm font-heading font-black text-[#26334A]">
                1. Investigation Topic / Case Subject *
              </label>
              <span className="text-[11px] text-neutral-500 font-semibold">
                Category: {category.name}
              </span>
            </div>
            <input
              type="text"
              required
              placeholder="e.g. Global Excellence Undergraduate Scholarship 2026"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-[#26334A] bg-white text-sm sm:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFD84D]"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-heading font-black text-[#26334A] mb-1">
              2. Core Research Question *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. What are the exact eligibility criteria, deadlines, and renewal terms?"
              value={mainQuestion}
              onChange={(e) => setMainQuestion(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-[#26334A] bg-white text-sm sm:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFD84D]"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-heading font-black text-[#26334A] mb-1">
              3. Research Objective & Decision Stake *
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Verify if I qualify, confirm submission deadline, and ensure I can renew it for all four years without conflicting with other financial aid."
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-[#26334A] bg-white text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#FFD84D]"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-heading font-black text-[#26334A] mb-1">
              4. Optional Context or Initial Clues
            </label>
            <input
              type="text"
              placeholder="e.g. Applying for engineering. Found two articles online with different dates."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#26334A] bg-white text-xs sm:text-sm focus:outline-none"
            />
          </div>

          {/* Preset Sample Prompt Pill */}
          {category.suggestedPrompt && (
            <div className="bg-[#FFF8E9] rounded-2xl border border-[#26334A]/30 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#D9384B]">
                  💡 Suggested Template Prompt:
                </span>
                <p className="text-xs text-[#26334A] font-semibold mt-0.5">
                  "{category.suggestedPrompt.topic}"
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleUsePrompt(category.suggestedPrompt)}
                className="text-xs font-heading font-bold px-3 py-1.5 rounded-xl bg-white border border-[#26334A] text-[#26334A] hover:bg-neutral-50 cursor-pointer whitespace-nowrap"
              >
                Use Suggested Prompt
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-[#26334A]/15 flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToQuestions}
              className="px-4 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm text-neutral-600 hover:text-black hover:bg-neutral-100 cursor-pointer"
            >
              ← Back to Questions
            </button>

            <button
              type="submit"
              className="px-6 sm:px-8 py-3.5 rounded-2xl font-heading font-black text-sm sm:text-base bg-[#FFD84D] hover:bg-[#ffcf29] text-[#26334A] border-3 border-[#26334A] shadow-[4px_4px_0px_#26334A] transition-transform active:scale-95 cursor-pointer"
            >
              Proceed to Evidence Collection →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
