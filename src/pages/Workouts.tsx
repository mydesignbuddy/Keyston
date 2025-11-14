import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/react';
import { barbell, time, flame, trendingUp, add, play, checkmarkCircle } from 'ionicons/icons';
import KeystonCard from '../components/KeystonCard';
import KeystonButton from '../components/KeystonButton';
import '../components/KeystonComponents.css';

const Workouts: React.FC = () => {
  const workoutStats = [
    {
      label: 'This Week',
      value: '3',
      unit: 'workouts',
      icon: barbell,
      color: 'var(--ion-color-primary)',
    },
    {
      label: 'Total Time',
      value: '2.5',
      unit: 'hours',
      icon: time,
      color: 'var(--ion-color-secondary)',
    },
    {
      label: 'Calories Burned',
      value: '847',
      unit: 'kcal',
      icon: flame,
      color: 'var(--ion-color-tertiary)',
    },
  ];

  const workoutTemplates = [
    {
      name: 'Upper Body Strength',
      duration: '45 min',
      exercises: 8,
      difficulty: 'Intermediate',
      color: 'var(--ion-color-primary)',
    },
    {
      name: 'Cardio HIIT',
      duration: '30 min',
      exercises: 6,
      difficulty: 'Advanced',
      color: 'var(--ion-color-tertiary)',
    },
    {
      name: 'Leg Day',
      duration: '50 min',
      exercises: 10,
      difficulty: 'Intermediate',
      color: 'var(--ion-color-secondary)',
    },
  ];

  const recentWorkouts = [
    {
      name: 'Morning Run',
      type: 'Cardio',
      duration: '45 min',
      calories: 380,
      date: 'Today',
      completed: true,
    },
    {
      name: 'Upper Body Strength',
      type: 'Strength',
      duration: '40 min',
      calories: 245,
      date: 'Yesterday',
      completed: true,
    },
    {
      name: 'Yoga Flow',
      type: 'Flexibility',
      duration: '30 min',
      calories: 122,
      date: '2 days ago',
      completed: true,
    },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Workouts</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Workouts</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="workouts-container">
          {/* Header */}
          <div className="mb-6">
            <h1 style={{ marginBottom: '4px', fontSize: '28px', fontWeight: '600' }}>
              Workout Tracker
            </h1>
            <p className="text-secondary" style={{ fontSize: '14px', margin: 0 }}>
              Log and track your workouts
            </p>
          </div>

          {/* Quick Stats */}
          <KeystonCard className="mb-6" elevated>
            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
              This Week's Progress
            </h3>
            <div className="grid-cols-3" style={{ textAlign: 'center' }}>
              {workoutStats.map((stat) => (
                <div key={stat.label}>
                  <div
                    className="icon-badge"
                    style={{
                      backgroundColor: `${stat.color}33`,
                      width: '48px',
                      height: '48px',
                      margin: '0 auto 8px',
                    }}
                  >
                    <IonIcon icon={stat.icon} style={{ color: stat.color, fontSize: '24px' }} />
                  </div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '600' }}>
                    {stat.value}
                  </p>
                  <p className="text-secondary" style={{ fontSize: '14px', margin: '0 0 4px 0' }}>
                    {stat.unit}
                  </p>
                  <p className="text-tertiary" style={{ fontSize: '12px', margin: 0 }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </KeystonCard>

          {/* Quick Start */}
          <KeystonButton variant="primary" fullWidth size="lg" className="mb-6">
            <IonIcon icon={play} />
            Start Quick Workout
          </KeystonButton>

          {/* Workout Templates */}
          <div className="mb-6">
            <div className="flex-between mb-3">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Workout Templates</h3>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--ion-color-primary)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                View All
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {workoutTemplates.map((template, idx) => (
                <KeystonCard key={idx} style={{ cursor: 'pointer' }}>
                  <div className="flex-between">
                    <div
                      className="icon-badge"
                      style={{
                        backgroundColor: `${template.color}33`,
                        width: '48px',
                        height: '48px',
                        flexShrink: 0,
                      }}
                    >
                      <IonIcon icon={barbell} style={{ color: template.color, fontSize: '24px' }} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0, marginLeft: '16px' }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
                        {template.name}
                      </h4>
                      <p className="text-secondary" style={{ fontSize: '14px', margin: 0 }}>
                        {template.exercises} exercises • {template.duration}
                      </p>
                    </div>

                    <div style={{ flexShrink: 0 }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--ion-color-light)',
                          fontSize: '14px',
                          color: 'var(--ion-color-medium)',
                        }}
                      >
                        {template.difficulty}
                      </span>
                    </div>
                  </div>
                </KeystonCard>
              ))}
            </div>
          </div>

          {/* Create Custom Workout */}
          <KeystonCard
            className="mb-6"
            style={{
              border: '2px dashed var(--ion-color-medium)',
              cursor: 'pointer',
              backgroundColor: 'transparent',
            }}
          >
            <div className="flex-center gap-3" style={{ padding: '16px 0' }}>
              <div className="icon-badge-primary" style={{ padding: '8px', borderRadius: '8px' }}>
                <IonIcon icon={add} style={{ fontSize: '20px' }} />
              </div>
              <p style={{ margin: 0, fontSize: '16px' }}>Create Custom Workout</p>
            </div>
          </KeystonCard>

          {/* Recent Workouts */}
          <div>
            <div className="flex-between mb-3">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Recent Workouts</h3>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--ion-color-primary)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                View History
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentWorkouts.map((workout, idx) => (
                <KeystonCard key={idx}>
                  <div className="flex-between">
                    <div
                      className="icon-badge-success"
                      style={{ padding: '12px', borderRadius: '12px' }}
                    >
                      <IonIcon icon={checkmarkCircle} style={{ fontSize: '20px' }} />
                    </div>

                    <div style={{ flex: 1, marginLeft: '16px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '4px',
                        }}
                      >
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                          {workout.name}
                        </h4>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--ion-color-light)',
                            fontSize: '12px',
                            color: 'var(--ion-color-medium)',
                          }}
                        >
                          {workout.type}
                        </span>
                      </div>
                      <p className="text-secondary" style={{ fontSize: '14px', margin: 0 }}>
                        {workout.duration} • {workout.calories} cal burned
                      </p>
                    </div>

                    <p
                      className="text-tertiary"
                      style={{ fontSize: '14px', margin: 0, flexShrink: 0 }}
                    >
                      {workout.date}
                    </p>
                  </div>
                </KeystonCard>
              ))}
            </div>
          </div>

          {/* Motivational Card */}
          <KeystonCard className="gradient-card-tertiary mt-6">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <IonIcon icon={trendingUp} style={{ fontSize: '24px', color: 'white' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: '0 0 4px 0',
                    color: 'white',
                    fontSize: '15px',
                    fontWeight: '600',
                  }}
                >
                  You're on fire! 🔥
                </p>
                <p style={{ margin: 0, color: 'white', fontSize: '14px', opacity: 0.9 }}>
                  3 workouts this week. Keep up the great work!
                </p>
              </div>
            </div>
          </KeystonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Workouts;
