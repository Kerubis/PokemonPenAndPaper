import React from 'react';

interface WalkIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

// Three paw prints travelling from bottom-right to top-left
export const WalkIcon: React.FC<WalkIconProps> = ({
  width = 24,
  height = 24,
  className,
  style,
}) => {
  // Each paw: main pad ellipse + 4 toe circles, rotated -45° so toes
  // point toward the top-left (direction of travel).
  const Paw = ({ cx, cy }: { cx: number; cy: number }) => (
    <g transform={`rotate(-45, ${cx}, ${cy})`}>
      {/* Main pad */}
      <ellipse cx={cx} cy={cy + 0.4} rx="2.6" ry="2.1" />
      {/* 4 toe beans in a semi-circle arc above the pad */}
      <circle cx={cx - 2.3}  cy={cy - 2.4} r="1.1" />
      <circle cx={cx - 0.75} cy={cy - 3.5} r="1.1" />
      <circle cx={cx + 0.75} cy={cy - 3.5} r="1.1" />
      <circle cx={cx + 2.3}  cy={cy - 2.4} r="1.1" />
    </g>
  );

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
      {/* Travel diagonal: bottom-right (19,19) → top-left (5,5).
          Perpendicular offset ±1.5 units: right foot shifts (-1, +1), left foot shifts (+1, -1) */}
      {/* Paw 1 — bottom, right foot */}
      <Paw cx={17.7} cy={20.3} />
      {/* Paw 2 — middle, left foot */}
      <Paw cx={13.5} cy={10.5} />
      {/* Paw 3 — top, right foot */}
      <Paw cx={4.7} cy={7.3} />
    </svg>
  );
};
