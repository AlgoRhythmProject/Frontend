import { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, MoveUp, MoveDown, Type, Image, Video } from 'lucide-react';
import { fileApi } from '@/api/file/fileApi';
import type { Lecture, LectureContent } from '@/types/Lecture';
import { FileUpload } from './FileUpload';
import type { LectureContentInputDto } from '@/api/lecture/types';
import { lectureApi } from '@/api/lecture/lectureApi';
import { FileSelector } from './FileSelector';

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
        });
        setShowAddForm(true);
    };

    const handleSubmitContent = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.type === 'Text' && !formData.htmlContent?.trim()) {
            alert('HTML content is required for text blocks');
            return;
        }
        if (formData.type === 'Photo' && !formData.path?.trim()) {
            alert('Please upload an image first');
            return;
        }
        if (formData.type === 'Video' && !formData.fileName?.trim()) {
            alert('Please upload a video first');
            return;
        }

        try {
            if (editingContent) {
                await lectureApi.updateContent(lecture.id, editingContent.id, formData);
            } else {
                await lectureApi.addContent(lecture.id, formData);
            }
            setShowAddForm(false);
            setFormData({ type: 'Text', htmlContent: '' });
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
                <div className="p-6 border-b border-muted flex items-center justify-between sticky top-0 bg-card z-10">
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
                        className="cursor-pointer p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Add Content Button */}
                    {!showAddForm && (
                        <button
                            onClick={handleAddContent}
                            className="cursor-pointer flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors mb-6"
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
                                    <p className="text-xs text-muted-foreground mt-1">
                                        You can use HTML tags like &lt;h1&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, etc.
                                    </p>
                                </div>
                            )}
                            {/* Photo Content */}
                            {formData.type === 'Photo' && (
                                <>
                                    <FileSelector
                                        accept="image/*"
                                        onSelect={(fileName) => setFormData({ ...formData, path: fileName })}
                                        currentFile={formData.path}
                                        label="Image *"
                                    />

                                    <div>
                                        <label className="block font-sans font-medium text-foreground mb-2">
                                            Alt Text (for accessibility)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.alt || ''}
                                            onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                                            className="w-full px-4 py-2 bg-card border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Describe the image for screen readers"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-sans font-medium text-foreground mb-2">
                                            Caption (optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title || ''}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-2 bg-card border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Caption displayed below the image"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Video Content */}
                            {formData.type === 'Video' && (
                                <>
                                    <FileSelector
                                        accept="video/*"
                                        onSelect={(fileName) => {
                                            setFormData({
                                                ...formData,
                                                fileName: fileName,
                                                streamUrl: fileApi.getFileUrl(fileName)
                                            });
                                        }}
                                        currentFile={formData.fileName}
                                        label="Video *"
                                    />

                                    <div>
                                        <label className="block font-sans font-medium text-foreground mb-2">
                                            Caption (optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title || ''}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-2 bg-card border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Caption displayed below the video"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setFormData({ type: 'Text', htmlContent: '' });
                                    }}
                                    className="cursor-pointer flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-sans font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="cursor-pointer flex-1 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-sans font-medium transition-colors"
                                >
                                    {editingContent ? 'Update Content' : 'Add Content'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Contents List */}
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="font-sans text-muted-foreground">Loading contents...</p>
                        </div>
                    ) : contents.length === 0 ? (
                        <div className="text-center py-12 bg-background border border-muted rounded-lg">
                            <Type className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                            <p className="font-sans text-foreground font-medium">No content yet</p>
                            <p className="font-sans text-muted-foreground text-sm mt-1">
                                Add your first content block to get started!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {contents.map((content, index) => (
                                <div key={content.id} className="bg-background border border-muted rounded-lg p-4">
                                    <div className="flex items-start gap-4">
                                        {/* Move buttons */}
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => handleMoveContent(index, 'up')}
                                                disabled={index === 0}
                                                className="p-2 hover:bg-muted rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                title="Move up"
                                            >
                                                <MoveUp className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleMoveContent(index, 'down')}
                                                disabled={index === contents.length - 1}
                                                className="p-2 hover:bg-muted rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                title="Move down"
                                            >
                                                <MoveDown className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Content preview */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-3">
                                                {getContentIcon(content.type)}
                                                <span className="font-sans font-medium text-foreground">
                                                    {content.type}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    #{content.order}
                                                </span>
                                            </div>

                                            {/* Text preview */}
                                            {content.type === 'Text' && content.htmlContent && (
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

                                            {/* Photo preview */}
                                            {content.type === 'Photo' && content.path && (
                                                <div className="bg-card p-3 rounded border border-muted">
                                                    <img
                                                        src={fileApi.getFileUrl(content.path)}
                                                        alt={content.alt || 'Lecture image'}
                                                        className="max-w-full h-auto max-h-32 rounded object-contain"
                                                        onError={(e) => {
                                                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999"%3EError%3C/text%3E%3C/svg%3E';
                                                        }}
                                                    />
                                                    <div className="mt-2 space-y-1">
                                                        <p className="text-xs text-muted-foreground font-mono break-all">
                                                            {content.path}
                                                        </p>
                                                        {content.alt && (
                                                            <p className="text-xs text-muted-foreground">
                                                                <span className="font-medium">Alt:</span> {content.alt}
                                                            </p>
                                                        )}
                                                        {content.title && (
                                                            <p className="text-xs text-muted-foreground">
                                                                <span className="font-medium">Caption:</span> {content.title}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Video preview */}
                                            {content.type === 'Video' && content.fileName && (
                                                <div className="bg-card p-3 rounded border border-muted">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Video className="w-4 h-4 text-muted-foreground" />
                                                        <p className="text-sm text-foreground font-mono break-all">
                                                            {content.fileName}
                                                        </p>
                                                    </div>
                                                    {content.streamUrl && (
                                                        <p className="text-xs text-muted-foreground mb-2">
                                                            <span className="font-medium">URL:</span> {content.streamUrl}
                                                        </p>
                                                    )}
                                                    {content.title && (
                                                        <p className="text-xs text-muted-foreground">
                                                            <span className="font-medium">Caption:</span> {content.title}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditContent(content)}
                                                className="cursor-pointer p-2 hover:bg-muted rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4 text-info" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteContent(content.id)}
                                                className="cursor-pointer p-2 hover:bg-muted rounded transition-colors"
                                                title="Delete"
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