import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { lectureApi } from '@/api/lectureApi';
import { tagApi, type Tag } from '@/api/tagApi';
import type { Lecture, LectureInputDto } from '@/types/Lecture';
import type { CourseListItem } from '@/api/courseApi';
import { TagManager } from '@/components/Admin/TagManager';

interface LectureFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    lecture?: Lecture | null;
    courses: CourseListItem[];
}

export function LectureFormModal({ isOpen, onClose, onSuccess, lecture, courses }: LectureFormModalProps) {
    const [formData, setFormData] = useState<LectureInputDto>({
        courseId: '',
        title: '',
        isPublished: false
    });

    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadTags();
        }
    }, [isOpen]);

    useEffect(() => {
        if (lecture) {
            setFormData({
                courseId: lecture.courseId,
                title: lecture.title,
                isPublished: lecture.isPublished
            });

            // Load selected tags
            if (lecture.tagIds && lecture.tagIds.length > 0) {
                loadSelectedTags(lecture.tagIds);
            } else {
                setSelectedTags([]);
            }
        } else {
            setFormData({
                courseId: courses.length > 0 ? courses[0].id : '',
                title: '',
                isPublished: false
            });
            setSelectedTags([]);
        }
    }, [lecture, courses]);

    const loadTags = async () => {
        try {
            const tags = await tagApi.getAll();
            setAllTags(tags);
        } catch (error) {
            console.error('Failed to load tags:', error);
        }
    };

    const loadSelectedTags = async (tagIds: string[]) => {
        try {
            const tags = await Promise.all(
                tagIds.map(id => tagApi.getById(id).catch(() => null))
            );
            setSelectedTags(tags.filter((t): t is Tag => t !== null));
        } catch (error) {
            console.error('Failed to load selected tags:', error);
        }
    };

    const handleAddTag = async (tag: Tag) => {
        if (lecture?.id) {
            // For existing lecture, add via API
            try {
                await lectureApi.addTag(lecture.id, tag.id);
                setSelectedTags([...selectedTags, tag]);
            } catch (error) {
                console.error('Failed to add tag:', error);
                alert('Failed to add tag');
            }
        } else {
            // For new lecture, add to local state
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleRemoveTag = async (tagId: string) => {
        if (lecture?.id) {
            // For existing lecture, remove via API
            try {
                await lectureApi.removeTag(lecture.id, tagId);
                setSelectedTags(selectedTags.filter(t => t.id !== tagId));
            } catch (error) {
                console.error('Failed to remove tag:', error);
                alert('Failed to remove tag');
            }
        } else {
            // For new lecture, remove from local state
            setSelectedTags(selectedTags.filter(t => t.id !== tagId));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (lecture) {
                await lectureApi.update(lecture.id, formData);
            } else {
                // Create lecture first
                const createdLecture = await lectureApi.create(formData);

                // Then add tags to the newly created lecture
                if (selectedTags.length > 0) {
                    for (const tag of selectedTags) {
                        await lectureApi.addTag(createdLecture.id, tag.id);
                    }
                }
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Submit error:', err);
            setError(err.response?.data?.message || 'Failed to save lecture');
        } finally {
            setLoading(false);
        }
    };

    const selectedTagIds = selectedTags.map(t => t.id);
    const availableTags = allTags.filter(tag => !selectedTagIds.includes(tag.id));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-muted flex items-center justify-between sticky top-0 bg-card z-10">
                    <h2 className="font-sans font-medium text-foreground text-xl">
                        {lecture ? 'Edit Lecture' : 'Add New Lecture'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-error/10 border border-error rounded-lg p-4">
                            <p className="text-error font-sans">{error}</p>
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block font-sans font-medium text-foreground mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 bg-background border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter lecture title"
                        />
                    </div>

                    {/* Course */}
                    <div>
                        <label className="block font-sans font-medium text-foreground mb-2">
                            Course *
                        </label>
                        <select
                            required
                            value={formData.courseId}
                            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                            className="w-full px-4 py-2 bg-background border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={!!lecture}
                        >
                            <option value="">Select a course</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                        {lecture && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Course cannot be changed after creation
                            </p>
                        )}
                    </div>

                    {/* Tags Section */}
                    <TagManager
                        selectedTags={selectedTags}
                        availableTags={availableTags}
                        onAddTag={handleAddTag}
                        onRemoveTag={handleRemoveTag}
                        disabled={loading}
                    />

                    {/* Published Status */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isPublished"
                            checked={formData.isPublished}
                            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                            className="w-4 h-4 rounded border-muted text-primary focus:ring-2 focus:ring-primary"
                        />
                        <label htmlFor="isPublished" className="font-sans text-foreground cursor-pointer">
                            Publish lecture immediately
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-sans font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-primary hover:bg-primary-hover text-foreground rounded-lg font-sans font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : lecture ? 'Update Lecture' : 'Create Lecture'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}