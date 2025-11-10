# Keyston - Privacy-First Fitness & Health Tracker

> A comprehensive mobile fitness and health application focused on nutrition tracking and workout management with complete user privacy.

[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-green.svg)](https://ionicframework.com)
[![Framework](https://img.shields.io/badge/Framework-Ionic%20%2B%20React-blue.svg)](https://ionicframework.com/react)

---

## 🎯 Project Vision

Keyston empowers users to achieve their health and fitness goals through intuitive tracking, comprehensive nutritional data, and personalized workout management—**all while maintaining complete privacy**. Your data stays on your device, with optional encrypted cloud backup under your control.

### Key Differentiators
- **🔒 Privacy-First**: No backend servers, no user accounts, all data stays on your device
- **📱 Offline-First**: Full functionality without internet connection
- **🔐 User Data Ownership**: Optional encrypted backup to your Google Drive
- **🚫 Zero Tracking**: No analytics, no telemetry, no data collection

---

## ✨ Features

### 📖 Food Diary
- **Daily Meal Tracking**: Log meals by time period (Breakfast, Lunch, Dinner, Snacks)
- **Nutritional Dashboard**: Track calories, macros (Protein, Carbs, Fat), and micronutrients
- **Weekly Trends**: Visualize your nutrition patterns over time
- **Goal Setting**: Set and monitor daily calorie and macro targets
- **Custom Foods**: Add foods with manual nutritional values

### 🔍 Food Search & Scanner
- **Multi-Database Search**: Search across USDA FoodData Central and Open Food Facts
- **Barcode Scanner**: Instantly log packaged foods via UPC/EAN scanning
- **Favorites & Recent**: Quick access to frequently logged items
- **Autocomplete**: Fast food search with intelligent suggestions

### 💪 Workout Tracker
- **Manual Workout Logging**: Record exercises with sets, reps, and weight
- **Preset Library**: Quick workout creation with common exercise templates
- **Progress Tracking**: Monitor strength gains and workout history
- **Cardio Support**: Log duration-based activities (running, cycling, etc.)

---

## 🏗️ Architecture

### System Design - Privacy-First

```
┌─────────────────────────────────────────────────┐
│         Ionic + React Mobile App                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Food    │  │  Scanner │  │ Workout  │     │
│  │  Diary   │  │          │  │ Tracker  │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │     IndexedDB (Local Storage)            │  │
│  │     - All user data stored locally       │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                    │
                    ├─────► USDA FoodData Central (Direct API)
                    ├─────► Open Food Facts (Direct API)
                    └─────► Google Drive (Optional Encrypted Backup)
```

**No Backend**: All data processing happens on-device. No servers, no databases, no infrastructure.

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Ionic + React | Cross-platform mobile development |
| **Language** | TypeScript | Type-safe development |
| **State Management** | React Context/Zustand | Lightweight state management |
| **Local Storage** | IndexedDB | Persistent offline-first data storage |
| **Native Features** | Capacitor | Camera, filesystem, cloud storage access |
| **UI Components** | Ionic Components | Native-looking cross-platform UI |
| **Charts** | Recharts/Chart.js | Data visualization |
| **Nutrition APIs** | USDA FoodData Central, Open Food Facts | Food database integration |

---

## 📋 Development Roadmap

### Timeline: 14-Week MVP Development

| Sprint | Duration | Focus | Key Deliverables |
|--------|----------|-------|------------------|
| **Sprint 0** | Week 1-2 | Project Setup | Ionic project, navigation, state management |
| **Sprint 0.5** | Week 3 | Design & Planning | UI mockups, branding, design system |
| **Sprint 1** | Week 4-5 | Food Diary Core | Daily logging, nutrition display, data models |
| **Sprint 2** | Week 6 | Food Diary Enhancement | Weekly trends, goal setting, charts |
| **Sprint 3** | Week 7-8 | Food Search | Database integration, search UI, caching |
| **Sprint 4** | Week 9 | Barcode Scanner | Camera integration, UPC lookup |
| **Sprint 5** | Week 10-11 | Workout Tracker | Exercise logging, presets, history |
| **Sprint 6** | Week 12-13 | Integration & Testing | End-to-end testing, optimization |
| **Sprint 7** | Week 14 | Polish & Launch Prep | Final touches, app store prep |

See [DEVELOPMENT_ROADMAP.md](project/DEVELOPMENT_ROADMAP.md) for detailed sprint breakdown.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Ionic CLI: `npm install -g @ionic/cli`
- For iOS development: Xcode 14+
- For Android development: Android Studio with SDK 33+

### Installation

```bash
# Clone the repository
git clone https://github.com/mydesignbuddy/Keyston.git
cd Keyston

# Install dependencies
npm install

# Run on web browser (development)
ionic serve

# Run on iOS simulator
ionic capacitor run ios

# Run on Android emulator
ionic capacitor run android
```

### Building for Production

```bash
# Build web assets
ionic build --prod

# Sync with native platforms
ionic capacitor sync

# Open in platform IDE for final build
ionic capacitor open ios
ionic capacitor open android
```

---

## 📁 Project Structure

```
Keyston/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Screen-level components
│   ├── services/         # Business logic & API integration
│   ├── models/           # TypeScript interfaces & types
│   ├── context/          # React Context providers
│   ├── utils/            # Helper functions
│   └── theme/            # Ionic theme customization
├── capacitor.config.ts   # Capacitor configuration
├── ionic.config.json     # Ionic configuration
└── project/              # Documentation
    ├── MVP_PROPOSAL.md
    ├── ARCHITECTURE.md
    ├── TECHNOLOGY_STACK.md
    ├── FEATURE_SPECIFICATIONS.md
    └── DEVELOPMENT_ROADMAP.md
```

---

## 🔒 Privacy & Security

### Our Privacy Commitments

1. **No User Accounts**: No registration, no passwords, no authentication servers
2. **No Data Collection**: We don't collect, store, or transmit your data
3. **No Analytics**: Zero tracking or telemetry
4. **Local Storage**: All data stored in IndexedDB on your device
5. **Encrypted Backups**: Optional Google Drive backup uses client-side encryption
6. **No Third-Party Cookies**: Only essential API calls to nutrition databases
7. **Open Source**: Code is transparent and auditable

### Data Storage

- **Local**: IndexedDB (browser storage, never leaves device)
- **Backup** (Optional): Encrypted JSON in user's Google Drive
- **Cloud**: Only nutrition API lookups (USDA, Open Food Facts)

---

## 📄 Documentation

- [MVP Proposal](project/MVP_PROPOSAL.md) - Feature specifications and requirements
- [Architecture Guide](project/ARCHITECTURE.md) - Technical architecture and design patterns
- [Technology Stack](project/TECHNOLOGY_STACK.md) - Framework comparisons and technology decisions
- [Development Roadmap](project/DEVELOPMENT_ROADMAP.md) - Sprint planning and timeline
- [Feature Specifications](project/FEATURE_SPECIFICATIONS.md) - Detailed feature requirements

---

## 🤝 Contributing

Contributions are welcome! This is an open-source, privacy-focused project.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Nutrition Data**: USDA FoodData Central, Open Food Facts
- **Framework**: Ionic Team for the amazing cross-platform framework
- **Community**: React and Ionic community for excellent documentation and support

---

## 📧 Contact

**Project Maintainer**: mydesignbuddy  
**Repository**: [github.com/mydesignbuddy/Keyston](https://github.com/mydesignbuddy/Keyston)

---

<div align="center">

**Built with ❤️ and a commitment to user privacy**

[Report Bug](https://github.com/mydesignbuddy/Keyston/issues) · [Request Feature](https://github.com/mydesignbuddy/Keyston/issues)

</div>