import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { courseApi, type CourseInputDto } from '@/api/courseApi';
import { lectureApi } from '@/api/lectureApi';
import { taskApi } from '@/api/taskApi';
import type { Course } from '@/types/Course';
import type { Lecture } from '@/types/Lecture';
import type { Task } from '@/types/Task';

interface CourseFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    course?: Course | null;
}

export function CourseFormModal({ isOpen, onClose, onSuccess, course }: CourseFormModalProps) {
    const [formData, setFormData] = useState<CourseInputDto>({
        name: '',
        description: '',
        isPublished: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Lectures & Tasks management
    const [allLectures, setAllLectures] = useState<Lecture[]>([]);
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [selectedLectures, setSelectedLectures] = useState<Lecture[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
    const [loadingResources, setLoadingResources] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadResources();
        }
    }, [isOpen]);

    useEffect(() => {
        if (course) {
            setFormData({
                name: course.name,
                description: course.description || '',
                isPublished: course.isPublished
            });
            loadCourseResources(course);
        } else {
            setFormData({
                name: '',
                description: '',
                isPublished: false
            });
            setSelectedLectures([]);
            setSelectedTasks([]);
        }
        setError(null);
    }, [course, isOpen]);

    const loadResources = async () => {
        setLoadingResources(true);
        try {
            const [lectures, tasks] = await Promise.all([
                lectureApi.getAll(),
                taskApi.getPublished()
            ]);
            setAllLectures(lectures);
            setAllTasks(tasks);
        } catch (error) {
            console.error('Failed to load resources:', error);
        } finally {
            setLoadingResources(false);
        }
    };

    const loadCourseResources = async (courseData: Course) => {
        try {
            // Load lectures
            if (courseData.lectures && courseData.lectures.length > 0) {
                const lectureDetails = await Promise.all(
                    courseData.lectures.map(l =>
                        lectureApi.getById(l.id).catch(() => null)
                    )
                );
                setSelectedLectures(lectureDetails.filter((l): l is Lecture => l !== null));
            } else {
                setSelectedLectures([]);
            }

            // Load tasks
            if (courseData.tasks && courseData.tasks.length > 0) {
                const taskDetails = await Promise.all(
                    courseData.tasks.map(t =>
                        taskApi.getById(t.id).catch(() => null)
                    )
                );
                setSelectedTasks(taskDetails.filter((t): t is Task => t !== null));
            } else {
                setSelectedTasks([]);
            }
        } catch (error) {
            console.error('Failed to load course resources:', error);
        }
    };

    const handleAddLecture = async (lectureId: string) => {
        const lecture = allLectures.find(l => l.id === lectureId);
        if (!lecture) return;

        if (course?.id) {
            try {
                await courseApi.addLecture(course.id, lectureId);
                setSelectedLectures([...selectedLectures, lecture]);
            } catch (error) {
                console.error('Failed to add lecture:', error);
                alert('Failed to add lecture');
            }
        } else {
            setSelectedLectures([...selectedLectures, lecture]);
        }
    };

    const handleRemoveLecture = async (lectureId: string) => {
        if (course?.id) {
            try {
                await courseApi.removeLecture(course.id, lectureId);
                setSelectedLectures(selectedLectures.filter(l => l.id !== lectureId));
            } catch (error) {
                console.error('Failed to remove lecture:', error);
                alert('Failed to remove lecture');
            }
        } else {
            setSelectedLectures(selectedLectures.filter(l => l.id !== lectureId));
        }
    };

    const handleAddTask = async (taskId: string) => {
        const task = allTasks.find(t => t.id === taskId);
        if (!task) return;

        if (course?.id) {
            try {
                await courseApi.addTask(course.id, taskId);
                setSelectedTasks([...selectedTasks, task]);
            } catch (error) {
                console.error('Failed to add task:', error);
                alert('Failed to add task');
            }
        } else {
            setSelectedTasks([...selectedTasks, task]);
        }
    };

    const handleRemoveTask = async (taskId: string) => {
        if (course?.id) {
            try {
                await courseApi.removeTask(course.id, taskId);
                setSelectedTasks(selectedTasks.filter(t => t.id !== taskId));
            } catch (error) {
                console.error('Failed to remove task:', error);
                alert('Failed to remove task');
            }
        } else {
            setSelectedTasks(selectedTasks.filter(t => t.id !== taskId));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (course) {
                await courseApi.update(course.id, formData);
            } else {
                const createdCourse = await courseApi.create(formData);

                // Add lectures to newly created course
                if (selectedLectures.length > 0) {
                    for (const lecture of selectedLectures) {
                        await courseApi.addLecture(createdCourse.id, lecture.id);
                    }
                }

                // Add tasks to newly created course
                if (selectedTasks.length > 0) {
                    for (const task of selectedTasks) {
                        await courseApi.addTask(createdCourse.id, task.id);
                    }
                }
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Submit error:', err);
            setError(err.response?.data?.message || 'Failed to save course');
        } finally {
            setLoading(false);
        }
    };

    const selectedLectureIds = selectedLectures.map(l => l.id);
    const availableLectures = allLectures.filter(l => !selectedLectureIds.includes(l.id));

    const selectedTaskIds = selectedTasks.map(t => t.id);
    const availableTasks = allTasks.filter(t => !selectedTaskIds.includes(t.id));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-muted flex items-center justify-between sticky top-0 bg-card z-10">
                    <h2 className="font-sans font-medium text-foreground text-xl">
                        {course ? 'Edit Course' : 'Add New Course'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="cursor-pointer p-2 hover:bg-muted rounded-lg transition-colors"
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

                    {/* Name */}
                    <div>
                        <label className="block font-sans font-medium text-foreground mb-2">
                            Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 bg-background border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter course name"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-sans font-medium text-foreground mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 bg-background border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-30 resize-y"
                            placeholder="Enter course description"
                        />
                    </div>

                    {/* Lectures Section */}
                    <div>
                        <label className="block font-sans font-medium text-foreground mb-2">
                            Lectures
                        </label>

                        {/* Selected Lectures */}
                        {selectedLectures.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-2">
                                {selectedLectures.map(lecture => (
                                    <div
                                        key={lecture.id}
                                        className="flex items-center gap-2 bg-primary/20 text-foreground px-3 py-1.5 rounded-lg text-sm"
                                    >
                                        <span className="font-sans">{lecture.title}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveLecture(lecture.id)}
                                            className="cursor-pointer hover:bg-primary/30 rounded p-0.5 transition-colors"
                                            disabled={loading}
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Lecture Dropdown */}
                        {availableLectures.length > 0 ? (
                            <div className="flex gap-2">
                                <select
                                    className="flex-1 px-4 py-2 bg-background border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            handleAddLecture(e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                    disabled={loading || loadingResources}
                                >
                                    <option value="">Select a lecture to add...</option>
                                    {availableLectures.map(lecture => (
                                        <option key={lecture.id} value={lecture.id}>
                                            {lecture.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground font-sans">
                                {selectedLectures.length > 0 ? 'All available lectures added' : 'No lectures available'}
                            </p>
                        )}
                    </div>

                    {/* Tasks Section */}
                    <div>
                        <label className="block font-sans font-medium text-foreground mb-2">
                            Tasks
                        </label>

                        {/* Selected Tasks */}
                        {selectedTasks.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-2">
                                {selectedTasks.map(task => (
                                    <div
                                        key={task.id}
                                        className="flex items-center gap-2 bg-info/20 text-foreground px-3 py-1.5 rounded-lg text-sm"
                                    >
                                        <span className="font-sans">{task.title}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTask(task.id)}
                                            className="cursor-pointer hover:bg-info/30 rounded p-0.5 transition-colors"
                                            disabled={loading}
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Task Dropdown */}
                        {availableTasks.length > 0 ? (
                            <div className="flex gap-2">
                                <select
                                    className="flex-1 px-4 py-2 bg-background border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            handleAddTask(e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                    disabled={loading || loadingResources}
                                >
                                    <option value="">Select a task to add...</option>
                                    {availableTasks.map(task => (
                                        <option key={task.id} value={task.id}>
                                            {task.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground font-sans">
                                {selectedTasks.length > 0 ? 'All available tasks added' : 'No tasks available'}
                            </p>
                        )}
                    </div>

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
                            Publish course immediately
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-sans font-medium transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || loadingResources}
                            className="cursor-pointer flex-1 px-4 py-2 bg-primary hover:bg-primary-hover text-foreground rounded-lg font-sans font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}