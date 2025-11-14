import React from 'react';

interface KeystonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function KeystonInput({ label, error, icon, className = '', ...props }: KeystonInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-[rgb(var(--foreground))]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--foreground-tertiary))]">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 rounded-xl
            bg-[rgb(var(--input-background))]
            border-2 border-[rgb(var(--input-border))]
            text-[rgb(var(--foreground))]
            placeholder:text-[rgb(var(--foreground-tertiary))]
            focus:outline-none focus:border-[rgb(var(--primary))]
            transition-colors
            min-h-[44px]
            ${icon ? 'pl-11' : ''}
            ${error ? 'border-[rgb(var(--error))]' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-[rgb(var(--error))]">{error}</p>
      )}
    </div>
  );
}
