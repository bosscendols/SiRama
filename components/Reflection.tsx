
import React, { useState } from 'react';
import { Moon, Sparkles, Send, Loader2 } from 'lucide-react';
import { getSpiritualAdvice } from '../services/gemini';

interface ReflectionProps {
  day: number;
  onReflectionSent?: () => void;
}

const Reflection: React.FC<ReflectionProps> = ({ day, onReflectionSent }) => {
  const [reflection, setReflection] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reflection.trim()) return;
    setIsLoading(true);
    try {
      const result = await getSpiritualAdvice(`Refleksi diri harian saya pada hari ke-${day}: ${reflection}`, []);
      setResponse(result || '');
      if (onReflectionSent) onReflectionSent();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center py-6">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4 shadow-inner">
          <Moon size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Ruang Refleksi</h2>
        <p className="text-slate-500 italic">Lepaskan lelahmu, temukan kembali damaimu</p>
      </div>

      {!response ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
          <p className="text-slate-600 text-center leading-relaxed">
            "Setelah melalui hari yang panjang, apa satu hal yang ingin kau bisikkan dalam doamu hari ini?"
          </p>
          <textarea
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[150px] transition-all text-slate-900 placeholder:text-slate-400"
            placeholder="Tuliskan di sini, biarkan hatimu bicara..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !reflection.trim()}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-100"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            Kirim ke RAMA
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-md animate-in zoom-in-95 duration-500">
          <div className="flex items-center gap-2 text-emerald-600 font-bold mb-4">
            <Sparkles size={18} /> Balasan Teduh dari RAMA
          </div>
          <p className="text-slate-700 leading-loose whitespace-pre-wrap italic">
            {response}
          </p>
          <button
            onClick={() => { setResponse(''); setReflection(''); }}
            className="mt-8 text-slate-400 text-sm font-bold hover:text-emerald-600 transition-colors"
          >
            Mulai refleksi baru
          </button>
        </div>
      )}
    </div>
  );
};

export default Reflection;
