# Keyston Design System

## Overview

The Keyston Design System provides a comprehensive set of design tokens, components, and guidelines to ensure a consistent, accessible, and visually appealing user experience across the fitness tracking application.

**Key Principles:**
- **Privacy-First**: Visual design that reinforces user data ownership
- **Accessibility**: WCAG 2.1 AA compliant color contrast and interactions
- **Consistency**: Unified visual language across all screens
- **Fitness-Focused**: Colors and typography optimized for health data visualization

---

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Components](#components)
5. [Theme Management](#theme-management)
6. [Usage Examples](#usage-examples)

---

## Color Palette

### Brand Colors

#### Primary Blue
The main brand color representing health, fitness, and trust.

**Light Mode:**
```css
--ion-color-primary: #4A90E2;
--ion-color-primary-rgb: 74, 144, 226;
```

**Dark Mode:**
```css
--ion-color-primary: #60A5FA;
--ion-color-primary-rgb: 96, 165, 250;
```

**Usage:**
- Primary buttons
- Active navigation items
- Key interactive elements
- Focus states

#### Secondary Teal
Complementary color for accents and secondary actions.

**Light Mode:**
```css
--ion-color-secondary: #50C8B8;
--ion-color-secondary-rgb: 80, 200, 184;
```

**Dark Mode:**
```css
--ion-color-secondary: #5EEAD4;
--ion-color-secondary-rgb: 94, 234, 212;
```

**Usage:**
- Secondary buttons
- Badges
- Accent elements
- Charts and graphs

#### Tertiary Purple
Energetic color for highlights and special features.

**Light Mode:**
```css
--ion-color-tertiary: #7E57C2;
--ion-color-tertiary-rgb: 126, 87, 194;
```

**Dark Mode:**
```css
--ion-color-tertiary: #A78BFA;
--ion-color-tertiary-rgb: 167, 139, 250;
```

**Usage:**
- Premium features
- Achievements
- Highlights
- Special promotions

---

### Status Colors

#### Success Green
Positive feedback and goal achievements.

**Light Mode:** `#10B981`  
**Dark Mode:** `#34D399`

**Usage:**
- Success messages
- Goal completion indicators
- Positive trends
- Checkmarks and confirmations

#### Warning Amber
Caution and important notices.

**Light Mode:** `#F59E0B`  
**Dark Mode:** `#FBBF24`

**Usage:**
- Warning messages
- Approaching limits
- Important notifications
- Calorie warnings

#### Danger Red
Errors and critical alerts.

**Light Mode:** `#EF4444`  
**Dark Mode:** `#F87171`

**Usage:**
- Error messages
- Exceeded limits
- Delete actions
- Critical alerts

#### Info Blue
Informational content.

**Light Mode:** `#3B82F6`  
**Dark Mode:** `#60A5FA`

**Usage:**
- Info messages
- Tips and hints
- Onboarding content
- Help text

---

### Neutral Colors

#### Dark (Text)
**Light Mode:** `#1F2937`  
**Dark Mode:** `#F9FAFB`

**Usage:** Primary text, headings

#### Medium (Muted Text)
**Light Mode:** `#6B7280`  
**Dark Mode:** `#9CA3AF`

**Usage:** Secondary text, labels, icons

#### Light (Backgrounds)
**Light Mode:** `#F3F4F6`  
**Dark Mode:** `#374151`

**Usage:** Background surfaces, cards, sections

---

### Nutrition Colors

Special semantic colors for macronutrient visualization.

#### Protein (Red)
```css
--color-protein: #EF4444; /* Light */
--color-protein: #F87171; /* Dark */
```

#### Carbohydrates (Orange)
```css
--color-carbs: #F59E0B; /* Light */
--color-carbs: #FBBF24; /* Dark */
```

#### Fats (Purple)
```css
--color-fat: #8B5CF6; /* Light */
--color-fat: #A78BFA; /* Dark */
```

#### Calories (Blue)
```css
--color-calories: #3B82F6; /* Light */
--color-calories: #60A5FA; /* Dark */
```

**Usage:**
- Nutrition charts
- Progress bars
- Macro breakdowns
- Food diary displays

---

## Typography

### Font Families

**Primary Font Stack:**
```css
--font-family-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
  'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 
  'Droid Sans', 'Helvetica Neue', sans-serif;
```

**Monospace Font Stack** (for numbers, codes):
```css
--font-family-monospace: 'SF Mono', Monaco, 'Cascadia Code', 
  'Roboto Mono', Consolas, 'Courier New', monospace;
```

---

### Font Sizes

| Token | Size | Usage |
|-------|------|-------|
| `--font-size-xs` | 0.75rem (12px) | Fine print, labels |
| `--font-size-sm` | 0.875rem (14px) | Body text (small), captions |
| `--font-size-base` | 1rem (16px) | Body text (default) |
| `--font-size-lg` | 1.125rem (18px) | Large body text |
| `--font-size-xl` | 1.25rem (20px) | Small headings |
| `--font-size-2xl` | 1.5rem (24px) | Medium headings |
| `--font-size-3xl` | 1.875rem (30px) | Large headings |
| `--font-size-4xl` | 2.25rem (36px) | Hero text, stats |

**Utility Classes:**
```html
<p class="text-xs">Extra small text</p>
<p class="text-sm">Small text</p>
<p class="text-base">Base text</p>
<p class="text-lg">Large text</p>
<h2 class="text-2xl">Heading</h2>
<h1 class="text-4xl">Large Heading</h1>
```

---

### Font Weights

| Token | Weight | Usage |
|-------|--------|-------|
| `--font-weight-light` | 300 | Subtle text |
| `--font-weight-normal` | 400 | Body text |
| `--font-weight-medium` | 500 | Emphasized text |
| `--font-weight-semibold` | 600 | Headings |
| `--font-weight-bold` | 700 | Strong emphasis |

**Utility Classes:**
```html
<span class="font-light">Light text</span>
<span class="font-normal">Normal text</span>
<span class="font-medium">Medium text</span>
<span class="font-semibold">Semibold text</span>
<span class="font-bold">Bold text</span>
```

---

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `--line-height-tight` | 1.25 | Headings |
| `--line-height-normal` | 1.5 | Body text |
| `--line-height-relaxed` | 1.75 | Long-form content |

---

## Spacing & Layout

### Spacing Scale

| Token | Size | Usage |
|-------|------|-------|
| `--spacing-xs` | 0.25rem (4px) | Tiny gaps |
| `--spacing-sm` | 0.5rem (8px) | Small gaps |
| `--spacing-md` | 1rem (16px) | Default spacing |
| `--spacing-lg` | 1.5rem (24px) | Section spacing |
| `--spacing-xl` | 2rem (32px) | Large gaps |
| `--spacing-2xl` | 3rem (48px) | Major sections |

**Usage Example:**
```css
.card {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}
```

---

### Border Radius

| Token | Size | Usage |
|-------|------|-------|
| `--border-radius-sm` | 0.25rem (4px) | Small elements |
| `--border-radius-md` | 0.5rem (8px) | Buttons, cards |
| `--border-radius-lg` | 0.75rem (12px) | Large cards |
| `--border-radius-xl` | 1rem (16px) | Modal, sheets |
| `--border-radius-full` | 9999px | Circular elements |

---

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px 0 rgba(0,0,0,0.05)` | Subtle elevation |
| `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1)...` | Cards |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1)...` | Modals |
| `--shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1)...` | Dialogs |

**Usage Example:**
```css
.card {
  box-shadow: var(--shadow-md);
}

.modal {
  box-shadow: var(--shadow-xl);
}
```

---

## Components

### Ionic Component Customization

All Ionic components automatically inherit the design system tokens.

#### Buttons

```html
<!-- Primary button -->
<ion-button color="primary">Primary Action</ion-button>

<!-- Secondary button -->
<ion-button color="secondary">Secondary Action</ion-button>

<!-- Success button -->
<ion-button color="success">Complete</ion-button>

<!-- Danger button -->
<ion-button color="danger">Delete</ion-button>
```

#### Cards

```html
<ion-card>
  <ion-card-header>
    <ion-card-title class="text-xl font-semibold">
      Card Title
    </ion-card-title>
  </ion-card-header>
  <ion-card-content class="text-base">
    Card content goes here.
  </ion-card-content>
</ion-card>
```

#### Nutrition Display

```html
<div class="nutrition-stats">
  <div class="nutrition-protein">
    <strong>Protein:</strong> 150g
  </div>
  <div class="nutrition-carbs">
    <strong>Carbs:</strong> 200g
  </div>
  <div class="nutrition-fat">
    <strong>Fat:</strong> 65g
  </div>
  <div class="nutrition-calories">
    <strong>Calories:</strong> 2000
  </div>
</div>
```

**Utility Classes:**
```css
.nutrition-protein { color: var(--color-protein); }
.nutrition-carbs { color: var(--color-carbs); }
.nutrition-fat { color: var(--color-fat); }
.nutrition-calories { color: var(--color-calories); }
```

---

## Theme Management

### Theme Types

Keyston supports three theme modes:
1. **Light Mode** - Bright, high-contrast UI
2. **Dark Mode** - Dark backgrounds for low-light environments
3. **System** - Automatically follows device preference

### Changing Theme

**Using React Context:**

```typescript
import { useTheme } from './context/AppContext';

const MyComponent: React.FC = () => {
  const [theme, setTheme] = useTheme();

  return (
    <ion-select 
      value={theme} 
      onIonChange={(e) => setTheme(e.detail.value)}
    >
      <ion-select-option value="light">Light</ion-select-option>
      <ion-select-option value="dark">Dark</ion-select-option>
      <ion-select-option value="system">System</ion-select-option>
    </ion-select>
  );
};
```

### How Theme Works

1. **System Theme (Default):**
   - Uses CSS `@media (prefers-color-scheme: dark)` query
   - Automatically adapts to device settings
   - No JavaScript required

2. **Explicit Light Theme:**
   - Adds `light-theme` class to `<body>`
   - Forces light mode regardless of system preference

3. **Explicit Dark Theme:**
   - Adds `dark-theme` class to `<body>`
   - Forces dark mode regardless of system preference

### Theme Persistence

- Theme preference is stored in `localStorage` under key `keyston_ui_preferences`
- Automatically restored on app launch
- Only UI preferences stored (not health data)

---

## Usage Examples

### Page Layout Example

```typescript
import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';

const MyPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle class="text-2xl font-semibold">
              Daily Summary
            </IonCardTitle>
          </IonCardHeader>
          
          <IonCardContent>
            <div class="nutrition-stats">
              <p class="nutrition-calories text-lg font-medium">
                Calories: 1,850 / 2,000
              </p>
              <p class="nutrition-protein text-base">
                Protein: 140g / 150g
              </p>
              <p class="nutrition-carbs text-base">
                Carbs: 185g / 200g
              </p>
              <p class="nutrition-fat text-base">
                Fat: 58g / 65g
              </p>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default MyPage;
```

### Custom Component with Design Tokens

```typescript
import React from 'react';
import './MacroBar.css';

interface MacroBarProps {
  label: string;
  current: number;
  goal: number;
  type: 'protein' | 'carbs' | 'fat' | 'calories';
}

const MacroBar: React.FC<MacroBarProps> = ({ label, current, goal, type }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <div className="macro-bar">
      <div className="macro-bar-header">
        <span className={`text-sm font-medium nutrition-${type}`}>
          {label}
        </span>
        <span className="text-sm font-semibold">
          {current}g / {goal}g
        </span>
      </div>
      <div className="macro-bar-track">
        <div 
          className={`macro-bar-fill bg-${type}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default MacroBar;
```

**CSS File (MacroBar.css):**
```css
.macro-bar {
  margin-bottom: var(--spacing-md);
}

.macro-bar-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
}

.macro-bar-track {
  height: 8px;
  background-color: var(--ion-color-light);
  border-radius: var(--border-radius-full);
  overflow: hidden;
}

.macro-bar-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: var(--border-radius-full);
}
```

---

## Accessibility

### Color Contrast

All color combinations meet **WCAG 2.1 AA** standards:
- Normal text: minimum 4.5:1 contrast ratio
- Large text (18px+): minimum 3:1 contrast ratio
- UI components: minimum 3:1 contrast ratio

### Focus States

All interactive elements have visible focus indicators using:
```css
:focus {
  outline: 2px solid var(--ion-color-primary);
  outline-offset: 2px;
}
```

### Touch Targets

All interactive elements meet minimum touch target size:
- Buttons: 44x44px minimum
- Icons: 44x44px tap area
- List items: 48px minimum height

---

## Best Practices

### Do's ✅

- Use design tokens instead of hardcoded values
- Leverage utility classes for common patterns
- Test in both light and dark modes
- Ensure sufficient color contrast
- Use semantic color names (e.g., `success`, `danger`)

### Don'ts ❌

- Don't use hardcoded hex colors in components
- Don't create custom shadows without tokens
- Don't ignore color contrast requirements
- Don't use inline styles for design system values
- Don't override Ionic component styles unnecessarily

---

## Resources

- **Ionic Theming Docs:** https://ionicframework.com/docs/theming/
- **CSS Variables Reference:** `/src/theme/variables.css`
- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **Color Contrast Checker:** https://webaim.org/resources/contrastchecker/

---

## Changelog

### Version 1.0.0 (Sprint 0)
- Initial design system implementation
- Defined color palette (light + dark modes)
- Typography scale with utility classes
- Spacing and layout tokens
- Nutrition-specific semantic colors
- Theme management system
- Comprehensive documentation

---

**Maintained by:** Keyston Development Team  
**Last Updated:** January 2025  
**Status:** ✅ Production Ready
