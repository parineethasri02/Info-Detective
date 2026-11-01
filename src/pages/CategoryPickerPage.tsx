import React, { useState } from 'react';
import { QuestionCategory, Question, QuestionPriority } from '../types';
import questionTemplates from '../data/questionTemplates.json';
import { CharacterAvatar } from '../components/characters/CharacterAvatar';
import { PriorityBadge } from '../components/ui/StatusBadge';
import { generateSuggestedQuestions } from '../lib/gemini';

interface CategoryPickerPageProps {
  initialCategoryId?: string;
  initialQuestions?: Question[];
  onContinueToCaseFile: (
    category: QuestionCategory,
    questions: Question[],
    suggestedPrompt?: { topic: string; mainQuestion: string; objective: string }
  ) => void;
}

export const CategoryPickerPage: React.FC<CategoryPickerPageProps> = ({
  initialCategoryId = 'scholarships',
  initialQuestions,
  onContinueToCaseFile,
}) => {
  const categories = questionTemplates.categories as unknown as QuestionCategory[];

  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>(() => {
    return categories.find((c) => c.id === initialCategoryId) || categories[0];
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      return initialQuestions;
    }
    const cat = categories.find((c) => c.id === initialCategoryId) || categories[0];
    return cat.questions.map((q) => ({
      ...q,
      priority: q.defaultPriority,
      isSelected: true,
      isCustom: false,
      isAiSuggested: false,
    }));
  });

  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionTopic, setNewQuestionTopic] = useState('');
  const [newQuestionPriority, setNewQuestionPriority] = useState<QuestionPriority>('high');
  const [newQuestionWhy, setNewQuestionWhy] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Switch category
  const handleSelectCategory = (cat: QuestionCategory) => {
    setSelectedCategory(cat);
    setQuestions(
      cat.questions.map((q) => ({
        ...q,
        priority: q.defaultPriority,
        isSelected: true,
        isCustom: false,
        isAiSuggested: false,
      }))
    );
  };

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isSelected: !q.isSelected } : q))
    );
  };

  // Select / Deselect All
  const handleSelectAll = (select: boolean) => {
    setQuestions((prev) => prev.map((q) => ({ ...q, isSelected: select })));
  };

  // Delete question
  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Start inline editing
  const handleStartEdit = (q: Question) => {
    setEditingQuestionId(q.id);
    setEditText(q.text);
  };

  // Save inline edit
  const handleSaveEdit = (id: string) => {
    if (editText.trim()) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, text: editText.trim() } : q))
      );
    }
    setEditingQuestionId(null);
  };

  // Change priority
  const handleChangePriority = (id: string, priority: QuestionPriority) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, priority } : q))
    );
  };

  // Add custom question
  const handleAddCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ: Question = {
      id: `custom-q-${Date.now()}`,
      text: newQuestionText.trim(),
      defaultPriority: newQuestionPriority,
      priority: newQuestionPriority,
      topic: newQuestionTopic.trim() || 'Custom Requirement',
      whyItMatters: newQuestionWhy.trim() || 'Important factor specified for your research objective.',
      keywords: newQuestionText
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 3),
      suggestedSource: 'Official Documentation or Customer Service',
      isSelected: true,
      isCustom: true,
      isAiSuggested: false,
    };

    setQuestions((prev) => [newQ, ...prev]);
    setNewQuestionText('');
    setNewQuestionTopic('');
    setNewQuestionWhy('');
    setShowAddModal(false);
  };

  // Suggest follow-up questions
  const handleSuggestAiQuestions = async () => {
    setIsGeneratingAi(true);
    try {
      const generated = await generateSuggestedQuestions(
        selectedCategory.suggestedPrompt.topic,
        selectedCategory.suggestedPrompt.objective,
        questions.map((q) => q.text)
      );
      setQuestions((prev) => [...generated, ...prev]);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Accept AI suggestion (remove the badge indicator)
  const handleAcceptSuggestion = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isAiSuggested: false } : q))
    );
  };

  const selectedCount = questions.filter((q) => q.isSelected).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Title & Guidance Header */}
      <div className="bg-white rounded-3xl border-3 border-[#26334A] p-6 sm:p-8 shadow-[4px_4px_0px_#26334A]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <CharacterAvatar
              id={selectedCategory.character || 'shinchan'}
              size="lg"
              showBadge
              bubblePlacement="side"
              speechBubble="Start with a pre-built question library so you don't miss critical clauses!"
            />
            <div>
              <span className="text-xs font-heading font-black uppercase tracking-wider text-[#D9384B]">
                Phase 1: Research Question Engine
              </span>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#26334A]">
                Choose Category & Refine Questions
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
                INFO-DETECTIVE tests evidence against EVERY selected question. Pick what you want to audit.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              type="button"
              onClick={() =>
                onContinueToCaseFile(
                  selectedCategory,
                  questions,
                  selectedCategory.suggestedPrompt
                )
              }
              disabled={selectedCount === 0}
              className={`px-5 py-3 rounded-2xl font-heading font-black text-sm border-2 border-[#26334A] shadow-[3px_3px_0px_#26334A] transition-all cursor-pointer ${
                selectedCount > 0
                  ? 'bg-[#FFD84D] hover:bg-[#ffcf29] text-[#26334A] active:scale-95'
                  : 'bg-neutral-200 text-neutral-400 border-neutral-300 shadow-none cursor-not-allowed'
              }`}
            >
              Continue to Case File ({selectedCount} Selected) →
            </button>
          </div>
        </div>

        {/* 8 Category Selection Cards Grid */}
        <div className="mt-8 pt-6 border-t border-[#26334A]/15">
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-neutral-500 mb-3">
            Select Investigation Domain:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => {
              const isCatActive = cat.id === selectedCategory.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-label={`Category: ${cat.name}`}
                  onClick={() => handleSelectCategory(cat)}
                  className={`p-3 rounded-2xl border-2 text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
                    isCatActive
                      ? 'bg-[#26334A] text-white border-[#26334A] shadow-[3px_3px_0px_#FFD84D] scale-102'
                      : 'bg-[#FFF8E9] text-[#26334A] border-[#26334A]/30 hover:border-[#26334A] hover:bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg mb-1">
                    {cat.id === 'scholarships' && '🎓'}
                    {cat.id === 'education' && '📚'}
                    {cat.id === 'career' && '💼'}
                    {cat.id === 'study-abroad' && '✈️'}
                    {cat.id === 'gov-schemes' && '🏛️'}
                    {cat.id === 'shopping-products' && '🛒'}
                    {cat.id === 'travel' && '🧭'}
                    {cat.id === 'general-research' && '🔍'}
                  </div>
                  <span className="font-heading font-bold text-xs leading-tight line-clamp-2">
                    {cat.name}
                  </span>
                  <span className="text-[10px] opacity-75 mt-1">
                    {cat.questions.length} Qs
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Question Manager Section */}
      <div className="bg-white rounded-3xl border-3 border-[#26334A] p-6 shadow-[4px_4px_0px_#26334A] space-y-6">
        {/* Category Description & Action Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#26334A]/15">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-heading font-black text-[#26334A]">
                {selectedCategory.name} Question Library
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFD84D] border border-[#26334A] font-bold">
                {selectedCount} of {questions.length} Selected
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              {selectedCategory.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleSelectAll(true)}
              className="px-3 py-1.5 rounded-xl font-heading font-bold text-xs bg-white hover:bg-neutral-50 text-[#26334A] border border-[#26334A] cursor-pointer"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => handleSelectAll(false)}
              className="px-3 py-1.5 rounded-xl font-heading font-bold text-xs bg-white hover:bg-neutral-50 text-[#26334A] border border-[#26334A] cursor-pointer"
            >
              Deselect All
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-xl font-heading font-bold text-xs bg-[#FFD84D] hover:bg-[#ffcf29] text-[#26334A] border border-[#26334A] shadow-[2px_2px_0px_#26334A] cursor-pointer flex items-center gap-1"
            >
              <span>+</span>
              <span>Add Custom</span>
            </button>
            <button
              type="button"
              onClick={handleSuggestAiQuestions}
              disabled={isGeneratingAi}
              className="px-3 py-1.5 rounded-xl font-heading font-bold text-xs bg-[#8DD9F5] hover:bg-[#77cfee] text-[#1E4D69] border border-[#26334A] shadow-[2px_2px_0px_#26334A] cursor-pointer flex items-center gap-1.5"
            >
              <span>💡</span>
              <span>{isGeneratingAi ? 'Analyzing...' : 'Suggest Follow-Up'}</span>
            </button>
          </div>
        </div>

        {/* Question Cards List */}
        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className={`rounded-2xl border-2 p-4 transition-all ${
                q.isSelected
                  ? 'bg-white border-[#26334A] shadow-[2px_2px_0px_#26334A]'
                  : 'bg-neutral-50 border-neutral-300 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Selection Checkbox */}
                  <input
                    type="checkbox"
                    id={`q-check-${q.id}`}
                    checked={q.isSelected}
                    onChange={() => handleToggleSelect(q.id)}
                    className="mt-1 w-5 h-5 rounded-lg border-2 border-[#26334A] accent-[#FFD84D] cursor-pointer"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[11px] font-heading font-black text-neutral-400">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-heading font-bold px-2 py-0.5 rounded-md bg-[#FFF8E9] border border-[#26334A]/40 text-[#26334A]">
                        {q.topic}
                      </span>

                      {/* Priority Selector */}
                      <div className="inline-flex items-center gap-1 ml-auto sm:ml-0">
                        <button
                          type="button"
                          onClick={() => handleChangePriority(q.id, 'high')}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                            q.priority === 'high'
                              ? 'bg-[#FF9DAB] text-[#7A1D2D] border-[#7A1D2D]'
                              : 'bg-white text-neutral-500 border-neutral-300'
                          }`}
                        >
                          High
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChangePriority(q.id, 'medium')}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                            q.priority === 'medium'
                              ? 'bg-[#FFD84D] text-[#634F0C] border-[#634F0C]'
                              : 'bg-white text-neutral-500 border-neutral-300'
                          }`}
                        >
                          Med
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChangePriority(q.id, 'low')}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                            q.priority === 'low'
                              ? 'bg-[#E2E8F0] text-[#334155] border-[#334155]'
                              : 'bg-white text-neutral-500 border-neutral-300'
                          }`}
                        >
                          Low
                        </button>
                      </div>

                      {q.isAiSuggested && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#075985] border border-[#075985]">
                          <span>💡 AI-generated suggestion</span>
                          <button
                            type="button"
                            onClick={() => handleAcceptSuggestion(q.id)}
                            className="ml-1 underline cursor-pointer"
                            title="Accept question"
                          >
                            Accept
                          </button>
                        </span>
                      )}

                      {q.isCustom && !q.isAiSuggested && (
                        <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-[#FEF08A] text-[#854D0E] border border-[#854D0E]">
                          Custom Added
                        </span>
                      )}
                    </div>

                    {/* Question Text / Inline Edit */}
                    {editingQuestionId === q.id ? (
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-xl border-2 border-[#26334A] text-sm focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(q.id)}
                          className="px-3 py-1.5 rounded-xl font-heading font-bold text-xs bg-[#26334A] text-white cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingQuestionId(null)}
                          className="px-2 py-1.5 text-xs text-neutral-600 hover:text-black cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-[#26334A] leading-snug">
                        {q.text}
                      </p>
                    )}

                    {/* Why It Matters */}
                    <p className="text-xs text-neutral-500 mt-1 italic">
                      Why it matters: {q.whyItMatters}
                    </p>
                  </div>
                </div>

                {/* Question Actions (Edit / Delete) */}
                <div className="flex items-center gap-1.5">
                  {editingQuestionId !== q.id && (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(q)}
                      title="Edit question text"
                      className="p-1.5 text-xs text-neutral-600 hover:text-[#26334A] rounded-lg hover:bg-neutral-100 cursor-pointer"
                    >
                      ✏️
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(q.id)}
                    title="Remove question"
                    className="p-1.5 text-xs text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Continue Button */}
        <div className="pt-4 border-t border-[#26334A]/15 flex items-center justify-between">
          <div className="text-xs text-neutral-600">
            <strong>{selectedCount}</strong> questions ready for gap analysis.
          </div>
          <button
            type="button"
            onClick={() =>
              onContinueToCaseFile(
                selectedCategory,
                questions,
                selectedCategory.suggestedPrompt
              )
            }
            disabled={selectedCount === 0}
            className={`px-6 py-3 rounded-2xl font-heading font-black text-sm border-2 border-[#26334A] shadow-[3px_3px_0px_#26334A] transition-all cursor-pointer ${
              selectedCount > 0
                ? 'bg-[#FFD84D] hover:bg-[#ffcf29] text-[#26334A] active:scale-95'
                : 'bg-neutral-200 text-neutral-400 border-neutral-300 shadow-none cursor-not-allowed'
            }`}
          >
            Continue to Case File →
          </button>
        </div>
      </div>

      {/* Modal for Adding Custom Question */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#26334A]/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-3 border-[#26334A] p-6 max-w-lg w-full shadow-[6px_6px_0px_#26334A] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-heading font-black text-[#26334A]">
                Add Custom Investigation Question
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-neutral-500 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold text-[#26334A] mb-1">
                  Question Text *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What is the cancellation or penalty clause?"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#26334A] text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold text-[#26334A] mb-1">
                    Topic / Sub-area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Penalty Terms"
                    value={newQuestionTopic}
                    onChange={(e) => setNewQuestionTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#26334A] text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-[#26334A] mb-1">
                    Priority
                  </label>
                  <select
                    value={newQuestionPriority}
                    onChange={(e) => setNewQuestionPriority(e.target.value as QuestionPriority)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#26334A] text-xs focus:outline-none"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#26334A] mb-1">
                  Why It Matters
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prevents unexpected financial liability or penalty."
                  value={newQuestionWhy}
                  onChange={(e) => setNewQuestionWhy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#26334A] text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-heading font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-heading font-black text-xs bg-[#FFD84D] hover:bg-[#ffcf29] text-[#26334A] border-2 border-[#26334A] shadow-[2px_2px_0px_#26334A]"
                >
                  Add Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
