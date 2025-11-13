import React from 'react';
import { IonSelect, IonSelectOption, IonLabel, IonItem } from '@ionic/react';
import { useTheme } from '../context/AppContext';

/**
 * ThemeToggle Component
 *
 * A simple dropdown to switch between light, dark, and system themes.
 * Uses the design system theme management from AppContext.
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useTheme();

  return (
    <IonItem>
      <IonLabel>Theme</IonLabel>
      <IonSelect value={theme} onIonChange={(e) => setTheme(e.detail.value)} interface="popover">
        <IonSelectOption value="light">Light</IonSelectOption>
        <IonSelectOption value="dark">Dark</IonSelectOption>
        <IonSelectOption value="system">System</IonSelectOption>
      </IonSelect>
    </IonItem>
  );
};

export default ThemeToggle;
