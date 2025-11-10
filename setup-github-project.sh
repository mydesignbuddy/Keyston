#!/bin/bash
# GitHub Project Setup Script for Keyston MVP
# This script creates milestones and issues based on the development roadmap
# 
# Prerequisites:
# - Install GitHub CLI: https://cli.github.com/
# - Authenticate: gh auth login
# 
# Usage: ./setup-github-project.sh

set -e

REPO="mydesignbuddy/Keyston"

echo "🚀 Setting up GitHub Project for Keyston MVP"
echo "Repository: $REPO"
echo ""

# Create Milestones (7 Sprints)
echo "📅 Creating Milestones..."

gh issue milestone create "Sprint 0: Project Setup" \
  --repo "$REPO" \
  --description "Week 1-2: Establish development environment and architecture foundation" \
  --due-date "2025-11-24"

gh issue milestone create "Sprint 0.5: Design & Planning" \
  --repo "$REPO" \
  --description "Week 3: Finalize designs and prepare for feature development" \
  --due-date "2025-12-01"

gh issue milestone create "Sprint 1: Food Diary Core" \
  --repo "$REPO" \
  --description "Week 4-5: Implement basic food diary functionality" \
  --due-date "2025-12-15"

gh issue milestone create "Sprint 2: Food Diary Enhancement" \
  --repo "$REPO" \
  --description "Week 6: Add weekly trends and goal setting" \
  --due-date "2025-12-22"

gh issue milestone create "Sprint 3: Food Search" \
  --repo "$REPO" \
  --description "Week 7-8: Implement food search with multiple nutrition databases" \
  --due-date "2026-01-05"

gh issue milestone create "Sprint 4: Barcode Scanner" \
  --repo "$REPO" \
  --description "Week 9: Add barcode scanning capability" \
  --due-date "2026-01-12"

gh issue milestone create "Sprint 5: Workout Tracker Core" \
  --repo "$REPO" \
  --description "Week 10-11: Implement manual workout tracking with preset support" \
  --due-date "2026-01-26"

gh issue milestone create "Sprint 6: Integration & Testing" \
  --repo "$REPO" \
  --description "Week 12-13: Comprehensive testing and optimization" \
  --due-date "2026-02-09"

gh issue milestone create "Sprint 7: Polish & Launch Prep" \
  --repo "$REPO" \
  --description "Week 14: Final polish and app store submission preparation" \
  --due-date "2026-02-16"

echo "✅ Milestones created!"
echo ""

# Create Issues for Sprint 0
echo "📝 Creating Issues for Sprint 0: Project Setup..."

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 0] Initialize Ionic + React project" \
  --body "## Tasks
- [ ] Create Ionic React app with TypeScript
- [ ] ESLint + Prettier setup
- [ ] Folder structure setup
- [ ] Configure Capacitor for native features

## Acceptance Criteria
- Ionic project runs successfully on iOS simulator/emulator
- Ionic project runs successfully on Android emulator
- Linting and formatting rules are configured
- Capacitor is properly configured

## Sprint
Sprint 0: Project Setup (Week 1-2)" \
  --milestone "Sprint 0: Project Setup" \
  --label "sprint-0,setup"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 0] Set up navigation system" \
  --body "## Tasks
- [ ] Ionic Router configuration
- [ ] Tab navigation structure
- [ ] Page routing setup

## Acceptance Criteria
- Tab navigation works with icons
- Pages route correctly
- Navigation state persists

## Sprint
Sprint 0: Project Setup (Week 1-2)" \
  --milestone "Sprint 0: Project Setup" \
  --label "sprint-0,setup"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 0] Set up State Management" \
  --body "## Tasks
- [ ] React Context setup (or Redux if complexity warrants)
- [ ] Local state management patterns
- [ ] State management documentation

## Acceptance Criteria
- State management solution is working
- State persists across navigation
- Documentation for state patterns

## Sprint
Sprint 0: Project Setup (Week 1-2)" \
  --milestone "Sprint 0: Project Setup" \
  --label "sprint-0,setup"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 0] Set up IndexedDB with Dexie.js" \
  --body "## Tasks
- [ ] Install Dexie.js or similar IndexedDB wrapper
- [ ] Define database schema
- [ ] Create data access layer
- [ ] Test CRUD operations

## Acceptance Criteria
- IndexedDB schema is defined per ARCHITECTURE.md
- Data access layer works for all object stores
- Basic CRUD operations tested
- Error handling implemented

## Privacy Note
All data stays local - no external databases

## Sprint
Sprint 0: Project Setup (Week 1-2)" \
  --milestone "Sprint 0: Project Setup" \
  --label "sprint-0,setup,data"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 0] Create design system" \
  --body "## Tasks
- [ ] Define color palette
- [ ] Typography scale
- [ ] Ionic component customization
- [ ] Theme provider (light/dark mode support)

## Acceptance Criteria
- Design tokens are defined
- Theme switching works
- Ionic components are styled consistently
- Design system documented

## Sprint
Sprint 0: Project Setup (Week 1-2)" \
  --milestone "Sprint 0: Project Setup" \
  --label "sprint-0,design"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 0] Set up Capacitor plugins" \
  --body "## Tasks
- [ ] Camera plugin for barcode scanning
- [ ] Google Drive plugin for backup
- [ ] File system plugin

## Acceptance Criteria
- Camera plugin installed and tested
- Google Drive plugin installed and configured
- File system plugin installed and tested
- Permissions handled properly

## Sprint
Sprint 0: Project Setup (Week 1-2)" \
  --milestone "Sprint 0: Project Setup" \
  --label "sprint-0,setup,capacitor"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 0] Set up nutrition API accounts and testing" \
  --body "## Tasks
- [ ] USDA FoodData Central API key
- [ ] Test USDA API from client
- [ ] Test Open Food Facts API
- [ ] Document API rate limits

## Acceptance Criteria
- USDA API key obtained
- Test API calls work from client
- Open Food Facts API tested
- API documentation created

## Privacy Note
All API calls are client-side only - no proxy server

## Sprint
Sprint 0: Project Setup (Week 1-2)" \
  --milestone "Sprint 0: Project Setup" \
  --label "sprint-0,setup,api"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 0] Create API client layer" \
  --body "## Tasks
- [ ] USDA API wrapper
- [ ] Open Food Facts API wrapper
- [ ] Error handling
- [ ] Client-side caching strategy

## Acceptance Criteria
- API wrappers handle requests/responses
- Error handling for network failures
- Caching strategy implemented
- API client documented

## Sprint
Sprint 0: Project Setup (Week 1-2)" \
  --milestone "Sprint 0: Project Setup" \
  --label "sprint-0,api"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 0] Create UI/UX mockups in Figma" \
  --body "## Tasks
- [ ] All screens in Figma/Sketch
- [ ] User flow diagrams
- [ ] Interaction specifications
- [ ] Component library in Figma

## Acceptance Criteria
- All MVP screens designed
- User flows documented
- Design handoff ready
- Interactive prototype created

## Sprint
Sprint 0: Project Setup (Week 1-2)" \
  --milestone "Sprint 0: Project Setup" \
  --label "sprint-0,design"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 0] Create app branding" \
  --body "## Tasks
- [ ] Logo design
- [ ] Color scheme finalization
- [ ] Typography selection
- [ ] App icon design (all sizes)

## Acceptance Criteria
- Logo created in multiple formats
- Brand guidelines documented
- App icon ready for all platforms
- Color scheme documented

## Sprint
Sprint 0: Project Setup (Week 1-2)" \
  --milestone "Sprint 0: Project Setup" \
  --label "sprint-0,design,branding"

echo "✅ Sprint 0 issues created!"
echo ""

# Create Issues for Sprint 1
echo "📝 Creating Issues for Sprint 1: Food Diary Core..."

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 1] Implement IndexedDB food diary schema" \
  --body "## Tasks
- [ ] food_diary_entries object store
- [ ] foods object store (cached data)
- [ ] Indexes for queries
- [ ] Data validation

## Acceptance Criteria
- Schema matches ARCHITECTURE.md
- Indexes created for common queries
- Validation functions work
- Migration strategy defined

## Sprint
Sprint 1: Food Diary Core (Week 4-5)" \
  --milestone "Sprint 1: Food Diary Core" \
  --label "sprint-1,data"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 1] Create food diary service layer" \
  --body "## Tasks
- [ ] Add/edit/delete diary entries
- [ ] Get entries by date
- [ ] Calculate daily totals
- [ ] Portion size adjustments
- [ ] Nutrient aggregation

## Acceptance Criteria
- All CRUD operations work
- Date queries are efficient
- Daily totals calculate correctly
- Portion adjustments work
- Service layer is well-tested

## Sprint
Sprint 1: Food Diary Core (Week 4-5)" \
  --milestone "Sprint 1: Food Diary Core" \
  --label "sprint-1,feature"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 1] Implement food diary UI pages" \
  --body "## Tasks
- [ ] Daily diary view with Ionic components
- [ ] Meal sections (breakfast, lunch, dinner, snacks)
- [ ] Entry cards with nutrition display
- [ ] Date picker navigation

## Acceptance Criteria
- Diary displays current day by default
- Meal sections are expandable/collapsible
- Entry cards show key nutrition info
- Date picker works smoothly
- UI matches design mockups

## Sprint
Sprint 1: Food Diary Core (Week 4-5)" \
  --milestone "Sprint 1: Food Diary Core" \
  --label "sprint-1,ui"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 1] Build add food page" \
  --body "## Tasks
- [ ] Meal type selector
- [ ] Portion size input
- [ ] Nutrition preview
- [ ] Save functionality

## Acceptance Criteria
- Meal type selector works
- Portion size adjusts nutrition values
- Preview shows calculated nutrition
- Save adds entry to diary
- Form validation works

## Sprint
Sprint 1: Food Diary Core (Week 4-5)" \
  --milestone "Sprint 1: Food Diary Core" \
  --label "sprint-1,ui"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 1] Implement edit/delete functionality" \
  --body "## Tasks
- [ ] Edit entry modal
- [ ] Swipe to delete (Ionic sliding items)
- [ ] Confirmation dialogs
- [ ] Update diary totals after changes

## Acceptance Criteria
- Edit modal populates with current data
- Swipe to delete works on mobile
- Confirmation prevents accidental deletes
- Totals update immediately after changes

## Sprint
Sprint 1: Food Diary Core (Week 4-5)" \
  --milestone "Sprint 1: Food Diary Core" \
  --label "sprint-1,ui"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 1] Create daily summary component" \
  --body "## Tasks
- [ ] Calorie progress bar
- [ ] Macro breakdown chart (Chart.js or similar)
- [ ] Daily totals display
- [ ] Goal comparison

## Acceptance Criteria
- Progress bar shows calorie progress vs goal
- Macro chart displays protein/carbs/fat
- Totals update in real-time
- Chart is responsive
- Handles zero data gracefully

## Sprint
Sprint 1: Food Diary Core (Week 4-5)" \
  --milestone "Sprint 1: Food Diary Core" \
  --label "sprint-1,ui,charts"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 1] Set up state management for food diary" \
  --body "## Tasks
- [ ] Food diary context or Redux slice
- [ ] Local state updates (instant)
- [ ] State persistence check

## Acceptance Criteria
- State management integrated
- Updates are instant (no lag)
- State persists on navigation
- State management documented

## Sprint
Sprint 1: Food Diary Core (Week 4-5)" \
  --milestone "Sprint 1: Food Diary Core" \
  --label "sprint-1,state"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 1] QA: Food diary testing" \
  --body "## Tasks
- [ ] Create test plan for food diary
- [ ] Manual testing on iOS (via Capacitor)
- [ ] Manual testing on Android (via Capacitor)
- [ ] Test as PWA in browser
- [ ] Edge case testing (large portions, zero values, etc.)
- [ ] Performance testing (100+ diary entries)

## Acceptance Criteria
- Test plan documented
- All platforms tested
- Edge cases handled properly
- Performance is acceptable
- Bug list created and prioritized

## Sprint
Sprint 1: Food Diary Core (Week 4-5)" \
  --milestone "Sprint 1: Food Diary Core" \
  --label "sprint-1,qa,testing"

echo "✅ Sprint 1 issues created!"
echo ""

# Create Issues for Sprint 3 (Food Search) - Critical sprint
echo "📝 Creating Issues for Sprint 3: Food Search..."

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 3] Create nutrition API client services" \
  --body "## Tasks
- [ ] USDA API client (direct fetch from browser)
- [ ] Open Food Facts API client
- [ ] Unified food data model/interface
- [ ] Response transformation
- [ ] Error handling
- [ ] Client-side rate limit management

## Acceptance Criteria
- Direct API calls work from client
- Response data normalized to common format
- Error handling for network issues
- Rate limiting prevents API abuse
- API clients well-tested

## Privacy Note
All API calls are direct from client - no proxy server

## Sprint
Sprint 3: Food Search (Week 7-8)" \
  --milestone "Sprint 3: Food Search" \
  --label "sprint-3,api"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 3] Implement search aggregation logic" \
  --body "## Tasks
- [ ] Query multiple sources in parallel
- [ ] Merge and rank results
- [ ] Deduplicate entries
- [ ] Search result scoring

## Acceptance Criteria
- Searches query both USDA and Open Food Facts
- Results are merged intelligently
- Duplicates are removed
- Best results appear first
- Search is fast (< 2 seconds)

## Sprint
Sprint 3: Food Search (Week 7-8)" \
  --milestone "Sprint 3: Food Search" \
  --label "sprint-3,feature"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 3] Implement IndexedDB caching strategy" \
  --body "## Tasks
- [ ] Cache search results in api_cache (24h TTL)
- [ ] Cache nutrition data (7 day TTL)
- [ ] Check cache before API calls
- [ ] Cache cleanup on expiry

## Acceptance Criteria
- Cache is checked before API calls
- TTL is respected
- Cache improves search speed
- Old entries are cleaned up
- Cache works offline

## Sprint
Sprint 3: Food Search (Week 7-8)" \
  --milestone "Sprint 3: Food Search" \
  --label "sprint-3,cache,data"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 3] Create food search UI page" \
  --body "## Tasks
- [ ] Ionic search bar with debounce
- [ ] Autocomplete suggestions
- [ ] Loading indicators
- [ ] Empty state

## Acceptance Criteria
- Search bar has debounce (300ms)
- Loading state shows during search
- Empty state when no results
- Search history (recent searches)
- UI matches design mockups

## Sprint
Sprint 3: Food Search (Week 7-8)" \
  --milestone "Sprint 3: Food Search" \
  --label "sprint-3,ui"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 3] Build search results list" \
  --body "## Tasks
- [ ] Ionic cards with nutrition preview
- [ ] Source badges (USDA, Open Food Facts)
- [ ] Infinite scroll/virtual scrolling
- [ ] Result selection

## Acceptance Criteria
- Results display with key nutrition info
- Source is clearly indicated
- List scrolls smoothly with many results
- Tapping result navigates to add page
- Virtual scrolling for performance

## Sprint
Sprint 3: Food Search (Week 7-8)" \
  --milestone "Sprint 3: Food Search" \
  --label "sprint-3,ui"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 3] Implement favorites system" \
  --body "## Tasks
- [ ] favorite_foods object store
- [ ] Add/remove favorites
- [ ] Track usage count
- [ ] Favorites UI section

## Acceptance Criteria
- Users can favorite foods
- Favorites persist in IndexedDB
- Usage count increments on use
- Favorites section shows most used
- Quick add from favorites works

## Sprint
Sprint 3: Food Search (Week 7-8)" \
  --milestone "Sprint 3: Food Search" \
  --label "sprint-3,feature"

gh issue create \
  --repo "$REPO" \
  --title "[Sprint 3] Implement recent foods feature" \
  --body "## Tasks
- [ ] Show last 20 logged foods from diary
- [ ] Quick re-add functionality
- [ ] Recent foods UI

## Acceptance Criteria
- Recent foods query is efficient
- Shows unique foods from diary
- Quick add works from recent list
- List updates after adding food

## Sprint
Sprint 3: Food Search (Week 7-8)" \
  --milestone "Sprint 3: Food Search" \
  --label "sprint-3,feature"

echo "✅ Sprint 3 issues created!"
echo ""

echo "✨ GitHub Project setup complete!"
echo ""
echo "Next steps:"
echo "1. Review the created milestones and issues in GitHub"
echo "2. Create a GitHub Project board and add these issues"
echo "3. Assign issues to team members"
echo "4. Start Sprint 0!"
echo ""
echo "Note: This script creates a subset of issues. You can create more"
echo "      issues for Sprints 2, 4, 5, 6, and 7 using the same pattern."
