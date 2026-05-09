import React from 'react';

interface MovesIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const MovesIcon: React.FC<MovesIconProps> = ({
  width = 24,
  height = 24,
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
      <path d="M7 2v2H5v2h2v1H5v2h2v1H3v2h2l-2 8h14l-2-8h2v-2h-4V9h2V7h-2V6h2V4h-2V2H7zm1 2h8v1h-1v2h1v1h-1v2h1v1H8v-1h1V9H8V7h1V5H8V4zm1 1v1h6V5H9zm0 2v1h6V7H9zm0 2v1h6V9H9zm-2.8 4h11.6l1.5 6H4.7l1.5-6z" />
    </svg>
  );
};
