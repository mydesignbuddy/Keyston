import React, { useState } from 'react';
import { KeystonCard } from '../KeystonCard';
import { KeystonButton } from '../KeystonButton';
import { Dumbbell, Timer, Flame, TrendingUp, Plus, Play, CheckCircle2 } from 'lucide-react';

export function WorkoutTrackerScreen() {
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null);

  const workoutStats = [
    { label: 'This Week', value: '3', unit: 'workouts', icon: Dumbbell, color: 'rgb(var(--primary))' },
    { label: 'Total Time', value: '2.5', unit: 'hours', icon: Timer, color: 'rgb(var(--secondary))' },
    { label: 'Calories Burned', value: '847', unit: 'kcal', icon: Flame, color: 'rgb(var(--tertiary))' },
  ];

  const workoutTemplates = [
    { 
      name: 'Upper Body Strength',
      duration: '45 min',
      exercises: 8,
      difficulty: 'Intermediate',
      color: 'rgb(var(--primary))'
    },
    { 
      name: 'Cardio HIIT',
      duration: '30 min',
      exercises: 6,
      difficulty: 'Advanced',
      color: 'rgb(var(--tertiary))'
    },
    { 
      name: 'Leg Day',
      duration: '50 min',
      exercises: 10,
      difficulty: 'Intermediate',
      color: 'rgb(var(--secondary))'
    },
  ];

  const recentWorkouts = [
    {
      name: 'Morning Run',
      type: 'Cardio',
      duration: '45 min',
      calories: 380,
      date: 'Today',
      completed: true,
    },
    {
      name: 'Upper Body Strength',
      type: 'Strength',
      duration: '40 min',
      calories: 245,
      date: 'Yesterday',
      completed: true,
    },
    {
      name: 'Yoga Flow',
      type: 'Flexibility',
      duration: '30 min',
      calories: 122,
      date: '2 days ago',
      completed: true,
    },
  ];

  return (
    <div className="pb-24 px-4 pt-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[rgb(var(--foreground))] mb-1">Workout Tracker</h1>
          <p className="text-[rgb(var(--foreground-secondary))]">
            Log and track your workouts
          </p>
        </div>

        {/* Quick Stats */}
        <KeystonCard className="mb-6" elevated>
          <h3 className="text-[rgb(var(--foreground))] mb-4">This Week's Progress</h3>
          <div className="grid grid-cols-3 gap-4">
            {workoutStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div 
                    className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <p className="text-2xl text-[rgb(var(--foreground))]">{stat.value}</p>
                  <p className="text-sm text-[rgb(var(--foreground-secondary))]">{stat.unit}</p>
                  <p className="text-xs text-[rgb(var(--foreground-tertiary))] mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </KeystonCard>

        {/* Quick Start */}
        <KeystonButton variant="primary" fullWidth size="lg" className="mb-6">
          <Play className="w-5 h-5" />
          Start Quick Workout
        </KeystonButton>

        {/* Workout Templates */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[rgb(var(--foreground))]">Workout Templates</h3>
            <button className="text-[rgb(var(--primary))] text-sm">View All</button>
          </div>
          
          <div className="space-y-3">
            {workoutTemplates.map((template, idx) => (
              <KeystonCard 
                key={idx}
                className="cursor-pointer hover:shadow-md active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${template.color}20` }}
                  >
                    <Dumbbell className="w-6 h-6" style={{ color: template.color }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[rgb(var(--foreground))] mb-1">{template.name}</h4>
                    <p className="text-sm text-[rgb(var(--foreground-secondary))]">
                      {template.exercises} exercises • {template.duration}
                    </p>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <span className="inline-block px-3 py-1 rounded-full bg-[rgb(var(--border))] text-sm text-[rgb(var(--foreground-secondary))]">
                      {template.difficulty}
                    </span>
                  </div>
                </div>
              </KeystonCard>
            ))}
          </div>
        </div>

        {/* Create Custom Workout */}
        <KeystonCard className="mb-6 border-2 border-dashed border-[rgb(var(--border-strong))] cursor-pointer hover:border-[rgb(var(--primary))] transition-colors">
          <div className="flex items-center justify-center gap-3 py-4">
            <div className="p-2 rounded-lg bg-[rgb(var(--primary))]20">
              <Plus className="w-5 h-5 text-[rgb(var(--primary))]" />
            </div>
            <p className="text-[rgb(var(--foreground))]">Create Custom Workout</p>
          </div>
        </KeystonCard>

        {/* Recent Workouts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[rgb(var(--foreground))]">Recent Workouts</h3>
            <button className="text-[rgb(var(--primary))] text-sm">View History</button>
          </div>
          
          <div className="space-y-3">
            {recentWorkouts.map((workout, idx) => (
              <KeystonCard key={idx}>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[rgb(var(--success))]20">
                    <CheckCircle2 className="w-5 h-5 text-[rgb(var(--success))]" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[rgb(var(--foreground))]">{workout.name}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-[rgb(var(--border))] text-xs text-[rgb(var(--foreground-secondary))]">
                        {workout.type}
                      </span>
                    </div>
                    <p className="text-sm text-[rgb(var(--foreground-secondary))]">
                      {workout.duration} • {workout.calories} cal burned
                    </p>
                  </div>
                  
                  <p className="text-sm text-[rgb(var(--foreground-tertiary))] flex-shrink-0">
                    {workout.date}
                  </p>
                </div>
              </KeystonCard>
            ))}
          </div>
        </div>

        {/* Motivational Card */}
        <KeystonCard className="mt-6 bg-gradient-to-r from-[rgb(var(--tertiary))] to-[rgb(var(--primary))]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white mb-1">You're on fire! 🔥</p>
              <p className="text-sm text-white/90">
                3 workouts this week. Keep up the great work!
              </p>
            </div>
          </div>
        </KeystonCard>
      </div>
    </div>
  );
}
