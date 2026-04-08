import React from 'react';

interface BattleIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const BattleIcon: React.FC<BattleIconProps> = ({ 
  width = 24, 
  height = 24, 
  className,
  style 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 512 512" 
      width={width} 
      height={height}
      className={className}
      style={style}
      fill="currentColor"
    >
      <defs>
        <mask id="star-mask">
          <rect width="512" height="512" fill="white"/>
          {/* Cut out circles where pokeballs are */}
          <circle cx="382" cy="102" r="145" fill="black"/>
          <circle cx="152" cy="352" r="145" fill="black"/>
        </mask>
      </defs>
      
      {/* Star outline with mask */}
      <g transform="translate(256, 256) scale(1.15) translate(-256, -256)">
        <path 
          fill="none"
          stroke="currentColor"
          strokeWidth="20"
          strokeLinejoin="round"
          mask="url(#star-mask)"
          d="M256 20 L280 140 L390 90 L310 190 L430 240 L310 290 L390 390 L280 340 L256 460 L232 340 L122 390 L202 290 L82 240 L202 190 L122 90 L232 140 Z"
        />
      </g>
      
      {/* Top-right Pokeball */}
      <g transform="translate(280, 0) scale(0.40)">
        <path d="M229.7 36.8A220.9 220.9 0 0 0 37.5 224.9l-.4 4.3h106.5l1.4-4.7a116.3 116.3 0 0 1 73-77.5 114.7 114.7 0 0 1 149 79l.9 3.2H475l-1.7-10.1A220 220 0 0 0 281 36.7c-12-1.4-39.3-1.4-51.2 0z"></path>
        <path d="M239.7 185a74 74 0 0 0-49.7 40.3 73 73 0 0 0 15.4 82.3 72.1 72.1 0 0 0 101.9-1.2 68.8 68.8 0 0 0 20.6-50.7 69.1 69.1 0 0 0-21-51.2 73.3 73.3 0 0 0-33-19c-7.6-2.1-26.4-2.3-34.2-.5z"></path>
        <path d="M37.5 286.3a220.5 220.5 0 0 0 436 4.5l1.5-8.9H367.9l-1 3.2a130 130 0 0 1-17.7 37.6 144 144 0 0 1-26.9 26.8 142 142 0 0 1-30.7 15.4 96.3 96.3 0 0 1-35.8 5.3 90 90 0 0 1-22.5-1.7 114 114 0 0 1-58.6-31.7 110.1 110.1 0 0 1-28.3-46l-2.9-8.9H37l.6 4.4h-.1z"></path>
      </g>
      
      {/* Bottom-left Pokeball */}
      <g transform="translate(50, 250) scale(0.40)">
        <path d="M229.7 36.8A220.9 220.9 0 0 0 37.5 224.9l-.4 4.3h106.5l1.4-4.7a116.3 116.3 0 0 1 73-77.5 114.7 114.7 0 0 1 149 79l.9 3.2H475l-1.7-10.1A220 220 0 0 0 281 36.7c-12-1.4-39.3-1.4-51.2 0z"></path>
        <path d="M239.7 185a74 74 0 0 0-49.7 40.3 73 73 0 0 0 15.4 82.3 72.1 72.1 0 0 0 101.9-1.2 68.8 68.8 0 0 0 20.6-50.7 69.1 69.1 0 0 0-21-51.2 73.3 73.3 0 0 0-33-19c-7.6-2.1-26.4-2.3-34.2-.5z"></path>
        <path d="M37.5 286.3a220.5 220.5 0 0 0 436 4.5l1.5-8.9H367.9l-1 3.2a130 130 0 0 1-17.7 37.6 144 144 0 0 1-26.9 26.8 142 142 0 0 1-30.7 15.4 96.3 96.3 0 0 1-35.8 5.3 90 90 0 0 1-22.5-1.7 114 114 0 0 1-58.6-31.7 110.1 110.1 0 0 1-28.3-46l-2.9-8.9H37l.6 4.4h-.1z"></path>
      </g>
    </svg>
  );
};
