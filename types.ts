
export type AppView = 'home' | 'coach' | 'planner' | 'map' | 'chef' | 'learning' | 'quiz' | 'reflection';

export interface UserProfile {
  name: string;
  occupation: string;
  city: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface ActivityStats {
  quizzesAnswered: number;
  storiesRead: number;
  recipesGenerated: number;
  reflectionsCount: number;
  adviceConsultations: number;
}

export interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
  type: 'prayer' | 'quran' | 'charity' | 'dzikir';
}

export interface DayProgress {
  day: number;
  tasks: DailyTask[];
  isLocked: boolean;
}

export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  benefits: string;
  category?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}
