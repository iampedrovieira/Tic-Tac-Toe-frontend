import React from 'react';
import { Glass } from '../Glass/Glass';

export interface GlassInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'base' | 'subtle' | 'accent';
}

/**
 * GlassInput - A liquid glass styled input component
 */
export const GlassInput: React.FC<GlassInputProps> = ({
  label,
  error,
  size = 'md',
  variant = 'base',
  className = '',
  style,
  id,
  ...inputProps
}) => {
  const inputId = id || `glass-input-${Math.random().toString(36).substr(2, 9)}`;
  
  const sizeClasses = {
    sm: 'glass-input-sm',
    md: 'glass-input-md',
    lg: 'glass-input-lg'
  };

  const inputClassName = [
    'glass-input',
    sizeClasses[size],
    error ? 'glass-input-error' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="glass-input-container">
      {label && (
        <label htmlFor={inputId} className="glass-input-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`glass-${variant} ${inputClassName}`}
        style={style}
        {...inputProps}
      />
      {error && (
        <div className="glass-input-error-message">
          {error}
        </div>
      )}
    </div>
  );
};
