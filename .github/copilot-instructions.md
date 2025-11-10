# GitHub Copilot Instructions for Keyston

## Project Overview

Keyston is a **privacy-first, offline-first fitness and health tracking mobile application** built with Ionic + React + TypeScript. The app focuses on nutrition tracking (food diary, food search/scanner) and workout management with complete user privacy.

### Core Architecture Principles

**CRITICAL: Privacy-First Architecture**
- ❌ **NO BACKEND SERVERS** - All logic runs client-side
- ❌ **NO USER ACCOUNTS** - No authentication, no login system
- ❌ **NO ANALYTICS/TRACKING** - Zero telemetry or data collection
- ✅ **LOCAL STORAGE ONLY** - IndexedDB for all user data
- ✅ **OFFLINE-FIRST** - App must work without internet
- ✅ **OPTIONAL ENCRYPTED BACKUP** - User-controlled Google Drive sync

---

## Technology Stack

### Core Framework
- **Framework**: Ionic 7+ with React 18+
- **Language**: TypeScript (strict mode)
- **State Management**: React Context API or Zustand (lightweight only)
- **Local Database**: IndexedDB with Dexie.js wrapper
- **Native Features**: Capacitor 5+ plugins
- **Styling**: Ionic Components + CSS Variables

### External Dependencies
- **Nutrition APIs**: USDA FoodData Central, Open Food Facts (client-side only)
- **Charts**: Recharts or Chart.js for data visualization
- **Barcode Scanner**: Capacitor Camera + barcode detection library
- **Cloud Backup**: Capacitor Google Drive plugin (optional)

---

## Code Generation Guidelines

### 1. TypeScript Standards

**Always use strict TypeScript:**
```typescript
// ✅ CORRECT: Strong typing with interfaces
interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  servingUnit: string;
  timestamp: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

// ❌ INCORRECT: Using 'any' or weak typing
const foodEntry: any = { ... };
```

**Use proper type guards:**
```typescript
// ✅ CORRECT
function isFoodEntry(obj: unknown): obj is FoodEntry {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'calories' in obj
  );
}

// ❌ INCORRECT: Type casting without validation
const entry = data as FoodEntry;
```

### 2. Component Structure

**Ionic + React functional components with hooks:**
```typescript
import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

interface FoodDiaryPageProps {
  date: Date;
}

const FoodDiaryPage: React.FC<FoodDiaryPageProps> = ({ date }) => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadEntries();
  }, [date]);

  const loadEntries = async () => {
    // Load from IndexedDB
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Food Diary</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Content */}
      </IonContent>
    </IonPage>
  );
};

export default FoodDiaryPage;
```

### 3. Data Layer - IndexedDB Pattern

**Always use IndexedDB for local storage (NO localStorage for user data):**

```typescript
// services/database.ts
import Dexie, { Table } from 'dexie';

export class KeystonDatabase extends Dexie {
  foodEntries!: Table<FoodEntry>;
  workoutEntries!: Table<WorkoutEntry>;
  foodCache!: Table<CachedFood>;

  constructor() {
    super('KeystonDB');
    this.version(1).stores({
      foodEntries: '++id, timestamp, mealType, date',
      workoutEntries: '++id, timestamp, date',
      foodCache: 'id, name, lastUpdated'
    });
  }
}

export const db = new KeystonDatabase();

// Service layer usage
export class FoodDiaryService {
  static async addEntry(entry: Omit<FoodEntry, 'id'>): Promise<string> {
    const id = await db.foodEntries.add({
      ...entry,
      id: crypto.randomUUID(),
    });
    return id.toString();
  }

  static async getEntriesForDate(date: Date): Promise<FoodEntry[]> {
    const dateStr = date.toISOString().split('T')[0];
    return await db.foodEntries
      .where('date')
      .equals(dateStr)
      .toArray();
  }
}
```

### 4. API Integration Pattern

**Client-side API calls with development proxy support and caching:**

```typescript
// services/nutritionApi.ts
import { db } from './database';
import { Capacitor } from '@capacitor/core';

export class NutritionApiService {
  private static USDA_BASE_URL = NutritionApiService.getApiBaseUrl();
  private static API_KEY = process.env.REACT_APP_USDA_API_KEY;

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

  static async searchFoods(query: string): Promise<FoodSearchResult[]> {
    // Check cache first (privacy: reduce external calls)
    const cached = await db.foodCache
      .where('name')
      .startsWithIgnoreCase(query)
      .toArray();

    if (cached.length > 0) {
      return cached.map(this.mapCachedToResult);
    }

    // Fetch from USDA API (proxied in dev, direct in production)
    try {
      const response = await fetch(
        `${this.USDA_BASE_URL}/foods/search?query=${encodeURIComponent(query)}&api_key=${this.API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Cache results locally
      await this.cacheResults(data.foods);
      
      return data.foods;
    } catch (error) {
      console.error('Nutrition API error:', error);
      throw new Error('Failed to fetch nutrition data');
    }
  }

  private static async cacheResults(foods: any[]): Promise<void> {
    const cached = foods.map(food => ({
      id: food.fdcId.toString(),
      name: food.description,
      data: food,
      lastUpdated: Date.now()
    }));
    
    await db.foodCache.bulkPut(cached);
  }
}
```

**Vite proxy configuration for development (vite.config.ts):**

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

### 5. State Management

**Use React Context for global state (keep it simple):**

```typescript
// context/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  currentDate: Date;
  dailyGoals: DailyGoals;
  theme: 'light' | 'dark';
}

interface AppContextType {
  state: AppState;
  setCurrentDate: (date: Date) => void;
  updateDailyGoals: (goals: DailyGoals) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    currentDate: new Date(),
    dailyGoals: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
    theme: 'light'
  });

  const setCurrentDate = (date: Date) => {
    setState(prev => ({ ...prev, currentDate: date }));
  };

  return (
    <AppContext.Provider value={{ state, setCurrentDate, ... }}>
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

### 6. Capacitor Native Features

**Camera/Barcode Scanner:**
```typescript
import { Camera, CameraResultType } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

export class BarcodeScannerService {
  static async scanBarcode(): Promise<string | null> {
    // Request permissions
    const status = await BarcodeScanner.checkPermission({ force: true });
    
    if (!status.granted) {
      throw new Error('Camera permission denied');
    }

    // Start scanning
    const result = await BarcodeScanner.startScan();
    
    if (result.hasContent) {
      return result.content; // UPC/EAN code
    }
    
    return null;
  }
}
```

### 7. Error Handling

**Consistent error handling pattern:**
```typescript
// utils/errorHandler.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new AppError(
      error.message,
      'UNKNOWN_ERROR',
      'An unexpected error occurred. Please try again.'
    );
  }
  
  return new AppError(
    'Unknown error',
    'UNKNOWN_ERROR',
    'Something went wrong. Please try again.'
  );
};
```

---

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── FoodCard.tsx
│   ├── NutritionChart.tsx
│   └── ExerciseCard.tsx
├── pages/               # Ionic page components
│   ├── FoodDiary/
│   ├── FoodScanner/
│   └── WorkoutTracker/
├── services/            # Business logic & data services
│   ├── database.ts      # IndexedDB setup with Dexie
│   ├── nutritionApi.ts  # USDA/Open Food Facts API
│   ├── foodDiaryService.ts
│   └── workoutService.ts
├── models/              # TypeScript interfaces
│   ├── FoodEntry.ts
│   ├── WorkoutEntry.ts
│   └── NutritionData.ts
├── context/             # React Context providers
│   └── AppContext.tsx
├── hooks/               # Custom React hooks
│   ├── useFoodDiary.ts
│   └── useWorkouts.ts
├── utils/               # Helper functions
│   ├── dateUtils.ts
│   ├── nutritionCalculations.ts
│   └── errorHandler.ts
└── theme/              # Ionic theming
    └── variables.css
```

---

## Do's and Don'ts

### ✅ DO:
- Use TypeScript strictly with proper interfaces
- Store all user data in IndexedDB (never localStorage for persistent data)
- Use development proxy for API calls in web browser (CORS support)
- Make direct API calls in production mobile builds (no proxy needed)
- Cache API responses in IndexedDB
- Implement offline-first patterns
- Use Ionic components for UI consistency
- Handle errors gracefully with user-friendly messages
- Write pure functions for calculations
- Use React hooks and functional components
- Test on both iOS and Android simulators

### ❌ DON'T:
- Create backend endpoints or server-side code
- Use localStorage for user data (only for preferences)
- Implement user authentication systems
- Add analytics or tracking code
- Use third-party services that collect user data
- Create API keys or credentials systems
- Use class components (prefer functional)
- Make network calls without caching strategy
- Use inline styles (use CSS classes or CSS-in-JS)
- Hardcode values that should be configurable

---

## Testing Guidelines

**Unit Tests with Jest:**
```typescript
// services/__tests__/nutritionCalculations.test.ts
import { calculateDailyTotals } from '../nutritionCalculations';

describe('calculateDailyTotals', () => {
  it('should sum calories correctly', () => {
    const entries: FoodEntry[] = [
      { calories: 100, protein: 10, carbs: 20, fat: 5, ... },
      { calories: 200, protein: 20, carbs: 30, fat: 10, ... }
    ];
    
    const totals = calculateDailyTotals(entries);
    expect(totals.calories).toBe(300);
    expect(totals.protein).toBe(30);
  });
});
```

**Integration Tests:**
```typescript
// Test IndexedDB operations
import { db, FoodDiaryService } from '../database';

beforeEach(async () => {
  await db.delete();
  await db.open();
});

describe('FoodDiaryService', () => {
  it('should save and retrieve entries', async () => {
    const entry = { name: 'Apple', calories: 95, ... };
    const id = await FoodDiaryService.addEntry(entry);
    
    const retrieved = await FoodDiaryService.getEntry(id);
    expect(retrieved?.name).toBe('Apple');
  });
});
```

---

## Performance Optimization

1. **IndexedDB Indexing**: Index fields used in queries (date, mealType, timestamp)
2. **API Caching**: Cache nutrition data for 30 days
3. **Lazy Loading**: Code-split routes with React.lazy()
4. **Virtual Scrolling**: Use Ionic's IonVirtualScroll for long lists
5. **Debounce Search**: Debounce search input (300ms)
6. **Memoization**: Use React.memo and useMemo for expensive calculations

---

## Security & Privacy

1. **No External Analytics**: Never add Google Analytics, Mixpanel, etc.
2. **Minimal API Calls**: Cache aggressively to reduce external requests
3. **Local Encryption** (future): Encrypt IndexedDB data for backup
4. **No User Identifiers**: Never generate or store user IDs, device IDs
5. **HTTPS Only**: All API calls must use HTTPS
6. **Input Validation**: Sanitize all user inputs before storage

---

## Accessibility

- Use semantic HTML elements
- Provide ARIA labels for interactive elements
- Support keyboard navigation
- Maintain color contrast ratios (WCAG AA)
- Test with screen readers (VoiceOver, TalkBack)
- Ensure touch targets are at least 44x44px

---

## Common Tasks Reference

### Adding a new page:
```typescript
// pages/NewPage/NewPage.tsx
import { IonPage, IonHeader, IonContent } from '@ionic/react';

const NewPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>...</IonHeader>
      <IonContent>...</IonContent>
    </IonPage>
  );
};

export default NewPage;

// Add route in App.tsx
<Route path="/new-page" component={NewPage} exact />
```

### Adding IndexedDB table:
```typescript
// Update database.ts version
this.version(2).stores({
  ...existingStores,
  newTable: '++id, indexedField, date'
});
```

### Adding a service:
```typescript
// services/newService.ts
import { db } from './database';

export class NewService {
  static async getData(): Promise<Data[]> {
    return await db.newTable.toArray();
  }
}
```

---

## Sprint Context Awareness

When working on specific sprints, prioritize these focuses:

- **Sprint 0**: Project setup, navigation, IndexedDB schema, Capacitor plugins
- **Sprint 1**: Food diary CRUD, nutrition display, data models
- **Sprint 2**: Charts, trends, goal tracking
- **Sprint 3**: API integration, search UI, caching
- **Sprint 4**: Barcode scanner, camera integration
- **Sprint 5**: Workout tracker, exercise logging
- **Sprint 6-7**: Testing, optimization, polish

---

## Quick Reference Links

- [Ionic React Docs](https://ionicframework.com/docs/react)
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Dexie.js Guide](https://dexie.org/docs/Tutorial/React)
- [USDA FoodData Central API](https://fdc.nal.usda.gov/api-guide.html)
- [Open Food Facts API](https://world.openfoodfacts.org/data)

---

**Remember: Privacy first, offline first, user data ownership always.**
