import { describe, it, expect } from 'vitest';
import { makeAiDecision } from './aiEngine.js';

describe('AI Decision Engine', () => {
  const baseGameState = {
    communityCards: [],
    currentPot: 30,
    highestBet: 20,
    minRaise: 40,
    activePlayers: [
      { id: 'hero', name: 'Hero', isFolded: false, isAllIn: false, chipCount: 1000 },
      { id: 'bot-1', name: 'Bot 1', isFolded: false, isAllIn: false, chipCount: 1000 }
    ],
    bigBlind: 20,
    dealerIdx: 0,
    currentStreet: 'preflop'
  };

  it('Easy bot returns valid action and amount', () => {
    const bot = {
      id: 'bot-1',
      holeCards: [{ rank: 14, suit: 's' }, { rank: 14, suit: 'h' }],
      chipCount: 1000,
      currentBet: 10,
      position: 'BB'
    };

    const decision = makeAiDecision({
      bot,
      gameState: baseGameState,
      difficulty: 'easy'
    });

    expect(['fold', 'check', 'call', 'raise']).toContain(decision.action);
    expect(decision.amount).toBeGreaterThanOrEqual(0);
  });

  it('Hard bot raises premium preflop pairs (AA)', () => {
    const bot = {
      id: 'bot-1',
      holeCards: [{ rank: 14, suit: 's' }, { rank: 14, suit: 'h' }],
      chipCount: 1000,
      currentBet: 10,
      position: 'BTN'
    };

    const decision = makeAiDecision({
      bot,
      gameState: baseGameState,
      difficulty: 'hard'
    });

    expect(decision.action).toBe('raise');
    expect(decision.amount).toBeGreaterThan(baseGameState.highestBet);
  });

  it('Hard bot folds unplayable trash preflop facing a raise', () => {
    const bot = {
      id: 'bot-1',
      holeCards: [{ rank: 7, suit: 's' }, { rank: 2, suit: 'h' }],
      chipCount: 1000,
      currentBet: 0,
      position: 'UTG'
    };

    const gameStateFacingBet = {
      ...baseGameState,
      highestBet: 100
    };

    const decision = makeAiDecision({
      bot,
      gameState: gameStateFacingBet,
      difficulty: 'hard'
    });

    expect(decision.action).toBe('fold');
  });

  it('Hard bot value bets monster hand postflop', () => {
    const bot = {
      id: 'bot-1',
      holeCards: [{ rank: 14, suit: 's' }, { rank: 14, suit: 'h' }],
      chipCount: 1000,
      currentBet: 0,
      position: 'BTN'
    };

    const postflopState = {
      ...baseGameState,
      communityCards: [
        { rank: 14, suit: 'd' },
        { rank: 10, suit: 'c' },
        { rank: 5, suit: 's' }
      ],
      currentStreet: 'flop',
      highestBet: 0,
      minRaise: 20
    };

    const decision = makeAiDecision({
      bot,
      gameState: postflopState,
      difficulty: 'hard'
    });

    expect(['raise', 'check']).toContain(decision.action);
    if (decision.action === 'raise') {
      expect(decision.amount).toBeGreaterThan(0);
    }
  });
});
