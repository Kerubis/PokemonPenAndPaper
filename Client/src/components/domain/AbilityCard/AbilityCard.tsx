import React from 'react';
import type { Ability } from '@/features/abilities/types/Ability';
import type { DamageType } from '@/features/pokemon/types/DamageType';
import { TypeBadge } from '@/components/domain/TypeBadge';
import { formatAbilityAccuracy } from '@/lib/utils/format';
import physicalIcon from '@/assets/ability-physical.png';
import specialIcon from '@/assets/ability-special.png';
import statusIcon from '@/assets/ability-status.png';
import './AbilityCard.css';

interface AbilityCardProps {
    ability: Ability;
}

const getDamageTypeIcon = (damageType: DamageType): string => {
    switch (damageType) {
        case 'Physical':
            return physicalIcon;
        case 'Special':
            return specialIcon;
        case 'Status':
            return statusIcon;
        default:
            return statusIcon;
    }
};

export const AbilityCard: React.FC<AbilityCardProps> = ({ ability }) => {
    return (
        <div className="ability-card">
            <div className="ability-header">
                <span className="ability-name">{ability.name}</span>
                <div className="ability-stats">
                    <TypeBadge type={ability.type} />
                    <img
                        src={getDamageTypeIcon(ability.damageType)}
                        alt={ability.damageType}
                        className="damage-type-icon"
                    />
                    <span className="ability-accuracy">
                        {formatAbilityAccuracy(ability.accuracy)}
                    </span>
                </div>
            </div>


            <div className="ability-description">
                <span className="stat-value">{ability.damage}</span>
            </div>
        </div>
    );
};
