import React from 'react';

interface WaveIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

// Double wave — represents swim / water movement
export const WaveIcon: React.FC<WaveIconProps> = ({
  width = 24,
  height = 24,
  className,
  style,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width}
      height={height}
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      {/* Top wave */}
      <path d="M2 9 C4.5 6, 7.5 12, 10 9 C12.5 6, 15.5 12, 18 9 C20.5 6, 22 9, 22 9" />
      {/* Bottom wave */}
      <path d="M2 15 C4.5 12, 7.5 18, 10 15 C12.5 12, 15.5 18, 18 15 C20.5 12, 22 15, 22 15" />
    </svg>
  );
};
