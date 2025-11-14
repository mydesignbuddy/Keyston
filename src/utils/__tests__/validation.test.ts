import {
  ValidationError,
  isValidUUID,
  isValidDateString,
  isValidMealType,
  isValidDataSource,
  isPositiveNumber,
  isStrictlyPositiveNumber,
  isNonEmptyString,
  validateFoodDiaryEntry,
  validateFood,
  sanitizeFoodDiaryEntry,
  sanitizeFood,
  handleValidationError,
} from '../validation';

describe('Validation Utilities', () => {
  describe('isValidUUID', () => {
    it('should validate correct UUID v4', () => {
      expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(isValidUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    });

    it('should reject invalid UUIDs', () => {
      expect(isValidUUID('invalid-uuid')).toBe(false);
      expect(isValidUUID('123')).toBe(false);
      expect(isValidUUID('')).toBe(false);
      expect(isValidUUID('550e8400-e29b-41d4-a716')).toBe(false);
    });
  });

  describe('isValidDateString', () => {
    it('should validate correct date strings', () => {
      expect(isValidDateString('2024-01-15')).toBe(true);
      expect(isValidDateString('2023-12-31')).toBe(true);
      expect(isValidDateString('2024-02-29')).toBe(true); // Leap year
    });

    it('should reject invalid date strings', () => {
      expect(isValidDateString('2024-13-01')).toBe(false); // Invalid month
      expect(isValidDateString('2024-02-30')).toBe(false); // Invalid day
      expect(isValidDateString('invalid')).toBe(false);
      expect(isValidDateString('01/15/2024')).toBe(false); // Wrong format
      expect(isValidDateString('2024-1-5')).toBe(false); // Wrong format
    });
  });

  describe('isValidMealType', () => {
    it('should validate correct meal types', () => {
      expect(isValidMealType('breakfast')).toBe(true);
      expect(isValidMealType('lunch')).toBe(true);
      expect(isValidMealType('dinner')).toBe(true);
      expect(isValidMealType('snack')).toBe(true);
    });

    it('should reject invalid meal types', () => {
      expect(isValidMealType('brunch')).toBe(false);
      expect(isValidMealType('BREAKFAST')).toBe(false);
      expect(isValidMealType('')).toBe(false);
    });
  });

  describe('isValidDataSource', () => {
    it('should validate correct data sources', () => {
      expect(isValidDataSource('usda')).toBe(true);
      expect(isValidDataSource('openfoodfacts')).toBe(true);
      expect(isValidDataSource('manual')).toBe(true);
      expect(isValidDataSource('imported')).toBe(true);
    });

    it('should reject invalid data sources', () => {
      expect(isValidDataSource('unknown')).toBe(false);
      expect(isValidDataSource('USDA')).toBe(false);
      expect(isValidDataSource('')).toBe(false);
    });
  });

  describe('isPositiveNumber', () => {
    it('should validate positive numbers', () => {
      expect(isPositiveNumber(0)).toBe(true);
      expect(isPositiveNumber(1)).toBe(true);
      expect(isPositiveNumber(100.5)).toBe(true);
    });

    it('should reject negative numbers and non-numbers', () => {
      expect(isPositiveNumber(-1)).toBe(false);
      expect(isPositiveNumber(NaN)).toBe(false);
      expect(isPositiveNumber(Infinity)).toBe(false);
      expect(isPositiveNumber('100' as any)).toBe(false);
    });
  });

  describe('isStrictlyPositiveNumber', () => {
    it('should validate strictly positive numbers', () => {
      expect(isStrictlyPositiveNumber(1)).toBe(true);
      expect(isStrictlyPositiveNumber(100.5)).toBe(true);
      expect(isStrictlyPositiveNumber(0.001)).toBe(true);
    });

    it('should reject zero, negative numbers, and non-numbers', () => {
      expect(isStrictlyPositiveNumber(0)).toBe(false);
      expect(isStrictlyPositiveNumber(-1)).toBe(false);
      expect(isStrictlyPositiveNumber(NaN)).toBe(false);
      expect(isStrictlyPositiveNumber(Infinity)).toBe(false);
      expect(isStrictlyPositiveNumber('100' as any)).toBe(false);
    });
  });

  describe('handleValidationError', () => {
    it('should handle ValidationError', () => {
      const error = new ValidationError('Invalid field', 'testField');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => handleValidationError(error, 'test operation', 'Fallback message')).toThrow(
        ValidationError
      );
      expect(() => handleValidationError(error, 'test operation', 'Fallback message')).toThrow(
        'Invalid field'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'Validation error (test operation):',
        'Invalid field',
        'testField'
      );

      consoleSpy.mockRestore();
    });

    it('should handle generic errors', () => {
      const error = new Error('Generic error');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => handleValidationError(error, 'test operation', 'Fallback message')).toThrow(
        'Fallback message'
      );
      expect(consoleSpy).toHaveBeenCalledWith('Failed to test operation:', error);

      consoleSpy.mockRestore();
    });
  });

  describe('isNonEmptyString', () => {
    it('should validate non-empty strings', () => {
      expect(isNonEmptyString('hello')).toBe(true);
      expect(isNonEmptyString('test with spaces')).toBe(true);
      expect(isNonEmptyString(' trimmed ')).toBe(true);
    });

    it('should reject empty strings and non-strings', () => {
      expect(isNonEmptyString('')).toBe(false);
      expect(isNonEmptyString('   ')).toBe(false);
      expect(isNonEmptyString(123 as any)).toBe(false);
    });
  });

  describe('validateFoodDiaryEntry', () => {
    const validEntry = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      foodId: '123e4567-e89b-12d3-a456-426614174000',
      entryDate: '2024-01-15',
      mealType: 'breakfast' as const,
      servingSize: 150,
      servingUnit: 'g',
      calories: 300,
      proteinG: 20,
      carbsG: 30,
      fatG: 10,
      fiberG: 5,
      sugarG: 8,
      sodiumMg: 100,
      createdAt: new Date(),
    };

    it('should validate a correct food diary entry', () => {
      expect(() => validateFoodDiaryEntry(validEntry)).not.toThrow();
    });

    it('should throw for invalid id', () => {
      const entry = { ...validEntry, id: 'invalid-id' };
      expect(() => validateFoodDiaryEntry(entry)).toThrow(ValidationError);
      expect(() => validateFoodDiaryEntry(entry)).toThrow(/Invalid or missing entry ID/);
    });

    it('should throw for missing id', () => {
      const entry = { ...validEntry, id: undefined as any };
      expect(() => validateFoodDiaryEntry(entry)).toThrow(ValidationError);
    });

    it('should throw for invalid foodId', () => {
      const entry = { ...validEntry, foodId: 'invalid-food-id' };
      expect(() => validateFoodDiaryEntry(entry)).toThrow(/Invalid or missing food ID/);
    });

    it('should throw for invalid entryDate', () => {
      const entry = { ...validEntry, entryDate: '2024-13-01' };
      expect(() => validateFoodDiaryEntry(entry)).toThrow(/Invalid or missing entry date/);
    });

    it('should throw for invalid meal type', () => {
      const entry = { ...validEntry, mealType: 'brunch' as any };
      expect(() => validateFoodDiaryEntry(entry)).toThrow(/Invalid or missing meal type/);
    });

    it('should throw for negative serving size', () => {
      const entry = { ...validEntry, servingSize: -100 };
      expect(() => validateFoodDiaryEntry(entry)).toThrow(/Invalid serving size/);
    });

    it('should throw for empty serving unit', () => {
      const entry = { ...validEntry, servingUnit: '' };
      expect(() => validateFoodDiaryEntry(entry)).toThrow(/Invalid or missing serving unit/);
    });

    it('should throw for negative calories', () => {
      const entry = { ...validEntry, calories: -100 };
      expect(() => validateFoodDiaryEntry(entry)).toThrow(/Invalid calories/);
    });

    it('should throw for negative macronutrients', () => {
      const entry1 = { ...validEntry, proteinG: -10 };
      expect(() => validateFoodDiaryEntry(entry1)).toThrow(/Invalid protein/);

      const entry2 = { ...validEntry, carbsG: -20 };
      expect(() => validateFoodDiaryEntry(entry2)).toThrow(/Invalid carbs/);

      const entry3 = { ...validEntry, fatG: -5 };
      expect(() => validateFoodDiaryEntry(entry3)).toThrow(/Invalid fat/);
    });

    it('should throw for negative optional nutrients', () => {
      const entry1 = { ...validEntry, fiberG: -5 };
      expect(() => validateFoodDiaryEntry(entry1)).toThrow(/Invalid fiber/);

      const entry2 = { ...validEntry, sugarG: -8 };
      expect(() => validateFoodDiaryEntry(entry2)).toThrow(/Invalid sugar/);

      const entry3 = { ...validEntry, sodiumMg: -100 };
      expect(() => validateFoodDiaryEntry(entry3)).toThrow(/Invalid sodium/);
    });

    it('should accept valid optional fields', () => {
      const entry = {
        ...validEntry,
        fiberG: undefined,
        sugarG: undefined,
        sodiumMg: undefined,
      };
      expect(() => validateFoodDiaryEntry(entry)).not.toThrow();
    });

    it('should validate micronutrients', () => {
      const entryWithMicros = {
        ...validEntry,
        micronutrients: {
          vitaminA: 500,
          vitaminC: 60,
          calcium: 200,
        },
      };
      expect(() => validateFoodDiaryEntry(entryWithMicros)).not.toThrow();
    });

    it('should throw for negative micronutrients', () => {
      const entry = {
        ...validEntry,
        micronutrients: {
          vitaminA: -500,
        },
      };
      expect(() => validateFoodDiaryEntry(entry)).toThrow(/Invalid micronutrient value/);
    });

    it('should throw for invalid createdAt', () => {
      const entry1 = { ...validEntry, createdAt: 'invalid' as any };
      expect(() => validateFoodDiaryEntry(entry1)).toThrow(/Invalid or missing createdAt/);

      const entry2 = { ...validEntry, createdAt: undefined as any };
      expect(() => validateFoodDiaryEntry(entry2)).toThrow(/Invalid or missing createdAt/);
    });
  });

  describe('validateFood', () => {
    const validFood = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Apple',
      brand: 'Fresh Brand',
      barcode: '1234567890123',
      dataSource: 'usda' as const,
      externalId: 'usda-12345',
      servingSizeDefault: 100,
      servingUnitDefault: 'g',
      caloriesPerServing: 52,
      proteinG: 0.3,
      carbsG: 14,
      fatG: 0.2,
      fiberG: 2.4,
      sugarG: 10,
      sodiumMg: 1,
      createdAt: new Date(),
    };

    it('should validate a correct food', () => {
      expect(() => validateFood(validFood)).not.toThrow();
    });

    it('should throw for invalid id', () => {
      const food = { ...validFood, id: 'invalid-id' };
      expect(() => validateFood(food)).toThrow(/Invalid or missing food ID/);
    });

    it('should throw for empty name', () => {
      const food = { ...validFood, name: '' };
      expect(() => validateFood(food)).toThrow(/Invalid or missing food name/);
    });

    it('should throw for invalid data source', () => {
      const food = { ...validFood, dataSource: 'unknown' as any };
      expect(() => validateFood(food)).toThrow(/Invalid or missing data source/);
    });

    it('should allow optional brand', () => {
      const food = { ...validFood, brand: undefined };
      expect(() => validateFood(food)).not.toThrow();
    });

    it('should throw for empty brand string', () => {
      const food = { ...validFood, brand: '' };
      expect(() => validateFood(food)).toThrow(/Invalid brand/);
    });

    it('should allow optional barcode', () => {
      const food = { ...validFood, barcode: undefined };
      expect(() => validateFood(food)).not.toThrow();
    });

    it('should throw for empty barcode string', () => {
      const food = { ...validFood, barcode: '' };
      expect(() => validateFood(food)).toThrow(/Invalid barcode/);
    });

    it('should allow optional externalId', () => {
      const food = { ...validFood, externalId: undefined };
      expect(() => validateFood(food)).not.toThrow();
    });

    it('should throw for zero serving size', () => {
      const food = { ...validFood, servingSizeDefault: 0 };
      expect(() => validateFood(food)).toThrow(/Invalid serving size default/);
    });

    it('should throw for negative serving size', () => {
      const food = { ...validFood, servingSizeDefault: -100 };
      expect(() => validateFood(food)).toThrow(/Invalid serving size default/);
    });

    it('should throw for empty serving unit', () => {
      const food = { ...validFood, servingUnitDefault: '' };
      expect(() => validateFood(food)).toThrow(/Invalid or missing serving unit default/);
    });

    it('should throw for negative nutrition values', () => {
      const food1 = { ...validFood, caloriesPerServing: -52 };
      expect(() => validateFood(food1)).toThrow(/Invalid calories per serving/);

      const food2 = { ...validFood, proteinG: -0.3 };
      expect(() => validateFood(food2)).toThrow(/Invalid protein/);

      const food3 = { ...validFood, carbsG: -14 };
      expect(() => validateFood(food3)).toThrow(/Invalid carbs/);

      const food4 = { ...validFood, fatG: -0.2 };
      expect(() => validateFood(food4)).toThrow(/Invalid fat/);
    });

    it('should accept valid optional nutrients', () => {
      const food = {
        ...validFood,
        fiberG: undefined,
        sugarG: undefined,
        sodiumMg: undefined,
      };
      expect(() => validateFood(food)).not.toThrow();
    });

    it('should throw for negative optional nutrients', () => {
      const food1 = { ...validFood, fiberG: -2.4 };
      expect(() => validateFood(food1)).toThrow(/Invalid fiber/);

      const food2 = { ...validFood, sugarG: -10 };
      expect(() => validateFood(food2)).toThrow(/Invalid sugar/);

      const food3 = { ...validFood, sodiumMg: -1 };
      expect(() => validateFood(food3)).toThrow(/Invalid sodium/);
    });

    it('should validate micronutrients', () => {
      const foodWithMicros = {
        ...validFood,
        micronutrients: {
          vitaminA: 54,
          vitaminC: 4.6,
          calcium: 6,
        },
      };
      expect(() => validateFood(foodWithMicros)).not.toThrow();
    });

    it('should throw for negative micronutrients', () => {
      const food = {
        ...validFood,
        micronutrients: {
          vitaminC: -4.6,
        },
      };
      expect(() => validateFood(food)).toThrow(/Invalid micronutrient value/);
    });

    it('should throw for invalid createdAt', () => {
      const food1 = { ...validFood, createdAt: 'invalid' as any };
      expect(() => validateFood(food1)).toThrow(/Invalid or missing createdAt/);

      const food2 = { ...validFood, createdAt: undefined as any };
      expect(() => validateFood(food2)).toThrow(/Invalid or missing createdAt/);
    });
  });

  describe('sanitizeFoodDiaryEntry', () => {
    it('should trim string fields', () => {
      const entry = {
        servingUnit: '  g  ',
      };
      const sanitized = sanitizeFoodDiaryEntry(entry);
      expect(sanitized.servingUnit).toBe('g');
    });

    it('should preserve valid numeric values', () => {
      const entry = {
        servingSize: 150,
        calories: 300,
        proteinG: 20,
        carbsG: 30,
        fatG: 10,
      };
      const sanitized = sanitizeFoodDiaryEntry(entry);
      expect(sanitized.servingSize).toBe(150);
      expect(sanitized.calories).toBe(300);
      expect(sanitized.proteinG).toBe(20);
    });

    it('should remove invalid numeric values', () => {
      const entry = {
        servingSize: '150' as any,
        calories: 'invalid' as any,
      };
      const sanitized = sanitizeFoodDiaryEntry(entry);
      expect(sanitized.servingSize).toBeUndefined();
      expect(sanitized.calories).toBeUndefined();
    });
  });

  describe('sanitizeFood', () => {
    it('should trim string fields', () => {
      const food = {
        name: '  Apple  ',
        brand: '  Fresh Brand  ',
        barcode: '  123456  ',
        servingUnitDefault: '  g  ',
      };
      const sanitized = sanitizeFood(food);
      expect(sanitized.name).toBe('Apple');
      expect(sanitized.brand).toBe('Fresh Brand');
      expect(sanitized.barcode).toBe('123456');
      expect(sanitized.servingUnitDefault).toBe('g');
    });

    it('should preserve valid numeric values', () => {
      const food = {
        servingSizeDefault: 100,
        caloriesPerServing: 52,
        proteinG: 0.3,
        carbsG: 14,
        fatG: 0.2,
      };
      const sanitized = sanitizeFood(food);
      expect(sanitized.servingSizeDefault).toBe(100);
      expect(sanitized.caloriesPerServing).toBe(52);
      expect(sanitized.proteinG).toBe(0.3);
    });

    it('should remove invalid numeric values', () => {
      const food = {
        servingSizeDefault: '100' as any,
        caloriesPerServing: 'invalid' as any,
      };
      const sanitized = sanitizeFood(food);
      expect(sanitized.servingSizeDefault).toBeUndefined();
      expect(sanitized.caloriesPerServing).toBeUndefined();
    });
  });
});
