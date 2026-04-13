import React from 'react';
import { SidePanel } from '@/components/ui/SidePanel';
import { Dropdown, type DropdownItem } from '@/components/ui/Dropdown';
import { TrashIcon, ChevronDownIcon } from '@/components/ui/icons';
import { PropertyFieldGroup } from '@/components/ui/PropertyField';
import './EncounterSidePanel.css';

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Playlist
    const list = parsed.searchParams.get('list');
    if (list && (parsed.hostname.includes('youtube.com'))) {
      return `https://www.youtube.com/embed/videoseries?list=${list}`;
    }
    // Standard watch URL
    const v = parsed.searchParams.get('v');
    if (v) return `https://www.youtube.com/embed/${v}`;
    // Short URL: youtu.be/VIDEO_ID
    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    // Already an embed URL
    if (parsed.hostname.includes('youtube.com') && parsed.pathname.startsWith('/embed/')) {
      return url;
    }
    return null;
  } catch {
    return null;
  }
}

import type { PropertyField } from '@/components/ui/PropertyField';

export type EncounterPropertyField = PropertyField;

interface EncounterSidePanelProps {
  fields: EncounterPropertyField[];
  onDelete?: (event: React.MouseEvent) => void;
  availablePokemon?: { id: string; label: string; metadata?: { name: string } }[];
  onAddPokemon?: (id: string) => void;
  musicLink?: string;
}

export const EncounterSidePanel: React.FC<EncounterSidePanelProps> = ({ fields, onDelete, availablePokemon = [], onAddPokemon, musicLink }) => {
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

  const embedUrl = musicLink ? getYouTubeEmbedUrl(musicLink) : null;

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
        {embedUrl && (
          <div className="encounter-music-embed">
            <label className="encounter-property-label">Battle Music</label>
            <div className="encounter-music-embed-wrapper">
              <iframe
                src={embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Battle Music"
              />
            </div>
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
