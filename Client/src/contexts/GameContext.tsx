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
} from '@/features/game/services/gameApi';
import { serializePokemon } from '@/features/game/utils/serialization';
import { serializeEncounter } from '@/features/encounters/utils/serialization';

// ---- Types ----------------------------------------------------------------

export interface GameContextValue {
  /** Whether the initial load from the server is still in progress */
  loading: boolean;
  guid: string;
  gameName: string;
  pokemon: Pokemon[];
  encounters: Encounter[];

  setGameName: (name: string) => void;
  setPokemon: React.Dispatch<React.SetStateAction<Pokemon[]>>;
  setEncounters: React.Dispatch<React.SetStateAction<Encounter[]>>;

  /** Persist current state to the server immediately */
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

const SAVE_DEBOUNCE_MS = 800;

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [guid, setGuid] = useState(() => crypto.randomUUID());
  const [gameName, setGameName] = useState('My Pokemon Game');
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [encounters, setEncounters] = useState<Encounter[]>([]);

  // We keep a ref so the debounced save always uses the latest values.
  const stateRef = useRef({ guid, gameName, pokemon, encounters });
  useEffect(() => {
    stateRef.current = { guid, gameName, pokemon, encounters };
  }, [guid, gameName, pokemon, encounters]);

  // ---- Initial load from server -------------------------------------------
  useEffect(() => {
    let cancelled = false;
    loadGameFromServer()
      .then((state: GameState | null) => {
        if (cancelled || !state) return;
        setGuid(state.guid as ReturnType<typeof crypto.randomUUID>);
        setGameName(state.gameName);
        // Deserialize lazily – the serialized arrays are stored in the
        // GameState but pages already handle deserialization via hooks, so
        // we preserve the raw GameState here and decode below.
        import('@/features/game/utils/serialization').then(({ deserializePokemon }) => {
          import('@/features/encounters/utils/serialization').then(({ deserializeEncounter }) => {
            if (cancelled) return;
            setPokemon((state.pokemon ?? []).map(deserializePokemon));
            setEncounters((state.encounters ?? []).map(deserializeEncounter));
          });
        });
      })
      .catch((err: unknown) => console.error('[GameContext] Failed to load game:', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Debounced auto-save ------------------------------------------------
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const { guid, gameName, pokemon, encounters } = stateRef.current;
      saveGameToServer(guid, gameName, pokemon, encounters).catch((err: unknown) =>
        console.error('[GameContext] Auto-save failed:', err),
      );
    }, SAVE_DEBOUNCE_MS);
  }, []);

  // Trigger save whenever data changes (but not on initial loading).
  const initialLoadDoneRef = useRef(false);
  useEffect(() => {
    if (loading) return;
    if (!initialLoadDoneRef.current) {
      initialLoadDoneRef.current = true;
      return; // skip the first render after load
    }
    scheduleSave();
  }, [loading, pokemon, encounters, gameName, scheduleSave]);

  // ---- Imperative save / import / export ----------------------------------
  const saveNow = useCallback(async () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    const { guid, gameName, pokemon, encounters } = stateRef.current;
    await saveGameToServer(guid, gameName, pokemon, encounters);
  }, []);

  const importGame = useCallback(async (json: string) => {
    const state = await importGameFromServer(json);
    const { deserializePokemon } = await import('@/features/game/utils/serialization');
    const { deserializeEncounter } = await import('@/features/encounters/utils/serialization');
    setGuid(state.guid as ReturnType<typeof crypto.randomUUID>);
    setGameName(state.gameName);
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
