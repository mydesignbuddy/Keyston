# State Management Documentation

## Overview

Keyston uses React Context API for global state management. This approach provides a lightweight, privacy-first solution that keeps all state management client-side with no external dependencies.

## Architecture

### Core Components

1. **AppState Model** (`src/models/AppState.ts`)
   - TypeScript interfaces defining the shape of application state
   - Default values and constants

2. **AppContext** (`src/context/AppContext.tsx`)
   - React Context provider managing global state
   - Custom hooks for accessing and updating state
   - localStorage persistence for state recovery

3. **Custom Hooks** (`src/hooks/useAppContext.ts`)
   - Convenience exports for importing hooks

## State Structure

```typescript
interface AppState {
  currentDate: Date;        // Currently selected date for food diary
  dailyGoals: DailyGoals;   // User's nutrition goals
  theme: Theme;             // Theme preference (light/dark/system)
  isLoading: boolean;       // Global loading indicator
}

interface DailyGoals {
  calories: number;  // Target calories per day
  protein: number;   // Target protein in grams
  carbs: number;     // Target carbs in grams
  fat: number;       // Target fat in grams
}
```

## Usage Examples

### Basic Setup

The `AppProvider` wraps the entire application in `App.tsx`:

```typescript
import { AppProvider } from './context/AppContext';

const App: React.FC = () => (
  <AppProvider>
    {/* Your app components */}
  </AppProvider>
);
```

### Accessing State in Components

#### Using the Main Hook

```typescript
import { useApp } from './hooks/useAppContext';

function MyComponent() {
  const { state, setCurrentDate, updateDailyGoals, setTheme } = useApp();

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  return (
    <div>
      <p>Current Date: {state.currentDate.toLocaleDateString()}</p>
      <p>Daily Calorie Goal: {state.dailyGoals.calories}</p>
      <p>Theme: {state.theme}</p>
    </div>
  );
}
```

#### Using Convenience Hooks

```typescript
import { useCurrentDate, useDailyGoals, useTheme } from './hooks/useAppContext';

function FoodDiaryPage() {
  const [currentDate, setCurrentDate] = useCurrentDate();
  const [goals, updateGoals] = useDailyGoals();

  return (
    <div>
      <DatePicker date={currentDate} onChange={setCurrentDate} />
      <NutritionGoals goals={goals} onUpdate={updateGoals} />
    </div>
  );
}
```

### Available Hooks

| Hook | Returns | Description |
|------|---------|-------------|
| `useApp()` | `AppContextType` | Access to all state and update functions |
| `useCurrentDate()` | `[Date, (date: Date) => void]` | Current date and setter |
| `useDailyGoals()` | `[DailyGoals, (goals: DailyGoals) => void]` | Daily goals and updater |
| `useTheme()` | `[Theme, (theme: Theme) => void]` | Theme and setter |
| `useLoading()` | `[boolean, (loading: boolean) => void]` | Loading state and setter |

### Updating State

#### Update Current Date
```typescript
const { setCurrentDate } = useApp();
setCurrentDate(new Date('2024-06-15'));
```

#### Update Daily Goals
```typescript
const { updateDailyGoals } = useApp();
updateDailyGoals({
  calories: 2500,
  protein: 180,
  carbs: 250,
  fat: 70
});
```

#### Change Theme
```typescript
const { setTheme } = useApp();
setTheme('dark'); // 'light' | 'dark' | 'system'
```

#### Set Loading State
```typescript
const { setIsLoading } = useApp();
setIsLoading(true);
// Perform async operation
setIsLoading(false);
```

#### Reset State
```typescript
const { resetState } = useApp();
resetState(); // Resets to defaults and clears localStorage
```

## State Persistence

**Important: Privacy-First Architecture**

Only UI preferences are persisted to localStorage. Health-related data follows a different pattern:

- **Persisted to localStorage (UI Preferences)**:
  - `theme` - User's theme preference (light/dark/system)
  - `isLoading` - Global loading indicator state
  
- **NOT Persisted to localStorage (Health Data)**:
  - `dailyGoals` - Should be stored in IndexedDB when implemented
  - `currentDate` - Should be stored in IndexedDB when implemented

### localStorage Details

- **Storage Key**: `keyston_ui_preferences`
- **Automatic Save**: UI preferences save whenever theme or isLoading changes
- **Automatic Load**: Preferences load from localStorage on app initialization
- **Error Handling**: Gracefully handles corrupted data by falling back to defaults

### Privacy Considerations

- **Only UI preferences stored in localStorage** (theme, loading state)
- **Health data (dailyGoals, currentDate) NOT stored in localStorage**
- Health data should use IndexedDB with proper encryption (to be implemented in future sprints)
- localStorage is client-side only (never transmitted)
- Data can be cleared using `resetState()` or clearing browser data
- Health/fitness data should be stored in IndexedDB (separate from state management)

## Testing

### Testing Components with State

```typescript
import { render } from '@testing-library/react';
import { AppProvider } from './context/AppContext';

test('component uses state', () => {
  render(
    <AppProvider>
      <MyComponent />
    </AppProvider>
  );
  // Your assertions
});
```

### Testing with Custom Initial State

```typescript
test('component with custom initial state', () => {
  const customDate = new Date('2024-01-01');
  
  render(
    <AppProvider initialState={{ currentDate: customDate }}>
      <MyComponent />
    </AppProvider>
  );
  // Your assertions
});
```

### Running State Management Tests

```bash
# Run all tests
npm test

# Run state management tests specifically
npm test -- AppContext.test.tsx
```

## Best Practices

### Do's ✅

- Use convenience hooks for specific state slices
- Keep state updates minimal and focused
- Use `useApp()` only when you need multiple state values
- Test components with the AppProvider wrapper
- Clear localStorage when resetting user data

### Don'ts ❌

- Don't store sensitive health data in AppState (use IndexedDB)
- Don't mutate state directly (use provided setter functions)
- Don't access localStorage directly for state (use context hooks)
- Don't create multiple instances of AppProvider
- Don't use context for component-local state (use useState)

## Adding New State

To add new state properties:

1. **Update the Model** (`src/models/AppState.ts`):
```typescript
export interface AppState {
  // ... existing properties
  newProperty: string;
}

export const DEFAULT_APP_STATE: AppState = {
  // ... existing defaults
  newProperty: 'default value',
};
```

2. **Add Setter to Context** (`src/context/AppContext.tsx`):
```typescript
interface AppContextType {
  // ... existing methods
  setNewProperty: (value: string) => void;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // ... existing code
  
  const setNewProperty = (value: string): void => {
    setState((prev) => ({ ...prev, newProperty: value }));
  };

  return (
    <AppContext.Provider value={{ ..., setNewProperty }}>
      {children}
    </AppContext.Provider>
  );
};
```

3. **Create Convenience Hook** (optional):
```typescript
export const useNewProperty = (): [string, (value: string) => void] => {
  const { state, setNewProperty } = useApp();
  return [state.newProperty, setNewProperty];
};
```

4. **Add Tests** (`src/context/AppContext.test.tsx`):
```typescript
it('should update new property', () => {
  const { result } = renderHook(() => useApp(), { wrapper });
  
  act(() => {
    result.current.setNewProperty('new value');
  });
  
  expect(result.current.state.newProperty).toBe('new value');
});
```

## Troubleshooting

### State not persisting across navigation
- Ensure AppProvider wraps your router
- Check browser console for localStorage errors
- Verify no quota exceeded errors

### Hook throws "must be used within AppProvider"
- Ensure component is rendered inside AppProvider
- Check that AppProvider is at the root of your component tree

### State resets unexpectedly
- Check for multiple AppProvider instances
- Verify localStorage isn't being cleared elsewhere
- Check browser's privacy settings (localStorage may be disabled)

## Related Documentation

- [React Context API](https://react.dev/reference/react/useContext)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## Future Considerations

As the app grows, consider:
- Migration to Zustand if state complexity increases significantly
- IndexedDB for larger data structures (food entries, workout logs)
- State slicing if context causes performance issues
- State machines (XState) for complex UI flows
