export type SourceType = 'official' | 'news' | 'third-party' | 'user-note';

export interface Source {
  id: string;
  title: string;
  domain: string;
  url: string;
  publicationDate?: string;
  retrievedDate: string;
  sourceType: SourceType;
  content: string;
  cycleOrYear?: string;
  authorOrOrg?: string;
}

export type QuestionPriority = 'high' | 'medium' | 'low';

export type QuestionStatus =
  | 'answered'
  | 'partially-answered'
  | 'not-found'
  | 'conflicting'
  | 'outdated'
  | 'requires-verification';

export interface EvidenceFinding {
  questionId: string;
  sourceId: string;
  sourceTitle: string;
  sourceType: SourceType;
  sourceDate?: string;
  excerpt: string; // MUST be an exact substring of the source's content
  startIndex: number;
  endIndex: number;
  findingType: 'direct_fact' | 'partial_evidence' | 'conflicting_claim' | 'outdated_claim' | 'unverified_hint';
  note?: string;
}

export interface Question {
  id: string;
  text: string;
  defaultPriority: QuestionPriority;
  priority: QuestionPriority;
  topic: string;
  whyItMatters: string;
  keywords: string[];
  suggestedSource: string;
  isSelected: boolean;
  isCustom?: boolean;
  isAiSuggested?: boolean;
  status?: QuestionStatus;
  secondaryFlags?: ('outdated' | 'unverified' | 'conflict')[];
  findingSummary?: string;
  decisionReason?: string;
  evidence?: EvidenceFinding[];
  suggestedNextStep?: string;
  // Gap classification
  gapCategory?: 'confirmed-missing' | 'not-found' | 'ambiguous' | 'none';
}

export interface TruthClashItem {
  id: string;
  questionId: string;
  questionText: string;
  topic: string;
  attributeName: string;
  claimA: {
    sourceId: string;
    sourceTitle: string;
    value: string;
    excerpt: string;
    date?: string;
    cycleOrYear?: string;
    sourceType: SourceType;
  };
  claimB: {
    sourceId: string;
    sourceTitle: string;
    value: string;
    excerpt: string;
    date?: string;
    cycleOrYear?: string;
    sourceType: SourceType;
  };
  conflictReason: string;
  verificationAdvice: string;
}

export interface ChecklistItem {
  id: string;
  questionId: string;
  task: string;
  priority: QuestionPriority;
  completed: boolean;
  category: string;
  sourceToConsult?: string;
}

export interface ScoringBreakdown {
  totalQuestions: number;
  highPriorityCount: number;
  answeredCount: number;
  partialCount: number;
  notFoundCount: number;
  conflictCount: number;
  outdatedCount: number;
  requiresVerificationCount: number;
  scorePercentage: number;
  totalEarnedWeight: number;
  maxPossibleWeight: number;
  formulaDescription: string;
  legend: {
    sourcedFacts: number;
    automatedComparisons: number;
    aiSuggestions: number;
    unresolvedUncertainties: number;
  };
}

export interface Investigation {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  mainQuestion: string;
  researchObjective: string;
  optionalContext: string;
  createdAt: string;
  updatedAt: string;
  isDemo: boolean;
  status: 'draft' | 'analyzed';
  analysisEngine: 'rule-based' | 'gemini-verified';
  questions: Question[];
  sources: Source[];
  truthClashes: TruthClashItem[];
  checklist: ChecklistItem[];
  scoring: ScoringBreakdown;
  characterReactions: {
    shinchan: string;
    kazama: string;
    nene: string;
    masao: string;
    bochan: string;
    himawari?: string;
  };
}

export interface QuestionCategory {
  id: string;
  name: string;
  icon: string;
  character: string;
  description: string;
  keywords: string[];
  suggestedPrompt: {
    topic: string;
    mainQuestion: string;
    objective: string;
  };
  questions: {
    id: string;
    text: string;
    defaultPriority: QuestionPriority;
    topic: string;
    whyItMatters: string;
    keywords: string[];
    suggestedSource: string;
  }[];
}
