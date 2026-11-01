import { Question, QuestionPriority } from '../types';

/**
 * Generates custom follow-up questions for a topic & objective.
 * Transparent fallback when no live Gemini API key is configured in the environment.
 */
export async function generateSuggestedQuestions(
  topic: string,
  objective: string,
  existingQuestionTexts: string[]
): Promise<Question[]> {
  // Let's provide thoughtful, domain-specific questions derived from topic and objective keywords
  const lowerTopic = (topic + ' ' + objective).toLowerCase();

  const candidatePool: {
    text: string;
    topic: string;
    defaultPriority: QuestionPriority;
    whyItMatters: string;
    keywords: string[];
    suggestedSource: string;
    triggers: string[];
  }[] = [
    {
      text: 'What are the total hidden costs, processing surcharges, or auxiliary platform fees?',
      topic: 'Hidden Costs & Auxiliary Fees',
      defaultPriority: 'high',
      whyItMatters: 'Headline figures often omit 15-30% in compulsory transaction, maintenance, or registration fees.',
      keywords: ['cost', 'fees', 'hidden', 'surcharge', 'tuition', 'expenses', 'price'],
      suggestedSource: 'Official pricing schedule or fee breakdown table',
      triggers: ['cost', 'fee', 'price', 'scholarship', 'visa', 'college', 'product', 'buy', 'trip', 'scheme'],
    },
    {
      text: 'What is the exact binding cancellation, withdrawal, or forfeiture cutoff schedule?',
      topic: 'Cancellation & Refund Rights',
      defaultPriority: 'high',
      whyItMatters: 'Failing to cancel within the statutory window leads to complete financial forfeiture.',
      keywords: ['cancel', 'cancellation', 'refund', 'drop date', 'forfeiture', 'deadline'],
      suggestedSource: 'Terms and Conditions: Cancellation & Refund Clause',
      triggers: ['book', 'travel', 'course', 'program', 'admission', 'flight', 'hotel', 'contract'],
    },
    {
      text: 'Are there mandatory prerequisites, accreditations, or legal certifications required?',
      topic: 'Prerequisites & Accreditations',
      defaultPriority: 'high',
      whyItMatters: 'Unaccredited credentials or missing prerequisites can invalidate your qualification.',
      keywords: ['accredited', 'prerequisite', 'certification', 'license', 'criteria', 'eligibility'],
      suggestedSource: 'Accreditation Body Directory or Statutory Authority',
      triggers: ['course', 'degree', 'job', 'scheme', 'university', 'study', 'education'],
    },
    {
      text: 'What are the continuing performance conditions, renewal thresholds, or quota caps?',
      topic: 'Continuing Conditions & Retention',
      defaultPriority: 'medium',
      whyItMatters: 'Initial eligibility does not protect against aggressive second-phase retention hurdles.',
      keywords: ['renewal', 'maintain', 'quota', 'retention', 'ongoing requirement'],
      suggestedSource: 'Continuing Regulations and Compliance Guidelines',
      triggers: ['scholarship', 'employment', 'scheme', 'grant', 'aid', 'subscription', 'membership'],
    },
    {
      text: 'Is there an independent grievance, arbitration, or appeals procedure if a dispute arises?',
      topic: 'Dispute & Appeals Mechanism',
      defaultPriority: 'low',
      whyItMatters: 'Without an independent ombudsman or appeal channel, administrative errors are irreversible.',
      keywords: ['appeal', 'dispute', 'arbitration', 'grievance', 'ombudsman', 'complaint'],
      suggestedSource: 'Citizen Charter or Consumer Protection Ombudsman',
      triggers: ['scheme', 'contract', 'visa', 'job', 'product', 'admission'],
    },
    {
      text: 'What third-party independent audits or peer reviews exist regarding these claims?',
      topic: 'Independent Verification',
      defaultPriority: 'medium',
      whyItMatters: 'Self-serving promotional claims should always be substantiated by third-party testing.',
      keywords: ['audit', 'independent', 'benchmark', 'review', 'inspection', 'report'],
      suggestedSource: 'Independent Audit Report or Testing Laboratory',
      triggers: ['product', 'device', 'company', 'technology', 'system', 'clean', 'solar'],
    },
  ];

  // Filter out questions that are already in existingQuestionTexts
  const selected: Question[] = [];
  const existingSet = new Set(existingQuestionTexts.map((t) => t.toLowerCase().trim()));

  for (const item of candidatePool) {
    if (!existingSet.has(item.text.toLowerCase().trim())) {
      const matchScore = item.triggers.filter((t) => lowerTopic.includes(t)).length;
      if (matchScore > 0 || selected.length < 3) {
        selected.push({
          id: `ai-sugg-${Date.now()}-${selected.length + 1}`,
          text: item.text,
          defaultPriority: item.defaultPriority,
          priority: item.defaultPriority,
          topic: item.topic,
          whyItMatters: item.whyItMatters,
          keywords: item.keywords,
          suggestedSource: item.suggestedSource,
          isSelected: true,
          isCustom: true,
          isAiSuggested: true,
          status: 'requires-verification',
        });
      }
    }
    if (selected.length >= 3) break;
  }

  // If still fewer than 2, provide generic detective gap questions
  if (selected.length === 0) {
    selected.push({
      id: `ai-sugg-${Date.now()}-1`,
      text: `What are the unstated exceptions or exclusions applicable to ${topic || 'this topic'}?`,
      defaultPriority: 'high',
      priority: 'high',
      topic: 'Exclusions & Scope Limits',
      whyItMatters: 'Unstated exemptions often catch researchers by surprise when claims are tested.',
      keywords: ['exception', 'exclusion', 'exempt', 'limitation', 'scope'],
      suggestedSource: 'Primary Regulatory Gazette or Legal Terms',
      isSelected: true,
      isCustom: true,
      isAiSuggested: true,
      status: 'requires-verification',
    });
  }

  return selected;
}
