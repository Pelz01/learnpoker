import React, { useState } from 'react';
import { Calculator, Sparkles, RefreshCw } from 'lucide-react';
import CardComponent from '../PokerTable/CardComponent';
import { simulateEquity, RANKS, SUITS } from '../../utils/pokerEvaluator';

export default function EquityCalculator() {
  const [hand1, setHand1] = useState(['A♠', 'K♠']);
  const [hand2, setHand2] = useState(['Q♥', 'Q♦']);
  const [board, setBoard] = useState([]);
  const [results, setResults] = useState(null);

  const calculate = () => {
    const heroEquity = simulateEquity(hand1, board, 1, 800);
    const oppEquity = simulateEquity(hand2, board, 1, 800);
    setResults({ heroEquity, oppEquity });
  };

  return (
    <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-4 sm:p-8 shadow-2xl space-y-6 max-w-4xl mx-auto">
      
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-amber-400" />
          Live Hand Equity & Odds Calculator
        </h2>
        <p className="text-xs text-slate-400">Simulate exact win/tie/loss percentages between any 2 hands on any board street</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Hand 1 */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/20 space-y-3">
          <span className="text-xs font-bold text-amber-300">Player 1 (Hero)</span>
          <div className="flex space-x-2">
            <CardComponent card={hand1[0]} size="md" />
            <CardComponent card={hand1[1]} size="md" />
          </div>
          {results && (
            <div className="text-xs font-extrabold text-emerald-400">
              Win Rate: {results.heroEquity.winPercent}% (Tie: {results.heroEquity.tiePercent}%)
            </div>
          )}
        </div>

        {/* Hand 2 */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/20 space-y-3">
          <span className="text-xs font-bold text-amber-300">Player 2 (Opponent)</span>
          <div className="flex space-x-2">
            <CardComponent card={hand2[0]} size="md" />
            <CardComponent card={hand2[1]} size="md" />
          </div>
          {results && (
            <div className="text-xs font-extrabold text-rose-400">
              Win Rate: {results.oppEquity.winPercent}% (Tie: {results.oppEquity.tiePercent}%)
            </div>
          )}
        </div>

      </div>

      {/* Calculate Button */}
      <button
        onClick={calculate}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest shadow-lg hover:brightness-110"
      >
        Run Monte Carlo Equity Simulation ♠
      </button>

    </div>
  );
}
