/**
 * Food diary entry - a logged food item for a specific meal
 */
export interface FoodDiaryEntry {
  id: string; // UUID
  foodId: string; // Reference to Foods table
  entryDate: string; // ISO date string (YYYY-MM-DD)
  mealType: MealType;
  servingSize: number;
  servingUnit: string;

  // Nutrition data (denormalized for performance)
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  sugarG?: number;
  sodiumMg?: number;

  // Optional micronutrients
  micronutrients?: Micronutrients;

  // Metadata
  createdAt: Date;
}

/**
 * Meal type classification
 */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/**
 * Micronutrients (vitamins, minerals)
 */
export interface Micronutrients {
  vitaminA?: number; // mcg
  vitaminC?: number; // mg
  vitaminD?: number; // mcg
  vitaminE?: number; // mg
  vitaminK?: number; // mcg
  calcium?: number; // mg
  iron?: number; // mg
  potassium?: number; // mg
  zinc?: number; // mg
  [key: string]: number | undefined;
}

/**
 * Daily nutrition totals
 */
export interface DailyNutritionTotals {
  date: string; // ISO date string
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sugarG: number;
  sodiumMg: number;
  entryCount: number;
}
