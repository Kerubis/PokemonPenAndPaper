import React from 'react';
import './RulesPage.css';

export const RulesPage: React.FC = () => {
  return (
    <div className="rules-page">
      <h1>Pokemon OneShot Rules</h1>
      
      <section className="rules-section">
        <h2>Core Mechanics</h2>
        <p>Pokemon OneShot is a simplified pen and paper RPG system for quick Pokemon adventures.</p>
      </section>
      
      <section className="rules-section">
        <h2>Stats</h2>
        <ul>
          <li><strong>HP:</strong> Hit Points - determines how much damage you can take</li>
          <li><strong>Attack:</strong> Physical attack power</li>
          <li><strong>Special Attack:</strong> Special attack power</li>
          <li><strong>Defense:</strong> Physical defense</li>
          <li><strong>Special Defense:</strong> Special defense</li>
          <li><strong>Speed:</strong> Turn order and evasion</li>
        </ul>
      </section>
      
      <section className="rules-section">
        <h2>Combat</h2>
        <p>Abilities have accuracy ratings and deal damage based on dice rolls. Type effectiveness applies modifiers to damage.</p>
      </section>
      
      <section className="rules-section">
        <h2>Character Traits</h2>
        <p>Each Pokemon has a <strong>Flaw</strong> and <strong>Strength</strong> that affect gameplay in narrative situations.</p>
      </section>
    </div>
  );
};
