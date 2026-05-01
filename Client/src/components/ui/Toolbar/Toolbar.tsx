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
  const onlyOne = (!!leftContent) !== (!!rightContent);

  return (
    <div className={`toolbar ${className}`}>
      {leftContent && (
        <div className="toolbar-left" style={onlyOne ? { width: '100%' } : undefined}>
          {leftContent}
        </div>
      )}
      {!onlyOne && <div className="toolbar-spacer"></div>}
      {rightContent && (
        <div className="toolbar-right" style={onlyOne ? { width: '100%' } : undefined}>
          {rightContent}
        </div>
      )}
    </div>
  );
};
