import React from 'react';

// Authentic Standard Playing Card Component using real asset images
export default function CardComponent({ card, hidden = false, size = 'md', isWinner = false, label = '' }) {
  // Size dimensions - only dictating width. Height scales automatically (aspect ratio ~ 2.5:3.5)
  let widthClass = 'w-14 sm:w-16';
  if (size === 'sm') widthClass = 'w-10 sm:w-12';
  if (size === 'lg') widthClass = 'w-20 sm:w-24';

  if (hidden || !card) {
    return (
      <div
        className={`relative flex items-center justify-center transition-all duration-300 select-none ${widthClass} drop-shadow-lg`}
      >
        <img 
          src="/cards/back-blue.png" 
          alt="Card Back" 
          className="w-full h-auto object-contain rounded-md" 
          draggable="false" 
        />
      </div>
    );
  }

  // Parse card string: e.g. "As", "10h", "Kd", "7c", "A♠", "10♥", "K♦", "7♣"
  const cardStr = typeof card === 'string' ? card : (card.id || `${card.label}${card.suit}`);
  const suitChar = cardStr.slice(-1);
  const rankStr = cardStr.slice(0, -1).toUpperCase();

  const suitMap = {
    s: 'spade',
    h: 'heart',
    d: 'diamond',
    c: 'club',
    '♠': 'spade',
    '♥': 'heart',
    '♦': 'diamond',
    '♣': 'club'
  };

  const rankMap = {
    A: '1',
    J: 'jack',
    Q: 'queen',
    K: 'king'
  };

  const suitName = suitMap[suitChar.toLowerCase()] || suitMap[suitChar] || 'spade';
  const rankName = rankMap[rankStr] || rankStr;

  const imgSrc = `/cards/${suitName}_${rankName}.png`;

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none transition-all duration-200 ${
        isWinner
          ? 'scale-110 z-20 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]'
          : 'hover:-translate-y-1 drop-shadow-md'
      } ${widthClass}`}
    >
      <img 
        src={imgSrc} 
        alt={cardStr} 
        className={`w-full h-auto object-contain rounded-md ${isWinner ? 'ring-2 ring-amber-400 rounded-lg' : ''}`} 
        draggable="false" 
      />
      
      {/* Winning/Hand Label Tag */}
      {label && (
        <div className="absolute -bottom-3 inset-x-0 flex justify-center z-30 pointer-events-none">
          <span className="text-[10px] bg-slate-900 text-amber-300 px-2 py-0.5 rounded font-extrabold border border-amber-500/40 shadow whitespace-nowrap">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
