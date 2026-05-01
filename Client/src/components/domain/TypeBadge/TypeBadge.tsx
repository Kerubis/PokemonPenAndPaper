import React from 'react';
import { PokemonType } from '../../../features/pokemon/types';
import './TypeBadge.css';

interface TypeBadgeProps {
  type: PokemonType;
  className?: string;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, className = '' }) => {
  return (
    <div 
      className={`type-badge ${className}`}
      style={{ backgroundColor: type.color }}
    >
      {type.name}
    </div>
  );
};
