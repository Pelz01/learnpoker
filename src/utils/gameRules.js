// Pure Poker Game Rules Engine for State & Turn Calculations

export function findNextActivePlayerIdx(playersList, startIdx) {
  if (!playersList || playersList.length === 0) return -1;
  for (let i = 0; i < playersList.length; i++) {
    const candidateIdx = (startIdx + i) % playersList.length;
    const p = playersList[candidateIdx];
    if (p && !p.isFolded && !p.isAllIn && p.chipCount > 0) {
      return candidateIdx;
    }
  }
  return -1;
}

export function isBettingRoundComplete(playersList, targetHighestBet) {
  const activePlayers = playersList.filter(p => !p.isFolded);
  if (activePlayers.length <= 1) return true;

  const playersWhoCanAct = activePlayers.filter(p => !p.isAllIn && p.chipCount > 0);
  if (playersWhoCanAct.length <= 1) return true;

  return activePlayers.every(p => 
    p.isAllIn || (p.hasActed && p.currentBet === targetHighestBet)
  );
}

export function applyPlayerAction(playersList, playerIdx, action, amount = 0, highestBet = 0, pot = 0) {
  let newPlayers = playersList.map(p => ({ ...p }));
  let newPot = pot;
  let newHighestBet = highestBet;
  const player = newPlayers[playerIdx];

  player.hasActed = true;

  if (action === 'fold') {
    player.isFolded = true;
    player.lastAction = 'FOLD';
  } else if (action === 'check') {
    player.lastAction = 'CHECK';
  } else if (action === 'call') {
    const callAmt = Math.min(amount, player.chipCount);
    player.chipCount -= callAmt;
    player.currentBet += callAmt;
    newPot += callAmt;
    player.lastAction = `CALL $${callAmt}`;

    if (player.chipCount <= 0) {
      player.chipCount = 0;
      player.isAllIn = true;
    }
  } else if (action === 'raise') {
    const raiseTotal = Math.min(amount, player.chipCount + player.currentBet);
    const addedChips = raiseTotal - player.currentBet;
    player.chipCount -= addedChips;
    player.currentBet = raiseTotal;
    newPot += addedChips;
    newHighestBet = raiseTotal;
    player.lastAction = `RAISE $${raiseTotal}`;

    if (player.chipCount <= 0) {
      player.chipCount = 0;
      player.isAllIn = true;
    }

    // Reset hasActed for all other active, non-all-in players
    newPlayers = newPlayers.map((p, idx) => 
      idx === playerIdx || p.isFolded || p.isAllIn ? p : { ...p, hasActed: false }
    );
  }

  return { newPlayers, newPot, newHighestBet };
}
