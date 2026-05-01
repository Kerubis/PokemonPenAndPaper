import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Menu } from './components/ui/Menu'
import { HomePage } from './pages/HomePage'
import { CharactersPage } from './pages/CharactersPage'
import { EncounterPage } from './pages/EncounterPage'
import { RulesPage } from './pages/RulesPage'
import { MusicProvider } from './contexts/MusicContext'
import { GameProvider } from './contexts/GameContext'

function AppInner() {
  return (
    <div className="app-container">
      <Menu />

      <div className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/Home" replace />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Characters" element={<CharactersPage />} />
          <Route path="/Characters/:guid" element={<CharactersPage />} />
          <Route path="/Encounter" element={<EncounterPage />} />
          <Route path="/Encounter/:guid" element={<EncounterPage />} />
          <Route path="/Rules" element={<RulesPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <MusicProvider>
      <GameProvider>
        <AppInner />
      </GameProvider>
    </MusicProvider>
  );
}

export default App
