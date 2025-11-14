import React from 'react';
import { Home, UtensilsCrossed, TrendingUp, Dumbbell, Settings } from 'lucide-react';

interface BottomNavProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export function BottomNav({ activeScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'food', icon: UtensilsCrossed, label: 'Food' },
    { id: 'trends', icon: TrendingUp, label: 'Trends' },
    { id: 'workout', icon: Dumbbell, label: 'Workout' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[rgb(var(--surface))] border-t-2 border-[rgb(var(--border))] shadow-lg z-50">
      <div className="max-w-2xl mx-auto flex items-center justify-around px-4 py-2 safe-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all min-h-[56px] min-w-[60px]
                ${isActive 
                  ? 'text-[rgb(var(--primary))]' 
                  : 'text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--foreground))]'
                }
              `}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className={`text-xs ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}