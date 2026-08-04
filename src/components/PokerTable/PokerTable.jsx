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
import { findNextActivePlayerIdx, isBettingRoundComplete, applyPlayerAction } from '../../utils/gameRules';
import { Bot, RefreshCw, Eye, Sparkles, Settings, Coins, Pause, Play, ArrowLeft, Zap } from 'lucide-react';

export default function PokerTable({ onUpdateBankroll, onGoBack }) {
  const [setupModalOpen, setSetupModalOpen] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
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

  const handleForceTurn = () => {
    if (currentStreet === 'showdown' || players.length === 0) return;
    
    setIsPaused(false);

    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }

    const activePlayers = players.filter(p => !p.isFolded);
    if (activePlayers.length <= 1) {
      handleSinglePlayerWin(activePlayers[0] || players[0]);
      return;
    }

    const playersWhoCanAct = activePlayers.filter(p => !p.isAllIn && p.chipCount > 0);
    const isBettingComplete = activePlayers.every(p => 
      p.isAllIn || (p.hasActed && p.currentBet === highestBet)
    );

    if (isBettingComplete || playersWhoCanAct.length <= 1) {
      setGameMessage('⚡ Waking engine: Advancing street...');
      progressStreet(players);
      return;
    }

    let targetIdx = currentTurnIdx;
    const activePlayer = players[targetIdx];
    if (!activePlayer || activePlayer.isFolded || activePlayer.isAllIn || activePlayer.chipCount <= 0) {
      targetIdx = findNextActivePlayerIdx(players, (currentTurnIdx + 1) % players.length);
      if (targetIdx === -1) {
        progressStreet(players);
        return;
      }
      setCurrentTurnIdx(targetIdx);
    }

    const validPlayer = players[targetIdx];

    if (validPlayer && !validPlayer.isHuman) {
      setGameMessage(`⚡ Woke up ${validPlayer.name}! Executing turn...`);
      const decision = makeAiDecision({
        bot: validPlayer,
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
        difficulty: validPlayer.difficulty || gameConfig.difficulty
      });
      handlePlayerAction(decision.action, decision.amount);
    } else {
      setGameMessage(`⚡ Woke turn: Action is on You (Hero)! Select your action below.`);
    }
  };

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
      if (p.chipCount <= 0) return { ...p, isFolded: true, holeCards: [], hasActed: true };
      const c1 = newDeck[deckIdx++];
      const c2 = newDeck[deckIdx++];
      return {
        ...p,
        holeCards: [c1, c2],
        isFolded: false,
        isAllIn: false,
        currentBet: 0,
        hasActed: false,
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
    if (updatedPlayers[sbIdx].chipCount <= 0) {
      updatedPlayers[sbIdx].chipCount = 0;
      updatedPlayers[sbIdx].isAllIn = true;
    }

    updatedPlayers[bbIdx].chipCount -= bbAmt;
    updatedPlayers[bbIdx].currentBet = bbAmt;
    updatedPlayers[bbIdx].lastAction = `BB $${bbAmt}`;
    if (updatedPlayers[bbIdx].chipCount <= 0) {
      updatedPlayers[bbIdx].chipCount = 0;
      updatedPlayers[bbIdx].isAllIn = true;
    }

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

    // Mark current player as having acted in this street
    newPlayers[currentTurnIdx].hasActed = true;

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

      if (newPlayers[currentTurnIdx].chipCount <= 0) {
        newPlayers[currentTurnIdx].chipCount = 0;
        newPlayers[currentTurnIdx].isAllIn = true;
        actionText = `${player.name} calls ALL-IN ($${callAmt})!`;
      }
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

      if (newPlayers[currentTurnIdx].chipCount <= 0) {
        newPlayers[currentTurnIdx].chipCount = 0;
        newPlayers[currentTurnIdx].isAllIn = true;
        actionText = `${player.name} goes ALL-IN for $${raiseTotal}!`;
      }

      // When a player raises, all other active non-allin players must respond
      newPlayers = newPlayers.map((p, idx) => 
        idx === currentTurnIdx || p.isFolded || p.isAllIn ? p : { ...p, hasActed: false }
      );
    }

    setPlayers(newPlayers);
    setPot(newPot);
    setHighestBet(newHighestBet);
    setMinRaise(newMinRaise);
    setGameMessage(actionText);

    advanceTurn(newPlayers, currentTurnIdx, newHighestBet);
  };

  const findNextActivePlayerIdx = (playersList, startIdx) => {
    for (let i = 0; i < playersList.length; i++) {
      const candidateIdx = (startIdx + i) % playersList.length;
      const p = playersList[candidateIdx];
      if (p && !p.isFolded && !p.isAllIn && p.chipCount > 0) {
        return candidateIdx;
      }
    }
    return -1;
  };

  const advanceTurn = (currentPlayersList, lastIdx, targetHighestBet) => {
    const activePlayers = currentPlayersList.filter(p => !p.isFolded);

    if (activePlayers.length <= 1) {
      handleSinglePlayerWin(activePlayers[0] || currentPlayersList[0]);
      return;
    }

    const playersWhoCanAct = activePlayers.filter(p => !p.isAllIn && p.chipCount > 0);

    const isBettingComplete = activePlayers.every(p => 
      p.isAllIn || (p.hasActed && p.currentBet === targetHighestBet)
    );

    if (isBettingComplete || playersWhoCanAct.length <= 1) {
      progressStreet(currentPlayersList);
    } else {
      const nextIdx = findNextActivePlayerIdx(currentPlayersList, (lastIdx + 1) % currentPlayersList.length);
      if (nextIdx === -1) {
        progressStreet(currentPlayersList);
      } else {
        setCurrentTurnIdx(nextIdx);
      }
    }
  };

  const progressStreet = (currentPlayersList) => {
    const resetBetsList = currentPlayersList.map(p => ({ ...p, currentBet: 0, hasActed: false }));
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

    const activePlayers = resetBetsList.filter(p => !p.isFolded);
    const playersWhoCanAct = activePlayers.filter(p => !p.isAllIn && p.chipCount > 0);

    // Auto-progress remaining streets if everyone is all-in
    if (playersWhoCanAct.length <= 1) {
      setTimeout(() => {
        progressStreet(resetBetsList);
      }, 700);
      return;
    }

    const nextIdx = findNextActivePlayerIdx(resetBetsList, (dealerIdx + 1) % resetBetsList.length);
    if (nextIdx === -1) {
      setTimeout(() => {
        progressStreet(resetBetsList);
      }, 700);
    } else {
      setCurrentTurnIdx(nextIdx);
    }
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
    if (isPaused || currentStreet === 'showdown' || players.length === 0) return;

    const activePlayer = players[currentTurnIdx];

    // Safety fallback: if turn lands on folded or all-in player, skip turn immediately
    if (activePlayer && (activePlayer.isFolded || activePlayer.isAllIn || activePlayer.chipCount <= 0)) {
      advanceTurn(players, currentTurnIdx, highestBet);
      return;
    }

    if (activePlayer && !activePlayer.isHuman) {
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
      }, 900);
    }

    return () => clearTimeout(aiTimeoutRef.current);
  }, [currentTurnIdx, currentStreet, players, isPaused]);

  const heroPlayer = players.find(p => p.isHuman);
  const isHeroTurn = players[currentTurnIdx]?.isHuman && currentStreet !== 'showdown' && !isPaused;

  return (
    <div className="relative w-full flex flex-col justify-between p-1 sm:p-2 space-y-2 font-sans max-w-5xl mx-auto">
      
      {/* Game Setup Modal */}
      <GameSetupModal
        isOpen={setupModalOpen}
        onStartGame={handleStartMatch}
        onClose={() => setSetupModalOpen(false)}
      />

      {/* Top Bar: Table Info, Go Back & Pause/Play Controls */}
      <div className="flex items-center justify-between gap-1.5 bg-slate-900/90 border border-amber-500/30 px-3 py-1.5 rounded-xl backdrop-blur-md shadow-xl text-xs font-bold text-slate-200">
        <div className="flex items-center space-x-2 text-[11px] sm:text-xs">
          {/* Go Back / Exit Button */}
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-amber-300 hover:text-amber-200 font-extrabold flex items-center space-x-1"
              title="Go Back to Academy"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <span className="flex items-center gap-1">
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <strong className="text-amber-300 uppercase font-black">{gameConfig.difficulty}</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span>Pot: <strong className="text-amber-300 font-black">${pot}</strong></span>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* WAKE BOT / FORCE TURN BUTTON */}
          <button
            onClick={handleForceTurn}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-[11px] font-black flex items-center space-x-1 transition-all shadow"
            title="Force turn / Wake up bot if game pauses"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>Wake Bot</span>
          </button>

          {/* PAUSE / PLAY TOGGLE */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-black flex items-center space-x-1 transition-all ${
              isPaused 
                ? 'bg-emerald-500 text-slate-950 shadow-lg animate-pulse' 
                : 'bg-slate-800 text-amber-300 border border-amber-500/30 hover:bg-slate-700'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>

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
        
        {/* Paused Game Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-40 rounded-[40px] sm:rounded-[100px] flex flex-col items-center justify-center space-y-3 p-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-xl font-black shadow-lg">
              ⏸
            </div>
            <h3 className="text-lg font-black text-white tracking-wide">GAME PAUSED</h3>
            <p className="text-xs text-slate-300 text-center max-w-xs">Take your time. The bots are waiting for you.</p>
            <button
              onClick={() => setIsPaused(false)}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center space-x-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>RESUME GAME</span>
            </button>
          </div>
        )}

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
      </div>

    </div>
  );
}
