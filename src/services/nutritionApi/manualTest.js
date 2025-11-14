/**
 * Manual API Testing Script
 *
 * This script tests the actual API connections to USDA and Open Food Facts.
 * Run with: node src/services/nutritionApi/manualTest.js
 *
 * Note: This uses node-fetch for Node.js environment.
 * In the browser, the services use the native fetch API.
 */

// Mock environment for Node.js testing
process.env.NODE_ENV = 'production'; // Use direct API calls

const USDA_API_KEY = 'HCceeipX6FzrO9GfcTzCC2HhsmfccKjnptYTKyLL';
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';
const OFF_BASE_URL = 'https://world.openfoodfacts.org/api/v2';

/**
 * Test USDA API
 */
async function testUsdaApi() {
  console.log('\n=== Testing USDA FoodData Central API ===\n');

  try {
    // Test search
    console.log('1. Testing search for "apple"...');
    const searchUrl = `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=apple&pageSize=3`;

    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    console.log(`✅ Search successful!`);
    console.log(`   Total hits: ${data.totalHits}`);
    console.log(`   Results returned: ${data.foods.length}`);

    if (data.foods.length > 0) {
      const firstFood = data.foods[0];
      console.log(`   First result: ${firstFood.description}`);
      console.log(`   FDC ID: ${firstFood.fdcId}`);

      // Test get by ID
      console.log('\n2. Testing get food by ID...');
      const foodUrl = `${USDA_BASE_URL}/food/${firstFood.fdcId}?api_key=${USDA_API_KEY}`;
      const foodResponse = await fetch(foodUrl);

      if (!foodResponse.ok) {
        throw new Error(`API error: ${foodResponse.status} ${foodResponse.statusText}`);
      }

      const foodData = await foodResponse.json();
      console.log(`✅ Get by ID successful!`);
      console.log(`   Food: ${foodData.description}`);
      console.log(`   Data type: ${foodData.dataType}`);
      console.log(`   Nutrients: ${foodData.foodNutrients.length} entries`);
    }

    console.log('\n✅ USDA API: ALL TESTS PASSED\n');
    return true;
  } catch (error) {
    console.error('\n❌ USDA API: TEST FAILED');
    console.error(`   Error: ${error.message}\n`);
    return false;
  }
}

/**
 * Test Open Food Facts API
 */
async function testOpenFoodFactsApi() {
  console.log('\n=== Testing Open Food Facts API ===\n');

  try {
    // Test search
    console.log('1. Testing search for "nutella"...');
    const searchUrl = `${OFF_BASE_URL}/search?search_terms=nutella&page=1&page_size=3&json=1&fields=code,product_name,brands,nutriments`;

    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    console.log(`✅ Search successful!`);
    console.log(`   Total count: ${data.count}`);
    console.log(`   Results returned: ${data.products.length}`);

    if (data.products.length > 0) {
      const firstProduct = data.products[0];
      console.log(`   First result: ${firstProduct.product_name || 'Unknown'}`);
      console.log(`   Brand: ${firstProduct.brands || 'Unknown'}`);
      console.log(`   Barcode: ${firstProduct.code || 'Unknown'}`);
    }

    // Test barcode lookup (Nutella's famous barcode)
    console.log('\n2. Testing barcode lookup (3017620422003 - Nutella)...');
    const barcodeUrl = `${OFF_BASE_URL}/product/3017620422003.json`;
    const barcodeResponse = await fetch(barcodeUrl);

    if (!barcodeResponse.ok) {
      throw new Error(`API error: ${barcodeResponse.status} ${barcodeResponse.statusText}`);
    }

    const barcodeData = await barcodeResponse.json();

    if (barcodeData.status === 1 && barcodeData.product) {
      console.log(`✅ Barcode lookup successful!`);
      console.log(`   Product: ${barcodeData.product.product_name}`);
      console.log(`   Brand: ${barcodeData.product.brands || 'Unknown'}`);
      console.log(
        `   Calories (per 100g): ${barcodeData.product.nutriments?.['energy-kcal_100g'] || 'N/A'}`
      );
    } else {
      console.log(`⚠️  Product not found`);
    }

    console.log('\n✅ Open Food Facts API: ALL TESTS PASSED\n');
    return true;
  } catch (error) {
    console.error('\n❌ Open Food Facts API: TEST FAILED');
    console.error(`   Error: ${error.message}\n`);
    return false;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║     Keyston Nutrition API Manual Test Suite        ║');
  console.log('╚══════════════════════════════════════════════════════╝');

  const usdaPassed = await testUsdaApi();
  const offPassed = await testOpenFoodFactsApi();

  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║                   Test Summary                      ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(
    `║  USDA API:           ${usdaPassed ? '✅ PASSED' : '❌ FAILED'}                     ║`
  );
  console.log(
    `║  Open Food Facts:    ${offPassed ? '✅ PASSED' : '❌ FAILED'}                     ║`
  );
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(
    `║  Overall:            ${usdaPassed && offPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}           ║`
  );
  console.log('╚══════════════════════════════════════════════════════╝\n');

  process.exit(usdaPassed && offPassed ? 0 : 1);
}

// Run tests
runTests();
