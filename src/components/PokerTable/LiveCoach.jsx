import React, { useState } from 'react';
import { Brain, Sparkles, AlertCircle, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { evaluate7CardHand, simulateEquity, calculateOuts, calculatePotOdds } from '../../utils/pokerEvaluator';

export default function LiveCoach({
  heroCards,
  communityCards,
  numOpponents = 1,
  amountToCall = 0,
  currentPot = 0,
  position = 'BTN',
  isMyTurn = false
}) {
  const [collapsed, setCollapsed] = useState(false);

  if (!heroCards || heroCards.length < 2) {
    return null;
  }

  // Calculate live stats
  const handEval = evaluate7CardHand([...heroCards, ...communityCards]);
  const { winPercent, tiePercent, lossPercent } = simulateEquity(heroCards, communityCards, numOpponents, 400);
  const outsInfo = calculateOuts(heroCards, communityCards);
  const potOddsInfo = calculatePotOdds(amountToCall, currentPot);

  // Generate Coach Recommendation
  let recommendedAction = 'CHECK';
  let coachReason = '';

  if (amountToCall === 0) {
    if (winPercent >= 60) {
      recommendedAction = 'BET / RAISE';
      coachReason = `You hold a strong hand (${handEval.type}) with ${winPercent}% equity. Bet to build the pot and get value from weaker hands!`;
    } else {
      recommendedAction = 'CHECK';
      coachReason = `With ${winPercent}% equity, checking keeps the pot controlled for free while seeing the next card.`;
    }
  } else {
    if (winPercent >= potOddsInfo.requiredEquity + 15) {
      recommendedAction = 'RAISE';
      coachReason = `Your equity (${winPercent}%) significantly exceeds the required pot odds (${potOddsInfo.requiredEquity}%). Raising generates high long-term EV!`;
    } else if (winPercent >= potOddsInfo.requiredEquity) {
      recommendedAction = 'CALL';
      coachReason = `Calling is profitable! Your ${winPercent}% equity beats the ${potOddsInfo.requiredEquity}% pot odds threshold required to call $${amountToCall}.`;
    } else {
      recommendedAction = 'FOLD';
      coachReason = `Fold recommended. You have ${winPercent}% equity, but calling $${amountToCall} requires ${potOddsInfo.requiredEquity}% equity. Calling would be negative EV (-EV).`;
    }
  }

  return (
    <div className="bg-slate-900/95 border border-amber-500/40 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-md space-y-3 transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Brain className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5">
              Live AI Poker Coach
              {isMyTurn && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold animate-bounce">
                  Your Action
                </span>
              )}
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">{handEval.description}</p>
          </div>
        </div>

        <button className="text-slate-400 hover:text-white">
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
          
          {/* Equity Progress Bar */}
          <div>
            <div className="flex justify-between text-[11px] font-bold mb-1">
              <span className="text-emerald-400">Win: {winPercent}%</span>
              <span className="text-amber-300">Tie: {tiePercent}%</span>
              <span className="text-rose-400">Loss: {lossPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
              <div style={{ width: `${winPercent}%` }} className="bg-emerald-500 h-full transition-all duration-500" />
              <div style={{ width: `${tiePercent}%` }} className="bg-amber-400 h-full transition-all duration-500" />
              <div style={{ width: `${lossPercent}%` }} className="bg-rose-500 h-full transition-all duration-500" />
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block font-medium">Pot Odds Required</span>
              <span className="font-extrabold text-amber-300">
                {amountToCall > 0 ? `${potOddsInfo.requiredEquity}% (${potOddsInfo.ratio})` : 'Free Check (0%)'}
              </span>
            </div>

            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block font-medium">Draw Outs</span>
              <span className="font-extrabold text-emerald-400">
                {outsInfo.outsCount > 0 ? `${outsInfo.outsCount} Outs (~${outsInfo.approxEquity}%)` : 'No Active Draws'}
              </span>
            </div>
          </div>

          {/* Coach Tactical Recommendation Box */}
          <div className="bg-gradient-to-r from-amber-950/50 via-slate-900 to-emerald-950/50 border border-amber-500/30 p-2.5 rounded-xl space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Recommended Action:</span>
              <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-extrabold uppercase border border-amber-400/40">
                {recommendedAction}
              </span>
            </div>
            <p className="text-slate-300 leading-snug text-[11px]">
              {coachReason}
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
