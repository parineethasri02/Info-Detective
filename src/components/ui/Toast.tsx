import React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'warning';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  const bg =
    type === 'success'
      ? 'bg-[#8DD9F5] text-[#1E4D69] border-[#1E4D69]'
      : type === 'warning'
      ? 'bg-[#FFD84D] text-[#634F0C] border-[#634F0C]'
      : 'bg-[#C8B6F0] text-[#3F2B66] border-[#3F2B66]';

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border-2 shadow-[4px_4px_0px_#26334A] animate-gentle-bob ${bg}`}
    >
      <span className="text-xl">
        {type === 'success' ? '⭐' : type === 'warning' ? '⚠️' : '🔍'}
      </span>
      <span className="font-heading font-semibold text-sm">{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="ml-2 text-sm font-bold hover:opacity-75 focus:outline-none"
      >
        ✕
      </button>
    </div>
  );
};
