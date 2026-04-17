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
    buttonContent?: ReactNode;
    items: DropdownItem[];
    onSelect: (itemId: string) => void;
    renderItem?: (item: DropdownItem) => ReactNode;
    filterItem?: (item: DropdownItem, searchText: string) => boolean;
    dropdownClassName?: string;
    containerClassName?: string;
    buttonTitle?: string;
    disabled?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
    buttonContent,
    items,
    onSelect,
    renderItem,
    filterItem,
    dropdownClassName = 'dropdown-list',
    containerClassName = '',
    buttonTitle,
    disabled = false,
    searchable = false,
    searchPlaceholder = 'Search...'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                if (searchable) setSearchText('');
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, searchable]);

    const handleItemSelect = (itemId: string) => {
        onSelect(itemId);
        setIsOpen(false);
        if (searchable) setSearchText('');
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchText(value);
        setIsOpen(value.length > 0);
    };

    const defaultRenderItem = (item: DropdownItem) => (
        <span>{item.label}</span>
    );

    const filteredItems = searchable
        ? items.filter(item =>
            filterItem
                ? filterItem(item, searchText)
                : item.label.toLowerCase().includes(searchText.toLowerCase())
          )
        : items;

    return (
        <div className={`dropdown-container ${containerClassName}`} ref={dropdownRef}>
            {searchable ? (
                <input
                    className="dropdown-search-input"
                    type="text"
                    value={searchText}
                    onChange={handleSearchChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={searchPlaceholder}
                    disabled={disabled}
                    title={buttonTitle}
                />
            ) : (
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    title={buttonTitle}
                    disabled={disabled}
                >
                    {buttonContent}
                </Button>
            )}
            {isOpen && (
                <div className={dropdownClassName}>
                    {filteredItems.length > 0 ? filteredItems.map(item => (
                        <div
                            key={item.id}
                            className="dropdown-item"
                            onClick={() => handleItemSelect(item.id)}
                        >
                            {renderItem ? renderItem(item) : defaultRenderItem(item)}
                        </div>
                    )) : (
                        <div className="dropdown-item dropdown-no-results">No results</div>
                    )}
                </div>
            )}
        </div>
    );
};
