import React from 'react';
import { QuestionStatus, QuestionPriority } from '../../types';

interface StatusBadgeProps {
  status: QuestionStatus;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  switch (status) {
    case 'answered':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-heading font-semibold bg-[#D1F2D9] text-[#1E5631] border border-[#276749] shadow-[1px_1px_0px_#276749] ${sizeClasses} ${className}`}
        >
          <span>✅</span>
          <span>Answered with Evidence</span>
        </span>
      );

    case 'partially-answered':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-heading font-semibold bg-[#FEF08A] text-[#854D0E] border border-[#854D0E] shadow-[1px_1px_0px_#854D0E] ${sizeClasses} ${className}`}
        >
          <span>🟡</span>
          <span>Partially Answered</span>
        </span>
      );

    case 'conflicting':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-heading font-semibold bg-[#FEE2E2] text-[#991B1B] border border-[#991B1B] shadow-[1px_1px_0px_#991B1B] ${sizeClasses} ${className}`}
        >
          <span>🔴</span>
          <span>Truth Clash (Conflict)</span>
        </span>
      );

    case 'outdated':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-heading font-semibold bg-[#FFEDD5] text-[#9A3412] border border-[#9A3412] shadow-[1px_1px_0px_#9A3412] ${sizeClasses} ${className}`}
        >
          <span>🕰️</span>
          <span>Potentially Outdated</span>
        </span>
      );

    case 'requires-verification':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-heading font-semibold bg-[#E0F2FE] text-[#075985] border border-[#075985] shadow-[1px_1px_0px_#075985] ${sizeClasses} ${className}`}
        >
          <span>🔍</span>
          <span>Requires Verification</span>
        </span>
      );

    case 'not-found':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-heading font-semibold bg-[#F3E8FF] text-[#581C87] border border-[#581C87] shadow-[1px_1px_0px_#581C87] ${sizeClasses} ${className}`}
        >
          <span>⚪</span>
          <span>Not Found in Sources</span>
        </span>
      );
  }
};

export const PriorityBadge: React.FC<{ priority: QuestionPriority; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  if (priority === 'high') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-md font-bold uppercase tracking-wider bg-[#FF9DAB] text-[#7A1D2D] border border-[#7A1D2D] ${sizeClasses}`}
      >
        <span>⚡ High Priority</span>
      </span>
    );
  }
  if (priority === 'medium') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-md font-bold uppercase tracking-wider bg-[#FFD84D] text-[#634F0C] border border-[#634F0C] ${sizeClasses}`}
      >
        <span>⭐ Med Priority</span>
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-bold uppercase tracking-wider bg-[#E2E8F0] text-[#334155] border border-[#334155] ${sizeClasses}`}
    >
      <span>Low Priority</span>
    </span>
  );
};
