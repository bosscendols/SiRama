
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, Bot } from 'lucide-react';
import { getSpiritualAdvice } from '../services/gemini';
import { Message } from '../types';

interface CoachProps {
  onAdviceReceived?: () => void;
}

const Coach: React.FC<CoachProps> = ({ onAdviceReceived }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Assalamu\'alaikum Saudaraku. Saya RAMA, pendamping Anda di bulan yang mulia ini. Jika ada yang mengganjal di hati atau sekadar butuh ketenangan, tumpahkan saja di sini. Saya setia mendengarkan.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    try {
      const advice = await getSpiritualAdvice(userMsg, messages);
      setMessages(prev => [...prev, { role: 'model', content: advice || 'Maaf, mari tarik nafas dalam dan coba bicara lagi nanti.' }]);
      if (onAdviceReceived) onAdviceReceived();
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: 'Koneksi saya sedikit terganggu, tapi niat baikmu tetap terjaga.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl sage-gradient flex items-center justify-center text-white shadow-xl">
            <Bot size={30} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">RAMA AI</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Sahabat Setia</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 p-4 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] p-6 rounded-[2.5rem] shadow-sm text-sm font-medium leading-relaxed ${
              m.role === 'user' 
                ? 'bg-[#7a9482] text-white rounded-br-none' 
                : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-6 rounded-[2rem] rounded-bl-none border border-slate-100 flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-[#7a9482] rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="w-1.5 h-1.5 bg-[#7a9482] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1.5 h-1.5 bg-[#7a9482] rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">RAMA Menulis...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="bg-white p-4 rounded-[3rem] shadow-2xl border border-slate-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ada yang ingin diceritakan?"
            className="flex-1 bg-slate-50 border-none rounded-[2rem] py-4 px-8 focus:ring-2 focus:ring-[#7a9482]/20 text-slate-800 font-medium placeholder:text-slate-300"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-14 h-14 bg-[#7a9482] text-white rounded-full flex items-center justify-center hover:bg-[#5a7362] transition-all disabled:opacity-50 active:scale-90 shadow-lg shadow-emerald-900/10"
          >
            <Send size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Coach;
