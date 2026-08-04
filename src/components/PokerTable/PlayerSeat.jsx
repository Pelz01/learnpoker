import React from 'react';
import CardComponent from './CardComponent';
import { User, Bot } from 'lucide-react';

export default function PlayerSeat({
  player,
  isTurn = false,
  winningCardIds = [],
  showCards = false
}) {
  if (!player) return null;

  const {
    name,
    isHuman,
    chipCount,
    currentBet,
    holeCards,
    isFolded,
    isAllIn,
    position,
    lastAction,
    difficulty
  } = player;

  return (
    <div className={`relative flex flex-col items-center select-none transition-all duration-300 ${isFolded ? 'opacity-40 grayscale' : 'opacity-100'}`}>
      
      {/* Position Badge & Dealer Button */}
      <div className="flex items-center space-x-1 mb-1">
        {position === 'BTN' && (
          <span className="w-5 h-5 rounded-full bg-yellow-400 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-md border border-white">
            D
          </span>
        )}
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900/80 text-amber-300 border border-amber-500/30">
          {position}
        </span>
      </div>

      {/* Hole Cards Stack */}
      <div className="flex items-center -space-x-4 mb-1">
        {holeCards && holeCards.length >= 2 ? (
          <>
            <CardComponent
              card={holeCards[0]}
              hidden={!isHuman && !showCards}
              size="sm"
            />
            <CardComponent
              card={holeCards[1]}
              hidden={!isHuman && !showCards}
              size="sm"
            />
          </>
        ) : (
          <div className="w-12 h-14 rounded-lg border border-dashed border-slate-700 bg-slate-900/50 flex items-center justify-center text-[10px] text-slate-500">
            Cards
          </div>
        )}
      </div>

      {/* Player Avatar & Info Box */}
      <div
        className={`w-28 sm:w-32 rounded-xl p-2 bg-slate-900/90 border shadow-xl flex flex-col items-center space-y-1 backdrop-blur-sm ${
          isTurn
            ? 'border-amber-400 ring-4 ring-amber-400/40 animate-pulse'
            : isFolded
            ? 'border-slate-800'
            : 'border-amber-500/30'
        }`}
      >
        {/* Name & Difficulty */}
        <div className="flex items-center space-x-1 text-xs font-bold text-white max-w-full truncate">
          {isHuman ? (
            <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          ) : (
            <Bot className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          )}
          <span className="truncate">{name}</span>
        </div>

        {/* Difficulty Badge for AI */}
        {!isHuman && difficulty && (
          <span className={`text-[9px] font-extrabold uppercase px-1 rounded ${
            difficulty === 'easy' ? 'bg-blue-500/20 text-blue-300' :
            difficulty === 'hard' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
          }`}>
            {difficulty}
          </span>
        )}

        {/* Chip Stack */}
        <div className="text-[11px] font-extrabold text-amber-300">
          ${chipCount.toLocaleString()}
        </div>

        {/* Current Street Bet Chip Badge */}
        {currentBet > 0 && (
          <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            Bet: ${currentBet}
          </div>
        )}

        {/* Last Action Status Tag */}
        {lastAction && (
          <div className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
            lastAction.includes('FOLD') ? 'bg-rose-900/80 text-rose-200' :
            lastAction.includes('RAISE') ? 'bg-amber-900/80 text-amber-200' :
            lastAction.includes('CHECK') ? 'bg-blue-900/80 text-blue-200' : 'bg-emerald-900/80 text-emerald-200'
          }`}>
            {lastAction}
          </div>
        )}
      </div>

    </div>
  );
}
