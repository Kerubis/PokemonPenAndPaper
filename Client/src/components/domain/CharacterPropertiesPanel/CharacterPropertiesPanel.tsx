import React from 'react';
import { SidePanel } from '@/components/ui/SidePanel';
import { PropertyFieldGroup } from '@/components/ui/PropertyField';
import type { PropertyField } from '@/components/ui/PropertyField';

export type { PropertyField };

interface CharacterPropertiesPanelProps {
  fields: PropertyField[];
}

export const CharacterPropertiesPanel: React.FC<CharacterPropertiesPanelProps> = ({ fields }) => {
  return (
    <SidePanel title="Character Properties">
      {fields.map((field, index) => (
        <PropertyFieldGroup key={index} field={field} />
      ))}
    </SidePanel>
  );
};
