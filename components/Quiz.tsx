
import React, { useState, useEffect } from 'react';
import { HelpCircle, Loader2, CheckCircle2, XCircle, Award, ArrowRight } from 'lucide-react';
import { generateQuiz } from '../services/gemini';
import { QuizQuestion } from '../types';

interface QuizProps {
  day: number;
  onQuizAnswered?: () => void;
}

const Quiz: React.FC<QuizProps> = ({ day, onQuizAnswered }) => {
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchQuiz = async () => {
    setIsLoading(true);
    setSelected(null);
    setIsAnswered(false);
    try {
      const result = await generateQuiz(day);
      setQuiz(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [day]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelected(idx);
    setIsAnswered(true);
    if (onQuizAnswered) onQuizAnswered();
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Award className="text-yellow-400" size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full">
              Day {day} Quiz
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Asah Wawasan</h2>
          <p className="opacity-80">Jawab kuis harian untuk menambah poin sedekah digital!</p>
        </div>
        <HelpCircle className="absolute -right-8 -bottom-8 w-48 h-48 text-white opacity-5 rotate-12" />
      </div>

      <div className="bg-white rounded-3xl border border-purple-50 p-8 shadow-sm min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[300px] gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            <p className="text-slate-400 italic">Menyiapkan pertanyaan...</p>
          </div>
        ) : quiz ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h3 className="text-xl font-bold text-slate-800 leading-relaxed text-center">
              {quiz.question}
            </h3>

            <div className="space-y-4">
              {quiz.options.map((option, idx) => {
                const isCorrect = idx === quiz.correctAnswer;
                const isSelected = selected === idx;
                
                let buttonClass = "w-full text-left p-5 rounded-2xl border-2 transition-all font-medium ";
                if (!isAnswered) {
                  buttonClass += "bg-white border-slate-100 hover:border-purple-200 hover:bg-purple-50";
                } else {
                  if (isCorrect) buttonClass += "bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-50";
                  else if (isSelected) buttonClass += "bg-rose-50 border-rose-500 text-rose-800";
                  else buttonClass += "bg-slate-50 border-slate-100 opacity-50";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {isAnswered && isCorrect && <CheckCircle2 className="text-emerald-600" size={20} />}
                      {isAnswered && isSelected && !isCorrect && <XCircle className="text-rose-600" size={20} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 animate-in slide-in-from-top-2">
                <p className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" /> Tahukah Kamu?
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">{quiz.explanation}</p>
                <button 
                  onClick={fetchQuiz}
                  className="mt-6 flex items-center gap-2 text-purple-600 font-bold text-sm hover:gap-3 transition-all"
                >
                  Pertanyaan Selanjutnya <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Quiz;
