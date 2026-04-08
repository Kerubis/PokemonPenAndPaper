import React from 'react';
import { TypeBadge } from '@/components/domain/TypeBadge';
import { formatHpDisplay } from '@/lib/utils';
import type { PokemonType } from '@/features/pokemon/types';
import './CharacterCard.css';

interface CharacterCardProps {
    name: string;
    pokemonName: string;
    level: number;
    type1: PokemonType;
    type2?: PokemonType;
    currentHp: number;
    maxHp: number;
    onClick?: () => void;
    isActive?: boolean;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ 
    name,
    pokemonName,
    level,
    type1,
    type2,
    currentHp,
    maxHp,
    onClick, 
    isActive = false 
}) => {
    const displayName = name || 'Unnamed';

    return (
        <div className={`character-card ${isActive ? 'active' : ''}`} onClick={onClick}>
            <div className="character-card-row-1">
                <span className="character-card-name">{displayName}</span>
                <span className="character-card-divider">•</span>
                <span className="character-card-pokemon-name">{pokemonName}</span>
                <span className="character-card-level">Lv. {level}</span>
            </div>
            <div className="character-card-row-2">
                <TypeBadge type={type1} />
                {type2 && <TypeBadge type={type2} />}
                <span className="character-card-hp">HP: {formatHpDisplay(currentHp, maxHp)}</span>
            </div>
        </div>
    );
};
