// Comprehensive Poker Academy Lessons & Glossary Data

export const POKER_MODULES = [
  {
    id: 'module-1',
    title: 'Module 1: The Basics & Hand Rankings',
    shortDesc: 'Master the card values, kickers, and the 10 official hand rankings from High Card to Royal Flush.',
    icon: 'Trophy',
    lessons: [
      {
        id: 'hand-rankings',
        title: '1.1 The Official 10 Hand Rankings',
        content: `
### Understanding Hand Hierarchy
In Texas Hold'em, every player tries to construct the best 5-card combination out of 7 available cards (their 2 private hole cards + 5 shared community cards).

Here are the 10 official hand rankings, ordered from strongest to weakest:

1. **Royal Flush**: A, K, Q, J, 10, all of the same suit. The ultimate unbeatable hand.
2. **Straight Flush**: Five consecutive cards of the exact same suit (e.g., 9♠ 8♠ 7♠ 6♠ 5♠).
3. **Four of a Kind (Quads)**: Four cards of the same numerical rank (e.g., K♥ K♦ K♠ K♣ 3♦).
4. **Full House (Boat)**: Three cards of one rank + two cards of another rank (e.g., J♠ J♦ J♣ 8♥ 8♠ - "Jacks full of Eights").
5. **Flush**: Any five cards of the same suit, regardless of order (e.g., A♦ Q♦ 10♦ 7♦ 4♦).
6. **Straight**: Five consecutive cards of mixed suits (e.g., 8♣ 7♥ 6♦ 5♠ 4♣). *Note: Ace can count as high (A-K-Q-J-10) or low (A-2-3-4-5).*
7. **Three of a Kind (Trips/Set)**: Three cards of the same rank (e.g., 7♠ 7♦ 7♣ Q♥ 2♠).
8. **Two Pair**: Two distinct pairs of cards (e.g., 10♠ 10♦ 4♣ 4♥ A♠).
9. **One Pair**: Two cards of matching rank (e.g., A♠ A♦ 9♣ 5♥ 2♦).
10. **High Card**: When no player makes a pair or better, the highest single card wins (e.g., Ace-High).
        `
      },
      {
        id: 'kickers-ties',
        title: '1.2 Kickers, Tiebreakers & Split Pots',
        content: `
### How Tiebreakers Work in Poker
What happens when two players make the same hand category? Poker uses **Kickers** (side cards) to break ties!

#### Key Tiebreaker Rules:
- **Equal Pairs**: If Player A has A♠ A♦ 10♣ 7♥ 2♠ and Player B has A♣ A♥ K♦ 5♠ 3♣, both have a Pair of Aces. However, Player B wins because their highest side card (Kicker) is a King, which beats Player A's 10 Kicker!
- **Comparing Full Houses**: The Three-of-a-Kind rank takes priority. A♠ A♦ A♣ 2♥ 2♠ ("Aces full of Twos") beats K♠ K♦ K♣ Q♥ Q♠ ("Kings full of Queens").
- **Flushes**: The highest card in the flush breaks ties. A♦ 10♦ 8♦ 6♦ 2♦ beats K♦ Q♦ J♦ 10♦ 9♦.
- **Straights**: The highest card on top of the straight wins. 10-9-8-7-6 beats 9-8-7-6-5.
- **Split Pots (Chop)**: If two or more players have identical 5-card hands including kickers, the pot is divided equally among them. Suit values NEVER break ties in Texas Hold'em; all suits (Spades, Hearts, Diamonds, Clubs) are strictly equal.
        `
      }
    ]
  },
  {
    id: 'module-2',
    title: 'Module 2: Table Rules & Betting Flow',
    shortDesc: 'Learn how a hand unfolds from Blinds and Pre-flop through Flop, Turn, River, and Showdown.',
    icon: 'RotateCw',
    lessons: [
      {
        id: 'blinds-dealer',
        title: '2.1 The Dealer Button & Forced Blinds',
        content: `
### Table Mechanics & Action Order
Before any cards are dealt, two forced bets called **Blinds** are posted to create an initial pot:

- **Dealer Button (BTN)**: Represents the nominal dealer position. The button moves clockwise after every hand.
- **Small Blind (SB)**: Posted by the player immediately to the left of the button. Usually half the size of the Big Blind.
- **Big Blind (BB)**: Posted by the player to the left of the Small Blind. Sets the baseline minimum bet for the round.

*Why are blinds necessary?* Without blinds, players would simply fold every single hand until dealt Pocket Aces! Blinds force action and reward active, strategic play.
        `
      },
      {
        id: 'four-streets',
        title: '2.2 The 4 Streets of Betting',
        content: `
### Step-by-Step Round Execution
A complete hand of Texas Hold'em consists of up to 4 betting rounds (streets):

1. **Pre-Flop**: Each player receives 2 private hole cards face down. Betting begins with the player to the left of the Big Blind (Under The Gun / UTG). Players can Fold, Call the Big Blind, or Raise.
2. **The Flop**: The dealer deals 3 community cards face-up in the center. Active players now evaluate their 5-card potential. Action begins with the first active player left of the Dealer Button (SB or BB). Players can Check or Bet.
3. **The Turn (Fourth Street)**: A 4th community card is dealt face-up. A new round of betting takes place.
4. **The River (Fifth Street)**: The 5th and final community card is dealt face-up. The final betting round occurs.
5. **The Showdown**: Remaining players reveal their cards. The best 5-card hand takes the pot!
        `
      },
      {
        id: 'legal-actions',
        title: '2.3 Betting Actions & Side Pots',
        content: `
### Available Actions During Your Turn
- **Check**: Pass the action to the next player without betting any chips (only available if no bet has been made in the current round).
- **Bet**: Put chips into the pot when no one else has bet yet.
- **Call**: Match the exact amount of the highest bet made by an opponent in the current round.
- **Raise**: Increase the size of the current bet, forcing subsequent players to match the higher amount or fold.
- **Fold**: Surrender your cards and forfeit any chips you previously placed in the pot.
- **All-In**: Put all remaining chips into the pot.

#### What is a Side Pot?
When a player goes All-In with fewer chips than their opponents, a **Side Pot** is created. The short-stacked player can only win the Main Pot up to the amount they matched. Excess bets from deeper stacks go into a Side Pot that the short-stack cannot win.
        `
      }
    ]
  },
  {
    id: 'module-3',
    title: 'Module 3: Position & Table Geography',
    shortDesc: 'Understand why position is the #1 strategic advantage in Texas Hold’em.',
    icon: 'MapPin',
    lessons: [
      {
        id: 'table-positions',
        title: '3.1 Understanding Positions at a 6-Max Table',
        content: `
### The 6 Table Positions
Table position determines when you act during betting rounds:

- **Under The Gun (UTG)**: Early position. Acts FIRST pre-flop. You must play very tight because 5 players act after you.
- **Middle Position (MP)**: Middle position. Slight advantage over UTG, but still faces potential raises behind.
- **Cutoff (CO)**: Late position (right before the Button). Excellent position to steal blinds and raise.
- **Button (BTN)**: The BEST position on the table! You act LAST on every post-flop street (Flop, Turn, River).
- **Small Blind (SB)**: Out of position post-flop. Must act first on every street after pre-flop.
- **Big Blind (BB)**: Closing the action pre-flop, but out of position on all post-flop streets.
        `
      },
      {
        id: 'position-power',
        title: '3.2 Why Position equals Power',
        content: `
### The 4 Major Advantages of Acting Last (In Position)
Playing **In Position (IP)** gives you a massive mathematical and psychological edge:

1. **Information Advantage**: You see what your opponents do (check, bet, sizing) BEFORE you make your decision.
2. **Pot Control**: You decide whether to check behind to keep the pot small or bet to make it bigger.
3. **Bluffing Power**: If your opponent checks weakly to you in position, you can frequently bet to take down the pot.
4. **Maximized Value**: When you hold a monster hand in position, you control the bet sizing on every street to extract maximum chips.
        `
      }
    ]
  },
  {
    id: 'module-4',
    title: 'Module 4: Poker Math, Odds & EV',
    shortDesc: 'Learn how to calculate Outs, Pot Odds, Equity percentages, and Expected Value (EV).',
    icon: 'Calculator',
    lessons: [
      {
        id: 'outs-rule',
        title: '4.1 Counting Outs & The Rule of 2 and 4',
        content: `
### What are Outs?
An **Out** is any unseen card remaining in the deck that will improve your hand into a likely winner.

#### Common Draw Outs Cheat Sheet:
- **Flush Draw** (4 cards of same suit): **9 Outs**
- **Open-Ended Straight Draw / OESD** (e.g., 8-7 on 9-6-2 board): **8 Outs**
- **Gutshot Straight Draw** (e.g., 8-6 on 9-7-2 board): **4 Outs**
- **Two Pair to Full House**: **4 Outs**
- **Set to Full House / Quads**: **7 Outs**

#### The Rule of 2 and 4 (Instant Math Shortcut):
- **On the Flop** (2 cards to come): Multiply your outs by **4** to get your approximate % win probability.
  *Example: 9 Flush Outs × 4 = ~36% chance to hit your flush by the River.*
- **On the Turn** (1 card to come): Multiply your outs by **2** to get your approximate % win probability.
  *Example: 9 Flush Outs × 2 = ~18% chance to hit your flush on the River.*
        `
      },
      {
        id: 'pot-odds-ev',
        title: '4.2 Pot Odds vs Hand Equity',
        content: `
### How to Know When to Call a Bet
**Pot Odds** compare the size of the pot to the cost of calling a bet.

#### Pot Odds Formula:
\`\`\`
Required Equity % = Call Amount / (Current Pot + Bet Amount + Call Amount)
\`\`\`

#### Real Example:
The pot is **$100**. Opponent bets **$50**. Total pot is now **$150**. You must pay **$50** to call.
- Required Equity = $50 / ($150 + $50) = $50 / $200 = **25%**.
- If your hand's equity (win chance) is **GREATER than 25%**, calling is **PROFITABLE (+EV)**!
- If your equity is **LESS than 25%**, calling is **UNPROFITABLE (-EV)** and you should fold.
        `
      }
    ]
  },
  {
    id: 'module-5',
    title: 'Module 5: Starting Hand Strategy & Ranges',
    shortDesc: 'Master pre-flop starting hand matrixes and position-based opening charts.',
    icon: 'Grid',
    lessons: [
      {
        id: 'range-matrix',
        title: '5.1 The 13x13 Hand Matrix',
        content: `
### Understanding Poker Ranges
Instead of putting opponents on a single exact hand, expert players think in **Ranges** (the spectrum of all possible hands a player could hold given their position and actions).

There are **169 unique starting hand combinations** in Texas Hold'em:
- **13 Pocket Pairs** (AA, KK, QQ ... 22) - diagonal line in the matrix.
- **78 Suited Combos** (AKs, AQs ...) - upper right half of the matrix.
- **78 Offsuit Combos** (AKo, AQo ...) - lower left half of the matrix.

#### Opening Percentage Guidelines by Position:
- **UTG (Early)**: Open top ~15% of hands (Pairs 77+, AK, AQ, AJ, KQs).
- **MP (Middle)**: Open top ~22% of hands (Pairs 55+, ATs+, KJs+, QJs).
- **Cutoff (CO)**: Open top ~32% of hands (Pairs 22+, broadways, suited connectors like 87s, 76s).
- **Button (BTN)**: Open top ~48% of hands (Wide range to steal blinds!).
        `
      }
    ]
  },
  {
    id: 'module-6',
    title: 'Module 6: Post-Flop Strategy, Bluffing & Psychology',
    shortDesc: 'Master continuation betting, reading board textures, semi-bluffing, and tilt prevention.',
    icon: 'Brain',
    lessons: [
      {
        id: 'c-betting-textures',
        title: '6.1 Continuation Betting (C-Bet) & Board Textures',
        content: `
### What is a Continuation Bet?
A **Continuation Bet (C-bet)** occurs when the pre-flop raiser bets again on the Flop. Since the raiser demonstrated strength pre-flop, a continuation bet frequently wins the pot immediately regardless of whether their hand connected with the flop!

#### Board Textures:
- **Dry Boards** (e.g., A♠ 8♦ 2♣): Few draw possibilities, disconnected cards. Excellent for small C-bets (30%-40% of pot).
- **Wet Boards** (e.g., J♥ 10♥ 9♦): Heavy flush and straight draws present. Require larger bet sizing (66%-75% of pot) or checking for protection.
        `
      },
      {
        id: 'bluffing-tilt',
        title: '6.2 Pure Bluffs vs Semi-Bluffs & Mindset',
        content: `
### The Art of Bluffing
- **Semi-Bluffing**: Betting with a drawing hand (like a flush or straight draw) that is currently weak but has high potential to become the best hand if called. **Semi-bluffs are far superior to pure bluffs** because you have two ways to win: opponent folds now OR you hit your draw!
- **Pure Bluffing**: Betting with zero equity when you can only win if the opponent folds. Use sparingly against tight opponents.

#### Avoiding Tilt:
Poker has natural variance (luck in short term). Never let emotional frustration ("Tilt") cause you to play bad hands or chase unprofitable draws!
        `
      }
    ]
  },
  {
    id: 'module-7',
    title: 'Module 7: Complete Poker Glossary',
    shortDesc: 'Searchable dictionary of 50+ key poker terminology and jargon.',
    icon: 'BookOpen',
    lessons: [
      {
        id: 'glossary-full',
        title: '7.1 The Master Poker Dictionary',
        content: 'Use our interactive searchable glossary tool in the Glossary tab to look up any term!'
      }
    ]
  }
];

export const POKER_GLOSSARY_TERMS = [
  { term: 'All-In', category: 'Action', definition: 'Putting all of your remaining chips into the pot.' },
  { term: 'Bad Beat', category: 'Psychology', definition: 'Losing a hand where you were a massive statistical favorite before the final cards.' },
  { term: 'Big Blind (BB)', category: 'Rules', definition: 'The larger of two forced bets posted before cards are dealt.' },
  { term: 'Blank', category: 'Board', definition: 'A community card that appears useless and does not complete any likely draws.' },
  { term: 'Bluff', category: 'Strategy', definition: 'Betting or raising with a weak hand to force opponents holding stronger hands to fold.' },
  { term: 'Board', category: 'Rules', definition: 'The 5 shared community cards dealt face-up in the center of the table.' },
  { term: 'Broadways', category: 'Hand', definition: 'Cards ranked 10, Jack, Queen, King, or Ace.' },
  { term: 'Button (BTN)', category: 'Position', definition: 'The dealer position, acting last on every post-flop street.' },
  { term: 'Call', category: 'Action', definition: 'Matching the exact amount of the current highest bet.' },
  { term: 'Check', category: 'Action', definition: 'Passing action to the next player without betting when no bet faces you.' },
  { term: 'Check-Raise', category: 'Strategy', definition: 'Checking when action reaches you, then raising after an opponent behind you bets.' },
  { term: 'Chop (Split Pot)', category: 'Rules', definition: 'Dividing the pot equally among players with tied hands.' },
  { term: 'Continuation Bet (C-bet)', category: 'Strategy', definition: 'A bet made on the flop by the player who made the last aggressive raise pre-flop.' },
  { term: 'Cooler', category: 'Psychology', definition: 'A situation where two players hold extremely strong hands and the loser could not reasonably fold.' },
  { term: 'Cutoff (CO)', category: 'Position', definition: 'The seat to the immediate right of the Dealer Button.' },
  { term: 'Donk Bet', category: 'Strategy', definition: 'A bet made out of position on the flop into the pre-flop raiser before they can act.' },
  { term: 'Dry Board', category: 'Board', definition: 'A flop/turn texture with disconnected cards and no obvious draw possibilities.' },
  { term: 'Equity', category: 'Math', definition: 'Your mathematical percentage chance of winning the pot at showdown.' },
  { term: 'Expected Value (EV)', category: 'Math', definition: 'The average amount of money a play will win or lose over long-term repetition.' },
  { term: 'Flop', category: 'Rules', definition: 'The first 3 community cards dealt face up together.' },
  { term: 'Fold', category: 'Action', definition: 'Surrendering your hand and forfeiting rights to the current pot.' },
  { term: 'Gutshot', category: 'Draw', definition: 'An inside straight draw requiring 1 specific card rank (4 outs).' },
  { term: 'Heads-Up', category: 'Game', definition: 'Poker played 1-on-1 between exactly two players.' },
  { term: 'Hole Cards', category: 'Rules', definition: 'The 2 private cards dealt face-down to each player.' },
  { term: 'Implied Odds', category: 'Math', definition: 'Factoring in future money you expect to win on later streets if you hit your draw.' },
  { term: 'Kicker', category: 'Rules', definition: 'An unpaired card used to break ties between hands of equal category.' },
  { term: 'Main Pot', category: 'Rules', definition: 'The primary pot that all active players (including all-ins) are eligible to win.' },
  { term: 'Muck', category: 'Rules', definition: 'Discarding your hand silently without showing cards at showdown.' },
  { term: 'Nut / Nuts', category: 'Strategy', definition: 'The absolute best possible unbeatable hand on a given board.' },
  { term: 'Open-Ended Straight Draw (OESD)', category: 'Draw', definition: 'A straight draw open on both ends (8 outs).' },
  { term: 'Outs', category: 'Math', definition: 'Unseen cards remaining in the deck that will improve your hand to a probable winner.' },
  { term: 'Overcard', category: 'Hand', definition: 'A card in your hand higher than any card showing on the community board.' },
  { term: 'Position', category: 'Strategy', definition: 'Your seating relative to the dealer button determining action order.' },
  { term: 'Pot Odds', category: 'Math', definition: 'The ratio of the current pot size to the cost of a call.' },
  { term: 'Pre-Flop', category: 'Rules', definition: 'The first betting round after hole cards are dealt but before community cards appear.' },
  { term: 'Quads', category: 'Hand', definition: 'Slang for Four of a Kind.' },
  { term: 'Rainbow', category: 'Board', definition: 'A flop containing 3 cards of 3 different suits.' },
  { term: 'Raise', category: 'Action', definition: 'Increasing the size of the bet required to remain in the hand.' },
  { term: 'Rake', category: 'Rules', definition: 'A small percentage fee taken from each pot by the casino/house.' },
  { term: 'River', category: 'Rules', definition: 'The 5th and final community card dealt face up.' },
  { term: 'Runner-Runner', category: 'Draw', definition: 'Making a hand by hitting beneficial cards on BOTH the turn and river.' },
  { term: 'Scare Card', category: 'Strategy', definition: 'A card dealt on turn/river (like an Ace or Flush card) that threatens opponents.' },
  { term: 'Semi-Bluff', category: 'Strategy', definition: 'Betting with a draw that has potential to improve if called.' },
  { term: 'Set', category: 'Hand', definition: 'Three of a kind made with a pocket pair + 1 matching board card.' },
  { term: 'Showdown', category: 'Rules', definition: 'The final phase where remaining players show cards to determine the winner.' },
  { term: 'Side Pot', category: 'Rules', definition: 'A secondary pot created when a player goes all-in with a short stack.' },
  { term: 'Small Blind (SB)', category: 'Rules', definition: 'The smaller forced bet posted by the seat directly left of the Dealer button.' },
  { term: 'Stack-to-Pot Ratio (SPR)', category: 'Math', definition: 'Effective stack size divided by the size of the pot on the flop.' },
  { term: 'Straddle', category: 'Rules', definition: 'An optional voluntary extra blind posted before cards are dealt.' },
  { term: 'Suited Connectors', category: 'Hand', definition: 'Two consecutive cards of the same suit (e.g., 9♠ 8♠).' },
  { term: 'Tilt', category: 'Psychology', definition: 'A state of emotional frustration causing poor, reckless decision making.' },
  { term: 'Trips', category: 'Hand', definition: 'Three of a kind made with 1 hole card + 2 matching board cards.' },
  { term: 'Turn', category: 'Rules', definition: 'The 4th community card dealt face up (Fourth Street).' },
  { term: 'Under The Gun (UTG)', category: 'Position', definition: 'The seat to the left of the Big Blind; acts first pre-flop.' },
  { term: 'Value Bet', category: 'Strategy', definition: 'A bet made with a strong hand expecting worse hands to call.' },
  { term: 'Wet Board', category: 'Board', definition: 'A board texture rich in straight and flush draw possibilities.' },
  { term: 'Wheel', category: 'Hand', definition: 'The lowest straight possible: A-2-3-4-5.' }
];
