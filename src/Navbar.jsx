import React from 'react';
import { Scissors, Calendar } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView }) {
  return (
    <header className="border-b border-zinc-800 bg-[#0f0f0f]/90 backdrop-blur sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('home')}>
        <div className="p-2 border border-amber-500/50 bg-amber-500/10 text-amber-400 rounded">
          <Scissors size={20} />
        </div>
        <div>
          <span className="font-bold tracking-widest text-lg block text-white">BARBER CLUB</span>
          <span className="text-[10px] tracking-widest text-amber-500 uppercase">Estilo & Tradición</span>
        </div>
      </div>

      <button
        onClick={() => setCurrentView(currentView === 'home' ? 'panel' : 'home')}
        className="flex items-center space-x-2 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded text-xs transition uppercase tracking-wider font-medium"
      >
        <Calendar size={14} className="text-amber-500" />
        <span>{currentView === 'home' ? 'Panel de barberos' : 'Ver web principal'}</span>
      </button>
    </header>
  );
}
