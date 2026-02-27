
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, MessageCircle, Moon, Sun, Star, RefreshCw } from 'lucide-react';
import { UserProfile, DayProgress, AppView } from '../types';
import { getPrayerTimes } from '../services/gemini';

interface HomeProps {
  profile: UserProfile;
  day: number;
  progress: DayProgress[];
  setView: (view: AppView) => void;
}

const Home: React.FC<HomeProps> = ({ profile, day, progress, setView }) => {
  const [times, setTimes] = useState<any>(null);
  const [isLoadingTimes, setIsLoadingTimes] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const currentProgress = progress.find(p => p.day === day);
  const completedTasks = currentProgress?.tasks.filter(t => t.completed).length || 0;
  const totalTasks = currentProgress?.tasks.length || 0;

  // Live Clock Effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTimes = async () => {
    setIsLoadingTimes(true);
    try {
      const data = await getPrayerTimes(profile.city, day, profile.location);
      setTimes(data);
    } catch (error) {
      console.error("Failed to fetch prayer times", error);
    } finally {
      setIsLoadingTimes(false);
    }
  };

  useEffect(() => {
    fetchTimes();
  }, [profile.city, day, profile.location]);

  const timeString = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header with Clock Integration */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                <Star size={10} className="fill-white" /> Day {day} Ramadhan
             </div>
             <div className="text-slate-400 text-xs font-bold flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full border border-white/40">
                <Clock size={12} /> {timeString}
             </div>
          </div>
          <h1 className="text-4xl font-extrabold text-[#5a7362] tracking-tight">
            Salam, <span className="text-slate-800">Sahabatku {profile.name}</span>
          </h1>
          <p className="text-slate-500 font-medium italic opacity-80">Panduan Ibadah Presisi & Spiritual</p>
        </div>
        
        <div className="flex items-center gap-2 text-slate-500 bg-white border border-emerald-100/50 px-5 py-3 rounded-2xl shadow-sm">
          <MapPin size={16} className="text-[#7a9482]" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-slate-300 tracking-tighter">Lokasi Terkini</span>
            <span className="text-sm font-bold text-slate-700">{profile.city}</span>
          </div>
        </div>
      </div>

      {/* Hero Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bento-card p-10 rounded-[3rem] relative overflow-hidden flex flex-col justify-between min-h-[260px] border-none bg-gradient-to-br from-white to-emerald-50/30">
          <div className="relative z-10 space-y-2">
            <span className="text-[10px] font-black text-emerald-800/30 uppercase tracking-[0.2em]">Capaian Spiritual</span>
            <h2 className="text-2xl font-bold text-slate-800">Cahaya Kebaikan di <br/>Setiap Langkahmu</h2>
          </div>
          <div className="relative z-10 pt-6">
            <div className="flex justify-between items-end mb-3">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-widest">{completedTasks}/{totalTasks} Amalan</span>
              <span className="text-4xl font-black text-[#7a9482]">{totalTasks > 0 ? Math.round((completedTasks/totalTasks)*100) : 0}<small className="text-lg font-bold opacity-50">%</small></span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
              <div 
                className="h-full sage-gradient rounded-full transition-all duration-1000" 
                style={{ width: `${totalTasks > 0 ? (completedTasks/totalTasks)*100 : 0}%` }}
              />
            </div>
          </div>
          <div className="absolute top-[-40px] right-[-40px] opacity-[0.04] animate-float pointer-events-none">
            <Moon size={280} />
          </div>
        </div>

        <button 
          onClick={() => setView('coach')}
          className="sage-gradient p-10 rounded-[3rem] text-white flex flex-col justify-between hover:scale-[1.02] transition-all active:scale-95 group shadow-xl shadow-emerald-900/10"
        >
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:rotate-6 transition-transform">
            <MessageCircle size={28} />
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-bold mb-1">RAMA AI</h3>
            <p className="text-emerald-50/70 text-sm italic font-medium">Bicara dari hati ke hati</p>
          </div>
        </button>
      </div>

      {/* Menu Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { id: 'planner', label: 'Tantangan', sub: 'Harian', color: 'bg-emerald-50 text-emerald-600' },
          { id: 'learning', label: 'Hikmah', sub: 'Micro-Learning', color: 'bg-blue-50 text-blue-600' },
          { id: 'chef', label: 'Dapur', sub: 'Nutrisi Sahur', color: 'bg-orange-50 text-orange-600' },
          { id: 'quiz', label: 'Kuis', sub: 'Asah Wawasan', color: 'bg-purple-50 text-purple-600' }
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => setView(item.id as AppView)}
            className="bento-card p-6 rounded-[2.5rem] flex flex-col items-center text-center group active:scale-95"
          >
            <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
              <Calendar size={22} />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">{item.label}</h4>
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">{item.sub}</span>
          </button>
        ))}
      </div>

      {/* High-Precision Prayer Times */}
      <div className="bg-white rounded-[3rem] p-10 border border-emerald-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-10 relative z-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner">
               <Clock size={24} />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-800">Jadwal Ibadah</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Real-time Location Based</p>
             </div>
          </div>
          <button 
            onClick={fetchTimes}
            disabled={isLoadingTimes}
            className={`p-4 bg-slate-50 text-slate-400 hover:text-[#7a9482] hover:bg-white hover:shadow-md rounded-2xl transition-all ${isLoadingTimes ? 'animate-pulse' : ''}`}
            title="Update Jadwal"
          >
            <RefreshCw size={20} className={`${isLoadingTimes ? 'animate-spin text-[#7a9482]' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-5 relative z-10">
          {isLoadingTimes ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 bg-slate-50 rounded-[2rem] animate-pulse border border-slate-100" />
            ))
          ) : (
            [
              { label: 'Imsak', time: times?.imsak, icon: Moon, active: false },
              { label: 'Subuh', time: times?.subuh, icon: null, active: false },
              { label: 'Dzuhur', time: times?.dzuhur, icon: null, active: false },
              { label: 'Ashar', time: times?.ashar, icon: null, active: false },
              { label: 'Maghrib', time: times?.maghrib, icon: Sun, active: true },
              { label: 'Isya', time: times?.isya, icon: null, active: false }
            ].map((p) => (
              <div 
                key={p.label} 
                className={`p-6 rounded-[2.5rem] border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  p.active 
                    ? 'bg-[#7a9482] border-emerald-600 text-white shadow-lg shadow-emerald-900/20 scale-105 z-20' 
                    : 'bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-white hover:border-[#7a9482]/30'
                }`}
              >
                <span className={`text-[9px] font-black uppercase tracking-widest ${p.active ? 'text-white/70' : 'text-slate-300'}`}>{p.label}</span>
                <span className="text-lg font-black tracking-tight">{p.time || '--:--'}</span>
                {p.icon && <p.icon size={14} className={`mt-1 ${p.active ? 'text-yellow-300 animate-pulse' : 'text-slate-200'}`} />}
              </div>
            ))
          )}
        </div>
        
        {/* BG Decoration */}
        <div className="absolute top-[-10%] right-[-5%] opacity-[0.03] pointer-events-none">
           <Sun size={300} />
        </div>
      </div>
    </div>
  );
};

export default Home;
