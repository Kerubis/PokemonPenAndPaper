import React from 'react';
import './Toolbar.css';

interface ToolbarProps {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
  leftContent, 
  rightContent,
  className = '' 
}) => {
  return (
    <div className={`toolbar ${className}`}>
      {leftContent && <div className="toolbar-left">{leftContent}</div>}
      <div className="toolbar-spacer"></div>
      {rightContent && <div className="toolbar-right">{rightContent}</div>}
    </div>
  );
};
