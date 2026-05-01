import React from 'react';
import './EncounterCard.css';

interface EncounterCardProps {
  name: string;
  pokemonCount: number;
  isActive?: boolean;
}

export const EncounterCard: React.FC<EncounterCardProps> = ({
  name,
  pokemonCount,
  isActive = false
}) => {
  return (
    <div className={`encounter-card ${isActive ? 'active' : ''}`}>
      <div className="encounter-card-header">
        <h3 className="encounter-card-name">{name || 'Unnamed Encounter'}</h3>
      </div>
      <div className="encounter-card-info">
        <span className="encounter-card-pokemon-count">
          {pokemonCount} {pokemonCount === 1 ? 'Pokemon' : 'Pokemon'}
        </span>
      </div>
    </div>
  );
};
