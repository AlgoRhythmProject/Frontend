import { X } from 'lucide-react';
import type { Lecture } from '@/types/Lecture';

interface LecturePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    lecture: Lecture | null;
}

export function LecturePreviewModal({ isOpen, onClose, lecture }: LecturePreviewModalProps) {
    if (!isOpen || !lecture) return null;

    const sortedContents = [...lecture.contents].sort((a, b) => a.order - b.order);

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
                        {sortedContents.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="font-sans text-muted-foreground">
                                    This lecture has no content yet.
                                </p>
                            </div>
                        ) : (
                            sortedContents.map((content) => {
                                if (content.type === 'Text' && content.htmlContent) {
                                    return (
                                        <div
                                            key={content.id}
                                            dangerouslySetInnerHTML={{ __html: content.htmlContent }}
                                            className="mb-6"
                                        />
                                    );
                                }
                                if (content.type === 'Photo' && content.path) {
                                    return (
                                        <figure key={content.id} className="my-8">
                                            <img
                                                src={content.path}
                                                alt={content.alt || ''}
                                                className="rounded-xl mx-auto max-w-full shadow-sm"
                                            />
                                            {content.title && (
                                                <figcaption className="text-center text-muted-foreground mt-3 text-sm">
                                                    {content.title}
                                                </figcaption>
                                            )}
                                        </figure>
                                    );
                                }
                                if (content.type === 'Video' && content.fileName) {
                                    return (
                                        <div key={content.id} className="my-8 bg-muted/30 rounded-xl p-6 text-center">
                                            <p className="font-sans text-foreground font-medium mb-2">
                                                Video Content
                                            </p>
                                            <p className="font-mono text-sm text-muted-foreground">
                                                {content.fileName}
                                            </p>
                                            {content.streamUrl && (
                                                <p className="text-xs text-muted-foreground mt-2 truncate">
                                                    Stream URL: {content.streamUrl}
                                                </p>
                                            )}
                                        </div>
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