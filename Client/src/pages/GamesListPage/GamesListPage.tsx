import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listGamesFromServer } from '@/features/game/services/gameApi';
import type { GameSummary } from '@/features/game/services/gameApi';
import './GamesListPage.css';

export const GamesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<GameSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listGamesFromServer()
      .then(setGames)
      .catch((err: unknown) => setError(String(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="games-list-page">
      <h1 className="games-list-title">Choose a Game</h1>

      {loading && <p className="games-list-status">Loading games…</p>}
      {error && <p className="games-list-status games-list-status--error">Failed to load games: {error}</p>}

      {!loading && !error && games.length === 0 && (
        <p className="games-list-status">No games found on the server.</p>
      )}

      {!loading && !error && games.length > 0 && (
        <ul className="games-list">
          {games.map(game => (
            <li
              key={game.guid}
              className="games-list-item"
              onClick={() => navigate(`/${game.guid}/Home`)}
            >
              <span className="games-list-item-name">{game.gameName}</span>
              <span className="games-list-item-meta">
                Last updated: {new Date(game.updatedAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
