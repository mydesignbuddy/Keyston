import React from 'react';

interface KeystonCardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  onClick?: () => void;
}

export function KeystonCard({ children, className = '', elevated = false, onClick }: KeystonCardProps) {
  const baseClasses = 'rounded-2xl p-4 transition-all';
  const bgClass = elevated ? 'bg-[rgb(var(--surface-elevated))]' : 'bg-[rgb(var(--surface))]';
  const shadowClass = elevated ? 'shadow-lg' : 'shadow-sm';
  const interactiveClass = onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.98]' : '';
  
  return (
    <div
      className={`${baseClasses} ${bgClass} ${shadowClass} ${interactiveClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
