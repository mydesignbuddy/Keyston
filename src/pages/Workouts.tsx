import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
} from '@ionic/react';

const Workouts: React.FC = () => {
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

        <div className="ion-padding">
          <h2>Workout Tracker</h2>
          <p>Log your exercises and track your fitness progress.</p>

          <IonCard>
            <IonCardContent>
              <p>Workout tracking features coming soon:</p>
              <ul>
                <li>Exercise logging</li>
                <li>Workout presets</li>
                <li>Progress tracking</li>
                <li>Cardio activities</li>
              </ul>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Workouts;
