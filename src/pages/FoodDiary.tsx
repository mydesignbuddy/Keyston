import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/react';
import { add, cafe, sunny, moon, ellipsisVertical } from 'ionicons/icons';
import { useCurrentDate, useDailyGoals } from '../hooks/useAppContext';
import KeystonCard from '../components/KeystonCard';
import KeystonButton from '../components/KeystonButton';
import '../components/KeystonComponents.css';

const FoodDiary: React.FC = () => {
  const [currentDate] = useCurrentDate();
  const [goals] = useDailyGoals();

  const selectedDate = currentDate;

  // Mock meal data
  const mealData = [
    {
      meal: 'Breakfast',
      icon: cafe,
      time: '8:30 AM',
      color: 'var(--ion-color-tertiary)',
      items: [
        { name: 'Oatmeal with Berries', calories: 280, protein: 8, carbs: 54, fat: 4 },
        { name: 'Greek Yogurt', calories: 130, protein: 15, carbs: 9, fat: 3 },
      ],
    },
    {
      meal: 'Lunch',
      icon: sunny,
      time: '12:30 PM',
      color: 'var(--ion-color-secondary)',
      items: [
        { name: 'Grilled Chicken Salad', calories: 452, protein: 42, carbs: 28, fat: 18 },
        { name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0 },
      ],
    },
    {
      meal: 'Snack',
      icon: cafe,
      time: '3:45 PM',
      color: 'var(--ion-color-success)',
      items: [{ name: 'Protein Bar', calories: 200, protein: 20, carbs: 24, fat: 6 }],
    },
    {
      meal: 'Dinner',
      icon: moon,
      time: 'Not logged',
      color: 'var(--ion-color-primary)',
      items: [],
    },
  ];

  const totalCalories = mealData.reduce(
    (sum, meal) => sum + meal.items.reduce((mealSum, item) => mealSum + item.calories, 0),
    0
  );
  const totalProtein = mealData.reduce(
    (sum, meal) => sum + meal.items.reduce((mealSum, item) => mealSum + item.protein, 0),
    0
  );
  const totalCarbs = mealData.reduce(
    (sum, meal) => sum + meal.items.reduce((mealSum, item) => mealSum + item.carbs, 0),
    0
  );
  const totalFat = mealData.reduce(
    (sum, meal) => sum + meal.items.reduce((mealSum, item) => mealSum + item.fat, 0),
    0
  );

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

        <div className="food-diary-container">
          {/* Header */}
          <div className="mb-6">
            <h1 style={{ marginBottom: '4px', fontSize: '28px', fontWeight: '600' }}>Food Diary</h1>
            <p className="text-secondary" style={{ fontSize: '14px', margin: 0 }}>
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Daily Summary */}
          <KeystonCard className="mb-6" elevated>
            <div className="flex-between mb-4">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Daily Totals</h3>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>{totalCalories}</p>
                <p className="text-secondary" style={{ fontSize: '14px', margin: 0 }}>
                  of {goals.calories} cal
                </p>
              </div>
            </div>

            <div className="grid-cols-3" style={{ textAlign: 'center' }}>
              <div>
                <div className="macro-circle macro-circle-protein" style={{ margin: '0 auto 8px' }}>
                  {totalProtein}g
                </div>
                <p className="text-secondary" style={{ fontSize: '14px', margin: 0 }}>
                  Protein
                </p>
              </div>

              <div>
                <div className="macro-circle macro-circle-carbs" style={{ margin: '0 auto 8px' }}>
                  {totalCarbs}g
                </div>
                <p className="text-secondary" style={{ fontSize: '14px', margin: 0 }}>
                  Carbs
                </p>
              </div>

              <div>
                <div className="macro-circle macro-circle-fat" style={{ margin: '0 auto 8px' }}>
                  {totalFat}g
                </div>
                <p className="text-secondary" style={{ fontSize: '14px', margin: 0 }}>
                  Fat
                </p>
              </div>
            </div>
          </KeystonCard>

          {/* Meals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mealData.map((mealGroup) => {
              const mealTotal = mealGroup.items.reduce((sum, item) => sum + item.calories, 0);

              return (
                <KeystonCard key={mealGroup.meal}>
                  <div className="flex-between mb-3">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        className="icon-badge"
                        style={{ backgroundColor: `${mealGroup.color}33` }}
                      >
                        <IonIcon
                          icon={mealGroup.icon}
                          style={{ color: mealGroup.color, fontSize: '20px' }}
                        />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                          {mealGroup.meal}
                        </h4>
                        <p className="text-secondary" style={{ fontSize: '14px', margin: 0 }}>
                          {mealGroup.time}
                        </p>
                      </div>
                    </div>
                    {mealGroup.items.length > 0 && (
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                          {mealTotal} cal
                        </p>
                      </div>
                    )}
                  </div>

                  {mealGroup.items.length > 0 ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        marginBottom: '12px',
                      }}
                    >
                      {mealGroup.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex-between"
                          style={{
                            padding: '8px 0',
                            borderTop: '1px solid var(--ion-color-light)',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{item.name}</p>
                            <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
                              P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                            </p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <p style={{ margin: 0, fontSize: '15px' }}>{item.calories} cal</p>
                            <button
                              style={{
                                padding: '8px',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                              }}
                            >
                              <IonIcon
                                icon={ellipsisVertical}
                                style={{ fontSize: '16px', color: 'var(--ion-color-medium)' }}
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p
                      className="text-tertiary"
                      style={{
                        fontSize: '14px',
                        margin: '0 0 12px 0',
                        padding: '8px 0',
                        borderTop: '1px solid var(--ion-color-light)',
                      }}
                    >
                      No items logged
                    </p>
                  )}

                  <KeystonButton variant="ghost" fullWidth size="sm">
                    <IonIcon icon={add} />
                    Add Food
                  </KeystonButton>
                </KeystonCard>
              );
            })}
          </div>

          {/* Goals Info Card */}
          <KeystonCard className="mt-6">
            <h4 style={{ marginTop: 0, marginBottom: '12px', fontSize: '16px' }}>
              Your Daily Goals
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="flex-between">
                <span className="text-secondary" style={{ fontSize: '14px' }}>
                  Calories
                </span>
                <strong style={{ fontSize: '14px' }}>{goals.calories} kcal</strong>
              </div>
              <div className="flex-between">
                <span className="text-secondary" style={{ fontSize: '14px' }}>
                  Protein
                </span>
                <strong style={{ fontSize: '14px' }}>{goals.protein}g</strong>
              </div>
              <div className="flex-between">
                <span className="text-secondary" style={{ fontSize: '14px' }}>
                  Carbs
                </span>
                <strong style={{ fontSize: '14px' }}>{goals.carbs}g</strong>
              </div>
              <div className="flex-between">
                <span className="text-secondary" style={{ fontSize: '14px' }}>
                  Fat
                </span>
                <strong style={{ fontSize: '14px' }}>{goals.fat}g</strong>
              </div>
            </div>
          </KeystonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FoodDiary;
