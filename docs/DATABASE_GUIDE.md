# IndexedDB Data Layer - Usage Guide

This guide explains how to use the IndexedDB data layer implemented with Dexie.js.

## Quick Start

```typescript
import { db, UserSettingsService, FoodDiaryService } from './services';

// Initialize database on app startup
await db.initializeDefaults();

// Get user settings
const settings = await UserSettingsService.getSettings();

// Add a food diary entry
const entry = await FoodDiaryService.addEntry({
  foodId: 'food-123',
  entryDate: '2024-01-15',
  mealType: 'breakfast',
  servingSize: 150,
  servingUnit: 'g',
  calories: 300,
  proteinG: 20,
  carbsG: 30,
  fatG: 10,
});
```

## Database Structure

The database contains 10 object stores:

1. **userSettings** - Single record with user preferences
2. **foodDiaryEntries** - All food log entries
3. **foods** - Cached food nutrition data
4. **favoriteFoods** - User's favorite foods
5. **workoutEntries** - Workout log entries
6. **workoutExercises** - Exercises within workouts
7. **workoutPresets** - Saved workout templates
8. **presetExercises** - Exercises in presets
9. **googleDriveSync** - Sync metadata
10. **apiCache** - Cached API responses

## Services Overview

### UserSettingsService

Manages user preferences and daily goals.

```typescript
// Get settings
const settings = await UserSettingsService.getSettings();

// Update calorie goal
await UserSettingsService.updateCalorieGoal(2500);

// Update macro targets
await UserSettingsService.updateMacroTargets({
  protein: 180,
  carbs: 250,
  fat: 70,
});

// Update preferences
await UserSettingsService.updatePreferences({
  theme: 'dark',
  measurementSystem: 'metric',
});

// Reset to defaults
await UserSettingsService.resetToDefaults();
```

### FoodDiaryService

Manages food diary entries and nutrition tracking.

```typescript
// Add entry
const entry = await FoodDiaryService.addEntry({
  foodId: 'food-123',
  entryDate: '2024-01-15',
  mealType: 'breakfast',
  servingSize: 150,
  servingUnit: 'g',
  calories: 300,
  proteinG: 20,
  carbsG: 30,
  fatG: 10,
});

// Get entries for a date
const entries = await FoodDiaryService.getEntriesForDate('2024-01-15');

// Get entries for a specific meal
const breakfastEntries = await FoodDiaryService.getEntriesByMeal(
  '2024-01-15',
  'breakfast'
);

// Calculate daily totals
const totals = await FoodDiaryService.calculateDailyTotals('2024-01-15');
console.log(totals.calories); // Total calories for the day

// Update entry
await FoodDiaryService.updateEntry(entry.id, {
  servingSize: 200,
  calories: 400,
});

// Delete entry
await FoodDiaryService.deleteEntry(entry.id);

// Get entries in date range
const rangeEntries = await FoodDiaryService.getEntriesInRange(
  '2024-01-01',
  '2024-01-31'
);
```

### FoodService

Manages food database (cached nutrition data).

```typescript
// Add food
const food = await FoodService.addFood({
  name: 'Apple',
  dataSource: 'usda',
  externalId: 'usda-12345',
  servingSizeDefault: 100,
  servingUnitDefault: 'g',
  caloriesPerServing: 95,
  proteinG: 0.5,
  carbsG: 25,
  fatG: 0.3,
});

// Search foods
const results = await FoodService.searchFoods('apple', 10);

// Get food by barcode
const foodByBarcode = await FoodService.getFoodByBarcode('123456789');

// Import from search result
const importedFood = await FoodService.importFromSearchResult({
  id: 'external-123',
  name: 'Banana',
  dataSource: 'usda',
  calories: 105,
  protein: 1.3,
  carbs: 27,
  fat: 0.4,
});
```

### FavoriteFoodsService

Manages user's favorite foods for quick access.

```typescript
// Add to favorites
const favorite = await FavoriteFoodsService.addFavorite('food-123');

// Check if favorite
const isFav = await FavoriteFoodsService.isFavorite('food-123');

// Get all favorites (sorted by last used)
const favorites = await FavoriteFoodsService.getAllFavorites();

// Get top favorites by usage count
const topFavorites = await FavoriteFoodsService.getTopFavorites(10);

// Increment usage (when user logs a favorite food)
await FavoriteFoodsService.incrementUsageByFoodId('food-123');

// Remove from favorites
await FavoriteFoodsService.removeFavoriteByFoodId('food-123');
```

### WorkoutService

Manages workout entries and exercises.

```typescript
// Add workout with exercises
const { workout, exercises } = await WorkoutService.addWorkoutWithExercises(
  {
    workoutDate: '2024-01-15',
    workoutType: 'strength',
    notes: 'Great session!',
  },
  [
    {
      exerciseName: 'Bench Press',
      category: 'chest',
      sets: 3,
      reps: 10,
      weightKg: 80,
      orderIndex: 0,
    },
    {
      exerciseName: 'Squats',
      category: 'legs',
      sets: 4,
      reps: 8,
      weightKg: 100,
      orderIndex: 1,
    },
  ]
);

// Get workouts for a date
const workouts = await WorkoutService.getWorkoutsForDate('2024-01-15');

// Get exercises for a workout
const workoutExercises = await WorkoutService.getExercisesForWorkout(workout.id);

// Update workout
await WorkoutService.updateWorkout(workout.id, {
  notes: 'Updated notes',
});

// Delete workout (also deletes exercises)
await WorkoutService.deleteWorkout(workout.id);
```

### ApiCacheService

Manages API response caching with TTL.

```typescript
import { CACHE_TTL } from './models';

// Cache data
await ApiCacheService.set('food_search_apple', results, CACHE_TTL.FOOD_SEARCH);

// Get cached data
const cached = await ApiCacheService.get('food_search_apple');

// Check if exists
const exists = await ApiCacheService.has('food_search_apple');

// Cache food search results (convenience method)
await ApiCacheService.cacheSearchResults('apple', results);
const cachedResults = await ApiCacheService.getCachedSearchResults('apple');

// Cache barcode lookup (convenience method)
await ApiCacheService.cacheBarcodeLookup('123456789', result);
const cachedBarcode = await ApiCacheService.getCachedBarcodeLookup('123456789');

// Clear expired cache
const clearedCount = await ApiCacheService.clearExpired();

// Clear all cache
await ApiCacheService.clearAll();

// Get statistics
const stats = await ApiCacheService.getStatistics();
console.log(`Active: ${stats.active}, Expired: ${stats.expired}`);
```

## Database Utility Methods

The main database instance (`db`) provides utility methods:

```typescript
import { db } from './services';

// Initialize defaults
await db.initializeDefaults();

// Clear all user data
await db.clearAllData();

// Export all data as JSON
const json = await db.exportAllData();

// Get database statistics
const stats = await db.getStatistics();
console.log(stats);
// {
//   userSettings: 1,
//   foodDiaryEntries: 42,
//   foods: 156,
//   ...
// }
```

## Error Handling

All service methods throw errors that should be caught:

```typescript
try {
  const entry = await FoodDiaryService.addEntry({...});
} catch (error) {
  console.error('Failed to add entry:', error);
  // Show user-friendly error message
}
```

## Best Practices

1. **Initialize on App Startup**: Call `db.initializeDefaults()` when your app starts
2. **Use Services**: Always use service methods instead of directly accessing `db` tables
3. **Handle Errors**: Wrap all database operations in try-catch blocks
4. **Use Transactions**: For multiple related operations, use Dexie transactions
5. **Cache Wisely**: Use appropriate TTL values for different types of cached data
6. **Clean Up**: Periodically call `ApiCacheService.clearExpired()` to clean old cache

## TypeScript Types

All models are fully typed and exported from `./models`:

```typescript
import {
  UserSettings,
  FoodDiaryEntry,
  Food,
  WorkoutEntry,
  ApiCache,
  // ... and more
} from './models';
```

## Testing

All services have comprehensive test coverage. See `src/services/__tests__/` for examples.

## Privacy & Security

- ✅ All data stays local in IndexedDB
- ✅ No backend servers or APIs (except nutrition data APIs)
- ✅ User owns and controls all data
- ✅ Optional encrypted backup to Google Drive (coming soon)
