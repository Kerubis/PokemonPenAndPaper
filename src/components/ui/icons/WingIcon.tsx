import React from 'react';

interface WingIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

// Stylised bird wing — represents fly speed
export const WingIcon: React.FC<WingIconProps> = ({
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
        Wing shape: sweeps from a shoulder point (3, 12) out to a wide
        leading edge then back with feather-notch detail along the trailing edge.
      */}
      <path d="
        M 3 12
        C 6 5, 14 3, 21 4
        C 18 6, 14 7, 11 9
        C 16 8, 20 8, 22 7
        C 20 10, 15 11, 11 12
        C 15 11, 19 12, 21 11
        C 19 14, 13 15, 9 15
        C 7 16, 5 17, 3 20
        C 2 17, 2 14, 3 12
        Z
      " />
    </svg>
  );
};
