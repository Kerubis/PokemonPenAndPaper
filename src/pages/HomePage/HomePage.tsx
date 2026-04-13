import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadPokemon, loadEncounters, loadGame, exportGameAsJson, importGameFromJson } from '@/features/game';
import type { Pokemon } from '@/features/pokemon/types';
import type { Encounter } from '@/features/encounters';
import { formatPokedexNumber } from '@/lib/utils';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [playerCharacters, setPlayerCharacters] = useState<Pokemon[]>([]);
  const [activeEncounters, setActiveEncounters] = useState<Encounter[]>([]);
  const [gameName, setGameName] = useState<string>('');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState<string>('');
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const allPokemon = loadPokemon();
    const allEncounters = loadEncounters();
    setPlayerCharacters(allPokemon.filter(p => p.isPlayerCharacter));
    setActiveEncounters(allEncounters.filter(e => !e.finished));
    const gameState = loadGame();
    const name = gameState?.gameName ?? 'My Pokemon Game';
    setGameName(name);
    setNameInput(name);
  }, []);

  const commitName = () => {
    const trimmed = nameInput.trim() || 'My Pokemon Game';
    setGameName(trimmed);
    setEditingName(false);
    const gameState = loadGame();
    if (gameState) {
      importGameFromJson(JSON.stringify({ ...gameState, gameName: trimmed }));
    }
  };

  const handleExport = () => {
    const json = exportGameAsJson();
    if (!json) return;
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gameName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = ev.target?.result as string;
        importGameFromJson(json);
        const allPokemon = loadPokemon();
        const allEncounters = loadEncounters();
        const gameState = loadGame();
        setPlayerCharacters(allPokemon.filter(p => p.isPlayerCharacter));
        setActiveEncounters(allEncounters.filter(e => !e.finished));
        const name = gameState?.gameName ?? 'My Pokemon Game';
        setGameName(name);
        setNameInput(name);
      } catch {
        alert('Failed to import: invalid game file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="home-page">
      <div className="home-page-top">
        {editingName ? (
          <input
            className="home-page-title-input"
            value={nameInput}
            autoFocus
            onChange={e => setNameInput(e.target.value)}
            onBlur={commitName}
            onKeyDown={e => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') { setNameInput(gameName); setEditingName(false); } }}
          />
        ) : (
          <h1 className="home-page-title" title="Click to edit" onClick={() => setEditingName(true)}>
            {gameName}
          </h1>
        )}
        <div className="home-page-actions">
          <button className="home-page-action-btn" onClick={handleExport}>Export JSON</button>
          <button className="home-page-action-btn" onClick={() => importInputRef.current?.click()}>Import JSON</button>
          <input ref={importInputRef} type="file" accept=".json,application/json" style={{ display: 'none' }} onChange={handleImportFile} />
        </div>
      </div>

      <div className="home-page-columns">
      <div className="home-page-column">
        <div className="home-page-column-header">
          <span className="home-page-column-title">Player Characters</span>
          <span className="home-page-column-count">{playerCharacters.length}</span>
        </div>
        <ul className="home-page-list">
          {playerCharacters.length === 0 && (
            <li className="home-page-list-empty">No player characters yet</li>
          )}
          {playerCharacters.map(p => (
            <li
              key={p.id}
              className="home-page-list-item"
              onClick={() => navigate(`/Characters/${p.id}`)}
            >
              <span className="home-page-list-item-sub">{formatPokedexNumber(p.pokedexEntry)} {p.pokemonName}</span>
              <span className="home-page-list-item-name">{p.name || <em>Unnamed</em>}</span>
              <span className="home-page-list-item-badge">Lv.{p.level}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="home-page-column">
        <div className="home-page-column-header">
          <span className="home-page-column-title">Encounters</span>
          <span className="home-page-column-count">{activeEncounters.length}</span>
        </div>
        <ul className="home-page-list">
          {activeEncounters.length === 0 && (
            <li className="home-page-list-empty">No active encounters</li>
          )}
          {activeEncounters.map(e => (
            <li
              key={e.guid}
              className="home-page-list-item"
              onClick={() => navigate(`/Encounter/${e.guid}`)}
            >
              <span className="home-page-list-item-name">{e.name || <em>Unnamed</em>}</span>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </div>
  );
};
