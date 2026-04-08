import React, { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Button } from '../Button';
import './Dropdown.css';

export interface DropdownItem {
    id: string;
    label: string;
    metadata?: any;
}

interface DropdownProps {
    buttonContent: ReactNode;
    items: DropdownItem[];
    onSelect: (itemId: string) => void;
    renderItem?: (item: DropdownItem) => ReactNode;
    dropdownClassName?: string;
    containerClassName?: string;
    buttonTitle?: string;
    disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
    buttonContent,
    items,
    onSelect,
    renderItem,
    dropdownClassName = 'dropdown-list',
    containerClassName = '',
    buttonTitle,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleItemSelect = (itemId: string) => {
        onSelect(itemId);
        setIsOpen(false);
    };

    const defaultRenderItem = (item: DropdownItem) => (
        <span>{item.label}</span>
    );

    return (
        <div className={`dropdown-container ${containerClassName}`} ref={dropdownRef}>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                title={buttonTitle}
                disabled={disabled}
            >
                {buttonContent}
            </Button>
            {isOpen && (
                <div className={dropdownClassName}>
                    {items.map(item => (
                        <div
                            key={item.id}
                            className="dropdown-item"
                            onClick={() => handleItemSelect(item.id)}
                        >
                            {renderItem ? renderItem(item) : defaultRenderItem(item)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
