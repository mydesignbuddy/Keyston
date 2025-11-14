import React from 'react';
import { IonCard } from '@ionic/react';

interface KeystonCardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * KeystonCard Component
 *
 * A wrapper around IonCard that provides consistent styling matching the Figma mockups.
 * Uses Ionic's built-in card component for accessibility and native feel.
 *
 * @param children - Content to display inside the card
 * @param className - Additional CSS classes
 * @param elevated - Whether to show elevated shadow (default: false)
 * @param onClick - Optional click handler for interactive cards
 * @param style - Optional inline styles
 */
const KeystonCard: React.FC<KeystonCardProps> = ({
  children,
  className = '',
  elevated = false,
  onClick,
  style,
}) => {
  const baseClasses = 'keyston-card';
  const elevatedClass = elevated ? 'keyston-card-elevated' : '';
  const interactiveClass = onClick ? 'keyston-card-interactive' : '';

  return (
    <IonCard
      className={`${baseClasses} ${elevatedClass} ${interactiveClass} ${className}`}
      onClick={onClick}
      button={!!onClick}
      style={style}
    >
      {children}
    </IonCard>
  );
};

export default KeystonCard;
