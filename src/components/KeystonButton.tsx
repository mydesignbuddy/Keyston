import React from 'react';
import { IonButton } from '@ionic/react';

interface KeystonButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * KeystonButton Component
 *
 * A wrapper around IonButton that provides variant styles matching the Figma mockups.
 * Uses Ionic's button component for accessibility and consistent behavior.
 *
 * @param variant - Button style variant (default: 'primary')
 * @param size - Button size (default: 'md')
 * @param fullWidth - Whether button should take full width
 * @param children - Button content
 * @param onClick - Click handler
 * @param disabled - Whether button is disabled
 * @param className - Additional CSS classes
 */
const KeystonButton: React.FC<KeystonButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  onClick,
  disabled = false,
  className = '',
}) => {
  // Map variants to Ionic props
  const getIonicProps = () => {
    switch (variant) {
      case 'primary':
        return { color: 'primary', fill: 'solid' as const };
      case 'secondary':
        return { color: 'secondary', fill: 'solid' as const };
      case 'tertiary':
        return { color: 'tertiary', fill: 'solid' as const };
      case 'outline':
        return { color: 'primary', fill: 'outline' as const };
      case 'ghost':
        return { color: 'primary', fill: 'clear' as const };
      default:
        return { color: 'primary', fill: 'solid' as const };
    }
  };

  const { color, fill } = getIonicProps();

  // Map size to Ionic size
  const ionicSize = size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'default';

  return (
    <IonButton
      color={color}
      fill={fill}
      size={ionicSize}
      expand={fullWidth ? 'block' : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`keyston-button keyston-button-${variant} keyston-button-${size} ${className}`}
    >
      {children}
    </IonButton>
  );
};

export default KeystonButton;
