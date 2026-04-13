import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidePanel } from '@/components/ui/SidePanel';
import { TrashIcon, DocumentIcon } from '@/components/ui/icons';
import { AbilityCard } from '@/components/domain/AbilityCard';
import type { Pokemon } from '@/features/pokemon/types';
import { PokemonType } from '@/features/pokemon/types/Type';
import type { DamageType } from '@/features/pokemon/types/DamageType';
import './EncounterPropertiesPanel.css';

const ALL_TYPES = [
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
  'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy',
] as const;


interface EncounterPropertiesPanelProps {
  pokemon?: Pokemon | null;
  onRemovePokemon?: () => void;
  onDamageDealt?: () => void;
}

export const EncounterPropertiesPanel: React.FC<EncounterPropertiesPanelProps> = ({ pokemon, onRemovePokemon, onDamageDealt }) => {
  const [damageAmount, setDamageAmount] = useState<number>(0);
  const [damageType, setDamageType] = useState<Exclude<DamageType, 'Status'>>('Physical');
  const [attackingType, setAttackingType] = useState<string>('Normal');
  const [healAmount, setHealAmount] = useState<number>(0);

  const handleDealDamage = () => {
    if (!pokemon || damageAmount <= 0) return;
    const type = (PokemonType as unknown as Record<string, PokemonType>)[attackingType];
    if (!type) return;
    pokemon.dealDirectDamage(type, damageType, damageAmount);
    onDamageDealt?.();
  };

  const handleHeal = () => {
    if (!pokemon || healAmount <= 0) return;
    pokemon.heal(healAmount);
    onDamageDealt?.();
  };

  const displayName = pokemon
    ? pokemon.name
      ? `${pokemon.name} (${pokemon.pokemonName})`
      : pokemon.pokemonName
    : 'Pokemon';

  const title = (
    <div className="encounter-properties-title">
      <span>{displayName}</span>
      {pokemon?.isPlayerCharacter && (
        <Link
          to={`/Characters/${pokemon.id}`}
          className="encounter-properties-sheet-link"
          title="Go to Character Sheet"
        >
          <DocumentIcon width={16} height={16} />
        </Link>
      )}
    </div>
  );

  const abilities = pokemon?.abilitiesAvailable ?? [];

  return (
    <SidePanel title={title} className="encounter-properties-panel">
      {pokemon && (
        <div className="encounter-damage-box">
          <div className="encounter-damage-row">
            <select
              className="encounter-damage-select"
              value={attackingType}
              onChange={e => setAttackingType(e.target.value)}
              aria-label="Attacking type"
            >
              {ALL_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              className="encounter-damage-select"
              value={damageType}
              onChange={e => setDamageType(e.target.value as Exclude<DamageType, 'Status'>)}
              aria-label="Damage category"
            >
              <option value="Physical">Physical</option>
              <option value="Special">Special</option>
            </select>
          </div>
          <div className="encounter-damage-row">
            <input
              type="number"
              className="encounter-damage-input"
              min={0}
              value={damageAmount}
              onChange={e => setDamageAmount(Math.max(0, Number(e.target.value)))}
              onFocus={e => e.target.select()}
              onKeyDown={e => e.key === 'Enter' && handleDealDamage()}
              aria-label="Damage amount"
            />
            <button
              className="encounter-damage-button"
              onClick={handleDealDamage}
              disabled={damageAmount <= 0}
            >
              Deal Damage
            </button>
          </div>
        </div>
      )}

      {pokemon && (
        <div className="encounter-damage-box encounter-heal-box">
          <div className="encounter-damage-row">
            <input
              type="number"
              className="encounter-damage-input"
              min={0}
              value={healAmount}
              onChange={e => setHealAmount(Math.max(0, Number(e.target.value)))}
              onFocus={e => e.target.select()}
              onKeyDown={e => e.key === 'Enter' && handleHeal()}
              aria-label="Heal amount"
            />
            <button
              className="encounter-damage-button encounter-heal-button"
              onClick={handleHeal}
              disabled={healAmount <= 0}
            >
              Heal
            </button>
          </div>
        </div>
      )}

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
