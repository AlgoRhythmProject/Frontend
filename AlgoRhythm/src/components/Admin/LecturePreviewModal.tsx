import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Lecture, LectureContent } from '@/types/Lecture';
import { ImageViewer, VideoViewer } from '@/components/MediaViewer';
import { lectureApi } from '@/api/lecture/lectureApi';

interface LecturePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    lecture: Lecture | null;
}

export function LecturePreviewModal({ isOpen, onClose, lecture }: LecturePreviewModalProps) {
    const [contents, setContents] = useState<LectureContent[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && lecture) {
            loadContents();
        }
    }, [isOpen, lecture]);

    const loadContents = async () => {
        if (!lecture) return;

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

    if (!isOpen || !lecture) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-card border-b border-muted p-6 flex items-center justify-between z-10">
                    <div>
                        <h2 className="font-sans font-medium text-foreground text-xl">
                            Lecture Preview
                        </h2>
                        <p className="font-sans text-muted-foreground text-sm mt-1">
                            {lecture.title}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted cursor-pointer rounded-lg transition-colors"
                        aria-label="Close preview"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12">
                    {/* Lecture Badge */}
                    <div className="mb-6 flex items-center gap-2">
                        <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-sans">
                            Lecture
                        </span>
                        {lecture.isPublished && (
                            <span className="inline-block bg-success/20 text-success px-3 py-1 rounded-full text-sm font-sans">
                                Published
                            </span>
                        )}
                    </div>

                    {/* Lecture Content */}
                    <div className="lecture-content font-sans">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                <p className="font-sans text-muted-foreground">Loading contents...</p>
                            </div>
                        ) : contents.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="font-sans text-muted-foreground">
                                    This lecture has no content yet.
                                </p>
                            </div>
                        ) : (
                            contents.map((content) => {
                                // Text content
                                if (content.type === 'Text' && content.htmlContent) {
                                    return (
                                        <div
                                            key={content.id}
                                            dangerouslySetInnerHTML={{ __html: content.htmlContent }}
                                        />
                                    );
                                }

                                // Photo content - using ImageViewer component
                                if (content.type === 'Photo' && content.path) {
                                    return (
                                        <ImageViewer
                                            key={content.id}
                                            fileName={content.path}
                                            alt={content.alt || ''}
                                            title={content.title}
                                        />
                                    );
                                }

                                // Video content - using VideoViewer component
                                if (content.type === 'Video' && content.fileName) {
                                    return (
                                        <VideoViewer
                                            key={content.id}
                                            fileName={content.fileName}
                                            fileUrl={content.streamUrl}
                                            title={content.title}
                                        />
                                    );
                                }

                                return null;
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}