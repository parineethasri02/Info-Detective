import {
  Question,
  Source,
  EvidenceFinding,
  TruthClashItem,
  QuestionStatus,
  ChecklistItem,
} from '../types';

/**
 * Splits text into sentences while retaining readable bounds.
 */
export function extractSentences(text: string): { sentence: string; startIndex: number; endIndex: number }[] {
  if (!text) return [];
  // Split on sentence boundaries (.!? followed by whitespace or end)
  const regex = /[^.!?\n]+(?:[.!?]+|\n|$)/g;
  const results: { sentence: string; startIndex: number; endIndex: number }[] = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const rawSentence = match[0];
    const trimmed = rawSentence.trim();
    if (trimmed.length > 5) {
      const offsetInRaw = rawSentence.indexOf(trimmed);
      const start = match.index + offsetInRaw;
      const end = start + trimmed.length;
      results.push({
        sentence: trimmed,
        startIndex: start,
        endIndex: end,
      });
    }
  }

  return results;
}

/**
 * Validates that an excerpt is a strict substring of the source text.
 * Rule: Quotes must be substrings of the actual source text. Never invent or paraphrase quotes.
 */
export function verifySubstringExcerpt(sourceContent: string, excerpt: string): { valid: boolean; start: number; end: number } {
  if (!sourceContent || !excerpt) return { valid: false, start: -1, end: -1 };
  const index = sourceContent.indexOf(excerpt);
  if (index !== -1) {
    return { valid: true, start: index, end: index + excerpt.length };
  }
  // Try trimmed version
  const trimmed = excerpt.trim();
  const indexTrimmed = sourceContent.indexOf(trimmed);
  if (indexTrimmed !== -1) {
    return { valid: true, start: indexTrimmed, end: indexTrimmed + trimmed.length };
  }
  return { valid: false, start: -1, end: -1 };
}

/**
 * Extracts key dates, amounts, percentages, and deadlines from text using regex.
 */
export function extractAttributes(text: string): {
  dates: string[];
  amounts: string[];
  percentages: string[];
} {
  const dates: string[] = [];
  const amounts: string[] = [];
  const percentages: string[] = [];

  // Dates: e.g. "15 December", "December 20", "2025-09-15", "2026", "20 Dec"
  const dateRegex = /\b(?:(?:\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?))|(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?)|(?:\d{4}-\d{2}-\d{2}))\b/gi;
  let match;
  while ((match = dateRegex.exec(text)) !== null) {
    dates.push(match[0]);
  }

  // Amounts: e.g. "$60,000", "€100", "$2,000", "50,000"
  const amountRegex = /(?:[\$€£₹]\s*[\d,]+(?:\.\d+)?|\b[\d,]+\s*(?:dollars|euros|usd|eur|inr)\b)/gi;
  while ((match = amountRegex.exec(text)) !== null) {
    amounts.push(match[0].trim());
  }

  // Percentages / GPAs: e.g. "100%", "3.8 GPA", "GPA of 3.8", "3.5"
  const pctRegex = /\b(?:\d+(?:\.\d+)?%|(?:gpa\s+(?:of\s+)?|minimum\s+gpa\s+)?\b[234]\.[0-9]\b)/gi;
  while ((match = pctRegex.exec(text)) !== null) {
    percentages.push(match[0].trim());
  }

  return { dates, amounts, percentages };
}

/**
 * Evaluates a single question against all submitted sources.
 */
export function analyzeQuestionAgainstSources(
  question: Question,
  sources: Source[]
): {
  status: QuestionStatus;
  secondaryFlags: ('outdated' | 'unverified' | 'conflict')[];
  findingSummary: string;
  decisionReason: string;
  suggestedNextStep: string;
  gapCategory: 'confirmed-missing' | 'not-found' | 'ambiguous' | 'none';
  evidence: EvidenceFinding[];
  conflictCandidate?: {
    sourceA: Source;
    excerptA: string;
    valA: string;
    sourceB: Source;
    excerptB: string;
    valB: string;
    attribute: string;
  };
} {
  if (sources.length === 0) {
    return {
      status: 'not-found',
      secondaryFlags: [],
      findingSummary: 'No sources provided to evaluate.',
      decisionReason: 'Zero sources submitted for analysis.',
      suggestedNextStep: 'Add at least one official source or article to begin gap analysis.',
      gapCategory: 'not-found',
      evidence: [],
    };
  }

  const keywordPool = [
    ...question.keywords.map((k) => k.toLowerCase()),
    ...question.topic.toLowerCase().split(/\s+/).filter((w) => w.length > 3),
  ];

  const matchedFindings: EvidenceFinding[] = [];
  const sourceHits: { source: Source; sentences: { sentence: string; start: number; end: number }[] }[] = [];

  for (const src of sources) {
    const sentences = extractSentences(src.content);
    const matchedInSrc: { sentence: string; start: number; end: number }[] = [];

    for (const s of sentences) {
      const lower = s.sentence.toLowerCase();
      const hits = keywordPool.filter((kw) => lower.includes(kw));
      if (hits.length > 0) {
        matchedInSrc.push(s);
        const subCheck = verifySubstringExcerpt(src.content, s.sentence);
        if (subCheck.valid) {
          let findingType: EvidenceFinding['findingType'] = 'direct_fact';
          if (src.sourceType === 'user-note') {
            findingType = 'unverified_hint';
          } else if (src.cycleOrYear && (src.cycleOrYear.includes('2024') || src.cycleOrYear.includes('2025'))) {
            // Check if there is a newer source in the collection
            const hasNewer = sources.some(
              (other) => other.cycleOrYear && other.cycleOrYear.includes('2026')
            );
            if (hasNewer) {
              findingType = 'outdated_claim';
            }
          }

          matchedFindings.push({
            questionId: question.id,
            sourceId: src.id,
            sourceTitle: src.title,
            sourceType: src.sourceType,
            sourceDate: src.publicationDate || src.cycleOrYear || 'Undated',
            excerpt: s.sentence,
            startIndex: subCheck.start,
            endIndex: subCheck.end,
            findingType,
          });
        }
      }
    }

    if (matchedInSrc.length > 0) {
      sourceHits.push({ source: src, sentences: matchedInSrc });
    }
  }

  // 1. Check for Conflicts between sources for this question
  if (sourceHits.length >= 2) {
    // Check if dates or amounts differ
    for (let i = 0; i < sourceHits.length; i++) {
      for (let j = i + 1; j < sourceHits.length; j++) {
        const hitA = sourceHits[i];
        const hitB = sourceHits[j];
        const fullA = hitA.sentences.map((s) => s.sentence).join(' ');
        const fullB = hitB.sentences.map((s) => s.sentence).join(' ');

        const attrA = extractAttributes(fullA);
        const attrB = extractAttributes(fullB);

        // Date conflict: both mention dates, but different dates
        const dateA = attrA.dates[0];
        const dateB = attrB.dates[0];
        if (dateA && dateB && dateA.toLowerCase() !== dateB.toLowerCase()) {
          // Found contradictory dates!
          return {
            status: 'conflicting',
            secondaryFlags: ['conflict'],
            findingSummary: `Conflicting dates detected: "${dateA}" (${hitA.source.title}) vs "${dateB}" (${hitB.source.title}).`,
            decisionReason: 'Two or more independent sources cite contradictory date values for this topic.',
            suggestedNextStep: 'Consult the live official authority portal directly. Never assume a third-party source is correct.',
            gapCategory: 'none',
            evidence: matchedFindings,
            conflictCandidate: {
              sourceA: hitA.source,
              excerptA: hitA.sentences[0].sentence,
              valA: dateA,
              sourceB: hitB.source,
              excerptB: hitB.sentences[0].sentence,
              valB: dateB,
              attribute: 'Date / Deadline',
            },
          };
        }

        // Amount conflict
        const amtA = attrA.amounts[0];
        const amtB = attrB.amounts[0];
        if (amtA && amtB && amtA.toLowerCase() !== amtB.toLowerCase()) {
          return {
            status: 'conflicting',
            secondaryFlags: ['conflict'],
            findingSummary: `Conflicting financial values detected: "${amtA}" vs "${amtB}".`,
            decisionReason: 'Multiple sources state contradictory amounts or thresholds.',
            suggestedNextStep: 'Verify statutory amount against the primary governing gazette.',
            gapCategory: 'none',
            evidence: matchedFindings,
            conflictCandidate: {
              sourceA: hitA.source,
              excerptA: hitA.sentences[0].sentence,
              valA: amtA,
              sourceB: hitB.source,
              excerptB: hitB.sentences[0].sentence,
              valB: amtB,
              attribute: 'Financial Amount',
            },
          };
        }
      }
    }
  }

  // 2. Check if no text was found in any reviewed source
  if (matchedFindings.length === 0) {
    // Check if the source explicitly mentions that this info is "unannounced" or "silent"
    const isExplicitlyMissing = sources.some(
      (s) =>
        s.content.toLowerCase().includes('unannounced') ||
        s.content.toLowerCase().includes('no mention') ||
        s.content.toLowerCase().includes('remains unannounced')
    );

    return {
      status: 'not-found',
      secondaryFlags: [],
      findingSummary: isExplicitlyMissing
        ? 'Information gap: Reviewed sources indicate this detail has not yet been announced or released.'
        : 'Not found in reviewed sources: None of the submitted documents discuss this question.',
      decisionReason:
        'No matching keywords, sentences, or relevant clauses found in any provided source.',
      suggestedNextStep: question.suggestedSource
        ? `Request documentation directly from: ${question.suggestedSource}.`
        : 'Search official primary gazette or contact customer support.',
      gapCategory: isExplicitlyMissing ? 'confirmed-missing' : 'not-found',
      evidence: [],
    };
  }

  // 3. Check for Potentially Outdated Information
  const hasNewerSources = sources.some(
    (s) =>
      s.cycleOrYear &&
      (s.cycleOrYear.includes('2026') || s.publicationDate?.startsWith('2025') || s.publicationDate?.startsWith('2026'))
  );
  const supportingSourcesAreOlder = sourceHits.every(
    (h) =>
      (h.source.cycleOrYear && h.source.cycleOrYear.includes('2025')) ||
      (h.source.publicationDate && h.source.publicationDate.startsWith('2024'))
  );

  if (supportingSourcesAreOlder && hasNewerSources) {
    return {
      status: 'outdated',
      secondaryFlags: ['outdated'],
      findingSummary: `Potentially outdated: Supporting excerpt is from an earlier cycle (${sourceHits[0].source.cycleOrYear || 'older release'}).`,
      decisionReason:
        'The only supporting source is from a prior cycle while newer cycle documents exist in your collection.',
      suggestedNextStep:
        'Check whether the latest cycle or announcement revised these terms or amounts.',
      gapCategory: 'none',
      evidence: matchedFindings,
    };
  }

  // 4. Check for Unverified / Ambiguous Hints
  const allHitsAreUserNotes = sourceHits.every((h) => h.source.sourceType === 'user-note');
  const allHitsAreUndated = sourceHits.every((h) => !h.source.publicationDate && (!h.source.cycleOrYear || h.source.cycleOrYear === 'Undated'));

  if (allHitsAreUserNotes || allHitsAreUndated) {
    return {
      status: 'requires-verification',
      secondaryFlags: ['unverified'],
      findingSummary: 'Requires further verification: Supported solely by unverified user notes or undated secondary text.',
      decisionReason:
        'Evidence is based only on user notes, forums, or undated sources with no official confirmation.',
      suggestedNextStep: `Obtain verified verification from ${question.suggestedSource || 'the official department'}.`,
      gapCategory: 'ambiguous',
      evidence: matchedFindings,
    };
  }

  // 5. Partially answered vs Fully Answered
  // If matched sentence count is low and text expresses uncertainty
  const firstSentence = matchedFindings[0].excerpt.toLowerCase();
  const partialKeywords = ['unannounced', 'remains', 'partial', 'heard that', 'might', 'not specified', 'unclear'];
  const isPartial = partialKeywords.some((w) => firstSentence.includes(w));

  if (isPartial) {
    return {
      status: 'partially-answered',
      secondaryFlags: [],
      findingSummary: 'Partially answered: Some context found, but key specifics remain unclear or incomplete.',
      decisionReason: 'Relevant excerpt exists but explicitly indicates incomplete or pending details.',
      suggestedNextStep: 'Cross-check with subsequent addendums or institutional notices.',
      gapCategory: 'ambiguous',
      evidence: matchedFindings,
    };
  }

  // 6. Answered with supporting evidence!
  return {
    status: 'answered',
    secondaryFlags: [],
    findingSummary: matchedFindings[0].excerpt.slice(0, 140) + (matchedFindings[0].excerpt.length > 140 ? '...' : ''),
    decisionReason: `Direct supporting sentence found in ${matchedFindings[0].sourceTitle}.`,
    suggestedNextStep: 'Finding is backed by evidence. Review surrounding source context for nuance.',
    gapCategory: 'none',
    evidence: matchedFindings,
  };
}

/**
 * Runs the full gap detection workflow on an investigation's questions and sources.
 */
export function runFullInvestigationAnalysis(
  questions: Question[],
  sources: Source[]
): {
  analyzedQuestions: Question[];
  truthClashes: TruthClashItem[];
  checklist: ChecklistItem[];
} {
  const analyzedQuestions: Question[] = [];
  const truthClashes: TruthClashItem[] = [];
  const checklist: ChecklistItem[] = [];

  for (const q of questions) {
    if (!q.isSelected) {
      analyzedQuestions.push(q);
      continue;
    }

    const result = analyzeQuestionAgainstSources(q, sources);

    const updatedQ: Question = {
      ...q,
      status: result.status,
      secondaryFlags: result.secondaryFlags,
      findingSummary: result.findingSummary,
      decisionReason: result.decisionReason,
      suggestedNextStep: result.suggestedNextStep,
      gapCategory: result.gapCategory,
      evidence: result.evidence,
    };

    analyzedQuestions.push(updatedQ);

    // If a truth clash was found, register it
    if (result.conflictCandidate) {
      truthClashes.push({
        id: `clash-${q.id}`,
        questionId: q.id,
        questionText: q.text,
        topic: q.topic,
        attributeName: result.conflictCandidate.attribute,
        claimA: {
          sourceId: result.conflictCandidate.sourceA.id,
          sourceTitle: result.conflictCandidate.sourceA.title,
          value: result.conflictCandidate.valA,
          excerpt: result.conflictCandidate.excerptA,
          date: result.conflictCandidate.sourceA.publicationDate,
          cycleOrYear: result.conflictCandidate.sourceA.cycleOrYear,
          sourceType: result.conflictCandidate.sourceA.sourceType,
        },
        claimB: {
          sourceId: result.conflictCandidate.sourceB.id,
          sourceTitle: result.conflictCandidate.sourceB.title,
          value: result.conflictCandidate.valB,
          excerpt: result.conflictCandidate.excerptB,
          date: result.conflictCandidate.sourceB.publicationDate,
          cycleOrYear: result.conflictCandidate.sourceB.cycleOrYear,
          sourceType: result.conflictCandidate.sourceB.sourceType,
        },
        conflictReason: `Source "${result.conflictCandidate.sourceA.title}" claims ${result.conflictCandidate.valA}, whereas "${result.conflictCandidate.sourceB.title}" claims ${result.conflictCandidate.valB}.`,
        verificationAdvice: result.suggestedNextStep,
      });
    }

    // Auto-generate verification checklist item for non-answered items
    if (result.status !== 'answered') {
      let taskCategory = 'Invisible Question';
      if (result.status === 'conflicting') taskCategory = 'Truth Clash';
      else if (result.status === 'outdated') taskCategory = 'Time Traveller';
      else if (result.status === 'requires-verification') taskCategory = 'Requires Verification';

      checklist.push({
        id: `chk-${q.id}`,
        questionId: q.id,
        task: `Verify: ${q.topic} (${q.text})`,
        priority: q.priority,
        completed: false,
        category: taskCategory,
        sourceToConsult: q.suggestedSource || 'Official Primary Gazette',
      });
    }
  }

  // Sort checklist by priority (high -> medium -> low)
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  checklist.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return {
    analyzedQuestions,
    truthClashes,
    checklist,
  };
}
