import { describe, it, expect } from 'vitest';
import {
  findNextActivePlayerIdx,
  isBettingRoundComplete,
  applyPlayerAction
} from './gameRules.js';

describe('Poker Game Rules & State Transitions', () => {
  it('findNextActivePlayerIdx skips folded, all-in, and broke players', () => {
    const players = [
      { id: 'p0', isFolded: true, isAllIn: false, chipCount: 1000 },
      { id: 'p1', isFolded: false, isAllIn: true, chipCount: 0 },
      { id: 'p2', isFolded: false, isAllIn: false, chipCount: 0 },
      { id: 'p3', isFolded: false, isAllIn: false, chipCount: 500 }
    ];

    const nextIdx = findNextActivePlayerIdx(players, 0);
    expect(nextIdx).toBe(3); // p3 is the only active player who can act
  });

  it('findNextActivePlayerIdx returns -1 when all players are all-in or folded', () => {
    const players = [
      { id: 'p0', isFolded: true, isAllIn: false, chipCount: 1000 },
      { id: 'p1', isFolded: false, isAllIn: true, chipCount: 0 },
      { id: 'p2', isFolded: false, isAllIn: true, chipCount: 0 }
    ];

    const nextIdx = findNextActivePlayerIdx(players, 0);
    expect(nextIdx).toBe(-1);
  });

  it('isBettingRoundComplete returns false if a player has not acted', () => {
    const players = [
      { id: 'p0', isFolded: false, isAllIn: false, chipCount: 500, currentBet: 0, hasActed: true },
      { id: 'p1', isFolded: false, isAllIn: false, chipCount: 500, currentBet: 0, hasActed: false }
    ];

    const isComplete = isBettingRoundComplete(players, 0);
    expect(isComplete).toBe(false);
  });

  it('isBettingRoundComplete returns true when all active players checked', () => {
    const players = [
      { id: 'p0', isFolded: false, isAllIn: false, chipCount: 500, currentBet: 0, hasActed: true },
      { id: 'p1', isFolded: false, isAllIn: false, chipCount: 500, currentBet: 0, hasActed: true }
    ];

    const isComplete = isBettingRoundComplete(players, 0);
    expect(isComplete).toBe(true);
  });

  it('going ALL-IN sets isAllIn = true and zeros chipCount', () => {
    const players = [
      { id: 'p0', name: 'Hero', isFolded: false, isAllIn: false, chipCount: 200, currentBet: 0, hasActed: false },
      { id: 'p1', name: 'Bot 1', isFolded: false, isAllIn: false, chipCount: 1000, currentBet: 0, hasActed: false }
    ];

    // p0 goes all-in for 200
    const { newPlayers, newPot, newHighestBet } = applyPlayerAction(players, 0, 'raise', 200, 0, 0);
    
    expect(newPlayers[0].chipCount).toBe(0);
    expect(newPlayers[0].isAllIn).toBe(true);
    expect(newPlayers[0].hasActed).toBe(true);
    expect(newHighestBet).toBe(200);
    expect(newPot).toBe(200);
  });

  it('raising resets hasActed to false for other active players', () => {
    const players = [
      { id: 'p0', isFolded: false, isAllIn: false, chipCount: 500, currentBet: 20, hasActed: true },
      { id: 'p1', isFolded: false, isAllIn: false, chipCount: 500, currentBet: 20, hasActed: true },
      { id: 'p2', isFolded: false, isAllIn: false, chipCount: 500, currentBet: 20, hasActed: true }
    ];

    // p0 raises to 100
    const { newPlayers } = applyPlayerAction(players, 0, 'raise', 100, 20, 60);

    expect(newPlayers[0].hasActed).toBe(true);
    expect(newPlayers[1].hasActed).toBe(false); // p1 must act again!
    expect(newPlayers[2].hasActed).toBe(false); // p2 must act again!
  });
});
