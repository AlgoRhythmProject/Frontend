import { useState } from 'react';
import { X, Plus, Tag as TagIcon } from 'lucide-react';
import { tagApi } from '@/api/tag/tagApi';
import type { Tag } from '@/types/Tag';

interface TagManagerProps {
    selectedTags: Tag[];
    availableTags: Tag[];
    onAddTag: (tag: Tag) => void;
    onRemoveTag: (tagId: string) => void;
    onTagCreated?: (tag: Tag) => void; // Callback po utworzeniu tagu
    disabled?: boolean;
}

export function TagManager({
    selectedTags,
    availableTags,
    onAddTag,
    onRemoveTag,
    onTagCreated,
    disabled = false
}: TagManagerProps) {
    const [showTagSelect, setShowTagSelect] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagDescription, setNewTagDescription] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddTag = (tag: Tag) => {
        onAddTag(tag);
        setShowTagSelect(false);
    };

    const handleCreateTag = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTagName.trim() || isCreating) return;

        setIsCreating(true);
        setError(null);

        try {
            const newTag = await tagApi.create(newTagName.trim(), newTagDescription.trim());

            onAddTag(newTag);

            if (onTagCreated) {
                onTagCreated(newTag);
            }

            setNewTagName('');
            setNewTagDescription('');
            setShowTagSelect(false);
        } catch (err: any) {
            console.error('Failed to create tag:', err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.errors) {
                const errors = Object.values(err.response.data.errors).flat();
                setError(errors.join(', '));
            } else {
                setError('Failed to create tag. Please try again.');
            }
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="block font-sans font-medium text-foreground">
                    Tags
                </label>
                <button
                    type="button"
                    onClick={() => {
                        setShowTagSelect(!showTagSelect);
                        setError(null);
                    }}
                    disabled={disabled}
                    className="cursor-pointer flex items-center gap-2 px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="w-4 h-4" />
                    Add Tag
                </button>
            </div>

            {/* Tag Selector Dropdown */}
            {showTagSelect && (
                <div className="mb-3 p-3 bg-background border border-muted rounded-lg">
                    <form onSubmit={handleCreateTag} className="mb-3 space-y-2">
                        <input
                            type="text"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            placeholder="Tag name..."
                            disabled={isCreating}
                            className="w-full px-3 py-2 bg-background border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <input
                            type="text"
                            value={newTagDescription}
                            onChange={(e) => setNewTagDescription(e.target.value)}
                            placeholder="Description (optional)..."
                            disabled={isCreating}
                            className="w-full px-3 py-2 bg-background border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />

                        {error && (
                            <div className="p-2 bg-error/10 border border-error/30 rounded text-error text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!newTagName.trim() || isCreating}
                            className="cursor-pointer  w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                        >
                            {isCreating ? 'Creating...' : 'Create Tag'}
                        </button>
                    </form>

                    {/* Separator */}
                    {availableTags.length > 0 && (
                        <div className="relative mb-3">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-muted"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or select existing</span>
                            </div>
                        </div>
                    )}

                    {availableTags.length > 0 ? (
                        <div className="max-h-48 overflow-y-auto">
                            {availableTags.map(tag => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => handleAddTag(tag)}
                                    className="w-full text-left px-3 py-2 hover:bg-muted rounded transition-colors"
                                >
                                    <p className="font-sans text-foreground font-medium">{tag.name}</p>
                                    {tag.description && (
                                        <p className="font-sans text-sm text-muted-foreground">{tag.description}</p>
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center">No existing tags</p>
                    )}
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
                                className="cursor-pointer hover:bg-primary/30 rounded-full p-0.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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