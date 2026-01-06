import { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, MoveUp, MoveDown, Type, Image, Video } from 'lucide-react';
import { lectureApi } from '@/api/lectureApi';
import type { Lecture, LectureContent, LectureContentInputDto } from '@/types/Lecture';

interface LectureContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    lecture: Lecture;
}


export function LectureContentModal({ isOpen, onClose, lecture }: LectureContentModalProps) {
    const [contents, setContents] = useState<LectureContent[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingContent, setEditingContent] = useState<LectureContent | null>(null);
    const [formData, setFormData] = useState<LectureContentInputDto>({
        type: 'Text',
        htmlContent: ''
    });

    useEffect(() => {
        if (isOpen && lecture) {
            loadContents();
        }
    }, [isOpen, lecture]);

    const loadContents = async () => {
        setLoading(true);
        try {
            const data = await lectureApi.getAllContents(lecture.id);
            setContents(data.sort((a, b) => a.order - b.order));
        } catch (error) {
            console.error('Failed to load contents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddContent = () => {
        setEditingContent(null);
        setFormData({ type: 'Text', htmlContent: '' });
        setShowAddForm(true);
    };

    const handleEditContent = (content: LectureContent) => {
        setEditingContent(content);

        setFormData({
            type: content.type,
            htmlContent: content.htmlContent || '',
            path: content.path || '',
            alt: content.alt || '',
            title: content.title || '',
            fileName: content.fileName || '',
            streamUrl: content.streamUrl || ''
        });
        setShowAddForm(true);
    };

    const handleSubmitContent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingContent) {
                await lectureApi.updateContent(lecture.id, editingContent.id, formData);
            } else {
                await lectureApi.addContent(lecture.id, formData);
            }
            setShowAddForm(false);
            loadContents();
        } catch (error) {
            console.error('Failed to save content:', error);
            alert('Failed to save content');
        }
    };

    const handleDeleteContent = async (contentId: string) => {
        if (!confirm('Are you sure you want to delete this content?')) return;

        try {
            await lectureApi.removeContent(lecture.id, contentId);
            loadContents();
        } catch (error) {
            console.error('Failed to delete content:', error);
            alert('Failed to delete content');
        }
    };

    const handleMoveContent = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === contents.length - 1) return;

        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        try {
            await lectureApi.swapContentOrder(lecture.id, {
                firstContentId: contents[index].id,
                secondContentId: contents[targetIndex].id
            });
            loadContents();
        } catch (error) {
            console.error('Failed to reorder content:', error);
            alert('Failed to reorder content');
        }
    };

    const getContentIcon = (type: "Photo" | "Video" | "Text") => {
        switch (type) {
            case "Text": return <Type className="w-5 h-5" />;
            case "Photo": return <Image className="w-5 h-5" />;
            case "Video": return <Video className="w-5 h-5" />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-muted flex items-center justify-between sticky top-0 bg-card">
                    <div>
                        <h2 className="font-sans font-medium text-foreground text-xl">
                            Manage Lecture Content
                        </h2>
                        <p className="font-sans text-muted-foreground text-sm mt-1">
                            {lecture.title}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Add Content Button */}
                    {!showAddForm && (
                        <button
                            onClick={handleAddContent}
                            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-foreground px-4 py-2 rounded-lg transition-colors mb-6"
                        >
                            <Plus className="w-4 h-4" />
                            Add Content
                        </button>
                    )}

                    {/* Add/Edit Form */}
                    {showAddForm && (
                        <form onSubmit={handleSubmitContent} className="bg-background border border-muted rounded-lg p-6 mb-6 space-y-4">
                            <h3 className="font-sans font-medium text-foreground">
                                {editingContent ? 'Edit Content' : 'Add New Content'}
                            </h3>

                            {/* Content Type */}
                            <div>
                                <label className="block font-sans font-medium text-foreground mb-2">
                                    Content Type *
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({
                                        type: e.target.value as 'Text' | 'Photo' | 'Video',
                                        htmlContent: ''
                                    })}
                                    className="w-full px-4 py-2 bg-card border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    disabled={!!editingContent}
                                >
                                    <option value="Text">Text</option>
                                    <option value="Photo">Photo</option>
                                    <option value="Video">Video</option>
                                </select>
                            </div>

                            {/* Text Content */}
                            {formData.type === 'Text' && (
                                <div>
                                    <label className="block font-sans font-medium text-foreground mb-2">
                                        HTML Content *
                                    </label>
                                    <textarea
                                        required
                                        value={formData.htmlContent || ''}
                                        onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                                        rows={8}
                                        className="w-full px-4 py-2 bg-card border border-muted rounded-lg font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        placeholder="<p>Enter HTML content here...</p>"
                                    />
                                </div>
                            )}

                            {/* Photo Content */}
                            {formData.type === 'Photo' && (
                                <>
                                    <div>
                                        <label className="block font-sans font-medium text-foreground mb-2">
                                            Image Path/URL *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.path || ''}
                                            onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                                            className="w-full px-4 py-2 bg-card border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="/images/lecture-photo.jpg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-sans font-medium text-foreground mb-2">
                                            Alt Text
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.alt || ''}
                                            onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                                            className="w-full px-4 py-2 bg-card border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Image description"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-sans font-medium text-foreground mb-2">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title || ''}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-2 bg-card border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Image title"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Video Content */}
                            {formData.type === 'Video' && (
                                <>
                                    <div>
                                        <label className="block font-sans font-medium text-foreground mb-2">
                                            File Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.fileName || ''}
                                            onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                                            className="w-full px-4 py-2 bg-card border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="lecture-video.mp4"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-sans font-medium text-foreground mb-2">
                                            Stream URL
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.streamUrl || ''}
                                            onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                                            className="w-full px-4 py-2 bg-card border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="https://stream.example.com/video.m3u8"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-sans font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary-hover text-foreground rounded-lg font-sans font-medium transition-colors"
                                >
                                    {editingContent ? 'Update Content' : 'Add Content'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Contents List */}
                    {loading ? (
                        <div className="text-center py-8">
                            <p className="font-sans text-muted-foreground">Loading contents...</p>
                        </div>
                    ) : contents.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="font-sans text-muted-foreground">No content yet. Add your first content block!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {contents.map((content, index) => (
                                <div key={content.id} className="bg-background border border-muted rounded-lg p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => handleMoveContent(index, 'up')}
                                                disabled={index === 0}
                                                className="p-2 hover:bg-muted rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <MoveUp className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleMoveContent(index, 'down')}
                                                disabled={index === contents.length - 1}
                                                className="p-2 hover:bg-muted rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <MoveDown className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {getContentIcon(content.type)}
                                                <span className="font-sans font-medium text-foreground">
                                                    {content.type}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    (Order: {content.order})
                                                </span>
                                            </div>

                                            {content.htmlContent && (
                                                <div className="text-sm text-foreground bg-card p-3 rounded border border-muted max-h-32 overflow-y-auto">
                                                    <div
                                                        className="prose prose-sm max-w-none"
                                                        dangerouslySetInnerHTML={{
                                                            __html: content.htmlContent.length > 200
                                                                ? content.htmlContent.substring(0, 200) + '...'
                                                                : content.htmlContent
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            {content.type == "Photo" && content.path && (
                                                <div className="bg-card p-3 rounded border border-muted">
                                                    <img
                                                        src={content.path}
                                                        alt={content.alt || 'Lecture image'}
                                                        className="max-w-full h-auto max-h-32 rounded object-contain"
                                                    />
                                                    {content.alt && (
                                                        <p className="text-xs text-muted-foreground mt-2">Alt: {content.alt}</p>
                                                    )}
                                                    {content.title && (
                                                        <p className="text-xs text-muted-foreground">Title: {content.title}</p>
                                                    )}
                                                </div>
                                            )}

                                            {content.type == "Video" && content.fileName && (
                                                <div className="bg-card p-3 rounded border border-muted">
                                                    <p className="text-sm text-foreground font-mono mb-1">{content.fileName}</p>
                                                    {content.streamUrl && (
                                                        <p className="text-xs text-muted-foreground truncate">URL: {content.streamUrl}</p>
                                                    )}
                                                    {content.fileSize && (
                                                        <p className="text-xs text-muted-foreground">Size: {(content.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditContent(content)}
                                                className="p-2 hover:bg-muted rounded transition-colors"
                                            >
                                                <Edit className="w-4 h-4 text-info" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteContent(content.id)}
                                                className="p-2 hover:bg-muted rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 text-error" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}