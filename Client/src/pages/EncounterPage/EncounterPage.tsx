import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EncounterToolbar } from '@/components/domain/EncounterToolbar';
import { EncounterSidePanel } from '@/components/domain/EncounterSidePanel';
import type { EncounterPropertyField } from '@/components/domain/EncounterSidePanel';
import { createEncounter, setEncounterIndex, setEncounterTurnOrder } from '@/features/encounters/types/encounterOps';
import { useTurnOrder } from '@/features/encounters';
import type { TurnOrder } from '@/features/encounters/types/TurnOrder';
import { useGame } from '@/contexts/GameContext';
import type { Pokemon } from '@/features/pokemon/types';
import { ConfirmPopover } from '@/components/ui/ConfirmPopover';
import { TurnOrderPanel } from '@/components/domain/TurnOrderPanel';
import './EncounterPage.css';
import { EncounterContent } from '@/components/domain/EncounterContent';
import { DrawingTool } from '@/components/domain/DrawingTool';
import { sendGameUpdate, updateEncounterDrawing } from '@/features/game/services/gameApi';
import { serializeEncounter } from '@/features/encounters/utils/serialization';

export const EncounterPage: React.FC = () => {
  const { gameId, guid } = useParams<{ gameId: string; guid?: string }>();
  const navigate = useNavigate();
  const base = `/${gameId}`;
  const selectedEncounterId = guid ?? null;

  const { guid: gameGuid, encounters, setEncounters, pokemon: allPokemon, setPokemon: setAllPokemon } = useGame();
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

  const selectedEncounter = encounters.find(e => e.guid === selectedEncounterId);
  const turnOrder = selectedEncounter?.turnOrder ?? null;

  // Stable ref so the setter callback never needs to be recreated
  const selectedEncounterIdRef = useRef<string | null>(null);
  selectedEncounterIdRef.current = selectedEncounterId;

  // Write turn order directly into the owning encounter
  const setEncounterTurnOrderState = useCallback((updater: TurnOrder | null | ((prev: TurnOrder | null) => TurnOrder | null)) => {
    setEncounters(prev => prev.map(e => {
      if (e.guid !== selectedEncounterIdRef.current) return e;
      const next = typeof updater === 'function' ? updater(e.turnOrder) : updater;
      const updated = setEncounterTurnOrder(e, next);
      sendGameUpdate({
        gameGuid,
        op: 'set_encounter_turn_order',
        encounterGuid: e.guid,
        turnOrder: next ?? null,
      });
      return updated;
    }));
  }, [gameGuid]);

  const {
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
  } = useTurnOrder(setEncounterTurnOrderState);

  // Navigate to first encounter if none selected
  useEffect(() => {
    if (encounters.length > 0 && !guid) {
      navigate(`${base}/Encounter/${encounters[0].guid}`, { replace: true });
    }
  }, [encounters, guid]); // eslint-disable-line react-hooks/exhaustive-deps

  // Switch encounter – turn order is stored on the encounter itself, no explicit save/restore needed
  const handleSelectEncounter = (id: string) => {
    navigate(`${base}/Encounter/${id}`);
    setSelectedPokemon(null);
  };

  // Handle creating a new encounter
  const handleNewEncounter = () => {
    const newEncounter = createEncounter({ name: 'New Encounter' });

    sendGameUpdate({ gameGuid, op: 'upsert_encounter', encounter: serializeEncounter(newEncounter) });
    setEncounters(prev => [...prev, newEncounter]);
    navigate(`${base}/Encounter/${newEncounter.guid}`);
  };

  // Handle delete encounter
  const handleDeleteClick = (event: React.MouseEvent) => {
    setShowDeleteConfirmation({ x: event.clientX, y: event.clientY });
  };

  const confirmDelete = () => {
    if (selectedEncounterId) {
      sendGameUpdate({ gameGuid, op: 'delete_encounter', encounterGuid: selectedEncounterId });
      setEncounters(prev => prev.filter(e => e.guid !== selectedEncounterId));
      const remaining = encounters.filter(e => e.guid !== selectedEncounterId);
      navigate(remaining.length > 0 ? `${base}/Encounter/${remaining[0].guid}` : `${base}/Encounter`, { replace: true });
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
        sendGameUpdate({ gameGuid, op: 'set_encounter_name', encounterGuid: selectedEncounter.guid, name: value as string });
        setEncounters(prev => prev.map(e =>
          e.guid === selectedEncounter.guid ? { ...e, name: value as string } : e
        ));
      }
    },
    {
      label: 'Finished',
      type: 'checkbox',
      value: selectedEncounter.finished,
      onChange: (value) => {
        sendGameUpdate({ gameGuid, op: 'set_encounter_finished', encounterGuid: selectedEncounter.guid, finished: value as boolean });
        setEncounters(prev => prev.map(e =>
          e.guid === selectedEncounter.guid ? { ...e, finished: value as boolean } : e
        ));
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
        const updated = { ...e, pokemonGuids: e.pokemonGuids.includes(pokemonId) ? e.pokemonGuids : [...e.pokemonGuids, pokemonId] };
        sendGameUpdate({ gameGuid, op: 'set_encounter_pokemon', encounterGuid: e.guid, pokemonGuids: [...updated.pokemonGuids] });
        return updated;
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
        const updated = { ...e, pokemonGuids: e.pokemonGuids.filter(g => g !== selectedPokemon.id) };
        sendGameUpdate({ gameGuid, op: 'set_encounter_pokemon', encounterGuid: e.guid, pokemonGuids: updated.pokemonGuids });
        return updated;
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
              return prev.map(e => {
                const newIndex = orderedIds.indexOf(e.guid);
                if (newIndex === -1) return e;
                sendGameUpdate({ gameGuid, op: 'set_encounter_index', encounterGuid: e.guid, index: newIndex });
                return setEncounterIndex(e, newIndex);
              });
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
          musicLinks={[...(selectedEncounter?.musicLinks ?? [])]}
          onMusicLinksChange={selectedEncounter ? (links) => {
            sendGameUpdate({ gameGuid, op: 'set_encounter_music', encounterGuid: selectedEncounter.guid, links });
            setEncounters(prev => prev.map(e =>
              e.guid === selectedEncounter.guid ? { ...e, musicLinks: links } : e
            ));
          } : undefined}
          selectedPokemon={selectedPokemon}
          onRemovePokemon={selectedPokemon ? handleRemovePokemon : undefined}
          onUpdatePokemon={(pokemonId, updater) => {
            setAllPokemon(prev => prev.map(p => p.id === pokemonId ? updater(p) : p));
          }}
        />

        <div className="encounter-page-main" ref={mainRef}>
          {selectedEncounter ? (
            <>
              <EncounterContent
                encounter={selectedEncounter}
                onStoryChange={(story) => {
                  sendGameUpdate({ gameGuid, op: 'set_encounter_story', encounterGuid: selectedEncounterId!, story });
                  setEncounters(prev => prev.map(e =>
                    e.guid === selectedEncounterId ? { ...e, story } : e
                  ));
                }}
              />
              <DrawingTool
                key={selectedEncounter.guid}
                initialDrawing={selectedEncounter.mapDrawing}
                onDrawingChange={(dataUrl) => {
                  updateEncounterDrawing(selectedEncounterId!, dataUrl);
                  setEncounters(prev => prev.map(e =>
                    e.guid === selectedEncounterId ? { ...e, mapDrawing: dataUrl } : e
                  ));
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
