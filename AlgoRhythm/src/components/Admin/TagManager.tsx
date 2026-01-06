import { useState } from 'react';
import { X, Plus, Tag as TagIcon } from 'lucide-react';
import type { Tag } from '@/api/tagApi';

interface TagManagerProps {
    selectedTags: Tag[];
    availableTags: Tag[];
    onAddTag: (tag: Tag) => void;
    onRemoveTag: (tagId: string) => void;
    disabled?: boolean;
}

export function TagManager({
    selectedTags,
    availableTags,
    onAddTag,
    onRemoveTag,
    disabled = false
}: TagManagerProps) {
    const [showTagSelect, setShowTagSelect] = useState(false);

    const handleAddTag = (tag: Tag) => {
        onAddTag(tag);
        setShowTagSelect(false);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="block font-sans font-medium text-foreground">
                    Tags
                </label>
                <button
                    type="button"
                    onClick={() => setShowTagSelect(!showTagSelect)}
                    disabled={disabled || availableTags.length === 0}
                    className="flex items-center gap-2 px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="w-4 h-4" />
                    Add Tag
                </button>
            </div>

            {/* Tag Selector Dropdown */}
            {showTagSelect && availableTags.length > 0 && (
                <div className="mb-3 p-3 bg-background border border-muted rounded-lg max-h-48 overflow-y-auto">
                    {availableTags.map(tag => (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleAddTag(tag)}
                            className="w-full text-left px-3 py-2 hover:bg-muted rounded transition-colors font-sans text-foreground"
                        >
                            {tag.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2">
                {selectedTags.length === 0 ? (
                    <p className="text-sm text-muted-foreground font-sans">No tags added yet</p>
                ) : (
                    selectedTags.map(tag => (
                        <div
                            key={tag.id}
                            className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full"
                        >
                            <TagIcon className="w-3 h-3" />
                            <span className="font-sans text-sm">{tag.name}</span>
                            <button
                                type="button"
                                onClick={() => onRemoveTag(tag.id)}
                                disabled={disabled}
                                className="hover:bg-primary/30 rounded-full p-0.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}