/**
 * Data validation utilities
 * Validates data before storing in IndexedDB
 */

import { FoodDiaryEntry, Food, MealType, DataSource } from '../models';

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate date string format (YYYY-MM-DD)
 */
export function isValidDateString(dateStr: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    return false;
  }

  // Check if it's a valid date
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return false;
  }

  // Verify that the date components match (to catch invalid dates like 2024-02-30)
  const [year, month, day] = dateStr.split('-').map(Number);
  return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
}

/**
 * Validate meal type
 */
export function isValidMealType(mealType: string): mealType is MealType {
  return ['breakfast', 'lunch', 'dinner', 'snack'].includes(mealType);
}

/**
 * Validate data source
 */
export function isValidDataSource(dataSource: string): dataSource is DataSource {
  return ['usda', 'openfoodfacts', 'manual', 'imported'].includes(dataSource);
}

/**
 * Validate positive number
 */
export function isPositiveNumber(value: number): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value) && value >= 0;
}

/**
 * Validate non-empty string
 */
export function isNonEmptyString(value: string): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validate Food Diary Entry
 * @throws ValidationError if data is invalid
 */
export function validateFoodDiaryEntry(
  entry: Partial<FoodDiaryEntry>
): asserts entry is FoodDiaryEntry {
  // Validate required fields
  if (!entry.id || !isValidUUID(entry.id)) {
    throw new ValidationError('Invalid or missing entry ID', 'id');
  }

  if (!entry.foodId || !isValidUUID(entry.foodId)) {
    throw new ValidationError('Invalid or missing food ID', 'foodId');
  }

  if (!entry.entryDate || !isValidDateString(entry.entryDate)) {
    throw new ValidationError(
      'Invalid or missing entry date (must be YYYY-MM-DD format)',
      'entryDate'
    );
  }

  if (!entry.mealType || !isValidMealType(entry.mealType)) {
    throw new ValidationError(
      'Invalid or missing meal type (must be breakfast, lunch, dinner, or snack)',
      'mealType'
    );
  }

  // Validate serving size
  if (entry.servingSize === undefined || !isPositiveNumber(entry.servingSize)) {
    throw new ValidationError('Invalid serving size (must be a positive number)', 'servingSize');
  }

  if (!entry.servingUnit || !isNonEmptyString(entry.servingUnit)) {
    throw new ValidationError('Invalid or missing serving unit', 'servingUnit');
  }

  // Validate nutrition values (must be non-negative numbers)
  if (entry.calories === undefined || !isPositiveNumber(entry.calories)) {
    throw new ValidationError('Invalid calories (must be a non-negative number)', 'calories');
  }

  if (entry.proteinG === undefined || !isPositiveNumber(entry.proteinG)) {
    throw new ValidationError('Invalid protein (must be a non-negative number)', 'proteinG');
  }

  if (entry.carbsG === undefined || !isPositiveNumber(entry.carbsG)) {
    throw new ValidationError('Invalid carbs (must be a non-negative number)', 'carbsG');
  }

  if (entry.fatG === undefined || !isPositiveNumber(entry.fatG)) {
    throw new ValidationError('Invalid fat (must be a non-negative number)', 'fatG');
  }

  // Optional fields validation
  if (entry.fiberG !== undefined && !isPositiveNumber(entry.fiberG)) {
    throw new ValidationError('Invalid fiber (must be a non-negative number)', 'fiberG');
  }

  if (entry.sugarG !== undefined && !isPositiveNumber(entry.sugarG)) {
    throw new ValidationError('Invalid sugar (must be a non-negative number)', 'sugarG');
  }

  if (entry.sodiumMg !== undefined && !isPositiveNumber(entry.sodiumMg)) {
    throw new ValidationError('Invalid sodium (must be a non-negative number)', 'sodiumMg');
  }

  // Validate micronutrients if present
  if (entry.micronutrients) {
    for (const [key, value] of Object.entries(entry.micronutrients)) {
      if (value !== undefined && !isPositiveNumber(value)) {
        throw new ValidationError(
          `Invalid micronutrient value for ${key} (must be a non-negative number)`,
          `micronutrients.${key}`
        );
      }
    }
  }

  // Validate createdAt
  if (!entry.createdAt || !(entry.createdAt instanceof Date)) {
    throw new ValidationError('Invalid or missing createdAt timestamp', 'createdAt');
  }
}

/**
 * Validate Food data
 * @throws ValidationError if data is invalid
 */
export function validateFood(food: Partial<Food>): asserts food is Food {
  // Validate required fields
  if (!food.id || !isValidUUID(food.id)) {
    throw new ValidationError('Invalid or missing food ID', 'id');
  }

  if (!food.name || !isNonEmptyString(food.name)) {
    throw new ValidationError('Invalid or missing food name', 'name');
  }

  if (!food.dataSource || !isValidDataSource(food.dataSource)) {
    throw new ValidationError(
      'Invalid or missing data source (must be usda, openfoodfacts, manual, or imported)',
      'dataSource'
    );
  }

  // Validate barcode format if present
  if (food.barcode !== undefined && food.barcode !== null && !isNonEmptyString(food.barcode)) {
    throw new ValidationError('Invalid barcode (must be a non-empty string)', 'barcode');
  }

  // Validate brand if present
  if (food.brand !== undefined && food.brand !== null && !isNonEmptyString(food.brand)) {
    throw new ValidationError('Invalid brand (must be a non-empty string)', 'brand');
  }

  // Validate external ID if present
  if (
    food.externalId !== undefined &&
    food.externalId !== null &&
    !isNonEmptyString(food.externalId)
  ) {
    throw new ValidationError('Invalid external ID (must be a non-empty string)', 'externalId');
  }

  // Validate default serving info
  if (
    food.servingSizeDefault === undefined ||
    !isPositiveNumber(food.servingSizeDefault) ||
    food.servingSizeDefault === 0
  ) {
    throw new ValidationError(
      'Invalid serving size default (must be a positive number)',
      'servingSizeDefault'
    );
  }

  if (!food.servingUnitDefault || !isNonEmptyString(food.servingUnitDefault)) {
    throw new ValidationError('Invalid or missing serving unit default', 'servingUnitDefault');
  }

  // Validate nutrition values (must be non-negative)
  if (food.caloriesPerServing === undefined || !isPositiveNumber(food.caloriesPerServing)) {
    throw new ValidationError(
      'Invalid calories per serving (must be a non-negative number)',
      'caloriesPerServing'
    );
  }

  if (food.proteinG === undefined || !isPositiveNumber(food.proteinG)) {
    throw new ValidationError('Invalid protein (must be a non-negative number)', 'proteinG');
  }

  if (food.carbsG === undefined || !isPositiveNumber(food.carbsG)) {
    throw new ValidationError('Invalid carbs (must be a non-negative number)', 'carbsG');
  }

  if (food.fatG === undefined || !isPositiveNumber(food.fatG)) {
    throw new ValidationError('Invalid fat (must be a non-negative number)', 'fatG');
  }

  // Optional fields validation
  if (food.fiberG !== undefined && !isPositiveNumber(food.fiberG)) {
    throw new ValidationError('Invalid fiber (must be a non-negative number)', 'fiberG');
  }

  if (food.sugarG !== undefined && !isPositiveNumber(food.sugarG)) {
    throw new ValidationError('Invalid sugar (must be a non-negative number)', 'sugarG');
  }

  if (food.sodiumMg !== undefined && !isPositiveNumber(food.sodiumMg)) {
    throw new ValidationError('Invalid sodium (must be a non-negative number)', 'sodiumMg');
  }

  // Validate micronutrients if present
  if (food.micronutrients) {
    for (const [key, value] of Object.entries(food.micronutrients)) {
      if (value !== undefined && !isPositiveNumber(value)) {
        throw new ValidationError(
          `Invalid micronutrient value for ${key} (must be a non-negative number)`,
          `micronutrients.${key}`
        );
      }
    }
  }

  // Validate createdAt
  if (!food.createdAt || !(food.createdAt instanceof Date)) {
    throw new ValidationError('Invalid or missing createdAt timestamp', 'createdAt');
  }
}

/**
 * Sanitize food diary entry data
 * Removes invalid fields and normalizes values
 */
export function sanitizeFoodDiaryEntry(entry: Partial<FoodDiaryEntry>): Partial<FoodDiaryEntry> {
  return {
    ...entry,
    servingUnit: entry.servingUnit?.trim(),
    // Ensure numeric values are actually numbers
    servingSize: typeof entry.servingSize === 'number' ? entry.servingSize : undefined,
    calories: typeof entry.calories === 'number' ? entry.calories : undefined,
    proteinG: typeof entry.proteinG === 'number' ? entry.proteinG : undefined,
    carbsG: typeof entry.carbsG === 'number' ? entry.carbsG : undefined,
    fatG: typeof entry.fatG === 'number' ? entry.fatG : undefined,
    fiberG: typeof entry.fiberG === 'number' ? entry.fiberG : undefined,
    sugarG: typeof entry.sugarG === 'number' ? entry.sugarG : undefined,
    sodiumMg: typeof entry.sodiumMg === 'number' ? entry.sodiumMg : undefined,
  };
}

/**
 * Sanitize food data
 * Removes invalid fields and normalizes values
 */
export function sanitizeFood(food: Partial<Food>): Partial<Food> {
  return {
    ...food,
    name: food.name?.trim(),
    brand: food.brand?.trim(),
    barcode: food.barcode?.trim(),
    externalId: food.externalId?.trim(),
    servingUnitDefault: food.servingUnitDefault?.trim(),
    // Ensure numeric values are actually numbers
    servingSizeDefault:
      typeof food.servingSizeDefault === 'number' ? food.servingSizeDefault : undefined,
    caloriesPerServing:
      typeof food.caloriesPerServing === 'number' ? food.caloriesPerServing : undefined,
    proteinG: typeof food.proteinG === 'number' ? food.proteinG : undefined,
    carbsG: typeof food.carbsG === 'number' ? food.carbsG : undefined,
    fatG: typeof food.fatG === 'number' ? food.fatG : undefined,
    fiberG: typeof food.fiberG === 'number' ? food.fiberG : undefined,
    sugarG: typeof food.sugarG === 'number' ? food.sugarG : undefined,
    sodiumMg: typeof food.sodiumMg === 'number' ? food.sodiumMg : undefined,
  };
}
