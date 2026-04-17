import React, { useState, useRef, useEffect } from 'react';
import { SidePanel } from '@/components/ui/SidePanel';
import { Dropdown, type DropdownItem } from '@/components/ui/Dropdown';
import { TrashIcon, ChevronDownIcon } from '@/components/ui/icons';
import { PropertyFieldGroup } from '@/components/ui/PropertyField';
import type { MusicLink } from '@/features/encounters/types/Encounter';
import { useMusicContext } from '@/contexts/MusicContext';
import './EncounterSidePanel.css';

import type { PropertyField } from '@/components/ui/PropertyField';

export type EncounterPropertyField = PropertyField;

interface EncounterSidePanelProps {
  fields: EncounterPropertyField[];
  onDelete?: (event: React.MouseEvent) => void;
  availablePokemon?: { id: string; label: string; metadata?: { name: string } }[];
  onAddPokemon?: (id: string) => void;
  musicLinks?: MusicLink[];
  onMusicLinksChange?: (links: MusicLink[]) => void;
}

export const EncounterSidePanel: React.FC<EncounterSidePanelProps> = ({ fields, onDelete, availablePokemon = [], onAddPokemon, musicLinks = [], onMusicLinksChange }) => {
  const { currentLink, setCurrentLink } = useMusicContext();
  const [newUrl, setNewUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!addPopupOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        popupRef.current && !popupRef.current.contains(e.target as Node) &&
        addBtnRef.current && !addBtnRef.current.contains(e.target as Node)
      ) {
        setAddPopupOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [addPopupOpen]);

  // Flip popup upward if it would overflow the bottom of the viewport
  useEffect(() => {
    if (!addPopupOpen || !popupRef.current) return;
    const rect = popupRef.current.getBoundingClientRect();
    if (rect.bottom > window.innerHeight) {
      setPopupPos(prev => ({ ...prev, y: prev.y - rect.height }));
    }
  }, [addPopupOpen]);

  const handleAddLink = () => {
    if (!newUrl.trim() || !onMusicLinksChange) return;
    onMusicLinksChange([...musicLinks, { url: newUrl.trim(), description: newDesc.trim() }]);
    setNewUrl('');
    setNewDesc('');
    setAddPopupOpen(false);
  };

  if (fields.length === 0) {
    return null;
  }
  const renderPokemonItem = (item: DropdownItem) => (
    <>
      <span style={{ fontSize: '0.75rem', color: '#a0a0a0', fontWeight: 600, minWidth: '40px' }}>
        {item.metadata?.name}
      </span>
      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
        {item.label}
      </span>
    </>
  );

  return (
    <SidePanel title="Encounter" className="encounter-side-panel">
      {fields.map((field, index) => (
        <PropertyFieldGroup key={index} field={field} />
      ))}

      {onAddPokemon && (
        <div className="encounter-property-group">
          <label className="encounter-property-label">Add Pokemon</label>
          <div className="encounter-side-panel-add-pokemon">
            <Dropdown
              buttonContent={<>Add Pokemon <ChevronDownIcon style={{ marginLeft: '4px' }} /></>}
              items={availablePokemon.map(p => ({ id: p.id, label: p.label, metadata: p.metadata }))}
              onSelect={onAddPokemon}
              renderItem={renderPokemonItem}
              containerClassName="dropdown-full-width"
              buttonTitle="Add Pokemon to encounter"
            />
          </div>
        </div>
      )}

      <div className="encounter-side-panel-footer">
        {onMusicLinksChange && (
          <div className="encounter-music-links-section">
            <div className="encounter-music-links-header">
              <label className="encounter-property-label">Music Links</label>
              <div className="encounter-music-links-add-wrapper">
                <button
                  ref={addBtnRef}
                  className="encounter-music-link-add-title-btn"
                  onClick={(e) => {
                    setPopupPos({ x: e.clientX, y: e.clientY });
                    setAddPopupOpen(prev => !prev);
                  }}
                  title="Add music link"
                >
                  +
                </button>
                {addPopupOpen && (
                  <div
                    className="encounter-music-link-popup"
                    ref={popupRef}
                    style={{ position: 'fixed', left: popupPos.x, top: popupPos.y }}
                  >
                    <input
                      className="encounter-music-link-input"
                      placeholder="Description"
                      value={newDesc}
                      onChange={e => setNewDesc(e.target.value)}
                      autoFocus
                    />
                    <input
                      className="encounter-music-link-input"
                      placeholder="YouTube URL"
                      value={newUrl}
                      onChange={e => setNewUrl(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddLink()}
                    />
                    <button
                      className="encounter-music-link-popup-confirm"
                      disabled={!newUrl.trim()}
                      onClick={handleAddLink}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>
            {musicLinks.map((link, idx) => (
              <div
                key={idx}
                className={`encounter-music-link-row${currentLink?.url === link.url ? ' encounter-music-link-row--active' : ''}`}
                onClick={() => setCurrentLink(link)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setCurrentLink(link)}
                style={{ cursor: 'pointer' }}
              >
                <span className="encounter-music-link-desc">
                  {link.description || link.url}
                </span>
                <button
                  className="encounter-music-link-remove"
                  onClick={e => { e.stopPropagation(); onMusicLinksChange(musicLinks.filter((_, i) => i !== idx)); }}
                  title="Remove"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        )}
        {onDelete && (
          <button
            className="encounter-side-panel-delete-button"
            onClick={onDelete}
            title="Delete encounter"
          >
            <TrashIcon />
            Delete Encounter
          </button>
        )
        }
      </div>
    </SidePanel >
  );
};
