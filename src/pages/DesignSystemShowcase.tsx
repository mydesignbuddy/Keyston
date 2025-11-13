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
  IonButton,
  IonChip,
  IonBadge,
  IonList,
} from '@ionic/react';
import ThemeToggle from '../components/ThemeToggle';
import './DesignSystemShowcase.css';

/**
 * Design System Showcase Page
 *
 * This page demonstrates all the design system elements including:
 * - Color palette
 * - Typography
 * - Components
 * - Theme switching
 *
 * This is for development/documentation purposes only and should not
 * be included in production builds.
 */
const DesignSystemShowcase: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Design System Showcase</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Theme Switcher */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle className="text-2xl font-semibold">Theme Switcher</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <ThemeToggle />
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Colors */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle className="text-2xl font-semibold">Color Palette</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="color-grid">
              <IonButton color="primary">Primary</IonButton>
              <IonButton color="secondary">Secondary</IonButton>
              <IonButton color="tertiary">Tertiary</IonButton>
              <IonButton color="success">Success</IonButton>
              <IonButton color="warning">Warning</IonButton>
              <IonButton color="danger">Danger</IonButton>
              <IonButton color="light">Light</IonButton>
              <IonButton color="medium">Medium</IonButton>
              <IonButton color="dark">Dark</IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Typography */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle className="text-2xl font-semibold">Typography Scale</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <h1 className="text-4xl font-bold">Heading 1 - Extra Large (4xl)</h1>
            <h2 className="text-3xl font-bold">Heading 2 - Large (3xl)</h2>
            <h3 className="text-2xl font-semibold">Heading 3 - Medium (2xl)</h3>
            <h4 className="text-xl font-semibold">Heading 4 - Small (xl)</h4>
            <p className="text-lg font-normal">Large body text (lg)</p>
            <p className="text-base font-normal">Base body text (base)</p>
            <p className="text-sm font-normal">Small text (sm)</p>
            <p className="text-xs font-normal">Extra small text (xs)</p>
          </IonCardContent>
        </IonCard>

        {/* Nutrition Colors */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle className="text-2xl font-semibold">
              Nutrition Semantic Colors
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="nutrition-showcase">
              <div className="nutrition-item">
                <IonChip className="nutrition-protein">
                  <strong>Protein</strong>
                </IonChip>
                <span className="nutrition-protein text-lg font-semibold">150g / 150g</span>
              </div>
              <div className="nutrition-item">
                <IonChip className="nutrition-carbs">
                  <strong>Carbs</strong>
                </IonChip>
                <span className="nutrition-carbs text-lg font-semibold">200g / 200g</span>
              </div>
              <div className="nutrition-item">
                <IonChip className="nutrition-fat">
                  <strong>Fat</strong>
                </IonChip>
                <span className="nutrition-fat text-lg font-semibold">65g / 65g</span>
              </div>
              <div className="nutrition-item">
                <IonChip className="nutrition-calories">
                  <strong>Calories</strong>
                </IonChip>
                <span className="nutrition-calories text-lg font-semibold">2000 / 2000</span>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Badges and Status */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle className="text-2xl font-semibold">Status Indicators</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="badge-grid">
              <IonBadge color="success">Goal Met</IonBadge>
              <IonBadge color="warning">Close to Goal</IonBadge>
              <IonBadge color="danger">Over Limit</IonBadge>
              <IonBadge color="primary">Tracking</IonBadge>
              <IonBadge color="secondary">Active</IonBadge>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Buttons */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle className="text-2xl font-semibold">Button Variants</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="button-grid">
              <IonButton expand="block" color="primary">
                Primary Button
              </IonButton>
              <IonButton expand="block" color="secondary">
                Secondary Button
              </IonButton>
              <IonButton expand="block" color="success">
                Success Button
              </IonButton>
              <IonButton expand="block" color="danger">
                Danger Button
              </IonButton>
              <IonButton expand="block" fill="outline" color="primary">
                Outline Button
              </IonButton>
              <IonButton expand="block" fill="clear" color="primary">
                Clear Button
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Info Card */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle className="text-xl font-semibold">Design System Info</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p className="text-base">
              This showcase demonstrates the Keyston design system implementation including color
              palette, typography, and component styling. All elements automatically adapt to the
              selected theme (light/dark/system).
            </p>
            <p className="text-sm" style={{ marginTop: '1rem', color: 'var(--ion-color-medium)' }}>
              See <strong>docs/DESIGN_SYSTEM.md</strong> for complete documentation and usage
              guidelines.
            </p>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default DesignSystemShowcase;
