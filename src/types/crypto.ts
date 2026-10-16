export type GeneratorMode = 'password' | 'passphrase' | 'pin';

export interface PasswordConfig {
  mode: GeneratorMode;
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean; // e.g. 0, O, o, 1, l, I, |
  excludeAmbiguous: boolean; // e.g. { } [ ] ( ) / \ ' " ` ~ , ; : . < >
  customAllowedChars: string;
  customExcludedChars: string;
  // Passphrase specific
  passphraseWordsCount: number;
  passphraseSeparator: string;
  passphraseCapitalize: boolean;
  passphraseIncludeNumber: boolean;
}

export type StrengthRating = 'sehr_schwach' | 'schwach' | 'mittel' | 'stark' | 'extrem_sicher';

export interface PasswordAnalysis {
  entropy: number; // in bits
  poolSize: number;
  score: number; // 0 to 100
  rating: StrengthRating;
  ratingLabel: string;
  crackTimeOfflineFast: string;
  crackTimeOfflineSlow: string;
  crackTimeOnline: string;
  breakdown: {
    uppercase: number;
    lowercase: number;
    numbers: number;
    symbols: number;
  };
  warnings: string[];
  tips: string[];
}

export interface HashResult {
  algorithm: string;
  fullName: string;
  bitLength: number;
  hash: string;
  description: string;
}

export interface PasswordHistoryItem {
  id: string;
  timestamp: number;
  value: string;
  mode: GeneratorMode;
  length: number;
  entropy: number;
  rating: StrengthRating;
}
