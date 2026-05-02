import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CharacterToolbar } from '@/components/domain/CharacterToolbar';
import { CharacterList } from '@/components/domain/CharacterList';
import { CharacterPropertiesPanel } from '@/components/domain/CharacterPropertiesPanel';
import { CharacterSheet } from '@/components/domain/CharacterSheet';
import { CharacterCard } from '@/components/domain/CharacterCard';
import { createPokemonById } from '@/features/pokemon/data/pokemonRegistry';
import { setIndex } from '@/features/pokemon/types/pokemonOps';
import { useGame } from '@/contexts/GameContext';
import { ConfirmPopover } from '@/components/ui/ConfirmPopover';
import { sendGameUpdate } from '@/features/game/services/gameApi';
import { serializePokemon } from '@/features/game/utils/serialization';
import { useCharacterPropertyFields } from '@/features/characters/hooks/useCharacterPropertyFields';
import { getMaxHp } from '@/features/pokemon/types/pokemonOps';
import './CharactersPage.css';

export const CharactersPage: React.FC = () => {
  const { gameId, guid } = useParams<{ gameId: string; guid?: string }>();
  const navigate = useNavigate();
  const base = `/${gameId}`;
  const selectedCharacterId = guid ?? null;

  const { pokemon: characters, setPokemon: setCharacters, guid: gameGuid } = useGame();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<{ id: string; x: number; y: number } | null>(null);

  // Navigate to first character if none selected
  useEffect(() => {
    if (characters.length > 0 && !guid) {
      navigate(`${base}/Characters/${characters[0].id}`, { replace: true });
    }
  }, [characters, guid]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedCharacter = characters.find(c => c.id === selectedCharacterId);

  // Handle creating a new character
  const handleNewCharacter = (pokemonId: string) => {
    const pokedexNumber = parseInt(pokemonId, 10);
    const newPokemon = createPokemonById(pokedexNumber, {
      name: '',
      level: 1,
      hp: 0,
      currentHp: 0,
      attack: 0,
      specialAttack: 0,
      defense: 0,
      specialDefense: 0,
      speed: 0,
      isPlayerCharacter: true,
      index: characters.length
    });

    if (newPokemon) {
      sendGameUpdate({ gameGuid, op: 'upsert_pokemon', pokemon: serializePokemon(newPokemon) });
      setCharacters(prev => [...prev, newPokemon]);
      navigate(`${base}/Characters/${newPokemon.id}`);
    }
  };

  // Handle exporting to PDF
  const handleExportPDF = () => {
    window.print();
  };

  // Handle character selection
  const handleSelectCharacter = (id: string) => {
    navigate(`${base}/Characters/${id}`);
  };

  // Handle reordering characters via DnD
  const handleReorderCharacters = (orderedIds: string[]) => {
    setCharacters(prev => {
      const updated = prev.map(c => {
        const newIdx = orderedIds.indexOf(c.id);
        if (newIdx === -1) return c;
        const reindexed = setIndex(c, newIdx);
        sendGameUpdate({ gameGuid, op: 'upsert_pokemon', pokemon: serializePokemon(reindexed) });
        return reindexed;
      });
      return updated.sort((a, b) => a.index - b.index);
    });
  };

  // Handle delete character
  const handleDeleteCharacter = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setShowDeleteConfirmation({ id, x: event.clientX, y: event.clientY });
  };

  const confirmDelete = () => {
    if (showDeleteConfirmation) {
      sendGameUpdate({ gameGuid, op: 'delete_pokemon', pokemonId: showDeleteConfirmation.id });
      setCharacters(prev => prev.filter(c => c.id !== showDeleteConfirmation.id));
      if (selectedCharacterId === showDeleteConfirmation.id) {
        const remaining = characters.filter(c => c.id !== showDeleteConfirmation.id);
        navigate(remaining.length > 0 ? `${base}/Characters/${remaining[0].id}` : `${base}/Characters`, { replace: true });
      }
      setShowDeleteConfirmation(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(null);
  };

  const propertyFields = useCharacterPropertyFields(selectedCharacter, setCharacters, gameGuid);

  // Build character list items (sorted by index)
  const characterListItems = [...characters]
    .sort((a, b) => a.index - b.index)
    .map(character => ({
    id: character.id,
    content: (
      <CharacterCard
        name={character.name}
        pokemonName={character.pokemonName}
        level={character.level}
        type1={character.type1}
        type2={character.type2 || undefined}
        currentHp={character.currentHp}
        maxHp={getMaxHp(character)}
        isActive={character.id === selectedCharacterId}
      />
    )
  }));

  return (
    <div className="characters-page">
      <div className="characters-page-toolbar">
        <CharacterToolbar
          canExport={selectedCharacter !== null}
          onNewCharacter={handleNewCharacter}
          onExportPDF={handleExportPDF}
        />
      </div>

      <div className="characters-page-content">
        <CharacterList
          items={characterListItems}
          currentItemId={selectedCharacterId}
          onItemClick={handleSelectCharacter}
          onDeleteClick={handleDeleteCharacter}
          onReorder={handleReorderCharacters}
        />

        <div className="characters-page-main">
          {selectedCharacter ? (
            <div className="characters-page-sheet-container">
              <CharacterSheet pokemon={selectedCharacter} fillNameAndLevel={!selectedCharacter.isPlayerCharacter}/>
            </div>
          ) : (
            <div className="characters-page-empty">
              <p>No character selected. Create a new character to get started.</p>
            </div>
          )}
        </div>

        {selectedCharacter && (
          <CharacterPropertiesPanel fields={propertyFields} />
        )}
      </div>

      {showDeleteConfirmation && (
        <ConfirmPopover
          x={showDeleteConfirmation.x}
          y={showDeleteConfirmation.y}
          message="Delete this character?"
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};
