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
  IonItem,
  IonLabel,
} from '@ionic/react';
import { useCurrentDate, useDailyGoals } from '../hooks/useAppContext';

const FoodDiary: React.FC = () => {
  const [currentDate] = useCurrentDate();
  const [goals] = useDailyGoals();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Food Diary</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Food Diary</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="ion-padding">
          <h2>Daily Nutrition Tracking</h2>
          <p>Track your meals and monitor your nutritional goals.</p>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Current Date</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>
                <strong>{currentDate.toLocaleDateString()}</strong>
              </p>
              <p style={{ fontSize: '0.9em', color: 'var(--ion-color-medium)' }}>
                Date is managed by global state and persists across navigation
              </p>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Your Daily Goals</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel>Calories</IonLabel>
                <IonLabel slot="end">
                  <strong>{goals.calories} kcal</strong>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Protein</IonLabel>
                <IonLabel slot="end">
                  <strong>{goals.protein}g</strong>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Carbs</IonLabel>
                <IonLabel slot="end">
                  <strong>{goals.carbs}g</strong>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Fat</IonLabel>
                <IonLabel slot="end">
                  <strong>{goals.fat}g</strong>
                </IonLabel>
              </IonItem>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardContent>
              <p>Food diary features coming soon:</p>
              <ul>
                <li>Daily meal logging</li>
                <li>Nutritional dashboard</li>
                <li>Macro tracking</li>
                <li>Calorie goals</li>
              </ul>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FoodDiary;
