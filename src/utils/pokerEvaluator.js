// Texas Hold'em 7-Card Hand Evaluator, Monte Carlo Equity Simulator & Outs Calculator

export const SUITS = [
  { symbol: '♠', name: 'spades', code: 's', color: 'black' },
  { symbol: '♥', name: 'hearts', code: 'h', color: 'red' },
  { symbol: '♦', name: 'diamonds', code: 'd', color: 'blue' },
  { symbol: '♣', name: 'clubs', code: 'c', color: 'green' }
];

export const RANKS = [
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
  { value: 11, label: 'J' },
  { value: 12, label: 'Q' },
  { value: 13, label: 'K' },
  { value: 14, label: 'A' }
];

export function createDeck() {
  const deck = [];
  for (const s of SUITS) {
    for (const r of RANKS) {
      deck.push({
        id: `${r.label}${s.code}`,
        rank: r.value,
        label: r.label,
        suit: s.code,
        suitSymbol: s.symbol,
        color: s.color
      });
    }
  }
  return deck;
}

export function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function parseCard(cardStr) {
  if (typeof cardStr === 'object') return cardStr;
  const suitChar = cardStr.slice(-1).toLowerCase();
  const rankStr = cardStr.slice(0, -1).toUpperCase();
  
  let rankVal = parseInt(rankStr, 10);
  if (rankStr === 'J') rankVal = 11;
  if (rankStr === 'Q') rankVal = 12;
  if (rankStr === 'K') rankVal = 13;
  if (rankStr === 'A') rankVal = 14;

  const suitObj = SUITS.find(s => s.code === suitChar) || SUITS[0];
  
  return {
    id: cardStr,
    rank: rankVal,
    label: rankStr,
    suit: suitChar,
    suitSymbol: suitObj.symbol,
    color: suitObj.color
  };
}

export const HAND_TYPES = {
  ROYAL_FLUSH: { rank: 9, name: 'Royal Flush' },
  STRAIGHT_FLUSH: { rank: 8, name: 'Straight Flush' },
  FOUR_OF_A_KIND: { rank: 7, name: 'Four of a Kind' },
  FULL_HOUSE: { rank: 6, name: 'Full House' },
  FLUSH: { rank: 5, name: 'Flush' },
  STRAIGHT: { rank: 4, name: 'Straight' },
  THREE_OF_A_KIND: { rank: 3, name: 'Three of a Kind' },
  TWO_PAIR: { rank: 2, name: 'Two Pair' },
  ONE_PAIR: { rank: 1, name: 'One Pair' },
  HIGH_CARD: { rank: 0, name: 'High Card' }
};

const RANK_NAMES = {
  14: 'Ace', 13: 'King', 12: 'Queen', 11: 'Jack', 10: 'Ten',
  9: 'Nine', 8: 'Eight', 7: 'Seven', 6: 'Six', 5: 'Five',
  4: 'Four', 3: 'Three', 2: 'Two'
};

const RANK_PLURAL = {
  14: 'Aces', 13: 'Kings', 12: 'Queens', 11: 'Jacks', 10: 'Tens',
  9: 'Nines', 8: 'Eights', 7: 'Sevens', 6: 'Sixes', 5: 'Fives',
  4: 'Fours', 3: 'Threes', 2: 'Twos'
};

// Returns best 5-card hand evaluation score & human readable description from 5 to 7 cards
export function evaluate7CardHand(cards) {
  if (!cards || cards.length < 5) {
    return { score: 0, type: HAND_TYPES.HIGH_CARD.name, description: 'Incomplete Hand', bestCards: cards || [] };
  }

  const parsed = cards.map(parseCard);
  
  // Find all 5-card combinations out of N cards
  const combos = getCombinations(parsed, 5);
  let bestHand = null;

  for (const combo of combos) {
    const evalResult = evaluate5CardHand(combo);
    if (!bestHand || evalResult.score > bestHand.score) {
      bestHand = evalResult;
    }
  }

  return bestHand;
}

function getCombinations(arr, k) {
  if (k === 0) return [[]];
  if (arr.length === 0) return [];
  const head = arr[0];
  const tail = arr.slice(1);
  const withHead = getCombinations(tail, k - 1).map(c => [head, ...c]);
  const withoutHead = getCombinations(tail, k);
  return [...withHead, ...withoutHead];
}

export function evaluate5CardHand(cards) {
  // Sort descending by rank
  const sorted = [...cards].sort((a, b) => b.rank - a.rank);
  
  const isFlushMatch = sorted.every(c => c.suit === sorted[0].suit);
  
  // Check Straight
  let isStraightMatch = false;
  let straightHighRank = 0;

  if (
    sorted[0].rank - sorted[1].rank === 1 &&
    sorted[1].rank - sorted[2].rank === 1 &&
    sorted[2].rank - sorted[3].rank === 1 &&
    sorted[3].rank - sorted[4].rank === 1
  ) {
    isStraightMatch = true;
    straightHighRank = sorted[0].rank;
  } else if (
    sorted[0].rank === 14 &&
    sorted[1].rank === 5 &&
    sorted[2].rank === 4 &&
    sorted[3].rank === 3 &&
    sorted[4].rank === 2
  ) {
    // A-2-3-4-5 Wheel Straight
    isStraightMatch = true;
    straightHighRank = 5;
  }

  // Count rank frequencies
  const counts = {};
  sorted.forEach(c => {
    counts[c.rank] = (counts[c.rank] || 0) + 1;
  });

  const rankGroups = Object.entries(counts)
    .map(([rank, count]) => ({ rank: parseInt(rank, 10), count }))
    .sort((a, b) => b.count - a.count || b.rank - a.rank);

  // 1. Royal Flush & Straight Flush
  if (isFlushMatch && isStraightMatch) {
    if (straightHighRank === 14) {
      return {
        categoryRank: 9,
        score: calculateScore(9, [14]),
        type: HAND_TYPES.ROYAL_FLUSH.name,
        description: 'Royal Flush',
        bestCards: sorted
      };
    }
    return {
      categoryRank: 8,
      score: calculateScore(8, [straightHighRank]),
      type: HAND_TYPES.STRAIGHT_FLUSH.name,
      description: `Straight Flush, ${RANK_NAMES[straightHighRank]} High`,
      bestCards: sorted
    };
  }

  // 2. Four of a Kind
  if (rankGroups[0].count === 4) {
    const quadRank = rankGroups[0].rank;
    const kicker = rankGroups[1].rank;
    return {
      categoryRank: 7,
      score: calculateScore(7, [quadRank, kicker]),
      type: HAND_TYPES.FOUR_OF_A_KIND.name,
      description: `Four of a Kind, ${RANK_PLURAL[quadRank]}`,
      bestCards: sorted
    };
  }

  // 3. Full House
  if (rankGroups[0].count === 3 && rankGroups[1].count === 2) {
    const tripRank = rankGroups[0].rank;
    const pairRank = rankGroups[1].rank;
    return {
      categoryRank: 6,
      score: calculateScore(6, [tripRank, pairRank]),
      type: HAND_TYPES.FULL_HOUSE.name,
      description: `Full House, ${RANK_PLURAL[tripRank]} full of ${RANK_PLURAL[pairRank]}`,
      bestCards: sorted
    };
  }

  // 4. Flush
  if (isFlushMatch) {
    const ranks = sorted.map(c => c.rank);
    return {
      categoryRank: 5,
      score: calculateScore(5, ranks),
      type: HAND_TYPES.FLUSH.name,
      description: `Flush, ${RANK_NAMES[ranks[0]]} High`,
      bestCards: sorted
    };
  }

  // 5. Straight
  if (isStraightMatch) {
    return {
      categoryRank: 4,
      score: calculateScore(4, [straightHighRank]),
      type: HAND_TYPES.STRAIGHT.name,
      description: `Straight, ${RANK_NAMES[straightHighRank]} High`,
      bestCards: sorted
    };
  }

  // 6. Three of a Kind
  if (rankGroups[0].count === 3) {
    const tripRank = rankGroups[0].rank;
    const kickers = [rankGroups[1].rank, rankGroups[2].rank];
    return {
      categoryRank: 3,
      score: calculateScore(3, [tripRank, ...kickers]),
      type: HAND_TYPES.THREE_OF_A_KIND.name,
      description: `Three of a Kind, ${RANK_PLURAL[tripRank]}`,
      bestCards: sorted
    };
  }

  // 7. Two Pair
  if (rankGroups[0].count === 2 && rankGroups[1].count === 2) {
    const pair1 = rankGroups[0].rank;
    const pair2 = rankGroups[1].rank;
    const kicker = rankGroups[2].rank;
    return {
      categoryRank: 2,
      score: calculateScore(2, [pair1, pair2, kicker]),
      type: HAND_TYPES.TWO_PAIR.name,
      description: `Two Pair, ${RANK_PLURAL[pair1]} and ${RANK_PLURAL[pair2]}`,
      bestCards: sorted
    };
  }

  // 8. One Pair
  if (rankGroups[0].count === 2) {
    const pairRank = rankGroups[0].rank;
    const kickers = rankGroups.slice(1).map(g => g.rank);
    return {
      categoryRank: 1,
      score: calculateScore(1, [pairRank, ...kickers]),
      type: HAND_TYPES.ONE_PAIR.name,
      description: `Pair of ${RANK_PLURAL[pairRank]}`,
      bestCards: sorted
    };
  }

  // 9. High Card
  const ranks = sorted.map(c => c.rank);
  return {
    categoryRank: 0,
    score: calculateScore(0, ranks),
    type: HAND_TYPES.HIGH_CARD.name,
    description: `High Card, ${RANK_NAMES[ranks[0]]}`,
    bestCards: sorted
  };
}

function calculateScore(categoryRank, tieBreakers) {
  let score = categoryRank * 10000000;
  let multiplier = 100000;
  for (const val of tieBreakers) {
    score += val * multiplier;
    multiplier /= 15;
  }
  return Math.floor(score);
}

// Monte Carlo Simulation for Win/Tie/Loss Equity Calculation
export function simulateEquity(heroCards, boardCards = [], numOpponents = 1, iterations = 800) {
  if (!heroCards || heroCards.length < 2) {
    return { winPercent: 0, tiePercent: 0, lossPercent: 0 };
  }

  const parsedHero = heroCards.map(parseCard);
  const parsedBoard = boardCards.map(parseCard);

  // Known card IDs
  const usedCardIds = new Set([
    ...parsedHero.map(c => c.id),
    ...parsedBoard.map(c => c.id)
  ]);

  const fullDeck = createDeck().filter(c => !usedCardIds.has(c.id));
  
  let wins = 0;
  let ties = 0;
  let losses = 0;

  for (let i = 0; i < iterations; i++) {
    const currentDeck = shuffleDeck(fullDeck);
    let deckIdx = 0;

    // Complete board to 5 cards if needed
    const simBoard = [...parsedBoard];
    while (simBoard.length < 5) {
      simBoard.push(currentDeck[deckIdx++]);
    }

    // Deal hands to opponents
    const oppHands = [];
    for (let o = 0; o < numOpponents; o++) {
      oppHands.push([currentDeck[deckIdx++], currentDeck[deckIdx++]]);
    }

    // Evaluate hero
    const heroEval = evaluate7CardHand([...parsedHero, ...simBoard]);
    
    let highestOppScore = -1;
    for (const opp of oppHands) {
      const oppEval = evaluate7CardHand([...opp, ...simBoard]);
      if (oppEval.score > highestOppScore) {
        highestOppScore = oppEval.score;
      }
    }

    if (heroEval.score > highestOppScore) {
      wins++;
    } else if (heroEval.score === highestOppScore) {
      ties++;
    } else {
      losses++;
    }
  }

  const total = iterations;
  const winPercent = Math.round((wins / total) * 100);
  const tiePercent = Math.round((ties / total) * 100);
  const lossPercent = 100 - winPercent - tiePercent;

  return { winPercent, tiePercent, lossPercent };
}

// Calculate exact Outs (cards remaining in deck that improve hero's hand)
export function calculateOuts(heroCards, boardCards = []) {
  if (!heroCards || heroCards.length < 2 || boardCards.length < 3 || boardCards.length >= 5) {
    return { outsCount: 0, outsList: [], text: 'Outs are calculated on the Flop and Turn.' };
  }

  const parsedHero = heroCards.map(parseCard);
  const parsedBoard = boardCards.map(parseCard);
  
  const usedSet = new Set([...parsedHero.map(c => c.id), ...parsedBoard.map(c => c.id)]);
  const remainingDeck = createDeck().filter(c => !usedSet.has(c.id));

  const currentEval = evaluate7CardHand([...parsedHero, ...parsedBoard]);
  const outsList = [];

  for (const testCard of remainingDeck) {
    const newEval = evaluate7CardHand([...parsedHero, ...parsedBoard, testCard]);
    if (newEval.categoryRank > currentEval.categoryRank || newEval.score > currentEval.score) {
      outsList.push({
        card: testCard,
        improvedHand: newEval.type
      });
    }
  }

  const outsCount = outsList.length;
  // Estimate percentage using Rule of 4 (on flop) or Rule of 2 (on turn)
  const multiplier = boardCards.length === 3 ? 4 : 2;
  const approxEquity = Math.min(outsCount * multiplier, 100);

  return {
    outsCount,
    outsList,
    approxEquity,
    text: `${outsCount} Outs (~${approxEquity}% chance to complete draw)`
  };
}

// Calculate Pot Odds
export function calculatePotOdds(callAmount, currentPot) {
  if (!callAmount || callAmount <= 0) {
    return { ratio: 'N/A', requiredEquity: 0, text: 'No bet to call (Free Check)' };
  }

  const totalPotAfterCall = currentPot + callAmount;
  const requiredEquity = Math.round((callAmount / totalPotAfterCall) * 100);
  const ratio = (currentPot / callAmount).toFixed(1);

  return {
    ratio: `${ratio}:1`,
    requiredEquity,
    text: `Calling $${callAmount} into $${currentPot} pot requires ${requiredEquity}% equity (${ratio}:1 pot odds).`
  };
}
