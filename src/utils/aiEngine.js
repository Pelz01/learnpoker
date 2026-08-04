// AI Decision Engine for Easy, Medium, and Hard Poker Bots

import { evaluate7CardHand, simulateEquity, calculatePotOdds } from './pokerEvaluator.js';

export function makeAiDecision({
  bot,
  gameState,
  difficulty = 'medium'
}) {
  const {
    holeCards,
    chipCount,
    currentBet: botCurrentBet,
    position
  } = bot;

  const {
    communityCards,
    currentPot,
    highestBet,
    minRaise,
    activePlayers,
    bigBlind,
    dealerIdx,
    currentStreet // 'preflop', 'flop', 'turn', 'river'
  } = gameState;

  const amountToCall = highestBet - botCurrentBet;

  if (difficulty === 'easy') {
    return easyBotStrategy({ holeCards, communityCards, currentPot, amountToCall, minRaise, chipCount, currentStreet });
  } else if (difficulty === 'hard') {
    return hardBotStrategy({ holeCards, communityCards, currentPot, amountToCall, minRaise, chipCount, currentStreet, position, activePlayers, highestBet, bigBlind, botCurrentBet });
  } else {
    return mediumBotStrategy({ holeCards, communityCards, currentPot, amountToCall, minRaise, chipCount, currentStreet, position, highestBet, bigBlind });
  }
}

// // ---------------- EASY BOT ----------------
function easyBotStrategy({ holeCards, communityCards, currentPot, amountToCall, minRaise, chipCount, currentStreet }) {
  // Preflop
  if (currentStreet === 'preflop') {
    const isPair = holeCards[0].rank === holeCards[1].rank;
    const isHighCard = holeCards[0].rank >= 10 || holeCards[1].rank >= 10;
    
    // Easy bot calls 70% of the time, raises only top pairs
    if (isPair && holeCards[0].rank >= 10 && amountToCall <= chipCount) {
      const raiseAmt = Math.round(Math.min(amountToCall + minRaise, chipCount));
      return { action: 'raise', amount: raiseAmt, reason: 'Easy bot holding high pair' };
    }
    if ((isPair || isHighCard || Math.random() < 0.4) && amountToCall <= chipCount) {
      if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Easy bot checking preflop' };
      return { action: 'call', amount: Math.round(amountToCall), reason: 'Easy bot calling preflop' };
    }
    if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Easy bot checking' };
    return { action: 'fold', amount: 0, reason: 'Easy bot folding weak hand' };
  }

  // Postflop
  const handEval = evaluate7CardHand([...holeCards, ...communityCards]);
  
  if (handEval.categoryRank >= 2) { // Two Pair or better
    if (Math.random() < 0.6 && amountToCall <= chipCount) {
      const raiseAmt = Math.round(Math.min(amountToCall + minRaise, chipCount));
      return { action: 'raise', amount: raiseAmt, reason: `Easy bot raising strong hand (${handEval.type})` };
    }
  }
  
  if (handEval.categoryRank >= 1 || Math.random() < 0.35) { // One Pair or high card curiosity
    if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Easy bot checking pair' };
    if (amountToCall <= chipCount * 0.4) return { action: 'call', amount: Math.round(amountToCall), reason: 'Easy bot calling postflop' };
  }

  if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Easy bot checking free card' };
  return { action: 'fold', amount: 0, reason: 'Easy bot folding to bet' };
}

// ---------------- MEDIUM BOT ----------------
function mediumBotStrategy({ holeCards, communityCards, currentPot, amountToCall, minRaise, chipCount, currentStreet, position, highestBet, bigBlind }) {
  if (currentStreet === 'preflop') {
    const r1 = holeCards[0].rank;
    const r2 = holeCards[1].rank;
    const isPair = r1 === r2;
    const maxRank = Math.max(r1, r2);
    const minRank = Math.min(r1, r2);
    const isSuited = holeCards[0].suit === holeCards[1].suit;

    // Tight in early position, wider in late position
    let isPlayable = isPair || maxRank >= 12 || (maxRank >= 10 && isSuited) || (maxRank >= 11 && minRank >= 9);
    if (position === 'BTN' || position === 'CO') {
      isPlayable = isPlayable || maxRank >= 9 || isSuited;
    }

    if (isPair && maxRank >= 10) {
      const raiseAmt = Math.round(Math.min(Math.max(highestBet * 2.5, minRaise), chipCount));
      return { action: 'raise', amount: raiseAmt, reason: `Medium bot open-raising strong preflop pair (${r1}'s)` };
    }

    if (isPlayable) {
      if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Medium bot checking playable hand' };
      if (amountToCall <= bigBlind * 4) return { action: 'call', amount: Math.round(amountToCall), reason: 'Medium bot calling standard raise' };
    }

    if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Medium bot checking' };
    return { action: 'fold', amount: 0, reason: 'Medium bot folding unplayable preflop hand' };
  }

  // Postflop equity simulation
  const { winPercent } = simulateEquity(holeCards, communityCards, 1, 300);
  const { requiredEquity } = calculatePotOdds(amountToCall, currentPot);

  // Strong hand (Equity >= 65%)
  if (winPercent >= 65) {
    const betSize = Math.round(Math.min(currentPot * 0.6, chipCount));
    if (betSize > amountToCall && chipCount > amountToCall) {
      const raiseAmt = Math.round(Math.min(Math.max(amountToCall + minRaise, betSize), chipCount));
      return { action: 'raise', amount: raiseAmt, reason: `Medium bot value-raising with ${winPercent}% equity` };
    }
    if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Medium bot checking strong hand' };
    return { action: 'call', amount: Math.round(amountToCall), reason: `Medium bot calling with ${winPercent}% equity` };
  }

  // Decent hand / Draw (Equity >= Pot Odds Required)
  if (winPercent >= requiredEquity || winPercent >= 40) {
    if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Medium bot checking' };
    if (amountToCall <= chipCount) return { action: 'call', amount: Math.round(amountToCall), reason: `Medium bot calling: equity (${winPercent}%) meets pot odds (${requiredEquity}%)` };
  }

  if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Medium bot checking option' };
  return { action: 'fold', amount: 0, reason: `Medium bot folding: equity (${winPercent}%) below pot odds (${requiredEquity}%)` };
}

// ---------------- HARD BOT (BALANCED GTO STRATEGIST) ----------------
function hardBotStrategy({ holeCards, communityCards, currentPot, amountToCall, minRaise, chipCount, currentStreet, position, activePlayers, highestBet, bigBlind, botCurrentBet = 0 }) {
  const numOpponents = Math.max(activePlayers.length - 1, 1);
  const { winPercent, tiePercent } = simulateEquity(holeCards, communityCards, numOpponents, 500);
  const totalEquity = winPercent + (tiePercent * 0.5);
  const { requiredEquity } = calculatePotOdds(amountToCall, currentPot);

  // Preflop Strategy
  if (currentStreet === 'preflop') {
    const r1 = holeCards[0].rank;
    const r2 = holeCards[1].rank;
    const isPair = r1 === r2;
    const maxRank = Math.max(r1, r2);
    const minRank = Math.min(r1, r2);
    const isSuited = holeCards[0].suit === holeCards[1].suit;

    // Premium hands: AA, KK, QQ, JJ, TT, AK, AQ
    const isPremium = (isPair && r1 >= 10) || (maxRank === 14 && minRank >= 12);
    if (isPremium) {
      const raiseSizing = Math.round(Math.min(Math.max(bigBlind * 2.5, highestBet * 2.2, minRaise), chipCount + (botCurrentBet || 0)));
      if (raiseSizing > highestBet) {
        return { action: 'raise', amount: raiseSizing, reason: 'Hard AI raising premium preflop hand' };
      }
      return { action: 'call', amount: Math.round(amountToCall), reason: 'Hard AI calling preflop with premium' };
    }

    // Positional Open Ranges
    let inOpeningRange = false;
    if (position === 'BTN' || position === 'CO') {
      inOpeningRange = isPair || maxRank >= 10 || (isSuited && maxRank >= 8) || (minRank >= 9);
    } else if (position === 'MP') {
      inOpeningRange = isPair || maxRank >= 11 || (isSuited && maxRank >= 10);
    } else { // UTG / Blinds
      inOpeningRange = isPair || maxRank >= 12 || (isSuited && maxRank >= 11);
    }

    if (inOpeningRange) {
      if (highestBet <= bigBlind) {
        const raiseSizing = Math.round(Math.min(Math.max(bigBlind * 2.2, minRaise), chipCount));
        return { action: 'raise', amount: raiseSizing, reason: `Hard AI opening ${position} range` };
      }
      if (amountToCall <= bigBlind * 3) {
        return { action: 'call', amount: Math.round(amountToCall), reason: 'Hard AI calling standard preflop open' };
      }
    }

    if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Hard AI checking option' };
    return { action: 'fold', amount: 0, reason: 'Hard AI folding weak preflop hand' };
  }

  // Postflop Strategy
  // 1. FREE TO ACT (amountToCall === 0)
  if (amountToCall === 0) {
    // Monster hand (Equity >= 75%) -> Value Bet 0.55x Pot
    if (totalEquity >= 75) {
      const betSize = Math.round(Math.min(Math.max(currentPot * 0.55, minRaise), chipCount));
      if (betSize > 0) return { action: 'raise', amount: betSize, reason: `Hard AI value betting monster (${totalEquity.toFixed(0)}% equity)` };
    }
    // Good hand (Equity >= 55%) -> Continuation bet 0.4x pot or check
    if (totalEquity >= 55) {
      if (Math.random() < 0.65) {
        const cBet = Math.round(Math.min(Math.max(currentPot * 0.4, minRaise), chipCount));
        if (cBet > 0) return { action: 'raise', amount: cBet, reason: `Hard AI continuation betting (${totalEquity.toFixed(0)}% equity)` };
      }
      return { action: 'check', amount: 0, reason: 'Hard AI checking solid hand' };
    }
    // Semi-bluff with draw (Equity >= 40%) -> 30% chance to semi-bluff raise
    if (totalEquity >= 40 && Math.random() < 0.3) {
      const bluffAmt = Math.round(Math.min(Math.max(currentPot * 0.45, minRaise), chipCount));
      if (bluffAmt > 0) return { action: 'raise', amount: bluffAmt, reason: 'Hard AI semi-bluffing strong draw' };
    }
    return { action: 'check', amount: 0, reason: 'Hard AI checking free card' };
  }

  // 2. FACING A BET (amountToCall > 0)
  // Fold to large over-bets if equity is mediocre
  if (amountToCall > bigBlind * 4 && totalEquity < 50) {
    return { action: 'fold', amount: 0, reason: `Hard AI folding to heavy bet (${totalEquity.toFixed(0)}% equity)` };
  }

  // Monster hand (Equity >= 75%) -> Raise/Re-raise for value!
  if (totalEquity >= 75) {
    const raiseAmt = Math.round(Math.min(Math.max(amountToCall + minRaise, currentPot * 0.6), chipCount));
    if (raiseAmt > amountToCall && chipCount > amountToCall) {
      return { action: 'raise', amount: raiseAmt, reason: `Hard AI re-raising monster (${totalEquity.toFixed(0)}% equity)` };
    }
    return { action: 'call', amount: Math.round(amountToCall), reason: `Hard AI calling with monster (${totalEquity.toFixed(0)}% equity)` };
  }

  // Strong hand or EV positive call (Total Equity >= Pot Odds Required)
  if (totalEquity >= requiredEquity || totalEquity >= 48) {
    if (amountToCall <= chipCount) {
      return { action: 'call', amount: Math.round(amountToCall), reason: `Hard AI calling: ${totalEquity.toFixed(0)}% equity meets pot odds (${requiredEquity}%)` };
    }
  }

  return { action: 'fold', amount: 0, reason: `Hard AI folding: ${totalEquity.toFixed(0)}% equity below required odds (${requiredEquity}%)` };
}
