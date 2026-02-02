import { BookOpen, Eye, FileText, Edit, Trash2 } from 'lucide-react';
import type { Lecture } from '@/types/Lecture';

interface LecturesTabProps {
    lectures: Lecture[];
    onAddLecture: () => void;
    onEditLecture: (lecture: Lecture) => void;
    onPreviewLecture: (lecture: Lecture) => void;
    onManageContent: (lecture: Lecture) => void;
    onDeleteLecture: (lectureId: string) => void;
}

export function LecturesTab({
    lectures,
    onAddLecture,
    onEditLecture,
    onPreviewLecture,
    onManageContent,
    onDeleteLecture,
}: LecturesTabProps) {
    return (
        <div>
            <div className="p-6 border-b border-muted flex items-center justify-between">
                <h2 className="font-sans font-medium text-foreground text-xl">Lecture Management</h2>
                <button
                    onClick={onAddLecture}
                    className="flex items-center cursor-pointer gap-2 bg-primary hover:bg-primary-hover text-on-primary px-4 py-2 rounded-lg transition-colors"
                >
                    <BookOpen className="w-4 h-4" />
                    Add Lecture
                </button>
            </div>
            {lectures.length === 0 ? (
                <div className="p-8 text-center">
                    <p className="font-sans text-muted-foreground">No lectures found. Create your first lecture!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-background">
                            <tr>
                                <th className="text-left p-4 font-sans font-medium text-muted-foreground">Title</th>
                                <th className="text-left p-4 font-sans font-medium text-muted-foreground">Status</th>
                                <th className="text-left p-4 font-sans font-medium text-muted-foreground">Created</th>
                                <th className="text-left p-4 font-sans font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lectures.map((lecture, idx) => (
                                <tr key={lecture.id} className={idx % 2 === 0 ? 'bg-background/50' : ''}>
                                    <td className="p-4 font-sans text-foreground">{lecture.title}</td>
                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-sans font-medium ${lecture.isPublished ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                                                }`}
                                        >
                                            {lecture.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-4 font-sans text-muted-foreground">
                                        {new Date(lecture.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onPreviewLecture(lecture)}
                                                className="p-2 hover:bg-muted cursor-pointer rounded transition-colors"
                                                title="Preview Lecture"
                                            >
                                                <Eye className="w-4 h-4 text-warning" />
                                            </button>
                                            <button
                                                onClick={() => onManageContent(lecture)}
                                                className="p-2 hover:bg-muted cursor-pointer rounded transition-colors"
                                                title="Manage Content"
                                            >
                                                <FileText className="w-4 h-4 text-primary" />
                                            </button>
                                            <button
                                                onClick={() => onEditLecture(lecture)}
                                                className="p-2 hover:bg-muted cursor-pointer rounded transition-colors"
                                                title="Edit Lecture"
                                            >
                                                <Edit className="w-4 h-4 text-info" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteLecture(lecture.id)}
                                                className="p-2 hover:bg-muted cursor-pointer rounded transition-colors"
                                                title="Delete Lecture"
                                            >
                                                <Trash2 className="w-4 h-4 text-error" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
