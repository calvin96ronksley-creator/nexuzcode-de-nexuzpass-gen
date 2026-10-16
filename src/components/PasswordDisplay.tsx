import React, { useState } from 'react';
import { Copy, Check, RotateCw, Eye, EyeOff, Hash, Shield, Zap } from 'lucide-react';
import { PasswordAnalysis } from '../types/crypto';
import { playCopyChime, playGenerateSound, playClickTick } from '../utils/audio';

interface PasswordDisplayProps {
  password: string;
  analysis: PasswordAnalysis;
  onRegenerate: () => void;
  onSendToHasher: (text: string) => void;
  isGenerating?: boolean;
}

export const PasswordDisplay: React.FC<PasswordDisplayProps> = ({
  password,
  analysis,
  onRegenerate,
  onSendToHasher,
  isGenerating = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(true);

  const handleCopy = async () => {
    if (!password) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(password);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = password;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      playCopyChime();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Render colored character spans for syntax highlighting
  const renderHighlightedChars = () => {
    if (!password) return <span className="text-slate-600">Kein Passwort generiert</span>;
    if (!revealed) {
      return (
        <span className="tracking-widest text-slate-500 font-mono select-none">
          {'•'.repeat(Math.min(32, password.length))}
          {password.length > 32 ? ` (+${password.length - 32})` : ''}
        </span>
      );
    }

    return password.split('').map((char, index) => {
      const code = char.charCodeAt(0);
      let colorClass = 'text-cyan-200';

      if (code >= 48 && code <= 57) {
        // Numbers: Neon Emerald
        colorClass = 'text-emerald-400 font-semibold';
      } else if (code >= 65 && code <= 90) {
        // Uppercase: Crisp Ice White / Bright
        colorClass = 'text-white font-semibold';
      } else if (code >= 97 && code <= 122) {
        // Lowercase: Soft Cyan
        colorClass = 'text-cyan-200/90';
      } else {
        // Symbols: Hot Magenta / Fuchsia
        colorClass = 'text-fuchsia-400 font-bold';
      }

      return (
        <span key={index} className={`${colorClass} hover:opacity-80 transition-opacity`}>
          {char}
        </span>
      );
    });
  };

  // Determine meter styles based on strength
  const getRatingTheme = () => {
    switch (analysis.rating) {
      case 'extrem_sicher':
        return {
          barBg: 'bg-emerald-400',
          glow: 'shadow-[0_0_12px_#34d399]',
          badgeBg: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400',
        };
      case 'stark':
        return {
          barBg: 'bg-cyan-400',
          glow: 'shadow-[0_0_12px_#22d3ee]',
          badgeBg: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40',
          dot: 'bg-cyan-400',
        };
      case 'mittel':
        return {
          barBg: 'bg-yellow-400',
          glow: 'shadow-[0_0_12px_#facc15]',
          badgeBg: 'bg-yellow-950/60 text-yellow-300 border-yellow-500/40',
          dot: 'bg-yellow-400',
        };
      case 'schwach':
        return {
          barBg: 'bg-orange-400',
          glow: 'shadow-[0_0_12px_#fb923c]',
          badgeBg: 'bg-orange-950/60 text-orange-300 border-orange-500/40',
          dot: 'bg-orange-400',
        };
      default:
        return {
          barBg: 'bg-rose-500',
          glow: 'shadow-[0_0_12px_#f43f5e]',
          badgeBg: 'bg-rose-950/60 text-rose-300 border-rose-500/40',
          dot: 'bg-rose-400',
        };
    }
  };

  const theme = getRatingTheme();

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#0f1422] to-[#0a0d16] border border-cyan-500/20 p-5 sm:p-7 shadow-xl shadow-cyan-950/20">
      {/* Top subtle badge and actions */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="text-slate-500">Länge:</span>
            <span className="text-cyan-400 font-bold tabular-nums">{password.length}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="text-slate-500">Entropie:</span>
            <span className="text-fuchsia-400 font-bold tabular-nums">{analysis.entropy} bit</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Toggle reveal */}
          <button
            onClick={() => {
              playClickTick();
              setRevealed(!revealed);
            }}
            title={revealed ? 'Passwort verbergen' : 'Passwort anzeigen'}
            className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/30 border border-slate-800 hover:border-cyan-500/30 rounded-lg transition-colors cursor-pointer"
          >
            {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Regenerate */}
          <button
            onClick={() => {
              playGenerateSound();
              onRegenerate();
            }}
            title="Neues Passwort erzeugen (oder Leertaste drücken)"
            className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/30 border border-slate-800 hover:border-cyan-500/30 rounded-lg transition-all cursor-pointer group"
          >
            <RotateCw className={`w-4 h-4 group-hover:rotate-180 transition-transform duration-500 ${isGenerating ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Forward to Hasher */}
          <button
            onClick={() => {
              playClickTick();
              onSendToHasher(password);
            }}
            title="In ASCII-Hasher übertragen"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-fuchsia-300 bg-slate-900 hover:bg-fuchsia-950/30 border border-slate-800 hover:border-fuchsia-500/30 rounded-lg transition-colors cursor-pointer"
          >
            <Hash className="w-3.5 h-3.5 text-fuchsia-400" />
            <span className="hidden sm:inline">Hashen</span>
          </button>
        </div>
      </div>

      {/* Main Terminal Display Window */}
      <div className="relative rounded-xl bg-[#06080e] border border-cyan-500/30 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
        {/* Glow corner elements */}
        <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl-sm pointer-events-none" />
        <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-cyan-400 rounded-br-sm pointer-events-none" />

        {/* The Password string itself */}
        <div className="w-full overflow-x-auto py-1 scrollbar-none text-left select-all">
          <div className="font-mono text-lg sm:text-2xl font-medium tracking-wide break-all leading-relaxed whitespace-pre-wrap">
            {renderHighlightedChars()}
          </div>
        </div>

        {/* 1-Click Copy Button with High Visibility & Feedback */}
        <button
          onClick={handleCopy}
          className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all transform active:scale-95 shrink-0 cursor-pointer ${
            copied
              ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_#10b981]'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_22px_rgba(6,182,212,0.6)]'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span className="tracking-wide">Kopiert!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="tracking-wide">1-Klick Kopieren</span>
            </>
          )}
        </button>
      </div>

      {/* Strength & Entropy Progress Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sicherheitsstufe:</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${theme.badgeBg}`}>
              {analysis.ratingLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Knackzeit (GPU-Cluster):</span>
            <span className="font-mono text-cyan-300 font-semibold">{analysis.crackTimeOfflineFast}</span>
          </div>
        </div>

        {/* 5-Segment Progress Bar */}
        <div className="w-full bg-slate-950/80 rounded-full h-2 p-0.5 border border-slate-800 overflow-hidden flex gap-1">
          {[1, 2, 3, 4, 5].map((segIndex) => {
            const currentSegment = Math.ceil(analysis.score / 20);
            const isFilled = segIndex <= currentSegment;
            return (
              <div
                key={segIndex}
                className={`h-full flex-1 rounded-full transition-all duration-300 ${
                  isFilled ? `${theme.barBg} ${theme.glow}` : 'bg-slate-800/50'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
