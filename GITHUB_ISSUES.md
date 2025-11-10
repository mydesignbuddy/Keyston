# GitHub Issues for Keyston MVP

This document contains all the issues for the Keyston MVP organized by sprint. You can use this to:
- Copy-paste issue content when creating manually
- Reference the complete task list
- Track progress across sprints

---

## Milestones

### Sprint 0: Project Setup (Week 1-2)
**Due Date:** 2025-11-24  
**Description:** Establish development environment and architecture foundation

### Sprint 0.5: Design & Planning (Week 3)
**Due Date:** 2025-12-01  
**Description:** Finalize designs and prepare for feature development

### Sprint 1: Food Diary Core (Week 4-5)
**Due Date:** 2025-12-15  
**Description:** Implement basic food diary functionality

### Sprint 2: Food Diary Enhancement (Week 6)
**Due Date:** 2025-12-22  
**Description:** Add weekly trends and goal setting

### Sprint 3: Food Search (Week 7-8)
**Due Date:** 2026-01-05  
**Description:** Implement food search with multiple nutrition databases

### Sprint 4: Barcode Scanner (Week 9)
**Due Date:** 2026-01-12  
**Description:** Add barcode scanning capability

### Sprint 5: Workout Tracker Core (Week 10-11)
**Due Date:** 2026-01-26  
**Description:** Implement manual workout tracking with preset support

### Sprint 6: Integration & Testing (Week 12-13)
**Due Date:** 2026-02-09  
**Description:** Comprehensive testing and optimization

### Sprint 7: Polish & Launch Prep (Week 14)
**Due Date:** 2026-02-16  
**Description:** Final polish and app store submission preparation

---

## Sprint 0: Project Setup Issues

### Issue 1: Initialize Ionic + React project
**Labels:** sprint-0, setup  
**Milestone:** Sprint 0: Project Setup

**Description:**
Set up the foundational Ionic + React project with TypeScript, linting, and Capacitor configuration.

**Tasks:**
- [ ] Create Ionic React app with TypeScript
- [ ] ESLint + Prettier setup
- [ ] Folder structure setup
- [ ] Configure Capacitor for native features

**Acceptance Criteria:**
- Ionic project runs successfully on iOS simulator/emulator
- Ionic project runs successfully on Android emulator
- Linting and formatting rules are configured
- Capacitor is properly configured

---

### Issue 2: Set up navigation system
**Labels:** sprint-0, setup  
**Milestone:** Sprint 0: Project Setup

**Description:**
Configure Ionic Router with tab navigation and page routing.

**Tasks:**
- [ ] Ionic Router configuration
- [ ] Tab navigation structure
- [ ] Page routing setup

**Acceptance Criteria:**
- Tab navigation works with icons
- Pages route correctly
- Navigation state persists

---

### Issue 3: Set up State Management
**Labels:** sprint-0, setup  
**Milestone:** Sprint 0: Project Setup

**Description:**
Implement state management solution using React Context or Redux.

**Tasks:**
- [ ] React Context setup (or Redux if complexity warrants)
- [ ] Local state management patterns
- [ ] State management documentation

**Acceptance Criteria:**
- State management solution is working
- State persists across navigation
- Documentation for state patterns

---

### Issue 4: Set up IndexedDB with Dexie.js
**Labels:** sprint-0, setup, data  
**Milestone:** Sprint 0: Project Setup

**Description:**
Configure IndexedDB using Dexie.js with the complete schema from ARCHITECTURE.md.

**Tasks:**
- [ ] Install Dexie.js or similar IndexedDB wrapper
- [ ] Define database schema
- [ ] Create data access layer
- [ ] Test CRUD operations

**Acceptance Criteria:**
- IndexedDB schema is defined per ARCHITECTURE.md
- Data access layer works for all object stores
- Basic CRUD operations tested
- Error handling implemented

**Privacy Note:**
All data stays local - no external databases

---

### Issue 5: Create design system
**Labels:** sprint-0, design  
**Milestone:** Sprint 0: Project Setup

**Description:**
Establish the design system with color palette, typography, and Ionic component customization.

**Tasks:**
- [ ] Define color palette
- [ ] Typography scale
- [ ] Ionic component customization
- [ ] Theme provider (light/dark mode support)

**Acceptance Criteria:**
- Design tokens are defined
- Theme switching works
- Ionic components are styled consistently
- Design system documented

---

### Issue 6: Set up Capacitor plugins
**Labels:** sprint-0, setup, capacitor  
**Milestone:** Sprint 0: Project Setup

**Description:**
Install and configure essential Capacitor plugins for native functionality.

**Tasks:**
- [ ] Camera plugin for barcode scanning
- [ ] Google Drive plugin for backup
- [ ] File system plugin

**Acceptance Criteria:**
- Camera plugin installed and tested
- Google Drive plugin installed and configured
- File system plugin installed and tested
- Permissions handled properly

---

### Issue 7: Set up nutrition API accounts and testing
**Labels:** sprint-0, setup, api  
**Milestone:** Sprint 0: Project Setup

**Description:**
Obtain API keys and test nutrition APIs from the client.

**Tasks:**
- [ ] USDA FoodData Central API key
- [ ] Test USDA API from client
- [ ] Test Open Food Facts API
- [ ] Document API rate limits

**Acceptance Criteria:**
- USDA API key obtained
- Test API calls work from client
- Open Food Facts API tested
- API documentation created

**Privacy Note:**
All API calls are client-side only - no proxy server

---

### Issue 8: Create API client layer
**Labels:** sprint-0, api  
**Milestone:** Sprint 0: Project Setup

**Description:**
Build wrapper classes for nutrition APIs with error handling and caching.

**Tasks:**
- [ ] USDA API wrapper
- [ ] Open Food Facts API wrapper
- [ ] Error handling
- [ ] Client-side caching strategy

**Acceptance Criteria:**
- API wrappers handle requests/responses
- Error handling for network failures
- Caching strategy implemented
- API client documented

---

### Issue 9: Create UI/UX mockups in Figma
**Labels:** sprint-0, design  
**Milestone:** Sprint 0: Project Setup

**Description:**
Design all MVP screens in Figma with user flows and interaction specs.

**Tasks:**
- [ ] All screens in Figma/Sketch
- [ ] User flow diagrams
- [ ] Interaction specifications
- [ ] Component library in Figma

**Acceptance Criteria:**
- All MVP screens designed
- User flows documented
- Design handoff ready
- Interactive prototype created

---

### Issue 10: Create app branding
**Labels:** sprint-0, design, branding  
**Milestone:** Sprint 0: Project Setup

**Description:**
Design the app logo, brand identity, and app icons.

**Tasks:**
- [ ] Logo design
- [ ] Color scheme finalization
- [ ] Typography selection
- [ ] App icon design (all sizes)

**Acceptance Criteria:**
- Logo created in multiple formats
- Brand guidelines documented
- App icon ready for all platforms
- Color scheme documented

---

## Sprint 1: Food Diary Core Issues

### Issue 11: Implement IndexedDB food diary schema
**Labels:** sprint-1, data  
**Milestone:** Sprint 1: Food Diary Core

**Description:**
Set up the IndexedDB schema for food diary with proper indexes.

**Tasks:**
- [ ] food_diary_entries object store
- [ ] foods object store (cached data)
- [ ] Indexes for queries
- [ ] Data validation

**Acceptance Criteria:**
- Schema matches ARCHITECTURE.md
- Indexes created for common queries
- Validation functions work
- Migration strategy defined

---

### Issue 12: Create food diary service layer
**Labels:** sprint-1, feature  
**Milestone:** Sprint 1: Food Diary Core

**Description:**
Build the service layer for food diary operations.

**Tasks:**
- [ ] Add/edit/delete diary entries
- [ ] Get entries by date
- [ ] Calculate daily totals
- [ ] Portion size adjustments
- [ ] Nutrient aggregation

**Acceptance Criteria:**
- All CRUD operations work
- Date queries are efficient
- Daily totals calculate correctly
- Portion adjustments work
- Service layer is well-tested

---

### Issue 13: Implement food diary UI pages
**Labels:** sprint-1, ui  
**Milestone:** Sprint 1: Food Diary Core

**Description:**
Create the main food diary interface with Ionic components.

**Tasks:**
- [ ] Daily diary view with Ionic components
- [ ] Meal sections (breakfast, lunch, dinner, snacks)
- [ ] Entry cards with nutrition display
- [ ] Date picker navigation

**Acceptance Criteria:**
- Diary displays current day by default
- Meal sections are expandable/collapsible
- Entry cards show key nutrition info
- Date picker works smoothly
- UI matches design mockups

---

### Issue 14: Build add food page
**Labels:** sprint-1, ui  
**Milestone:** Sprint 1: Food Diary Core

**Description:**
Create the form for adding food entries to the diary.

**Tasks:**
- [ ] Meal type selector
- [ ] Portion size input
- [ ] Nutrition preview
- [ ] Save functionality

**Acceptance Criteria:**
- Meal type selector works
- Portion size adjusts nutrition values
- Preview shows calculated nutrition
- Save adds entry to diary
- Form validation works

---

### Issue 15: Implement edit/delete functionality
**Labels:** sprint-1, ui  
**Milestone:** Sprint 1: Food Diary Core

**Description:**
Add ability to edit and delete food diary entries.

**Tasks:**
- [ ] Edit entry modal
- [ ] Swipe to delete (Ionic sliding items)
- [ ] Confirmation dialogs
- [ ] Update diary totals after changes

**Acceptance Criteria:**
- Edit modal populates with current data
- Swipe to delete works on mobile
- Confirmation prevents accidental deletes
- Totals update immediately after changes

---

### Issue 16: Create daily summary component
**Labels:** sprint-1, ui, charts  
**Milestone:** Sprint 1: Food Diary Core

**Description:**
Build the dashboard showing daily nutrition totals with charts.

**Tasks:**
- [ ] Calorie progress bar
- [ ] Macro breakdown chart (Chart.js or similar)
- [ ] Daily totals display
- [ ] Goal comparison

**Acceptance Criteria:**
- Progress bar shows calorie progress vs goal
- Macro chart displays protein/carbs/fat
- Totals update in real-time
- Chart is responsive
- Handles zero data gracefully

---

### Issue 17: Set up state management for food diary
**Labels:** sprint-1, state  
**Milestone:** Sprint 1: Food Diary Core

**Description:**
Integrate state management for food diary feature.

**Tasks:**
- [ ] Food diary context or Redux slice
- [ ] Local state updates (instant)
- [ ] State persistence check

**Acceptance Criteria:**
- State management integrated
- Updates are instant (no lag)
- State persists on navigation
- State management documented

---

### Issue 18: QA - Food diary testing
**Labels:** sprint-1, qa, testing  
**Milestone:** Sprint 1: Food Diary Core

**Description:**
Comprehensive testing of food diary functionality.

**Tasks:**
- [ ] Create test plan for food diary
- [ ] Manual testing on iOS (via Capacitor)
- [ ] Manual testing on Android (via Capacitor)
- [ ] Test as PWA in browser
- [ ] Edge case testing (large portions, zero values, etc.)
- [ ] Performance testing (100+ diary entries)

**Acceptance Criteria:**
- Test plan documented
- All platforms tested
- Edge cases handled properly
- Performance is acceptable
- Bug list created and prioritized

---

## Sprint 3: Food Search Issues

### Issue 19: Create nutrition API client services
**Labels:** sprint-3, api  
**Milestone:** Sprint 3: Food Search

**Description:**
Build client-side API wrappers for USDA and Open Food Facts.

**Tasks:**
- [ ] USDA API client (direct fetch from browser)
- [ ] Open Food Facts API client
- [ ] Unified food data model/interface
- [ ] Response transformation
- [ ] Error handling
- [ ] Client-side rate limit management

**Acceptance Criteria:**
- Direct API calls work from client
- Response data normalized to common format
- Error handling for network issues
- Rate limiting prevents API abuse
- API clients well-tested

**Privacy Note:**
All API calls are direct from client - no proxy server

---

### Issue 20: Implement search aggregation logic
**Labels:** sprint-3, feature  
**Milestone:** Sprint 3: Food Search

**Description:**
Merge and rank results from multiple nutrition databases.

**Tasks:**
- [ ] Query multiple sources in parallel
- [ ] Merge and rank results
- [ ] Deduplicate entries
- [ ] Search result scoring

**Acceptance Criteria:**
- Searches query both USDA and Open Food Facts
- Results are merged intelligently
- Duplicates are removed
- Best results appear first
- Search is fast (< 2 seconds)

---

### Issue 21: Implement IndexedDB caching strategy
**Labels:** sprint-3, cache, data  
**Milestone:** Sprint 3: Food Search

**Description:**
Cache nutrition API responses in IndexedDB with TTL.

**Tasks:**
- [ ] Cache search results in api_cache (24h TTL)
- [ ] Cache nutrition data (7 day TTL)
- [ ] Check cache before API calls
- [ ] Cache cleanup on expiry

**Acceptance Criteria:**
- Cache is checked before API calls
- TTL is respected
- Cache improves search speed
- Old entries are cleaned up
- Cache works offline

---

### Issue 22: Create food search UI page
**Labels:** sprint-3, ui  
**Milestone:** Sprint 3: Food Search

**Description:**
Build the food search interface with Ionic search bar.

**Tasks:**
- [ ] Ionic search bar with debounce
- [ ] Autocomplete suggestions
- [ ] Loading indicators
- [ ] Empty state

**Acceptance Criteria:**
- Search bar has debounce (300ms)
- Loading state shows during search
- Empty state when no results
- Search history (recent searches)
- UI matches design mockups

---

### Issue 23: Build search results list
**Labels:** sprint-3, ui  
**Milestone:** Sprint 3: Food Search

**Description:**
Display search results with nutrition previews.

**Tasks:**
- [ ] Ionic cards with nutrition preview
- [ ] Source badges (USDA, Open Food Facts)
- [ ] Infinite scroll/virtual scrolling
- [ ] Result selection

**Acceptance Criteria:**
- Results display with key nutrition info
- Source is clearly indicated
- List scrolls smoothly with many results
- Tapping result navigates to add page
- Virtual scrolling for performance

---

### Issue 24: Implement favorites system
**Labels:** sprint-3, feature  
**Milestone:** Sprint 3: Food Search

**Description:**
Add ability to favorite foods for quick access.

**Tasks:**
- [ ] favorite_foods object store
- [ ] Add/remove favorites
- [ ] Track usage count
- [ ] Favorites UI section

**Acceptance Criteria:**
- Users can favorite foods
- Favorites persist in IndexedDB
- Usage count increments on use
- Favorites section shows most used
- Quick add from favorites works

---

### Issue 25: Implement recent foods feature
**Labels:** sprint-3, feature  
**Milestone:** Sprint 3: Food Search

**Description:**
Show recently logged foods for quick re-entry.

**Tasks:**
- [ ] Show last 20 logged foods from diary
- [ ] Quick re-add functionality
- [ ] Recent foods UI

**Acceptance Criteria:**
- Recent foods query is efficient
- Shows unique foods from diary
- Quick add works from recent list
- List updates after adding food

---

## Additional Sprints

For Sprints 2, 4, 5, 6, and 7, create similar issues based on the tasks outlined in DEVELOPMENT_ROADMAP.md.

**Sprint 2 Focus:** Weekly trends, goal setting, charts  
**Sprint 4 Focus:** Barcode scanner with Capacitor Camera  
**Sprint 5 Focus:** Workout tracker with presets  
**Sprint 6 Focus:** Integration testing, performance optimization, privacy audit  
**Sprint 7 Focus:** Google Drive sync, final polish, app store submission

---

## Labels to Create

- `sprint-0`, `sprint-1`, `sprint-2`, `sprint-3`, `sprint-4`, `sprint-5`, `sprint-6`, `sprint-7`
- `setup`, `design`, `ui`, `feature`, `data`, `api`, `cache`, `state`, `qa`, `testing`
- `capacitor`, `branding`, `charts`, `privacy`
- `bug`, `enhancement`, `documentation`

---

## GitHub Project Board Setup

1. Create a new GitHub Project (Projects tab in repo)
2. Choose "Board" layout
3. Create columns: Backlog, Sprint N (current), In Progress, Review, Done
4. Add all issues to Backlog
5. Move Sprint 0 issues to "Sprint 0" column
6. As you progress, create columns for each active sprint

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Based on:** DEVELOPMENT_ROADMAP.md
