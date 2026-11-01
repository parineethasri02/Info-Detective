import React from 'react';
import { CHARACTERS } from './CharacterConfig';

interface CharacterAvatarProps {
  id: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  className?: string;
  speechBubble?: string;
  bubblePlacement?: 'top' | 'side' | 'bottom';
  animated?: boolean;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  id,
  size = 'md',
  showBadge = false,
  className = '',
  speechBubble,
  bubblePlacement = 'top',
  animated = false,
}) => {
  const profile = CHARACTERS[id] || CHARACTERS.shinchan;

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  const badgeSizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[11px] px-2 py-0.5',
    lg: 'text-xs px-2.5 py-1',
    xl: 'text-sm px-3 py-1',
  };

  const renderSvgAvatar = (charId: string) => {
    switch (charId) {
      case 'kazama':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#8DD9F5" />
            {/* Neat smart blue hair with detective side-parting */}
            <path d="M 22 42 C 22 20 40 16 58 16 C 76 16 82 26 80 44 C 74 34 64 30 52 32 C 38 34 28 38 22 42 Z" fill="#244F75" />
            <path d="M 68 22 C 78 30 80 40 78 50 C 74 46 70 42 66 38 Z" fill="#1C3D5A" />
            {/* Face */}
            <ellipse cx="50" cy="55" rx="30" ry="26" fill="#FCEBD4" />
            {/* Big confident glasses/eyes */}
            <circle cx="40" cy="54" r="6.5" fill="#26334A" />
            <circle cx="42" cy="52" r="2" fill="#FFFFFF" />
            <circle cx="60" cy="54" r="6.5" fill="#26334A" />
            <circle cx="62" cy="52" r="2" fill="#FFFFFF" />
            {/* Serious proud eyebrows */}
            <path d="M 33 46 Q 41 43 46 47" stroke="#244F75" strokeWidth="3" strokeLinecap="round" />
            <path d="M 67 46 Q 59 43 54 47" stroke="#244F75" strokeWidth="3" strokeLinecap="round" />
            {/* Proud smile */}
            <path d="M 44 67 Q 50 71 56 67" stroke="#9A3845" strokeWidth="2.5" strokeLinecap="round" />
            {/* Tiny blazer collar */}
            <path d="M 35 78 L 50 88 L 65 78" fill="#FFFFFF" stroke="#244F75" strokeWidth="2" />
            <path d="M 48 83 L 50 94 L 52 83 Z" fill="#E53E3E" />
          </svg>
        );

      case 'nene':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#FF9DAB" />
            {/* Twin pigtails */}
            <circle cx="18" cy="46" r="12" fill="#8C3A48" />
            <circle cx="82" cy="46" r="12" fill="#8C3A48" />
            <ellipse cx="18" cy="46" rx="3" ry="5" fill="#FFC49D" />
            <ellipse cx="82" cy="46" rx="3" ry="5" fill="#FFC49D" />
            {/* Face */}
            <ellipse cx="50" cy="54" rx="29" ry="26" fill="#FCEBD4" />
            {/* Bangs */}
            <path d="M 28 38 C 36 28 64 28 72 38 C 66 34 58 35 50 36 C 42 35 34 34 28 38 Z" fill="#A84555" />
            {/* Big inquisitive eyes */}
            <ellipse cx="39" cy="53" rx="7" ry="8" fill="#26334A" />
            <ellipse cx="61" cy="53" rx="7" ry="8" fill="#26334A" />
            <circle cx="41" cy="50" r="2.5" fill="#FFFFFF" />
            <circle cx="63" cy="50" r="2.5" fill="#FFFFFF" />
            {/* Rosy cheeks */}
            <circle cx="31" cy="62" r="5" fill="#FFAAA6" opacity="0.6" />
            <circle cx="69" cy="62" r="5" fill="#FFAAA6" opacity="0.6" />
            {/* Smile / determined sleuth look */}
            <path d="M 44 66 Q 50 71 56 66" stroke="#A83244" strokeWidth="2.5" strokeLinecap="round" />
            {/* Detective ribbon / hair tie */}
            <circle cx="24" cy="40" r="4" fill="#FFD84D" />
            <circle cx="76" cy="40" r="4" fill="#FFD84D" />
          </svg>
        );

      case 'masao':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#FFC49D" />
            {/* Round head with onigiri shaved hairline */}
            <ellipse cx="50" cy="54" rx="30" ry="27" fill="#FCEBD4" />
            <path d="M 28 42 C 34 25 66 25 72 42 C 64 34 56 34 50 34 C 44 34 36 34 28 42 Z" fill="#3D3A38" />
            {/* Worried / alert time investigator eyes */}
            <circle cx="39" cy="54" r="5.5" fill="#26334A" />
            <circle cx="61" cy="54" r="5.5" fill="#26334A" />
            <circle cx="41" cy="52" r="2" fill="#FFFFFF" />
            <circle cx="63" cy="52" r="2" fill="#FFFFFF" />
            {/* Worried squiggly eyebrows */}
            <path d="M 33 46 Q 38 43 43 47" stroke="#3D3A38" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 67 46 Q 62 43 57 47" stroke="#3D3A38" strokeWidth="2.5" strokeLinecap="round" />
            {/* Nervous mouth */}
            <path d="M 45 68 Q 50 65 55 68" stroke="#9A3845" strokeWidth="2.5" strokeLinecap="round" />
            {/* Stopwatch badge near collar */}
            <circle cx="72" cy="74" r="9" fill="#FFD84D" stroke="#26334A" strokeWidth="2" />
            <line x1="72" y1="74" x2="72" y2="69" stroke="#26334A" strokeWidth="2" />
            <line x1="72" y1="74" x2="76" y2="74" stroke="#26334A" strokeWidth="2" />
          </svg>
        );

      case 'bochan':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#C8B6F0" />
            {/* Tall round head */}
            <ellipse cx="50" cy="52" rx="27" ry="32" fill="#FCEBD4" />
            {/* Minimalist straight hair */}
            <path d="M 28 35 C 36 20 64 20 72 35 C 64 30 50 30 28 35 Z" fill="#222222" />
            {/* Calm zen dot eyes */}
            <circle cx="40" cy="50" r="4" fill="#26334A" />
            <circle cx="60" cy="50" r="4" fill="#26334A" />
            {/* Signature shiny runny nose droplet */}
            <path d="M 50 56 C 50 56 46 68 46 72 C 46 75 48 77 50 77 C 52 77 54 75 54 72 C 54 68 50 56 50 56 Z" fill="#8DD9F5" stroke="#4AA3CF" strokeWidth="1.5" />
            {/* Calm tiny mouth */}
            <ellipse cx="50" cy="80" rx="3" ry="1.5" fill="#9A3845" />
            {/* Evidence magnifying glass lapel badge */}
            <circle cx="30" cy="76" r="7" fill="none" stroke="#26334A" strokeWidth="2" />
            <line x1="35" y1="81" x2="40" y2="86" stroke="#26334A" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case 'himawari':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#FFE680" />
            {/* Baby head */}
            <ellipse cx="50" cy="54" rx="31" ry="26" fill="#FCEBD4" />
            {/* Signature spiral curl forehead hair */}
            <path d="M 50 34 C 44 26 56 22 55 18 C 54 15 48 16 48 20" stroke="#D96E14" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 32 38 C 38 32 62 32 68 38" stroke="#D96E14" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Big sparkly jewel-loving eyes */}
            <ellipse cx="38" cy="53" rx="7" ry="8" fill="#26334A" />
            <ellipse cx="62" cy="53" rx="7" ry="8" fill="#26334A" />
            <polygon points="38,48 40,51 43,51 41,53 42,56 38,54 34,56 35,53 33,51 36,51" fill="#FFD84D" />
            <polygon points="62,48 64,51 67,51 65,53 66,56 62,54 58,56 59,53 57,51 60,51" fill="#FFD84D" />
            <circle cx="36" cy="50" r="2" fill="#FFFFFF" />
            <circle cx="60" cy="50" r="2" fill="#FFFFFF" />
            {/* Cute open laugh */}
            <path d="M 44 65 Q 50 73 56 65 Z" fill="#E53E3E" />
            {/* Yellow bib */}
            <path d="M 36 78 C 36 78 42 88 50 88 C 58 88 64 78 64 78" fill="#FFD84D" stroke="#D96E14" strokeWidth="2" />
          </svg>
        );

      case 'misae':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#FFAAA6" />
            {/* Wavy curly brown hair */}
            <path d="M 22 50 C 16 35 24 20 40 18 C 60 16 78 20 80 36 C 82 52 78 70 76 74 C 74 62 70 55 64 52" fill="#522C1B" />
            <ellipse cx="48" cy="54" rx="27" ry="25" fill="#FCEBD4" />
            <path d="M 28 38 C 36 30 60 30 68 38" fill="#522C1B" />
            {/* Big expressive mom eyes */}
            <ellipse cx="39" cy="52" rx="5.5" ry="6.5" fill="#26334A" />
            <ellipse cx="59" cy="52" rx="5.5" ry="6.5" fill="#26334A" />
            <circle cx="41" cy="50" r="1.8" fill="#FFFFFF" />
            <circle cx="61" cy="50" r="1.8" fill="#FFFFFF" />
            {/* Friendly advice smile */}
            <path d="M 43 66 Q 49 71 55 66" stroke="#9A3845" strokeWidth="2.5" strokeLinecap="round" />
            {/* Apron strap */}
            <line x1="36" y1="78" x2="42" y2="92" stroke="#FFFFFF" strokeWidth="4" />
            <line x1="62" y1="78" x2="56" y2="92" stroke="#FFFFFF" strokeWidth="4" />
          </svg>
        );

      case 'hiroshi':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#98D7C2" />
            {/* Square jawed dad face with light stubble */}
            <rect x="25" y="36" width="50" height="42" rx="10" fill="#FCEBD4" />
            {/* Wavy black hair */}
            <path d="M 22 42 C 22 24 38 18 52 18 C 66 18 78 22 78 38 C 72 32 60 32 50 33 C 40 34 30 36 22 42 Z" fill="#222222" />
            {/* Gentle tired hardworking eyes */}
            <circle cx="39" cy="51" r="4.5" fill="#26334A" />
            <circle cx="61" cy="51" r="4.5" fill="#26334A" />
            {/* Glasses */}
            <rect x="31" y="44" width="16" height="14" rx="4" fill="none" stroke="#26334A" strokeWidth="2" />
            <rect x="53" y="44" width="16" height="14" rx="4" fill="none" stroke="#26334A" strokeWidth="2" />
            <line x1="47" y1="51" x2="53" y2="51" stroke="#26334A" strokeWidth="2" />
            {/* Friendly dad smile */}
            <path d="M 43 67 Q 50 72 57 67" stroke="#26334A" strokeWidth="2.5" strokeLinecap="round" />
            {/* Tie and white shirt */}
            <path d="M 40 78 L 50 88 L 60 78" fill="#FFFFFF" />
            <polygon points="48,84 52,84 54,96 46,96" fill="#3B82F6" />
          </svg>
        );

      case 'shinchan':
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#FFD84D" />
            {/* Detective houndstooth brown cap */}
            <path d="M 24 38 C 24 20 40 14 56 16 C 72 18 80 28 80 40 C 70 34 50 32 24 38 Z" fill="#A0522D" />
            <ellipse cx="52" cy="38" rx="28" ry="7" fill="#8B4513" />
            {/* Chubby cheek silhouette */}
            <path d="M 28 42 C 22 50 24 64 34 68 C 42 72 58 72 68 66 C 76 60 76 48 70 42" fill="#FCEBD4" />
            {/* Big iconic thick expressive eyebrows */}
            <path d="M 32 43 C 35 38 44 38 48 42 C 43 40 37 40 32 43 Z" fill="#222222" />
            <path d="M 56 42 C 60 38 69 38 72 43 C 67 40 61 40 56 42 Z" fill="#222222" />
            {/* Mischievous curious detective eyes */}
            <ellipse cx="40" cy="50" rx="5.5" ry="7" fill="#26334A" />
            <ellipse cx="64" cy="50" rx="5.5" ry="7" fill="#26334A" />
            <circle cx="42" cy="48" r="2.2" fill="#FFFFFF" />
            <circle cx="66" cy="48" r="2.2" fill="#FFFFFF" />
            {/* Cheerful grin */}
            <path d="M 44 60 Q 52 66 60 60" stroke="#E53E3E" strokeWidth="3" strokeLinecap="round" />
            {/* Red shirt collar */}
            <path d="M 36 72 C 36 72 46 80 52 80 C 58 80 68 72 68 72 L 72 88 L 32 88 Z" fill="#E53E3E" />
            {/* Detective golden star badge */}
            <polygon points="52,78 54,82 58,82 55,85 56,89 52,87 48,89 49,85 46,82 50,82" fill="#FFD84D" stroke="#B45309" strokeWidth="0.8" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative select-none ${
        bubblePlacement === 'side'
          ? 'inline-flex flex-row items-center gap-3'
          : 'inline-flex flex-col items-center'
      } ${className}`}
    >
      {/* Speech Bubble (Top placement) */}
      {speechBubble && bubblePlacement === 'top' && (
        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-20 w-max max-w-[260px] sm:max-w-[320px] bg-white border-2 border-[#26334A] rounded-2xl px-3 py-2 text-xs sm:text-sm font-medium text-[#26334A] shadow-[3px_3px_0px_#26334A] leading-snug text-center animate-soft-pulse">
          <span>{speechBubble}</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#26334A]" />
          <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-white" />
        </div>
      )}

      {/* Avatar Container with Badge */}
      <div className="inline-flex flex-col items-center">
        <div
          className={`relative ${sizeClasses[size]} rounded-full border-2 sm:border-3 border-[#26334A] shadow-[2px_2px_0px_#26334A] overflow-hidden bg-white flex items-center justify-center ${
            animated ? 'animate-gentle-bob' : ''
          }`}
        >
          {profile.licensedImagePath ? (
            <img
              src={profile.licensedImagePath}
              alt={`${profile.name} - ${profile.role}`}
              className="w-full h-full object-cover"
            />
          ) : (
            renderSvgAvatar(profile.id)
          )}
        </div>

        {/* Role / Name Badge */}
        {showBadge && (
          <div
            className={`mt-1 font-heading font-semibold rounded-full border border-[#26334A] shadow-[1px_1px_0px_#26334A] ${profile.badgeColor} ${profile.textColor} ${badgeSizeClasses[size]} text-center whitespace-nowrap`}
          >
            {profile.name}
          </div>
        )}
      </div>

      {/* Speech Bubble (Side placement) */}
      {speechBubble && bubblePlacement === 'side' && (
        <div className="hidden sm:block relative z-20 max-w-[280px] md:max-w-[340px] bg-white border-2 border-[#26334A] rounded-2xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#26334A] shadow-[3px_3px_0px_#26334A] leading-snug text-left animate-soft-pulse">
          <span>{speechBubble}</span>
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-[#26334A]" />
          <div className="absolute top-1/2 -left-[6px] -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[6px] border-r-white" />
        </div>
      )}
    </div>
  );
};
