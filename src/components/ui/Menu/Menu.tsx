import React from 'react';
import { NavLink } from 'react-router-dom';
import './Menu.css';
import { HomeIcon, PokeballIcon, BattleIcon, DocumentIcon } from '@/components/ui/icons';

export const Menu: React.FC = () => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `menu-item${isActive ? ' active' : ''}`;

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
        <NavLink className={navClass} to="/Rules" title="Rules">
          <DocumentIcon />
        </NavLink>
      </div>
    </div>
  );
};
