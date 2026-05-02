import React, { useRef, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { formatPokedexNumber } from '@/lib/utils';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();
  const base = `/${gameId}`;
  const { gameName, setGameName, pokemon, encounters, importGame, exportGame } = useGame();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState<string>(gameName);
  const importInputRef = useRef<HTMLInputElement>(null);

  const playerCharacters = useMemo(() => pokemon.filter(p => p.isPlayerCharacter), [pokemon]);
  const activeEncounters = useMemo(() => encounters.filter(e => !e.finished), [encounters]);

  const commitName = () => {
    const trimmed = nameInput.trim() || 'My Pokemon Game';
    setGameName(trimmed);
    setEditingName(false);
  };

  const handleExport = () => {
    const json = exportGame();
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
      const json = ev.target?.result as string;
      importGame(json).catch(() => alert('Failed to import: invalid game file.'));
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
          <button className="home-page-action-btn home-page-action-btn--exit" onClick={() => navigate('/')}>Exit Game</button>
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
              onClick={() => navigate(`${base}/Characters/${p.id}`)}
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
              onClick={() => navigate(`${base}/Encounter/${e.guid}`)}
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
