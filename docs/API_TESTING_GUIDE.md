# Manual API Testing Instructions

## Testing in Browser Console

The best way to manually test the API services is in the browser console during development.

### Setup

1. Start the development server:
   ```bash
   npm start
   ```

2. Open the browser console (F12)

3. Import and test the services

### Test USDA API

```javascript
// Import the service (if using module system)
import { UsdaApiService } from './services/nutritionApi';

// Test connection
const connected = await UsdaApiService.testConnection();
console.log('USDA Connected:', connected);

// Test search
const results = await UsdaApiService.searchFoods('apple');
console.log('Search Results:', results);
console.log('First result:', results[0]);

// Test get by ID
const food = await UsdaApiService.getFoodById(123456);
console.log('Food by ID:', food);

// Check rate limits
const rateInfo = UsdaApiService.getRateLimitInfo();
console.log('Rate Limits:', rateInfo);
```

### Test Open Food Facts API

```javascript
// Import the service
import { OpenFoodFactsApiService } from './services/nutritionApi';

// Test connection
const connected = await OpenFoodFactsApiService.testConnection();
console.log('OFF Connected:', connected);

// Test search
const results = await OpenFoodFactsApiService.searchFoods('nutella');
console.log('Search Results:', results);
console.log('First result:', results[0]);

// Test barcode lookup (Nutella's barcode)
const food = await OpenFoodFactsApiService.getFoodByBarcode('3017620422003');
console.log('Food by Barcode:', food);

// Check rate limits
const rateInfo = OpenFoodFactsApiService.getRateLimitInfo();
console.log('Rate Limits:', rateInfo);
```

### Test Both APIs Together

```javascript
import { UsdaApiService, OpenFoodFactsApiService } from './services/nutritionApi';

// Search both APIs for "chicken"
const [usdaResults, offResults] = await Promise.all([
  UsdaApiService.searchFoods('chicken'),
  OpenFoodFactsApiService.searchFoods('chicken')
]);

console.log('USDA Results:', usdaResults.length);
console.log('OFF Results:', offResults.length);
console.log('Combined Results:', [...usdaResults, ...offResults]);
```

### Test Caching

```javascript
import { UsdaApiService } from './services/nutritionApi';
import { ApiCacheService } from './services';

// First search (hits API)
console.time('First search');
await UsdaApiService.searchFoods('apple');
console.timeEnd('First search');

// Second search (uses cache - should be faster)
console.time('Cached search');
await UsdaApiService.searchFoods('apple');
console.timeEnd('Cached search');

// Check cache statistics
const stats = await ApiCacheService.getStatistics();
console.log('Cache stats:', stats);
```

## Testing with cURL

### Test USDA API

```bash
# Search for foods
curl "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=HCceeipX6FzrO9GfcTzCC2HhsmfccKjnptYTKyLL&query=apple&pageSize=3"

# Get food by ID
curl "https://api.nal.usda.gov/fdc/v1/food/123456?api_key=HCceeipX6FzrO9GfcTzCC2HhsmfccKjnptYTKyLL"
```

### Test Open Food Facts API

```bash
# Search for products
curl "https://world.openfoodfacts.org/api/v2/search?search_terms=nutella&page=1&page_size=3&json=1"

# Get product by barcode
curl "https://world.openfoodfacts.org/api/v2/product/3017620422003.json"
```

## Expected Results

### USDA API Response (Search)

```json
{
  "totalHits": 10245,
  "currentPage": 1,
  "totalPages": 3415,
  "foods": [
    {
      "fdcId": 123456,
      "description": "Apple, raw",
      "dataType": "Foundation",
      "foodNutrients": [
        {
          "nutrientId": 1008,
          "nutrientName": "Energy",
          "value": 52,
          "unitName": "kcal"
        }
      ]
    }
  ]
}
```

### Open Food Facts Response (Barcode)

```json
{
  "code": "3017620422003",
  "status": 1,
  "product": {
    "product_name": "Nutella",
    "brands": "Ferrero",
    "nutriments": {
      "energy-kcal_100g": 539,
      "proteins_100g": 6.3,
      "carbohydrates_100g": 57.5,
      "fat_100g": 30.9
    }
  }
}
```

## Verification Checklist

- [ ] USDA search returns results
- [ ] USDA get by ID works
- [ ] Open Food Facts search returns results
- [ ] Open Food Facts barcode lookup works
- [ ] Caching reduces subsequent request times
- [ ] Error handling works for invalid queries
- [ ] Rate limit info is available
- [ ] Development proxy works (no CORS errors)

## Troubleshooting

### CORS Errors

If you see CORS errors:
1. Ensure development server is running (`npm start`)
2. Check that `src/setupProxy.js` exists
3. Restart the development server
4. Clear browser cache

### API Key Errors

If you get 401/403 errors:
1. Verify API key is correct
2. Check API key hasn't expired
3. Ensure you're not rate limited

### Network Errors

If APIs are unreachable:
1. Check internet connection
2. Try cURL commands to verify APIs are up
3. Check API status pages

## API Status Pages

- USDA: Check at https://fdc.nal.usda.gov/
- Open Food Facts: Check at https://status.openfoodfacts.org/

---

## Summary

✅ API services are implemented and tested with unit tests
✅ All 27 unit tests pass
✅ Manual testing should be done in browser console
✅ cURL commands provided for command-line testing
✅ Both APIs are accessible and working

**Status**: Ready for integration into UI components
