import { Micronutrients } from './FoodDiaryEntry';

/**
 * Food item - cached nutrition data from external APIs
 */
export interface Food {
  id: string; // UUID
  name: string;
  brand?: string;
  barcode?: string; // UPC/EAN code
  dataSource: DataSource;
  externalId?: string; // ID from external API (USDA, OFF)

  // Default serving information
  servingSizeDefault: number;
  servingUnitDefault: string;

  // Nutrition per serving
  caloriesPerServing: number;
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
 * Data source for food information
 */
export type DataSource = 'usda' | 'openfoodfacts' | 'manual' | 'imported';

/**
 * Food search result (from API)
 */
export interface FoodSearchResult {
  id: string;
  name: string;
  brand?: string;
  dataSource: DataSource;
  externalId?: string;
  servingSize?: number;
  servingUnit?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}
