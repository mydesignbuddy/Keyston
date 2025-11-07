# Keyston - Architecture Documentation
## System Architecture & Technical Design

---

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Architecture Diagrams](#2-architecture-diagrams)
3. [Component Architecture](#3-component-architecture)
4. [Data Architecture](#4-data-architecture)
5. [API Design](#5-api-design)
6. [Security Architecture](#6-security-architecture)
7. [Scalability & Performance](#7-scalability--performance)
8. [Development Guidelines](#8-development-guidelines)

---

## 1. System Overview

### 1.1 High-Level Architecture

Keyston follows a modern **three-tier architecture** with a mobile client, RESTful API backend, and cloud-based data storage.

**Architecture Pattern**: Client-Server with MVC on mobile

**Key Principles**:
- **Separation of Concerns**: Clear boundaries between presentation, business logic, and data
- **Modularity**: Features developed as independent modules
- **Scalability**: Horizontal scaling capability for backend services
- **Offline-First**: Local data persistence with cloud synchronization
- **Security by Design**: Authentication, encryption, and data protection built-in

---

## 2. Architecture Diagrams

### 2.1 System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[Mobile App - iOS/Android]
        A1[React Native/Flutter]
        A2[Local Storage]
        A3[Camera/Sensors]
    end
    
    subgraph "API Gateway Layer"
        B[API Gateway]
        B1[Load Balancer]
        B2[Rate Limiter]
        B3[Authentication]
    end
    
    subgraph "Application Layer"
        C[User Service]
        D[Food Service]
        E[Workout Service]
        F[Nutrition Service]
    end
    
    subgraph "Data Layer"
        G[(User Database)]
        H[(Food Diary DB)]
        I[(Workout DB)]
        J[Cache Layer - Redis]
    end
    
    subgraph "External Services"
        K[USDA FoodData API]
        L[Nutritionix API]
        M[Open Food Facts]
        N[Barcode Lookup Service]
    end
    
    subgraph "Infrastructure"
        O[File Storage - S3]
        P[CDN]
        Q[Analytics Service]
        R[Monitoring & Logging]
    end
    
    A --> B1
    B1 --> B
    B --> B2
    B2 --> B3
    B3 --> C
    B3 --> D
    B3 --> E
    B3 --> F
    
    C --> G
    D --> H
    E --> I
    
    D --> J
    F --> J
    
    F --> K
    F --> L
    F --> M
    F --> N
    
    A --> O
    O --> P
    
    C --> Q
    D --> Q
    E --> Q
    
    B --> R
    C --> R
    D --> R
    E --> R
    F --> R
    
    A2 -.Sync.-> D
    A2 -.Sync.-> E
```

### 2.2 Data Flow Diagram - Food Logging

```mermaid
sequenceDiagram
    actor User
    participant App
    participant LocalDB
    participant API
    participant Cache
    participant NutritionAPI
    participant Database
    
    User->>App: Search for food
    App->>API: GET /api/foods/search?q=apple
    API->>Cache: Check cached results
    
    alt Cache Hit
        Cache-->>API: Return cached data
    else Cache Miss
        API->>NutritionAPI: Query USDA API
        NutritionAPI-->>API: Return nutrition data
        API->>Cache: Store in cache (TTL: 24h)
    end
    
    API-->>App: Return search results
    App-->>User: Display food options
    
    User->>App: Select food & portion
    App->>LocalDB: Save to local storage
    LocalDB-->>App: Confirm saved
    
    App->>API: POST /api/diary/entries
    API->>Database: Insert food entry
    Database-->>API: Entry created
    API-->>App: Return entry with ID
    
    App-->>User: Update diary UI
```

### 2.3 Component Architecture Diagram

```mermaid
graph LR
    subgraph "Mobile Application"
        subgraph "Presentation Layer"
            UI1[Food Diary Screens]
            UI2[Food Scanner Screens]
            UI3[Workout Tracker Screens]
            UI4[Dashboard/Stats]
        end
        
        subgraph "Business Logic Layer"
            BL1[Food Diary Manager]
            BL2[Food Search Manager]
            BL3[Workout Manager]
            BL4[Sync Manager]
            BL5[Analytics Manager]
        end
        
        subgraph "Data Access Layer"
            DAL1[Local Database]
            DAL2[API Client]
            DAL3[Cache Manager]
        end
        
        subgraph "Utilities"
            U1[Camera Service]
            U2[Barcode Scanner]
            U3[Authentication]
            U4[Error Handler]
        end
    end
    
    UI1 --> BL1
    UI2 --> BL2
    UI3 --> BL3
    UI4 --> BL5
    
    BL1 --> DAL1
    BL1 --> DAL2
    BL2 --> DAL2
    BL2 --> DAL3
    BL3 --> DAL1
    BL3 --> DAL2
    BL4 --> DAL1
    BL4 --> DAL2
    
    UI2 --> U1
    U1 --> U2
    DAL2 --> U3
    
    BL1 --> U4
    BL2 --> U4
    BL3 --> U4
```

### 2.4 Database Schema Diagram

```mermaid
erDiagram
    USERS ||--o{ FOOD_DIARY_ENTRIES : logs
    USERS ||--o{ WORKOUT_ENTRIES : performs
    USERS ||--o{ WORKOUT_PRESETS : creates
    USERS ||--o{ FAVORITE_FOODS : saves
    USERS {
        uuid id PK
        string email UK
        string password_hash
        string display_name
        date date_of_birth
        string gender
        float height_cm
        float current_weight_kg
        int daily_calorie_goal
        jsonb preferences
        timestamp created_at
        timestamp updated_at
    }
    
    FOOD_DIARY_ENTRIES ||--|| FOODS : references
    FOOD_DIARY_ENTRIES {
        uuid id PK
        uuid user_id FK
        uuid food_id FK
        date entry_date
        string meal_type
        float serving_size
        string serving_unit
        float calories
        float protein_g
        float carbs_g
        float fat_g
        float fiber_g
        float sugar_g
        float sodium_mg
        jsonb micronutrients
        timestamp created_at
    }
    
    FOODS {
        uuid id PK
        string name
        string brand
        string barcode
        string data_source
        string external_id
        float serving_size_default
        string serving_unit_default
        float calories_per_serving
        float protein_g
        float carbs_g
        float fat_g
        float fiber_g
        float sugar_g
        float sodium_mg
        jsonb micronutrients
        jsonb allergen_info
        timestamp created_at
        timestamp updated_at
    }
    
    FAVORITE_FOODS {
        uuid id PK
        uuid user_id FK
        uuid food_id FK
        int usage_count
        timestamp last_used_at
        timestamp created_at
    }
    
    WORKOUT_ENTRIES ||--o{ WORKOUT_EXERCISES : contains
    WORKOUT_ENTRIES {
        uuid id PK
        uuid user_id FK
        uuid preset_id FK
        date workout_date
        time start_time
        time end_time
        int duration_minutes
        string workout_type
        string notes
        timestamp created_at
    }
    
    WORKOUT_EXERCISES {
        uuid id PK
        uuid workout_entry_id FK
        string exercise_name
        string category
        int sets
        int reps
        float weight_kg
        int duration_seconds
        string notes
        int order_index
    }
    
    WORKOUT_PRESETS ||--o{ PRESET_EXERCISES : contains
    WORKOUT_PRESETS {
        uuid id PK
        uuid user_id FK
        string preset_name
        string description
        string workout_type
        timestamp created_at
        timestamp updated_at
    }
    
    PRESET_EXERCISES {
        uuid id PK
        uuid preset_id FK
        string exercise_name
        string category
        int default_sets
        int default_reps
        float default_weight_kg
        int order_index
    }
    
    SYNC_QUEUE {
        uuid id PK
        uuid user_id FK
        string entity_type
        uuid entity_id
        string operation
        jsonb data
        string status
        int retry_count
        timestamp created_at
        timestamp processed_at
    }
```

### 2.5 Deployment Architecture

```mermaid
graph TB
    subgraph "CDN Layer"
        CDN[CloudFront/CDN]
    end
    
    subgraph "Application Load Balancer"
        ALB[Load Balancer]
    end
    
    subgraph "Application Tier - Auto Scaling Group"
        API1[API Server 1]
        API2[API Server 2]
        API3[API Server N]
    end
    
    subgraph "Cache Layer"
        REDIS1[Redis Primary]
        REDIS2[Redis Replica]
    end
    
    subgraph "Database Tier"
        RDS1[(PostgreSQL Primary)]
        RDS2[(PostgreSQL Read Replica)]
    end
    
    subgraph "Storage"
        S3[S3 Bucket]
    end
    
    subgraph "Monitoring"
        MON[CloudWatch/Monitoring]
        LOG[Centralized Logging]
    end
    
    CDN --> ALB
    ALB --> API1
    ALB --> API2
    ALB --> API3
    
    API1 --> REDIS1
    API2 --> REDIS1
    API3 --> REDIS1
    REDIS1 --> REDIS2
    
    API1 --> RDS1
    API2 --> RDS1
    API3 --> RDS1
    RDS1 --> RDS2
    
    API1 --> S3
    API2 --> S3
    API3 --> S3
    
    API1 --> MON
    API2 --> MON
    API3 --> MON
    
    API1 --> LOG
    API2 --> LOG
    API3 --> LOG
```

---

## 3. Component Architecture

### 3.1 Mobile Application Structure

```
keyston-mobile/
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── diary/
│   │   │   ├── FoodDiaryScreen.tsx
│   │   │   ├── AddFoodScreen.tsx
│   │   │   └── FoodDetailScreen.tsx
│   │   ├── scanner/
│   │   │   ├── FoodScannerScreen.tsx
│   │   │   └── SearchResultsScreen.tsx
│   │   ├── workout/
│   │   │   ├── WorkoutTrackerScreen.tsx
│   │   │   ├── AddWorkoutScreen.tsx
│   │   │   ├── PresetsScreen.tsx
│   │   │   └── WorkoutHistoryScreen.tsx
│   │   └── dashboard/
│   │       └── DashboardScreen.tsx
│   ├── components/
│   │   ├── common/
│   │   ├── diary/
│   │   ├── scanner/
│   │   └── workout/
│   ├── services/
│   │   ├── api/
│   │   │   ├── authService.ts
│   │   │   ├── foodService.ts
│   │   │   └── workoutService.ts
│   │   ├── storage/
│   │   │   ├── database.ts
│   │   │   └── cache.ts
│   │   └── sync/
│   │       └── syncManager.ts
│   ├── store/
│   │   ├── slices/
│   │   └── store.ts
│   ├── navigation/
│   ├── utils/
│   └── types/
```

### 3.2 Backend Service Structure

```
keyston-backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── foodDiaryController.ts
│   │   ├── foodSearchController.ts
│   │   └── workoutController.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── foodDiaryService.ts
│   │   ├── nutritionService.ts
│   │   └── workoutService.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── FoodDiaryEntry.ts
│   │   ├── Food.ts
│   │   └── WorkoutEntry.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── integrations/
│   │   ├── usda/
│   │   ├── nutritionix/
│   │   └── openFoodFacts/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── utils/
│   └── config/
```

---

## 4. Data Architecture

### 4.1 Data Storage Strategy

#### Local Storage (Mobile)
- **SQLite/Realm**: Structured data for offline access
- **AsyncStorage**: User preferences and settings
- **Cache**: API responses (LRU cache with TTL)

#### Cloud Storage
- **Primary Database**: PostgreSQL for structured data
- **Cache**: Redis for session data and API responses
- **File Storage**: S3 for user-uploaded images
- **Backup**: Automated daily backups with point-in-time recovery

### 4.2 Data Synchronization

```mermaid
stateDiagram-v2
    [*] --> LocalChange
    LocalChange --> QueuedForSync: Add to sync queue
    QueuedForSync --> Syncing: Network available
    Syncing --> Synced: Success
    Syncing --> Failed: Network error
    Failed --> QueuedForSync: Retry with backoff
    Synced --> [*]
    
    note right of Syncing
        Conflict Resolution:
        - Last-write-wins
        - Timestamps for ordering
    end note
```

**Sync Strategy**:
- **Optimistic Updates**: Apply changes locally immediately
- **Background Sync**: Queue-based synchronization
- **Conflict Resolution**: Last-write-wins with timestamp comparison
- **Retry Logic**: Exponential backoff for failed syncs

### 4.3 Caching Strategy

| Data Type | Cache Duration | Invalidation Strategy |
|-----------|---------------|----------------------|
| Food search results | 24 hours | TTL-based |
| User profile | 1 hour | On update |
| Nutrition data | 7 days | Manual refresh option |
| Recent foods | 30 days | LRU eviction |
| Workout presets | Until modified | Event-based |

---

## 5. API Design

### 5.1 API Endpoints

#### Authentication
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
```

#### User Management
```
GET    /api/v1/users/me
PUT    /api/v1/users/me
PUT    /api/v1/users/me/preferences
GET    /api/v1/users/me/stats
```

#### Food Diary
```
GET    /api/v1/diary/entries?date=YYYY-MM-DD
POST   /api/v1/diary/entries
PUT    /api/v1/diary/entries/:id
DELETE /api/v1/diary/entries/:id
GET    /api/v1/diary/summary?start=YYYY-MM-DD&end=YYYY-MM-DD
```

#### Food Search & Nutrition
```
GET    /api/v1/foods/search?q=query&limit=20&offset=0
GET    /api/v1/foods/:id
GET    /api/v1/foods/barcode/:code
GET    /api/v1/foods/favorites
POST   /api/v1/foods/favorites
DELETE /api/v1/foods/favorites/:id
GET    /api/v1/foods/recent
```

#### Workout Tracking
```
GET    /api/v1/workouts?start=YYYY-MM-DD&end=YYYY-MM-DD
POST   /api/v1/workouts
PUT    /api/v1/workouts/:id
DELETE /api/v1/workouts/:id
GET    /api/v1/workouts/:id

GET    /api/v1/workouts/presets
POST   /api/v1/workouts/presets
PUT    /api/v1/workouts/presets/:id
DELETE /api/v1/workouts/presets/:id
GET    /api/v1/workouts/stats
```

### 5.2 API Request/Response Examples

#### Search Foods
```http
GET /api/v1/foods/search?q=chicken%20breast&limit=10

Response 200 OK:
{
  "data": [
    {
      "id": "uuid-1",
      "name": "Chicken Breast, Skinless",
      "brand": "Generic",
      "servingSize": 100,
      "servingUnit": "g",
      "nutrition": {
        "calories": 165,
        "protein": 31,
        "carbs": 0,
        "fat": 3.6,
        "fiber": 0,
        "sugar": 0,
        "sodium": 74
      },
      "dataSource": "USDA"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 10,
    "offset": 0
  }
}
```

#### Add Food Diary Entry
```http
POST /api/v1/diary/entries

Request Body:
{
  "foodId": "uuid-1",
  "entryDate": "2025-11-07",
  "mealType": "lunch",
  "servingSize": 150,
  "servingUnit": "g"
}

Response 201 Created:
{
  "data": {
    "id": "entry-uuid",
    "userId": "user-uuid",
    "foodId": "uuid-1",
    "entryDate": "2025-11-07",
    "mealType": "lunch",
    "servingSize": 150,
    "servingUnit": "g",
    "nutrition": {
      "calories": 247.5,
      "protein": 46.5,
      "carbs": 0,
      "fat": 5.4
    },
    "createdAt": "2025-11-07T12:34:56Z"
  }
}
```

---

## 6. Security Architecture

### 6.1 Authentication & Authorization

**Authentication Method**: JWT (JSON Web Tokens)
- **Access Token**: Short-lived (15 minutes)
- **Refresh Token**: Long-lived (7 days), stored securely
- **Token Storage**: Secure storage (Keychain/Keystore on mobile)

**Authorization**: Role-Based Access Control (RBAC)
- Roles: User, Premium User (future), Admin
- Permissions enforced at API endpoint level

### 6.2 Security Measures

```mermaid
graph TD
    A[Security Layers]
    
    A --> B[Transport Security]
    B --> B1[TLS 1.3]
    B --> B2[Certificate Pinning]
    
    A --> C[Authentication]
    C --> C1[JWT Tokens]
    C --> C2[Secure Password Hashing - bcrypt]
    C --> C3[2FA Support - Future]
    
    A --> D[Data Protection]
    D --> D1[Encryption at Rest]
    D --> D2[Encryption in Transit]
    D --> D3[PII Encryption]
    
    A --> E[API Security]
    E --> E1[Rate Limiting]
    E --> E2[Input Validation]
    E --> E3[SQL Injection Prevention]
    E --> E4[XSS Protection]
    
    A --> F[Compliance]
    F --> F1[GDPR]
    F --> F2[CCPA]
    F --> F3[HIPAA Considerations]
```

### 6.3 Data Privacy

- **Minimal Data Collection**: Only collect necessary user data
- **Data Anonymization**: Analytics data anonymized
- **User Rights**: Data export, deletion on request
- **Privacy Policy**: Clear disclosure of data usage
- **Third-Party Sharing**: No sharing without explicit consent

### 6.4 Security Best Practices

1. **Input Validation**: All user inputs validated and sanitized
2. **Prepared Statements**: Prevent SQL injection
3. **Rate Limiting**: Prevent brute force attacks (10 requests/minute per user)
4. **Secrets Management**: Environment variables, never in code
5. **Dependency Scanning**: Regular updates for security patches
6. **Logging**: Security events logged (without sensitive data)
7. **Error Handling**: Generic error messages to users

---

## 7. Scalability & Performance

### 7.1 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time (p95) | < 500ms | Server-side |
| App Launch Time | < 3s | Cold start |
| Search Results | < 2s | End-to-end |
| Database Query Time | < 100ms | Server-side |
| Image Upload | < 5s | For 5MB file |
| Offline Sync | < 30s | For 100 entries |

### 7.2 Scaling Strategy

#### Horizontal Scaling
- **Application Tier**: Auto-scaling based on CPU/memory
- **Database**: Read replicas for query distribution
- **Cache**: Redis cluster for high availability

#### Optimization Techniques
- **Database Indexing**: Indexes on frequently queried columns
- **Query Optimization**: N+1 query prevention, batch queries
- **CDN**: Static assets served via CDN
- **Image Optimization**: Compression, multiple sizes
- **Lazy Loading**: Load data on-demand
- **Pagination**: Limit result sets

### 7.3 Monitoring & Observability

```mermaid
graph LR
    A[Application] --> B[Metrics]
    A --> C[Logs]
    A --> D[Traces]
    
    B --> E[CloudWatch/Prometheus]
    C --> F[ELK/CloudWatch Logs]
    D --> G[Jaeger/X-Ray]
    
    E --> H[Dashboards]
    F --> H
    G --> H
    
    H --> I[Alerts]
    I --> J[PagerDuty/Slack]
```

**Key Metrics**:
- Request rate, error rate, latency (RED method)
- Database connections, query performance
- Cache hit ratio
- API endpoint usage
- User session duration
- Feature adoption rates

---

## 8. Development Guidelines

### 8.1 Code Standards

**Mobile (React Native/TypeScript)**:
- ESLint + Prettier for code formatting
- TypeScript strict mode
- Component-based architecture
- React Hooks for state management
- Redux/Context API for global state

**Backend (Node.js/TypeScript)**:
- ESLint + Prettier
- TypeScript strict mode
- Clean Architecture principles
- Dependency injection
- Unit test coverage > 80%

### 8.2 Git Workflow

```
main (production)
  └── develop (integration)
      ├── feature/food-diary
      ├── feature/food-scanner
      └── feature/workout-tracker
```

- **Feature Branches**: `feature/feature-name`
- **Bug Fixes**: `bugfix/bug-description`
- **Pull Requests**: Required for all merges
- **Code Review**: Minimum 1 approval required
- **CI/CD**: Automated tests on PR

### 8.3 Testing Strategy

```mermaid
graph TB
    A[Testing Pyramid]
    
    A --> B[Unit Tests - 70%]
    B --> B1[Service Layer]
    B --> B2[Utility Functions]
    B --> B3[Components - Isolated]
    
    A --> C[Integration Tests - 20%]
    C --> C1[API Endpoints]
    C --> C2[Database Operations]
    C --> C3[Third-Party Integrations]
    
    A --> D[E2E Tests - 10%]
    D --> D1[Critical User Flows]
    D --> D2[Food Logging Flow]
    D --> D3[Workout Creation Flow]
```

**Testing Tools**:
- **Unit**: Jest, React Testing Library
- **Integration**: Supertest, Testcontainers
- **E2E**: Detox, Appium
- **Performance**: Lighthouse, K6

### 8.4 Continuous Integration/Deployment

```mermaid
graph LR
    A[Git Push] --> B[CI Pipeline]
    B --> C[Lint & Format Check]
    C --> D[Unit Tests]
    D --> E[Integration Tests]
    E --> F[Build]
    F --> G{Branch?}
    
    G -->|develop| H[Deploy to Staging]
    G -->|main| I[Deploy to Production]
    
    H --> J[E2E Tests - Staging]
    J --> K[Smoke Tests]
    
    I --> L[Blue-Green Deployment]
    L --> M[Health Check]
    M --> N[Rollback if Failed]
```

**Pipeline Stages**:
1. Code quality checks (linting, formatting)
2. Unit tests
3. Integration tests
4. Build artifacts
5. Deploy to environment
6. Run smoke tests
7. Notify team

---

## 9. Technology Stack - Final Recommendations

### Mobile Application
- **Framework**: **React Native** (cross-platform, large ecosystem)
- **Language**: TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Navigation**: React Navigation
- **Local Database**: WatermelonDB (fast, reactive)
- **Camera/Scanner**: react-native-camera + react-native-barcode-scanner

### Backend Services
- **Runtime**: **Node.js** (v18 LTS)
- **Framework**: **Express.js** with TypeScript
- **ORM**: Prisma (type-safe, excellent DX)
- **Validation**: Zod (schema validation)
- **Authentication**: Passport.js + JWT

### Database & Storage
- **Primary Database**: **PostgreSQL 15** (robust, ACID compliant)
- **Cache**: **Redis 7** (in-memory caching)
- **File Storage**: **AWS S3** or **Google Cloud Storage**
- **Search**: PostgreSQL Full-Text Search (MVP), Elasticsearch (future)

### DevOps & Infrastructure
- **Cloud Provider**: **AWS** or **Google Cloud Platform**
- **Container**: Docker
- **Orchestration**: AWS ECS or Kubernetes (if needed)
- **CI/CD**: **GitHub Actions**
- **Monitoring**: CloudWatch + Sentry
- **Analytics**: Firebase Analytics or Mixpanel

### External APIs
- **Primary Nutrition DB**: USDA FoodData Central (free, comprehensive)
- **Barcode Lookup**: Open Food Facts (free, open source)
- **Backup Nutrition DB**: Nutritionix API (paid, fallback)

---

## 10. Appendices

### 10.1 API Response Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Temporary outage |

### 10.2 Environment Configuration

```
Development:
- Local database instances
- Mock external APIs
- Verbose logging
- Hot reload enabled

Staging:
- Cloud-hosted database
- Real external APIs (test accounts)
- Standard logging
- Mirrors production

Production:
- Highly available database
- Production API keys
- Error-level logging only
- Auto-scaling enabled
```

---

*Document Version: 1.0*  
*Last Updated: November 2025*  
*Status: Draft for Review*
