import React from 'react';
import { SidePanel } from '@/components/ui/SidePanel';
import { TrashIcon } from '@/components/ui/icons';
import { AbilityCard } from '@/components/domain/AbilityCard';
import type { Pokemon } from '@/features/pokemon/types';
import './EncounterPropertiesPanel.css';


interface EncounterPropertiesPanelProps {
  pokemon?: Pokemon | null;
  onRemovePokemon?: () => void;
}

export const EncounterPropertiesPanel: React.FC<EncounterPropertiesPanelProps> = ({ pokemon, onRemovePokemon }) => {
  const title = pokemon
    ? pokemon.name
      ? `${pokemon.name} (${pokemon.pokemonName})`
      : pokemon.pokemonName
    : 'Pokemon';

  const abilities = pokemon?.abilitiesAvailable ?? [];

  return (
    <SidePanel title={title} className="encounter-properties-panel">
      {abilities.length > 0 ? (
        <div className="encounter-properties-abilities">
          {abilities.map((ability, index) => (
            <AbilityCard key={`${ability.name}-${index}`} ability={ability} />
          ))}
        </div>
      ) : pokemon ? (
        <p className="encounter-properties-empty">No abilities available.</p>
      ) : null}

      {onRemovePokemon && (
        <div className="encounter-properties-footer">
          <button className="encounter-properties-remove-button" onClick={onRemovePokemon}>
            <TrashIcon />
            Remove from Encounter
          </button>
        </div>
      )}
    </SidePanel>
  );
};
