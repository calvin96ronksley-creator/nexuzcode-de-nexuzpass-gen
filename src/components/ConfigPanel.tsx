import React, { useState } from 'react';
import { PasswordConfig } from '../types/crypto';
import { Sliders, Shield, ChevronDown, ChevronUp, Layers, CheckSquare, Square } from 'lucide-react';
import { playClickTick } from '../utils/audio';

interface ConfigPanelProps {
  config: PasswordConfig;
  onChange: (newConfig: PasswordConfig) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateConfig = (partial: Partial<PasswordConfig>) => {
    playClickTick();
    onChange({ ...config, ...partial });
  };

  const presets = [12, 16, 20, 24, 32, 64];

  return (
    <div className="rounded-2xl bg-[#0d121e]/90 border border-slate-800 p-5 sm:p-6 backdrop-blur-sm shadow-lg space-y-6">
      {/* Header and Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold tracking-wide text-white uppercase">Konfiguration</h2>
        </div>

        {/* Mode Tabs */}
        <div className="inline-flex p-1 bg-slate-950/80 rounded-lg border border-slate-800 self-start sm:self-auto">
          {(
            [
              { id: 'password', label: 'Passwort' },
              { id: 'passphrase', label: 'Passphrase' },
              { id: 'pin', label: 'PIN-Code' },
            ] as const
          ).map((mode) => (
            <button
              key={mode.id}
              onClick={() => updateConfig({ mode: mode.id })}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                config.mode === mode.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode = Password */}
      {config.mode === 'password' && (
        <>
          {/* Length Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="length-slider" className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                <span>Zeichenlänge</span>
                <span className="text-xs text-slate-500">(4 – 128)</span>
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="4"
                  max="128"
                  value={config.length}
                  onChange={(e) => {
                    const val = Math.max(4, Math.min(128, parseInt(e.target.value) || 4));
                    updateConfig({ length: val });
                  }}
                  className="w-16 px-2 py-1 text-center font-mono text-sm font-bold bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-md text-cyan-400 tabular-nums"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input
                id="length-slider"
                type="range"
                min="4"
                max="128"
                value={config.length}
                onChange={(e) => updateConfig({ length: parseInt(e.target.value) })}
                className="w-full cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Quick length presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-slate-500 mr-1">Presets:</span>
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => updateConfig({ length: p })}
                  className={`px-2.5 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
                    config.length === p
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Character Sets Toggles */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Zeichensätze anpassen
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Uppercase */}
              <button
                type="button"
                onClick={() => updateConfig({ includeUppercase: !config.includeUppercase })}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  config.includeUppercase
                    ? 'bg-cyan-950/20 border-cyan-500/40 text-slate-100 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {config.includeUppercase ? (
                    <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-semibold">Großbuchstaben (A-Z)</div>
                    <div className="text-[11px] font-mono text-slate-500">ABCDEF...</div>
                  </div>
                </div>
                <span className="text-xs font-mono text-cyan-400/80">26</span>
              </button>

              {/* Lowercase */}
              <button
                type="button"
                onClick={() => updateConfig({ includeLowercase: !config.includeLowercase })}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  config.includeLowercase
                    ? 'bg-cyan-950/20 border-cyan-500/40 text-slate-100 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {config.includeLowercase ? (
                    <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-semibold">Kleinbuchstaben (a-z)</div>
                    <div className="text-[11px] font-mono text-slate-500">abcdef...</div>
                  </div>
                </div>
                <span className="text-xs font-mono text-cyan-400/80">26</span>
              </button>

              {/* Numbers */}
              <button
                type="button"
                onClick={() => updateConfig({ includeNumbers: !config.includeNumbers })}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  config.includeNumbers
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-100 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {config.includeNumbers ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-semibold">Zahlen (0-9)</div>
                    <div className="text-[11px] font-mono text-slate-500">0123456789</div>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400/80">10</span>
              </button>

              {/* Symbols */}
              <button
                type="button"
                onClick={() => updateConfig({ includeSymbols: !config.includeSymbols })}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  config.includeSymbols
                    ? 'bg-fuchsia-950/20 border-fuchsia-500/40 text-slate-100 shadow-[0_0_10px_rgba(217,70,239,0.1)]'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {config.includeSymbols ? (
                    <CheckSquare className="w-4 h-4 text-fuchsia-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-semibold">Sonderzeichen</div>
                    <div className="text-[11px] font-mono text-slate-500">!@#$%^&*...</div>
                  </div>
                </div>
                <span className="text-xs font-mono text-fuchsia-400/80">~33</span>
              </button>
            </div>
          </div>

          {/* Advanced Rules Collapsible */}
          <div className="pt-2">
            <button
              onClick={() => {
                playClickTick();
                setShowAdvanced(!showAdvanced);
              }}
              className="flex items-center justify-between w-full p-2.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-950/60 rounded-lg border border-slate-800/80 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Erweiterte Filter & Zeichensatz-Regeln</span>
              </span>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAdvanced && (
              <div className="mt-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.excludeSimilar}
                      onChange={(e) => updateConfig({ excludeSimilar: e.target.checked })}
                      className="rounded border-slate-700 text-cyan-500 focus:ring-0 accent-cyan-400"
                    />
                    <div className="text-xs text-slate-300">
                      <span className="font-semibold">Ähnliche Zeichen ausschließen</span>
                      <span className="text-slate-500 font-mono ml-2">(i, l, 1, L, o, 0, O, |)</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.excludeAmbiguous}
                      onChange={(e) => updateConfig({ excludeAmbiguous: e.target.checked })}
                      className="rounded border-slate-700 text-cyan-500 focus:ring-0 accent-cyan-400"
                    />
                    <div className="text-xs text-slate-300">
                      <span className="font-semibold">Mehrdeutige Klammern ausschließen</span>
                      <span className="text-slate-500 font-mono ml-2">({`{}[]()/\\'"`})</span>
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Zusätzlich erlaubte Zeichen:
                    </label>
                    <input
                      type="text"
                      placeholder="z.B. €§µ"
                      value={config.customAllowedChars}
                      onChange={(e) => updateConfig({ customAllowedChars: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs font-mono bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Gezielt verbotene Zeichen:
                    </label>
                    <input
                      type="text"
                      placeholder="z.B. @!?"
                      value={config.customExcludedChars}
                      onChange={(e) => updateConfig({ customExcludedChars: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs font-mono bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Mode = Passphrase */}
      {config.mode === 'passphrase' && (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200">
            Passphrasen kombinieren einprägsame Wörter zu einem extrem sicheren Schlüssel (Diceware-Prinzip).
          </div>

          {/* Word count slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">Anzahl der Wörter</label>
              <span className="text-xs font-mono text-cyan-400 font-bold">{config.passphraseWordsCount} Wörter</span>
            </div>
            <input
              type="range"
              min="3"
              max="8"
              value={config.passphraseWordsCount}
              onChange={(e) => updateConfig({ passphraseWordsCount: parseInt(e.target.value) })}
              className="w-full cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Separator selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Wort-Trennzeichen</label>
            <div className="flex items-center gap-2">
              {[
                { id: '-', label: 'Bindestrich (-)' },
                { id: '.', label: 'Punkt (.)' },
                { id: '_', label: 'Unterstrich (_)' },
                { id: ' ', label: 'Leerzeichen' },
                { id: '#', label: 'Raute (#)' },
              ].map((sep) => (
                <button
                  key={sep.id}
                  onClick={() => updateConfig({ passphraseSeparator: sep.id })}
                  className={`px-3 py-1 text-xs rounded-md border font-mono transition-colors cursor-pointer ${
                    config.passphraseSeparator === sep.id
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {sep.label}
                </button>
              ))}
            </div>
          </div>

          {/* Passphrase toggles */}
          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.passphraseCapitalize}
                onChange={(e) => updateConfig({ passphraseCapitalize: e.target.checked })}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0 accent-cyan-400"
              />
              <span className="text-xs text-slate-300">Ersten Buchstaben jedes Wortes großschreiben (TitleCase)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.passphraseIncludeNumber}
                onChange={(e) => updateConfig({ passphraseIncludeNumber: e.target.checked })}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0 accent-cyan-400"
              />
              <span className="text-xs text-slate-300">Zufällige 3-stellige Zahl anfügen (z.B. Wort721)</span>
            </label>
          </div>
        </div>
      )}

      {/* Mode = PIN */}
      {config.mode === 'pin' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">PIN-Länge</label>
              <span className="text-xs font-mono text-cyan-400 font-bold">{config.length} Ziffern</span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              value={config.length}
              onChange={(e) => updateConfig({ length: parseInt(e.target.value) })}
              className="w-full cursor-pointer accent-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2">
            {[4, 6, 8, 12].map((digits) => (
              <button
                key={digits}
                onClick={() => updateConfig({ length: digits })}
                className={`px-3 py-1 text-xs rounded-md border font-mono transition-colors cursor-pointer ${
                  config.length === digits
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {digits}-stellig
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
