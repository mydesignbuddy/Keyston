import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/react';
import { flame, nutrition, footsteps, water, restaurant, barbell, trophy } from 'ionicons/icons';
import { useApp } from '../hooks/useAppContext';
import KeystonCard from '../components/KeystonCard';
import '../components/KeystonComponents.css';
import './Home.css';

const Home: React.FC = () => {
  const { state } = useApp();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Mock data for daily stats
  const stats = [
    {
      label: 'Calories',
      value: '1,847',
      goal: '2,200',
      icon: flame,
      color: 'var(--color-calories)',
      progress: 84,
    },
    {
      label: 'Protein',
      value: '98g',
      goal: '120g',
      icon: nutrition,
      color: 'var(--color-protein)',
      progress: 82,
    },
    {
      label: 'Steps',
      value: '8,432',
      goal: '10,000',
      icon: footsteps,
      color: 'var(--ion-color-secondary)',
      progress: 84,
    },
    {
      label: 'Water',
      value: '6',
      goal: '8 cups',
      icon: water,
      color: 'var(--ion-color-info)',
      progress: 75,
    },
  ];

  const quickActions = [
    { label: 'Log Food', icon: restaurant, color: 'var(--ion-color-success)' },
    { label: 'Start Workout', icon: barbell, color: 'var(--ion-color-tertiary)' },
    { label: 'Set Goal', icon: trophy, color: 'var(--ion-color-primary)' },
  ];

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

        <div className="home-container">
          {/* Header */}
          <div className="mb-6">
            <h1 style={{ marginBottom: '4px', fontSize: '28px', fontWeight: '600' }}>
              Welcome back!
            </h1>
            <p className="text-secondary" style={{ fontSize: '14px', margin: 0 }}>
              {today}
            </p>
          </div>

          {/* Daily Summary Card */}
          <KeystonCard className="mb-6" elevated>
            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
              Today's Progress
            </h3>
            <div className="grid-cols-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  <div className="flex-between">
                    <div className="icon-badge" style={{ backgroundColor: `${stat.color}33` }}>
                      <IonIcon icon={stat.icon} style={{ color: stat.color, fontSize: '20px' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, marginLeft: '8px' }}>
                      <p
                        className="text-secondary"
                        style={{ fontSize: '12px', margin: '0 0 2px 0' }}
                      >
                        {stat.label}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
                          {stat.value}
                        </p>
                        <p className="text-tertiary" style={{ fontSize: '11px', margin: 0 }}>
                          / {stat.goal}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${stat.progress}%`,
                        backgroundColor: stat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </KeystonCard>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>
              Quick Actions
            </h3>
            <div className="grid-cols-3">
              {quickActions.map((action) => (
                <KeystonCard
                  key={action.label}
                  className="flex-center"
                  style={{
                    flexDirection: 'column',
                    gap: '12px',
                    padding: '20px 8px',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    className="icon-badge"
                    style={{ backgroundColor: `${action.color}33`, padding: '12px' }}
                  >
                    <IonIcon icon={action.icon} style={{ color: action.color, fontSize: '24px' }} />
                  </div>
                  <p style={{ fontSize: '14px', textAlign: 'center', margin: 0 }}>{action.label}</p>
                </KeystonCard>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-6">
            <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>
              Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <KeystonCard>
                <div className="flex-between">
                  <div
                    className="icon-badge-success"
                    style={{ padding: '12px', borderRadius: '12px' }}
                  >
                    <IonIcon icon={restaurant} style={{ fontSize: '20px' }} />
                  </div>
                  <div style={{ flex: 1, marginLeft: '16px' }}>
                    <p style={{ fontSize: '16px', fontWeight: '500', margin: '0 0 4px 0' }}>
                      Grilled Chicken Salad
                    </p>
                    <p className="text-secondary" style={{ fontSize: '14px', margin: 0 }}>
                      Lunch • 452 cal
                    </p>
                  </div>
                  <p className="text-tertiary" style={{ fontSize: '14px', margin: 0 }}>
                    2h ago
                  </p>
                </div>
              </KeystonCard>

              <KeystonCard>
                <div className="flex-between">
                  <div
                    className="icon-badge-tertiary"
                    style={{ padding: '12px', borderRadius: '12px' }}
                  >
                    <IonIcon icon={barbell} style={{ fontSize: '20px' }} />
                  </div>
                  <div style={{ flex: 1, marginLeft: '16px' }}>
                    <p style={{ fontSize: '16px', fontWeight: '500', margin: '0 0 4px 0' }}>
                      Morning Run
                    </p>
                    <p className="text-secondary" style={{ fontSize: '14px', margin: 0 }}>
                      Cardio • 45 min
                    </p>
                  </div>
                  <p className="text-tertiary" style={{ fontSize: '14px', margin: 0 }}>
                    5h ago
                  </p>
                </div>
              </KeystonCard>
            </div>
          </div>

          {/* Motivational Message */}
          <KeystonCard className="gradient-card">
            <p style={{ margin: 0, textAlign: 'center', fontSize: '15px' }}>
              🎉 You're 84% to your daily goal! Keep going!
            </p>
          </KeystonCard>

          {/* State Management Demo (keeping for testing) */}
          <KeystonCard className="mt-6">
            <h4 style={{ marginTop: 0, marginBottom: '12px', fontSize: '16px' }}>
              🎨 State Management Demo
            </h4>
            <p style={{ fontSize: '14px', marginBottom: '8px' }}>
              Current Theme: <strong>{state.theme}</strong>
            </p>
            <p style={{ fontSize: '14px', marginBottom: '16px' }}>
              Daily Calorie Goal: <strong>{state.dailyGoals.calories}</strong>
            </p>
            <p className="text-secondary" style={{ fontSize: '13px', marginBottom: '16px' }}>
              State persists across navigation. Try changing tabs and coming back!
            </p>
          </KeystonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
