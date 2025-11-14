# Nutrition API Client Layer

## Overview

The Nutrition API Client Layer provides a unified, robust interface for accessing multiple nutrition databases (USDA FoodData Central and Open Food Facts) with built-in error handling, retry logic, and client-side caching.

## Architecture

```
┌─────────────────────────────────────────────────┐
│         Application Components                  │
│         (Food Search, Barcode Scanner)          │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│      NutritionApiClient (Unified Interface)     │
│      - Unified search across sources            │
│      - Automatic retry with backoff             │
│      - Result merging & deduplication           │
│      - User-friendly error messages             │
└───────────────────┬─────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌──────────────┐        ┌──────────────┐
│ USDA API     │        │ Open Food    │
│ Service      │        │ Facts API    │
│              │        │ Service      │
└──────┬───────┘        └──────┬───────┘
       │                       │
       ▼                       ▼
┌─────────────────────────────────────┐
│      API Cache Service               │
│      (IndexedDB with TTL)            │
└─────────────────────────────────────┘
       │                       │
       ▼                       ▼
┌──────────────┐        ┌──────────────┐
│ USDA         │        │ Open Food    │
│ FoodData     │        │ Facts        │
│ Central API  │        │ API          │
└──────────────┘        └──────────────┘
```

## Features

### 1. **Unified API Interface**

- Single entry point for all nutrition data queries
- Abstracts differences between USDA and Open Food Facts APIs
- Consistent response format across all data sources

### 2. **Intelligent Error Handling**

- **Custom Error Types**: Specific error classes for different failure scenarios
- **User-Friendly Messages**: Automatic translation of technical errors to user-friendly messages
- **Error Classification**: Retryable vs. non-retryable errors

### 3. **Automatic Retry Logic**

- **Exponential Backoff**: Automatically retries transient failures with increasing delays
- **Configurable**: Customizable retry attempts, delays, and backoff multipliers
- **Smart Retry**: Only retries on network errors and 5xx server errors

### 4. **Client-Side Caching**

- **IndexedDB Storage**: All API responses cached locally
- **TTL-Based Expiration**: Different cache durations for different data types
- **Cache-First Strategy**: Always checks cache before making API calls

### 5. **Privacy-First Design**

- **No Backend**: All API calls made directly from client
- **Optional Proxy**: Development proxy to avoid CORS (disabled in production)
- **Local Storage**: All user data stays on device

## Components

### Core Services

#### 1. `NutritionApiClient`

Unified client providing high-level API for nutrition data access.

#### 2. `UsdaApiService`

USDA FoodData Central API integration with error handling and caching.

#### 3. `OpenFoodFactsApiService`

Open Food Facts API integration with barcode support and caching.

#### 4. `ApiCacheService`

IndexedDB-based caching layer with TTL support.

### Supporting Modules

#### 5. Error Types (`errors.ts`)

- `NutritionApiError` - Base error class
- `NetworkError` - Network/connectivity failures
- `ApiResponseError` - HTTP error responses (4xx, 5xx)
- `RateLimitError` - API rate limit exceeded
- `NotFoundError` - Resource not found
- `AuthenticationError` - Invalid API key
- `ValidationError` - Invalid request parameters

#### 6. Retry Handler (`retryHandler.ts`)

- `withRetry()` - Execute function with retry logic
- `createRetryWrapper()` - Create wrapped function with retry
- Exponential backoff algorithm
- Configurable retry behavior

## Usage Examples

### Basic Food Search

```typescript
import { NutritionApiClient } from './services/nutritionApi';

// Search across all nutrition databases
try {
  const results = await NutritionApiClient.searchFoods('apple');
  console.log(`Found ${results.length} results`);
  results.forEach((food) => {
    console.log(`${food.name} - ${food.calories} cal`);
  });
} catch (error) {
  const message = NutritionApiClient.getErrorMessage(error as Error);
  console.error(message);
}
```

### Search with Options

```typescript
// Search only USDA database with pagination
const results = await NutritionApiClient.searchFoods('chicken breast', {
  sources: ['usda'],
  pageSize: 50,
  page: 2,
});

// Search only Open Food Facts
const results = await NutritionApiClient.searchFoods('nutella', {
  sources: ['openfoodfacts'],
});

// Custom retry configuration
const results = await NutritionApiClient.searchFoods('banana', {
  retryConfig: {
    maxAttempts: 5,
    initialDelayMs: 2000,
    maxDelayMs: 30000,
    backoffMultiplier: 3,
  },
});
```

### Barcode Lookup

```typescript
// Look up product by barcode (UPC/EAN)
const product = await NutritionApiClient.getFoodByBarcode('3017620422003');

if (product) {
  console.log(`${product.name} by ${product.brand}`);
  console.log(`${product.calories} calories per serving`);
} else {
  console.log('Product not found');
}
```

### Get Food by ID

```typescript
// Get food from USDA by FDC ID
const food = await NutritionApiClient.getFoodById('123456', 'usda');

// Get food from Open Food Facts by barcode
const food = await NutritionApiClient.getFoodById('3017620422003', 'openfoodfacts');
```

### Error Handling

```typescript
import { NetworkError, RateLimitError, NotFoundError } from './services/nutritionApi';

try {
  const results = await NutritionApiClient.searchFoods('apple');
} catch (error) {
  if (error instanceof NetworkError) {
    console.error('Network connection issue');
  } else if (error instanceof RateLimitError) {
    console.error('Too many requests - please wait');
  } else if (error instanceof NotFoundError) {
    console.error('Resource not found');
  } else {
    console.error(NutritionApiClient.getErrorMessage(error as Error));
  }
}
```

### Test API Connectivity

```typescript
// Test both APIs
const status = await NutritionApiClient.testConnections();
console.log(`USDA: ${status.usda ? 'Connected' : 'Failed'}`);
console.log(`Open Food Facts: ${status.openfoodfacts ? 'Connected' : 'Failed'}`);

// Test individual APIs
const usdaOk = await UsdaApiService.testConnection();
const offOk = await OpenFoodFactsApiService.testConnection();
```

### Using Individual API Services

```typescript
import { UsdaApiService, OpenFoodFactsApiService } from './services/nutritionApi';

// Direct USDA search
const usdaResults = await UsdaApiService.searchFoods('apple', {
  pageSize: 25,
  pageNumber: 1,
  dataType: ['Foundation', 'SR Legacy'], // Filter by data type
});

// Get specific USDA food
const food = await UsdaApiService.getFoodById(123456);

// Direct Open Food Facts search
const offResults = await OpenFoodFactsApiService.searchFoods('apple juice', {
  pageSize: 25,
  page: 1,
});

// Barcode lookup
const product = await OpenFoodFactsApiService.getFoodByBarcode('3017620422003');
```

## Configuration

### API Keys

USDA API requires an API key. The demo key is included in the code for testing:

```typescript
// src/services/nutritionApi/usdaApiService.ts
const USDA_API_KEY = 'HCceeipX6FzrO9GfcTzCC2HhsmfccKjnptYTKyLL';
```

**For production, obtain your own key at:** https://fdc.nal.usda.gov/api-key-signup.html

Open Food Facts does not require an API key.

### Proxy Configuration (Development Only)

The development proxy avoids CORS issues when testing in a browser:

```javascript
// src/setupProxy.js
module.exports = function (app) {
  app.use(
    '/api/usda',
    createProxyMiddleware({
      target: 'https://api.nal.usda.gov/fdc/v1',
      changeOrigin: true,
      pathRewrite: { '^/api/usda': '' },
    })
  );

  app.use(
    '/api/openfoodfacts',
    createProxyMiddleware({
      target: 'https://world.openfoodfacts.org/api/v2',
      changeOrigin: true,
      pathRewrite: { '^/api/openfoodfacts': '' },
    })
  );
};
```

In production (native mobile apps), API calls are made directly without the proxy.

### Cache TTL Configuration

```typescript
// src/models/ApiCache.ts
export const CACHE_TTL = {
  FOOD_SEARCH: 86400, // 24 hours
  NUTRITION_DATA: 604800, // 7 days
  RECENT_FOODS: 2592000, // 30 days
  BARCODE_LOOKUP: 2592000, // 30 days
};
```

### Retry Configuration

```typescript
// src/services/nutritionApi/retryHandler.ts
export const DEFAULT_RETRY_CONFIG = {
  maxAttempts: 3, // Maximum retry attempts
  initialDelayMs: 1000, // Initial delay (1 second)
  maxDelayMs: 10000, // Maximum delay (10 seconds)
  backoffMultiplier: 2, // Exponential multiplier
};
```

## API Rate Limits

### USDA FoodData Central

- **Rate Limit**: 1000 requests per hour
- **Recommendation**: Cache aggressively, use search sparingly
- **Handling**: Automatic retry with backoff on 429 errors

### Open Food Facts

- **Rate Limit**: No strict limit (recommended max: 100 requests/minute)
- **Recommendation**: Be respectful, implement delays between requests
- **Handling**: Automatic retry on network errors

## Data Models

### FoodSearchResult

```typescript
interface FoodSearchResult {
  id: string; // Unique identifier
  name: string; // Food name
  brand?: string; // Brand name (if applicable)
  dataSource: DataSource; // 'usda' | 'openfoodfacts' | 'manual'
  externalId?: string; // External API ID
  servingSize?: number; // Default serving size
  servingUnit?: string; // Serving unit (g, ml, oz, etc.)
  calories?: number; // Calories per serving
  protein?: number; // Protein (g)
  carbs?: number; // Carbohydrates (g)
  fat?: number; // Fat (g)
}
```

## Error Handling Best Practices

1. **Always use try-catch** when calling API methods
2. **Use `getErrorMessage()`** for user-facing error messages
3. **Check error types** for specific handling (network vs. not found)
4. **Implement fallbacks** (cached data, default values)
5. **Log errors** for debugging but never expose technical details to users

## Testing

### Running Tests

```bash
# Run all nutrition API tests
npm test -- src/services/nutritionApi

# Run specific test file
npm test -- src/services/nutritionApi/__tests__/nutritionApiClient.test.ts

# Run tests in watch mode
npm test -- src/services/nutritionApi --watch
```

### Test Coverage

All core components have comprehensive test coverage:

- ✅ Error types and classification
- ✅ Retry logic with exponential backoff
- ✅ NutritionApiClient unified interface
- ✅ USDA API service
- ✅ Open Food Facts API service
- ✅ Cache service integration

## Performance Optimization

### Caching Strategy

1. **Always check cache first** before making API calls
2. **Use longer TTL** for stable data (nutrition facts)
3. **Use shorter TTL** for search results
4. **Implement cache warming** for frequently accessed items

### Network Optimization

1. **Batch requests** when possible
2. **Debounce search inputs** (300-500ms)
3. **Implement virtual scrolling** for large result lists
4. **Prefetch** likely user selections

### Error Handling

1. **Retry transient failures** automatically
2. **Cache failed requests** briefly to avoid repeated failures
3. **Implement circuit breaker** for consistently failing APIs

## Security Considerations

1. **No User Data in APIs**: Only nutrition lookups, never user personal data
2. **API Key Protection**: Store in environment variables for production
3. **HTTPS Only**: All API calls use HTTPS
4. **Input Validation**: Sanitize all search queries before sending to APIs
5. **Rate Limiting**: Respect API rate limits to avoid service disruption

## Troubleshooting

### Common Issues

**Issue**: "Network error while connecting to USDA API"

- **Cause**: No internet connection or API down
- **Solution**: Check connectivity, wait and retry

**Issue**: "USDA API rate limit exceeded"

- **Cause**: Too many requests in short time
- **Solution**: Implement request throttling, use caching

**Issue**: "Product not found"

- **Cause**: Barcode not in Open Food Facts database
- **Solution**: Allow manual entry, suggest contributing to OFF

**Issue**: "CORS error in browser"

- **Cause**: Development proxy not configured
- **Solution**: Ensure `setupProxy.js` is properly configured

## Future Enhancements

- [ ] Add support for more nutrition databases (Nutritionix, FatSecret)
- [ ] Implement request queue for rate limit management
- [ ] Add offline mode with graceful degradation
- [ ] Implement background sync for failed requests
- [ ] Add telemetry for API performance monitoring (privacy-preserving)
- [ ] Support for localization (multiple languages)

## References

- [USDA FoodData Central API Documentation](https://fdc.nal.usda.gov/api-guide.html)
- [Open Food Facts API Documentation](https://openfoodfacts.github.io/openfoodfacts-server/api/)
- [IndexedDB API Reference](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Dexie.js Documentation](https://dexie.org/docs/)

## Support

For issues and questions:

- GitHub Issues: [github.com/mydesignbuddy/Keyston/issues](https://github.com/mydesignbuddy/Keyston/issues)
- Project Documentation: `/project` directory

---

**Last Updated**: 2025-11-14
**Version**: 1.0.0
**Maintainer**: Keyston Development Team
