
import React, { useState } from 'react';
import { User, Briefcase, Sparkles, ArrowRight, MapPin } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && occupation.trim() && city.trim()) {
      onComplete({ name, occupation, city });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-6 overflow-y-auto">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-100 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-[-10%] w-64 h-64 bg-amber-50 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-1000 relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-200 animate-float">
            <Sparkles size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold mb-3 text-slate-900 tracking-tight">SI RAMA</h1>
          <p className="text-slate-400 text-sm font-medium italic">Sahabat AI yang menemani Ramadhanmu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Siapa Namamu?</label>
            <div className="relative">
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Panggilan akrab..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 font-medium placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kesibukan Utama?</label>
            <div className="relative">
              <input
                required
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="Misal: Pelajar, Bekerja, dll..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 font-medium placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Domisili Kota?</label>
            <div className="relative">
              <input
                required
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Untuk jadwal ibadah..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 font-medium placeholder:text-slate-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-700 text-white py-5 rounded-[2rem] font-bold text-base hover:bg-emerald-800 hover:shadow-xl hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2 group mt-4 active:scale-95"
          >
            Mulai Perjalanan Teduh
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        
        <p className="text-center text-[10px] text-slate-300 mt-10 font-bold uppercase tracking-widest">
          © 2025 SI RAMA • Powered by RAMA AI
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
