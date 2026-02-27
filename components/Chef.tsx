
import React, { useState } from 'react';
import { Search, Loader2, ChefHat, Salad, Clock, Heart, Sparkles, Coffee, Sun, Tag, ArrowLeft } from 'lucide-react';
import { generateRecipe, generateMealRecommendation } from '../services/gemini';
import { Recipe } from '../types';

interface ChefProps {
  onRecipeFound?: () => void;
}

const Chef: React.FC<ChefProps> = ({ onRecipeFound }) => {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'recommend'>('recommend');

  const handleGenerateFromIngredients = async () => {
    if (!ingredients.trim()) return;
    setIsLoading(true);
    setRecipe(null);
    try {
      const ingredientList = ingredients.split(',').map(i => i.trim());
      const result = await generateRecipe(ingredientList);
      setRecipe(result);
      if (onRecipeFound) onRecipeFound();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetRecommendation = async (type: 'sahur' | 'berbuka') => {
    setIsLoading(true);
    setRecipe(null);
    try {
      const result = await generateMealRecommendation(type);
      setRecipe(result);
      if (onRecipeFound) onRecipeFound();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (recipe && !isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-500 pb-10">
        <button 
          onClick={() => setRecipe(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-[#7a9482] transition-all font-bold text-sm"
        >
          <ArrowLeft size={16} /> Kembali ke Menu Utama
        </button>

        <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <div className="space-y-2">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                 <Tag size={12} /> {recipe.category || 'Resep Spesial'}
               </div>
               <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">{recipe.name}</h2>
            </div>

            <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100/50 flex flex-col md:flex-row items-start gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm flex-shrink-0">
                <Heart size={28} fill="currentColor" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-emerald-900 text-lg">Manfaat Kesehatan</h4>
                <p className="text-emerald-800/70 leading-relaxed font-medium italic">"{recipe.benefits}"</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 pt-4">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="w-1 h-6 bg-orange-400 rounded-full"></div> Bahan-bahan
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {recipe.ingredients.map((ing, i) => (
                    <div key={i} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-sm font-semibold text-slate-700">{ing}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="w-1 h-6 bg-[#7a9482] rounded-full"></div> Cara Masak
                </h3>
                <div className="space-y-6">
                  {recipe.instructions.map((step, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="flex-shrink-0 w-10 h-10 bg-slate-50 text-slate-400 font-black rounded-2xl flex items-center justify-center text-xs border border-slate-100 group-hover:bg-[#7a9482] group-hover:text-white group-hover:border-[#7a9482] transition-all">
                        {i + 1}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed pt-2 font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* BG Decoration */}
          <div className="absolute top-[-20%] right-[-10%] opacity-[0.03] pointer-events-none">
            <ChefHat size={400} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="px-2">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dapur Berkah</h2>
        <p className="text-slate-400 font-medium">Nutrisi tepat, puasa pun semangat.</p>
      </div>

      <div className="flex p-1 bg-white/50 border border-white rounded-[2rem] w-full max-w-sm shadow-sm backdrop-blur-md">
        <button 
          onClick={() => setActiveTab('recommend')}
          className={`flex-1 py-4 rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'recommend' ? 'bg-[#7a9482] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Rekomendasi
        </button>
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-4 rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'search' ? 'bg-[#7a9482] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Cari Resep
        </button>
      </div>

      {activeTab === 'recommend' ? (
        <div className="grid md:grid-cols-2 gap-6">
          <button 
            onClick={() => handleGetRecommendation('sahur')}
            disabled={isLoading}
            className="bento-card p-10 rounded-[3rem] text-left group overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Coffee size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Ide Sahur</h3>
              <p className="text-slate-400 text-sm italic font-medium">Menu praktis penggugah selera.</p>
            </div>
            <Sun size={180} className="absolute -right-10 -bottom-10 opacity-[0.03] text-orange-500 group-hover:rotate-12 transition-transform duration-1000" />
          </button>

          <button 
            onClick={() => handleGetRecommendation('berbuka')}
            disabled={isLoading}
            className="bento-card p-10 rounded-[3rem] text-left group overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Salad size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Buka Puasa</h3>
              <p className="text-slate-400 text-sm italic font-medium">Segarkan raga setelah berjuang.</p>
            </div>
            <Heart size={180} className="absolute -right-10 -bottom-10 opacity-[0.03] text-rose-500 group-hover:scale-110 transition-transform duration-1000" />
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-6">
           <p className="text-slate-400 text-sm font-medium italic text-center">Tuliskan bahan yang ada di dapurmu, Careem akan carikan resep terbaiknya.</p>
           <div className="relative">
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="misal: ayam, bayam, bawang putih..."
                className="w-full bg-slate-50 border-none rounded-[2.5rem] p-8 pr-20 text-slate-800 font-bold placeholder:text-slate-200 focus:ring-2 focus:ring-[#7a9482]/20 min-h-[160px]"
              />
              <button 
                onClick={handleGenerateFromIngredients}
                disabled={isLoading || !ingredients.trim()}
                className="absolute right-4 bottom-4 w-14 h-14 bg-[#7a9482] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#5a7362] transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
              </button>
           </div>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
           <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-[#7a9482] mb-4">
             <ChefHat size={40} className="animate-float" />
           </div>
           <p className="text-[#7a9482] font-black uppercase tracking-[0.2em] text-[10px]">Chef AI Sedang Memasak...</p>
        </div>
      )}
    </div>
  );
};

export default Chef;
