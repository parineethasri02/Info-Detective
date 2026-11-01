export interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  title: string;
  tagline: string;
  badgeColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  // Slot configuration: set a path here if the project owner provides licensed assets (e.g. "/assets/characters/shinchan.png")
  licensedImagePath: string | null;
}

export const CHARACTERS: Record<string, CharacterProfile> = {
  shinchan: {
    id: 'shinchan',
    name: 'Shinchan',
    role: 'Chief Detective',
    title: 'Lead Detective Shinchan',
    tagline: 'Leading the investigation with keen curiosity and boundless energy!',
    badgeColor: 'bg-[#FFD84D]',
    textColor: 'text-[#26334A]',
    bgColor: 'bg-[#FFF8E9]',
    borderColor: 'border-[#FFD84D]',
    licensedImagePath: null, // Swap to "/assets/characters/shinchan.png" to use custom artwork
  },
  kazama: {
    id: 'kazama',
    name: 'Kazama',
    role: 'Logic Investigator',
    title: 'Truth Clash Specialist Kazama',
    tagline: 'Pinpointing contradictory claims, conflicting dates, and logic flaws.',
    badgeColor: 'bg-[#8DD9F5]',
    textColor: 'text-[#1E4D69]',
    bgColor: 'bg-[#F0F9FF]',
    borderColor: 'border-[#8DD9F5]',
    licensedImagePath: null,
  },
  nene: {
    id: 'nene',
    name: 'Nene',
    role: 'Mystery Investigator',
    title: 'Invisible Questions Sleuth Nene',
    tagline: 'Unearthing hidden gaps, missing clauses, and what sources kept secret.',
    badgeColor: 'bg-[#FF9DAB]',
    textColor: 'text-[#872535]',
    bgColor: 'bg-[#FFF0F2]',
    borderColor: 'border-[#FF9DAB]',
    licensedImagePath: null,
  },
  masao: {
    id: 'masao',
    name: 'Masao',
    role: 'Time Investigator',
    title: 'Time Traveller Masao',
    tagline: 'Tracking timeline dates, freshness warnings, and outdated notices.',
    badgeColor: 'bg-[#FFC49D]',
    textColor: 'text-[#7A3E1B]',
    bgColor: 'bg-[#FFF6EF]',
    borderColor: 'border-[#FFC49D]',
    licensedImagePath: null,
  },
  bochan: {
    id: 'bochan',
    name: 'Bo-chan',
    role: 'Evidence Investigator',
    title: 'Evidence & Excerpt Master Bo-chan',
    tagline: 'Tracing every single claim back to an exact, verified substring excerpt.',
    badgeColor: 'bg-[#C8B6F0]',
    textColor: 'text-[#442E70]',
    bgColor: 'bg-[#F7F4FD]',
    borderColor: 'border-[#C8B6F0]',
    licensedImagePath: null,
  },
  himawari: {
    id: 'himawari',
    name: 'Himawari',
    role: 'Clue Finder',
    title: 'Clue Finder Himawari',
    tagline: 'Spotting shiny achievements, checklists, and key takeaways!',
    badgeColor: 'bg-[#FFE680]',
    textColor: 'text-[#634F0C]',
    bgColor: 'bg-[#FFFDEE]',
    borderColor: 'border-[#FFE680]',
    licensedImagePath: null,
  },
  misae: {
    id: 'misae',
    name: 'Misae',
    role: 'Chief Advisor',
    title: 'Advisor Misae',
    tagline: 'Keeping your research organized, practical, and grounded!',
    badgeColor: 'bg-[#FFAAA6]',
    textColor: 'text-[#5F1F1B]',
    bgColor: 'bg-[#FFF2F1]',
    borderColor: 'border-[#FFAAA6]',
    licensedImagePath: null,
  },
  hiroshi: {
    id: 'hiroshi',
    name: 'Hiroshi',
    role: 'Senior Consultant',
    title: 'Consultant Hiroshi',
    tagline: 'Making sure your final decision won’t hurt your wallet or future plans.',
    badgeColor: 'bg-[#98D7C2]',
    textColor: 'text-[#1D5443]',
    bgColor: 'bg-[#F0FAF7]',
    borderColor: 'border-[#98D7C2]',
    licensedImagePath: null,
  },
};
