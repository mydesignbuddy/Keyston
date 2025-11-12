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

const FoodDiary: React.FC = () => {
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
