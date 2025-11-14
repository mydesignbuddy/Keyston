import React from 'react';

interface KeystonToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function KeystonToggle({ checked, onChange, label, disabled = false }: KeystonToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className={`
          relative w-12 h-7 rounded-full transition-colors min-w-[48px]
          ${checked ? 'bg-[rgb(var(--primary))]' : 'bg-[rgb(var(--border-strong))]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !disabled && onChange(!checked)}
      >
        <div
          className={`
            absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </div>
      {label && (
        <span className="text-[rgb(var(--foreground))] select-none">{label}</span>
      )}
    </label>
  );
}
