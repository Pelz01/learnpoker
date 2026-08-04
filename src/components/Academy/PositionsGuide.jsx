import React, { useState } from 'react';
import { MapPin, ShieldAlert, Zap, Target } from 'lucide-react';

export default function PositionsGuide() {
  const [activePos, setActivePos] = useState('BTN');

  const positions = [
    {
      code: 'UTG',
      name: 'Under The Gun',
      category: 'Early Position',
      range: 'Top ~15% of hands',
      preflopOrder: '1st to act (Pre-flop)',
      postflopOrder: '3rd/4th to act',
      strategy: 'Play very tight! Since 5 players act behind you, you face high risk of encountering a higher hand or raise behind you. Only raise premium hands (77+, AK, AQ).',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    {
      code: 'MP',
      name: 'Middle Position',
      category: 'Middle Position',
      range: 'Top ~22% of hands',
      preflopOrder: '2nd to act (Pre-flop)',
      postflopOrder: '3rd to act',
      strategy: 'Slightly wider than UTG, but still cautious. Can open medium pairs (55+) and strong suited connectors (KJs, QJs).',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      code: 'CO',
      name: 'Cutoff',
      category: 'Late Position',
      range: 'Top ~32% of hands',
      preflopOrder: '3rd to act (Pre-flop)',
      postflopOrder: '2nd to act (In position unless BTN calls)',
      strategy: 'High-value stealing position! Only the Button acts after you in late position. Raise aggressively to steal blinds.',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
    {
      code: 'BTN',
      name: 'Dealer Button',
      category: 'The Best Position!',
      range: 'Top ~48% of hands',
      preflopOrder: '4th to act (Pre-flop)',
      postflopOrder: 'LAST to act on ALL post-flop streets!',
      strategy: 'The most profitable seat at the table! Acting last gives you complete information control, bluffing leverage, and pot-sizing power.',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-black'
    },
    {
      code: 'SB',
      name: 'Small Blind',
      category: 'Out of Position',
      range: 'Top ~35% of hands',
      preflopOrder: '5th to act (Pre-flop)',
      postflopOrder: '1st to act (Post-flop)',
      strategy: 'Tricky position. You get a slight discount pre-flop, but you act FIRST on every street after the flop, making post-flop play difficult.',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    {
      code: 'BB',
      name: 'Big Blind',
      category: 'Defending Position',
      range: 'Defends ~55% of hands',
      preflopOrder: 'Last to act (Pre-flop)',
      postflopOrder: '2nd to act (Post-flop)',
      strategy: 'You already put 1 BB in the pot, giving you great pot odds to defend against single raises. However, you are out of position post-flop against late position raisers.',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    }
  ];

  const current = positions.find(p => p.code === activePos) || positions[3];

  return (
    <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
      
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-400" />
          Interactive 6-Max Table Geography & Positions
        </h3>
        <p className="text-xs text-slate-400">Click any seat on the felt table to inspect positional strategy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Table Felt Visualizer */}
        <div className="relative w-full aspect-[4/3] rounded-[60px] bg-gradient-to-b from-emerald-900 to-slate-950 border-8 border-amber-950 shadow-inner p-6 flex flex-col justify-between items-center">
          
          {/* Top Row: UTG & MP */}
          <div className="w-full flex justify-between px-6">
            {['UTG', 'MP'].map(code => (
              <button
                key={code}
                onClick={() => setActivePos(code)}
                className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                  activePos === code
                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/40 scale-110'
                    : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-amber-400'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          {/* Center Felt Text */}
          <div className="text-center space-y-1">
            <span className="text-xs font-extrabold text-amber-300 uppercase tracking-widest block">DEALER TABLE</span>
            <span className="text-[10px] text-slate-400 font-medium">Clockwise Action Direction ↻</span>
          </div>

          {/* Middle Row: CO & BB */}
          <div className="w-full flex justify-between px-2">
            <button
              onClick={() => setActivePos('BB')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                activePos === 'BB'
                  ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/40 scale-110'
                  : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-amber-400'
              }`}
            >
              BB
            </button>
            <button
              onClick={() => setActivePos('CO')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                activePos === 'CO'
                  ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/40 scale-110'
                  : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-amber-400'
              }`}
            >
              CO
            </button>
          </div>

          {/* Bottom Row: SB & BTN */}
          <div className="w-full flex justify-between px-6">
            {['SB', 'BTN'].map(code => (
              <button
                key={code}
                onClick={() => setActivePos(code)}
                className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                  activePos === code
                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/40 scale-110'
                    : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-amber-400'
                }`}
              >
                {code} {code === 'BTN' && 'Dealer ♠'}
              </button>
            ))}
          </div>

        </div>

        {/* Position Details Card */}
        <div className="bg-slate-950 border border-amber-500/20 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-black text-white">{current.name} ({current.code})</h4>
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border inline-block mt-1 ${current.badgeColor}`}>
                {current.category}
              </span>
            </div>
            <span className="text-2xl font-black text-amber-400">#{activePos}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400 font-medium">Opening Range:</span>
              <span className="font-bold text-emerald-400">{current.range}</span>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400 font-medium">Pre-flop Action Order:</span>
              <span className="font-bold text-amber-300">{current.preflopOrder}</span>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400 font-medium">Post-flop Action Order:</span>
              <span className="font-bold text-slate-200">{current.postflopOrder}</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 p-3 rounded-xl">
            <span className="text-xs font-bold text-amber-300 block mb-1">Tactical Strategy Advice:</span>
            <p className="text-xs text-slate-300 leading-relaxed">{current.strategy}</p>
          </div>

        </div>

      </div>

    </div>
  );
}
