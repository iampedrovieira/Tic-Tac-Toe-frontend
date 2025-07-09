import React from 'react';
import { Glass } from '../Glass/Glass';

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

/**
 * GlassButton - A liquid glass styled button component
 */
export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  className = '',
  ...buttonProps
}) => {
  const variantClasses = {
    primary: 'glass-button-primary',
    secondary: 'glass-button-secondary',
    accent: 'glass-button-accent'
  };

  const sizeClasses = {
    sm: 'glass-button-sm',
    md: 'glass-button-md',
    lg: 'glass-button-lg'
  };

  const buttonClassName = [
    'glass-button',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'glass-button-full-width' : '',
    loading ? 'glass-button-loading' : '',
    className
  ].filter(Boolean).join(' ');

  const isDisabled = disabled || loading;
  const glassVariant = variant === 'accent' ? 'accent' : 'base';

  return (
    <button
      className={`glass-${glassVariant} ${isDisabled ? '' : 'glass-interactive'} ${buttonClassName}`}
      disabled={isDisabled}
      {...buttonProps}
    >
      {loading ? (
        <span className="glass-button-spinner" />
      ) : (
        children
      )}
    </button>
  );
};
