import { describe, it, expect } from 'vitest';
import {
  createDeck,
  shuffleDeck,
  evaluate7CardHand,
  simulateEquity,
  calculatePotOdds
} from './pokerEvaluator.js';

describe('Poker Evaluator Engine', () => {
  it('creates a standard 52-card deck', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(52);
    const uniqueCards = new Set(deck.map(c => `${c.rank}${c.suit}`));
    expect(uniqueCards.size).toBe(52);
  });

  it('shuffles the deck randomly', () => {
    const deck1 = createDeck();
    const deck2 = shuffleDeck(createDeck());
    const matchCount = deck1.filter((c, i) => c.rank === deck2[i].rank && c.suit === deck2[i].suit).length;
    expect(matchCount).toBeLessThan(52);
  });

  it('correctly evaluates a Royal Flush', () => {
    const holeCards = [{ rank: 14, suit: 's' }, { rank: 13, suit: 's' }];
    const community = [
      { rank: 12, suit: 's' },
      { rank: 11, suit: 's' },
      { rank: 10, suit: 's' },
      { rank: 2, suit: 'h' },
      { rank: 3, suit: 'd' }
    ];
    const res = evaluate7CardHand([...holeCards, ...community]);
    expect(res.type).toBe('Royal Flush');
    expect(res.categoryRank).toBe(9);
  });

  it('correctly evaluates Four of a Kind', () => {
    const cards = [
      { rank: 9, suit: 's' }, { rank: 9, suit: 'h' },
      { rank: 9, suit: 'd' }, { rank: 9, suit: 'c' },
      { rank: 14, suit: 's' }, { rank: 2, suit: 'h' }, { rank: 5, suit: 'c' }
    ];
    const res = evaluate7CardHand(cards);
    expect(res.type).toBe('Four of a Kind');
    expect(res.categoryRank).toBe(7);
  });

  it('correctly evaluates a Full House', () => {
    const cards = [
      { rank: 10, suit: 's' }, { rank: 10, suit: 'h' },
      { rank: 10, suit: 'd' }, { rank: 4, suit: 'c' },
      { rank: 4, suit: 's' }, { rank: 2, suit: 'h' }, { rank: 8, suit: 'c' }
    ];
    const res = evaluate7CardHand(cards);
    expect(res.type).toBe('Full House');
    expect(res.categoryRank).toBe(6);
  });

  it('correctly evaluates a Flush', () => {
    const cards = [
      { rank: 14, suit: 'h' }, { rank: 10, suit: 'h' },
      { rank: 8, suit: 'h' }, { rank: 6, suit: 'h' },
      { rank: 2, suit: 'h' }, { rank: 5, suit: 's' }, { rank: 9, suit: 'c' }
    ];
    const res = evaluate7CardHand(cards);
    expect(res.type).toBe('Flush');
    expect(res.categoryRank).toBe(5);
  });

  it('correctly evaluates a Straight', () => {
    const cards = [
      { rank: 9, suit: 's' }, { rank: 8, suit: 'h' },
      { rank: 7, suit: 'd' }, { rank: 6, suit: 'c' },
      { rank: 5, suit: 's' }, { rank: 2, suit: 'h' }, { rank: 12, suit: 'c' }
    ];
    const res = evaluate7CardHand(cards);
    expect(res.type).toBe('Straight');
    expect(res.categoryRank).toBe(4);
  });

  it('calculates pot odds accurately', () => {
    // Calling $50 into a $150 pot requires 50 / (150 + 50) = 25% equity
    const { requiredEquity } = calculatePotOdds(50, 150);
    expect(requiredEquity).toBe(25);
  });

  it('runs Monte Carlo equity simulation', () => {
    const holeCards = [{ rank: 14, suit: 's' }, { rank: 14, suit: 'h' }]; // Pocket Aces
    const community = [];
    const { winPercent } = simulateEquity(holeCards, community, 1, 100);
    // Pocket Aces vs 1 opponent preflop should have > 75% equity
    expect(winPercent).toBeGreaterThan(70);
  });
});
