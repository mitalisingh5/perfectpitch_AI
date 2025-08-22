
export interface LongTextFormat {
  summaryPoints: string[];
  fullText: string;
}

export interface PitchData {
  elevatorPitch: LongTextFormat;
  tagline: string;
  valueProposition: LongTextFormat;
  slideBullets: string[];
  competitors: { name: string; description: string }[];
  revenueModels: { name: string; description: string }[];
}

export interface RatingData {
  successScore: number;
  keyStrengths: string[];
  potentialWeaknesses: string[];
  actionableAdvice: string[];
}

export interface Message {
  text: string;
  sender: 'user' | 'bot';
}