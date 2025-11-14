import React from 'react';
import { KeystonCard } from '../KeystonCard';
import { Activity, Apple, Flame, Footprints, Droplets, Target } from 'lucide-react';

export function HomeScreen() {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  const stats = [
    { label: 'Calories', value: '1,847', goal: '2,200', icon: Flame, color: 'rgb(var(--chart-calories))', progress: 84 },
    { label: 'Protein', value: '98g', goal: '120g', icon: Apple, color: 'rgb(var(--chart-protein))', progress: 82 },
    { label: 'Steps', value: '8,432', goal: '10,000', icon: Footprints, color: 'rgb(var(--secondary))', progress: 84 },
    { label: 'Water', value: '6', goal: '8 cups', icon: Droplets, color: 'rgb(var(--info))', progress: 75 },
  ];

  const quickActions = [
    { label: 'Log Food', icon: Apple, color: 'rgb(var(--success))' },
    { label: 'Start Workout', icon: Activity, color: 'rgb(var(--tertiary))' },
    { label: 'Set Goal', icon: Target, color: 'rgb(var(--primary))' },
  ];

  return (
    <div className="pb-24 px-4 pt-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[rgb(var(--foreground))] mb-1">Welcome back!</h1>
          <p className="text-[rgb(var(--foreground-secondary))]">{today}</p>
        </div>

        {/* Daily Summary Card */}
        <KeystonCard className="mb-6" elevated>
          <h3 className="text-[rgb(var(--foreground))] mb-4">Today's Progress</h3>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${stat.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[rgb(var(--foreground-secondary))]">{stat.label}</p>
                      <div className="flex items-baseline gap-1">
                        <p className="text-[rgb(var(--foreground))]">{stat.value}</p>
                        <p className="text-xs text-[rgb(var(--foreground-tertiary))]">/ {stat.goal}</p>
                      </div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-[rgb(var(--border))] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${stat.progress}%`,
                        backgroundColor: stat.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </KeystonCard>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-[rgb(var(--foreground))] mb-3">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <KeystonCard 
                  key={action.label}
                  className="flex flex-col items-center gap-3 py-5 cursor-pointer hover:shadow-md active:scale-95 transition-all"
                >
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${action.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: action.color }} />
                  </div>
                  <p className="text-sm text-center text-[rgb(var(--foreground))]">{action.label}</p>
                </KeystonCard>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-[rgb(var(--foreground))] mb-3">Recent Activity</h3>
          <div className="space-y-3">
            <KeystonCard className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[rgb(var(--success))]20">
                <Apple className="w-5 h-5 text-[rgb(var(--success))]" />
              </div>
              <div className="flex-1">
                <p className="text-[rgb(var(--foreground))]">Grilled Chicken Salad</p>
                <p className="text-sm text-[rgb(var(--foreground-secondary))]">Lunch • 452 cal</p>
              </div>
              <p className="text-sm text-[rgb(var(--foreground-tertiary))]">2h ago</p>
            </KeystonCard>

            <KeystonCard className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[rgb(var(--tertiary))]20">
                <Activity className="w-5 h-5 text-[rgb(var(--tertiary))]" />
              </div>
              <div className="flex-1">
                <p className="text-[rgb(var(--foreground))]">Morning Run</p>
                <p className="text-sm text-[rgb(var(--foreground-secondary))]">Cardio • 45 min</p>
              </div>
              <p className="text-sm text-[rgb(var(--foreground-tertiary))]">5h ago</p>
            </KeystonCard>
          </div>
        </div>

        {/* Motivational Message */}
        <KeystonCard className="mt-6 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))]">
          <p className="text-white text-center">
            🎉 You're 84% to your daily goal! Keep going!
          </p>
        </KeystonCard>
      </div>
    </div>
  );
}
