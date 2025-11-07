# Keyston - Ionic Angular Mobile Application

A basic mobile application built with Ionic Framework and Angular.

## Overview

This is a cross-platform mobile application that uses:
- **Ionic Framework 8** - For mobile UI components and native functionality
- **Angular 20** - As the UI framework
- **TypeScript** - For type-safe development

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mydesignbuddy/Keyston.git
cd Keyston
```

2. Install dependencies:
```bash
npm install
```

## Development

To start a local development server:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project for production:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory.

## Testing

To execute unit tests:

```bash
npm test
```

## Project Structure

```
Keyston/
├── src/
│   ├── app/
│   │   ├── home/           # Home page component
│   │   ├── app.config.ts   # Application configuration
│   │   ├── app.routes.ts   # Application routes
│   │   ├── app.ts          # Root component
│   │   └── app.html        # Root template
│   ├── index.html          # Main HTML file
│   ├── main.ts             # Application entry point
│   └── styles.scss         # Global styles
├── angular.json            # Angular CLI configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Features

- Cross-platform mobile development (iOS, Android, Web)
- Beautiful Ionic UI components
- Angular standalone components
- Lazy loading routes
- TypeScript support
- SCSS styling

## Additional Resources

- [Ionic Documentation](https://ionicframework.com/docs)
- [Angular Documentation](https://angular.dev)
- [Ionic CLI Overview](https://ionicframework.com/docs/cli)
- [Angular CLI Reference](https://angular.dev/tools/cli)
