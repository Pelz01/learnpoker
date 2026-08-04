// Interactive Practice Drills & Quiz Data

export const HAND_BATTLE_QUIZZES = [
  {
    id: 'hb-1',
    title: 'Showdown Battle #1: Pair vs Two Pair',
    board: ['10♠', '7♦', '4♣', 'K♥', '2♠'],
    playerA: { name: 'Player A', hand: ['A♠', 'K♦'] },
    playerB: { name: 'Player B', hand: ['10♥', '7♠'] },
    correctWinner: 'Player B',
    explanation: 'Player A has Pair of Kings (A-K-10-7-4). Player B has Two Pair, Tens and Sevens (10-10-7-7-K). Two Pair beats One Pair!'
  },
  {
    id: 'hb-2',
    title: 'Showdown Battle #2: Flush vs Full House',
    board: ['J♥', 'J♠', '8♥', '3♥', '2♥'],
    playerA: { name: 'Player A', hand: ['A♥', 'K♥'] },
    playerB: { name: 'Player B', hand: ['8♠', '8♦'] },
    correctWinner: 'Player B',
    explanation: 'Player A has an Ace-High Flush in Hearts (A-K-J-8-3). Player B has Full House, Eights full of Jacks (8-8-8-J-J). A Full House always beats a Flush!'
  },
  {
    id: 'hb-3',
    title: 'Showdown Battle #3: Straight vs Higher Straight',
    board: ['9♠', '8♦', '7♣', '6♥', '2♠'],
    playerA: { name: 'Player A', hand: ['5♠', '4♦'] },
    playerB: { name: 'Player B', hand: ['10♥', 'J♠'] },
    correctWinner: 'Player B',
    explanation: 'Player A makes a 9-High Straight (9-8-7-6-5). Player B makes a Jack-High Straight (J-10-9-8-7). In straight vs straight battles, the highest top card wins!'
  },
  {
    id: 'hb-4',
    title: 'Showdown Battle #4: Kickers Matter!',
    board: ['Q♠', 'Q♦', '9♣', '5♥', '3♠'],
    playerA: { name: 'Player A', hand: ['A♣', '2♦'] },
    playerB: { name: 'Player B', hand: ['K♠', '10♥'] },
    correctWinner: 'Player A',
    explanation: 'Both players have Pair of Queens (Q-Q). Player A’s best 5 cards are Q-Q-A-9-5. Player B’s best 5 cards are Q-Q-K-9-5. Player A’s Ace Kicker beats Player B’s King Kicker!'
  }
];

export const OUTS_MATH_QUIZZES = [
  {
    id: 'om-1',
    title: 'Outs Calculation: Flush Draw',
    scenario: 'You hold A♠ 10♠ on a flop of K♠ 7♠ 2♦. How many outs do you have to complete your flush?',
    options: ['4 Outs', '8 Outs', '9 Outs', '12 Outs'],
    correctIndex: 2,
    explanation: 'There are 13 total Spades in a deck. You hold 2 in your hand and 2 are on the flop (total 4 Spades visible). 13 - 4 = 9 Spades remaining in the deck (9 Outs ~36% chance).'
  },
  {
    id: 'om-2',
    title: 'Outs Calculation: Open-Ended Straight Draw',
    scenario: 'You hold 9♥ 8♥ on a flop of 7♠ 6♦ K♣. How many outs do you have to complete a straight?',
    options: ['4 Outs', '8 Outs', '9 Outs', '10 Outs'],
    correctIndex: 1,
    explanation: 'An open-ended straight draw can be completed by any 10 (10-9-8-7-6) or any 5 (9-8-7-6-5). There are 4 Tens and 4 Fives in the deck = 8 total Outs (~32% chance).'
  },
  {
    id: 'om-3',
    title: 'Pot Odds Decision',
    scenario: 'The pot is $200. Your opponent bets $100. The total pot is now $300, and it costs you $100 to call. What is your required equity % to make a profitable call?',
    options: ['20%', '25%', '33%', '50%'],
    correctIndex: 1,
    explanation: 'Required Equity = Call / (Pot + Bet + Call) = $100 / ($300 + $100) = $100 / $400 = 25% (3:1 pot odds).'
  }
];

export const PREFLOP_POSITION_QUIZZES = [
  {
    id: 'pf-1',
    title: 'Position Drill: Under The Gun (UTG)',
    hand: ['K♠', '10♦'],
    position: 'UTG (Early Position)',
    scenario: 'You are first to act pre-flop at a 6-max table with K-10 offsuit.',
    options: ['RAISE 2.5x BB', 'CALL 1x BB', 'FOLD'],
    correctIndex: 2,
    explanation: 'FOLD! K-10 offsuit is too weak to play from Under The Gun because 5 players act after you and can easily dominate your hand.'
  },
  {
    id: 'pf-2',
    title: 'Position Drill: Dealer Button (BTN)',
    hand: ['9♠', '8♠'],
    position: 'BTN (Dealer Button)',
    scenario: 'Action folds to you on the Dealer Button holding 9-8 suited.',
    options: ['RAISE 2.5x BB', 'CALL 1x BB', 'FOLD'],
    correctIndex: 0,
    explanation: 'RAISE 2.5x BB! 9-8 suited is a prime candidate to raise from the Button to steal the blinds or play in position post-flop.'
  },
  {
    id: 'pf-3',
    title: 'Position Drill: Pocket Aces (AA)',
    hand: ['A♠', 'A♦'],
    position: 'UTG (Early Position)',
    scenario: 'You hold Pocket Aces Under The Gun.',
    options: ['RAISE 3x BB', 'CALL 1x BB (Slowplay)', 'FOLD'],
    correctIndex: 0,
    explanation: 'RAISE 3x BB! Never limp or call with Pocket Aces pre-flop. You want to build a pot immediately and extract maximum value.'
  }
];
