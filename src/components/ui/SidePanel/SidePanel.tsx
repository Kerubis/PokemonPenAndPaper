import React from 'react';
import './SidePanel.css';

interface SidePanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  width?: string;
}

export const SidePanel: React.FC<SidePanelProps> = ({ 
  title, 
  children, 
  className = '',
  width 
}) => {
  return (
    <div 
      className={`side-panel ${className}`}
      style={width ? { width } : undefined}
    >
      <h3 className="side-panel-title">{title}</h3>
      <div className="side-panel-content">
        {children}
      </div>
    </div>
  );
};
