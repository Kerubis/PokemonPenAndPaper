import React from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
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
  onReorder?: (orderedIds: string[]) => void;
}

interface SortableItemProps {
  item: CharacterListItem;
  isActive: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ item, isActive, onSelect, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="character-list-item-container"
      onClick={onSelect}
    >
      <div
        className="character-list-drag-handle"
        {...attributes}
        {...listeners}
        title="Drag to reorder"
        onClick={(e) => e.stopPropagation()}
      >
        <span />
        <span />
        <span />
      </div>
      <div className={`character-list-item ${isActive ? 'active' : ''}`}>
        {item.content}
      </div>
      <button
        className="character-list-delete-button"
        onClick={(e) => { e.stopPropagation(); onDelete(e); }}
        title="Delete"
      >
        <TrashIcon />
      </button>
    </div>
  );
};

export const CharacterList: React.FC<CharacterListProps> = ({
  items,
  currentItemId,
  onItemClick,
  onDeleteClick,
  onReorder,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    onReorder?.(reordered.map(i => i.id));
  };

  if (items.length === 0) return null;

  return (
    <SidePanel title="Saved Characters" className="character-list-panel">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        autoScroll={false}
      >
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <div className="character-list">
            {items.map(item => (
              <SortableItem
                key={item.id}
                item={item}
                isActive={item.id === currentItemId}
                onSelect={() => onItemClick(item.id)}
                onDelete={(e) => onDeleteClick(item.id, e)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </SidePanel>
  );
};

