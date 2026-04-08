import React, { useState } from 'react';
import type { TurnOrder, TurnEffect } from '@/features/encounters/types/TurnOrder';
import { getEffectiveInitiative, getBaseInitiative } from '@/features/encounters/types/TurnOrder';
import type { Pokemon } from '@/features/pokemon/types';
import { CharacterCard } from '@/components/domain/CharacterCard';
import { PlusIcon, TrashIcon, MinusIcon } from '@/components/ui/icons';
import './TurnOrderPanel.css';

interface AddEffectState {
    targetPokemonId: string | null; // null = global
    name: string;
    description: string;
    remainingRounds: string; // "-1" = persistent
}

const DEFAULT_ADD_EFFECT: AddEffectState = {
    targetPokemonId: null,
    name: '',
    description: '',
    remainingRounds: '3',
};

interface TurnOrderPanelProps {
    turnOrder: TurnOrder | null;
    pokemon: Pokemon[];
    onStartBattle: () => void;
    onNextTurn: () => void;
    onPrevTurn: () => void;
    onEndBattle: () => void;
    onSetInitiativeOverride: (pokemonId: string, value: number) => void;
    onClearInitiativeOverride: (pokemonId: string) => void;
    onAddEffect: (effect: Omit<TurnEffect, 'id'>) => void;
    onRemoveEffect: (effectId: string) => void;
    onSelectPokemon?: (pokemon: Pokemon) => void;
    selectedPokemonId?: string | null;
}

export const TurnOrderPanel: React.FC<TurnOrderPanelProps> = ({
    turnOrder,
    pokemon,
    onStartBattle,
    onNextTurn,
    onPrevTurn,
    onEndBattle,
    onSetInitiativeOverride,
    onClearInitiativeOverride,
    onAddEffect,
    onRemoveEffect,
    onSelectPokemon,
    selectedPokemonId,
}) => {
    const [editingInitiativeId, setEditingInitiativeId] = useState<string | null>(null);
    const [initiativeInputValue, setInitiativeInputValue] = useState('');
    const [addEffectTarget, setAddEffectTarget] = useState<string | 'global' | null>(null);
    const [addEffectForm, setAddEffectForm] = useState<AddEffectState>(DEFAULT_ADD_EFFECT);
    const [editingEffectId, setEditingEffectId] = useState<string | null>(null);

    const pokemonMap = React.useMemo(() => {
        const map: Record<string, Pokemon> = {};
        pokemon.forEach(p => { map[p.id] = p; });
        return map;
    }, [pokemon]);

    const getPokemonLabel = (pokemonId: string) => {
        const p = pokemonMap[pokemonId];
        if (!p) return 'Unknown';
        return p.name ? `${p.name} (${p.pokemonName})` : p.pokemonName;
    };

    // --- Initiative editing ---

    const startEditInitiative = (pokemonId: string, currentValue: number) => {
        setEditingInitiativeId(pokemonId);
        setInitiativeInputValue(String(currentValue));
    };

    const commitInitiative = (pokemonId: string, baseInitiative: number) => {
        const parsed = parseFloat(initiativeInputValue);
        if (!isNaN(parsed) && parsed !== baseInitiative) {
            onSetInitiativeOverride(pokemonId, parsed);
        } else if (!isNaN(parsed) && parsed === baseInitiative) {
            onClearInitiativeOverride(pokemonId);
        }
        setEditingInitiativeId(null);
    };

    // --- Add effect form ---

    const openAddEffect = (target: string | 'global') => {
        setEditingEffectId(null);
        setAddEffectTarget(target);
        setAddEffectForm({
            ...DEFAULT_ADD_EFFECT,
            targetPokemonId: target === 'global' ? null : target,
        });
    };

    const openEditEffect = (effect: TurnEffect) => {
        setEditingEffectId(effect.id);
        setAddEffectTarget(effect.pokemonId ?? 'global');
        setAddEffectForm({
            targetPokemonId: effect.pokemonId ?? null,
            name: effect.name,
            description: effect.description ?? '',
            remainingRounds: String(effect.remainingRounds),
        });
    };

    const cancelEffectForm = () => {
        setAddEffectTarget(null);
        setAddEffectForm(DEFAULT_ADD_EFFECT);
        setEditingEffectId(null);
    };

    const submitAddEffect = () => {
        if (!addEffectForm.name.trim()) return;
        const rounds = parseInt(addEffectForm.remainingRounds, 10);
        if (editingEffectId) {
            onRemoveEffect(editingEffectId);
        }
        onAddEffect({
            name: addEffectForm.name.trim(),
            description: addEffectForm.description.trim() || undefined,
            remainingRounds: isNaN(rounds) ? -1 : rounds,
            pokemonId: addEffectForm.targetPokemonId ?? undefined,
        });
        cancelEffectForm();
    };

    const globalEffects = turnOrder ? turnOrder.effects.filter(e => !e.pokemonId) : [];
    const currentPokemonId = turnOrder?.entries[turnOrder.currentIndex]?.pokemonId;

    // Pre-battle preview: pokemon sorted by base initiative
    const previewEntries = React.useMemo(() =>
        [...pokemon].sort((a, b) => getBaseInitiative(b) - getBaseInitiative(a)),
        [pokemon]
    );

    return (
        <div className="turn-order-panel">
            {/* Header */}
            <div className="turn-order-header">
                {turnOrder ? (
                    <>
                        <span className="turn-order-round">Round {turnOrder.currentRound}</span>
                        <div className="turn-order-controls">
                            <button className="turn-order-btn" onClick={onPrevTurn} title="Previous turn">‹</button>
                            <button className="turn-order-btn" onClick={onNextTurn} title="Next turn">›</button>
                            <button className="turn-order-btn turn-order-btn--end" onClick={onEndBattle} title="End battle">End</button>
                        </div>
                    </>
                ) : (
                    <>
                        <span className="turn-order-round">Turn Order</span>
                        <button
                            className="turn-order-start-btn"
                            onClick={onStartBattle}
                            disabled={pokemon.length === 0}
                            title={pokemon.length === 0 ? 'Add Pokémon to start a battle' : 'Start battle'}
                        >
                            ⚔ Start Battle
                        </button>
                    </>
                )}
            </div>

            {/* Global effects — only during battle */}
            {turnOrder && (
                <>
                    <div className="turn-order-global-effects">
                        <div className="turn-order-section-label">
                            Global Effects
                            <button
                                className="turn-order-add-effect-btn"
                                onClick={() => openAddEffect('global')}
                                title="Add global effect"
                            >
                                <PlusIcon />
                            </button>
                        </div>
                        {globalEffects.length === 0 ? (
                            <span className="turn-order-no-effects">None</span>
                        ) : (
                            <div className="turn-order-effects">
                                {globalEffects.map(effect => (
                                    <EffectChip key={effect.id} effect={effect} onRemove={onRemoveEffect} onEdit={openEditEffect} />
                                ))}
                            </div>
                        )}
                    </div>
                    {addEffectTarget === 'global' && (
                        <AddEffectForm
                            form={addEffectForm}
                            onChange={setAddEffectForm}
                            onSubmit={submitAddEffect}
                            onCancel={cancelEffectForm}
                            isEditing={!!editingEffectId}
                        />
                    )}
                </>
            )}

            {/* Entry list */}
            <div className="turn-order-entries">
                {turnOrder ? (
                    // Active battle: use turn order entries
                    turnOrder.entries.map((entry, index) => {
                        const isActive = entry.pokemonId === currentPokemonId;
                        const effectiveInit = getEffectiveInitiative(entry);
                        const isEditing = editingInitiativeId === entry.pokemonId;
                        const pokemonEffects = turnOrder.effects.filter(e => e.pokemonId === entry.pokemonId);
                        const p = pokemonMap[entry.pokemonId];

                        return (
                            <React.Fragment key={entry.pokemonId}>
                                <div className={`turn-order-entry${isActive ? ' turn-order-entry--active' : ''}`}>
                                    <span className="turn-order-position">{index + 1}</span>

                                    <div className="turn-order-entry-info">
                                        {p ? (
                                            <CharacterCard
                                                name={p.name}
                                                pokemonName={p.pokemonName}
                                                level={p.level}
                                                type1={p.type1}
                                                type2={p.type2 ?? undefined}
                                                currentHp={p.currentHp}
                                                maxHp={p.maxHp}
                                                isActive={p.id === selectedPokemonId}
                                                onClick={() => onSelectPokemon?.(p)}
                                            />
                                        ) : (
                                            <span className="turn-order-pokemon-name">{getPokemonLabel(entry.pokemonId)}</span>
                                        )}
                                    </div>

                                    {pokemonEffects.length > 0 && (
                                        <div className="turn-order-entry-effects">
                                            {pokemonEffects.map(effect => (
                                                <EffectChip key={effect.id} effect={effect} onRemove={onRemoveEffect} onEdit={openEditEffect} />
                                            ))}
                                        </div>
                                    )}

                                    <div className="turn-order-initiative-area">
                                        {isEditing ? (
                                            <input
                                                className="turn-order-initiative-input"
                                                type="number"
                                                step="0.1"
                                                value={initiativeInputValue}
                                                onChange={e => setInitiativeInputValue(e.target.value)}
                                                onFocus={e => e.target.select()}
                                                onBlur={() => commitInitiative(entry.pokemonId, entry.baseInitiative)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') commitInitiative(entry.pokemonId, entry.baseInitiative);
                                                    if (e.key === 'Escape') setEditingInitiativeId(null);
                                                }}
                                                autoFocus
                                            />
                                        ) : (
                                            <button
                                                className={`turn-order-initiative${entry.initiativeOverride !== null ? ' turn-order-initiative--overridden' : ''}`}
                                                onClick={() => startEditInitiative(entry.pokemonId, effectiveInit)}
                                                title={entry.initiativeOverride !== null
                                                    ? `Override active (base: ${entry.baseInitiative.toFixed(2)}). Click to edit.`
                                                    : 'Click to override initiative'}
                                            >
                                                {effectiveInit % 1 === 0 ? effectiveInit : effectiveInit.toFixed(2)}
                                                {entry.initiativeOverride !== null && <span className="turn-order-override-marker">*</span>}
                                            </button>
                                        )}
                                        {entry.initiativeOverride !== null && (
                                            <button
                                                className="turn-order-clear-override"
                                                onClick={() => onClearInitiativeOverride(entry.pokemonId)}
                                                title="Clear override, restore base initiative"
                                            >
                                                <MinusIcon />
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        className="turn-order-add-effect-btn"
                                        onClick={() => openAddEffect(entry.pokemonId)}
                                        title={`Add effect to ${getPokemonLabel(entry.pokemonId)}`}
                                    >
                                        <PlusIcon />
                                    </button>
                                </div>

                                {addEffectTarget === entry.pokemonId && (
                                    <AddEffectForm
                                        form={addEffectForm}
                                        onChange={setAddEffectForm}
                                        onSubmit={submitAddEffect}
                                        onCancel={cancelEffectForm}
                                        isEditing={!!editingEffectId}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })
                ) : (
                    // Pre-battle preview
                    previewEntries.length === 0 ? (
                        <div className="turn-order-empty">
                            <p>Add Pokémon to the encounter.</p>
                        </div>
                    ) : (
                        previewEntries.map((p, index) => {
                            const initiative = getBaseInitiative(p);
                            return (
                                <div key={p.id} className="turn-order-entry">
                                    <span className="turn-order-position">{index + 1}</span>
                                    <div className="turn-order-entry-info">
                                        <CharacterCard
                                            name={p.name}
                                            pokemonName={p.pokemonName}
                                            level={p.level}
                                            type1={p.type1}
                                            type2={p.type2 ?? undefined}
                                            currentHp={p.currentHp}
                                            maxHp={p.maxHp}
                                            isActive={p.id === selectedPokemonId}
                                            onClick={() => onSelectPokemon?.(p)}
                                        />
                                    </div>
                                    <div className="turn-order-initiative-area">
                                        <span className="turn-order-initiative turn-order-initiative--preview">
                                            {initiative % 1 === 0 ? initiative : initiative.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )
                )}
            </div>
        </div>
    );
};

// --- Sub-components ---

interface EffectChipProps {
    effect: TurnEffect;
    onRemove: (id: string) => void;
    onEdit: (effect: TurnEffect) => void;
}

const EffectChip: React.FC<EffectChipProps> = ({ effect, onRemove, onEdit }) => (
    <span
        className={`turn-order-effect-chip${effect.remainingRounds === -1 ? ' turn-order-effect-chip--persistent' : ''} turn-order-effect-chip--clickable`}
        title={effect.description
            ? `${effect.description}${effect.remainingRounds !== -1 ? ` (${effect.remainingRounds} rounds left)` : ' (persistent)'}`
            : effect.remainingRounds !== -1 ? `${effect.remainingRounds} rounds left` : 'Persistent'}
        onClick={() => onEdit(effect)}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onEdit(effect); }}
    >
        {effect.name}
        {effect.remainingRounds !== -1 && (
            <span className="turn-order-effect-rounds">{effect.remainingRounds}</span>
        )}
        <button
            className="turn-order-effect-remove"
            onClick={e => { e.stopPropagation(); onRemove(effect.id); }}
            title="Remove effect"
        >
            <TrashIcon />
        </button>
    </span>
);

interface AddEffectFormProps {
    form: AddEffectState;
    onChange: (form: AddEffectState) => void;
    onSubmit: () => void;
    onCancel: () => void;
    isEditing?: boolean;
}

const AddEffectForm: React.FC<AddEffectFormProps> = ({ form, onChange, onSubmit, onCancel, isEditing }) => (
    <div className="turn-order-add-effect-form">
        <input
            className="turn-order-effect-input"
            type="text"
            placeholder="Effect name *"
            value={form.name}
            onChange={e => onChange({ ...form, name: e.target.value })}
            onKeyDown={e => { if (e.key === 'Enter') onSubmit(); if (e.key === 'Escape') onCancel(); }}
            autoFocus
        />
        <input
            className="turn-order-effect-input"
            type="text"
            placeholder="Description (optional)"
            value={form.description}
            onChange={e => onChange({ ...form, description: e.target.value })}
            onKeyDown={e => { if (e.key === 'Enter') onSubmit(); if (e.key === 'Escape') onCancel(); }}
        />
        <div className="turn-order-effect-form-row">
            <label className="turn-order-effect-label">Rounds</label>
            <input
                className="turn-order-effect-input turn-order-effect-input--short"
                type="number"
                min="-1"
                value={form.remainingRounds}
                onChange={e => onChange({ ...form, remainingRounds: e.target.value })}
                title="-1 = persistent whole battle"
            />
            <span className="turn-order-effect-hint">(-1 = persistent)</span>
        </div>
        <div className="turn-order-effect-form-actions">
            <button className="turn-order-effect-btn turn-order-effect-btn--confirm" onClick={onSubmit}>{isEditing ? 'Save' : 'Add'}</button>
            <button className="turn-order-effect-btn" onClick={onCancel}>Cancel</button>
        </div>
    </div>
);
