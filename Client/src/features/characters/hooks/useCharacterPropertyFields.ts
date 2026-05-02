import { useMemo } from 'react';
import type { PropertyField } from '@/components/domain/CharacterPropertiesPanel';
import type { Pokemon } from '@/features/pokemon/types/Pokemon';
import {
  setPokemonName,
  setLevel,
  setHp,
  setAttack,
  setSpecialAttack,
  setDefense,
  setSpecialDefense,
  setSpeed,
  setIsPlayerCharacter,
} from '@/features/pokemon/types/pokemonOps';
import { sendGameUpdate } from '@/features/game/services/gameApi';
import { serializePokemon } from '@/features/game/utils/serialization';

/**
 * Builds the CharacterPropertiesPanel field definitions for the given Pokemon.
 * Each onChange returns a new Pokemon via a pure update function.
 */
export function useCharacterPropertyFields(
  character: Pokemon | undefined,
  setCharacters: React.Dispatch<React.SetStateAction<Pokemon[]>>,
  gameGuid: string,
): PropertyField[] {
  return useMemo(() => {
    if (!character) return [];

    /**
     * Applies a pure updater to the matching character, replaces it in the
     * list, and persists the change to the server.
     */
    function updateCharacter(
      id: string,
      updater: (p: Pokemon) => Pokemon,
    ) {
      setCharacters(prev =>
        prev.map(c => {
          if (c.id !== id) return c;
          const updated = updater(c);
          sendGameUpdate({ gameGuid, op: 'upsert_pokemon', pokemon: serializePokemon(updated) });
          return updated;
        }),
      );
    }

    return [
      {
        label: 'Name',
        type: 'text',
        value: character.name,
        onChange: (value) => {
          updateCharacter(character.id, p => setPokemonName(p, value as string));
        },
      },
      {
        label: 'Level',
        type: 'number',
        value: character.level,
        onChange: (value) => {
          const level = parseInt(value as string, 10) || 1;
          updateCharacter(character.id, p => setLevel(p, level));
        },
        options: { min: 1, max: 100 },
      },
      {
        label: 'HP',
        type: 'number',
        value: character.hp,
        onChange: (value) => {
          const hp = parseInt(value as string, 10) || 0;
          updateCharacter(character.id, p => setHp(p, hp));
        },
        options: { min: 0, max: 250 },
      },
      {
        label: 'Attack',
        type: 'number',
        value: character.attack,
        onChange: (value) => {
          const attack = parseInt(value as string, 10) || 0;
          updateCharacter(character.id, p => setAttack(p, attack));
        },
        options: { min: 0, max: 250 },
      },
      {
        label: 'Special Attack',
        type: 'number',
        value: character.specialAttack,
        onChange: (value) => {
          const specialAttack = parseInt(value as string, 10) || 0;
          updateCharacter(character.id, p => setSpecialAttack(p, specialAttack));
        },
        options: { min: 0, max: 250 },
      },
      {
        label: 'Defense',
        type: 'number',
        value: character.defense,
        onChange: (value) => {
          const defense = parseInt(value as string, 10) || 0;
          updateCharacter(character.id, p => setDefense(p, defense));
        },
        options: { min: 0, max: 250 },
      },
      {
        label: 'Special Defense',
        type: 'number',
        value: character.specialDefense,
        onChange: (value) => {
          const specialDefense = parseInt(value as string, 10) || 0;
          updateCharacter(character.id, p => setSpecialDefense(p, specialDefense));
        },
        options: { min: 0, max: 250 },
      },
      {
        label: 'Speed',
        type: 'number',
        value: character.speed,
        onChange: (value) => {
          const speed = parseInt(value as string, 10) || 0;
          updateCharacter(character.id, p => setSpeed(p, speed));
        },
        options: { min: 0, max: 250 },
      },
      {
        label: 'Is Player Character',
        type: 'checkbox',
        value: character.isPlayerCharacter,
        onChange: (value) => {
          updateCharacter(character.id, p => setIsPlayerCharacter(p, Boolean(value)));
        },
      },
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    character?.id,
    character?.name,
    character?.level,
    character?.hp,
    character?.attack,
    character?.specialAttack,
    character?.defense,
    character?.specialDefense,
    character?.speed,
    character?.isPlayerCharacter,
    gameGuid,
    setCharacters,
  ]);
}

