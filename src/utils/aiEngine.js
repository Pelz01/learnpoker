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
    return hardBotStrategy({ holeCards, communityCards, currentPot, amountToCall, minRaise, chipCount, currentStreet, position, activePlayers, highestBet, bigBlind });
  } else {
    return mediumBotStrategy({ holeCards, communityCards, currentPot, amountToCall, minRaise, chipCount, currentStreet, position, highestBet, bigBlind });
  }
}

// ---------------- EASY BOT ----------------
function easyBotStrategy({ holeCards, communityCards, currentPot, amountToCall, minRaise, chipCount, currentStreet }) {
  // Preflop
  if (currentStreet === 'preflop') {
    const isPair = holeCards[0].rank === holeCards[1].rank;
    const isHighCard = holeCards[0].rank >= 10 || holeCards[1].rank >= 10;
    
    // Easy bot calls 70% of the time, raises only top pairs
    if (isPair && holeCards[0].rank >= 10 && amountToCall <= chipCount) {
      const raiseAmt = Math.min(amountToCall + minRaise, chipCount);
      return { action: 'raise', amount: raiseAmt, reason: 'Easy bot holding high pair' };
    }
    if ((isPair || isHighCard || Math.random() < 0.4) && amountToCall <= chipCount) {
      if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Easy bot checking preflop' };
      return { action: 'call', amount: amountToCall, reason: 'Easy bot calling preflop' };
    }
    if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Easy bot checking' };
    return { action: 'fold', amount: 0, reason: 'Easy bot folding weak hand' };
  }

  // Postflop
  const handEval = evaluate7CardHand([...holeCards, ...communityCards]);
  
  if (handEval.categoryRank >= 2) { // Two Pair or better
    if (Math.random() < 0.6 && amountToCall <= chipCount) {
      const raiseAmt = Math.min(amountToCall + minRaise, chipCount);
      return { action: 'raise', amount: raiseAmt, reason: `Easy bot raising strong hand (${handEval.type})` };
    }
  }
  
  if (handEval.categoryRank >= 1 || Math.random() < 0.35) { // One Pair or high card curiosity
    if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Easy bot checking pair' };
    if (amountToCall <= chipCount * 0.4) return { action: 'call', amount: amountToCall, reason: 'Easy bot calling postflop' };
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
      const raiseAmt = Math.min(Math.max(highestBet * 2.5, minRaise), chipCount);
      return { action: 'raise', amount: raiseAmt, reason: `Medium bot open-raising strong preflop pair (${r1}'s)` };
    }

    if (isPlayable) {
      if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Medium bot checking playable hand' };
      if (amountToCall <= bigBlind * 4) return { action: 'call', amount: amountToCall, reason: 'Medium bot calling standard raise' };
    }

    if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Medium bot checking' };
    return { action: 'fold', amount: 0, reason: 'Medium bot folding unplayable preflop hand' };
  }

  // Postflop equity simulation
  const { winPercent } = simulateEquity(holeCards, communityCards, 1, 300);
  const { requiredEquity } = calculatePotOdds(amountToCall, currentPot);

  // Strong hand (Equity >= 65%)
  if (winPercent >= 65) {
    const betSize = Math.min(Math.round(currentPot * 0.6), chipCount);
    if (betSize > amountToCall && chipCount > amountToCall) {
      const raiseAmt = Math.min(Math.max(amountToCall + minRaise, betSize), chipCount);
      return { action: 'raise', amount: raiseAmt, reason: `Medium bot value-raising with ${winPercent}% equity` };
    }
    if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Medium bot checking strong hand' };
    return { action: 'call', amount: amountToCall, reason: `Medium bot calling with ${winPercent}% equity` };
  }

  // Decent hand / Draw (Equity >= Pot Odds Required)
  if (winPercent >= requiredEquity || winPercent >= 40) {
    if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Medium bot checking' };
    if (amountToCall <= chipCount) return { action: 'call', amount: amountToCall, reason: `Medium bot calling: equity (${winPercent}%) meets pot odds (${requiredEquity}%)` };
  }

  if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Medium bot checking option' };
  return { action: 'fold', amount: 0, reason: `Medium bot folding: equity (${winPercent}%) below pot odds (${requiredEquity}%)` };
}

// ---------------- HARD BOT (BALANCED GTO STRATEGIST) ----------------
function hardBotStrategy({ holeCards, communityCards, currentPot, amountToCall, minRaise, chipCount, currentStreet, position, activePlayers, highestBet, bigBlind }) {
  const numOpponents = Math.max(activePlayers.length - 1, 1);
  const { winPercent, tiePercent } = simulateEquity(holeCards, communityCards, numOpponents, 400);
  const totalEquity = winPercent + (tiePercent * 0.5);
  const { requiredEquity } = calculatePotOdds(amountToCall, currentPot);

  // Preflop Strategy
  if (currentStreet === 'preflop') {
    const r1 = holeCards[0].rank;
    const r2 = holeCards[1].rank;
    const isPair = r1 === r2;
    const maxRank = Math.max(r1, r2);
    const isSuited = holeCards[0].suit === holeCards[1].suit;

    // Premium hands: AA, KK, QQ, JJ, AK
    const isPremium = (isPair && r1 >= 11) || (maxRank === 14 && Math.min(r1, r2) >= 13);
    if (isPremium) {
      const raiseSizing = Math.min(Math.max(bigBlind * 2.5, highestBet * 2.2, minRaise), chipCount);
      return { action: 'raise', amount: raiseSizing, reason: 'Hard AI raising strong preflop range' };
    }

    // Positional Open Ranges
    let inOpeningRange = false;
    if (position === 'BTN' || position === 'CO') {
      inOpeningRange = isPair || maxRank >= 10 || (isSuited && maxRank >= 8);
    } else if (position === 'MP') {
      inOpeningRange = isPair || maxRank >= 11 || (isSuited && maxRank >= 10);
    } else { // UTG / Blinds
      inOpeningRange = isPair || maxRank >= 12 || (isSuited && maxRank >= 11);
    }

    if (inOpeningRange) {
      if (highestBet <= bigBlind) {
        const raiseSizing = Math.min(Math.max(bigBlind * 2.2, minRaise), chipCount);
        return { action: 'raise', amount: raiseSizing, reason: `Hard AI opening ${position} range` };
      }
      if (amountToCall <= bigBlind * 3) {
        return { action: 'call', amount: amountToCall, reason: 'Hard AI defending position' };
      }
    }

    if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Hard AI checking option' };
    return { action: 'fold', amount: 0, reason: 'Hard AI folding preflop' };
  }

  // Postflop Strategy
  // If facing a big bet with medium equity, hard bot respects bets & folds
  if (amountToCall > bigBlind * 3.5 && totalEquity < 55) {
    return { action: 'fold', amount: 0, reason: `Hard AI folding to strong bet (${totalEquity.toFixed(0)}% equity)` };
  }

  // 1. Monster Hand (Total Equity >= 70%)
  if (totalEquity >= 70) {
    const betSize = Math.min(Math.round(currentPot * 0.5), chipCount);
    const raiseAmt = Math.min(Math.max(amountToCall + minRaise, betSize), chipCount);
    return { action: 'raise', amount: raiseAmt, reason: `Hard AI value-betting monster hand (${totalEquity.toFixed(0)}% equity)` };
  }

  // 2. Strong Hand (Equity 50% - 69%)
  if (totalEquity >= 50) {
    if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Hard AI checking solid hand' };
    if (amountToCall <= chipCount) return { action: 'call', amount: amountToCall, reason: 'Hard AI calling with positive EV' };
  }

  // 3. Draw / Semi-Bluff (Equity >= Pot Odds Required)
  if (totalEquity >= requiredEquity && amountToCall <= chipCount) {
    return { action: 'call', amount: amountToCall, reason: `Hard AI calling: ${totalEquity.toFixed(0)}% equity vs ${requiredEquity}% pot odds` };
  }

  if (amountToCall === 0) return { action: 'check', amount: 0, reason: 'Hard AI checking option' };
  return { action: 'fold', amount: 0, reason: `Hard AI folding: ${totalEquity.toFixed(0)}% equity insufficient` };
}
