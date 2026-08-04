import React, { useState } from 'react';
import { soundEffects } from '../../utils/audioService';

export default function ActionControls({
  onAction,
  amountToCall,
  minRaise,
  maxRaise,
  currentPot,
  playerChipCount,
  canCheck
}) {
  const [raiseAmount, setRaiseAmount] = useState(minRaise || 50);

  const handleSliderChange = (e) => {
    setRaiseAmount(parseInt(e.target.value, 10));
  };

  const handlePreset = (fraction) => {
    let target = Math.round(currentPot * fraction);
    target = Math.max(target, minRaise);
    target = Math.min(target, maxRaise);
    setRaiseAmount(target);
  };

  const executeAction = (actionType, amt = 0) => {
    if (actionType === 'fold') soundEffects.playFold();
    if (actionType === 'check') soundEffects.playCheck();
    if (actionType === 'call' || actionType === 'raise') soundEffects.playChips();
    
    onAction(actionType, amt);
  };

  return (
    <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-md max-w-xl mx-auto space-y-3">
      
      {/* Raise Sizing Presets Bar */}
      {playerChipCount > amountToCall && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold px-1">
            <span>Raise Sizing: <strong className="text-amber-400 font-extrabold">${raiseAmount}</strong></span>
            <span className="text-slate-400">Stack: ${playerChipCount}</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setRaiseAmount(minRaise)}
              className="px-2 py-1 text-[11px] font-bold rounded bg-slate-800 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"
            >
              Min (${minRaise})
            </button>
            <button
              type="button"
              onClick={() => handlePreset(0.5)}
              className="px-2 py-1 text-[11px] font-bold rounded bg-slate-800 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"
            >
              1/2 Pot
            </button>
            <button
              type="button"
              onClick={() => handlePreset(0.75)}
              className="px-2 py-1 text-[11px] font-bold rounded bg-slate-800 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"
            >
              3/4 Pot
            </button>
            <button
              type="button"
              onClick={() => handlePreset(1.0)}
              className="px-2 py-1 text-[11px] font-bold rounded bg-slate-800 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"
            >
              Pot (${currentPot})
            </button>
            <button
              type="button"
              onClick={() => setRaiseAmount(maxRaise)}
              className="px-2 py-1 text-[11px] font-bold rounded bg-rose-950 text-rose-300 border border-rose-500/30 hover:bg-rose-900"
            >
              All-In (${maxRaise})
            </button>
          </div>

          {/* Slider */}
          <input
            type="range"
            min={minRaise}
            max={maxRaise}
            step={10}
            value={Math.min(raiseAmount, maxRaise)}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>
      )}

      {/* Main Action Buttons */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* FOLD */}
        <button
          onClick={() => executeAction('fold')}
          className="py-3 px-2 rounded-xl bg-gradient-to-b from-rose-600 to-rose-800 text-white font-extrabold text-xs sm:text-sm border border-rose-400/40 shadow-lg hover:from-rose-500 hover:to-rose-700 active:scale-95 transition-all"
        >
          FOLD
        </button>

        {/* CHECK / CALL */}
        {canCheck ? (
          <button
            onClick={() => executeAction('check')}
            className="py-3 px-2 rounded-xl bg-gradient-to-b from-blue-600 to-blue-800 text-white font-extrabold text-xs sm:text-sm border border-blue-400/40 shadow-lg hover:from-blue-500 hover:to-blue-700 active:scale-95 transition-all"
          >
            CHECK
          </button>
        ) : (
          <button
            onClick={() => executeAction('call', amountToCall)}
            disabled={playerChipCount < amountToCall}
            className="py-3 px-2 rounded-xl bg-gradient-to-b from-emerald-600 to-emerald-800 text-white font-extrabold text-xs sm:text-sm border border-emerald-400/40 shadow-lg hover:from-emerald-500 hover:to-emerald-700 active:scale-95 transition-all disabled:opacity-50"
          >
            CALL ${amountToCall}
          </button>
        )}

        {/* RAISE */}
        <button
          onClick={() => executeAction('raise', raiseAmount)}
          disabled={playerChipCount <= amountToCall}
          className="py-3 px-2 rounded-xl bg-gradient-to-b from-amber-500 to-yellow-700 text-slate-950 font-extrabold text-xs sm:text-sm border border-yellow-300/40 shadow-lg hover:from-amber-400 hover:to-yellow-600 active:scale-95 transition-all disabled:opacity-50"
        >
          {raiseAmount >= maxRaise ? 'ALL-IN' : `RAISE TO $${raiseAmount}`}
        </button>
      </div>

    </div>
  );
}
