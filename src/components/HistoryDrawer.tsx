import React, { useState } from 'react';
import { PasswordHistoryItem } from '../types/crypto';
import { X, Copy, Check, Eye, EyeOff, Trash2, Clock, Shield } from 'lucide-react';
import { playCopyChime, playClickTick } from '../utils/audio';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: PasswordHistoryItem[];
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
}) => {
  const [unmaskedIds, setUnmaskedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleMask = (id: string) => {
    playClickTick();
    const next = new Set(unmaskedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setUnmaskedIds(next);
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      playCopyChime();
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#0c101c] border border-cyan-500/30 shadow-2xl p-6 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Generierungs-Verlauf (Session)
            </h3>
          </div>
          <button
            onClick={() => {
              playClickTick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info notice */}
        <div className="py-3 text-[11px] text-slate-500 border-b border-slate-800/60 flex items-center justify-between">
          <span>Wird nur lokal im RAM während deiner Sitzung gespeichert.</span>
          {history.length > 0 && (
            <button
              onClick={() => {
                playClickTick();
                if (window.confirm('Möchtest du den gesamten Verlauf wirklich leeren?')) {
                  onClearHistory();
                }
              }}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Verlauf leeren</span>
            </button>
          )}
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Noch keine Passwörter generiert.
            </div>
          ) : (
            history.map((item) => {
              const isUnmasked = unmaskedIds.has(item.id);
              const isCopied = copiedId === item.id;
              const dateStr = new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-1">
                      <span className="font-mono">{dateStr}</span>
                      <span>·</span>
                      <span className="font-mono text-cyan-400">{item.length} Zeichen</span>
                      <span>·</span>
                      <span className="font-mono text-fuchsia-400">{item.entropy} bit</span>
                    </div>

                    <div className="font-mono text-xs text-slate-200 truncate select-all">
                      {isUnmasked ? item.value : '••••••••••••••••'}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleMask(item.id)}
                      title={isUnmasked ? 'Verbergen' : 'Anzeigen'}
                      className="p-1.5 text-slate-400 hover:text-cyan-300 rounded hover:bg-slate-900 cursor-pointer"
                    >
                      {isUnmasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => handleCopy(item.id, item.value)}
                      title="Kopieren"
                      className={`px-2.5 py-1 text-xs font-semibold rounded flex items-center gap-1 transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-900 hover:bg-cyan-950/80 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {isCopied ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Kopiert' : 'Kopieren'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
