
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Award, Trophy, Loader2, Sparkles, BookOpen, Utensils, Moon, MessageCircle, HelpCircle } from 'lucide-react';
import { DayProgress, UserProfile, ActivityStats } from '../types';
import { generateBlessingSummary } from '../services/gemini';

interface JejakKeberkahanProps {
  progress: DayProgress[];
  currentDay: number;
  profile: UserProfile;
  stats: ActivityStats;
}

const JejakKeberkahan: React.FC<JejakKeberkahanProps> = ({ progress, currentDay, profile, stats }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const completedTasks = progress.reduce((acc, p) => acc + p.tasks.filter(t => t.completed).length, 0);
  const totalInteractions = completedTasks + stats.quizzesAnswered + stats.storiesRead + stats.recipesGenerated + stats.reflectionsCount + stats.adviceConsultations;

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      try {
        const res = await generateBlessingSummary(profile.name, completedTasks, stats, currentDay);
        setSummary(res || '');
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (totalInteractions > 0) {
      fetchSummary();
    }
  }, [totalInteractions]);

  const statItems = [
    { label: 'Amalan', value: completedTasks, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Ilmu', value: stats.quizzesAnswered, icon: HelpCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Hikmah', value: stats.storiesRead, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Menu', value: stats.recipesGenerated, icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Refleksi', value: stats.reflectionsCount, icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'RAMA', value: stats.adviceConsultations, icon: MessageCircle, color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-2xl mx-auto">
      <div className="text-center pt-6">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Jejak Keberkahan</h2>
        <p className="text-slate-400 text-sm mt-1">Sinar kebaikanmu selama bulan suci.</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
        {statItems.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-50 flex flex-col items-center text-center shadow-sm">
            <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center ${item.color} mb-3 shadow-inner`}>
              <item.icon size={18} />
            </div>
            <span className="text-[8px] uppercase tracking-widest font-black text-slate-300 mb-1">{item.label}</span>
            <span className="text-xl font-extrabold text-slate-800 tracking-tight">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] p-10 border border-slate-50 shadow-sm relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
              <Sparkles size={22} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Pesan Teduh RAMA</h3>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <Loader2 className="animate-spin text-emerald-600" size={32} />
              <p className="text-slate-400 text-xs font-medium italic">Merangkai kata-kata penyejuk...</p>
            </div>
          ) : summary ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <p className="text-slate-600 leading-loose text-lg font-medium italic">
                "{summary}"
              </p>
              <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                 <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase">Perjalanan {currentDay} Hari</span>
                 <div className="px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black tracking-widest uppercase border border-emerald-100">
                    Sinar: {totalInteractions}
                  </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-300 text-sm font-medium">Isi harimu dengan kebaikan, RAMA akan menyapamu di sini.</p>
            </div>
          )}
        </div>
        <div className="absolute -top-10 -right-10 opacity-[0.02] pointer-events-none group-hover:opacity-[0.04] transition-opacity">
          <Star size={240} fill="#064e3b" />
        </div>
      </div>
    </div>
  );
};

export default JejakKeberkahan;
