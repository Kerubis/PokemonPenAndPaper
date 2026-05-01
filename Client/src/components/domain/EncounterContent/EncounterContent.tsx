import React, { useState, useMemo } from 'react';
import { marked } from 'marked';
import './EncounterContent.css';
import type { Encounter } from '@/features/encounters';

// Configure marked: no GitHub-flavoured extras, just headings + bullets
marked.setOptions({ gfm: false });

interface EncounterContentProps {
    encounter: Encounter;
    onStoryChange?: (story: string) => void;
}

export const EncounterContent: React.FC<EncounterContentProps> = ({
    encounter,
    onStoryChange,
}) => {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState('');

    const openEditor = () => {
        setDraft(encounter.story);
        setEditing(true);
    };

    const save = () => {
        onStoryChange?.(draft);
        setEditing(false);
    };

    const cancel = () => {
        setEditing(false);
    };

    const renderedHtml = useMemo(
        () => marked.parse(encounter.story || '*No story yet.*') as string,
        [encounter.story]
    );

    return (
        <div className="encounter-content">
            <div className="encounter-content-header">
                <span className="encounter-content-title">Story</span>
                {!editing && (
                    <button className="encounter-content-edit-btn" onClick={openEditor} title="Edit story">
                        ✎ Edit
                    </button>
                )}
            </div>

            {editing ? (
                <div className="encounter-content-editor">
                    <textarea
                        className="encounter-content-textarea"
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                        placeholder={`# Heading\n## Sub-heading\n- bullet point`}
                        autoFocus
                    />
                    <div className="encounter-content-editor-actions">
                        <button className="encounter-content-btn encounter-content-btn--save" onClick={save}>Save</button>
                        <button className="encounter-content-btn" onClick={cancel}>Cancel</button>
                    </div>
                </div>
            ) : (
                <div
                    className="encounter-content-preview"
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                />
            )}
        </div>
    );
};
