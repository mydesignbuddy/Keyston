
# Keyston Ionic Implementation Guidelines

## General Guidelines
- Use Ionic React components for all UI (IonButton, IonCard, IonInput, IonToolbar, IonModal, etc).
- Use Figma mockups as visual design intent only; all layouts and structure must be implemented using Ionic components and utilities from the start.
- Use Keyston theme colors:
  - Primary: #504ae2
  - Secondary: #4a90e2
  - Tertiary: #e29c4a
- Support both light and dark themes using Ionic’s CSS variables and theming system.
- Avoid custom CSS unless necessary; use Ionic’s utility classes and variables.
- Ensure accessibility: proper color contrast, ARIA labels, and large touch targets.
- No user authentication, analytics, or external tracking.

## Design System Guidelines

### Components
- Use Ionic components for all interactive elements (buttons, inputs, cards, lists, modals, tabs, toolbars).
- When implementing Figma mockups, match the visual style closely but use Ionic’s props, slots, and theming.
- For custom elements, extend Ionic components rather than building from scratch.

### Buttons
- Use `IonButton` for all button actions.
- Primary button: filled, uses `color="primary"` (#504ae2).
- Secondary button: outlined, uses `color="secondary"` (#4a90e2).
- Tertiary button: text-only, uses `color="tertiary"` (#e29c4a).
- Only one primary button per section/page.
- Use clear, action-oriented labels.

### Layout
- Use `IonGrid`, `IonRow`, and `IonCol` for responsive layouts.
- Avoid absolute positioning; use flexbox/grid for alignment.
- Match Figma spacing and sizing using Ionic’s spacing utilities and CSS variables.

### Theming
- Use Ionic’s CSS variables for colors, backgrounds, and typography.
- Implement both light and dark theme variants for all screens and components.
- Test theme switching for visual consistency.

### Accessibility
- All components must meet WCAG AA contrast standards.
- Use semantic HTML and ARIA attributes.
- Ensure keyboard navigation and screen reader support.
