import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, HelpCircle, RefreshCw, Trophy } from 'lucide-react';
import CardComponent from '../PokerTable/CardComponent';
import { HAND_BATTLE_QUIZZES, OUTS_MATH_QUIZZES, PREFLOP_POSITION_QUIZZES } from '../../utils/quizzesData';
import { soundEffects } from '../../utils/audioService';

export default function QuizContainer() {
  const [activeCategory, setActiveCategory] = useState('hand-battle'); // 'hand-battle', 'outs-math', 'preflop'
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const getQuizList = () => {
    if (activeCategory === 'outs-math') return OUTS_MATH_QUIZZES;
    if (activeCategory === 'preflop') return PREFLOP_POSITION_QUIZZES;
    return HAND_BATTLE_QUIZZES;
  };

  const quizzes = getQuizList();
  const current = quizzes[quizIdx] || quizzes[0];

  const handleSelectOption = (idxOrAnswer) => {
    if (selectedOption !== null) return;
    setSelectedOption(idxOrAnswer);
    setAnsweredCount(prev => prev + 1);

    let isCorrect = false;
    if (activeCategory === 'hand-battle') {
      isCorrect = idxOrAnswer === current.correctWinner;
    } else if (activeCategory === 'outs-math') {
      isCorrect = idxOrAnswer === current.correctIndex;
    } else if (activeCategory === 'preflop') {
      isCorrect = idxOrAnswer === current.correctIndex;
    }

    if (isCorrect) {
      soundEffects.playWin();
      setScore(prev => prev + 1);
    } else {
      soundEffects.playFold();
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (quizIdx + 1 < quizzes.length) {
      setQuizIdx(quizIdx + 1);
    } else {
      setQuizIdx(0);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-4 sm:p-8 shadow-2xl space-y-6 max-w-4xl mx-auto">
      
      {/* Header & Category Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Interactive Training Drills & Quizzes
          </h2>
          <p className="text-xs text-slate-400">Test your hand evaluation, odds math, and pre-flop position skills</p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <span className="text-xs font-bold text-slate-400 px-2">Score:</span>
          <span className="text-sm font-extrabold text-amber-300 px-3 py-1 bg-amber-500/20 rounded-xl border border-amber-500/30">
            {score} / {answeredCount}
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: 'hand-battle', label: 'Showdown Battles' },
          { id: 'outs-math', label: 'Outs & Pot Odds Math' },
          { id: 'preflop', label: 'Pre-Flop Position' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setQuizIdx(0);
              setSelectedOption(null);
            }}
            className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all text-center ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Quiz Body */}
      <div className="bg-slate-950 border border-amber-500/20 rounded-2xl p-5 sm:p-6 space-y-6">
        
        {/* Title & Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold text-amber-400">Question #{quizIdx + 1} of {quizzes.length}</span>
          <span>{current.title}</span>
        </div>

        {/* 1. HAND BATTLE SPECIFIC UI */}
        {activeCategory === 'hand-battle' && (
          <div className="space-y-6 text-center">
            
            {/* Community Board Cards */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Community Board</span>
              <div className="flex justify-center space-x-2">
                {current.board.map((c, i) => (
                  <CardComponent key={i} card={c} size="md" />
                ))}
              </div>
            </div>

            {/* Players Hands comparison */}
            <div className="grid grid-cols-2 gap-4">
              
              <div
                onClick={() => handleSelectOption('Player A')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedOption === 'Player A'
                    ? current.correctWinner === 'Player A'
                      ? 'bg-emerald-950/60 border-emerald-400 ring-4 ring-emerald-400/30'
                      : 'bg-rose-950/60 border-rose-400 ring-4 ring-rose-400/30'
                    : 'bg-slate-900 border-slate-800 hover:border-amber-400'
                }`}
              >
                <span className="text-xs font-extrabold text-amber-300 block mb-2">{current.playerA.name}</span>
                <div className="flex justify-center space-x-2">
                  <CardComponent card={current.playerA.hand[0]} size="sm" />
                  <CardComponent card={current.playerA.hand[1]} size="sm" />
                </div>
              </div>

              <div
                onClick={() => handleSelectOption('Player B')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedOption === 'Player B'
                    ? current.correctWinner === 'Player B'
                      ? 'bg-emerald-950/60 border-emerald-400 ring-4 ring-emerald-400/30'
                      : 'bg-rose-950/60 border-rose-400 ring-4 ring-rose-400/30'
                    : 'bg-slate-900 border-slate-800 hover:border-amber-400'
                }`}
              >
                <span className="text-xs font-extrabold text-amber-300 block mb-2">{current.playerB.name}</span>
                <div className="flex justify-center space-x-2">
                  <CardComponent card={current.playerB.hand[0]} size="sm" />
                  <CardComponent card={current.playerB.hand[1]} size="sm" />
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. OUTS & POT ODDS MATH SPECIFIC UI */}
        {activeCategory === 'outs-math' && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-white leading-relaxed">{current.scenario}</p>

            <div className="grid grid-cols-2 gap-3">
              {current.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === current.correctIndex;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3 rounded-xl border text-xs font-extrabold text-left transition-all ${
                      selectedOption !== null
                        ? isCorrect
                          ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                          : isSelected
                          ? 'bg-rose-950/80 border-rose-400 text-rose-200'
                          : 'bg-slate-900 border-slate-800 opacity-50'
                        : 'bg-slate-900 border-slate-800 text-white hover:border-amber-400'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. PREFLOP POSITION SPECIFIC UI */}
        {activeCategory === 'preflop' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Position</span>
                <span className="text-sm font-black text-amber-300">{current.position}</span>
              </div>

              <div className="flex space-x-2">
                <CardComponent card={current.hand[0]} size="sm" />
                <CardComponent card={current.hand[1]} size="sm" />
              </div>
            </div>

            <p className="text-xs text-slate-300 font-medium">{current.scenario}</p>

            <div className="grid grid-cols-3 gap-2">
              {current.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === current.correctIndex;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`py-3 px-2 rounded-xl border text-xs font-extrabold text-center transition-all ${
                      selectedOption !== null
                        ? isCorrect
                          ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                          : isSelected
                          ? 'bg-rose-950/80 border-rose-400 text-rose-200'
                          : 'bg-slate-900 border-slate-800 opacity-50'
                        : 'bg-slate-900 border-slate-800 text-white hover:border-amber-400'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Feedback & Explanation Box */}
        {selectedOption !== null && (
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-extrabold text-amber-300">Detailed Explanation:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{current.explanation}</p>

            <button
              onClick={handleNext}
              className="mt-2 py-2 px-6 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow hover:brightness-110"
            >
              Next Drill →
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
