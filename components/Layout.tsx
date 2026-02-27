
import React from 'react';
import { Home, MessageCircle, Calendar, Sparkles, Moon, RotateCcw } from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
  onReset?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, onReset }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'coach', icon: MessageCircle, label: 'RAMA' },
    { id: 'planner', icon: Calendar, label: 'Tantangan' },
    { id: 'map', icon: Sparkles, label: 'Jejak' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f1]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-24 bg-white/80 backdrop-blur-md border-r border-emerald-100/50 items-center py-10 z-50 shadow-sm">
        <div className="mb-12">
          <div className="w-14 h-14 rounded-3xl bg-[#7a9482] flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/10">SR</div>
        </div>
        <nav className="flex flex-col gap-8 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`p-4 rounded-2xl transition-all duration-300 ${currentView === item.id ? 'bg-[#7a9482] text-white shadow-md' : 'text-slate-400 hover:text-[#7a9482]'}`}
              title={item.label}
            >
              <item.icon size={22} />
            </button>
          ))}
          <button
              onClick={() => setView('reflection')}
              className={`p-4 rounded-2xl transition-all duration-300 ${currentView === 'reflection' ? 'bg-[#7a9482] text-white shadow-md' : 'text-slate-400 hover:text-[#7a9482]'}`}
              title="Refleksi"
            >
              <Moon size={22} />
            </button>
        </nav>

        <button
          onClick={onReset}
          className="p-4 rounded-2xl text-slate-300 hover:text-rose-400 transition-colors mt-auto mb-4"
          title="Reset Aplikasi"
        >
          <RotateCcw size={22} />
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:pl-24 pb-32 md:pb-12 pt-6 px-4 md:px-12">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <nav className="glass rounded-[2.5rem] p-3 flex justify-between items-center shadow-2xl border-white/60">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-[2rem] transition-all duration-500 ${currentView === item.id ? 'bg-[#7a9482] text-white shadow-lg' : 'text-slate-500'}`}
            >
              <item.icon size={20} strokeWidth={currentView === item.id ? 2.5 : 2} />
              <span className="text-[8px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setView('reflection')}
            className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-[2rem] transition-all duration-500 ${currentView === 'reflection' ? 'bg-[#7a9482] text-white shadow-lg' : 'text-slate-500'}`}
          >
            <Moon size={20} />
            <span className="text-[8px] font-bold uppercase tracking-widest">Tenang</span>
          </button>
          <button
            onClick={onReset}
            className="flex flex-col items-center gap-1 flex-1 py-2 text-rose-300/80"
          >
            <RotateCcw size={20} />
            <span className="text-[8px] font-bold uppercase tracking-widest">Reset</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
