import { FileCode, Edit, Trash2 } from 'lucide-react';
import type { Task } from '@/types/Task';
import { DifficultyLabel, DifficultyColor } from '@/utils/difficulty';

interface TasksTabProps {
    tasks: Task[];
    onAddTask: () => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
}

export function TasksTab({ tasks, onAddTask, onEditTask, onDeleteTask }: TasksTabProps) {
    return (
        <div>
            <div className="p-6 border-b border-muted flex items-center justify-between">
                <h2 className="font-sans font-medium text-foreground text-xl">Task Management</h2>
                <button
                    onClick={onAddTask}
                    className="flex items-center cursor-pointer gap-2 bg-primary hover:bg-primary-hover text-foreground px-4 py-2 rounded-lg transition-colors"
                >
                    <FileCode className="w-4 h-4" />
                    Add Task
                </button>
            </div>
            {tasks.length === 0 ? (
                <div className="p-8 text-center">
                    <p className="font-sans text-muted-foreground">No tasks found. Create your first task!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-background">
                            <tr>
                                <th className="text-left p-4 font-sans font-medium text-muted-foreground">Title</th>
                                <th className="text-left p-4 font-sans font-medium text-muted-foreground">Type</th>
                                <th className="text-left p-4 font-sans font-medium text-muted-foreground">Difficulty</th>
                                <th className="text-left p-4 font-sans font-medium text-muted-foreground">Status</th>
                                <th className="text-left p-4 font-sans font-medium text-muted-foreground">Created</th>
                                <th className="text-left p-4 font-sans font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task, idx) => (
                                <tr key={task.id} className={idx % 2 === 0 ? 'bg-background/50' : ''}>
                                    <td className="p-4 font-sans text-foreground">{task.title}</td>
                                    <td className="p-4 font-sans text-muted-foreground">
                                        {task.taskType === 0 ? 'Programming' : 'Interactive'}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${DifficultyColor[task.difficulty]}`} />
                                            <span className="font-sans text-foreground">{DifficultyLabel[task.difficulty]}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-sans font-medium ${task.isPublished ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                                                }`}
                                        >
                                            {task.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-4 font-sans text-muted-foreground">
                                        {new Date(task.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onEditTask(task)}
                                                className="p-2 hover:bg-muted rounded cursor-pointer transition-colors"
                                                title="Edit Task"
                                            >
                                                <Edit className="w-4 h-4 text-info" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteTask(task.id)}
                                                className="cursor-pointer p-2 hover:bg-muted rounded transition-colors"
                                                title="Delete Task"
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