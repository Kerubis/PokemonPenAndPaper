import React from 'react';
import { SidePanel } from '@/components/ui/SidePanel';
import { Dropdown, type DropdownItem } from '@/components/ui/Dropdown';
import { MinusIcon, PlusIcon, TrashIcon, ChevronDownIcon } from '@/components/ui/icons';
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

export interface EncounterPropertyField {
  label: string;
  type: 'text' | 'number' | 'textarea' | 'checkbox';
  value: string | number | boolean;
  onChange: (value: string | boolean) => void;
  options?: { min?: number; max?: number; rows?: number };
}

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

  const renderField = (field: EncounterPropertyField, index: number) => (
    <div key={index} className="encounter-property-group">
      <label className="encounter-property-label">{field.label}</label>
      {field.type === 'checkbox' ? (
        <label className="encounter-property-checkbox-wrapper">
          <input
            type="checkbox"
            checked={field.value as boolean}
            onChange={(e) => field.onChange(e.target.checked)}
            className="encounter-property-checkbox"
          />
          <span className="encounter-property-checkbox-label">
            {field.value ? 'Yes' : 'No'}
          </span>
        </label>
      ) : field.type === 'textarea' ? (
        <textarea
          className="encounter-property-input encounter-property-textarea"
          value={field.value as string}
          onChange={(e) => field.onChange(e.target.value)}
          rows={field.options?.rows || 2}
        />
      ) : field.type === 'number' ? (
        <div className="encounter-property-number-wrapper">
          <button
            className="encounter-property-number-button"
            onClick={() => {
              const numValue = typeof field.value === 'number' ? field.value : parseInt(field.value as string) || 0;
              const newValue = Math.max(field.options?.min ?? 0, numValue - 1);
              field.onChange(newValue.toString());
            }}
          >
            <MinusIcon />
          </button>
          <input
            type="number"
            className="encounter-property-input"
            min={field.options?.min}
            max={field.options?.max}
            value={field.value as number}
            onChange={(e) => field.onChange(e.target.value)}
          />
          <button
            className="encounter-property-number-button increase"
            onClick={() => {
              const numValue = typeof field.value === 'number' ? field.value : parseInt(field.value as string) || 0;
              const newValue = field.options?.max !== undefined ? Math.min(field.options.max, numValue + 1) : numValue + 1;
              field.onChange(newValue.toString());
            }}
          >
            <PlusIcon />
          </button>
        </div>
      ) : (
        <input
          type={field.type}
          className="encounter-property-input"
          value={field.value as string}
          onChange={(e) => field.onChange(e.target.value)}
        />
      )}
    </div>
  );

  const embedUrl = musicLink ? getYouTubeEmbedUrl(musicLink) : null;

  return (
    <SidePanel title="Encounter" className="encounter-side-panel">
      {fields.map((field, index) => renderField(field, index))}

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
