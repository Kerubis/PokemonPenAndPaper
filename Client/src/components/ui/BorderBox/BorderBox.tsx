import React from 'react';
import './BorderBox.css';

interface BorderBoxProps {
  label: string;
  className?: string;
  children: React.ReactNode;
}

export const BorderBox: React.FC<BorderBoxProps> = ({ label, className = '', children }) => {
  return (
    <div className={`border-box ${className}`}>
      <div className="border-box-label">{label}</div>
      <div className="border-box-content">
        {children}
      </div>
    </div>
  );
};
