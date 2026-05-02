import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { Pokemon } from '@/features/pokemon/types/Pokemon';
import type { Encounter } from '@/features/encounters/types/Encounter';
import type { GameState } from '@/features/game/types/GameState';
import {
  loadGameFromServer,
  saveGameToServer,
  importGameFromServer,
  exportGameAsJson,
  sendGameUpdate,
} from '@/features/game/services/gameApi';
import { serializePokemon, deserializePokemon } from '@/features/game/utils/serialization';
import { serializeEncounter, deserializeEncounter } from '@/features/encounters/utils/serialization';

// ---- Types ----------------------------------------------------------------

export interface GameContextValue {
  /** Whether the initial load from the server is still in progress */
  loading: boolean;
  /** True when the load completed but the requested game guid was not found */
  notFound: boolean;
  guid: string;
  gameName: string;
  pokemon: Pokemon[];
  encounters: Encounter[];

  setGameName: (name: string) => void;
  setPokemon: React.Dispatch<React.SetStateAction<Pokemon[]>>;
  setEncounters: React.Dispatch<React.SetStateAction<Encounter[]>>;

  /** Full-replace sync to the server (import / export only) */
  saveNow: () => Promise<void>;
  /** Replace entire game state from a JSON string */
  importGame: (json: string) => Promise<void>;
  /** Serialise current state to a JSON string (no server call) */
  exportGame: () => string;
}

// ---- Context ----------------------------------------------------------------

const GameContext = createContext<GameContextValue | null>(null);

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}

// ---- Provider ----------------------------------------------------------------

export const GameProvider: React.FC<{ children: React.ReactNode; gameId?: string }> = ({ children, gameId }) => {
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [guid, setGuid] = useState(() => crypto.randomUUID());
  const [gameName, setGameNameRaw] = useState('My Pokemon Game');
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [encounters, setEncounters] = useState<Encounter[]>([]);

  const guidRef = useRef(guid);
  useEffect(() => { guidRef.current = guid; }, [guid]);

  /** Persists the new name to the server and updates local state. */
  const setGameName = useCallback((name: string) => {
    setGameNameRaw(name);
    sendGameUpdate({ gameGuid: guidRef.current, op: 'set_game_name', gameName: name });
  }, []);

  // Ref so imperative callbacks always see the latest values without re-creating.
  const stateRef = useRef({ guid, gameName, pokemon, encounters });
  useEffect(() => {
    stateRef.current = { guid, gameName, pokemon, encounters };
  }, [guid, gameName, pokemon, encounters]);

  // ---- Initial load from server -------------------------------------------
  useEffect(() => {
    let cancelled = false;
    loadGameFromServer(gameId)
      .then((state: GameState | null) => {
        if (cancelled) return;
        if (!state) { setNotFound(true); return; }
        setGuid(state.guid as ReturnType<typeof crypto.randomUUID>);
        setGameNameRaw(state.gameName);
        setPokemon((state.pokemon ?? []).map(deserializePokemon));
        setEncounters((state.encounters ?? []).map(deserializeEncounter));
      })
      .catch((err: unknown) => console.error('[GameContext] Failed to load game:', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [gameId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Imperative save / import / export ----------------------------------
  const saveNow = useCallback(async () => {
    const { guid, gameName, pokemon, encounters } = stateRef.current;
    await saveGameToServer(guid, gameName, pokemon, encounters);
  }, []);

  const importGame = useCallback(async (json: string) => {
    const state = await importGameFromServer(json);
    setGuid(state.guid as ReturnType<typeof crypto.randomUUID>);
    setGameNameRaw(state.gameName);
    setPokemon((state.pokemon ?? []).map(deserializePokemon));
    setEncounters((state.encounters ?? []).map(deserializeEncounter));
  }, []);

  const exportGame = useCallback((): string => {
    const { guid, gameName, pokemon, encounters } = stateRef.current;
    const state: GameState = {
      guid,
      gameName,
      pokemon: pokemon.map(serializePokemon),
      encounters: encounters.map(serializeEncounter),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return exportGameAsJson(state);
  }, []);

  const value: GameContextValue = {
    loading,
    notFound,
    guid,
    gameName,
    pokemon,
    encounters,
    setGameName,
    setPokemon,
    setEncounters,
    saveNow,
    importGame,
    exportGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
