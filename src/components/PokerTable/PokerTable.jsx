import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import CardComponent from './CardComponent';
import PlayerSeat from './PlayerSeat';
import ActionControls from './ActionControls';
import LiveCoach from './LiveCoach';
import GameSetupModal from './GameSetupModal';
import { soundEffects } from '../../utils/audioService';
import { createDeck, shuffleDeck, evaluate7CardHand } from '../../utils/pokerEvaluator';
import { makeAiDecision } from '../../utils/aiEngine';
import { Bot, RefreshCw, Eye, Sparkles, Settings, Coins } from 'lucide-react';

export default function PokerTable({ onUpdateBankroll }) {
  const [setupModalOpen, setSetupModalOpen] = useState(true);
  const [gameConfig, setGameConfig] = useState({
    difficulty: 'hard',
    tableSize: 4,
    blinds: { sb: 10, bb: 20 },
    startingStack: 1000
  });

  // Game state
  const [deck, setDeck] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [pot, setPot] = useState(0);
  const [players, setPlayers] = useState([]);
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
  const [dealerIdx, setDealerIdx] = useState(0);
  const [currentStreet, setCurrentStreet] = useState('preflop');
  const [highestBet, setHighestBet] = useState(20);
  const [minRaise, setMinRaise] = useState(40);
  const [gameMessage, setGameMessage] = useState('Welcome! Configure table settings to begin.');
  const [showCoach, setShowCoach] = useState(true);

  const aiTimeoutRef = useRef(null);

  const handleStartMatch = (config) => {
    setGameConfig(config);
    setSetupModalOpen(false);

    const positions = config.tableSize === 2 ? ['BTN', 'BB'] :
                      config.tableSize === 4 ? ['UTG', 'CO', 'BTN', 'BB'] : ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'];

    const newPlayers = [];
    // Player 0 is Hero
    newPlayers.push({
      id: 'hero',
      name: 'You (Hero)',
      isHuman: true,
      chipCount: config.startingStack,
      currentBet: 0,
      holeCards: [],
      isFolded: false,
      isAllIn: false,
      position: positions[0],
      lastAction: ''
    });

    // AI Bots
    for (let i = 1; i < config.tableSize; i++) {
      newPlayers.push({
        id: `bot-${i}`,
        name: `Bot ${i}`,
        isHuman: false,
        chipCount: config.startingStack,
        currentBet: 0,
        holeCards: [],
        isFolded: false,
        isAllIn: false,
        position: positions[i],
        lastAction: '',
        difficulty: config.difficulty
      });
    }

    setPlayers(newPlayers);
    startNewHand(newPlayers, 0, config);
  };

  const startNewHand = (currentPlayersList, dIdx, config = gameConfig) => {
    soundEffects.playDeal();

    const newDeck = shuffleDeck(createDeck());
    let deckIdx = 0;

    const updatedPlayers = currentPlayersList.map((p) => {
      if (p.chipCount <= 0) return { ...p, isFolded: true, holeCards: [] };
      const c1 = newDeck[deckIdx++];
      const c2 = newDeck[deckIdx++];
      return {
        ...p,
        holeCards: [c1, c2],
        isFolded: false,
        isAllIn: false,
        currentBet: 0,
        lastAction: ''
      };
    });

    const sbIdx = (dIdx + 1) % updatedPlayers.length;
    const bbIdx = (dIdx + 2) % updatedPlayers.length;

    const sbAmt = Math.min(config.blinds.sb, updatedPlayers[sbIdx].chipCount);
    const bbAmt = Math.min(config.blinds.bb, updatedPlayers[bbIdx].chipCount);

    updatedPlayers[sbIdx].chipCount -= sbAmt;
    updatedPlayers[sbIdx].currentBet = sbAmt;
    updatedPlayers[sbIdx].lastAction = `SB $${sbAmt}`;

    updatedPlayers[bbIdx].chipCount -= bbAmt;
    updatedPlayers[bbIdx].currentBet = bbAmt;
    updatedPlayers[bbIdx].lastAction = `BB $${bbAmt}`;

    const initialPot = sbAmt + bbAmt;
    const initialHighestBet = Math.max(sbAmt, bbAmt);
    const initialMinRaise = initialHighestBet * 2;
    const firstTurnIdx = (bbIdx + 1) % updatedPlayers.length;

    setDeck(newDeck.slice(deckIdx));
    setCommunityCards([]);
    setPot(initialPot);
    setPlayers(updatedPlayers);
    setDealerIdx(dIdx);
    setCurrentTurnIdx(firstTurnIdx);
    setCurrentStreet('preflop');
    setHighestBet(initialHighestBet);
    setMinRaise(initialMinRaise);
    setGameMessage(`Hand dealt! Pre-flop action starts with ${updatedPlayers[firstTurnIdx].name}.`);
  };

  const handlePlayerAction = (action, amount = 0) => {
    if (currentStreet === 'showdown') return;

    const player = players[currentTurnIdx];
    let newPlayers = [...players];
    let newPot = pot;
    let newHighestBet = highestBet;
    let newMinRaise = minRaise;
    let actionText = '';

    if (action === 'fold') {
      newPlayers[currentTurnIdx].isFolded = true;
      newPlayers[currentTurnIdx].lastAction = 'FOLD';
      actionText = `${player.name} folds.`;
    } else if (action === 'check') {
      newPlayers[currentTurnIdx].lastAction = 'CHECK';
      actionText = `${player.name} checks.`;
    } else if (action === 'call') {
      const callAmt = Math.min(amount, player.chipCount);
      newPlayers[currentTurnIdx].chipCount -= callAmt;
      newPlayers[currentTurnIdx].currentBet += callAmt;
      newPot += callAmt;
      newPlayers[currentTurnIdx].lastAction = `CALL $${callAmt}`;
      actionText = `${player.name} calls $${callAmt}.`;
    } else if (action === 'raise') {
      const raiseTotal = Math.min(amount, player.chipCount + player.currentBet);
      const addedChips = raiseTotal - player.currentBet;
      newPlayers[currentTurnIdx].chipCount -= addedChips;
      newPlayers[currentTurnIdx].currentBet = raiseTotal;
      newPot += addedChips;

      newHighestBet = raiseTotal;
      newMinRaise = raiseTotal + (raiseTotal - highestBet);
      newPlayers[currentTurnIdx].lastAction = `RAISE $${raiseTotal}`;
      actionText = `${player.name} raises to $${raiseTotal}!`;
    }

    setPlayers(newPlayers);
    setPot(newPot);
    setHighestBet(newHighestBet);
    setMinRaise(newMinRaise);
    setGameMessage(actionText);

    advanceTurn(newPlayers, currentTurnIdx, newHighestBet);
  };

  const advanceTurn = (currentPlayersList, lastIdx, targetHighestBet) => {
    const activePlayers = currentPlayersList.filter(p => !p.isFolded);

    if (activePlayers.length === 1) {
      handleSinglePlayerWin(activePlayers[0]);
      return;
    }

    let nextIdx = (lastIdx + 1) % currentPlayersList.length;
    while (currentPlayersList[nextIdx].isFolded) {
      nextIdx = (nextIdx + 1) % currentPlayersList.length;
    }

    const isBettingComplete = currentPlayersList.every(p => 
      p.isFolded || p.isAllIn || p.currentBet === targetHighestBet
    );

    if (isBettingComplete) {
      progressStreet(currentPlayersList);
    } else {
      setCurrentTurnIdx(nextIdx);
    }
  };

  const progressStreet = (currentPlayersList) => {
    const resetBetsList = currentPlayersList.map(p => ({ ...p, currentBet: 0 }));
    setPlayers(resetBetsList);
    setHighestBet(0);
    setMinRaise(gameConfig.blinds.bb);

    let nextDeck = [...deck];
    let newCommunity = [...communityCards];

    if (currentStreet === 'preflop') {
      soundEffects.playDeal();
      newCommunity.push(nextDeck.pop(), nextDeck.pop(), nextDeck.pop());
      setCommunityCards(newCommunity);
      setDeck(nextDeck);
      setCurrentStreet('flop');
      setGameMessage('The Flop is dealt!');
    } else if (currentStreet === 'flop') {
      soundEffects.playDeal();
      newCommunity.push(nextDeck.pop());
      setCommunityCards(newCommunity);
      setDeck(nextDeck);
      setCurrentStreet('turn');
      setGameMessage('The Turn is dealt!');
    } else if (currentStreet === 'turn') {
      soundEffects.playDeal();
      newCommunity.push(nextDeck.pop());
      setCommunityCards(newCommunity);
      setDeck(nextDeck);
      setCurrentStreet('river');
      setGameMessage('The River card is dealt!');
    } else if (currentStreet === 'river') {
      handleShowdown(resetBetsList, newCommunity);
      return;
    }

    let nextIdx = (dealerIdx + 1) % resetBetsList.length;
    while (resetBetsList[nextIdx].isFolded) {
      nextIdx = (nextIdx + 1) % resetBetsList.length;
    }
    setCurrentTurnIdx(nextIdx);
  };

  const handleShowdown = (activePlayersList, finalCommunity) => {
    setCurrentStreet('showdown');
    const contenders = activePlayersList.filter(p => !p.isFolded);

    let bestScore = -1;
    let winners = [];
    let bestHandName = '';

    contenders.forEach(p => {
      const evalRes = evaluate7CardHand([...p.holeCards, ...finalCommunity]);
      p.evalRes = evalRes;

      if (evalRes.score > bestScore) {
        bestScore = evalRes.score;
        winners = [p];
        bestHandName = evalRes.description;
      } else if (evalRes.score === bestScore) {
        winners.push(p);
      }
    });

    const splitShare = Math.floor(pot / winners.length);
    const updatedPlayers = activePlayersList.map(p => {
      const isWinner = winners.some(w => w.id === p.id);
      return isWinner ? { ...p, chipCount: p.chipCount + splitShare } : p;
    });

    setPlayers(updatedPlayers);

    const heroWon = winners.some(w => w.isHuman);
    if (heroWon) {
      soundEffects.playWin();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setGameMessage(`🎉 You Won the $${pot} Pot! (${bestHandName})`);
    } else {
      setGameMessage(`Showdown: ${winners.map(w => w.name).join(', ')} wins $${pot} with ${bestHandName}.`);
    }
  };

  const handleSinglePlayerWin = (winner) => {
    setCurrentStreet('showdown');
    const updatedPlayers = players.map(p => 
      p.id === winner.id ? { ...p, chipCount: p.chipCount + pot } : p
    );
    setPlayers(updatedPlayers);

    if (winner.isHuman) {
      soundEffects.playWin();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setGameMessage(`🎉 Everyone folded! You won the $${pot} pot.`);
    } else {
      setGameMessage(`${winner.name} wins $${pot} (Everyone folded).`);
    }
  };

  useEffect(() => {
    if (currentStreet === 'showdown' || players.length === 0) return;

    const activePlayer = players[currentTurnIdx];
    if (activePlayer && !activePlayer.isHuman && !activePlayer.isFolded && !activePlayer.isAllIn) {
      aiTimeoutRef.current = setTimeout(() => {
        const decision = makeAiDecision({
          bot: activePlayer,
          gameState: {
            communityCards,
            currentPot: pot,
            highestBet,
            minRaise,
            activePlayers: players.filter(p => !p.isFolded),
            bigBlind: gameConfig.blinds.bb,
            dealerIdx,
            currentStreet
          },
          difficulty: activePlayer.difficulty || gameConfig.difficulty
        });

        handlePlayerAction(decision.action, decision.amount);
      }, 1100);
    }

    return () => clearTimeout(aiTimeoutRef.current);
  }, [currentTurnIdx, currentStreet, players]);

  const heroPlayer = players.find(p => p.isHuman);
  const isHeroTurn = players[currentTurnIdx]?.isHuman && currentStreet !== 'showdown';

  return (
    <div className="relative w-full flex flex-col justify-between p-1 sm:p-2 space-y-2 font-sans max-w-5xl mx-auto">
      
      {/* Game Setup Modal */}
      <GameSetupModal
        isOpen={setupModalOpen}
        onStartGame={handleStartMatch}
        onClose={() => setSetupModalOpen(false)}
      />

      {/* Top Bar: Table Info & Controls */}
      <div className="flex items-center justify-between gap-1.5 bg-slate-900/90 border border-amber-500/30 px-3 py-1.5 rounded-xl backdrop-blur-md shadow-xl text-xs font-bold text-slate-200">
        <div className="flex items-center space-x-2 text-[11px] sm:text-xs">
          <span className="flex items-center gap-1">
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <strong className="text-amber-300 uppercase font-black">{gameConfig.difficulty}</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span>Blinds: <strong className="text-emerald-400 font-extrabold">${gameConfig.blinds.sb}/${gameConfig.blinds.bb}</strong></span>
          <span className="text-slate-700">|</span>
          <span>Pot: <strong className="text-amber-300 font-black">${pot}</strong></span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setShowCoach(!showCoach)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-black flex items-center space-x-1 transition-all ${
              showCoach ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">AI Coach</span>
          </button>

          <button
            onClick={() => setSetupModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-bold flex items-center space-x-1"
          >
            <Settings className="w-3 h-3" />
            <span className="hidden sm:inline">Config</span>
          </button>
        </div>
      </div>

      {/* REALISTIC COMPACT HIGH-STAKES CASINO POKER TABLE */}
      <div className="relative w-full mx-auto min-h-[250px] sm:min-h-[320px] md:min-h-[380px] rounded-[50px] sm:rounded-[120px] md:rounded-[160px] bg-gradient-to-b from-emerald-800 via-emerald-950 to-slate-950 border-[8px] sm:border-[16px] md:border-[20px] border-amber-950 shadow-[inset_0_0_60px_rgba(0,0,0,0.95)] p-2 sm:p-4 flex flex-col justify-between items-center overflow-hidden border-solid ring-1 ring-amber-500/40">
        
        {/* Leather Armrest Trim & Gold Felt Line */}
        <div className="absolute inset-2 sm:inset-3 rounded-[40px] sm:rounded-[100px] md:rounded-[140px] border border-amber-400/30 pointer-events-none" />

        {/* AI Bots Row (Top/Sides of Felt) */}
        <div className="w-full flex flex-wrap justify-around items-center pt-1 z-10 gap-y-1">
          {players.filter(p => !p.isHuman).map((botPlayer) => {
            const playerIdx = players.findIndex(p => p.id === botPlayer.id);
            return (
              <div key={botPlayer.id} className="transform scale-75 sm:scale-90 md:scale-100">
                <PlayerSeat
                  player={botPlayer}
                  isTurn={currentTurnIdx === playerIdx}
                  showCards={currentStreet === 'showdown'}
                />
              </div>
            );
          })}
        </div>

        {/* Center Felt: Pot Chip Stacks & 5 Community Cards */}
        <div className="my-auto flex flex-col items-center space-y-1.5 sm:space-y-3 z-10 py-1 sm:py-2">
          
          {/* Main Pot Display with Chip Stack */}
          <div className="bg-slate-950/90 border border-amber-400 px-4 py-1 rounded-full shadow-xl flex items-center space-x-2">
            <Coins className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="text-[10px] text-slate-300 font-extrabold uppercase tracking-widest">POT:</span>
            <span className="text-sm sm:text-base font-black text-amber-300">${pot.toLocaleString()}</span>
          </div>

          {/* 5 Community Cards Tray */}
          <div className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-3 rounded-xl bg-black/60 border border-emerald-500/40 shadow-xl backdrop-blur-md">
            {[0, 1, 2, 3, 4].map((idx) => {
              const card = communityCards[idx];
              return (
                <CardComponent
                  key={idx}
                  card={card}
                  hidden={!card}
                  size="sm"
                />
              );
            })}
          </div>

          {/* Live Action Status Banner */}
          <div className="text-center w-full max-w-xs px-3 py-1 rounded-lg bg-slate-950/90 border border-amber-500/30 text-[10px] sm:text-xs font-black text-amber-300 shadow-md truncate">
            {gameMessage}
          </div>
        </div>

        {/* Hero Player Seat (Bottom of Felt) */}
        {heroPlayer && (
          <div className="pb-1 z-10 transform scale-90 sm:scale-100">
            <PlayerSeat
              player={heroPlayer}
              isTurn={currentTurnIdx === 0}
              showCards={true}
            />
          </div>
        )}

      </div>

      {/* Showdown Next Hand Button */}
      {currentStreet === 'showdown' && (
        <div className="flex justify-center my-1">
          <button
            onClick={() => startNewHand(players, (dealerIdx + 1) % players.length)}
            className="py-2.5 px-8 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Deal Next Hand ♠</span>
          </button>
        </div>
      )}

      {/* Bottom Action Controls & Live Coach */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start max-w-5xl mx-auto w-full">
        {showCoach && heroPlayer && (
          <LiveCoach
            heroCards={heroPlayer.holeCards}
            communityCards={communityCards}
            numOpponents={players.filter(p => !p.isFolded).length - 1}
            amountToCall={highestBet - heroPlayer.currentBet}
            currentPot={pot}
            position={heroPlayer.position}
            isMyTurn={isHeroTurn}
          />
        )}

        {isHeroTurn && heroPlayer && (
          <ActionControls
            onAction={handlePlayerAction}
            amountToCall={highestBet - heroPlayer.currentBet}
            minRaise={minRaise}
            maxRaise={heroPlayer.chipCount + heroPlayer.currentBet}
            currentPot={pot}
            playerChipCount={heroPlayer.chipCount}
            canCheck={highestBet === heroPlayer.currentBet}
          />
        )}
      </div>

    </div>
  );
}
