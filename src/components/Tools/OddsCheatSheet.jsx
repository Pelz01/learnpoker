import React from 'react';
import { Calculator } from 'lucide-react';

export default function OddsCheatSheet() {
  const oddsData = [
    { draw: 'Flush Draw (4 same suit)', outs: 9, flopEq: '36%', turnEq: '18%', ratio: '1.9:1' },
    { draw: 'Open-Ended Straight Draw (OESD)', outs: 8, flopEq: '31.5%', turnEq: '17%', ratio: '2.2:1' },
    { draw: 'Flush + Open-Ended Straight Draw (Monster Draw)', outs: 15, flopEq: '54%', turnEq: '32%', ratio: '0.8:1' },
    { draw: 'Inside Straight Draw (Gutshot)', outs: 4, flopEq: '16.5%', turnEq: '8.5%', ratio: '5:1' },
    { draw: 'Two Overcards to Board', outs: 6, flopEq: '24%', turnEq: '13%', ratio: '3.1:1' },
    { draw: 'Pocket Pair to Set (3 of a kind)', outs: 2, flopEq: '8.4%', turnEq: '4.3%', ratio: '11:1' },
    { draw: 'Set to Full House or Quads', outs: 7, flopEq: '28%', turnEq: '15%', ratio: '2.5:1' }
  ];

  return (
    <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-4 sm:p-8 shadow-2xl space-y-6 max-w-4xl mx-auto">
      
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-amber-400" />
          Pot Odds & Draw Outs Cheat Sheet
        </h2>
        <p className="text-xs text-slate-400">Instant lookup for common drawing hands and required pot odds ratios</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-amber-400 font-extrabold uppercase text-[10px]">
            <tr>
              <th className="p-3">Drawing Hand Type</th>
              <th className="p-3">Outs</th>
              <th className="p-3">Flop to River %</th>
              <th className="p-3">Turn to River %</th>
              <th className="p-3">Fair Pot Odds</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {oddsData.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-950/60 transition-colors">
                <td className="p-3 font-bold text-white">{item.draw}</td>
                <td className="p-3 font-extrabold text-amber-300">{item.outs} Outs</td>
                <td className="p-3 font-semibold text-emerald-400">{item.flopEq}</td>
                <td className="p-3 font-semibold text-slate-300">{item.turnEq}</td>
                <td className="p-3 font-bold text-amber-400">{item.ratio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
