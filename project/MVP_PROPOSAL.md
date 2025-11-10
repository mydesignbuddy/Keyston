# Keyston - Fitness & Health App
## MVP Proposal

### Executive Summary
Keyston is a comprehensive fitness and health mobile application designed to help users track their nutrition intake and workout routines. The MVP focuses on three core features: food diary, food scanner, and workout tracker, providing users with essential tools to monitor and improve their health journey.

---

## 1. Product Vision

### Mission Statement
Empower users to achieve their health and fitness goals through intuitive tracking, comprehensive nutritional data, and personalized workout management.

### Target Audience
- Health-conscious individuals aged 18-55
- Fitness enthusiasts tracking macronutrients
- People on weight management programs
- Athletes monitoring nutrition and training

### Value Proposition
- **Effortless Food Logging**: Quick food entry via scanning or search
- **Comprehensive Nutrition Data**: Access to multiple authoritative nutrition databases
- **Flexible Workout Tracking**: Easy-to-use manual tracker with preset capabilities
- **Data-Driven Insights**: Clear visualization of calorie and nutrient intake

---

## 2. MVP Feature Set

### 2.1 Food Diary (Priority: HIGH)

#### Core Functionality
- **Daily Log**: Track meals organized by time periods (Breakfast, Lunch, Dinner, Snacks)
- **Nutritional Information Display**:
  - Total calories
  - Macronutrients (Protein, Carbohydrates, Fat)
  - Micronutrients (Vitamins, Minerals - basic set)
  - Fiber, Sugar, Sodium
- **Daily Summary Dashboard**:
  - Daily calorie goal vs. actual
  - Macro breakdown (pie/donut chart)
  - Weekly trends graph
- **Manual Food Entry**: Add custom foods with nutritional values
- **Portion Control**: Adjust serving sizes
- **Historical Data**: View past entries by date

#### User Stories
1. As a user, I want to log my meals throughout the day so I can track my caloric intake
2. As a user, I want to see my daily nutritional summary so I can understand my eating habits
3. As a user, I want to set daily calorie goals so I can stay within my target
4. As a user, I want to view my weekly nutrition trends so I can track progress

#### Acceptance Criteria
- Users can add, edit, and delete food entries
- Nutritional data displays accurately
- Daily totals calculate correctly
- Data persists across app sessions
- Interface responds within 2 seconds for all actions

---

### 2.2 Food Scanner (Priority: HIGH)

#### Core Functionality
- **Search Functionality**:
  - Text-based search with autocomplete
  - Search across multiple nutrition databases
  - Filter and sort results
- **Database Integration**:
  - USDA FoodData Central API integration
  - Open Food Facts API (barcode support)
  - Nutritionix API (optional/future commercial option)
- **Barcode Scanner** (if time permits in MVP):
  - Camera-based barcode scanning
  - UPC/EAN code lookup
  - Product identification
- **Quick Add to Diary**: One-tap addition to food log
- **Favorites/Recent Foods**: Quick access to frequently used items

#### User Stories
1. As a user, I want to search for foods by name so I can quickly find nutritional information
2. As a user, I want to scan product barcodes so I can instantly log packaged foods
3. As a user, I want to save favorite foods so I can add them faster in the future
4. As a user, I want to see recent foods so I can re-log common items

#### Technical Requirements
- API rate limiting handling
- Offline mode with cached data
- Response time < 3 seconds for searches
- Support for at least 1 million food items across databases

#### Acceptance Criteria
- Search returns relevant results in < 3 seconds
- At least 2 nutrition databases integrated
- Selected foods populate diary with correct data
- Favorites list persists across sessions
- Error handling for network failures

---

### 2.3 Workout Tracker (Priority: MEDIUM)

#### Core Functionality
- **Manual Workout Entry**:
  - Exercise name
  - Sets and repetitions
  - Weight used
  - Duration
  - Notes field
- **Workout Categories**:
  - Strength Training
  - Cardio
  - Flexibility
  - Sports
  - Other
- **Preset Workouts**:
  - Create custom workout templates
  - Quick-start from presets
  - Edit and duplicate presets
- **Workout History**:
  - Calendar view of completed workouts
  - Exercise progression tracking
  - Statistics and trends
- **Rest Timer**: Built-in timer between sets (nice-to-have)

#### User Stories
1. As a user, I want to manually log my workouts so I can track my training
2. As a user, I want to create workout presets so I can quickly log routine exercises
3. As a user, I want to view my workout history so I can track my progress
4. As a user, I want to see exercise statistics so I can monitor improvements

#### Acceptance Criteria
- Users can create, edit, and delete workout entries
- Preset creation and management works reliably
- Workout history displays chronologically
- Data persists across app sessions
- Interface is intuitive for manual entry

---

## 3. Out of Scope for MVP

The following features are planned for future releases but NOT included in MVP:

- **Social Features**: Friend connections, challenges, leaderboards
- **AI/ML Features**: Meal recommendations, workout suggestions, predictive analytics
- **Integration with Wearables**: Fitbit, Apple Watch, Garmin sync
- **Advanced Analytics**: Detailed reports, export functionality, custom metrics
- **Meal Planning**: Recipe suggestions, meal prep planning
- **Professional Features**: Trainer accounts, client management
- **Payment/Subscription**: Premium features, in-app purchases
- **Advanced Food Scanner**: Image recognition for foods
- **Water Tracking**: Hydration monitoring
- **Sleep Tracking**: Sleep quality monitoring
- **Body Measurements**: Weight, body fat %, measurements tracking

---

## 4. Success Metrics

### MVP Launch Criteria
- All P0 (Priority HIGH) features functional
- < 5% crash rate
- App store submission ready
- Basic user testing completed (10+ beta users)
- Privacy policy and terms of service in place

### Key Performance Indicators (KPIs)
- **User Engagement**:
  - Daily Active Users (DAU)
  - Session duration (target: 5+ minutes)
  - Daily food entries (target: 3+ per user)
- **Feature Adoption**:
  - % of users using food scanner vs manual entry
  - % of users creating workout presets
  - % of users logging workouts weekly
- **Technical Performance**:
  - App crash rate < 2%
  - API response time < 3 seconds (95th percentile)
  - App launch time < 3 seconds
- **User Satisfaction**:
  - App store rating (target: 4.0+)
  - Net Promoter Score (NPS)

---

## 5. Timeline Estimate

### Phase 1: Foundation (Weeks 1-3)
- Project setup and architecture
- Local storage schema design (IndexedDB)
- UI/UX wireframes and design system
- Nutrition API integration research and testing
- Google Drive sync setup

### Phase 2: Food Diary (Weeks 4-6)
- Food diary UI implementation
- Local data persistence with IndexedDB
- Basic dashboard and statistics
- Offline functionality

### Phase 3: Food Scanner (Weeks 7-9)
- Nutrition API integrations (client-side)
- Search functionality
- Barcode scanning with Capacitor Camera
- Favorites and recent foods (local storage)

### Phase 4: Workout Tracker (Weeks 10-11)
- Workout entry UI
- Preset management (local storage)
- Workout history and statistics
- Google Drive backup integration

### Phase 5: Testing & Polish (Weeks 12-14)
- Integration testing
- User acceptance testing
- Bug fixes and optimization
- App store preparation
- Privacy policy documentation

**Total MVP Timeline: 14 weeks (3.5 months)**

---

## 6. Technology Stack Recommendations

### Mobile Platform
- **Ionic Framework** with **React**: Web-based cross-platform development for iOS, Android, and Web (PWA)
- **TypeScript**: Type safety and better developer experience
- **Capacitor**: Native functionality access (camera, file system, cloud storage)

### Data Storage (Privacy-First)
- **IndexedDB**: Browser-based local storage for all user data
- **No backend server**: All data stays on user's device
- **Google Drive Sync**: User-controlled encrypted backups via Capacitor plugin
- Future: iCloud Drive, Dropbox, or local file export options

### APIs & Services (Client-Side Only)
- USDA FoodData Central API (free, comprehensive, government verified)
- Open Food Facts API (free, open source, excellent barcode support)
- All API calls made directly from client (no proxy server)

### No Cloud Infrastructure
- **Zero backend**: No servers, no databases, no hosting costs
- **Privacy-first**: No user accounts, no login, no authentication
- **No analytics**: No user tracking or data collection
- **Offline-first**: App works 100% offline, syncs to user's own cloud storage

### Additional Tools
- **ESLint + Prettier**: Code quality
- **Jest**: Testing framework
- **Vite**: Fast build tool
- **GitHub Actions**: CI/CD (optional)

---

## 7. Risk Assessment

### Technical Risks
| Risk | Impact | Mitigation |
|------|--------|-----------|
| API rate limits or downtime | Medium | Multiple database fallbacks, local caching, offline mode |
| Barcode database coverage | Medium | Start with Open Food Facts, allow manual entry |
| Performance on older devices | Medium | Performance testing, optimization, web-based lighter than native |
| Google Drive sync conflicts | Low | Implement simple last-write-wins or timestamp-based resolution |
| IndexedDB browser support | Low | Modern browsers all support it, graceful degradation |
| Local storage limits | Low | IndexedDB supports GBs of data, alert users if approaching limit |

### Business Risks
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Market saturation | High | Focus on privacy differentiation, no accounts/tracking |
| API costs exceeding budget | None | APIs are free, no backend costs |
| User privacy concerns | Low | Perfect privacy: no backend, no tracking, user controls data |
| Low initial adoption | Medium | Market privacy-first approach, beta testing |
| Users losing data | Medium | Encourage Google Drive backup, export functionality |

---

## 8. Next Steps

1. **Stakeholder Approval**: Review and approve MVP scope
2. **Design Phase**: Create detailed UI/UX mockups
3. **Technical Spec**: Finalize architecture and API documentation
4. **Sprint Planning**: Break down features into 2-week sprints
5. **Team Assembly**: Assign developers, designers, and QA
6. **Development Kickoff**: Begin Phase 1 development

---

## 9. Appendix

### Competitive Analysis
- **MyFitnessPal**: Market leader, comprehensive but cluttered UI
- **Lose It!**: Strong food database, good UX
- **Cronometer**: Detailed micronutrient tracking
- **JEFIT**: Workout-focused, limited nutrition features

### Differentiation Strategy
- **Cleaner, more intuitive UI** than MyFitnessPal
- **Multiple nutrition databases** for better food coverage
- **Seamless integration** between nutrition and fitness tracking
- **Focus on speed**: Fast food logging and workout entry

---

*Document Version: 1.0*  
*Last Updated: November 2025*  
*Status: Draft for Review*
