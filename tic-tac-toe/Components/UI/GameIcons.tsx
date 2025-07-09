import React from 'react';

interface GameIconProps {
  size?: number | string;
  className?: string;
  color?: 'blue' | 'red' | 'custom';
  customColor?: string;
}

export const XIcon: React.FC<GameIconProps> = ({ 
  size = 24, 
  className = '', 
  color = 'blue',
  customColor 
}) => {
  const getColor = () => {
    if (customColor) return customColor;
    return color === 'blue' ? 'var(--color-x-blue)' : 'var(--color-o-red)';
  };

  const combinedClassName = `game-icon-glass ${className}`;

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={combinedClassName}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
        transition: 'all 0.3s ease'
      }}
    >
      <defs>
        <linearGradient id={`x-gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={getColor()} stopOpacity="0.9" />
          <stop offset="50%" stopColor={getColor()} stopOpacity="1" />
          <stop offset="100%" stopColor={getColor()} stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <g>
        <line 
          strokeLinecap="round" 
          strokeWidth="12" 
          y2="85" 
          x2="15" 
          y1="15" 
          x1="85" 
          stroke={`url(#x-gradient-${size})`}
          fill="none"
          style={{
            filter: 'drop-shadow(0 1px 2px rgba(255, 255, 255, 0.3))'
          }}
        />
        <line 
          strokeLinecap="round" 
          strokeWidth="12" 
          y2="85" 
          x2="85" 
          y1="15" 
          x1="15" 
          stroke={`url(#x-gradient-${size})`}
          fill="none"
          style={{
            filter: 'drop-shadow(0 1px 2px rgba(255, 255, 255, 0.3))'
          }}
        />
      </g>
    </svg>
  );
};

export const OIcon: React.FC<GameIconProps> = ({ 
  size = 24, 
  className = '', 
  color = 'red',
  customColor 
}) => {
  const getColor = () => {
    if (customColor) return customColor;
    return color === 'red' ? 'var(--color-o-red)' : 'var(--color-x-blue)';
  };

  const combinedClassName = `game-icon-glass ${className}`;

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={combinedClassName}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
        transition: 'all 0.3s ease'
      }}
    >
      <defs>
        <linearGradient id={`o-gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={getColor()} stopOpacity="0.9" />
          <stop offset="50%" stopColor={getColor()} stopOpacity="1" />
          <stop offset="100%" stopColor={getColor()} stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <g>
        <circle 
          cx="50" 
          cy="50" 
          r="30" 
          stroke={`url(#o-gradient-${size})`}
          strokeWidth="12" 
          fill="none"
          style={{
            filter: 'drop-shadow(0 1px 2px rgba(255, 255, 255, 0.3))'
          }}
        />
      </g>
    </svg>
  );
};

// Generic game icon that can be used for other purposes
export const GameIcon: React.FC<GameIconProps & { type: 'X' | 'O' }> = ({ 
  type, 
  ...props 
}) => {
  return type === 'X' ? <XIcon {...props} /> : <OIcon {...props} />;
};
