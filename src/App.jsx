import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LessonViewer from './components/Academy/LessonViewer';
import PokerTable from './components/PokerTable/PokerTable';
import QuizContainer from './components/Drills/QuizContainer';
import EquityCalculator from './components/Tools/EquityCalculator';
import RangeVisualizer from './components/Tools/RangeVisualizer';
import OddsCheatSheet from './components/Tools/OddsCheatSheet';
import PokerGlossary from './components/Academy/PokerGlossary';

export default function App() {
  const [activeTab, setActiveTab] = useState('academy'); // 'academy', 'poker-table', 'drills', 'tools', 'glossary'
  const [bankroll, setBankroll] = useState(1000);
  const [toolSubTab, setToolSubTab] = useState('equity'); // 'equity', 'matrix', 'cheatsheet'

  // Aggressive Preloading of high-res card assets to ensure instant rendering
  useEffect(() => {
    const suits = ['spade', 'heart', 'diamond', 'club'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
    
    // Preload back first
    const back = new Image();
    back.src = '/cards/back-blue.png';
    
    // Preload all faces in background
    setTimeout(() => {
      suits.forEach(suit => {
        ranks.forEach(rank => {
          const img = new Image();
          img.src = `/cards/${suit}_${rank}.png`;
        });
      });
    }, 500); // Slight delay so it doesn't block initial UI paint
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950 font-sans">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bankroll={bankroll}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Tab 1: Poker Academy */}
        {activeTab === 'academy' && (
          <LessonViewer onNavigateToGame={() => setActiveTab('poker-table')} />
        )}

        {/* Tab 2: Play vs AI Computer */}
        {activeTab === 'poker-table' && (
          <PokerTable onUpdateBankroll={(newBankroll) => setBankroll(newBankroll)} />
        )}

        {/* Tab 3: Interactive Practice Drills */}
        {activeTab === 'drills' && (
          <QuizContainer />
        )}

        {/* Tab 4: Strategy Tools */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            
            {/* Tools Subnav */}
            <div className="flex justify-center space-x-2 max-w-md mx-auto bg-slate-900/60 backdrop-blur-md p-2 rounded-3xl border border-amber-500/20 shadow-xl">
              <button
                onClick={() => setToolSubTab('equity')}
                className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black transition-all duration-300 ${
                  toolSubTab === 'equity'
                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30'
                    : 'text-slate-400 hover:text-white glass-button'
                }`}
              >
                Equity Calc
              </button>
              <button
                onClick={() => setToolSubTab('matrix')}
                className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black transition-all duration-300 ${
                  toolSubTab === 'matrix'
                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30'
                    : 'text-slate-400 hover:text-white glass-button'
                }`}
              >
                Range Matrix
              </button>
              <button
                onClick={() => setToolSubTab('cheatsheet')}
                className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black transition-all duration-300 ${
                  toolSubTab === 'cheatsheet'
                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30'
                    : 'text-slate-400 hover:text-white glass-button'
                }`}
              >
                Cheat Sheet
              </button>
            </div>

            {toolSubTab === 'equity' && <EquityCalculator />}
            {toolSubTab === 'matrix' && <RangeVisualizer />}
            {toolSubTab === 'cheatsheet' && <OddsCheatSheet />}
          </div>
        )}

        {/* Tab 5: Complete Dictionary */}
        {activeTab === 'glossary' && (
          <PokerGlossary />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40 backdrop-blur-lg py-8 text-center text-xs text-slate-500 space-y-2 mt-auto">
        <p className="font-display font-black text-slate-400 tracking-wider">POKERMASTER ACADEMY & AI SIMULATOR</p>
        <p className="font-medium">Built with React, Vite & Web Audio API for Mobile, iPad, and Desktop.</p>
      </footer>

    </div>
  );
}
