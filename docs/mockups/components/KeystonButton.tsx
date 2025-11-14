import React from 'react';

interface KeystonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function KeystonButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}: KeystonButtonProps) {
  const baseClasses = 'rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] hover:opacity-90 shadow-md',
    secondary: 'bg-[rgb(var(--secondary))] text-[rgb(var(--secondary-foreground))] hover:opacity-90 shadow-md',
    tertiary: 'bg-[rgb(var(--tertiary))] text-[rgb(var(--tertiary-foreground))] hover:opacity-90 shadow-md',
    outline: 'border-2 border-[rgb(var(--border-strong))] text-[rgb(var(--foreground))] hover:bg-[rgb(var(--surface))]',
    ghost: 'text-[rgb(var(--foreground))] hover:bg-[rgb(var(--surface))]',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-3 min-h-[44px]',
    lg: 'px-6 py-4 min-h-[52px]',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
