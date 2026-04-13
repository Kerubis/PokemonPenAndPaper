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
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { restrictToHorizontalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { Toolbar } from '@/components/ui/Toolbar';
import { PlusIcon } from '@/components/ui/icons';
import './EncounterToolbar.css';

interface EncounterItem {
  id: string;
  name: string;
  index: number;
  finished: boolean;
}

interface EncounterToolbarProps {
  onNewEncounter: () => void;
  encounters?: EncounterItem[];
  selectedEncounterId?: string | null;
  onSelectEncounter?: (id: string) => void;
  onReorder?: (orderedIds: string[]) => void;
}

interface SortableBoxProps {
  encounter: EncounterItem;
  isSelected: boolean;
  onSelect: () => void;
}

const SortableBox: React.FC<SortableBoxProps> = ({ encounter, isSelected, onSelect }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: encounter.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 999 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`encounter-toolbar-box${
        isSelected ? ' encounter-toolbar-box--active' : ''
      }${encounter.finished ? ' encounter-toolbar-box--finished' : ''}`}
      onClick={onSelect}
      title={encounter.name || 'Unnamed Encounter'}
    >
      <span className="encounter-toolbar-box-name">{encounter.name || 'Unnamed'}</span>
    </div>
  );
};

export const EncounterToolbar: React.FC<EncounterToolbarProps> = ({
  onNewEncounter,
  encounters = [],
  selectedEncounterId,
  onSelectEncounter,
  onReorder,
}) => {
  const sorted = [...encounters].sort((a, b) => {
    if (a.finished !== b.finished) return a.finished ? 1 : -1;
    return a.index - b.index;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sorted.findIndex(e => e.id === active.id);
    const newIndex = sorted.findIndex(e => e.id === over.id);
    const reordered = arrayMove(sorted, oldIndex, newIndex);
    onReorder?.(reordered.map(e => e.id));
  };

  const leftContent = (
    <div className="encounter-toolbar-content">
      <div className="encounter-toolbar-actions">
        <button className="encounter-toolbar-box encounter-toolbar-box--new" onClick={onNewEncounter} title="New Encounter">
          <PlusIcon />
          <span className="encounter-toolbar-box-name">New</span>
        </button>
      </div>
      {sorted.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToHorizontalAxis, restrictToParentElement]} autoScroll={false}>
          <SortableContext items={sorted.map(e => e.id)} strategy={horizontalListSortingStrategy}>
            <div className="encounter-toolbar-list">
              {sorted.map(e => (
                <SortableBox
                  key={e.id}
                  encounter={e}
                  isSelected={e.id === selectedEncounterId}
                  onSelect={() => onSelectEncounter?.(e.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );

  return <Toolbar leftContent={leftContent} />;
};
