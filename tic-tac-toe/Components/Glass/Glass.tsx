import React from 'react';

export interface GlassProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: 'base' | 'subtle' | 'accent';
  interactive?: boolean;
  style?: React.CSSProperties;
}

/**
 * Glass - A flexible base component for the liquid glass effect.
 * 
 * @param as - The HTML element or React component to render as
 * @param variant - The glass variant: 'base' (default), 'subtle', or 'accent'
 * @param interactive - Whether the glass should respond to user interactions
 * @param className - Additional CSS classes
 * @param children - Content to render inside the glass container
 */
export const Glass: React.FC<GlassProps> = ({
  as: Component = 'div',
  children,
  className = '',
  variant = 'base',
  interactive = false,
  style,
  ...rest
}) => {
  const variantClass = `glass-${variant}`;
  const interactiveClass = interactive ? 'glass-interactive' : '';
  
  const combinedClassName = [
    variantClass,
    interactiveClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <Component
      className={combinedClassName}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
};
