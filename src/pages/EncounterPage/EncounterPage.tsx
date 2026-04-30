import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EncounterToolbar } from '@/components/domain/EncounterToolbar';
import { EncounterSidePanel } from '@/components/domain/EncounterSidePanel';
import type { EncounterPropertyField } from '@/components/domain/EncounterSidePanel';
import { Encounter } from '@/features/encounters/types/Encounter';
import { useTurnOrder } from '@/features/encounters';
import { loadEncounters, loadPokemon, updateGame, loadGame } from '@/features/game';
import type { Pokemon } from '@/features/pokemon/types';
import { ConfirmPopover } from '@/components/ui/ConfirmPopover';
import { TurnOrderPanel } from '@/components/domain/TurnOrderPanel';
import './EncounterPage.css';
import { EncounterContent } from '@/components/domain/EncounterContent';
import { DrawingTool } from '@/components/domain/DrawingTool';

export const EncounterPage: React.FC = () => {
  const { guid } = useParams<{ guid?: string }>();
  const navigate = useNavigate();
  const selectedEncounterId = guid ?? null;

  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<{ x: number; y: number } | null>(null);

  // Floating TurnOrderPanel drag state
  const [turnOrderPos, setTurnOrderPos] = useState({ x: 16, y: 16 });
  const dragState = useRef<{ startMouseX: number; startMouseY: number; startPosX: number; startPosY: number } | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  const handleTurnOrderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const header = (e.target as HTMLElement).closest('.turn-order-header');
    if (!header) return;
    e.preventDefault();
    dragState.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startPosX: turnOrderPos.x,
      startPosY: turnOrderPos.y,
    };
    const onMouseMove = (me: MouseEvent) => {
      if (!dragState.current) return;
      const container = mainRef.current;
      const floating = floatingRef.current;
      const maxX = container ? container.clientWidth - (floating?.offsetWidth ?? 340) : Infinity;
      const maxY = container ? container.clientHeight - (floating?.offsetHeight ?? 100) : Infinity;
      setTurnOrderPos({
        x: Math.max(0, Math.min(maxX, dragState.current.startPosX + me.clientX - dragState.current.startMouseX)),
        y: Math.max(0, Math.min(maxY, dragState.current.startPosY + me.clientY - dragState.current.startMouseY)),
      });
    };
    const onMouseUp = () => {
      dragState.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const {
    turnOrder,
    initTurnOrder,
    endTurnOrder,
    nextTurn,
    prevTurn,
    setInitiativeOverride,
    clearInitiativeOverride,
    addEffect,
    removeEffect,
    addPokemonToTurnOrder,
    removePokemonFromTurnOrder,
  } = useTurnOrder();

  // Load encounters and pokemon from storage on mount
  useEffect(() => {
    const loadedEncounters = loadEncounters();
    const loadedPokemon = loadPokemon();
    setEncounters(loadedEncounters);
    setAllPokemon(loadedPokemon);
    if (loadedEncounters.length > 0 && !guid) {
      navigate(`/Encounter/${loadedEncounters[0].guid}`, { replace: true });
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // Save encounters to storage whenever they change
  useEffect(() => {
    if (encounters.length > 0) {
      const gameState = loadGame();
      const gameGuid = gameState?.guid || crypto.randomUUID();
      const gameName = gameState?.gameName || 'My Pokemon Game';
      updateGame(gameGuid, gameName, allPokemon, encounters);
    }
  }, [encounters]);

  // Save pokemon to storage whenever they change (e.g. damage dealt)
  useEffect(() => {
    if (allPokemon.length > 0) {
      const gameState = loadGame();
      const gameGuid = gameState?.guid || crypto.randomUUID();
      const gameName = gameState?.gameName || 'My Pokemon Game';
      const currentEncounters = loadEncounters();
      updateGame(gameGuid, gameName, allPokemon, currentEncounters);
    }
  }, [allPokemon]);

  const selectedEncounter = encounters.find(e => e.guid === selectedEncounterId);

  // Reset selected pokemon and turn order when encounter changes
  const handleSelectEncounter = (id: string) => {
    navigate(`/Encounter/${id}`);
    setSelectedPokemon(null);
    endTurnOrder();
  };

  // Handle creating a new encounter
  const handleNewEncounter = () => {
    const newEncounter = new Encounter({
      name: 'New Encounter'
    });

    setEncounters(prev => [...prev, newEncounter]);
    navigate(`/Encounter/${newEncounter.guid}`);
  };

  // Handle delete encounter
  const handleDeleteClick = (event: React.MouseEvent) => {
    setShowDeleteConfirmation({ x: event.clientX, y: event.clientY });
  };

  const confirmDelete = () => {
    if (selectedEncounterId) {
      setEncounters(prev => prev.filter(e => e.guid !== selectedEncounterId));
      const remaining = encounters.filter(e => e.guid !== selectedEncounterId);
      navigate(remaining.length > 0 ? `/Encounter/${remaining[0].guid}` : '/Encounter', { replace: true });
    }
    setShowDeleteConfirmation(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(null);
  };

  // Build property fields for the selected encounter
  const sidePanelFields: EncounterPropertyField[] = selectedEncounter ? [
    {
      label: 'Name',
      type: 'text',
      value: selectedEncounter.name,
      onChange: (value) => {
        setEncounters(prev => prev.map(e => {
          if (e.guid === selectedEncounter.guid) {
            e.setName(value as string);
          }
          return e;
        }));
      }
    },
    {
      label: 'Finished',
      type: 'checkbox',
      value: selectedEncounter.finished,
      onChange: (value) => {
        setEncounters(prev => prev.map(e => {
          if (e.guid === selectedEncounter.guid) {
            e.setFinished(value as boolean);
          }
          return e;
        }));
      }
    },
  ] : [];

  // Get pokemon in the selected encounter
  const encounterPokemon = selectedEncounter
    ? allPokemon.filter(p => selectedEncounter.pokemonGuids.includes(p.id))
    : [];

  // Get pokemon not yet in the selected encounter
  const availablePokemonForEncounter = selectedEncounter
    ? allPokemon
      .filter(p => !selectedEncounter.pokemonGuids.includes(p.id))
      .map(p => ({ id: p.id, label: p.name || p.pokemonName, metadata: { name: p.pokemonName } }))
    : [];

  const handleAddPokemon = (pokemonId: string) => {
    setEncounters(prev => prev.map(e => {
      if (e.guid === selectedEncounterId) {
        e.addPokemon(pokemonId);
      }
      return e;
    }));
    if (turnOrder) {
      const p = allPokemon.find(p => p.id === pokemonId);
      if (p) addPokemonToTurnOrder(p);
    }
  };

  const handleRemovePokemon = () => {
    if (!selectedPokemon || !selectedEncounterId) return;
    setEncounters(prev => prev.map(e => {
      if (e.guid === selectedEncounterId) {
        e.removePokemon(selectedPokemon.id);
      }
      return e;
    }));
    if (turnOrder) {
      removePokemonFromTurnOrder(selectedPokemon.id);
    }
    setSelectedPokemon(null);
  };

  const handleStartBattle = () => {
    initTurnOrder(encounterPokemon);
  };

  return (
    <div className="encounter-page">
      <div className="encounter-page-toolbar">
        <EncounterToolbar
          onNewEncounter={handleNewEncounter}
          encounters={encounters.map(e => ({ id: e.guid, name: e.name, index: e.index, finished: e.finished }))}
          selectedEncounterId={selectedEncounterId}
          onSelectEncounter={handleSelectEncounter}
          onReorder={(orderedIds) => {
            setEncounters(prev => {
              const updated = prev.map(e => {
                const newIndex = orderedIds.indexOf(e.guid);
                if (newIndex !== -1) e.setIndex(newIndex);
                return e;
              });
              return [...updated];
            });
          }}
        />
      </div>

      <div className="encounter-page-content">
        <EncounterSidePanel
          fields={sidePanelFields}
          onDelete={selectedEncounter ? handleDeleteClick : undefined}
          availablePokemon={availablePokemonForEncounter}
          onAddPokemon={selectedEncounter ? handleAddPokemon : undefined}
          musicLinks={selectedEncounter?.musicLinks ?? []}
          onMusicLinksChange={selectedEncounter ? (links) => {
            setEncounters(prev => prev.map(e => {
              if (e.guid === selectedEncounter.guid) e.setMusicLinks(links);
              return e;
            }));
          } : undefined}
          selectedPokemon={selectedPokemon}
          onRemovePokemon={selectedPokemon ? handleRemovePokemon : undefined}
          onDamageDealt={() => setAllPokemon(prev => [...prev])}
        />

        <div className="encounter-page-main" ref={mainRef}>
          {selectedEncounter ? (
            <>
              <EncounterContent
                encounter={selectedEncounter}
                onStoryChange={(story) => {
                  setEncounters(prev => prev.map(e => {
                    if (e.guid === selectedEncounterId) {
                      e.setStory(story);
                    }
                    return e;
                  }));
                }}
              />
              <DrawingTool
                key={selectedEncounter.guid}
                initialDrawing={selectedEncounter.mapDrawing}
                onDrawingChange={(dataUrl) => {
                  setEncounters(prev => prev.map(e => {
                    if (e.guid === selectedEncounterId) {
                      e.setMapDrawing(dataUrl);
                    }
                    return e;
                  }));
                }}
              />
              <div
                className="turn-order-floating"
                style={{ left: turnOrderPos.x, top: turnOrderPos.y }}
                onMouseDown={handleTurnOrderMouseDown}
                ref={floatingRef}
              >
                <TurnOrderPanel
                  turnOrder={turnOrder}
                  pokemon={encounterPokemon}
                  onStartBattle={handleStartBattle}
                  onNextTurn={nextTurn}
                  onPrevTurn={prevTurn}
                  onEndBattle={endTurnOrder}
                  onSetInitiativeOverride={setInitiativeOverride}
                  onClearInitiativeOverride={clearInitiativeOverride}
                  onAddEffect={addEffect}
                  onRemoveEffect={removeEffect}
                  onSelectPokemon={setSelectedPokemon}
                  selectedPokemonId={selectedPokemon?.id ?? null}
                />
              </div>
            </>
          ) : (
            <div className="encounter-page-empty">
              <p>No encounter selected. Create a new encounter to get started.</p>
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirmation && (
        <ConfirmPopover
          x={showDeleteConfirmation.x}
          y={showDeleteConfirmation.y}
          message="Delete this encounter?"
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};
