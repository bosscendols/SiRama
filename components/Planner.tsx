
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { generatePlanner } from '../services/gemini';
import { UserProfile, DayProgress } from '../types';

interface PlannerProps {
  profile: UserProfile;
  day: number;
  progress: DayProgress[];
  setProgress: React.Dispatch<React.SetStateAction<DayProgress[]>>;
}

const Planner: React.FC<PlannerProps> = ({ profile, day, progress, setProgress }) => {
  const [isLoading, setIsLoading] = useState(false);
  const currentDayProgress = progress.find(p => p.day === day);
  const tasks = currentDayProgress?.tasks || [];

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const newTasks = await generatePlanner(profile.occupation, day);
      setProgress(prev => prev.map(p => 
        p.day === day ? { ...p, tasks: newTasks } : p
      ));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = (taskId: string) => {
    setProgress(prev => prev.map(p => 
      p.day === day 
        ? { ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) } 
        : p
    ));
  };

  useEffect(() => {
    if (tasks.length === 0 && !isLoading) {
      handleGenerate();
    }
  }, [day]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Target Ibadah Hari Ini</h2>
          <p className="text-sm text-slate-500">Amalan bervariasi untuk menjaga energi spiritualmu</p>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          title="Segarkan Tantangan"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw size={20} />}
        </button>
      </div>

      <div className="space-y-3">
        {isLoading && tasks.length === 0 ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-3xl animate-pulse flex items-center px-6 gap-4 border border-slate-100">
              <div className="w-6 h-6 bg-slate-100 rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-100 rounded-full w-2/3" />
              </div>
            </div>
          ))
        ) : (
          tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`w-full flex items-center gap-4 p-5 rounded-3xl border transition-all text-left ${
                task.completed 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-800 shadow-inner' 
                  : 'bg-white border-slate-100 text-slate-700 hover:border-emerald-200 shadow-sm'
              }`}
            >
              {task.completed ? (
                <CheckCircle2 className="text-emerald-600" size={24} />
              ) : (
                <Circle className="text-slate-300" size={24} />
              )}
              <div className="flex-1">
                <p className={`font-semibold ${task.completed ? 'line-through opacity-50' : ''}`}>
                  {task.title}
                </p>
                <span className="text-[10px] uppercase tracking-wider font-bold opacity-40">
                  {task.type}
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      {!isLoading && (
        <div className="bg-emerald-900 rounded-3xl p-6 text-white flex items-center gap-4 shadow-xl shadow-emerald-900/10">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <Sparkles className="text-yellow-400" size={24} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-bold opacity-70 mb-1">Pesan RAMA</p>
            <p className="text-sm leading-relaxed italic">
              "Ingatlah Sahabatku, Allah mencintai amalan yang sedikit namun dilakukan terus menerus dengan hati yang lapang."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
