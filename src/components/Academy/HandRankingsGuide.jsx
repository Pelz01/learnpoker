import React, { useState } from 'react';
import CardComponent from '../PokerTable/CardComponent';
import { HAND_TYPES } from '../../utils/pokerEvaluator';

export default function HandRankingsGuide() {
  const [selectedRank, setSelectedRank] = useState('ROYAL_FLUSH');

  const rankData = [
    {
      key: 'ROYAL_FLUSH',
      name: '1. Royal Flush',
      cards: ['A♠', 'K♠', 'Q♠', 'J♠', '10♠'],
      desc: 'The ultimate unbeatable poker hand. A, K, Q, J, 10 all of the exact same suit.',
      probability: '1 in 649,740 hands (0.000154%)'
    },
    {
      key: 'STRAIGHT_FLUSH',
      name: '2. Straight Flush',
      cards: ['9♥', '8♥', '7♥', '6♥', '5♥'],
      desc: 'Five consecutive cards of the exact same suit.',
      probability: '1 in 72,193 hands (0.00139%)'
    },
    {
      key: 'FOUR_OF_A_KIND',
      name: '3. Four of a Kind',
      cards: ['K♠', 'K♦', 'K♣', 'K♥', '3♦'],
      desc: 'Four cards of identical numerical rank.',
      probability: '1 in 4,165 hands (0.024%)'
    },
    {
      key: 'FULL_HOUSE',
      name: '4. Full House',
      cards: ['J♠', 'J♦', 'J♣', '8♥', '8♠'],
      desc: 'Three cards of one rank + two cards of another rank ("Jacks full of Eights").',
      probability: '1 in 694 hands (0.144%)'
    },
    {
      key: 'FLUSH',
      name: '5. Flush',
      cards: ['A♦', 'Q♦', '10♦', '7♦', '4♦'],
      desc: 'Any five cards of the same suit, regardless of rank order.',
      probability: '1 in 508 hands (0.197%)'
    },
    {
      key: 'STRAIGHT',
      name: '6. Straight',
      cards: ['8♣', '7♥', '6♦', '5♠', '4♣'],
      desc: 'Five consecutive numerical cards of mixed suits.',
      probability: '1 in 254 hands (0.39%)'
    },
    {
      key: 'THREE_OF_A_KIND',
      name: '7. Three of a Kind',
      cards: ['7♠', '7♦', '7♣', 'Q♥', '2♠'],
      desc: 'Three cards of the same rank (Trips or Set).',
      probability: '1 in 47 hands (2.11%)'
    },
    {
      key: 'TWO_PAIR',
      name: '8. Two Pair',
      cards: ['10♠', '10♦', '4♣', '4♥', 'A♠'],
      desc: 'Two distinct pairs of matching cards.',
      probability: '1 in 21 hands (4.75%)'
    },
    {
      key: 'ONE_PAIR',
      name: '9. One Pair',
      cards: ['A♠', 'A♦', '9♣', '5♥', '2♦'],
      desc: 'Two cards of identical rank + 3 kickers.',
      probability: '1 in 2.37 hands (42.2%)'
    },
    {
      key: 'HIGH_CARD',
      name: '10. High Card',
      cards: ['A♠', 'J♦', '8♣', '5♥', '2♦'],
      desc: 'No pair or combination made. Highest card determines rank.',
      probability: '1 in 2 hands (50.1%)'
    }
  ];

  const current = rankData.find(r => r.key === selectedRank) || rankData[0];

  return (
    <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
      
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
          <span>👑</span> Interactive Hand Ranking Chart
        </h3>
        <p className="text-xs text-slate-400">Click any hand ranking to view visual cards and odds</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left List */}
        <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
          {rankData.map((item) => {
            const isSelected = selectedRank === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setSelectedRank(item.key)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner'
                    : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Right Visualizer */}
        <div className="md:col-span-2 bg-slate-950 border border-amber-500/20 rounded-2xl p-4 sm:p-6 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-base font-black text-amber-300 mb-1">{current.name}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{current.desc}</p>
          </div>

          {/* Cards Row */}
          <div className="flex items-center justify-center space-x-2 py-4 bg-slate-900/60 rounded-xl border border-slate-800">
            {current.cards.map((c, i) => (
              <CardComponent key={i} card={c} size="lg" />
            ))}
          </div>

          {/* Odds Badge */}
          <div className="flex items-center justify-between text-xs bg-slate-900 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-medium">Statistical Frequency:</span>
            <span className="font-extrabold text-emerald-400">{current.probability}</span>
          </div>

        </div>

      </div>

    </div>
  );
}
