import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Menu.css';
import { HomeIcon, PokeballIcon, BattleIcon, DocumentIcon, MusicIcon } from '@/components/ui/icons';
import { useMusicContext } from '@/contexts/MusicContext';
import { MusicEmbed } from '@/components/domain/MusicEmbed';

export const Menu: React.FC = () => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `menu-item${isActive ? ' active' : ''}`;

  const { currentLink, isPlaying } = useMusicContext();
  const [musicOpen, setMusicOpen] = useState(false);

  return (
    <div className="app-menu">
      <div className="menu-items-top">
        <NavLink className={navClass} to="/Home" title="Home">
          <HomeIcon />
        </NavLink>
        <NavLink className={navClass} to="/Characters" title="Characters">
          <PokeballIcon />
        </NavLink>
        <NavLink className={navClass} to="/Encounter" title="Encounter">
          <BattleIcon />
        </NavLink>
      </div>
      <div className="menu-items-bottom">
        <button
          className={`menu-item menu-item-music${musicOpen ? ' active' : ''}`}
          title="Music"
          onClick={() => setMusicOpen(prev => !prev)}
        >
          <MusicIcon />
          {currentLink && <span className={`menu-music-indicator${isPlaying ? '' : ' menu-music-indicator--paused'}`} />}
        </button>
        <NavLink className={navClass} to="/Rules" title="Rules">
          <DocumentIcon />
        </NavLink>
      </div>

      {/* Panel is always rendered so the iframe is never unmounted (music keeps playing) */}
      <div className={`menu-music-panel${musicOpen ? ' menu-music-panel--open' : ''}`}>
        <div className="menu-music-panel-header">
          <span className="menu-music-panel-title">Battle Music</span>
          <button
            className="menu-music-panel-close"
            onClick={() => setMusicOpen(false)}
            aria-label="Close music panel"
          >✕</button>
        </div>
        <MusicEmbed musicLinks={currentLink ? [currentLink] : []} />
      </div>
    </div>
  );
};
