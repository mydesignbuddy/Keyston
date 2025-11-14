import React, { useState } from 'react';
import { KeystonCard } from '../KeystonCard';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Calendar, ChevronDown } from 'lucide-react';

export function NutritionTrendsScreen() {
  const [timeRange, setTimeRange] = useState('week');

  const weeklyData = [
    { day: 'Mon', calories: 2100, protein: 110, carbs: 250, fat: 70 },
    { day: 'Tue', calories: 1950, protein: 105, carbs: 230, fat: 65 },
    { day: 'Wed', calories: 2200, protein: 120, carbs: 260, fat: 75 },
    { day: 'Thu', calories: 1847, protein: 98, carbs: 220, fat: 62 },
    { day: 'Fri', calories: 2050, protein: 115, carbs: 245, fat: 68 },
    { day: 'Sat', calories: 2300, protein: 125, carbs: 280, fat: 78 },
    { day: 'Sun', calories: 1900, protein: 100, carbs: 225, fat: 64 },
  ];

  const macroDistribution = [
    { name: 'Protein', value: 25, color: 'rgb(var(--chart-protein))' },
    { name: 'Carbs', value: 50, color: 'rgb(var(--chart-carbs))' },
    { name: 'Fat', value: 25, color: 'rgb(var(--chart-fat))' },
  ];

  const averages = {
    calories: 2050,
    protein: 110,
    carbs: 244,
    fat: 69,
  };

  return (
    <div className="pb-24 px-4 pt-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[rgb(var(--foreground))] mb-1">Nutrition Trends</h1>
          <p className="text-[rgb(var(--foreground-secondary))]">
            Track your nutrition over time
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {['Week', 'Month', 'Year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range.toLowerCase())}
              className={`
                flex-1 py-2 px-4 rounded-xl transition-all
                ${timeRange === range.toLowerCase()
                  ? 'bg-[rgb(var(--primary))] text-white'
                  : 'bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] border-2 border-[rgb(var(--border))]'
                }
              `}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Weekly Averages */}
        <KeystonCard className="mb-6" elevated>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[rgb(var(--primary))]" />
            <h3 className="text-[rgb(var(--foreground))]">Weekly Averages</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[rgb(var(--background))]">
              <p className="text-sm text-[rgb(var(--foreground-secondary))] mb-1">Calories</p>
              <p className="text-2xl text-[rgb(var(--foreground))]">{averages.calories}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-[rgb(var(--success))]" />
                <p className="text-sm text-[rgb(var(--success))]">+5% from last week</p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-[rgb(var(--background))]">
              <p className="text-sm text-[rgb(var(--foreground-secondary))] mb-1">Protein</p>
              <p className="text-2xl text-[rgb(var(--chart-protein))]">{averages.protein}g</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-[rgb(var(--success))]" />
                <p className="text-sm text-[rgb(var(--success))]">+8% from last week</p>
              </div>
            </div>
          </div>
        </KeystonCard>

        {/* Calorie Trend Chart */}
        <KeystonCard className="mb-6">
          <h3 className="text-[rgb(var(--foreground))] mb-4">Daily Calories</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="rgb(var(--foreground-secondary))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="rgb(var(--foreground-secondary))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgb(var(--surface))',
                  border: '2px solid rgb(var(--border))',
                  borderRadius: '12px',
                  color: 'rgb(var(--foreground))'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="calories" 
                stroke="rgb(var(--chart-calories))" 
                strokeWidth={3}
                dot={{ fill: 'rgb(var(--chart-calories))', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </KeystonCard>

        {/* Macro Distribution */}
        <KeystonCard className="mb-6">
          <h3 className="text-[rgb(var(--foreground))] mb-4">Macro Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={macroDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgb(var(--surface))',
                    border: '2px solid rgb(var(--border))',
                    borderRadius: '12px',
                    color: 'rgb(var(--foreground))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            {macroDistribution.map((macro) => (
              <div key={macro.name} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: macro.color }}
                  />
                  <p className="text-sm text-[rgb(var(--foreground-secondary))]">{macro.name}</p>
                </div>
                <p className="text-[rgb(var(--foreground))]">{macro.value}%</p>
              </div>
            ))}
          </div>
        </KeystonCard>

        {/* Macronutrients Bar Chart */}
        <KeystonCard>
          <h3 className="text-[rgb(var(--foreground))] mb-4">Macronutrients Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="rgb(var(--foreground-secondary))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="rgb(var(--foreground-secondary))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgb(var(--surface))',
                  border: '2px solid rgb(var(--border))',
                  borderRadius: '12px',
                  color: 'rgb(var(--foreground))'
                }}
              />
              <Legend 
                wrapperStyle={{ 
                  fontSize: '12px',
                  color: 'rgb(var(--foreground))'
                }}
              />
              <Bar dataKey="protein" fill="rgb(var(--chart-protein))" radius={[8, 8, 0, 0]} />
              <Bar dataKey="carbs" fill="rgb(var(--chart-carbs))" radius={[8, 8, 0, 0]} />
              <Bar dataKey="fat" fill="rgb(var(--chart-fat))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </KeystonCard>
      </div>
    </div>
  );
}
