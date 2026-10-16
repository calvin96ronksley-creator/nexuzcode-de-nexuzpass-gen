import React, { useState, useEffect, useCallback } from 'react';
import { PasswordConfig, PasswordHistoryItem } from './types/crypto';
import { generatePassword, analyzePassword } from './utils/cryptoGenerator';
import { Header } from './components/Header';
import { PasswordDisplay } from './components/PasswordDisplay';
import { ConfigPanel } from './components/ConfigPanel';
import { HashLab } from './components/HashLab';
import { EntropyDetails } from './components/EntropyDetails';
import { BulkGenerator } from './components/BulkGenerator';
import { HistoryDrawer } from './components/HistoryDrawer';
import { playGenerateSound } from './utils/audio';
import { ShieldCheck, Lock, Terminal, Cpu } from 'lucide-react';

const DEFAULT_CONFIG: PasswordConfig = {
  mode: 'password',
  length: 18,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeSimilar: false,
  excludeAmbiguous: false,
  customAllowedChars: '',
  customExcludedChars: '',
  passphraseWordsCount: 4,
  passphraseSeparator: '-',
  passphraseCapitalize: true,
  passphraseIncludeNumber: true,
};

export default function App() {
  const [config, setConfig] = useState<PasswordConfig>(DEFAULT_CONFIG);
  const [password, setPassword] = useState<string>('');
  const [history, setHistory] = useState<PasswordHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'generator' | 'hasher' | 'bulk' | 'audit'>('generator');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate new password
  const handleGenerate = useCallback((cfg: PasswordConfig = config) => {
    setIsGenerating(true);
    const newPw = generatePassword(cfg);
    setPassword(newPw);

    const analysis = analyzePassword(newPw, cfg.mode);
    const historyItem: PasswordHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      value: newPw,
      mode: cfg.mode,
      length: newPw.length,
      entropy: analysis.entropy,
      rating: analysis.rating,
    };

    setHistory((prev) => [historyItem, ...prev.slice(0, 49)]); // keep last 50
    setTimeout(() => setIsGenerating(false), 200);
  }, [config]);

  // Initial generation
  useEffect(() => {
    handleGenerate(DEFAULT_CONFIG);
  }, []);

  // Update password automatically when config changes
  const handleConfigChange = (newConfig: PasswordConfig) => {
    setConfig(newConfig);
    handleGenerate(newConfig);
  };

  // Keyboard shortcut: Spacebar to regenerate when not typing in input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        playGenerateSound();
        handleGenerate(config);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerate, config]);

  const currentAnalysis = analyzePassword(password, config.mode);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-300">
      {/* Background ambient lighting and cyber mesh */}
      <div className="fixed inset-0 pointer-events-none cyber-grid opacity-60 z-0" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-1/3 w-80 h-80 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Top Bar Contract Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onGenerateNew={() => {
          playGenerateSound();
          handleGenerate(config);
        }}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 z-10 space-y-6">
        {/* Dominant Visual Hero Anchor: The Password Display */}
        <section aria-label="Passwort-Ausgabe">
          <PasswordDisplay
            password={password}
            analysis={currentAnalysis}
            onRegenerate={() => handleGenerate(config)}
            onSendToHasher={() => {
              setActiveTab('hasher');
            }}
            isGenerating={isGenerating}
          />
        </section>

        {/* Tab Viewport */}
        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Full Configuration Panel (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              <ConfigPanel config={config} onChange={handleConfigChange} />
            </div>

            {/* Right Column: Instant Security Insights & Shortcuts (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Entropy Breakdown */}
              <div className="rounded-2xl bg-[#0d121e]/90 border border-slate-800 p-5 shadow-lg backdrop-blur-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Sicherheits-Audit
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Entropie:</span>
                    <span className="font-mono font-bold text-cyan-400">
                      {currentAnalysis.entropy} Bits
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Kombinationen:</span>
                    <span className="font-mono text-slate-300">
                      ~{currentAnalysis.poolSize}^{password.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Zeichensatz-Pool:</span>
                    <span className="font-mono text-slate-300">
                      {currentAnalysis.poolSize} mögliche Zeichen
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">GPU-Crackzeit:</span>
                    <span className="font-mono font-bold text-emerald-400 truncate max-w-[150px] text-right" title={currentAnalysis.crackTimeOfflineFast}>
                      {currentAnalysis.crackTimeOfflineFast}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('audit')}
                    className="w-full py-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-500/30 rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Detaillierte Analyse öffnen
                  </button>
                </div>
              </div>

              {/* Pro Tips / Cyber Card */}
              <div className="rounded-2xl bg-[#0d121e]/90 border border-slate-800 p-5 shadow-lg backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Terminal className="w-4 h-4 text-fuchsia-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Tastatur-Kürzel & Tipps
                  </h3>
                </div>

                <ul className="text-xs text-slate-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-900 border border-slate-700 rounded text-cyan-300">
                      Leertaste
                    </kbd>
                    <span>Neues Passwort sofort erzeugen</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-900 border border-slate-700 rounded text-cyan-300">
                      1-Klick
                    </kbd>
                    <span>Kopiert direkt in die Zwischenablage</span>
                  </li>
                  <li className="text-[11px] text-slate-500 pt-1">
                    Kryptografisch abgesichert durch <span className="text-slate-400 font-mono">crypto.getRandomValues</span> (CSPRNG).
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab: ASCII-Hasher */}
        {activeTab === 'hasher' && (
          <section aria-label="ASCII-Hasher">
            <HashLab currentPassword={password} />
          </section>
        )}

        {/* Tab: Massen-Generator */}
        {activeTab === 'bulk' && (
          <section aria-label="Massen-Generator">
            <BulkGenerator config={config} />
          </section>
        )}

        {/* Tab: Entropie-Audit */}
        {activeTab === 'audit' && (
          <section aria-label="Entropie-Audit">
            <EntropyDetails analysis={currentAnalysis} passwordLength={password.length} />
          </section>
        )}
      </main>

      {/* History Drawer Modal */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
      />

      {/* Footer conforming to design constitution: clean, unboxed text */}
      <footer className="w-full border-t border-slate-800/80 bg-[#06080e] py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">CYBERCRYPT</span>
            <span aria-hidden="true">·</span>
            <span>Clientseitige CSPRNG-Generierung</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Knowledge / Keine Server-Speicherung</span>
          </div>

          <div className="flex items-center gap-3">
            <span>MD5</span>
            <span aria-hidden="true">·</span>
            <span>SHA-1</span>
            <span aria-hidden="true">·</span>
            <span>SHA-256</span>
            <span aria-hidden="true">·</span>
            <span>SHA-512</span>
            <span aria-hidden="true">·</span>
            <span>HMAC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
