import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { heart, fitness, restaurant } from 'ionicons/icons';
import { useApp } from '../hooks/useAppContext';
import './Home.css';

const Home: React.FC = () => {
  const { state, setTheme } = useApp();

  const handleThemeToggle = () => {
    const nextTheme =
      state.theme === 'light' ? 'dark' : state.theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Keyston</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Keyston</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="welcome-container">
          <h1>🔒 Privacy-First Fitness Tracker</h1>
          <p>
            Welcome to Keyston - Your health data stays on your device, completely private and
            secure.
          </p>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={restaurant} /> Food Diary
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              Track your meals and nutrition with detailed macro and micronutrient data.
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={fitness} /> Workout Tracker
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              Log your workouts, track progress, and manage exercise presets.
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={heart} /> Privacy First
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              All data stored locally. No user accounts, no tracking, complete privacy.
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>🎨 State Management Demo</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>
                Current Theme: <strong>{state.theme}</strong>
              </p>
              <p>
                Daily Calorie Goal: <strong>{state.dailyGoals.calories}</strong>
              </p>
              <p style={{ fontSize: '0.9em', color: 'var(--ion-color-medium)' }}>
                State persists across navigation. Try changing tabs and coming back!
              </p>
              <IonButton expand="block" onClick={handleThemeToggle}>
                Toggle Theme (Current: {state.theme})
              </IonButton>
            </IonCardContent>
          </IonCard>

          <div className="button-container">
            <IonButton expand="block">Get Started</IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
