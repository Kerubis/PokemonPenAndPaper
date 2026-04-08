import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EncounterToolbar } from '@/components/domain/EncounterToolbar';
import { EncounterSidePanel } from '@/components/domain/EncounterSidePanel';
import type { EncounterPropertyField } from '@/components/domain/EncounterSidePanel';
import { Encounter } from '@/features/encounters/types/Encounter';
import { useTurnOrder } from '@/features/encounters';
import { loadEncounters, loadPokemon, updateGame, loadGame } from '@/features/game';
import type { Pokemon } from '@/features/pokemon/types';
import { ConfirmPopover } from '@/components/ui/ConfirmPopover';
import { EncounterPropertiesPanel } from '@/components/domain/EncounterPropertiesPanel';
import { TurnOrderPanel } from '@/components/domain/TurnOrderPanel';
import './EncounterPage.css';
import { EncounterContent } from '@/components/domain/EncounterContent';

export const EncounterPage: React.FC = () => {
  const { guid } = useParams<{ guid?: string }>();
  const navigate = useNavigate();
  const selectedEncounterId = guid ?? null;

  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<{ x: number; y: number } | null>(null);

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
      const pokemon = loadPokemon();
      updateGame(gameGuid, gameName, pokemon, encounters);
    }
  }, [encounters]);

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
      label: 'Music Link',
      type: 'text',
      value: selectedEncounter.musicLink,
      onChange: (value) => {
        setEncounters(prev => prev.map(e => {
          if (e.guid === selectedEncounter.guid) {
            e.setMusicLink(value as string);
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
          encounters={encounters.map(e => ({ id: e.guid, name: e.name }))}
          selectedEncounterId={selectedEncounterId}
          onSelectEncounter={handleSelectEncounter}
          battleActive={!!turnOrder}
        />
      </div>

      <div className="encounter-page-content">
        <EncounterSidePanel
          fields={sidePanelFields}
          onDelete={selectedEncounter ? handleDeleteClick : undefined}
          availablePokemon={availablePokemonForEncounter}
          onAddPokemon={selectedEncounter ? handleAddPokemon : undefined}
          musicLink={selectedEncounter?.musicLink}
        />

        <div className="encounter-page-main">
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
            </>
          ) : (
            <div className="encounter-page-empty">
              <p>No encounter selected. Create a new encounter to get started.</p>
            </div>
          )}
        </div>

        {selectedEncounter && (
          <EncounterPropertiesPanel
            pokemon={selectedPokemon}
            onRemovePokemon={selectedPokemon ? handleRemovePokemon : undefined}
          />
        )}
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
