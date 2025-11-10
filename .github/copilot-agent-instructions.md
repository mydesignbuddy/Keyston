# Copilot Agent Instructions for Keyston

This file provides specific guidance for GitHub Copilot agents working on issues and tasks in the Keyston project.

---

## Agent Role & Responsibilities

As a Copilot agent working on Keyston tasks, your role is to:

1. **Implement features** according to sprint plan and architecture
2. **Write clean, type-safe TypeScript code** following project standards
3. **Maintain privacy-first architecture** - no backend, no tracking, local storage only
4. **Test your implementations** thoroughly before marking complete
5. **Document your changes** with clear commit messages

---

## Before Starting Any Task

### ✅ Pre-work Checklist

1. **Read the issue description carefully** - understand acceptance criteria
2. **Check related documentation**:
   - `/project/ARCHITECTURE.md` - System design and patterns
   - `/project/FEATURE_SPECIFICATIONS.md` - Detailed requirements
   - `/project/DEVELOPMENT_ROADMAP.md` - Sprint context
   - `/.github/copilot-instructions.md` - Coding standards
3. **Identify dependencies** - what needs to exist before you start?
4. **Review existing code** - understand current patterns and structure
5. **Check for related issues** - avoid duplicate work

---

## Task-Specific Guidelines

### Sprint 0: Project Setup Tasks

#### Setting up IndexedDB Schema
```typescript
// File: src/services/database.ts
import Dexie, { Table } from 'dexie';

// Define models first in src/models/
export interface FoodEntry {
  id?: number;
  uuid: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  servingUnit: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string; // ISO date string for indexing
  timestamp: number;
}

export class KeystonDB extends Dexie {
  foodEntries!: Table<FoodEntry>;
  workoutEntries!: Table<WorkoutEntry>;
  cachedFoods!: Table<CachedFood>;
  userSettings!: Table<UserSettings>;

  constructor() {
    super('KeystonDB');
    
    this.version(1).stores({
      foodEntries: '++id, uuid, date, mealType, timestamp',
      workoutEntries: '++id, uuid, date, timestamp',
      cachedFoods: 'fdcId, name, lastUpdated',
      userSettings: 'key'
    });
  }
}

export const db = new KeystonDB();
```

**Testing**: Always test IndexedDB operations
```typescript
// Test in browser console or create test file
import { db } from './database';

const testEntry = {
  uuid: crypto.randomUUID(),
  name: 'Test Food',
  calories: 100,
  protein: 10,
  carbs: 20,
  fat: 5,
  servingSize: 100,
  servingUnit: 'g',
  mealType: 'breakfast',
  date: new Date().toISOString().split('T')[0],
  timestamp: Date.now()
};

await db.foodEntries.add(testEntry);
const entries = await db.foodEntries.toArray();
console.log('Entries:', entries);
```

#### Creating Navigation Structure
```typescript
// File: src/App.tsx
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { restaurant, search, barbell, settings } from 'ionicons/icons';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/diary" component={FoodDiaryPage} exact />
          <Route path="/search" component={FoodSearchPage} exact />
          <Route path="/workout" component={WorkoutPage} exact />
          <Route path="/settings" component={SettingsPage} exact />
          <Route exact path="/" render={() => <Redirect to="/diary" />} />
        </IonRouterOutlet>
        
        <IonTabBar slot="bottom">
          <IonTabButton tab="diary" href="/diary">
            <IonIcon icon={restaurant} />
            <IonLabel>Diary</IonLabel>
          </IonTabButton>
          <IonTabButton tab="search" href="/search">
            <IonIcon icon={search} />
            <IonLabel>Search</IonLabel>
          </IonTabButton>
          <IonTabButton tab="workout" href="/workout">
            <IonIcon icon={barbell} />
            <IonLabel>Workout</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" href="/settings">
            <IonIcon icon={settings} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);
```

#### Setting up State Management
```typescript
// File: src/context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../services/database';

interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface AppState {
  currentDate: Date;
  dailyGoals: DailyGoals;
  theme: 'light' | 'dark';
  isLoading: boolean;
}

interface AppContextType {
  state: AppState;
  setCurrentDate: (date: Date) => void;
  updateDailyGoals: (goals: Partial<DailyGoals>) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    currentDate: new Date(),
    dailyGoals: { calories: 2000, protein: 150, carbs: 250, fat: 65 },
    theme: 'light',
    isLoading: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await db.userSettings.get('dailyGoals');
      if (settings) {
        setState(prev => ({ ...prev, dailyGoals: settings.value }));
      }
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const updateDailyGoals = async (goals: Partial<DailyGoals>) => {
    const newGoals = { ...state.dailyGoals, ...goals };
    setState(prev => ({ ...prev, dailyGoals: newGoals }));
    await db.userSettings.put({ key: 'dailyGoals', value: newGoals });
  };

  return (
    <AppContext.Provider value={{ state, setCurrentDate, updateDailyGoals, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
```

---

### Sprint 1: Food Diary Tasks

#### Creating Food Entry Service
```typescript
// File: src/services/foodDiaryService.ts
import { db } from './database';
import { FoodEntry } from '../models/FoodEntry';

export class FoodDiaryService {
  /**
   * Add a new food entry to the diary
   */
  static async addEntry(entry: Omit<FoodEntry, 'id' | 'uuid' | 'timestamp'>): Promise<string> {
    const uuid = crypto.randomUUID();
    const newEntry: Omit<FoodEntry, 'id'> = {
      ...entry,
      uuid,
      timestamp: Date.now()
    };
    
    await db.foodEntries.add(newEntry);
    return uuid;
  }

  /**
   * Get all entries for a specific date
   */
  static async getEntriesForDate(date: Date): Promise<FoodEntry[]> {
    const dateStr = this.formatDate(date);
    return await db.foodEntries
      .where('date')
      .equals(dateStr)
      .sortBy('timestamp');
  }

  /**
   * Get entries by meal type for a date
   */
  static async getEntriesByMealType(
    date: Date, 
    mealType: FoodEntry['mealType']
  ): Promise<FoodEntry[]> {
    const dateStr = this.formatDate(date);
    return await db.foodEntries
      .where(['date', 'mealType'])
      .equals([dateStr, mealType])
      .sortBy('timestamp');
  }

  /**
   * Update an existing entry
   */
  static async updateEntry(
    uuid: string, 
    updates: Partial<Omit<FoodEntry, 'id' | 'uuid' | 'timestamp'>>
  ): Promise<void> {
    const entry = await db.foodEntries.where('uuid').equals(uuid).first();
    if (!entry) throw new Error('Entry not found');
    
    await db.foodEntries.update(entry.id!, updates);
  }

  /**
   * Delete an entry
   */
  static async deleteEntry(uuid: string): Promise<void> {
    await db.foodEntries.where('uuid').equals(uuid).delete();
  }

  /**
   * Calculate daily totals
   */
  static async getDailyTotals(date: Date): Promise<DailyTotals> {
    const entries = await this.getEntriesForDate(date);
    
    return entries.reduce((totals, entry) => ({
      calories: totals.calories + entry.calories,
      protein: totals.protein + entry.protein,
      carbs: totals.carbs + entry.carbs,
      fat: totals.fat + entry.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }

  private static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
```

#### Creating Food Diary UI Component
```typescript
// File: src/pages/FoodDiary/FoodDiaryPage.tsx
import React, { useState, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonSegment, IonSegmentButton, IonFab, IonFabButton
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { FoodDiaryService } from '../../services/foodDiaryService';
import { FoodEntry } from '../../models/FoodEntry';
import { useApp } from '../../context/AppContext';
import NutritionSummary from '../../components/NutritionSummary';
import FoodEntryCard from '../../components/FoodEntryCard';

const FoodDiaryPage: React.FC = () => {
  const { state } = useApp();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<string>('all');
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, [state.currentDate]);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const entries = await FoodDiaryService.getEntriesForDate(state.currentDate);
      setEntries(entries);
      
      const dailyTotals = await FoodDiaryService.getDailyTotals(state.currentDate);
      setTotals(dailyTotals);
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEntries = selectedMeal === 'all' 
    ? entries 
    : entries.filter(e => e.mealType === selectedMeal);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Food Diary</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <NutritionSummary totals={totals} goals={state.dailyGoals} />
        
        <IonSegment value={selectedMeal} onIonChange={e => setSelectedMeal(e.detail.value!)}>
          <IonSegmentButton value="all">All</IonSegmentButton>
          <IonSegmentButton value="breakfast">Breakfast</IonSegmentButton>
          <IonSegmentButton value="lunch">Lunch</IonSegmentButton>
          <IonSegmentButton value="dinner">Dinner</IonSegmentButton>
          <IonSegmentButton value="snack">Snacks</IonSegmentButton>
        </IonSegment>

        <IonList>
          {filteredEntries.map(entry => (
            <FoodEntryCard 
              key={entry.uuid} 
              entry={entry}
              onDelete={() => handleDelete(entry.uuid)}
              onEdit={() => handleEdit(entry)}
            />
          ))}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => {/* Open add food modal */}}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default FoodDiaryPage;
```

---

### Sprint 3: API Integration Tasks

#### Creating Nutrition API Service
```typescript
// File: src/services/nutritionApiService.ts
import { db } from './database';
import { Capacitor } from '@capacitor/core';

interface USDASearchResult {
  fdcId: number;
  description: string;
  dataType: string;
  foodNutrients: Array<{
    nutrientId: number;
    nutrientName: string;
    value: number;
    unitName: string;
  }>;
}

export class NutritionApiService {
  private static USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY;
  private static USDA_BASE_URL = NutritionApiService.getApiBaseUrl();
  private static CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

  /**
   * Get API base URL based on platform
   * - Web browser (development): Use proxy to avoid CORS issues
   * - Native mobile (production): Direct API calls
   */
  private static getApiBaseUrl(): string {
    const isNative = Capacitor.isNativePlatform();
    
    if (isNative) {
      // Production: Direct API calls from mobile app
      return 'https://api.nal.usda.gov/fdc/v1';
    } else {
      // Development: Use Vite proxy to avoid CORS
      return '/api/usda';
    }
  }

  /**
   * Search foods from USDA database with local caching
   */
  static async searchFoods(query: string, limit: number = 20): Promise<FoodSearchResult[]> {
    if (query.length < 2) return [];

    // Check cache first
    const cacheKey = `search_${query.toLowerCase()}`;
    const cached = await this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${this.USDA_BASE_URL}/foods/search?query=${encodeURIComponent(query)}&pageSize=${limit}&api_key=${this.USDA_API_KEY}`,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (!response.ok) {
        throw new Error(`USDA API error: ${response.status}`);
      }

      const data = await response.json();
      const results = this.mapUSDAResults(data.foods);

      // Cache results
      await this.cacheResults(cacheKey, results);

      return results;
    } catch (error) {
      console.error('USDA API search failed:', error);
      throw new Error('Failed to search foods. Please try again.');
    }
  }

  /**
   * Get food details by FDC ID
   */
  static async getFoodById(fdcId: number): Promise<FoodDetails> {
    const cached = await db.cachedFoods.get(fdcId);
    if (cached && Date.now() - cached.lastUpdated < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `${this.USDA_BASE_URL}/food/${fdcId}?api_key=${this.USDA_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`USDA API error: ${response.status}`);
      }

      const data = await response.json();
      const details = this.mapUSDAFoodDetails(data);

      // Cache food details
      await db.cachedFoods.put({
        fdcId,
        data: details,
        lastUpdated: Date.now()
      });

      return details;
    } catch (error) {
      console.error('Failed to fetch food details:', error);
      throw new Error('Failed to load food details.');
    }
  }

  private static async getCached(key: string): Promise<any> {
    const cached = await db.searchCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private static async cacheResults(key: string, data: any): Promise<void> {
    await db.searchCache.put({
      key,
      data,
      timestamp: Date.now()
    });
  }

  private static mapUSDAResults(foods: USDASearchResult[]): FoodSearchResult[] {
    return foods.map(food => ({
      fdcId: food.fdcId,
      name: food.description,
      calories: this.findNutrient(food, 1008) || 0,
      protein: this.findNutrient(food, 1003) || 0,
      carbs: this.findNutrient(food, 1005) || 0,
      fat: this.findNutrient(food, 1004) || 0,
      servingSize: 100,
      servingUnit: 'g'
    }));
  }

  private static findNutrient(food: USDASearchResult, nutrientId: number): number | null {
    const nutrient = food.foodNutrients?.find(n => n.nutrientId === nutrientId);
    return nutrient ? nutrient.value : null;
  }
}
```

**Vite Proxy Configuration (vite.config.ts):**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/usda': {
        target: 'https://api.nal.usda.gov/fdc/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/usda/, ''),
        secure: true
      },
      '/api/openfoodfacts': {
        target: 'https://world.openfoodfacts.org/api/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openfoodfacts/, ''),
        secure: true
      }
    }
  }
});
```

**How it works:**
- In web browser (development): API calls go to `/api/usda` which Vite proxies to real API (avoids CORS)
- In mobile app (production): `Capacitor.isNativePlatform()` returns true, uses direct API URLs
- No backend server needed - just a development convenience

---

## Common Patterns & Best Practices

### 1. Error Handling in Components
```typescript
const [error, setError] = useState<string | null>(null);

const loadData = async () => {
  try {
    setError(null);
    // Load data
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
  }
};

// In JSX
{error && <IonText color="danger">{error}</IonText>}
```

### 2. Loading States
```typescript
const [isLoading, setIsLoading] = useState(false);

// In JSX
{isLoading ? <IonSpinner /> : <ContentComponent />}
```

### 3. Form Handling
```typescript
const [formData, setFormData] = useState({ name: '', calories: 0 });

const handleInputChange = (field: string, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

const handleSubmit = async () => {
  // Validate
  if (!formData.name.trim()) {
    setError('Name is required');
    return;
  }
  
  // Submit
  await service.save(formData);
};
```

### 4. Date Formatting
```typescript
// utils/dateUtils.ts
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const formatDisplayDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};
```

---

## Testing Your Work

### Manual Testing Checklist

Before marking a task complete:

- [ ] Code compiles without TypeScript errors
- [ ] Component renders without errors
- [ ] All interactive elements work (buttons, inputs, etc.)
- [ ] Data persists after page refresh (IndexedDB check)
- [ ] Offline functionality works (disconnect network)
- [ ] Mobile responsive (test in device mode)
- [ ] Accessibility: keyboard navigation works
- [ ] Error states display properly
- [ ] Loading states work correctly
- [ ] No console errors in browser DevTools

### Testing Commands
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Run tests
npm test

# Run in browser
ionic serve

# Test on iOS simulator
ionic capacitor run ios

# Test on Android emulator
ionic capacitor run android
```

---

## Commit Message Format

Use conventional commits:

```
feat(food-diary): add daily totals calculation
fix(api): handle USDA API rate limiting
docs(readme): update installation instructions
refactor(database): optimize IndexedDB queries
test(food-service): add unit tests for addEntry
style(ui): improve button spacing
```

---

## When You Get Stuck

1. **Check documentation** in `/project` folder
2. **Review similar code** in the codebase
3. **Check the issue** for additional context
4. **Ask for clarification** by commenting on the issue
5. **Review `.github/copilot-instructions.md`** for patterns

---

## Code Review Self-Checklist

Before submitting PR:

- [ ] TypeScript strict mode passes
- [ ] No `any` types used
- [ ] All functions have proper type signatures
- [ ] Error handling implemented
- [ ] No hardcoded values (use constants/config)
- [ ] No backend calls or user tracking code
- [ ] IndexedDB used for persistence (not localStorage)
- [ ] Code follows existing patterns
- [ ] Comments added for complex logic
- [ ] Console.logs removed (except error logging)
- [ ] Mobile responsive
- [ ] Accessibility attributes added

---

## Remember

**Privacy First**: Never add code that:
- Sends user data to external servers
- Tracks user behavior
- Requires user authentication
- Stores data anywhere except IndexedDB
- Uses third-party analytics

**API Calls**:
- Use Capacitor.isNativePlatform() to detect platform
- Web browser (dev): Use proxy paths like `/api/usda`
- Mobile app (prod): Use direct API URLs
- Always implement caching to minimize external requests

**Offline First**: Always:
- Cache API responses
- Handle network failures gracefully
- Test with network disabled
- Store everything locally first

**User Data Ownership**: 
- Users control their data
- Optional cloud backup only
- No lock-in to our platform
