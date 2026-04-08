import React from 'react';

interface MinusIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const MinusIcon: React.FC<MinusIconProps> = ({ 
  width = 18, 
  height = 18, 
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
      fill="currentColor"
    >
      <path d="M19 13H5v-2h14v2z"/>
    </svg>
  );
};
