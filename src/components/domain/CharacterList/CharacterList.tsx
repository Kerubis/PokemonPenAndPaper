import React from 'react';
import { SidePanel } from '@/components/ui/SidePanel';
import { TrashIcon } from '@/components/ui/icons';
import './CharacterList.css';

interface CharacterListItem {
  id: string;
  content: React.ReactNode;
}

interface CharacterListProps {
  items: CharacterListItem[];
  currentItemId: string | null;
  onItemClick: (id: string) => void;
  onDeleteClick: (id: string, event: React.MouseEvent) => void;
}

export const CharacterList: React.FC<CharacterListProps> = ({
  items,
  currentItemId,
  onItemClick,
  onDeleteClick
}) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <SidePanel title="Saved Characters" className="character-list-panel">
      <div className="character-list">
        {items.map(item => (
          <div
            key={item.id}
            className="character-list-item-container"
            onClick={() => onItemClick(item.id)}
          >
            <div className={`character-list-item ${item.id === currentItemId ? 'active' : ''}`}>
              {item.content}
            </div>
            <button
              className="character-list-delete-button"
              onClick={(e) => onDeleteClick(item.id, e)}
              title="Delete"
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>
    </SidePanel>
  );
};
