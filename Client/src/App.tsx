import './App.css'
import { Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom'
import { Menu } from './components/ui/Menu'
import { HomePage } from './pages/HomePage'
import { CharactersPage } from './pages/CharactersPage'
import { EncounterPage } from './pages/EncounterPage'
import { RulesPage } from './pages/RulesPage'
import { GamesListPage } from './pages/GamesListPage'
import { MusicProvider } from './contexts/MusicContext'
import { GameProvider, useGame } from './contexts/GameContext'

function GameGuard() {
  const { loading, notFound } = useGame();
  if (loading) return null;
  if (notFound) return <Navigate to="/" replace />;
  return <Outlet />;
}

function GameLayout() {
  const { gameId } = useParams<{ gameId: string }>();

  return (
    <GameProvider gameId={gameId}>
      <div className="app-container">
        <Menu />
        <div className="app-content">
          <GameGuard />
        </div>
      </div>
    </GameProvider>
  );
}

function AppInner() {
  return (
    <Routes>
      <Route path="/" element={<GamesListPage />} />
      <Route path="/:gameId" element={<GameLayout />}>
        <Route index element={<Navigate to="Home" replace />} />
        <Route path="Home" element={<HomePage />} />
        <Route path="Characters" element={<CharactersPage />} />
        <Route path="Characters/:guid" element={<CharactersPage />} />
        <Route path="Encounter" element={<EncounterPage />} />
        <Route path="Encounter/:guid" element={<EncounterPage />} />
        <Route path="Rules" element={<RulesPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <MusicProvider>
      <AppInner />
    </MusicProvider>
  );
}

export default App
