
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import Coach from './components/Coach';
import Planner from './components/Planner';
import JejakKeberkahan from './components/JejakKeberkahan';
import Chef from './components/Chef';
import Learning from './components/Learning';
import Quiz from './components/Quiz';
import Reflection from './components/Reflection';
import Onboarding from './components/Onboarding';
import { AppView, UserProfile, DayProgress, ActivityStats } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    occupation: '',
    city: '',
  });
  
  // Ramadhan 2025 calculation (Estimated start March 1, 2025)
  const calculateRamadhanDay = () => {
    const startOfRamadhan = new Date('2025-03-01T00:00:00');
    const today = new Date();
    const diffTime = today.getTime() - startOfRamadhan.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    if (diffDays < 1) return 1;
    if (diffDays > 30) return 30;
    return diffDays;
  };

  const [ramadhanDay] = useState(calculateRamadhanDay());
  
  const [progress, setProgress] = useState<DayProgress[]>(() => {
    const saved = localStorage.getItem('si_rama_progress');
    if (saved) return JSON.parse(saved);
    return Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      tasks: [],
      isLocked: i + 1 > calculateRamadhanDay()
    }));
  });

  const [stats, setStats] = useState<ActivityStats>(() => {
    const saved = localStorage.getItem('si_rama_stats');
    return saved ? JSON.parse(saved) : {
      quizzesAnswered: 0,
      storiesRead: 0,
      recipesGenerated: 0,
      reflectionsCount: 0,
      adviceConsultations: 0,
    };
  });

  useEffect(() => {
    localStorage.setItem('si_rama_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('si_rama_progress', JSON.stringify(progress));
  }, [progress]);

  const incrementStat = (key: keyof ActivityStats) => {
    setStats(prev => ({ ...prev, [key]: prev[key] + 1 }));
  };

  const resetApp = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua jejak dan memulai perjalanan Ramadhan dari awal?")) {
      localStorage.clear();
      // Force complete clean state
      setIsFirstTime(true);
      setProfile({ name: '', occupation: '', city: '' });
      setCurrentView('home');
      window.location.reload();
    }
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem('si_rama_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setIsFirstTime(false);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setProfile(prev => ({
          ...prev,
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude }
        }));
      });
    }
  }, []);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('si_rama_profile', JSON.stringify(newProfile));
    setIsFirstTime(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home profile={profile} day={ramadhanDay} progress={progress} setView={setCurrentView} />;
      case 'coach': return <Coach onAdviceReceived={() => incrementStat('adviceConsultations')} />;
      case 'planner': return <Planner profile={profile} day={ramadhanDay} progress={progress} setProgress={setProgress} />;
      case 'map': return <JejakKeberkahan progress={progress} currentDay={ramadhanDay} profile={profile} stats={stats} />;
      case 'chef': return <Chef onRecipeFound={() => incrementStat('recipesGenerated')} />;
      case 'learning': return <Learning day={ramadhanDay} onStoryRead={() => incrementStat('storiesRead')} />;
      case 'quiz': return <Quiz day={ramadhanDay} onQuizAnswered={() => incrementStat('quizzesAnswered')} />;
      case 'reflection': return <Reflection day={ramadhanDay} onReflectionSent={() => incrementStat('reflectionsCount')} />;
      default: return <Home profile={profile} day={ramadhanDay} progress={progress} setView={setCurrentView} />;
    }
  };

  return (
    <div className="text-slate-900">
      {isFirstTime ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <Layout currentView={currentView} setView={setCurrentView} onReset={resetApp}>
          {renderView()}
        </Layout>
      )}
    </div>
  );
};

export default App;
