
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Recipe, QuizQuestion, DailyTask, ActivityStats } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSpiritualAdvice = async (mood: string, history: { role: string; content: string }[]) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.content }] })),
      { role: 'user', parts: [{ text: `Saya sedang merasa ${mood}. Berikan saya nasihat spiritual yang sangat lembut, menyejukkan hati, dan memberikan energi baru berdasarkan Al-Qur'an dan Hadits.` }] }
    ],
    config: {
      systemInstruction: "You are an empathetic AI Spiritual Companion for Ramadhan called 'RAMA'. Your tone is exceptionally soft, soothing, and caring. You act as a listener for those who are tired or in need of peace. Use Quranic verses and Hadiths to provide comfort and gentle motivation. Always address the user as 'Sahabatku'. Respond in Indonesian."
    }
  });
  return response.text;
};

export const getPrayerTimes = async (city: string, day: number, latLng?: { lat: number, lng: number }) => {
  const locationContext = latLng 
    ? `koordinat geografis lat: ${latLng.lat}, lng: ${latLng.lng} (sekitar ${city})`
    : `kota ${city}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Berikan jadwal waktu shalat yang akurat untuk ${locationContext} pada hari ke-${day} Ramadhan 1446H (Maret 2025). Sertakan: Imsak, Subuh, Dzuhur, Ashar, Maghrib, dan Isya. Pastikan waktu sinkron dengan standar lokal di wilayah tersebut.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          imsak: { type: Type.STRING },
          subuh: { type: Type.STRING },
          dzuhur: { type: Type.STRING },
          ashar: { type: Type.STRING },
          maghrib: { type: Type.STRING },
          isya: { type: Type.STRING },
        },
        required: ['imsak', 'subuh', 'dzuhur', 'ashar', 'maghrib', 'isya']
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generatePlanner = async (occupation: string, day: number): Promise<DailyTask[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Buat 4 target ibadah harian yang realistis dan bervariasi untuk orang dengan pekerjaan '${occupation}' pada hari ke-${day} Ramadhan. 
    Pastikan pilihan tugasnya tidak hanya shalat, tapi juga:
    - Kebaikan sosial (senyum, menyapa orang, membantu rekan kerja).
    - Pengembangan diri (baca 5 halaman buku, dengar podcast islami).
    - Dzikir ringan saat beraktivitas.
    - Sedekah kecil atau berbagi informasi bermanfaat.
    Tugas harus ringkas, positif, dan memberikan energi.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['prayer', 'quran', 'charity', 'dzikir'] },
            completed: { type: Type.BOOLEAN }
          },
          required: ['id', 'title', 'type', 'completed']
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const generateBlessingSummary = async (name: string, totalCompleted: number, stats: ActivityStats, daysPassed: number) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Beri sapaan hangat untuk Sahabatku ${name} yang telah merawat ibadahnya selama ${daysPassed} hari Ramadhan ini:
- Menyelesaikan ${totalCompleted} amalan harian.
- Menjawab ${stats.quizzesAnswered} kuis wawasan.
- Membaca ${stats.storiesRead} hikmah.
- Menemukan ${stats.recipesGenerated} resep sehat.
- Melakukan ${stats.reflectionsCount} kali refleksi diri.
- Berbincang dengan RAMA sebanyak ${stats.adviceConsultations} kali.

Berikan kata-kata yang sangat menenangkan. Awali dengan 'Sahabatku ${name}'. Apresiasi setiap langkah kecil yang ia ambil untuk menjaga energinya tetap positif.`,
    config: {
      systemInstruction: "You are 'RAMA', a soft-spoken and noble spiritual companion. Your goal is to provide a heart-warming and soothing summary. Use 'Sahabatku' as a greeting. Respond in Indonesian."
    }
  });
  return response.text;
};

export const generateRecipe = async (ingredients: string[]): Promise<Recipe> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Buat resep sahur/buka puasa khas Indonesia yang sangat sehat, ringan untuk pencernaan, dan mengembalikan energi menggunakan bahan: ${ingredients.join(', ')}. Sapa pengguna dengan 'Sahabatku'.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          benefits: { type: Type.STRING }
        },
        required: ['name', 'category', 'ingredients', 'instructions', 'benefits']
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateMealRecommendation = async (type: 'sahur' | 'berbuka'): Promise<Recipe> => {
  const berbukaPrompt = `Berikan rekomendasi menu berbuka puasa khas Indonesia yang sehat dan menyegarkan. Sapa pengguna dengan 'Sahabatku'.`;
  const sahurPrompt = `Berikan rekomendasi menu sahur khas Indonesia yang mengenyangkan namun tetap ringan dan menjaga energi seharian. Sapa pengguna dengan 'Sahabatku'.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: type === 'berbuka' ? berbukaPrompt : sahurPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          benefits: { type: Type.STRING }
        },
        required: ['name', 'category', 'ingredients', 'instructions', 'benefits']
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateDailyStory = async (day: number) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Berikan satu kutipan hikmah atau kisah singkat yang sangat menenangkan untuk hati yang lelah di hari ke-${day} Ramadhan. Awali dengan menyapa 'Sahabatku'.`,
    config: {
      systemInstruction: "You are RAMA, a gentle storyteller. Provide stories that bring peace. Respond in Indonesian."
    }
  });
  return response.text;
};

export const generateQuiz = async (day: number): Promise<QuizQuestion> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Buat satu kuis ringan tentang keindahan akhlak Islam untuk hari ke-${day}. Sapa pengguna dengan 'Sahabatku'.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.INTEGER },
          explanation: { type: Type.STRING }
        },
        required: ['question', 'options', 'correctAnswer', 'explanation']
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
