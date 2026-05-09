import React from 'react';
import { PrintIcon } from '@/components/ui/icons';
import { AbilityCard } from '@/components/domain/AbilityCard';
import { getAvailableAbilities } from '@/features/abilities';
import './MovesListPage.css';

export const MovesListPage: React.FC = () => {
  const handlePrint = () => window.print();
  const abilities = getAvailableAbilities().sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="moves-page-wrapper">
      <div className="moves-page-toolbar no-print">
        <button className="moves-print-btn" onClick={handlePrint}>
          <PrintIcon width={16} height={16} />
          Print
        </button>
      </div>

      <div className="moves-page">
        <div className="moves-header">
          <div className="moves-title">Pokémon Pen &amp; Paper</div>
          <div className="moves-subtitle">Move List</div>
        </div>

        <div className="moves-card-grid">
          {abilities.map((ability) => (
            <AbilityCard key={ability.name} ability={ability} />
          ))}
        </div>
      </div>
    </div>
  );
};
