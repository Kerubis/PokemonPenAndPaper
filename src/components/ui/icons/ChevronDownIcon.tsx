import React from 'react';

interface ChevronDownIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({ 
  width = 16, 
  height = 16, 
  className,
  style 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      width={width} 
      height={height}
      className={className}
      style={style}
    >
      <path fill="currentColor" d="M7 10l5 5 5-5z" />
    </svg>
  );
};
