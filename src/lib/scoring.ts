import { Question, ScoringBreakdown } from '../types';

/**
 * Calculates deterministic coverage metrics based on question priority weights.
 *
 * Scoring Formula:
 * - High Priority = 3 points
 * - Medium Priority = 2 points
 * - Low Priority = 1 point
 *
 * Status Weights:
 * - Answered = 100% of weight (1.0)
 * - Partially Answered = 50% of weight (0.5)
 * - Conflicting / Outdated / Requires Verification / Not Found = 0% of verified coverage
 *
 * Score Percentage = Math.round((totalEarnedWeight / maxPossibleWeight) * 100)
 */
export function calculateScoringBreakdown(questions: Question[]): ScoringBreakdown {
  const selectedQuestions = questions.filter((q) => q.isSelected !== false);

  if (selectedQuestions.length === 0) {
    return {
      totalQuestions: 0,
      highPriorityCount: 0,
      answeredCount: 0,
      partialCount: 0,
      notFoundCount: 0,
      conflictCount: 0,
      outdatedCount: 0,
      requiresVerificationCount: 0,
      scorePercentage: 0,
      totalEarnedWeight: 0,
      maxPossibleWeight: 0,
      formulaDescription: 'No questions selected.',
      legend: {
        sourcedFacts: 0,
        automatedComparisons: 0,
        aiSuggestions: 0,
        unresolvedUncertainties: 0,
      },
    };
  }

  const weights = {
    high: 3,
    medium: 2,
    low: 1,
  };

  let maxPossibleWeight = 0;
  let totalEarnedWeight = 0;

  let highPriorityCount = 0;
  let answeredCount = 0;
  let partialCount = 0;
  let notFoundCount = 0;
  let conflictCount = 0;
  let outdatedCount = 0;
  let requiresVerificationCount = 0;
  let aiSuggestions = 0;

  for (const q of selectedQuestions) {
    const w = weights[q.priority] || 2;
    maxPossibleWeight += w;

    if (q.priority === 'high') highPriorityCount++;
    if (q.isAiSuggested) aiSuggestions++;

    switch (q.status) {
      case 'answered':
        answeredCount++;
        totalEarnedWeight += w * 1.0;
        break;
      case 'partially-answered':
        partialCount++;
        totalEarnedWeight += w * 0.5;
        break;
      case 'conflicting':
        conflictCount++;
        // 0 points towards verified coverage
        break;
      case 'outdated':
        outdatedCount++;
        // 0 points towards verified coverage
        break;
      case 'requires-verification':
        requiresVerificationCount++;
        // 0 points towards verified coverage
        break;
      case 'not-found':
      default:
        notFoundCount++;
        // 0 points towards verified coverage
        break;
    }
  }

  const scorePercentage =
    maxPossibleWeight > 0 ? Math.round((totalEarnedWeight / maxPossibleWeight) * 100) : 0;

  const sourcedFacts = answeredCount;
  const automatedComparisons = conflictCount;
  const unresolvedUncertainties = partialCount + notFoundCount + outdatedCount + requiresVerificationCount;

  return {
    totalQuestions: selectedQuestions.length,
    highPriorityCount,
    answeredCount,
    partialCount,
    notFoundCount,
    conflictCount,
    outdatedCount,
    requiresVerificationCount,
    scorePercentage,
    totalEarnedWeight,
    maxPossibleWeight,
    formulaDescription:
      'Weighted Coverage = (∑ Earned Weights / ∑ Max Weights) × 100. Weights: High (3pts), Medium (2pts), Low (1pt). Answered grants 100%, Partially Answered grants 50%, all gaps/conflicts grant 0%.',
    legend: {
      sourcedFacts,
      automatedComparisons,
      aiSuggestions,
      unresolvedUncertainties,
    },
  };
}
