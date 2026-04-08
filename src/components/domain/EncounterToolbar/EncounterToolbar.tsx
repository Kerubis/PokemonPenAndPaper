import React from 'react';
import { Toolbar } from '@/components/ui/Toolbar';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { PlusIcon, ChevronDownIcon } from '@/components/ui/icons';
import './EncounterToolbar.css';

interface EncounterItem {
  id: string;
  name: string;
}

interface EncounterToolbarProps {
  onNewEncounter: () => void;
  encounters?: EncounterItem[];
  selectedEncounterId?: string | null;
  onSelectEncounter?: (id: string) => void;
  battleActive?: boolean;
}

export const EncounterToolbar: React.FC<EncounterToolbarProps> = ({
  onNewEncounter,
  encounters = [],
  selectedEncounterId,
  onSelectEncounter,
  battleActive = false,
}) => {
  const selectedName = encounters.find(e => e.id === selectedEncounterId)?.name;

  const dropdownItems = encounters.map(e => ({ id: e.id, label: e.name }));

  const leftContent = (
    <>
      {encounters.length > 0 && (
        <div style={{ width: '250px' }}>
          <Dropdown
            buttonContent={<>{selectedName ?? 'Select Encounter'}<ChevronDownIcon style={{ marginLeft: '4px' }} /></>}
            items={dropdownItems}
            onSelect={(id) => onSelectEncounter?.(id)}
            buttonTitle="Switch encounter"
            containerClassName="dropdown-full-width"
          />
        </div>
      )}
      <Button onClick={onNewEncounter}>
        <PlusIcon />
        New Encounter
      </Button>
      {battleActive && (
        <span className="encounter-toolbar-battle-indicator">⚔ Battle Active</span>
      )}
    </>
  );

  return <Toolbar leftContent={leftContent} />;
};
