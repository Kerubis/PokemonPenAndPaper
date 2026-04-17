import React from 'react';
import { BorderBox } from '@/components/ui/BorderBox';
import { TypeBadge } from '@/components/domain/TypeBadge';
import { formatPokedexNumber } from '@/lib/utils';
import { calculateDefensiveEffectiveness } from '@/features/pokemon/utils/typeEffectiveness';
import type { Pokemon, PokemonType } from '@/features/pokemon/types';
import './CharacterSheet.css';

interface CharacterSheetProps {
  pokemon: Pokemon;
  fillNameAndLevel?: boolean;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({
  pokemon,
  fillNameAndLevel = true
}) => {
  const { weaknesses, doubleWeaknesses, resistances, doubleResistances, immunities } = 
    calculateDefensiveEffectiveness(pokemon.type1, pokemon.type2 || undefined);

  // Helper function to render stat blocks
  const renderStatBlocks = (value: number, rows: number) => {
    const blocks = [];
    const totalBlocks = rows * 10; // 10 columns × rows
    const fullBlocks = Math.floor(value / 5);
    const remainder = value % 5;

    for (let i = 0; i < totalBlocks; i++) {
      let content = '';
      let isFull = false;
      let isEmpty = false;
      const isGroupEnd = (i + 1) % 10 === 5;

      if (i < fullBlocks) {
        // Full block (5 marks with strikethrough)
        content = 'llll';
        isFull = true;
      } else if (i === fullBlocks && remainder > 0) {
        // Partial block
        content = 'l'.repeat(remainder);
      } else {
        // Empty block
        content = '';
        isEmpty = true;
      }

      blocks.push(
        <span 
          key={i} 
          className={`charcter-sheet-stat-block ${isFull ? 'charcter-sheet-stat-block-full' : ''} ${isEmpty ? 'charcter-sheet-stat-block-empty' : ''} ${isGroupEnd ? 'charcter-sheet-stat-block-groupend' : ''}`}
        >
          {content}
        </span>
      );
    }

    return blocks;
  };

  // Helper function to render defensive effectiveness rows
  const renderDefensiveRow = (label: string, types: PokemonType[]) => {
    if (types.length === 0) return null;

    return (
      <div className="charcter-sheet-effectiveness-group">
        <div className="charcter-sheet-effectiveness-label">{label}:</div>
        <div className="charcter-sheet-effectiveness-badges">
          {types.map(type => (
            <TypeBadge key={type.name} type={type} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="character-sheet">
      <div className="charcter-sheet-header">
        <div className="charcter-sheet-identity">
          <div className="charcter-sheet-entry-name">
            {formatPokedexNumber(pokemon.pokedexEntry)} {pokemon.pokemonName}
          </div>
          <div className="charcter-sheet-info-section">
            <BorderBox label="Name" className="charcter-sheet-box-name">
              <div className="charcter-sheet-box-text">{fillNameAndLevel ? pokemon.name : ''}</div>
            </BorderBox>
            <BorderBox label="Lv." className="charcter-sheet-box-level">
              <div className="charcter-sheet-box-text">{fillNameAndLevel ? pokemon.level : ''}</div>
            </BorderBox>
          </div>
          <BorderBox label="Current HP:" className="charcter-sheet-box-current-hp">
            <div className="charcter-sheet-box-text"></div>
          </BorderBox>
        </div>
        
        <div className="charcter-sheet-types-section">
          <div className="charcter-sheet-types-column">
            <TypeBadge type={pokemon.type1} />
            {pokemon.type2 && <TypeBadge type={pokemon.type2} />}
          </div>
          
          <div className="charcter-sheet-effectiveness-column">
            {renderDefensiveRow('Double Weak (×4)', doubleWeaknesses)}
            {renderDefensiveRow('Weak (×2)', weaknesses)}
            {renderDefensiveRow('Resistant (×½)', resistances)}
            {renderDefensiveRow('Double Resist (×¼)', doubleResistances)}
            {renderDefensiveRow('Immune (×0)', immunities)}
          </div>
        </div>
      </div>

      <div className="charcter-sheet-content-section">
        <div className="charcter-sheet-stats-section">
          <BorderBox label="HP:" className="charcter-sheet-box-stat-hp">
            <div className="charcter-sheet-stat-row">
              <div className="charcter-sheet-stat-blocks">
                {renderStatBlocks(pokemon.maxHp, 10)}
              </div>
            </div>
          </BorderBox>
          <BorderBox label="Attack:" className="charcter-sheet-box-stat">
            <div className="charcter-sheet-stat-row">
              <div className="charcter-sheet-stat-blocks">
                {renderStatBlocks(pokemon.attack, 4)}
              </div>
            </div>
          </BorderBox>
          <BorderBox label="Sp. Attack:" className="charcter-sheet-box-stat">
            <div className="charcter-sheet-stat-row">
              <div className="charcter-sheet-stat-blocks">
                {renderStatBlocks(pokemon.specialAttack, 4)}
              </div>
            </div>
          </BorderBox>
          <BorderBox label="Defense:" className="charcter-sheet-box-stat">
            <div className="charcter-sheet-stat-row">
              <div className="charcter-sheet-stat-blocks">
                {renderStatBlocks(pokemon.defense, 4)}
              </div>
            </div>
          </BorderBox>
          <BorderBox label="Sp. Defense:" className="charcter-sheet-box-stat">
            <div className="charcter-sheet-stat-row">
              <div className="charcter-sheet-stat-blocks">
                {renderStatBlocks(pokemon.specialDefense, 4)}
              </div>
            </div>
          </BorderBox>
          <BorderBox label="Speed:" className="charcter-sheet-box-stat">
            <div className="charcter-sheet-stat-row">
              <div className="charcter-sheet-stat-blocks">
                {renderStatBlocks(pokemon.speed, 4)}
              </div>
            </div>
          </BorderBox>
      </div>
      
      <div className="charcter-sheet-additional-section">
        <BorderBox label="Flaw:" className="charcter-sheet-box-trait">
          <div className="charcter-sheet-trait-text">{pokemon.flaw}</div>
        </BorderBox>
        <BorderBox label="Strength:" className="charcter-sheet-box-trait">
          <div className="charcter-sheet-trait-text">{pokemon.strength}</div>
        </BorderBox>
        <BorderBox label="Abilities:" className="charcter-sheet-box-abilities">
          <div className="charcter-sheet-abilities-text">
            {pokemon.abilitiesAvailable.map((ability, index) => (
              <span key={index}>{ability.name}{index < pokemon.abilitiesAvailable.length - 1 ? ', ' : ''}</span>
            ))}
          </div>
        </BorderBox>
        <BorderBox label="Notes:" className="charcter-sheet-box-notes">
          <div className="charcter-sheet-notes-text"></div>
        </BorderBox>
      </div>
    </div>
    
    <div className="charcter-sheet-footer">
      <div className="charcter-sheet-footer-text">
        Pokemon Pen&Paper Character Sheet
      </div>
    </div>
    </div>
  );
};
