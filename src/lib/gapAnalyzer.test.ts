import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractSentences,
  verifySubstringExcerpt,
  extractAttributes,
  analyzeQuestionAgainstSources,
  runFullInvestigationAnalysis,
} from './gapAnalyzer';
import { calculateScoringBreakdown } from './scoring';
import { Question, Source } from '../types';

test('extractSentences breaks text into clean sentence bounds', () => {
  const text = 'First sentence is here. Second sentence has more words! Third sentence is final.';
  const sentences = extractSentences(text);
  assert.equal(sentences.length, 3);
  assert.equal(sentences[0].sentence, 'First sentence is here.');
  assert.equal(sentences[1].sentence, 'Second sentence has more words!');
});

test('verifySubstringExcerpt guarantees exact substring matching', () => {
  const fullText = 'The final application submission deadline is 15 December at 11:59 PM EST.';
  const validExcerpt = 'The final application submission deadline is 15 December at 11:59 PM EST.';
  const fakeExcerpt = 'The deadline is December 15th.';

  const validRes = verifySubstringExcerpt(fullText, validExcerpt);
  assert.equal(validRes.valid, true);
  assert.equal(validRes.start, 0);

  const invalidRes = verifySubstringExcerpt(fullText, fakeExcerpt);
  assert.equal(invalidRes.valid, false);
});

test('extractAttributes finds dates and amounts with regex', () => {
  const text = 'The application deadline is 15 December and requires a $2,000 fee or minimum GPA of 3.8.';
  const attrs = extractAttributes(text);
  assert.ok(attrs.dates.some((d) => d.includes('15 December')));
  assert.ok(attrs.amounts.some((a) => a.includes('$2,000')));
});

test('analyzeQuestionAgainstSources flags conflicts when dates contradict', () => {
  const q: Question = {
    id: 'test-deadline',
    text: 'What is the application deadline?',
    defaultPriority: 'high',
    priority: 'high',
    topic: 'Application Deadline',
    whyItMatters: 'Late applications are rejected.',
    keywords: ['deadline', 'due date', 'december'],
    suggestedSource: 'Official Portal',
    isSelected: true,
  };

  const srcA: Source = {
    id: 'src-1',
    title: 'Circular A',
    domain: 'gov.org',
    url: 'https://gov.org/notice',
    publicationDate: '2025-01-01',
    retrievedDate: '2026-01-01',
    sourceType: 'official',
    cycleOrYear: '2025 Cycle',
    content: 'The official submission deadline is 15 December for all candidates.',
  };

  const srcB: Source = {
    id: 'src-2',
    title: 'Blog B',
    domain: 'blog.com',
    url: 'https://blog.com/notice',
    publicationDate: '2025-02-01',
    retrievedDate: '2026-01-01',
    sourceType: 'third-party',
    cycleOrYear: '2026 Cycle',
    content: 'Notice update: the submission deadline is 20 December according to new guidelines.',
  };

  const analysis = analyzeQuestionAgainstSources(q, [srcA, srcB]);
  assert.equal(analysis.status, 'conflicting');
  assert.ok(analysis.conflictCandidate);
  assert.equal(analysis.conflictCandidate?.valA, '15 December');
  assert.equal(analysis.conflictCandidate?.valB, '20 December');
});

test('calculateScoringBreakdown computes deterministic weighted coverage', () => {
  const questions: Question[] = [
    {
      id: 'q1',
      text: 'Question 1',
      defaultPriority: 'high',
      priority: 'high', // 3 points
      topic: 'Topic 1',
      whyItMatters: 'M1',
      keywords: ['test'],
      suggestedSource: 'Src',
      isSelected: true,
      status: 'answered', // 3.0 earned
    },
    {
      id: 'q2',
      text: 'Question 2',
      defaultPriority: 'medium',
      priority: 'medium', // 2 points
      topic: 'Topic 2',
      whyItMatters: 'M2',
      keywords: ['test'],
      suggestedSource: 'Src',
      isSelected: true,
      status: 'partially-answered', // 1.0 earned (50%)
    },
    {
      id: 'q3',
      text: 'Question 3',
      defaultPriority: 'low',
      priority: 'low', // 1 point
      topic: 'Topic 3',
      whyItMatters: 'M3',
      keywords: ['test'],
      suggestedSource: 'Src',
      isSelected: true,
      status: 'not-found', // 0 earned
    },
  ];

  const score = calculateScoringBreakdown(questions);
  // Max weight = 3 + 2 + 1 = 6.
  // Earned = 3.0 + 1.0 + 0 = 4.0.
  // Percentage = Math.round((4 / 6) * 100) = 67%.
  assert.equal(score.maxPossibleWeight, 6);
  assert.equal(score.totalEarnedWeight, 4);
  assert.equal(score.scorePercentage, 67);
  assert.equal(score.answeredCount, 1);
  assert.equal(score.partialCount, 1);
  assert.equal(score.notFoundCount, 1);
});
