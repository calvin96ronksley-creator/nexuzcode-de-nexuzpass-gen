import React, { useState, useEffect } from 'react';
import { KeyRound, Volume2, VolumeX, Sparkles, ShieldCheck } from 'lucide-react';
import { getSoundEnabled, setSoundEnabled, playClickTick } from '../utils/audio';

interface HeaderProps {
  activeTab: 'generator' | 'hasher' | 'bulk' | 'audit';
  setActiveTab: (tab: 'generator' | 'hasher' | 'bulk' | 'audit') => void;
  onGenerateNew: () => void;
  historyCount: number;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onGenerateNew,
  historyCount,
  onOpenHistory,
}) => {
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    setSoundOn(getSoundEnabled());
  }, []);

  const toggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    setSoundEnabled(newState);
    if (newState) {
      playClickTick();
    }
  };

  const navItems = [
    { id: 'generator', label: 'Generator' },
    { id: 'hasher', label: 'ASCII-Hasher' },
    { id: 'bulk', label: 'Massen-Generator' },
    { id: 'audit', label: 'Entropie-Audit' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080b11]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Zone (Single text element wordmark with neon accent) */}
        <a
          href="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 p-[1px] shadow-sm shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <div className="w-full h-full bg-[#080b11] rounded-[7px] flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className="font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400 bg-clip-text text-transparent">
            CYBERCRYPT
          </span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playClickTick();
                  setActiveTab(item.id);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* History button */}
          <button
            onClick={() => {
              playClickTick();
              onOpenHistory();
            }}
            title="Verlauf anzeigen"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <span>Verlauf</span>
            {historyCount > 0 && (
              <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60 rounded px-1.5 py-0.2">
                {historyCount}
              </span>
            )}
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundOn ? 'Ton stummschalten' : 'Ton aktivieren'}
            title={soundOn ? 'Sound-Effekte aktiv' : 'Sound-Effekte stummgeschaltet'}
            className={`p-2 rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              soundOn
                ? 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-900/30'
                : 'text-slate-500 border-slate-800 bg-slate-900/50 hover:text-slate-300'
            }`}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              onGenerateNew();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all transform active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generieren</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-slate-800/60 bg-[#06080d] gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              playClickTick();
              setActiveTab(item.id);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
              activeTab === item.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 bg-slate-900/40'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
