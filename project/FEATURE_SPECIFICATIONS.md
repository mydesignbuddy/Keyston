# Keyston - Feature Specifications

## Detailed Feature Requirements

---

## 1. Food Diary Feature

### 1.1 User Interface Requirements

#### Daily Diary View
- **Layout**: Scrollable list organized by meal type
- **Meal Categories**:
  - Breakfast
  - Lunch
  - Dinner
  - Snacks
- **Quick Add Button**: FAB (Floating Action Button) for quick food entry
- **Daily Summary Card**: Sticky header showing totals

#### Diary Entry Card
```
┌─────────────────────────────────────┐
│ 🍗 Grilled Chicken Breast           │
│ Brand Name • 150g                   │
│                                     │
│ 247 kcal  •  46g protein  •  5g fat │
│                          [Edit] [×] │
└─────────────────────────────────────┘
```

#### Daily Summary
```
┌─────────────────────────────────────┐
│ Daily Summary - Nov 7, 2025         │
│                                     │
│ 1,850 / 2,000 kcal  [Progress Bar]  │
│                                     │
│ Macros:                             │
│ Protein:  120g / 150g ████████░░    │
│ Carbs:    180g / 200g ████████░     │
│ Fat:       45g /  65g ███████░░░    │
│                                     │
│ [View Weekly Trends]                │
└─────────────────────────────────────┘
```

### 1.2 Functional Requirements

#### FR-FD-001: Add Food Entry
- **Precondition**: User is authenticated
- **Trigger**: User taps "Add Food" button
- **Flow**:
  1. User selects meal type (breakfast/lunch/dinner/snacks)
  2. User searches or scans food
  3. User selects food from results
  4. User adjusts portion size
  5. System calculates nutrition based on portion
  6. User confirms addition
  7. System saves entry and updates daily totals
- **Postcondition**: Food appears in diary, totals updated

#### FR-FD-002: Edit Food Entry
- **Precondition**: Food entry exists
- **Trigger**: User taps "Edit" on entry
- **Flow**:
  1. System displays entry details in edit mode
  2. User modifies portion size or meal type
  3. System recalculates nutrition
  4. User saves changes
  5. System updates entry and daily totals
- **Postcondition**: Entry updated with new values

#### FR-FD-003: Delete Food Entry
- **Precondition**: Food entry exists
- **Trigger**: User taps "Delete" or swipes entry
- **Flow**:
  1. System prompts for confirmation
  2. User confirms deletion
  3. System removes entry
  4. System updates daily totals
- **Postcondition**: Entry removed from diary

#### FR-FD-004: View Daily Summary
- **Precondition**: User is authenticated
- **Trigger**: User opens diary
- **Flow**:
  1. System calculates total calories and macros
  2. System displays progress toward daily goals
  3. System shows macro breakdown
- **Postcondition**: User sees current daily status

#### FR-FD-005: View Weekly Trends
- **Precondition**: User has historical data
- **Trigger**: User taps "View Weekly Trends"
- **Flow**:
  1. System aggregates last 7 days of data
  2. System displays line chart of daily calories
  3. System shows average macro percentages
  4. System highlights patterns (e.g., over-goal days)
- **Postcondition**: User sees weekly nutrition trends

### 1.3 Data Validation Rules

| Field | Validation Rule |
|-------|----------------|
| Serving Size | Must be > 0, max 9999 |
| Meal Type | Must be one of: breakfast, lunch, dinner, snacks |
| Entry Date | Cannot be future date, max 1 year in past |
| Calories | Auto-calculated, read-only |
| Macros | Auto-calculated based on serving size |

### 1.4 Performance Requirements

- **Load Time**: Diary view loads in < 1 second
- **Entry Addition**: Complete in < 2 seconds
- **Daily Calculation**: Update totals in < 500ms
- **Offline Support**: All diary operations work offline

---

## 2. Food Scanner Feature

### 2.1 User Interface Requirements

#### Search Screen
```
┌─────────────────────────────────────┐
│  [🔍 Search foods...]         [×]   │
├─────────────────────────────────────┤
│  Recent Searches                    │
│  • Chicken breast                   │
│  • Brown rice                       │
│  • Banana                           │
├─────────────────────────────────────┤
│  Favorites ⭐                        │
│  • Oatmeal (Quaker)                 │
│  • Greek Yogurt (Fage)              │
└─────────────────────────────────────┘
```

#### Search Results
```
┌─────────────────────────────────────┐
│  Results for "chicken breast"       │
├─────────────────────────────────────┤
│  🍗 Chicken Breast, Skinless        │
│      USDA • 165 cal per 100g        │
│      ⭐ Add to Favorites        [+] │
├─────────────────────────────────────┤
│  🍗 Chicken Breast, Grilled         │
│      Generic • 195 cal per 100g     │
│      ⭐ Add to Favorites        [+] │
├─────────────────────────────────────┤
│  🍗 Tyson Chicken Breast            │
│      Tyson • 110 cal per serving    │
│      ⭐ Add to Favorites        [+] │
└─────────────────────────────────────┘
```

#### Barcode Scanner
```
┌─────────────────────────────────────┐
│  Scan Barcode                   [×] │
│                                     │
│    ┌───────────────────────┐        │
│    │                       │        │
│    │   [Camera Viewfinder] │        │
│    │                       │        │
│    │     ┌─────────┐       │        │
│    │     │Scanning │       │        │
│    │     │  Area   │       │        │
│    │     └─────────┘       │        │
│    │                       │        │
│    └───────────────────────┘        │
│                                     │
│  Point camera at barcode            │
│  [Switch Camera] [Enable Flash]     │
└─────────────────────────────────────┘
```

### 2.2 Functional Requirements

#### FR-FS-001: Search Foods by Name
- **Precondition**: User is on search screen
- **Trigger**: User types in search box
- **Flow**:
  1. User enters search query (min 2 characters)
  2. System shows autocomplete suggestions
  3. User selects suggestion or completes typing
  4. System queries multiple nutrition databases
  5. System merges and ranks results
  6. System displays results with source attribution
- **Postcondition**: User sees list of matching foods

#### FR-FS-002: Scan Barcode
- **Precondition**: Camera permission granted
- **Trigger**: User taps "Scan Barcode"
- **Flow**:
  1. System opens camera view
  2. User points camera at barcode
  3. System detects and decodes barcode
  4. System queries barcode databases
  5. System displays product information
  6. User adds to diary or cancels
- **Postcondition**: Food identified or error shown

#### FR-FS-003: Add to Favorites
- **Precondition**: Food item displayed
- **Trigger**: User taps "Add to Favorites"
- **Flow**:
  1. System saves food to user's favorites
  2. System shows confirmation
  3. Star icon becomes filled
- **Postcondition**: Food appears in favorites list

#### FR-FS-004: View Recent Foods
- **Precondition**: User has logged foods previously
- **Trigger**: User opens search screen
- **Flow**:
  1. System retrieves last 20 logged foods
  2. System displays in chronological order
  3. User can tap to quickly add again
- **Postcondition**: Recent foods displayed

#### FR-FS-005: Quick Add from Favorites
- **Precondition**: User has favorites saved
- **Trigger**: User taps favorite food
- **Flow**:
  1. System loads food details
  2. System pre-fills last used portion size
  3. User adjusts if needed
  4. User adds to diary
- **Postcondition**: Food added to diary

### 2.3 Search Algorithm

**Ranking Factors**:
1. Exact name match (highest priority)
2. Partial name match
3. Brand relevance
4. Data source reliability (USDA > commercial > user-entered)
5. Completeness of nutrition data
6. User's previous selections (personalization)

**Data Source Priority**:
1. User's favorites
2. User's recent foods
3. USDA FoodData Central
4. Open Food Facts (barcode match)
5. Nutritionix (if available)

### 2.4 Integration Requirements

#### USDA FoodData Central API
- **Endpoint**: `https://api.nal.usda.gov/fdc/v1/foods/search`
- **API Key**: Required (free)
- **Rate Limit**: 1000 requests/hour
- **Data Coverage**: 800,000+ foods

#### Open Food Facts API
- **Endpoint**: `https://world.openfoodfacts.org/api/v0/product/{barcode}`
- **API Key**: Not required
- **Rate Limit**: No strict limit (fair use)
- **Data Coverage**: 2 million+ products with barcodes

#### Nutritionix API (Optional)
- **Endpoint**: `https://trackapi.nutritionix.com/v2/search/instant`
- **API Key**: Required (paid)
- **Rate Limit**: Varies by plan
- **Data Coverage**: 700,000+ branded foods

### 2.5 Error Handling

| Error Scenario | User Message | System Action |
|----------------|-------------|---------------|
| No internet connection | "No internet. Showing recent and favorites." | Use cached data only |
| API timeout | "Search is taking longer than usual..." | Show partial results |
| No results found | "No foods found. Try a different search." | Suggest manual entry |
| Barcode not found | "Product not found. Try manual search." | Offer search option |
| Camera permission denied | "Camera access needed to scan barcodes." | Prompt for permission |

---

## 3. Workout Tracker Feature

### 3.1 User Interface Requirements

#### Workout List View
```
┌─────────────────────────────────────┐
│  My Workouts                        │
│  [+] New Workout    [≡] Presets     │
├─────────────────────────────────────┤
│  📅 Today - Nov 7, 2025             │
│                                     │
│  💪 Upper Body Strength             │
│  45 min • 8 exercises               │
│  [View Details]                     │
├─────────────────────────────────────┤
│  📅 Nov 6, 2025                     │
│                                     │
│  🏃 Cardio - Running                │
│  30 min • 5.2 km                    │
│  [View Details]                     │
├─────────────────────────────────────┤
│  📅 Nov 5, 2025                     │
│                                     │
│  🦵 Leg Day                          │
│  60 min • 10 exercises              │
│  [View Details]                     │
└─────────────────────────────────────┘
```

#### Add Workout Screen
```
┌─────────────────────────────────────┐
│  ← New Workout                      │
├─────────────────────────────────────┤
│  Workout Type                       │
│  [Strength ▼]                       │
│                                     │
│  Date & Time                        │
│  Nov 7, 2025  •  2:30 PM           │
│                                     │
│  Exercises                          │
│  ┌───────────────────────────────┐ │
│  │ 🏋️ Bench Press                 │ │
│  │ 4 sets × 8 reps × 60 kg       │ │
│  │                     [Edit] [×]│ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │ 🏋️ Squats                      │ │
│  │ 3 sets × 12 reps × 80 kg      │ │
│  │                     [Edit] [×]│ │
│  └───────────────────────────────┘ │
│                                     │
│  [+ Add Exercise]                   │
│                                     │
│  Notes (optional)                   │
│  ┌───────────────────────────────┐ │
│  │ Felt strong today. Increased  │ │
│  │ weight on bench press.        │ │
│  └───────────────────────────────┘ │
│                                     │
│  [Save Workout]  [Save as Preset]  │
└─────────────────────────────────────┘
```

#### Workout Presets
```
┌─────────────────────────────────────┐
│  Workout Presets                    │
│  [+] Create Preset                  │
├─────────────────────────────────────┤
│  💪 Upper Body A                    │
│  8 exercises • Strength             │
│  [Start Workout] [Edit] [×]         │
├─────────────────────────────────────┤
│  🦵 Leg Day                          │
│  10 exercises • Strength            │
│  [Start Workout] [Edit] [×]         │
├─────────────────────────────────────┤
│  🏃 5K Run                           │
│  1 exercise • Cardio                │
│  [Start Workout] [Edit] [×]         │
└─────────────────────────────────────┘
```

### 3.2 Functional Requirements

#### FR-WT-001: Create Workout Entry
- **Precondition**: User is authenticated
- **Trigger**: User taps "New Workout"
- **Flow**:
  1. User selects workout type
  2. User sets date and time
  3. User adds exercises one by one
  4. For each exercise:
     - Enter exercise name
     - Select category
     - Enter sets, reps, weight (or duration)
     - Add optional notes
  5. User saves workout
- **Postcondition**: Workout saved and appears in history

#### FR-WT-002: Create Workout from Preset
- **Precondition**: User has saved presets
- **Trigger**: User selects preset and taps "Start Workout"
- **Flow**:
  1. System loads preset exercises
  2. System pre-fills workout with preset data
  3. User can modify as needed
  4. User saves completed workout
- **Postcondition**: Workout logged with preset exercises

#### FR-WT-003: Create Workout Preset
- **Precondition**: User is authenticated
- **Trigger**: User taps "Save as Preset" or "Create Preset"
- **Flow**:
  1. User names the preset
  2. User adds exercises with default values
  3. User sets order of exercises
  4. User saves preset
- **Postcondition**: Preset saved and available for reuse

#### FR-WT-004: Edit Workout Preset
- **Precondition**: Preset exists
- **Trigger**: User taps "Edit" on preset
- **Flow**:
  1. System displays preset in edit mode
  2. User modifies exercises, order, or defaults
  3. User saves changes
- **Postcondition**: Preset updated

#### FR-WT-005: View Workout History
- **Precondition**: User has logged workouts
- **Trigger**: User opens workout tracker
- **Flow**:
  1. System retrieves workouts for selected date range
  2. System displays in reverse chronological order
  3. User can filter by workout type
  4. User can tap workout to view details
- **Postcondition**: Workout history displayed

#### FR-WT-006: View Workout Statistics
- **Precondition**: User has logged workouts
- **Trigger**: User taps "Statistics" or "Progress"
- **Flow**:
  1. System calculates:
     - Total workouts this week/month
     - Most frequent exercises
     - Weight progression over time
     - Workout frequency (workouts/week)
  2. System displays charts and metrics
- **Postcondition**: User sees workout insights

### 3.3 Exercise Data Structure

```json
{
  "exerciseId": "uuid",
  "workoutEntryId": "uuid",
  "exerciseName": "Bench Press",
  "category": "strength",
  "sets": 4,
  "reps": 8,
  "weightKg": 60,
  "durationSeconds": null,
  "notes": "Increased weight from last week",
  "orderIndex": 0
}
```

### 3.4 Workout Categories

| Category | Icon | Examples |
|----------|------|----------|
| Strength | 💪 | Weight lifting, bodyweight exercises |
| Cardio | 🏃 | Running, cycling, swimming |
| Flexibility | 🧘 | Yoga, stretching, pilates |
| Sports | ⚽ | Basketball, tennis, soccer |
| Other | ⭐ | Custom activities |

### 3.5 Data Validation Rules

| Field | Validation Rule |
|-------|----------------|
| Exercise Name | Required, 1-100 characters |
| Sets | Optional, 1-99 if provided |
| Reps | Optional, 1-999 if provided |
| Weight | Optional, 0.1-999.9 kg if provided |
| Duration | Optional, 1-86400 seconds if provided |
| Workout Date | Cannot be future, max 1 year past |
| Workout Type | Must be valid category |

### 3.6 Performance Requirements

- **Workout Load**: Load workout list in < 1 second
- **Exercise Addition**: Add exercise in < 500ms
- **Preset Load**: Load preset exercises in < 1 second
- **Statistics Calculation**: Generate stats in < 2 seconds
- **Offline Support**: All workout operations work offline

---

## 4. Cross-Feature Requirements

### 4.1 User Onboarding

**First-Time User Flow**:
1. Welcome screen with app benefits
2. Create account or sign in
3. Set up profile:
   - Height, weight, age, gender
   - Daily calorie goal (optional)
   - Fitness goals
4. Quick tutorial for each feature
5. Grant permissions (camera, notifications)

### 4.2 Settings & Preferences

**Available Settings**:
- Profile information
- Daily calorie goal
- Macro targets (protein/carbs/fat ratios)
- Units (metric/imperial)
- Meal type labels (customize names)
- Notification preferences
- Privacy settings
- Data export/deletion
- App theme (light/dark mode)

### 4.3 Notifications

**Notification Types**:
- Meal reminders (log your meals)
- Daily summary (end of day recap)
- Goal achievements (streaks, milestones)
- Workout reminders
- Sync completion (for offline changes)

### 4.4 Data Export

**Export Formats**:
- CSV (food diary, workout log)
- PDF (weekly/monthly reports)
- JSON (complete data backup)

**Export Trigger**: User requests via settings

---

## 5. Non-Functional Requirements

### 5.1 Usability
- **Accessibility**: WCAG 2.1 AA compliance
- **Screen Readers**: Full support for VoiceOver/TalkBack
- **Font Scaling**: Support system font size settings
- **Color Contrast**: Meet minimum contrast ratios

### 5.2 Performance
- **App Size**: < 50MB download
- **Memory Usage**: < 200MB RAM usage
- **Battery Impact**: < 5% battery drain per hour of active use
- **Offline Capability**: All core features work offline

### 5.3 Reliability
- **Crash Rate**: < 0.1% of sessions
- **Data Loss**: Zero tolerance - all data synced
- **Uptime**: 99.9% API availability

### 5.4 Compatibility
- **iOS**: 13.0 and above
- **Android**: 8.0 (API 26) and above
- **Screen Sizes**: 4.7" to 6.9" phones, 7" to 12.9" tablets

---

*Document Version: 1.0*  
*Last Updated: November 2025*  
*Status: Draft for Review*
