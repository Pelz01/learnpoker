import React, { useState } from 'react';
import { Bot, Users, Coins, Sparkles, CheckCircle2 } from 'lucide-react';

export default function GameSetupModal({ isOpen, onStartGame, onClose }) {
  const [difficulty, setDifficulty] = useState('hard');
  const [tableSize, setTableSize] = useState(4); // 2, 4, 6
  const [blinds, setBlinds] = useState({ sb: 10, bb: 20 });
  const [startingStack, setStartingStack] = useState(1000);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onStartGame({ difficulty, tableSize, blinds, startingStack });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-6">
        
        {/* Title */}
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Configure AI Poker Match</h2>
            <p className="text-xs text-slate-400">Select computer bot difficulty and table setup</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Difficulty Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-amber-400" />
              Computer Difficulty Level
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'easy', title: 'Easy', desc: 'Casual novice' },
                { id: 'medium', title: 'Medium', desc: 'Amateur TAG' },
                { id: 'hard', title: 'Hard', desc: 'GTO Strategist' }
              ].map((lvl) => {
                const isSelected = difficulty === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setDifficulty(lvl.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-extrabold text-sm text-white">
                      <span>{lvl.title}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{lvl.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table Size */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              Table Mode
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { size: 2, label: 'Heads-Up (1v1)' },
                { size: 4, label: '4-Max Table' },
                { size: 6, label: '6-Max Table' }
              ].map((t) => {
                const isSelected = tableSize === t.size;
                return (
                  <button
                    key={t.size}
                    type="button"
                    onClick={() => setTableSize(t.size)}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Blinds & Starting Chips */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Blinds (SB / BB)</label>
              <select
                value={`${blinds.sb}/${blinds.bb}`}
                onChange={(e) => {
                  const [sb, bb] = e.target.value.split('/').map(Number);
                  setBlinds({ sb, bb });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-bold focus:border-amber-400"
              >
                <option value="5/10">$5 / $10</option>
                <option value="10/20">$10 / $20</option>
                <option value="25/50">$25 / $50</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                Starting Stack
              </label>
              <select
                value={startingStack}
                onChange={(e) => setStartingStack(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-bold focus:border-amber-400"
              >
                <option value={1000}>$1,000 (100 BB)</option>
                <option value={2000}>$2,000 (200 BB)</option>
                <option value={5000}>$5,000 (500 BB)</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all"
          >
            Start Poker Game
          </button>

        </form>

      </div>
    </div>
  );
}
