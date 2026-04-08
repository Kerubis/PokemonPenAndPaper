import React from 'react';
import { Toolbar } from '@/components/ui/Toolbar';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import type { DropdownItem } from '@/components/ui/Dropdown';
import { formatPokedexNumber } from '@/lib/utils';
import { getAvailablePokemonOptions } from '@/features/pokemon/utils/pokemonOptions';
import { PlusIcon, ChevronDownIcon, PrintIcon } from '@/components/ui/icons';

interface CharacterToolbarProps {
    canExport: boolean;
    onNewCharacter: (pokemonId: string) => void;
    onExportPDF: () => void;
}

export const CharacterToolbar: React.FC<CharacterToolbarProps> = ({
    canExport,
    onNewCharacter,
    onExportPDF
}) => {
    // Get available Pokemon and convert to dropdown items
    const availablePokemon = getAvailablePokemonOptions();
    const dropdownItems: DropdownItem[] = availablePokemon.map(pokemon => ({
        id: pokemon.id,
        label: pokemon.name,
        metadata: { number: pokemon.number }
    }));

    // Custom renderer for Pokemon items
    const renderPokemonItem = (item: DropdownItem) => (
        <>
            <span style={{ fontSize: '0.75rem', color: '#a0a0a0', fontWeight: 600, minWidth: '40px' }}>
                {formatPokedexNumber(item.metadata.number)}
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {item.label}
            </span>
        </>
    );

    // Button content with icon and dropdown arrow
    const newButtonContent = (
        <>
            <PlusIcon />
            New
            <ChevronDownIcon style={{ marginLeft: '4px' }} />
        </>
    );

    const leftContent = (
        <Dropdown
            buttonContent={newButtonContent}
            items={dropdownItems}
            onSelect={onNewCharacter}
            renderItem={renderPokemonItem}
            buttonTitle="New Character"
        />
    );

    const rightContent = (
        <Button
            onClick={onExportPDF}
            disabled={!canExport}
        >
            <PrintIcon />
            Export to PDF
        </Button>
    );

    return <Toolbar leftContent={leftContent} rightContent={rightContent} />;
};
