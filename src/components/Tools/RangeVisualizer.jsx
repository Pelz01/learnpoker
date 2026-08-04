import React, { useState } from 'react';
import { Grid, Eye } from 'lucide-react';

export default function RangeVisualizer() {
  const [selectedPos, setSelectedPos] = useState('BTN');

  const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

  // Preset ranges by position
  const presetRanges = {
    UTG: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', 'AKs', 'AQs', 'AJs', 'KQs', 'AKo'],
    MP: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', 'AKs', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'AKo', 'AQo'],
    CO: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22', 'AKs', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'T9s', '98s', '87s', '76s', 'AKo', 'AQo', 'AJo'],
    BTN: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'QJs', 'QTs', 'JTs', 'T9s', '98s', '87s', '76s', '65s', '54s', 'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo', 'QJo']
  };

  const activeHandSet = new Set(presetRanges[selectedPos] || presetRanges.BTN);

  const getHandCombo = (r1, r2, row, col) => {
    if (row === col) return `${r1}${r2}`; // Pair (diagonal)
    if (row < col) return `${r1}${r2}s`; // Suited (upper right)
    return `${r2}${r1}o`; // Offsuit (lower left)
  };

  return (
    <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-4 sm:p-8 shadow-2xl space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Grid className="w-5 h-5 text-amber-400" />
            13x13 Interactive Pre-Flop Starting Range Matrix
          </h2>
          <p className="text-xs text-slate-400">Visualize opening hand ranges by position (169 unique combinations)</p>
        </div>

        {/* Position Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {['UTG', 'MP', 'CO', 'BTN'].map((pos) => (
            <button
              key={pos}
              onClick={() => setSelectedPos(pos)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedPos === pos
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-cols-13 gap-1 min-w-[500px]">
          {ranks.map((r1, row) =>
            ranks.map((r2, col) => {
              const combo = getHandCombo(r1, r2, row, col);
              const inRange = activeHandSet.has(combo);
              const isPair = row === col;
              const isSuited = row < col;

              return (
                <div
                  key={`${row}-${col}`}
                  className={`h-8 sm:h-10 rounded flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all select-none ${
                    inRange
                      ? isPair
                        ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                        : isSuited
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-blue-500 text-white font-bold'
                      : 'bg-slate-950 text-slate-600 border border-slate-800'
                  }`}
                  title={combo}
                >
                  {combo}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-slate-300 pt-2 border-t border-slate-800">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-400 inline-block" /> Pocket Pairs
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Suited Combos (s)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-500 inline-block" /> Offsuit Combos (o)
          </span>
        </div>

        <span className="text-amber-400 font-extrabold">
          {selectedPos} Opening Range: ~{Math.round((activeHandSet.size / 169) * 100)}% of hands
        </span>
      </div>

    </div>
  );
}
