
import React, { useState, useEffect } from 'react';
import { BookOpen, Loader2, Quote, ScrollText } from 'lucide-react';
import { generateDailyStory } from '../services/gemini';

interface LearningProps {
  day: number;
  onStoryRead?: () => void;
}

const Learning: React.FC<LearningProps> = ({ day, onStoryRead }) => {
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      setIsLoading(true);
      try {
        const result = await generateDailyStory(day);
        setStory(result || '');
        if (onStoryRead) onStoryRead();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStory();
  }, [day]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
          <ScrollText size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Micro-Learning</h2>
          <p className="text-sm text-slate-500">Hikmah Ramadhan Hari ke-{day}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm min-h-[300px] relative overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <p className="text-slate-400 italic">Membuka lembaran sejarah...</p>
          </div>
        ) : (
          <div className="prose prose-slate max-w-none animate-in fade-in duration-700">
            <div className="flex justify-center mb-8">
              <Quote className="text-blue-100 rotate-180" size={64} fill="currentColor" />
            </div>
            <div className="space-y-4 text-slate-700 leading-loose text-lg whitespace-pre-wrap">
              {story}
            </div>
          </div>
        )}
        
        <div className="absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none">
          <BookOpen size={120} />
        </div>
      </div>
    </div>
  );
};

export default Learning;
