import React from 'react';

interface MountainIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

// Mountain with snow cap — represents climb speed
export const MountainIcon: React.FC<MountainIconProps> = ({
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
      fill="currentColor"
    >
      {/*
        Classic two-peak mountain silhouette as a single closed path:
        bottom-left → left peak → valley → right (taller) peak → bottom-right
      */}
      <path d="M2 21 L8 10 L11.5 15.5 L17 3 L22 21 Z" />
    </svg>
  );
};
