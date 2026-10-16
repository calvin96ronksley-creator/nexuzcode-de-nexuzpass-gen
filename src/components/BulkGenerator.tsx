import React, { useState } from 'react';
import { PasswordConfig } from '../types/crypto';
import { generatePassword, analyzePassword } from '../utils/cryptoGenerator';
import { Copy, Check, Download, Layers, RefreshCw } from 'lucide-react';
import { playCopyChime, playGenerateSound, playClickTick } from '../utils/audio';

interface BulkGeneratorProps {
  config: PasswordConfig;
}

export const BulkGenerator: React.FC<BulkGeneratorProps> = ({ config }) => {
  const [count, setCount] = useState<number>(10);
  const [passwords, setPasswords] = useState<string[]>(() => {
    return Array.from({ length: 10 }, () => generatePassword(config));
  });
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const handleGenerateBulk = () => {
    playGenerateSound();
    const list = Array.from({ length: count }, () => generatePassword(config));
    setPasswords(list);
  };

  const handleCopyOne = async (index: number, pw: string) => {
    try {
      await navigator.clipboard.writeText(pw);
      playCopyChime();
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyAll = async () => {
    try {
      const text = passwords.join('\n');
      await navigator.clipboard.writeText(text);
      playCopyChime();
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportFile = (format: 'txt' | 'csv') => {
    playClickTick();
    let content = '';
    let filename = `cybercrypt_passwords_${Date.now()}`;

    if (format === 'txt') {
      content = passwords.join('\n');
      filename += '.txt';
    } else {
      content = 'Index,Password,Length,Entropy\n' + passwords.map((pw, i) => {
        const a = analyzePassword(pw, config.mode);
        return `${i + 1},"${pw.replace(/"/g, '""')}",${pw.length},${a.entropy}`;
      }).join('\n');
      filename += '.csv';
    }

    const blob = new Blob([content], { type: format === 'txt' ? 'text/plain' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="rounded-2xl bg-[#0d121e]/90 border border-slate-800 p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Massen-Passwort-Generator
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Erzeuge mehrere kryptografisch zufällige Passwörter gleichzeitig nach deiner aktuellen Konfiguration.
          </p>
        </div>

        {/* Quantities & Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            {[5, 10, 25, 50].map((qty) => (
              <button
                key={qty}
                onClick={() => {
                  playClickTick();
                  setCount(qty);
                }}
                className={`px-2.5 py-1 text-xs font-mono rounded cursor-pointer ${
                  count === qty
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {qty}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerateBulk}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Neu erzeugen</span>
          </button>
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-slate-400 font-mono">
          {passwords.length} Passwörter generiert (Länge: {config.length})
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
              allCopied
                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            {allCopied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{allCopied ? 'Alle kopiert!' : 'Alle kopieren'}</span>
          </button>

          <button
            onClick={() => handleExportFile('txt')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.TXT</span>
          </button>

          <button
            onClick={() => handleExportFile('csv')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.CSV</span>
          </button>
        </div>
      </div>

      {/* Passwords List */}
      <div className="rounded-xl border border-slate-800 bg-[#0a0d16] divide-y divide-slate-800/80 overflow-hidden">
        {passwords.map((pw, index) => {
          const isCopied = copiedIndex === index;
          return (
            <div
              key={index}
              className="p-3.5 flex items-center justify-between gap-4 hover:bg-[#0d1222] transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-mono text-slate-600 w-6 tabular-nums">
                  #{String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-sm text-cyan-300 truncate select-all">
                  {pw}
                </span>
              </div>

              {/* 1-Click Copy Item */}
              <button
                onClick={() => handleCopyOne(index, pw)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  isCopied
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-900 group-hover:bg-cyan-950/60 text-slate-400 group-hover:text-cyan-300 border border-slate-800'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Kopiert!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Kopieren</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
