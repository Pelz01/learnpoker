import React, { useState } from 'react';
import { Trophy, Play, Award, Calculator, BookOpen, Volume2, VolumeX, Menu, X, Coins, ArrowLeft } from 'lucide-react';
import { soundEffects } from '../utils/audioService';

export default function Navbar({ activeTab, setActiveTab, bankroll = 1000 }) {
  const [isMuted, setIsMuted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleToggleMute = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
  };

  const navItems = [
    { id: 'academy', label: 'Academy', icon: Trophy },
    { id: 'poker-table', label: 'Play vs AI', icon: Play, badge: 'PRO' },
    { id: 'drills', label: 'Drills', icon: Award },
    { id: 'tools', label: 'Tools', icon: Calculator },
    { id: 'glossary', label: 'Glossary', icon: BookOpen }
  ];

  return (
    <div className={`w-full max-w-7xl mx-auto z-50 sticky top-0 ${activeTab === 'poker-table' ? 'pt-1 px-2' : 'pt-3 px-3 sm:px-6 lg:px-8'}`}>
      <header className="glass-panel-amber rounded-2xl sm:rounded-3xl transition-all duration-300">
        <div className="px-3 sm:px-6 h-12 sm:h-16 flex items-center justify-between">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('academy')}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-[2px] shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <span className="text-base sm:text-xl font-display font-black text-gradient-gold">♠</span>
              </div>
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-display font-black tracking-tight text-white flex items-center gap-1.5">
                Poker<span className="text-amber-400">Master</span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all overflow-hidden group ${
                    isActive
                      ? 'text-amber-300'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {isActive && <div className="absolute inset-0 bg-amber-500/10 border border-amber-500/30 rounded-xl" />}
                  {!isActive && <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-xl transition-all" />}
                  
                  <Icon className={`w-4 h-4 z-10 transition-colors ${isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-300'}`} />
                  <span className="z-10">{item.label}</span>
                  {item.badge && (
                    <span className="z-10 text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30 tracking-widest uppercase">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Bankroll indicator */}
            <div className="flex items-center space-x-1.5 bg-slate-950/80 border border-amber-500/30 px-3 py-1 rounded-full text-xs shadow-inner">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-display font-black text-amber-300">${bankroll.toLocaleString()}</span>
            </div>

            {/* Mute Button */}
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-xl glass-button text-slate-300 hover:text-white"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl glass-button text-amber-400 border border-amber-500/30"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5 text-amber-400" />}
            </button>
          </div>

        </div>

        {/* Mobile Slide-Out Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden p-4 space-y-2 border-t border-amber-500/20 bg-slate-950/95 backdrop-blur-xl rounded-b-2xl animate-in slide-in-from-top-2">
            <p className="text-[10px] font-black uppercase text-amber-400 tracking-widest mb-1 px-1">Navigation Menu</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                    isActive ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow' : 'text-slate-300 hover:bg-slate-900 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>
    </div>
  );
}
