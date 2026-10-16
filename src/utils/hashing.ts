import CryptoJS from 'crypto-js';
import { HashResult } from '../types/crypto';

export interface ComprehensiveHashOutput {
  inputAscii: string;
  byteLength: number;
  results: HashResult[];
  hexRepresentation: string;
  base64Representation: string;
  binaryRepresentation: string;
}

export const computeAsciiHashes = (input: string, hmacKey?: string): ComprehensiveHashOutput => {
  const byteLength = new TextEncoder().encode(input).length;

  // Compute algorithms
  const md5Hash = CryptoJS.MD5(input).toString();
  const sha1Hash = CryptoJS.SHA1(input).toString();
  const sha224Hash = CryptoJS.SHA224(input).toString();
  const sha256Hash = CryptoJS.SHA256(input).toString();
  const sha384Hash = CryptoJS.SHA384(input).toString();
  const sha512Hash = CryptoJS.SHA512(input).toString();
  const sha3Hash = CryptoJS.SHA3(input, { outputLength: 256 }).toString();
  const ripemd160Hash = CryptoJS.RIPEMD160(input).toString();

  const hmacSha256 = hmacKey ? CryptoJS.HmacSHA256(input, hmacKey).toString() : '';

  const results: HashResult[] = [
    {
      algorithm: 'MD5',
      fullName: 'Message Digest Algorithm 5',
      bitLength: 128,
      hash: md5Hash,
      description: '128-Bit Prüfsummen-Standard (weit verbreitet für Datei-Integrität).',
    },
    {
      algorithm: 'SHA-1',
      fullName: 'Secure Hash Algorithm 1',
      bitLength: 160,
      hash: sha1Hash,
      description: '160-Bit Hashwert (u.a. von Git für Commit-Objekte genutzt).',
    },
    {
      algorithm: 'SHA-256',
      fullName: 'Secure Hash Algorithm 2 (256-Bit)',
      bitLength: 256,
      hash: sha256Hash,
      description: 'NIST & BSI Industrie-Goldstandard für Passwörter, SSL/TLS & Bitcoin.',
    },
    {
      algorithm: 'SHA-512',
      fullName: 'Secure Hash Algorithm 2 (512-Bit)',
      bitLength: 512,
      hash: sha512Hash,
      description: 'Hochsicherer 512-Bit Krypto-Hash für maximale Kollisionsresistenz.',
    },
    {
      algorithm: 'SHA-384',
      fullName: 'Secure Hash Algorithm 2 (384-Bit)',
      bitLength: 384,
      hash: sha384Hash,
      description: '384-Bit Variante aus der SHA-2 Familie (oft in Regierungs-Standards).',
    },
    {
      algorithm: 'SHA-224',
      fullName: 'Secure Hash Algorithm 2 (224-Bit)',
      bitLength: 224,
      hash: sha224Hash,
      description: '224-Bit Variante, passend zu 2-Key Triple-DES Sicherheitsstufen.',
    },
    {
      algorithm: 'SHA-3 (256)',
      fullName: 'Keccak Sponge Function (SHA-3)',
      bitLength: 256,
      hash: sha3Hash,
      description: 'Neuester NIST Standard basierend auf Schwamm-Konstruktion.',
    },
    {
      algorithm: 'RIPEMD-160',
      fullName: 'RACE Integrity Primitives Evaluation Message Digest',
      bitLength: 160,
      hash: ripemd160Hash,
      description: 'Europäische kryptografische Hashfunktion (u.a. in Bitcoin-Adressen).',
    },
  ];

  if (hmacKey && hmacSha256) {
    results.push({
      algorithm: 'HMAC-SHA256',
      fullName: 'Keyed-Hash Message Authentication Code (SHA-256)',
      bitLength: 256,
      hash: hmacSha256,
      description: `Kryptografisch mit Secret-Key "${hmacKey}" signierter Hash.`,
    });
  }

  // Hex dump
  let hexRepresentation = '';
  let binaryRepresentation = '';
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    hexRepresentation += code.toString(16).padStart(2, '0').toUpperCase() + (i < input.length - 1 ? ' ' : '');
    binaryRepresentation += code.toString(2).padStart(8, '0') + (i < input.length - 1 ? ' ' : '');
  }

  const base64Representation = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(input));

  return {
    inputAscii: input,
    byteLength,
    results,
    hexRepresentation,
    base64Representation,
    binaryRepresentation,
  };
};

/**
 * Compare an expected hash with generated hashes
 */
export const verifyHashMatch = (targetHash: string, calculatedHashes: HashResult[]): HashResult | null => {
  if (!targetHash || !targetHash.trim()) return null;
  const cleanTarget = targetHash.trim().toLowerCase();

  return calculatedHashes.find((h) => h.hash.toLowerCase() === cleanTarget) || null;
};
