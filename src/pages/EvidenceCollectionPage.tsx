import React, { useState } from 'react';
import { Source, SourceType } from '../types';
import { CharacterAvatar } from '../components/characters/CharacterAvatar';
import { extractSentences } from '../lib/gapAnalyzer';

interface EvidenceCollectionPageProps {
  sources: Source[];
  onAddSource: (src: Source) => void;
  onRemoveSource: (id: string) => void;
  onRunAnalysis: () => void;
  onBackToCaseFile: () => void;
  isAnalyzing: boolean;
}

export const EvidenceCollectionPage: React.FC<EvidenceCollectionPageProps> = ({
  sources,
  onAddSource,
  onRemoveSource,
  onRunAnalysis,
  onBackToCaseFile,
  isAnalyzing,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState<'paste' | 'url'>('paste');

  // Form states
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [domain, setDomain] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [cycleOrYear, setCycleOrYear] = useState('');
  const [sourceType, setSourceType] = useState<SourceType>('official');
  const [content, setContent] = useState('');
  const [expandedSourceId, setExpandedSourceId] = useState<string | null>(null);

  // URL auto-domain extraction
  const handleUrlChange = (val: string) => {
    setUrl(val);
    try {
      if (val.startsWith('http://') || val.startsWith('https://')) {
        const parsed = new URL(val);
        setDomain(parsed.hostname);
      }
    } catch {
      // ignore
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newSource: Source = {
      id: `src-${Date.now()}`,
      title: title.trim(),
      domain: domain.trim() || (url ? 'web-article' : 'user-paste'),
      url: url.trim() || 'https://user-submitted-text.local',
      publicationDate: publicationDate.trim() || undefined,
      cycleOrYear: cycleOrYear.trim() || undefined,
      retrievedDate: new Date().toISOString().split('T')[0],
      sourceType,
      content: content.trim(),
    };

    onAddSource(newSource);

    // Reset form
    setTitle('');
    setUrl('');
    setDomain('');
    setPublicationDate('');
    setCycleOrYear('');
    setContent('');
    setSourceType('official');
    setShowAddModal(false);
  };

  const sentenceCount = content ? extractSentences(content).length : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Header Deck Card */}
      <div className="bg-white rounded-3xl border-3 border-[#26334A] p-6 sm:p-8 shadow-[4px_4px_0px_#26334A]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <CharacterAvatar
              id="bochan"
              size="lg"
              showBadge
              bubblePlacement="side"
              speechBubble="Bo-chan needs raw evidence text! Every single claim we verify must be an exact substring inside your sources!"
            />
            <div>
              <span className="text-xs font-heading font-black uppercase tracking-wider text-[#3F2B66]">
                Phase 2: Evidence Collection
              </span>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#26334A]">
                Submit Evidence Documents
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
                Paste official notices, guidebooks, news articles, or forum posts. Support at least 2–3 sources for conflict detection.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#FFD84D] hover:bg-[#ffcf29] text-[#26334A] font-heading font-black text-xs sm:text-sm border-2 border-[#26334A] shadow-[2px_2px_0px_#26334A] cursor-pointer flex items-center gap-1.5"
            >
              <span>+</span>
              <span>Add Source Document</span>
            </button>

            <button
              type="button"
              onClick={onRunAnalysis}
              disabled={sources.length === 0 || isAnalyzing}
              className={`px-5 py-2.5 rounded-2xl font-heading font-black text-xs sm:text-sm border-2 border-[#26334A] shadow-[3px_3px_0px_#26334A] transition-all cursor-pointer ${
                sources.length > 0 && !isAnalyzing
                  ? 'bg-[#8DD9F5] hover:bg-[#78d0f0] text-[#1E4D69] active:scale-95'
                  : 'bg-neutral-200 text-neutral-400 border-neutral-300 shadow-none cursor-not-allowed'
              }`}
            >
              {isAnalyzing ? '🔍 Investigating...' : `ANALYSE EVIDENCE (${sources.length} Sources) →`}
            </button>
          </div>
        </div>

        {/* Honesty Disclosure Banner */}
        <div className="mt-6 pt-4 border-t border-[#26334A]/15 bg-[#FFF8E9] rounded-2xl p-3 border border-[#26334A]/30 flex items-center gap-3">
          <span className="text-xl">⚖️</span>
          <p className="text-xs text-neutral-700 leading-snug">
            <strong>Honesty Rule:</strong> We never invent or fabricate dates, citations, or quotes. If a URL cannot be fetched directly due to browser cross-origin rules, paste the actual source text below.
          </p>
        </div>
      </div>

      {/* Sources Collection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-black text-[#26334A] flex items-center gap-2">
            <span>Collected Evidence Documents</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFD84D] border border-[#26334A] font-bold">
              {sources.length} Document{sources.length === 1 ? '' : 's'}
            </span>
          </h2>
          <span className="text-xs text-neutral-500 font-semibold">
            {sources.length >= 2 ? '✅ Ready for conflict comparison' : '⚠️ Add at least 2 sources to detect clashes'}
          </span>
        </div>

        {sources.length === 0 ? (
          <div className="bg-white rounded-3xl border-3 border-dashed border-[#26334A]/30 p-12 text-center space-y-4">
            <div className="text-4xl">📂</div>
            <h3 className="font-heading font-bold text-lg text-[#26334A]">
              No evidence documents added yet!
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
              Click the button below to paste article text, an official circular, or notes.
            </p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 rounded-2xl font-heading font-black text-sm bg-[#FFD84D] hover:bg-[#ffcf29] text-[#26334A] border-2 border-[#26334A] shadow-[2px_2px_0px_#26334A] cursor-pointer"
            >
              + Add First Evidence Source
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sources.map((src) => {
              const isExpanded = expandedSourceId === src.id;

              return (
                <div
                  key={src.id}
                  className="bg-white rounded-3xl border-3 border-[#26334A] p-5 shadow-[4px_4px_0px_#26334A] flex flex-col justify-between hover:shadow-[5px_5px_0px_#26334A] transition-all"
                >
                  <div>
                    {/* Top Type Badge & Remove button */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#26334A] ${
                          src.sourceType === 'official'
                            ? 'bg-[#D1F2D9] text-[#1E5631]'
                            : src.sourceType === 'news'
                            ? 'bg-[#8DD9F5] text-[#1E4D69]'
                            : src.sourceType === 'third-party'
                            ? 'bg-[#FEF08A] text-[#854D0E]'
                            : 'bg-[#F3E8FF] text-[#581C87]'
                        }`}
                      >
                        {src.sourceType}
                      </span>

                      <button
                        type="button"
                        onClick={() => onRemoveSource(src.id)}
                        className="text-xs text-neutral-400 hover:text-red-600 p-1 rounded cursor-pointer"
                        title="Remove source"
                      >
                        🗑️
                      </button>
                    </div>

                    <h3 className="font-heading font-black text-base text-[#26334A] line-clamp-2 mb-1">
                      {src.title}
                    </h3>

                    <div className="text-[11px] text-neutral-500 font-semibold space-y-0.5 mb-3">
                      <p className="truncate">🌐 {src.domain} {src.authorOrOrg ? `• ${src.authorOrOrg}` : ''}</p>
                      <p>
                        📅 Date:{' '}
                        <strong className="text-neutral-700">
                          {src.publicationDate || src.cycleOrYear || 'Undated (needs verification)'}
                        </strong>
                      </p>
                    </div>

                    {/* Content Preview */}
                    <div className="bg-[#FFF8E9] rounded-xl border border-[#26334A]/20 p-2.5 text-xs text-neutral-700 font-serif leading-relaxed relative">
                      <p className={isExpanded ? '' : 'line-clamp-4'}>
                        "{src.content}"
                      </p>
                      <button
                        type="button"
                        onClick={() => setExpandedSourceId(isExpanded ? null : src.id)}
                        className="mt-1 text-[11px] font-heading font-bold text-[#D9384B] hover:underline cursor-pointer block"
                      >
                        {isExpanded ? 'Collapse' : 'Expand full document text'}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#26334A]/10 flex items-center justify-between text-[11px] text-neutral-500 font-medium">
                    <span>{extractSentences(src.content).length} sentences</span>
                    <span>{src.content.length} characters</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#26334A]/15">
        <button
          type="button"
          onClick={onBackToCaseFile}
          className="px-4 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm text-neutral-600 hover:text-black hover:bg-neutral-100 cursor-pointer"
        >
          ← Back to Case File
        </button>

        <button
          type="button"
          onClick={onRunAnalysis}
          disabled={sources.length === 0 || isAnalyzing}
          className={`px-7 py-3 rounded-2xl font-heading font-black text-sm sm:text-base border-3 border-[#26334A] shadow-[4px_4px_0px_#26334A] transition-all cursor-pointer ${
            sources.length > 0 && !isAnalyzing
              ? 'bg-[#FFD84D] hover:bg-[#ffcf29] text-[#26334A] active:scale-95'
              : 'bg-neutral-200 text-neutral-400 border-neutral-300 shadow-none cursor-not-allowed'
          }`}
        >
          {isAnalyzing ? '🔍 Investigating...' : 'ANALYSE EVIDENCE →'}
        </button>
      </div>

      {/* Add Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#26334A]/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border-3 border-[#26334A] p-6 max-w-xl w-full shadow-[6px_6px_0px_#26334A] space-y-4 my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-heading font-black text-[#26334A]">
                Add Evidence Document
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-neutral-500 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            {/* Input Method Switcher */}
            <div className="flex items-center gap-2 p-1 bg-[#FFF8E9] rounded-2xl border border-[#26334A]">
              <button
                type="button"
                onClick={() => setAddMode('paste')}
                className={`flex-1 py-1.5 rounded-xl font-heading font-bold text-xs transition-colors cursor-pointer ${
                  addMode === 'paste'
                    ? 'bg-[#26334A] text-white'
                    : 'text-[#26334A] hover:bg-white'
                }`}
              >
                📋 Paste Source Text
              </button>
              <button
                type="button"
                onClick={() => setAddMode('url')}
                className={`flex-1 py-1.5 rounded-xl font-heading font-bold text-xs transition-colors cursor-pointer ${
                  addMode === 'url'
                    ? 'bg-[#26334A] text-white'
                    : 'text-[#26334A] hover:bg-white'
                }`}
              >
                🔗 Website URL + Text
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold text-[#26334A] mb-1">
                  Document Title / Source Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Official University Admission Circular 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#26334A] text-sm focus:outline-none"
                />
              </div>

              {addMode === 'url' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-heading font-bold text-[#26334A] mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.gov/circular"
                      value={url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#26334A] text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-bold text-[#26334A] mb-1">
                      Domain / Host
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. mohe.gov.example"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#26334A] text-xs focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold text-[#26334A] mb-1">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#26334A] text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-[#26334A] mb-1">
                    Cycle / Intake Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2026 Cycle"
                    value={cycleOrYear}
                    onChange={(e) => setCycleOrYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#26334A] text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-[#26334A] mb-1">
                    Source Type
                  </label>
                  <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value as SourceType)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#26334A] text-xs focus:outline-none"
                  >
                    <option value="official">Official Source</option>
                    <option value="news">News Outlet</option>
                    <option value="third-party">Third-Party Guide</option>
                    <option value="user-note">User Note / Forum</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-heading font-bold text-[#26334A]">
                    Source Text Content *
                  </label>
                  <span className="text-[11px] text-neutral-500 font-semibold">
                    {sentenceCount} sentences detected
                  </span>
                </div>
                <textarea
                  required
                  rows={6}
                  placeholder="Paste the full text excerpt from the notification, terms of service, article, or forum post here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#26334A] text-xs sm:text-sm font-mono focus:outline-none"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  All analysis findings link directly to exact substrings inside this text.
                </p>
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
                  Save Source Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
