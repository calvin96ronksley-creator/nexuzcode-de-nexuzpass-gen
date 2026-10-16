import React from 'react';
import { PasswordAnalysis } from '../types/crypto';
import { ShieldCheck, AlertTriangle, Lightbulb, Cpu, Server, GlobeLock, BarChart3 } from 'lucide-react';

interface EntropyDetailsProps {
  analysis: PasswordAnalysis;
  passwordLength: number;
}

export const EntropyDetails: React.FC<EntropyDetailsProps> = ({ analysis, passwordLength }) => {
  const totalChars = passwordLength || 1;
  const upperPct = Math.round((analysis.breakdown.uppercase / totalChars) * 100);
  const lowerPct = Math.round((analysis.breakdown.lowercase / totalChars) * 100);
  const numPct = Math.round((analysis.breakdown.numbers / totalChars) * 100);
  const symPct = Math.round((analysis.breakdown.symbols / totalChars) * 100);

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Entropy Bits */}
        <div className="p-4 rounded-xl bg-[#0d121e] border border-cyan-500/20 shadow-md">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Informations-Entropie
          </div>
          <div className="text-2xl font-mono font-extrabold text-cyan-400 tabular-nums">
            {analysis.entropy} <span className="text-sm font-sans font-normal text-slate-400">Bits</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Formel: E = L × log₂(N) mit {analysis.poolSize} Zeichen im Pool
          </div>
        </div>

        {/* Crack Time GPU Cluster */}
        <div className="p-4 rounded-xl bg-[#0d121e] border border-cyan-500/20 shadow-md">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>GPU-Cluster Knackzeit</span>
          </div>
          <div className="text-xl font-mono font-bold text-white tabular-nums truncate" title={analysis.crackTimeOfflineFast}>
            {analysis.crackTimeOfflineFast}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Angriff: 100 Mrd. Hashes/Sekunde
          </div>
        </div>

        {/* Crack Time Consumer GPU */}
        <div className="p-4 rounded-xl bg-[#0d121e] border border-cyan-500/20 shadow-md">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>Single High-End GPU</span>
          </div>
          <div className="text-xl font-mono font-bold text-white tabular-nums truncate" title={analysis.crackTimeOfflineSlow}>
            {analysis.crackTimeOfflineSlow}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Angriff: 100 Mio. Hashes/Sekunde
          </div>
        </div>

        {/* Crack Time Online Throttled */}
        <div className="p-4 rounded-xl bg-[#0d121e] border border-cyan-500/20 shadow-md">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <GlobeLock className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Online Web-Login</span>
          </div>
          <div className="text-xl font-mono font-bold text-white tabular-nums truncate" title={analysis.crackTimeOnline}>
            {analysis.crackTimeOnline}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Web-Login mit Rate-Limit (10/s)
          </div>
        </div>
      </div>

      {/* Character Distribution Visualization */}
      <div className="p-5 rounded-2xl bg-[#0d121e] border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Zeichensatz-Verteilung & Komplexität
          </h3>
        </div>

        {/* Stacked bar */}
        <div className="h-4 w-full rounded-full bg-slate-950 overflow-hidden flex border border-slate-800 mb-3">
          <div
            style={{ width: `${upperPct}%` }}
            className="bg-white hover:opacity-90 transition-all"
            title={`Großbuchstaben: ${analysis.breakdown.uppercase} (${upperPct}%)`}
          />
          <div
            style={{ width: `${lowerPct}%` }}
            className="bg-cyan-400 hover:opacity-90 transition-all"
            title={`Kleinbuchstaben: ${analysis.breakdown.lowercase} (${lowerPct}%)`}
          />
          <div
            style={{ width: `${numPct}%` }}
            className="bg-emerald-400 hover:opacity-90 transition-all"
            title={`Zahlen: ${analysis.breakdown.numbers} (${numPct}%)`}
          />
          <div
            style={{ width: `${symPct}%` }}
            className="bg-fuchsia-400 hover:opacity-90 transition-all"
            title={`Sonderzeichen: ${analysis.breakdown.symbols} (${symPct}%)`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0" />
            <span className="text-slate-400">Großbuchstaben:</span>
            <span className="font-mono font-bold text-slate-200 tabular-nums">
              {analysis.breakdown.uppercase} ({upperPct}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
            <span className="text-slate-400">Kleinbuchstaben:</span>
            <span className="font-mono font-bold text-slate-200 tabular-nums">
              {analysis.breakdown.lowercase} ({lowerPct}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-slate-400">Zahlen:</span>
            <span className="font-mono font-bold text-slate-200 tabular-nums">
              {analysis.breakdown.numbers} ({numPct}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 shrink-0" />
            <span className="text-slate-400">Sonderzeichen:</span>
            <span className="font-mono font-bold text-slate-200 tabular-nums">
              {analysis.breakdown.symbols} ({symPct}%)
            </span>
          </div>
        </div>
      </div>

      {/* Warnings & Security Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Warnings */}
        <div className="p-4 rounded-xl bg-[#0d121e] border border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Muster- & Schwachstellen-Audit</span>
          </div>
          {analysis.warnings.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-emerald-400 py-1">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Keine vorhersehbaren Muster oder kritischen Wiederholungen gefunden.</span>
            </div>
          ) : (
            <ul className="space-y-1.5 text-xs text-slate-300">
              {analysis.warnings.map((warn, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 shrink-0">·</span>
                  <span>{warn}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tips according to BSI and NIST */}
        <div className="p-4 rounded-xl bg-[#0d121e] border border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Lightbulb className="w-4 h-4" />
            <span>BSI & NIST Best Practices</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 shrink-0">·</span>
              <span>Länge schlägt Komplexität: 16+ Zeichen bieten exponentiell höheren Schutz.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 shrink-0">·</span>
              <span>Niemals dasselbe Passwort für mehrere Onlinedienste wiederverwenden.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 shrink-0">·</span>
              <span>Wo möglich, immer Zwei-Faktor-Authentifizierung (2FA / Passkeys) aktivieren.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
