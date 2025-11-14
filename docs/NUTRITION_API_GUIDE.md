# Nutrition API Integration Guide

## Overview

Keyston integrates with two external nutrition databases to provide comprehensive food data:
- **USDA FoodData Central** - Official USDA nutrition database
- **Open Food Facts** - Community-driven international food database

All API calls are **client-side only** (privacy-first architecture). No backend servers are used.

---

## USDA FoodData Central API

### Configuration

**API Key**: `HCceeipX6FzrO9GfcTzCC2HhsmfccKjnptYTKyLL` (Demo key - obtain your own for production)

**Base URL**:
- Production (Native): `https://api.nal.usda.gov/fdc/v1`
- Development (Web): `/api/usda` (proxied to avoid CORS)

**Documentation**: https://fdc.nal.usda.gov/api-guide.html

### Rate Limits

| Metric | Limit | Notes |
|--------|-------|-------|
| Requests per hour | 1000 | Demo key may have additional restrictions |
| Requests per day | No strict limit | Be respectful |

**Important**: For production use, obtain your own API key at https://fdc.nal.usda.gov/api-key-signup.html

### API Methods

#### Search Foods

Search the USDA database for foods by name or description.

```typescript
import { UsdaApiService } from './services/nutritionApi';

// Basic search
const results = await UsdaApiService.searchFoods('apple');

// With options
const results = await UsdaApiService.searchFoods('chicken breast', {
  pageSize: 25,
  pageNumber: 1,
  dataType: ['Foundation', 'SR Legacy', 'Branded'], // Filter by data type
});

// Results format
// [
//   {
//     id: 'usda_123456',
//     name: 'Chicken, breast, boneless, skinless, raw',
//     brand: undefined, // Generic foods don't have brands
//     dataSource: 'usda',
//     externalId: '123456',
//     servingSize: 100,
//     servingUnit: 'g',
//     calories: 120,
//     protein: 22.5,
//     carbs: 0,
//     fat: 2.6,
//   }
// ]
```

#### Get Food by ID

Retrieve detailed nutrition information for a specific food by FDC ID.

```typescript
// Get food by USDA FDC ID
const food = await UsdaApiService.getFoodById(123456);

if (food) {
  console.log(food.name, food.calories);
} else {
  console.log('Food not found');
}
```

#### Test Connection

Test if the USDA API is accessible and the API key is valid.

```typescript
const isConnected = await UsdaApiService.testConnection();

if (isConnected) {
  console.log('USDA API is accessible');
} else {
  console.error('USDA API connection failed');
}
```

#### Get Rate Limit Info

```typescript
const info = UsdaApiService.getRateLimitInfo();
console.log(`Rate limit: ${info.requestsPerHour} requests/hour`);
console.log(info.note);
```

### Data Types

USDA provides different types of food data:

- **Foundation Foods**: Core foods with comprehensive nutrient data (e.g., raw chicken, raw broccoli)
- **SR Legacy**: Standard Reference Legacy foods (comprehensive nutrition)
- **Survey (FNDDS)**: Foods and portions used in USDA food surveys
- **Branded**: Commercial packaged foods with nutrition labels

### Caching

All USDA API responses are automatically cached in IndexedDB:
- **Search results**: 30 days TTL
- **Food details**: 90 days TTL

Cached data reduces API calls and improves performance. Cache is privacy-friendly - all data stays local.

---

## Open Food Facts API

### Configuration

**API Key**: None required (open API)

**Base URL**:
- Production (Native): `https://world.openfoodfacts.org/api/v2`
- Development (Web): `/api/openfoodfacts` (proxied to avoid CORS)

**Documentation**: https://openfoodfacts.github.io/openfoodfacts-server/api/

### Rate Limits

| Metric | Limit | Recommendation |
|--------|-------|----------------|
| Requests per minute | No strict limit | Max 100 requests/minute |
| Notes | Be respectful | Free and open API |

**Note**: Open Food Facts is a non-profit project. Be respectful with request frequency.

### API Methods

#### Search Foods

Search Open Food Facts for packaged food products.

```typescript
import { OpenFoodFactsApiService } from './services/nutritionApi';

// Basic search
const results = await OpenFoodFactsApiService.searchFoods('nutella');

// With pagination
const results = await OpenFoodFactsApiService.searchFoods('yogurt', {
  pageSize: 25,
  page: 1,
});

// Results format
// [
//   {
//     id: 'off_3017620422003',
//     name: 'Nutella',
//     brand: 'Ferrero',
//     dataSource: 'openfoodfacts',
//     externalId: '3017620422003',
//     servingSize: 15,
//     servingUnit: 'g',
//     calories: 80.85,
//     protein: 0.945,
//     carbs: 8.625,
//     fat: 4.635,
//   }
// ]
```

**Note**: Open Food Facts provides nutrition per 100g. The service automatically scales to the actual serving size.

#### Get Food by Barcode

Look up a food product by its barcode (UPC/EAN).

```typescript
// Look up by barcode
const food = await OpenFoodFactsApiService.getFoodByBarcode('3017620422003');

if (food) {
  console.log(`Found: ${food.name} by ${food.brand}`);
} else {
  console.log('Product not found');
}
```

**Use Cases**:
- Barcode scanner feature
- Quick food logging
- International product lookup

#### Test Connection

```typescript
const isConnected = await OpenFoodFactsApiService.testConnection();

if (isConnected) {
  console.log('Open Food Facts API is accessible');
}
```

#### Get Rate Limit Info

```typescript
const info = OpenFoodFactsApiService.getRateLimitInfo();
console.log(`Recommended max: ${info.requestsPerMinute} requests/minute`);
console.log(info.note);
```

### Caching

All Open Food Facts API responses are automatically cached:
- **Search results**: 30 days TTL
- **Barcode lookups**: 90 days TTL

---

## Development Proxy Configuration

In development mode (web browser), API calls use a proxy to avoid CORS issues. The proxy is automatically configured in `src/setupProxy.js`.

### How It Works

1. **Development** (`npm start`):
   - Requests to `/api/usda/*` → proxied to `https://api.nal.usda.gov/fdc/v1/*`
   - Requests to `/api/openfoodfacts/*` → proxied to `https://world.openfoodfacts.org/api/v2/*`

2. **Production** (Native iOS/Android):
   - Direct API calls (no proxy needed - CORS doesn't apply to native apps)

### Proxy Configuration

The proxy is configured using `http-proxy-middleware` in `src/setupProxy.js`:

```javascript
// USDA Proxy
app.use('/api/usda', createProxyMiddleware({
  target: 'https://api.nal.usda.gov/fdc/v1',
  changeOrigin: true,
  pathRewrite: { '^/api/usda': '' },
}));

// Open Food Facts Proxy
app.use('/api/openfoodfacts', createProxyMiddleware({
  target: 'https://world.openfoodfacts.org/api/v2',
  changeOrigin: true,
  pathRewrite: { '^/api/openfoodfacts': '' },
}));
```

---

## Best Practices

### 1. Always Use Caching

The services automatically cache API responses. This:
- Reduces API calls
- Improves performance
- Works offline
- Respects rate limits

### 2. Handle Errors Gracefully

```typescript
try {
  const results = await UsdaApiService.searchFoods('apple');
  // Use results
} catch (error) {
  console.error('Search failed:', error);
  // Show user-friendly error message
  // Maybe use cached results or local database
}
```

### 3. Search Strategy

For best results, use both APIs:

```typescript
async function searchAllSources(query: string) {
  const [usdaResults, offResults] = await Promise.all([
    UsdaApiService.searchFoods(query).catch(() => []),
    OpenFoodFactsApiService.searchFoods(query).catch(() => []),
  ]);

  return [...usdaResults, ...offResults];
}
```

### 4. Barcode Lookups

For barcode scanning, check both sources:

```typescript
async function lookupBarcode(barcode: string) {
  // Try Open Food Facts first (better for packaged foods)
  let food = await OpenFoodFactsApiService.getFoodByBarcode(barcode);
  
  if (!food) {
    // Try USDA (less likely to have barcodes)
    // USDA doesn't have a direct barcode lookup API
    // Would need to search by name or use barcode scanner API
  }
  
  return food;
}
```

### 5. Respect Rate Limits

```typescript
// Implement debouncing for search inputs
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (query: string) => {
  const results = await UsdaApiService.searchFoods(query);
  setSearchResults(results);
}, 500); // Wait 500ms after user stops typing
```

### 6. Import to Local Database

After finding a food, import it to the local database for faster access:

```typescript
import { FoodService } from './services';

// After user selects a food from search
const selectedFood = searchResults[0];

// Import to local database
const localFood = await FoodService.importFromSearchResult(selectedFood);

// Now use local food ID for food diary entries
```

---

## Testing

### Unit Tests

Both API services have comprehensive unit tests:

```bash
# Run all nutrition API tests
npm test -- nutritionApi

# Run specific service tests
npm test -- usdaApiService
npm test -- openFoodFactsApiService
```

### Manual Testing

#### Test USDA API

```bash
# In browser console (development mode)
import { UsdaApiService } from './services/nutritionApi';

// Test connection
const connected = await UsdaApiService.testConnection();
console.log('USDA Connected:', connected);

// Search foods
const results = await UsdaApiService.searchFoods('apple');
console.log('Results:', results);
```

#### Test Open Food Facts API

```bash
# In browser console (development mode)
import { OpenFoodFactsApiService } from './services/nutritionApi';

// Test connection
const connected = await OpenFoodFactsApiService.testConnection();
console.log('OFF Connected:', connected);

// Test barcode lookup
const food = await OpenFoodFactsApiService.getFoodByBarcode('3017620422003');
console.log('Nutella:', food);
```

---

## Troubleshooting

### CORS Errors (Development)

**Problem**: CORS errors when making API calls in browser.

**Solution**: Ensure proxy is configured correctly in `src/setupProxy.js`. Restart dev server after changes.

### API Key Errors (USDA)

**Problem**: 401 Unauthorized or 403 Forbidden errors.

**Solution**: 
1. Check API key is correct
2. Ensure API key is not rate-limited
3. Obtain your own API key for production use

### Rate Limit Exceeded

**Problem**: 429 Too Many Requests error.

**Solution**:
1. Implement request throttling/debouncing
2. Use cached data when available
3. Reduce search frequency
4. For USDA, obtain your own API key with higher limits

### Network Errors (Offline)

**Problem**: API calls fail when offline.

**Solution**: Services automatically use cached data. Ensure caching is working:

```typescript
import { ApiCacheService } from './services';

// Check cache statistics
const stats = await ApiCacheService.getStatistics();
console.log(`Cached items: ${stats.active}`);
```

---

## Security & Privacy

### Privacy-First Architecture

✅ **Client-side only** - All API calls made directly from the app
✅ **No backend server** - No data passes through our servers
✅ **Local caching** - All cached data stored in IndexedDB on device
✅ **No tracking** - API calls don't include user identifiers

### API Key Security

⚠️ **USDA API Key**: The demo key is hardcoded for testing purposes. For production:
1. Store API key in environment variables
2. Use different keys for development and production
3. Obtain your own API key from USDA

**Note**: Since API calls are client-side, the key is visible in the app. This is acceptable for USDA's free tier, but use proper key management for sensitive APIs.

---

## Production Deployment

### Checklist

- [ ] Obtain your own USDA API key
- [ ] Store API key in environment variables (not hardcoded)
- [ ] Test API calls on native iOS and Android
- [ ] Verify caching works correctly
- [ ] Test offline functionality
- [ ] Implement error handling and retry logic
- [ ] Add user-facing error messages
- [ ] Monitor API usage and rate limits

### Environment Variables

Create `.env` file (not committed to Git):

```bash
REACT_APP_USDA_API_KEY=your_production_key_here
```

Update API service to use environment variable:

```typescript
const USDA_API_KEY = process.env.REACT_APP_USDA_API_KEY || 'HCceeipX6FzrO9GfcTzCC2HhsmfccKjnptYTKyLL';
```

---

## Resources

### USDA FoodData Central
- API Documentation: https://fdc.nal.usda.gov/api-guide.html
- Get API Key: https://fdc.nal.usda.gov/api-key-signup.html
- Web Interface: https://fdc.nal.usda.gov/

### Open Food Facts
- API Documentation: https://openfoodfacts.github.io/openfoodfacts-server/api/
- Web Interface: https://world.openfoodfacts.org/
- GitHub: https://github.com/openfoodfacts

### Related Documentation
- [Database Guide](./DATABASE_GUIDE.md) - IndexedDB and data services
- [Sprint 0 Summary](./SPRINT_0_SUMMARY.md) - Project setup overview

---

## Summary

✅ **USDA API**: Comprehensive nutrition data, 1000 req/hour, requires API key
✅ **Open Food Facts API**: International packaged foods, no API key, barcode support
✅ **Caching**: Automatic with 30-90 day TTL in IndexedDB
✅ **Proxy**: Development proxy for CORS, direct calls in production
✅ **Privacy**: Client-side only, no backend, no tracking

**Status**: ✅ Ready for use
**Next Steps**: Integrate into food search UI (Sprint 3)

---

*Last Updated: January 2025*
*Sprint 0: Project Setup Complete*
