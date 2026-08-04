import React, { useState } from 'react';
import { Search, BookOpen, Filter } from 'lucide-react';
import { POKER_GLOSSARY_TERMS } from '../../utils/lessonsData';

export default function PokerGlossary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Action', 'Rules', 'Strategy', 'Position', 'Math', 'Board', 'Hand', 'Psychology', 'Game', 'Draw'];

  const filteredTerms = POKER_GLOSSARY_TERMS.filter((item) => {
    const matchesSearch = item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            Complete Poker Glossary & Dictionary
          </h2>
          <p className="text-xs text-slate-400">Searchable reference for 50+ official poker terms and jargon</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search terms (e.g. Nut, EV, C-bet)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 outline-none"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 p-4 rounded-xl space-y-1.5 transition-all"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-amber-300">{item.term}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.definition}</p>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-slate-500 text-xs">
            No poker terms match your search filter.
          </div>
        )}
      </div>

    </div>
  );
}
