import React, { useState, useMemo } from 'react';
import { computeAsciiHashes, verifyHashMatch } from '../utils/hashing';
import { Copy, Check, Hash, Key, Search, ArrowRight, ShieldCheck, Binary, Code2 } from 'lucide-react';
import { playCopyChime, playClickTick } from '../utils/audio';

interface HashLabProps {
  currentPassword: string;
  externalInput?: string;
}

export const HashLab: React.FC<HashLabProps> = ({ currentPassword }) => {
  const [sourceMode, setSourceMode] = useState<'password' | 'custom'>('password');
  const [customText, setCustomText] = useState('CyberCrypt_2026_SecureKey');
  const [hmacSecret, setHmacSecret] = useState('');
  const [isUppercase, setIsUppercase] = useState(false);
  const [copiedAlgo, setCopiedAlgo] = useState<string | null>(null);
  const [verificationInput, setVerificationInput] = useState('');
  const [activeTab, setActiveTab] = useState<'hashes' | 'raw_bytes'>('hashes');

  const activeText = sourceMode === 'password' ? currentPassword : customText;

  const hashData = useMemo(() => {
    return computeAsciiHashes(activeText || '', hmacSecret || undefined);
  }, [activeText, hmacSecret]);

  const matchedAlgorithm = useMemo(() => {
    return verifyHashMatch(verificationInput, hashData.results);
  }, [verificationInput, hashData.results]);

  const handleCopy = async (algo: string, text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      playCopyChime();
      setCopiedAlgo(algo);
      setTimeout(() => setCopiedAlgo(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Explanation */}
      <div className="rounded-2xl bg-[#0d121e]/90 border border-slate-800 p-5 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white tracking-wide">
                Kryptografisches ASCII-Hash-Labor
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Berechne in Echtzeit Einweg-Prüfsummen (Hashes) aus beliebigem ASCII-Text für MD5 (128-Bit), SHA-1, SHA-256, SHA-512 & HMAC.
            </p>
          </div>

          {/* Source Mode Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => {
                playClickTick();
                setSourceMode('password');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                sourceMode === 'password'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Vom Passwort übernehmen
            </button>
            <button
              onClick={() => {
                playClickTick();
                setSourceMode('custom');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                sourceMode === 'custom'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Eigener ASCII-Text
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-300">
              Eingabe-ASCII-Zeichenfolge ({hashData.byteLength} Bytes, {activeText.length} Zeichen):
            </span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={isUppercase}
                  onChange={(e) => setIsUppercase(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0 accent-cyan-400"
                />
                <span className="text-xs">Großbuchstaben (HEX)</span>
              </label>
            </div>
          </div>

          {sourceMode === 'password' ? (
            <div className="p-3.5 bg-[#06080e] rounded-xl border border-cyan-500/30 flex items-center justify-between gap-3">
              <span className="font-mono text-sm sm:text-base text-cyan-300 break-all select-all">
                {activeText || <span className="text-slate-600">Kein Passwort generiert</span>}
              </span>
              <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-cyan-950 text-cyan-400 border border-cyan-800 shrink-0">
                Live-Sync
              </span>
            </div>
          ) : (
            <textarea
              rows={2}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Gib hier deinen beliebigen ASCII-Text oder Klartext ein..."
              className="w-full p-3 font-mono text-sm bg-[#06080e] border border-slate-800 rounded-xl text-slate-200 focus:border-cyan-500 focus:outline-none transition-colors"
            />
          )}

          {/* Optional HMAC Key Input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap">
              <Key className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>Optionales HMAC-Geheimnis (Secret Salt):</span>
            </div>
            <input
              type="text"
              placeholder="z.B. my_secret_hmac_salt_key"
              value={hmacSecret}
              onChange={(e) => setHmacSecret(e.target.value)}
              className="flex-1 px-3 py-1 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-fuchsia-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tabs: Hashes vs Raw Byte Inspector */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('hashes')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'hashes'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Krypto-Hashes ({hashData.results.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('raw_bytes')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'raw_bytes'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>ASCII Hex / Base64 / Binär-Dump</span>
          </button>
        </div>
      </div>

      {/* Content View 1: Hashes Table */}
      {activeTab === 'hashes' && (
        <div className="grid grid-cols-1 gap-3">
          {hashData.results.map((item) => {
            const formattedHash = isUppercase ? item.hash.toUpperCase() : item.hash.toLowerCase();
            const isCopied = copiedAlgo === item.algorithm;

            return (
              <div
                key={item.algorithm}
                className="rounded-xl bg-[#0a0d16] border border-slate-800/90 hover:border-slate-700 p-4 transition-all hover:bg-[#0c101c] group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
                      {item.algorithm}
                    </span>
                    <span className="text-xs font-mono text-slate-400 tabular-nums">
                      {item.bitLength} Bit
                    </span>
                    <span className="text-xs text-slate-500 hidden md:inline">· {item.fullName}</span>
                  </div>

                  {/* 1-Click Copy Button */}
                  <button
                    onClick={() => handleCopy(item.algorithm, formattedHash)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all transform active:scale-95 shrink-0 self-start sm:self-auto cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_#10b981]'
                        : 'bg-slate-900 hover:bg-cyan-950/50 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Kopiert!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>1-Klick Kopieren</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Hash String Box */}
                <div className="p-2.5 rounded-lg bg-[#06080e] border border-slate-900 select-all overflow-x-auto">
                  <code className="font-mono text-xs sm:text-sm text-cyan-200/90 break-all leading-relaxed">
                    {formattedHash || <span className="text-slate-600">Eingabe erforderlich</span>}
                  </code>
                </div>

                <p className="text-[11px] text-slate-500 mt-2">{item.description}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Content View 2: Raw Bytes & Encodings */}
      {activeTab === 'raw_bytes' && (
        <div className="space-y-4">
          {/* Base64 */}
          <div className="rounded-xl bg-[#0a0d16] border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 font-mono">Base64 Codierung:</span>
              <button
                onClick={() => handleCopy('base64', hashData.base64Representation)}
                className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-cyan-300 bg-slate-900 border border-slate-800 rounded-md cursor-pointer flex items-center gap-1"
              >
                {copiedAlgo === 'base64' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedAlgo === 'base64' ? 'Kopiert!' : 'Kopieren'}</span>
              </button>
            </div>
            <div className="p-3 rounded-lg bg-[#06080e] font-mono text-xs text-fuchsia-300 break-all select-all">
              {hashData.base64Representation || '–'}
            </div>
          </div>

          {/* Hex Dump */}
          <div className="rounded-xl bg-[#0a0d16] border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 font-mono">Hexadezimaler ASCII Byte Dump:</span>
              <button
                onClick={() => handleCopy('hex', hashData.hexRepresentation)}
                className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-cyan-300 bg-slate-900 border border-slate-800 rounded-md cursor-pointer flex items-center gap-1"
              >
                {copiedAlgo === 'hex' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedAlgo === 'hex' ? 'Kopiert!' : 'Kopieren'}</span>
              </button>
            </div>
            <div className="p-3 rounded-lg bg-[#06080e] font-mono text-xs text-emerald-400 break-all select-all tracking-wider">
              {hashData.hexRepresentation || '–'}
            </div>
          </div>

          {/* Binary 8-bit stream */}
          <div className="rounded-xl bg-[#0a0d16] border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 font-mono">8-Bit Binär-Datenstrom (ASCII):</span>
              <button
                onClick={() => handleCopy('bin', hashData.binaryRepresentation)}
                className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-cyan-300 bg-slate-900 border border-slate-800 rounded-md cursor-pointer flex items-center gap-1"
              >
                {copiedAlgo === 'bin' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedAlgo === 'bin' ? 'Kopiert!' : 'Kopieren'}</span>
              </button>
            </div>
            <div className="p-3 rounded-lg bg-[#06080e] font-mono text-[11px] text-cyan-300 break-all select-all tracking-widest leading-loose">
              {hashData.binaryRepresentation || '–'}
            </div>
          </div>
        </div>
      )}

      {/* Hash Verifier & Comparison Tool */}
      <div className="rounded-2xl bg-[#0d121e]/90 border border-slate-800 p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Prüfsummen-Verifizierer (Hash Matcher)
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Füge einen beliebigen Prüfsummen-Hash ein (z.B. aus einer Sicherheits-Dokumentation oder Download-Checksumme), um sofort zu prüfen, ob der aktuelle ASCII-Text diesen Hash erzeugt.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Hash hier einfügen (z.B. 5d41402abc4b2a76b9719d911017c592 oder SHA256)..."
            value={verificationInput}
            onChange={(e) => setVerificationInput(e.target.value)}
            className="flex-1 px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-cyan-500 focus:outline-none"
          />
          {verificationInput && (
            <button
              onClick={() => setVerificationInput('')}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 rounded-lg border border-slate-800"
            >
              Löschen
            </button>
          )}
        </div>

        {/* Verification Result Banner */}
        {verificationInput.trim() && (
          <div className="mt-3">
            {matchedAlgorithm ? (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center gap-3 text-emerald-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold">Perfekte Übereinstimmung gefunden!</span> Der eingefügte Hash entspricht dem{' '}
                  <span className="font-mono font-bold text-white bg-emerald-900/60 px-1.5 py-0.5 rounded">
                    {matchedAlgorithm.algorithm}
                  </span>{' '}
                  Hash ({matchedAlgorithm.bitLength} Bit) deines ASCII-Textes.
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 text-slate-400 text-xs">
                <span>Keine Übereinstimmung mit einem der berechneten Algorithmen (MD5, SHA-1, SHA-256, SHA-512, etc.).</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
