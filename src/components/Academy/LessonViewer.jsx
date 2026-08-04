import React, { useState } from 'react';
import { Trophy, CheckCircle, ChevronRight, BookOpen, MapPin, Calculator, Award, Sparkles, ArrowRight, ShieldCheck, HelpCircle, AlertTriangle, Layers, Info } from 'lucide-react';
import HandRankingsGuide from './HandRankingsGuide';
import PositionsGuide from './PositionsGuide';
import PokerGlossary from './PokerGlossary';
import CardComponent from '../PokerTable/CardComponent';
import RangeVisualizer from '../Tools/RangeVisualizer';
import OddsCheatSheet from '../Tools/OddsCheatSheet';

export default function LessonViewer({ onNavigateToGame }) {
  const [activeModule, setActiveModule] = useState('mod-1');
  const [activeLesson, setActiveLesson] = useState('l-1-1');
  const [completedLessons, setCompletedLessons] = useState(new Set());

  const modules = [
    {
      id: 'mod-1',
      title: 'Module 1: Basics & Hand Rankings',
      desc: 'Master card hierarchy, kickers, and official 10 hand rankings.',
      icon: Trophy,
      lessons: [
        { id: 'l-1-1', title: '1.1 The Official 10 Hand Rankings' },
        { id: 'l-1-2', title: '1.2 Kickers, Tiebreakers & Split Pots' }
      ]
    },
    {
      id: 'mod-2',
      title: 'Module 2: Table Rules & Betting Flow',
      desc: 'Learn how a hand unfolds from Blinds through Flop, Turn, River, and Showdown.',
      icon: Sparkles,
      lessons: [
        { id: 'l-2-1', title: '2.1 Dealer Button & Forced Blinds' },
        { id: 'l-2-2', title: '2.2 The 4 Betting Streets' },
        { id: 'l-2-3', title: '2.3 Betting Actions & Side Pots' }
      ]
    },
    {
      id: 'mod-3',
      title: 'Module 3: Position & Table Geography',
      desc: 'Understand why position is the #1 strategic advantage in Texas Hold’em.',
      icon: MapPin,
      lessons: [
        { id: 'l-3-1', title: '3.1 6-Max Table Seats & Geography' },
        { id: 'l-3-2', title: '3.2 Why Position = Power' }
      ]
    },
    {
      id: 'mod-4',
      title: 'Module 4: Poker Math, Odds & EV',
      desc: 'Calculate Outs, Rule of 2 & 4, Pot Odds, and Expected Value (EV).',
      icon: Calculator,
      lessons: [
        { id: 'l-4-1', title: '4.1 Counting Outs & Rule of 2 and 4' },
        { id: 'l-4-2', title: '4.2 Pot Odds vs Hand Equity' }
      ]
    },
    {
      id: 'mod-5',
      title: 'Module 5: Starting Hand Strategy',
      desc: 'Pre-flop starting hand matrixes and position opening ranges.',
      icon: Award,
      lessons: [
        { id: 'l-5-1', title: '5.1 The 13x13 Hand Matrix' }
      ]
    },
    {
      id: 'mod-6',
      title: 'Module 6: Post-Flop Strategy & Bluffing',
      desc: 'Continuation betting, board textures, semi-bluffing, and tilt control.',
      icon: ShieldCheck,
      lessons: [
        { id: 'l-6-1', title: '6.1 Continuation Betting & Board Textures' },
        { id: 'l-6-2', title: '6.2 Semi-Bluffing & Mindset' }
      ]
    },
    {
      id: 'mod-7',
      title: 'Module 7: Master Poker Dictionary',
      desc: 'Searchable reference for 50+ key poker terms.',
      icon: BookOpen,
      lessons: [
        { id: 'l-7-1', title: '7.1 Searchable Poker Dictionary' }
      ]
    }
  ];

  const toggleComplete = (id) => {
    const next = new Set(completedLessons);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCompletedLessons(next);
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const progressPercent = Math.round((completedLessons.size / totalLessons) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4">
      
      {/* Luxury Casino Academy Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-widest">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>PokerMaster Academy</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Texas Hold'em Masterclass
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium leading-relaxed">
              Step-by-step interactive poker training course. Master hand rankings, table position, pot odds math, pre-flop ranges, and post-flop strategy.
            </p>
          </div>

          <button
            onClick={onNavigateToGame}
            className="self-start md:self-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
          >
            <span>Play vs Computer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs font-extrabold text-slate-300">
            <span>Course Progress:</span>
            <span className="text-amber-400">{completedLessons.size} of {totalLessons} Completed ({progressPercent}%)</span>
          </div>

          <div className="w-full sm:w-64 h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar: Modules & Lessons */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest px-1">Curriculum Modules</h3>
          <div className="space-y-2">
            {modules.map((mod) => {
              const isModActive = activeModule === mod.id;
              const Icon = mod.icon;
              return (
                <div key={mod.id} className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveModule(mod.id);
                      setActiveLesson(mod.lessons[0].id);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all ${
                      isModActive
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-lg'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2 font-extrabold text-xs text-white">
                      <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{mod.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium line-clamp-1 mt-1 pl-6">{mod.desc}</p>
                  </button>

                  {/* Sub-lessons */}
                  {isModActive && (
                    <div className="pl-4 space-y-1 pt-1 border-l-2 border-amber-500/30">
                      {mod.lessons.map((les) => {
                        const isLesActive = activeLesson === les.id;
                        const isDone = completedLessons.has(les.id);
                        return (
                          <button
                            key={les.id}
                            onClick={() => setActiveLesson(les.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all ${
                              isLesActive
                                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                                : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <span className="truncate">{les.title}</span>
                            {isDone && (
                              <CheckCircle className={`w-3.5 h-3.5 ${isLesActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Main Lesson Content Panel (Clean Formatted HTML) */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  {modules.find(m => m.id === activeModule)?.title}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {modules.flatMap(m => m.lessons).find(l => l.id === activeLesson)?.title}
                </h2>
              </div>

              <button
                onClick={() => toggleComplete(activeLesson)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all ${
                  completedLessons.has(activeLesson)
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{completedLessons.has(activeLesson) ? 'Completed' : 'Mark as Completed'}</span>
              </button>
            </div>

            {/* LESSON CONTENT - VISUAL BITE-SIZED BREAKDOWNS */}

            {/* Lesson 1.1: Official 10 Hand Rankings */}
            {activeLesson === 'l-1-1' && (
              <div className="space-y-6">
                
                {/* Poker in 30 Seconds Beginner Box */}
                <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 p-5 rounded-2xl border border-amber-500/30 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-black text-amber-300 uppercase tracking-widest">Poker in 30 Seconds (The Goal)</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs inline-flex items-center justify-center">1</span>
                      <h4 className="text-xs font-black text-white">Get 2 Private Cards</h4>
                      <p className="text-[11px] text-slate-400">Only you can see your 2 cards.</p>
                      <div className="flex justify-center space-x-1 pt-1">
                        <CardComponent card="A♠" size="sm" />
                        <CardComponent card="K♠" size="sm" />
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs inline-flex items-center justify-center">2</span>
                      <h4 className="text-xs font-black text-white">See 5 Shared Cards</h4>
                      <p className="text-[11px] text-slate-400">Everyone shares 5 cards on the table.</p>
                      <div className="flex justify-center space-x-1 pt-1">
                        <CardComponent card="Q♠" size="sm" />
                        <CardComponent card="J♠" size="sm" />
                        <CardComponent card="10♠" size="sm" />
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <span className="w-7 h-7 rounded-full bg-emerald-400 text-slate-950 font-black text-xs inline-flex items-center justify-center">3</span>
                      <h4 className="text-xs font-black text-emerald-300">Make Best 5-Card Hand</h4>
                      <p className="text-[11px] text-slate-400">Combine your 2 cards + 5 table cards.</p>
                      <div className="text-[10px] font-black text-amber-300 bg-amber-500/20 py-1 rounded border border-amber-500/40 mt-1">
                        🏆 Best 5 Cards Win The Pot!
                      </div>
                    </div>
                  </div>
                </div>

                <HandRankingsGuide />
              </div>
            )}

            {/* Lesson 1.2: Kickers & Tiebreakers */}
            {activeLesson === 'l-1-2' && (
              <div className="space-y-6">
                <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/20 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider">What if 2 Players Have the Same Pair?</h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    If two players both have a <strong>Pair of Aces</strong>, who wins? The player with the <strong>highest extra card (Kicker)</strong> wins all the money!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    
                    {/* Player A */}
                    <div className="bg-slate-900 p-4 rounded-xl border-2 border-emerald-500/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">Player A</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500 text-slate-950">👑 WINNER</span>
                      </div>
                      <div className="flex space-x-1.5 justify-center py-1">
                        <CardComponent card="A♠" size="sm" />
                        <CardComponent card="A♦" size="sm" />
                        <CardComponent card="K♣" size="sm" label="Kicker" />
                        <CardComponent card="7♥" size="sm" />
                        <CardComponent card="2♠" size="sm" />
                      </div>
                      <div className="text-[11px] text-emerald-300 font-bold text-center bg-emerald-500/10 py-1.5 rounded-lg border border-emerald-500/30">
                        Pair of Aces + <strong>King Kicker</strong>
                      </div>
                    </div>

                    {/* Player B */}
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 opacity-80">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-400">Player B</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-800 text-slate-400">LOST</span>
                      </div>
                      <div className="flex space-x-1.5 justify-center py-1">
                        <CardComponent card="A♣" size="sm" />
                        <CardComponent card="A♥" size="sm" />
                        <CardComponent card="10♦" size="sm" label="Kicker" />
                        <CardComponent card="5♠" size="sm" />
                        <CardComponent card="3♣" size="sm" />
                      </div>
                      <div className="text-[11px] text-slate-400 font-bold text-center bg-slate-800/50 py-1.5 rounded-lg border border-slate-700">
                        Pair of Aces + <strong>10 Kicker</strong> (King beats 10)
                      </div>
                    </div>

                  </div>

                  {/* 3 Simple Rules */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center space-y-1">
                      <span className="text-lg">🎯</span>
                      <h4 className="text-xs font-black text-amber-300">1. Highest Kicker</h4>
                      <p className="text-[10px] text-slate-400">Your extra high card breaks ties.</p>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center space-y-1">
                      <span className="text-lg">🤝</span>
                      <h4 className="text-xs font-black text-amber-300">2. Split Pot (Chop)</h4>
                      <p className="text-[10px] text-slate-400">If all 5 cards match, split the chips equally.</p>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center space-y-1">
                      <span className="text-lg">🚫</span>
                      <h4 className="text-xs font-black text-amber-300">3. Suits Don't Matter</h4>
                      <p className="text-[10px] text-slate-400">Spades are NOT stronger than Hearts.</p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Lesson 2.1 */}
            {activeLesson === 'l-2-1' && (
              <div className="space-y-6">
                <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/20 space-y-4">
                  <h3 className="text-sm font-black text-amber-300 uppercase tracking-widest">What are Blinds & Dealer Button?</h3>
                  <p className="text-xs text-slate-300">
                    To make sure people don't just sit and wait forever, two players must put chips in the pot <strong>before</strong> the cards are dealt!
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/30 text-center space-y-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-400 text-slate-950 font-black text-sm flex items-center justify-center mx-auto shadow">D</div>
                      <h4 className="text-xs font-black text-white">Dealer Button (BTN)</h4>
                      <p className="text-[11px] text-slate-400">The best position! You act LAST on every round.</p>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-purple-500/30 text-center space-y-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-black text-xs flex items-center justify-center mx-auto">SB</div>
                      <h4 className="text-xs font-black text-purple-300">Small Blind (SB)</h4>
                      <p className="text-[11px] text-slate-400">Pays half-sized forced bet (e.g. $10).</p>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-indigo-500/30 text-center space-y-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-black text-xs flex items-center justify-center mx-auto">BB</div>
                      <h4 className="text-xs font-black text-indigo-300">Big Blind (BB)</h4>
                      <p className="text-[11px] text-slate-400">Pays full forced bet (e.g. $20).</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lesson 2.2 */}
            {activeLesson === 'l-2-2' && (
              <div className="space-y-6">
                <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/20 space-y-4">
                  <h3 className="text-sm font-black text-amber-300 uppercase tracking-widest">The 4 Simple Rounds of a Poker Hand</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-xs">ROUND 1</span>
                        <h4 className="text-xs font-black text-white">Pre-Flop</h4>
                      </div>
                      <p className="text-[11px] text-slate-300">Everyone gets 2 private cards. First betting round.</p>
                      <div className="flex space-x-1 justify-center pt-1">
                        <CardComponent card="A♠" size="sm" />
                        <CardComponent card="K♠" size="sm" />
                      </div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-xs">ROUND 2</span>
                        <h4 className="text-xs font-black text-white">The Flop</h4>
                      </div>
                      <p className="text-[11px] text-slate-300">3 shared cards dealt face-up on table. 2nd betting round.</p>
                      <div className="flex space-x-1 justify-center pt-1">
                        <CardComponent card="Q♠" size="sm" />
                        <CardComponent card="J♠" size="sm" />
                        <CardComponent card="4♦" size="sm" />
                      </div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-xs">ROUND 3</span>
                        <h4 className="text-xs font-black text-white">The Turn</h4>
                      </div>
                      <p className="text-[11px] text-slate-300">1 more shared card dealt (4 total). 3rd betting round.</p>
                      <div className="flex space-x-1 justify-center pt-1">
                        <CardComponent card="10♠" size="sm" />
                      </div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-xs">ROUND 4</span>
                        <h4 className="text-xs font-black text-white">The River & Showdown</h4>
                      </div>
                      <p className="text-[11px] text-slate-300">Final shared card dealt (5 total). Final bets, then show cards!</p>
                      <div className="flex space-x-1 justify-center pt-1">
                        <CardComponent card="2♣" size="sm" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Lesson 2.3 */}
            {activeLesson === 'l-2-3' && (
              <div className="space-y-6">
                <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/20 space-y-4">
                  <h3 className="text-sm font-black text-amber-300 uppercase tracking-widest">What Can You Do on Your Turn?</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { action: 'FOLD', emoji: '❌', color: 'border-rose-500/40 text-rose-400', desc: 'Give up cards & leave hand.' },
                      { action: 'CHECK', emoji: '🖐️', color: 'border-blue-500/40 text-blue-400', desc: 'Pass turn without placing chips.' },
                      { action: 'CALL', emoji: '✅', color: 'border-emerald-500/40 text-emerald-400', desc: 'Match the current bet size.' },
                      { action: 'RAISE', emoji: '🚀', color: 'border-amber-500/40 text-amber-400', desc: 'Increase bet size.' },
                      { action: 'ALL-IN', emoji: '💥', color: 'border-purple-500/40 text-purple-300', desc: 'Put ALL your chips in!' }
                    ].map((act, i) => (
                      <div key={i} className={`bg-slate-900 p-4 rounded-xl border ${act.color} space-y-1 text-center`}>
                        <span className="text-xl block">{act.emoji}</span>
                        <h4 className={`text-xs font-black ${act.color}`}>{act.action}</h4>
                        <p className="text-[10px] text-slate-400 leading-tight">{act.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Lesson 3.1 & 3.2: Position */}
            {(activeLesson === 'l-3-1' || activeLesson === 'l-3-2') && (
              <PositionsGuide />
            )}

            {/* Lesson 4.1 & 4.2: Math */}
            {(activeLesson === 'l-4-1' || activeLesson === 'l-4-2') && (
              <div className="space-y-6">
                <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/20 space-y-4">
                  <h3 className="text-sm font-black text-amber-300 uppercase tracking-widest">Easy Shortcut Math: Rule of 2 & 4</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/30 space-y-2 text-center">
                      <span className="text-2xl">⚡</span>
                      <h4 className="text-xs font-black text-amber-300">Flop Math (Multiply by 4)</h4>
                      <p className="text-[11px] text-slate-300">If you have 9 cards that complete your flush:</p>
                      <div className="text-xs font-black text-emerald-400 bg-slate-950 py-2 rounded-lg border border-slate-800">
                        9 Cards × 4 = 36% Chance to Win!
                      </div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/30 space-y-2 text-center">
                      <span className="text-2xl">🎯</span>
                      <h4 className="text-xs font-black text-amber-300">Turn Math (Multiply by 2)</h4>
                      <p className="text-[11px] text-slate-300">If only 1 card left to come:</p>
                      <div className="text-xs font-black text-emerald-400 bg-slate-950 py-2 rounded-lg border border-slate-800">
                        9 Cards × 2 = 18% Chance to Win!
                      </div>
                    </div>
                  </div>
                </div>

                <OddsCheatSheet />
              </div>
            )}

            {/* Lesson 5.1: Starting Hands */}
            {activeLesson === 'l-5-1' && (
              <RangeVisualizer />
            )}

            {/* Lesson 6.1 & 6.2: Postflop Strategy */}
            {(activeLesson === 'l-6-1' || activeLesson === 'l-6-2') && (
              <div className="space-y-6">
                <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/20 space-y-4">
                  <h3 className="text-sm font-black text-amber-300 uppercase tracking-widest">Simple Post-Flop Rule</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/30 space-y-2">
                      <span className="text-xs font-black text-emerald-400">Dry Boards (Safe)</span>
                      <div className="flex space-x-1 py-1">
                        <CardComponent card="A♠" size="sm" />
                        <CardComponent card="8♦" size="sm" />
                        <CardComponent card="2♣" size="sm" />
                      </div>
                      <p className="text-[11px] text-slate-300">Hard for opponents to connect. Bet small to win pot!</p>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-rose-500/30 space-y-2">
                      <span className="text-xs font-black text-rose-400">Wet Boards (Dangerous)</span>
                      <div className="flex space-x-1 py-1">
                        <CardComponent card="J♥" size="sm" />
                        <CardComponent card="10♥" size="sm" />
                        <CardComponent card="9♦" size="sm" />
                      </div>
                      <p className="text-[11px] text-slate-300">Lots of straight & flush draws. Bet bigger to protect your hand!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lesson 7.1: Dictionary */}
            {activeLesson === 'l-7-1' && (
              <PokerGlossary />
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
