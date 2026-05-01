import React from 'react';
import { MinusIcon, PlusIcon } from '@/components/ui/icons';
import './PropertyField.css';

export interface PropertyField {
  label: string;
  type: 'text' | 'number' | 'textarea' | 'checkbox';
  value: string | number | boolean;
  onChange: (value: string | boolean) => void;
  options?: { min?: number; max?: number; rows?: number };
}

interface PropertyFieldGroupProps {
  field: PropertyField;
}

export const PropertyFieldGroup: React.FC<PropertyFieldGroupProps> = ({ field }) => (
  <div className="property-group">
    <label className="property-label">{field.label}</label>
    {field.type === 'checkbox' ? (
      <label className="property-checkbox-wrapper">
        <input
          type="checkbox"
          checked={field.value as boolean}
          onChange={(e) => field.onChange(e.target.checked)}
          className="property-checkbox"
        />
        <span className="property-checkbox-label">
          {field.value ? 'Yes' : 'No'}
        </span>
      </label>
    ) : field.type === 'textarea' ? (
      <textarea
        className="property-input property-textarea"
        value={field.value as string}
        onChange={(e) => field.onChange(e.target.value)}
        rows={field.options?.rows || 2}
      />
    ) : field.type === 'number' ? (
      <div className="property-number-wrapper">
        <button
          className="property-number-button"
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
          className="property-input"
          min={field.options?.min}
          max={field.options?.max}
          value={field.value as number}
          onChange={(e) => field.onChange(e.target.value)}
        />
        <button
          className="property-number-button increase"
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
        className="property-input"
        value={field.value as string}
        onChange={(e) => field.onChange(e.target.value)}
      />
    )}
  </div>
);
