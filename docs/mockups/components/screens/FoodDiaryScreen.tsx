import React, { useState } from 'react';
import { KeystonCard } from '../KeystonCard';
import { KeystonButton } from '../KeystonButton';
import { Plus, Coffee, Sunrise, Sun, Moon, MoreVertical } from 'lucide-react';

export function FoodDiaryScreen() {
  const [selectedDate] = useState(new Date());

  const mealData = [
    {
      meal: 'Breakfast',
      icon: Coffee,
      time: '8:30 AM',
      color: 'rgb(var(--tertiary))',
      items: [
        { name: 'Oatmeal with Berries', calories: 280, protein: 8, carbs: 54, fat: 4 },
        { name: 'Greek Yogurt', calories: 130, protein: 15, carbs: 9, fat: 3 },
      ],
    },
    {
      meal: 'Lunch',
      icon: Sun,
      time: '12:30 PM',
      color: 'rgb(var(--secondary))',
      items: [
        { name: 'Grilled Chicken Salad', calories: 452, protein: 42, carbs: 28, fat: 18 },
        { name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0 },
      ],
    },
    {
      meal: 'Snack',
      icon: Sunrise,
      time: '3:45 PM',
      color: 'rgb(var(--success))',
      items: [
        { name: 'Protein Bar', calories: 200, protein: 20, carbs: 24, fat: 6 },
      ],
    },
    {
      meal: 'Dinner',
      icon: Moon,
      time: 'Not logged',
      color: 'rgb(var(--primary))',
      items: [],
    },
  ];

  const totalCalories = mealData.reduce((sum, meal) => 
    sum + meal.items.reduce((mealSum, item) => mealSum + item.calories, 0), 0
  );
  const totalProtein = mealData.reduce((sum, meal) => 
    sum + meal.items.reduce((mealSum, item) => mealSum + item.protein, 0), 0
  );
  const totalCarbs = mealData.reduce((sum, meal) => 
    sum + meal.items.reduce((mealSum, item) => mealSum + item.carbs, 0), 0
  );
  const totalFat = mealData.reduce((sum, meal) => 
    sum + meal.items.reduce((mealSum, item) => mealSum + item.fat, 0), 0
  );

  return (
    <div className="pb-24 px-4 pt-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[rgb(var(--foreground))] mb-1">Food Diary</h1>
          <p className="text-[rgb(var(--foreground-secondary))]">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Daily Summary */}
        <KeystonCard className="mb-6" elevated>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[rgb(var(--foreground))]">Daily Totals</h3>
            <div className="text-right">
              <p className="text-[rgb(var(--foreground))]">{totalCalories}</p>
              <p className="text-sm text-[rgb(var(--foreground-secondary))]">of 2,200 cal</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--chart-protein) / 0.2)' }}>
                <div>
                  <p className="text-[rgb(var(--chart-protein))]">{totalProtein}g</p>
                </div>
              </div>
              <p className="text-sm text-[rgb(var(--foreground-secondary))]">Protein</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--chart-carbs) / 0.2)' }}>
                <div>
                  <p className="text-[rgb(var(--chart-carbs))]">{totalCarbs}g</p>
                </div>
              </div>
              <p className="text-sm text-[rgb(var(--foreground-secondary))]">Carbs</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--chart-fat) / 0.2)' }}>
                <div>
                  <p className="text-[rgb(var(--chart-fat))]">{totalFat}g</p>
                </div>
              </div>
              <p className="text-sm text-[rgb(var(--foreground-secondary))]">Fat</p>
            </div>
          </div>
        </KeystonCard>

        {/* Meals */}
        <div className="space-y-4">
          {mealData.map((mealGroup) => {
            const Icon = mealGroup.icon;
            const mealTotal = mealGroup.items.reduce((sum, item) => sum + item.calories, 0);
            
            return (
              <KeystonCard key={mealGroup.meal}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${mealGroup.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: mealGroup.color }} />
                    </div>
                    <div>
                      <h4 className="text-[rgb(var(--foreground))]">{mealGroup.meal}</h4>
                      <p className="text-sm text-[rgb(var(--foreground-secondary))]">{mealGroup.time}</p>
                    </div>
                  </div>
                  {mealGroup.items.length > 0 && (
                    <div className="text-right">
                      <p className="text-[rgb(var(--foreground))]">{mealTotal} cal</p>
                    </div>
                  )}
                </div>

                {mealGroup.items.length > 0 ? (
                  <div className="space-y-2 mb-3">
                    {mealGroup.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-t border-[rgb(var(--border))]">
                        <div className="flex-1">
                          <p className="text-[rgb(var(--foreground))]">{item.name}</p>
                          <p className="text-sm text-[rgb(var(--foreground-secondary))]">
                            P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-[rgb(var(--foreground))]">{item.calories} cal</p>
                          <button className="p-2 hover:bg-[rgb(var(--border))] rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-[rgb(var(--foreground-secondary))]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[rgb(var(--foreground-tertiary))] mb-3 py-2 border-t border-[rgb(var(--border))]">
                    No items logged
                  </p>
                )}

                <KeystonButton variant="ghost" fullWidth size="sm">
                  <Plus className="w-4 h-4" />
                  Add Food
                </KeystonButton>
              </KeystonCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
