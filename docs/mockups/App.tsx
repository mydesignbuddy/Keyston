import React, { useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/screens/HomeScreen';
import { FoodDiaryScreen } from './components/screens/FoodDiaryScreen';
import { FoodScannerScreen } from './components/screens/FoodScannerScreen';
import { NutritionTrendsScreen } from './components/screens/NutritionTrendsScreen';
import { WorkoutTrackerScreen } from './components/screens/WorkoutTrackerScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { ComponentShowcase } from './components/ComponentShowcase';

function App() {
  const [activeScreen, setActiveScreen] = useState('home');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen />;
      case 'food':
        return <FoodDiaryScreen />;
      case 'scanner':
        return <FoodScannerScreen />;
      case 'trends':
        return <NutritionTrendsScreen />;
      case 'workout':
        return <WorkoutTrackerScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'showcase':
        return <ComponentShowcase />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[rgb(var(--background))]">
        {/* App Header - Optional branding */}
        <header className="sticky top-0 bg-[rgb(var(--surface))] border-b-2 border-[rgb(var(--border))] z-40">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] flex items-center justify-center">
                <span className="text-white font-bold">K</span>
              </div>
              <h2 className="text-[rgb(var(--foreground))]">Keystõn</h2>
            </div>
            
            {/* Quick access to component showcase */}
            <button
              onClick={() => setActiveScreen('showcase')}
              className="text-sm px-3 py-1 rounded-lg bg-[rgb(var(--border))] text-[rgb(var(--foreground-secondary))] hover:bg-[rgb(var(--border-strong))] transition-colors"
            >
              Components
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-140px)]">
          {renderScreen()}
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />
      </div>
    </ThemeProvider>
  );
}

export default App;