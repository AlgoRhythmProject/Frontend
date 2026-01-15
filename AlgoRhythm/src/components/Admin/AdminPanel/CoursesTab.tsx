import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Course } from '@/types/Course';

interface CoursesTabProps {
    courses: Course[];
    onAddCourse: () => void;
    onEditCourse: (course: Course) => void;
    onDeleteCourse: (courseId: string) => void;
}

export function CoursesTab({ courses, onAddCourse, onEditCourse, onDeleteCourse }: CoursesTabProps) {
    return (
        <div>
            <div className="p-6 border-b border-muted flex items-center justify-between">
                <h2 className="font-sans font-medium text-foreground text-xl">Course Management</h2>
                <button
                    onClick={onAddCourse}
                    className="flex items-center cursor-pointer gap-2 bg-primary hover:bg-primary-hover text-foreground px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Course
                </button>
            </div>
            {courses.length === 0 ? (
                <div className="p-8 text-center">
                    <p className="font-sans text-muted-foreground">No courses found. Create your first course!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-background">
                            <tr>
                                <th className="text-left p-4 font-sans font-medium text-muted-foreground">Name</th>
                                <th className="text-left p-4 font-sans font-medium text-muted-foreground">Description</th>
                                <th className="text-left p-4 font-sans font-medium text-muted-foreground">Lectures</th>
                                <th className="text-left p-4 font-sans font-medium text-muted-foreground">Tasks</th>
                                <th className="text-left p-4 font-sans font-medium text-muted-foreground">Status</th>
                                <th className="text-left p-4 font-sans font-medium text-muted-foreground">Created</th>
                                <th className="text-left p-4 font-sans font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course, idx) => (
                                <tr key={course.id} className={idx % 2 === 0 ? 'bg-background/50' : ''}>
                                    <td className="p-4 font-sans text-foreground font-medium">{course.name}</td>
                                    <td className="p-4 font-sans text-muted-foreground max-w-xs truncate">
                                        {course.description || 'No description'}
                                    </td>
                                    <td className="p-4 font-sans text-muted-foreground">
                                        {course.lectures?.length || 0} lectures
                                    </td>
                                    <td className="p-4 font-sans text-muted-foreground">
                                        {course.tasks.length || 0} tasks
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-sans font-medium ${course.isPublished
                                                    ? 'bg-success/20 text-success'
                                                    : 'bg-muted text-muted-foreground'
                                                }`}
                                        >
                                            {course.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-4 font-sans text-muted-foreground">
                                        {new Date(course.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onEditCourse(course)}
                                                className="p-2 hover:bg-muted cursor-pointer rounded transition-colors"
                                                title="Edit Course"
                                            >
                                                <Edit className="w-4 h-4 text-info" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteCourse(course.id)}
                                                className="p-2 hover:bg-muted cursor-pointer rounded transition-colors"
                                                title="Delete Course"
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