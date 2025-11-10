# Keyston - Development Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **Ionic CLI**: `npm install -g @ionic/cli`
- **For iOS development**: Xcode 14+ (macOS only)
- **For Android development**: Android Studio with SDK 33+

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mydesignbuddy/Keyston.git
   cd Keyston
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Development

### Web Development (Browser)

Run the development server:
```bash
npm start
```
The app will open at `http://localhost:3000`

### Building for Production

Build the web assets:
```bash
npm run build
```

### Linting and Formatting

Run ESLint:
```bash
npm run lint
```

Fix linting issues automatically:
```bash
npm run lint:fix
```

Format code with Prettier:
```bash
npm run format
```

Check formatting without changes:
```bash
npm run format:check
```

### Testing

Run tests:
```bash
npm test
```

Run tests in CI mode:
```bash
CI=true npm test
```

## Capacitor Native Development

### Sync with Native Platforms

After building, sync with iOS and Android:
```bash
npm run cap:sync
```

This will:
1. Build the web assets
2. Copy them to iOS and Android projects
3. Update native dependencies

### iOS Development

1. **Open iOS project in Xcode**:
   ```bash
   npm run cap:ios
   ```

2. **Run on iOS Simulator**:
   - In Xcode, select a simulator from the device dropdown
   - Press the Run button (▶) or press `Cmd + R`

3. **Run on iOS Device**:
   - Connect your iOS device via USB
   - Select your device from the device dropdown
   - Configure signing in Xcode (Signing & Capabilities tab)
   - Press the Run button (▶) or press `Cmd + R`

### Android Development

1. **Open Android project in Android Studio**:
   ```bash
   npm run cap:android
   ```

2. **Run on Android Emulator**:
   - In Android Studio, click the device dropdown
   - Select or create an AVD (Android Virtual Device)
   - Click the Run button (▶)

3. **Run on Android Device**:
   - Enable Developer Options on your Android device
   - Enable USB Debugging
   - Connect your device via USB
   - Select your device from the device dropdown
   - Click the Run button (▶)

## Project Structure

```
Keyston/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Screen-level components (Home, FoodDiary, etc.)
│   ├── services/         # Business logic & API integration
│   ├── models/           # TypeScript interfaces & types
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Helper functions
│   └── theme/            # Ionic theme customization
├── public/               # Static assets
├── android/              # Android native project (Capacitor)
├── ios/                  # iOS native project (Capacitor)
├── capacitor.config.ts   # Capacitor configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .eslintrc.json        # ESLint configuration
└── .prettierrc.json      # Prettier configuration
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server on port 3000 |
| `npm run build` | Build production-ready web assets |
| `npm test` | Run tests in watch mode |
| `npm run lint` | Check code for linting issues |
| `npm run lint:fix` | Fix linting issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check if code is formatted |
| `npm run cap:sync` | Build and sync with native platforms |
| `npm run cap:ios` | Open iOS project in Xcode |
| `npm run cap:android` | Open Android project in Android Studio |

## Code Quality

This project uses:
- **ESLint** for code quality and consistency
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Jest** for unit testing
- **React Testing Library** for component testing

## Troubleshooting

### iOS Build Issues

**CocoaPods not installed**:
```bash
sudo gem install cocoapods
cd ios/App
pod install
```

**Xcode command line tools not found**:
```bash
xcode-select --install
```

### Android Build Issues

**SDK not found**:
- Open Android Studio
- Go to Preferences → Appearance & Behavior → System Settings → Android SDK
- Install the required SDK version (API 33+)

**Gradle build fails**:
```bash
cd android
./gradlew clean
cd ..
npm run cap:sync
```

### Port Already in Use

If port 3000 is already in use:
```bash
# Kill process using port 3000
npx kill-port 3000
# Or specify a different port
PORT=3001 npm start
```

## Privacy-First Architecture

This project follows a **privacy-first, offline-first** architecture:

- ✅ **No Backend Servers**: All logic runs client-side
- ✅ **No User Accounts**: No authentication required
- ✅ **Local Storage Only**: All data stored in IndexedDB
- ✅ **Offline-First**: App works without internet
- ✅ **Optional Encrypted Backup**: User-controlled Google Drive sync

## Contributing

1. Follow the existing code style (enforced by ESLint and Prettier)
2. Write tests for new features
3. Run linting and tests before committing
4. Keep commits focused and write clear commit messages

## Support

For issues and questions:
- GitHub Issues: [github.com/mydesignbuddy/Keyston/issues](https://github.com/mydesignbuddy/Keyston/issues)
- Documentation: See `/project` directory for detailed specs

## License

Copyright © 2025 Buddy Toups, Jr. All Rights Reserved.

See [LICENSE](LICENSE) file for details.
