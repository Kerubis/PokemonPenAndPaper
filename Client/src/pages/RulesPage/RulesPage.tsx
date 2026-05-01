import React from 'react';
import { PrintIcon } from '@/components/ui/icons';
import './RulesPage.css';

export const RulesPage: React.FC = () => {
  const handlePrint = () => window.print();

  return (
    <div className="rules-page-wrapper">
      <div className="rules-page-toolbar no-print">
        <button className="rules-print-btn" onClick={handlePrint}>
          <PrintIcon width={16} height={16} />
          Print
        </button>
      </div>

      <div className="rules-page">
        <div className="rules-header">
          <div className="rules-title">Pokémon Pen &amp; Paper</div>
          <div className="rules-subtitle">OneShot Rulebook</div>
        </div>

        <div className="rules-columns">
          {/* ── Left column ── */}
          <div className="rules-col">
            <section className="rules-section">
              <h2>Core Mechanics</h2>
              <p>
                Pokémon OneShot is a simplified pen-and-paper RPG for quick adventures.
                Players control a single Pokémon, make skill checks with a d20, and battle
                wild Pokémon or rival trainers across a short scenario.
              </p>
              <p>
                All actions that have a meaningful chance of failure call for a <strong>d20 roll</strong>.
                Roll at or above the Difficulty Class (DC) set by the GM to succeed.
              </p>
            </section>

            <section className="rules-section">
              <h2>Stats</h2>
              <ul>
                <li><strong>HP:</strong> Total hit points. Tracked on the sheet with tick boxes.</li>
                <li><strong>Attack:</strong> Modifier for physical moves.</li>
                <li><strong>Sp. Attack:</strong> Modifier for special moves.</li>
                <li><strong>Defense:</strong> Reduces incoming physical damage.</li>
                <li><strong>Sp. Defense:</strong> Reduces incoming special damage.</li>
                <li><strong>Speed:</strong> Determines turn order in combat.</li>
              </ul>
            </section>

            <section className="rules-section">
              <h2>Ability Checks</h2>
              <p>When attempting a non-combat action, roll <strong>d20 + (stat / 5)</strong> rounded down vs. a DC set by the GM.</p>
              <div className="rules-skill-groups">
                <div className="rules-skill-group">
                  <div className="rules-skill-group-header physical">Physical <span>(+ Attack)</span></div>
                  <ul>
                    <li>Athletics</li>
                    <li>Acrobatics</li>
                    <li>Sleight of Hand</li>
                    <li>Stealth</li>
                    <li>Intimidation</li>
                  </ul>
                </div>
                <div className="rules-skill-group">
                  <div className="rules-skill-group-header mental">Mental <span>(+ Sp. Attack)</span></div>
                  <ul>
                    <li>Perception</li>
                    <li>Knowledge</li>
                    <li>Insight</li>
                    <li>Conversation</li>
                    <li>Medicine</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="rules-section">
              <h2>Movement Speed</h2>
              <ul>
                <li><strong>Walk:</strong> Default land movement in metres per round.</li>
                <li><strong>Swim:</strong> Speed while in water.</li>
                <li><strong>Climb:</strong> Speed while scaling surfaces.</li>
                <li><strong>Fly:</strong> Aerial speed.</li>
              </ul>
              <p className="rules-note">
                Movement speeds are species-based and shown on the character sheet.
                Difficult terrain halves movement speed.
              </p>
            </section>

            <section className="rules-section">
              <h2>Character Traits</h2>
              <p>
                Each Pokémon has one <strong>Flaw</strong> and one <strong>Strength</strong>.
                These are narrative tags — the GM may call on them to grant benefits or impose penalties.
              </p>
            </section>
          </div>

          {/* ── Right column ── */}
          <div className="rules-col">
            <section className="rules-section">
              <h2>Combat</h2>
              <p>
                At the start of an encounter each Pokémon is placed into the turn order according to their Speed. Highest goes first.
              </p>
              <p>On your turn you may:</p>
              <ul>
                <li>Move up to your Walk (or Fly/Swim) speed.</li>
                <li>Use <strong>one ability</strong>.</li>
                <li>Perform <strong>one free interaction</strong>.</li>
              </ul>
            </section>

            <section className="rules-section">
              <h2>Using an Ability</h2>
              <ol>
                <li>Declare the ability and its target.</li>
                <li>Roll <strong>d20</strong>. If the result ≥ the ability's <strong>Accuracy</strong>, the attack hits.</li>
                <li>Roll the ability's <strong>Damage dice + modifiers</strong>.</li>
                <li>Apply <strong>type effectiveness</strong> (see table below).</li>
                <li>Subtract the defender's Defense modifiers.</li>
                <li>Reduce the defender's HP by that amount.</li>
              </ol>
              <p>
                <strong>Critical Hit:</strong> A d20 result of <strong>20</strong> is a critical hit — the attack
                hits automatically regardless of Accuracy. Damage is calculated as{' '}
                <strong>damage dice roll + maximum damage dice value + modifiers</strong>.
              </p>
            </section>

            <section className="rules-section">
              <h2>Type Effectiveness</h2>
              <table className="rules-table">
                <thead>
                  <tr><th>Modifier</th><th>Condition</th></tr>
                </thead>
                <tbody>
                  <tr><td>×4</td><td>Double weakness</td></tr>
                  <tr><td>×2</td><td>Weakness</td></tr>
                  <tr><td>×1</td><td>Neutral</td></tr>
                  <tr><td>×½</td><td>Resistance</td></tr>
                  <tr><td>×¼</td><td>Double resistance</td></tr>
                  <tr><td>×0</td><td>Immunity — no effect</td></tr>
                </tbody>
              </table>
            </section>

            <section className="rules-section">
              <h2>Fainted &amp; Recovery</h2>
              <p>
                A Pokémon reduced to 0 HP is <strong>fainted</strong> and can no longer act.
                It recovers to full HP after a <strong>long rest</strong> (overnight) or to half HP
                after a <strong>short rest</strong> (30 minutes, once per day).
              </p>
              <p>At the start of each of its turns while fainted, it makes a <strong>death save</strong>: roll d20. Collect <strong>3 successes</strong> to stabilise or <strong>3 failures</strong> to be out of the adventure.</p>
              <ul>
                <li><strong>10+</strong> — success.</li>
                <li><strong>1–9</strong> — failure.</li>
                <li><strong>20</strong> — instant stabilise and regain 1 HP.</li>
              </ul>
              <p>An ally may use their action to make a <strong>Medicine</strong> check (DC 10) to immediately stabilise a fainted Pokémon, ending death saves.</p>
            </section>

            <section className="rules-section">
              <h2>Levelling Up</h2>
              <p>
                The GM awards experience at the end of each encounter. On level-up:
              </p>
              <ul>
                <li>Gain <strong>+5</strong> Max HP automatically.</li>
                <li>Allocate <strong>1 stat point</strong> to any stat.</li>
              </ul>
            </section>
          </div>
        </div>

        <div className="rules-footer">
          Pokémon Pen &amp; Paper Rulebook
        </div>
      </div>
    </div>
  );
};
