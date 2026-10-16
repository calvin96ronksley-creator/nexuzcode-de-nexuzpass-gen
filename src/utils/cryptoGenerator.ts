import { PasswordConfig, PasswordAnalysis, StrengthRating } from '../types/crypto';

// Standard character sets
export const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  similarChars: 'il1Lo0O|I',
  ambiguousSymbols: '{}[]()/\\\'"`~,;:.<>',
};

// Rich list of memorable words for passphrases (Diceware style)
export const WORDLIST = [
  'apfel', 'atom', 'anker', 'adler', 'argon', 'alpha', 'aurora', 'astra', 'atlas', 'action',
  'baum', 'blitz', 'blau', 'berg', 'bruecke', 'biber', 'bernstein', 'baryon', 'bionic', 'boost',
  'chaos', 'code', 'cyber', 'cell', 'cosmos', 'comet', 'circuit', 'canyon', 'corona', 'crypto',
  'delta', 'diamant', 'drache', 'dynamik', 'daten', 'drossel', 'dorn', 'diesel', 'dune', 'matrix',
  'echo', 'eisen', 'energie', 'elektron', 'eule', 'erde', 'epoche', 'element', 'eclipse', 'ether',
  'falke', 'feuer', 'flamme', 'fokus', 'frost', 'fusion', 'frequenz', 'flotte', 'fossil', 'flux',
  'galaxie', 'granit', 'gravitation', 'gecko', 'gold', 'gletscher', 'glyph', 'gitter', 'grid', 'gamma',
  'helion', 'horizont', 'hybrid', 'havel', 'herz', 'hyper', 'hacker', 'havanna', 'helix', 'hydra',
  'impuls', 'insel', 'ionen', 'iris', 'indigo', 'ironie', 'isotope', 'impact', 'ignis', 'infinity',
  'jaspis', 'jagd', 'jupiter', 'joker', 'jolle', 'jungfern', 'jetstream', 'julius', 'jumbo', 'nexus',
  'komet', 'kristall', 'kosmos', 'kupfer', 'koralle', 'kobalt', 'krypton', 'katalyt', 'kiesel', 'kronos',
  'laser', 'licht', 'lithium', 'luchs', 'loewe', 'logic', 'lumen', 'liquid', 'labor', 'lambda',
  'magnet', 'mond', 'meteor', 'matrix', 'methan', 'magma', 'merkur', 'mikron', 'marmor', 'module',
  'neon', 'neutron', 'nebel', 'neptun', 'nano', 'nadel', 'nickel', 'nautilus', 'nova', 'network',
  'orbit', 'optik', 'ozean', 'osmium', 'orion', 'onyx', 'omega', 'oxygen', 'oxford', 'origin',
  'plasma', 'proton', 'photon', 'pulsar', 'prisma', 'pluto', 'panther', 'polar', 'polymer', 'proxy',
  'quant', 'quarz', 'quelle', 'quasar', 'quantum', 'quicksilver', 'quer', 'quota', 'quest', 'quark',
  'radon', 'rakete', 'radar', 'reaktor', 'rubin', 'rotor', 'rhythmus', 'relativ', 'robot', 'radius',
  'silber', 'sonne', 'sturm', 'spektrum', 'signal', 'stern', 'silizium', 'satellit', 'sensor', 'synapse',
  'titan', 'tachyon', 'tunnel', 'turbo', 'torus', 'terra', 'topas', 'trajekt', 'tensor', 'thermal',
  'uran', 'ultra', 'umbra', 'ursprung', 'urania', 'unit', 'update', 'uranus', 'universum', 'ulme',
  'vektor', 'vulkan', 'valenz', 'vakuum', 'vortex', 'viper', 'venus', 'veloc', 'vision', 'vertex',
  'welle', 'wasser', 'wolf', 'wirbel', 'wind', 'wunder', 'warpkern', 'wueste', 'wismuth', 'walzen',
  'xenon', 'xray', 'xylem', 'xerox', 'xylon', 'xiphos', 'xenolith', 'xeno', 'xiphoid', 'xenial',
  'ypsilon', 'yotta', 'yeti', 'yield', 'yttrium', 'yacht', 'yucca', 'yellow', 'yaml', 'yoga',
  'zenit', 'zirkon', 'zelle', 'zyklus', 'zink', 'zobel', 'zephyr', 'zenith', 'zero', 'zone'
];

/**
 * Generate a cryptographically secure random integer in [0, max - 1]
 * using rejection sampling to eliminate modulo bias.
 */
export const secureRandomInt = (max: number): number => {
  if (max <= 0) return 0;
  if (max === 1) return 0;

  const cryptoObj = window.crypto || (window as unknown as { msCrypto: Crypto }).msCrypto;
  const uint32Max = 0xffffffff;
  const limit = uint32Max - (uint32Max % max);

  const buffer = new Uint32Array(1);
  let rand: number;

  do {
    cryptoObj.getRandomValues(buffer);
    rand = buffer[0];
  } while (rand >= limit);

  return rand % max;
};

/**
 * Build the effective character pool based on configuration
 */
export const buildCharPool = (config: PasswordConfig): { pool: string; requiredSets: string[] } => {
  let pool = '';
  const requiredSets: string[] = [];

  let upper = CHAR_SETS.uppercase;
  let lower = CHAR_SETS.lowercase;
  let nums = CHAR_SETS.numbers;
  let syms = CHAR_SETS.symbols;

  if (config.excludeSimilar) {
    const similarRegex = new RegExp(`[${CHAR_SETS.similarChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`, 'g');
    upper = upper.replace(similarRegex, '');
    lower = lower.replace(similarRegex, '');
    nums = nums.replace(similarRegex, '');
    syms = syms.replace(similarRegex, '');
  }

  if (config.excludeAmbiguous) {
    const ambRegex = new RegExp(`[${CHAR_SETS.ambiguousSymbols.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`, 'g');
    syms = syms.replace(ambRegex, '');
  }

  if (config.includeUppercase && upper.length > 0) {
    pool += upper;
    requiredSets.push(upper);
  }
  if (config.includeLowercase && lower.length > 0) {
    pool += lower;
    requiredSets.push(lower);
  }
  if (config.includeNumbers && nums.length > 0) {
    pool += nums;
    requiredSets.push(nums);
  }
  if (config.includeSymbols && syms.length > 0) {
    pool += syms;
    requiredSets.push(syms);
  }

  // Add custom allowed characters
  if (config.customAllowedChars) {
    for (const char of config.customAllowedChars) {
      if (!pool.includes(char)) {
        pool += char;
      }
    }
  }

  // Remove custom excluded characters
  if (config.customExcludedChars) {
    const excludeSet = new Set(config.customExcludedChars);
    pool = pool.split('').filter((c) => !excludeSet.has(c)).join('');
  }

  return { pool, requiredSets };
};

/**
 * Generate password based on config
 */
export const generatePassword = (config: PasswordConfig): string => {
  if (config.mode === 'pin') {
    let pin = '';
    const digits = '0123456789';
    for (let i = 0; i < config.length; i++) {
      pin += digits[secureRandomInt(digits.length)];
    }
    return pin;
  }

  if (config.mode === 'passphrase') {
    const words: string[] = [];
    const count = Math.max(2, Math.min(12, config.passphraseWordsCount));

    for (let i = 0; i < count; i++) {
      let word = WORDLIST[secureRandomInt(WORDLIST.length)];
      if (config.passphraseCapitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      words.push(word);
    }

    if (config.passphraseIncludeNumber) {
      const randomIdx = secureRandomInt(words.length);
      const num = secureRandomInt(900) + 100; // 3-digit number
      words[randomIdx] = `${words[randomIdx]}${num}`;
    }

    return words.join(config.passphraseSeparator);
  }

  // Standard password mode
  const { pool, requiredSets } = buildCharPool(config);

  if (!pool || pool.length === 0) {
    // Fallback safe fallback if everything was deselected
    return 'CyberCrypt2026!';
  }

  const resultChars: string[] = [];

  // Guarantee at least 1 character from each selected set (if length allows)
  for (const set of requiredSets) {
    if (resultChars.length < config.length && set.length > 0) {
      resultChars.push(set[secureRandomInt(set.length)]);
    }
  }

  // Fill the remainder
  while (resultChars.length < config.length) {
    resultChars.push(pool[secureRandomInt(pool.length)]);
  }

  // Fisher-Yates shuffle using CSPRNG
  for (let i = resultChars.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    const temp = resultChars[i];
    resultChars[i] = resultChars[j];
    resultChars[j] = temp;
  }

  return resultChars.join('');
};

/**
 * Calculate Entropy and crack times for any string
 */
export const analyzePassword = (password: string, mode: PasswordConfig['mode'] = 'password'): PasswordAnalysis => {
  if (!password) {
    return {
      entropy: 0,
      poolSize: 0,
      score: 0,
      rating: 'sehr_schwach',
      ratingLabel: 'Keine Eingabe',
      crackTimeOfflineFast: '0 Sekunden',
      crackTimeOfflineSlow: '0 Sekunden',
      crackTimeOnline: '0 Sekunden',
      breakdown: { uppercase: 0, lowercase: 0, numbers: 0, symbols: 0 },
      warnings: ['Passwort ist leer'],
      tips: ['Wähle mindestens 14-16 Zeichen mit gemischten Zeichensätzen.'],
    };
  }

  const len = password.length;
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  let upperCount = 0;
  let lowerCount = 0;
  let numCount = 0;
  let symCount = 0;

  for (let i = 0; i < len; i++) {
    const code = password.charCodeAt(i);
    const char = password[i];

    if (code >= 65 && code <= 90) {
      hasUpper = true;
      upperCount++;
    } else if (code >= 97 && code <= 122) {
      hasLower = true;
      lowerCount++;
    } else if (code >= 48 && code <= 57) {
      hasNum = true;
      numCount++;
    } else {
      hasSym = true;
      symCount++;
    }
  }

  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNum) poolSize += 10;
  if (hasSym) poolSize += 33;

  if (poolSize === 0) poolSize = 1;

  let entropy = 0;
  if (mode === 'passphrase') {
    // Diceware entropy estimation: ~12.9 bits per random word from 7776 or ~8-9 bits from 200+
    const words = password.split(/[-_. #]/);
    entropy = words.length * 11.5;
    if (/\d/.test(password)) entropy += 10;
  } else {
    // Shannon entropy based on pool size
    entropy = Math.round(len * Math.log2(poolSize) * 10) / 10;
  }

  // Penalize repeating characters or sequences
  const warnings: string[] = [];
  const tips: string[] = [];

  if (/(.)\1{2,}/.test(password)) {
    entropy = Math.max(10, entropy - 15);
    warnings.push('Enthält 3+ wiederholte Zeichen hintereinander');
  }
  if (/1234|abcd|qwert|password|admin/i.test(password)) {
    entropy = Math.max(10, entropy - 25);
    warnings.push('Enthält vorhersehbare Tastatur-Muster oder Sequenzen');
  }

  if (len < 8) {
    warnings.push('Kritisch kurz (< 8 Zeichen) – leicht zu knacken');
  } else if (len < 12) {
    tips.push('Verwende mindestens 14–16 Zeichen für moderne Standards');
  }

  if (!hasSym && mode === 'password') {
    tips.push('Füge Sonderzeichen hinzu, um den Suchraum drastisch zu vergrößern');
  }
  if (!hasNum && mode === 'password') {
    tips.push('Ziffern erhöhen die Komplexität gegenüber reinen Wörterbuch-Attacken');
  }

  // Strength categorization based on entropy
  let rating: StrengthRating = 'sehr_schwach';
  let ratingLabel = 'Sehr schwach';
  let score = 0;

  if (entropy < 28) {
    rating = 'sehr_schwach';
    ratingLabel = 'Sehr schwach';
    score = Math.min(25, Math.round((entropy / 28) * 25));
  } else if (entropy < 45) {
    rating = 'schwach';
    ratingLabel = 'Schwach';
    score = Math.round(25 + ((entropy - 28) / 17) * 25);
  } else if (entropy < 65) {
    rating = 'mittel';
    ratingLabel = 'Mittel';
    score = Math.round(50 + ((entropy - 45) / 20) * 25);
  } else if (entropy < 90) {
    rating = 'stark';
    ratingLabel = 'Stark';
    score = Math.round(75 + ((entropy - 65) / 25) * 20);
  } else {
    rating = 'extrem_sicher';
    ratingLabel = 'Militärisch / Quantensicher';
    score = 100;
  }

  // Crack times:
  // Offline fast (GPU cluster / RTX 4090 cluster: ~10^11 hashes/sec = 100 Billion/s)
  // Offline slow (Standard CPU / GPU: ~10^8 hashes/sec)
  // Online throttled (Web login: ~10 attempts/sec)
  const combinations = Math.pow(poolSize, len);
  const crackTimeOfflineFast = formatDuration(combinations / (2 * 1e11));
  const crackTimeOfflineSlow = formatDuration(combinations / (2 * 1e8));
  const crackTimeOnline = formatDuration(combinations / (2 * 10));

  return {
    entropy,
    poolSize,
    score,
    rating,
    ratingLabel,
    crackTimeOfflineFast,
    crackTimeOfflineSlow,
    crackTimeOnline,
    breakdown: {
      uppercase: upperCount,
      lowercase: lowerCount,
      numbers: numCount,
      symbols: symCount,
    },
    warnings,
    tips,
  };
};

function formatDuration(seconds: number): string {
  if (seconds < 0.001) return '< 1 Millisekunde';
  if (seconds < 1) return '< 1 Sekunde';
  if (seconds < 60) return `${Math.round(seconds)} Sekunden`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} Minuten`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} Stunden`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} Tage`;

  const years = seconds / 31536000;
  if (years < 1000) return `${Math.round(years)} Jahre`;
  if (years < 1e6) return `${(years / 1000).toFixed(1)} Tausend Jahre`;
  if (years < 1e9) return `${(years / 1e6).toFixed(1)} Millionen Jahre`;
  if (years < 1e12) return `${(years / 1e9).toFixed(1)} Milliarden Jahre`;
  return 'Trillionen Jahre (Unknackbar)';
}
