/**
 * Favorite food - frequently used foods for quick access
 */
export interface FavoriteFood {
  id: string; // UUID
  foodId: string; // Reference to Foods table
  usageCount: number; // How many times this food has been logged
  lastUsedAt: Date;
  createdAt: Date;
}
