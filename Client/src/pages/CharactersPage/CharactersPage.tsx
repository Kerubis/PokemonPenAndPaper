import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CharacterToolbar } from '@/components/domain/CharacterToolbar';
import { CharacterList } from '@/components/domain/CharacterList';
import { CharacterPropertiesPanel } from '@/components/domain/CharacterPropertiesPanel';
import type { PropertyField } from '@/components/domain/CharacterPropertiesPanel';
import { CharacterSheet } from '@/components/domain/CharacterSheet';
import { CharacterCard } from '@/components/domain/CharacterCard';
import { createPokemonById } from '@/features/pokemon/data/pokemonRegistry';
import { useGame } from '@/contexts/GameContext';
import { ConfirmPopover } from '@/components/ui/ConfirmPopover';
import { sendGameUpdate } from '@/features/game/services/gameApi';
import { serializePokemon } from '@/features/game/utils/serialization';
import './CharactersPage.css';

export const CharactersPage: React.FC = () => {
  const { guid } = useParams<{ guid?: string }>();
  const navigate = useNavigate();
  const selectedCharacterId = guid ?? null;

  const { pokemon: characters, setPokemon: setCharacters, guid: gameGuid } = useGame();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<{ id: string; x: number; y: number } | null>(null);

  // Navigate to first character if none selected
  useEffect(() => {
    if (characters.length > 0 && !guid) {
      navigate(`/Characters/${characters[0].id}`, { replace: true });
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
      navigate(`/Characters/${newPokemon.id}`);
    }
  };

  // Handle exporting to PDF
  const handleExportPDF = () => {
    window.print();
  };

  // Handle character selection
  const handleSelectCharacter = (id: string) => {
    navigate(`/Characters/${id}`);
  };

  // Handle reordering characters via DnD
  const handleReorderCharacters = (orderedIds: string[]) => {
    setCharacters(prev => {
      const updated = [...prev];
      orderedIds.forEach((id, idx) => {
        const char = updated.find(c => c.id === id);
        if (char) {
          char.setIndex(idx);
          sendGameUpdate({ gameGuid, op: 'upsert_pokemon', pokemon: serializePokemon(char) });
        }
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
        navigate(remaining.length > 0 ? `/Characters/${remaining[0].id}` : '/Characters', { replace: true });
      }
      setShowDeleteConfirmation(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(null);
  };

  // Build property fields for the selected character
  const propertyFields: PropertyField[] = selectedCharacter ? [
    {
      label: 'Name',
      type: 'text',
      value: selectedCharacter.name,
      onChange: (value) => {
        setCharacters(prev => prev.map(c =>
          c.id === selectedCharacter.id
            ? (() => {
                const updated = createPokemonById(c.pokedexEntry, {
                  id: c.id,
                  name: value as string,
                  level: c.level,
                  hp: c.hp,
                  currentHp: c.currentHp,
                  attack: c.attack,
                  specialAttack: c.specialAttack,
                  defense: c.defense,
                  specialDefense: c.specialDefense,
                  speed: c.speed,
                  flaw: c.flaw,
                  strength: c.strength,
                  abilities: c.abilities,
                  isPlayerCharacter: c.isPlayerCharacter,
                  index: c.index
                }) ?? c;
                if (updated !== c) sendGameUpdate({ gameGuid, op: 'upsert_pokemon', pokemon: serializePokemon(updated) });
                return updated;
              })()
            : c
        ));
      }
    },
    {
      label: 'Level',
      type: 'number',
      value: selectedCharacter.level,
      onChange: (value) => {
        const level = parseInt(value as string, 10) || 1;
        setCharacters(prev => prev.map(c => {
          if (c.id === selectedCharacter.id) {
            const updated = createPokemonById(c.pokedexEntry, {
              id: c.id,
              name: c.name,
              level: c.level,
              hp: c.hp,
              currentHp: c.currentHp,
              attack: c.attack,
              specialAttack: c.specialAttack,
              defense: c.defense,
              specialDefense: c.specialDefense,
              speed: c.speed,
              flaw: c.flaw,
              strength: c.strength,
              abilities: c.abilities,
              isPlayerCharacter: c.isPlayerCharacter,
              index: c.index
            });
            if (updated) { updated.setLevel(level); sendGameUpdate({ gameGuid, op: 'upsert_pokemon', pokemon: serializePokemon(updated) }); }
            return updated ?? c;
          }
          return c;
        }));
      },
      options: { min: 1, max: 100 }
    },
    {
      label: 'HP',
      type: 'number',
      value: selectedCharacter.hp,
      onChange: (value) => {
        const hp = parseInt(value as string, 10) || 0;
        setCharacters(prev => prev.map(c => {
          if (c.id === selectedCharacter.id) {
            const updated = createPokemonById(c.pokedexEntry, {
              id: c.id,
              name: c.name,
              level: c.level,
              hp: c.hp,
              currentHp: c.currentHp,
              attack: c.attack,
              specialAttack: c.specialAttack,
              defense: c.defense,
              specialDefense: c.specialDefense,
              speed: c.speed,
              flaw: c.flaw,
              strength: c.strength,
              abilities: c.abilities,
              isPlayerCharacter: c.isPlayerCharacter,
              index: c.index
            });
            if (updated) { updated.setHp(hp); sendGameUpdate({ gameGuid, op: 'upsert_pokemon', pokemon: serializePokemon(updated) }); }
            return updated ?? c;
          }
          return c;
        }));
      },
      options: { min: 0, max: 250 }
    },
    {
      label: 'Attack',
      type: 'number',
      value: selectedCharacter.attack,
      onChange: (value) => {
        const attack = parseInt(value as string, 10) || 0;
        setCharacters(prev => prev.map(c => {
          if (c.id === selectedCharacter.id) {
            const updated = createPokemonById(c.pokedexEntry, {
              id: c.id,
              name: c.name,
              level: c.level,
              hp: c.hp,
              currentHp: c.currentHp,
              attack: c.attack,
              specialAttack: c.specialAttack,
              defense: c.defense,
              specialDefense: c.specialDefense,
              speed: c.speed,
              flaw: c.flaw,
              strength: c.strength,
              abilities: c.abilities,
              isPlayerCharacter: c.isPlayerCharacter,
              index: c.index
            });
            if (updated) { updated.setAttack(attack); sendGameUpdate({ gameGuid, op: 'upsert_pokemon', pokemon: serializePokemon(updated) }); }
            return updated ?? c;
          }
          return c;
        }));
      },
      options: { min: 0, max: 250 }
    },
    {
      label: 'Special Attack',
      type: 'number',
      value: selectedCharacter.specialAttack,
      onChange: (value) => {
        const specialAttack = parseInt(value as string, 10) || 0;
        setCharacters(prev => prev.map(c => {
          if (c.id === selectedCharacter.id) {
            const updated = createPokemonById(c.pokedexEntry, {
              id: c.id,
              name: c.name,
              level: c.level,
              hp: c.hp,
              currentHp: c.currentHp,
              attack: c.attack,
              specialAttack: c.specialAttack,
              defense: c.defense,
              specialDefense: c.specialDefense,
              speed: c.speed,
              flaw: c.flaw,
              strength: c.strength,
              abilities: c.abilities,
              isPlayerCharacter: c.isPlayerCharacter,
              index: c.index
            });
            if (updated) { updated.setSpecialAttack(specialAttack); sendGameUpdate({ gameGuid, op: 'upsert_pokemon', pokemon: serializePokemon(updated) }); }
            return updated ?? c;
          }
          return c;
        }));
      },
      options: { min: 0, max: 250 }
    },
    {
      label: 'Defense',
      type: 'number',
      value: selectedCharacter.defense,
      onChange: (value) => {
        const defense = parseInt(value as string, 10) || 0;
        setCharacters(prev => prev.map(c => {
          if (c.id === selectedCharacter.id) {
            const updated = createPokemonById(c.pokedexEntry, {
              id: c.id,
              name: c.name,
              level: c.level,
              hp: c.hp,
              currentHp: c.currentHp,
              attack: c.attack,
              specialAttack: c.specialAttack,
              defense: c.defense,
              specialDefense: c.specialDefense,
              speed: c.speed,
              flaw: c.flaw,
              strength: c.strength,
              abilities: c.abilities,
              isPlayerCharacter: c.isPlayerCharacter,
              index: c.index
            });
            if (updated) { updated.setDefense(defense); sendGameUpdate({ gameGuid, op: 'upsert_pokemon', pokemon: serializePokemon(updated) }); }
            return updated ?? c;
          }
          return c;
        }));
      },
      options: { min: 0, max: 250 }
    },
    {
      label: 'Special Defense',
      type: 'number',
      value: selectedCharacter.specialDefense,
      onChange: (value) => {
        const specialDefense = parseInt(value as string, 10) || 0;
        setCharacters(prev => prev.map(c => {
          if (c.id === selectedCharacter.id) {
            const updated = createPokemonById(c.pokedexEntry, {
              id: c.id,
              name: c.name,
              level: c.level,
              hp: c.hp,
              currentHp: c.currentHp,
              attack: c.attack,
              specialAttack: c.specialAttack,
              defense: c.defense,
              specialDefense: c.specialDefense,
              speed: c.speed,
              flaw: c.flaw,
              strength: c.strength,
              abilities: c.abilities,
              isPlayerCharacter: c.isPlayerCharacter,
              index: c.index
            });
            if (updated) { updated.setSpecialDefense(specialDefense); sendGameUpdate({ gameGuid, op: 'upsert_pokemon', pokemon: serializePokemon(updated) }); }
            return updated ?? c;
          }
          return c;
        }));
      },
      options: { min: 0, max: 250 }
    },
    {
      label: 'Speed',
      type: 'number',
      value: selectedCharacter.speed,
      onChange: (value) => {
        const speed = parseInt(value as string, 10) || 0;
        setCharacters(prev => prev.map(c => {
          if (c.id === selectedCharacter.id) {
            const updated = createPokemonById(c.pokedexEntry, {
              id: c.id,
              name: c.name,
              level: c.level,
              hp: c.hp,
              currentHp: c.currentHp,
              attack: c.attack,
              specialAttack: c.specialAttack,
              defense: c.defense,
              specialDefense: c.specialDefense,
              speed: c.speed,
              flaw: c.flaw,
              strength: c.strength,
              abilities: c.abilities,
              isPlayerCharacter: c.isPlayerCharacter,
              index: c.index
            });
            if (updated) { updated.setSpeed(speed); sendGameUpdate({ gameGuid, op: 'upsert_pokemon', pokemon: serializePokemon(updated) }); }
            return updated ?? c;
          }
          return c;
        }));
      },
      options: { min: 0, max: 250 }
    },
    {
      label: 'Is Player Character',
      type: 'checkbox',
      value: selectedCharacter.isPlayerCharacter,
      onChange: (value) => {
        const isPlayerCharacter = Boolean(value);
        setCharacters(prev => prev.map(c => {
          if (c.id === selectedCharacter.id) {
            const updated = createPokemonById(c.pokedexEntry, {
              id: c.id,
              name: c.name,
              level: c.level,
              hp: c.hp,
              currentHp: c.currentHp,
              attack: c.attack,
              specialAttack: c.specialAttack,
              defense: c.defense,
              specialDefense: c.specialDefense,
              speed: c.speed,
              flaw: c.flaw,
              strength: c.strength,
              abilities: c.abilities,
              isPlayerCharacter: c.isPlayerCharacter,
              index: c.index
            });
            if (updated) { updated.setIsPlayerCharacter(isPlayerCharacter); sendGameUpdate({ gameGuid, op: 'upsert_pokemon', pokemon: serializePokemon(updated) }); }
            return updated ?? c;
          }
          return c;
        }));
      },
      options: { min: 0, max: 250 }
    },
  ] : [];

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
        maxHp={character.maxHp}
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
