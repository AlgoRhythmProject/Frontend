import type { Task } from "@/types/Task";
import { DifficultyColor, DifficultyLabel } from "@/utils/difficulty";
import { taskTypeLabel } from "@/utils/taskType";
import { CheckCircle2, Circle } from "lucide-react";
import { Link } from "react-router-dom";

interface TaskCardProps {
    task: Task;
    courseId?: string;
    fromCourse?: boolean;
    isCompleted?: boolean;
}

export function TaskCard({
    task,
    courseId,
    fromCourse = false,
    isCompleted = false
}: Readonly<TaskCardProps>) {
    const state = fromCourse && courseId
        ? { fromCourse: true, courseId }
        : undefined;

    return (
        <Link
            to={`/tasks/${task.id}`}
            state={state}
            className="block bg-background hover:bg-card-hover border border-muted hover:border-primary rounded-lg p-4 transition-all group"
        >
            <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                    {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                        <Circle className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                    )}
                </div>

                {/* Task Info */}
                <div className="flex-1 min-w-0">
                    <p className="font-mono font-medium text-foreground mb-1 truncate">
                        {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                        <div
                            className={`w-3 h-3 rounded-full ${DifficultyColor[task.difficulty] ?? 'bg-error'
                                }`}
                        />
                        <span className="font-sans text-muted-foreground">
                            {DifficultyLabel[task.difficulty]}
                        </span>
                        <span className="text-muted">•</span>
                        <span className="font-sans text-muted-foreground">
                            {taskTypeLabel[task.taskType]}
                        </span>
                        {isCompleted && (
                            <>
                                <span className="text-muted">•</span>
                                <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
                                    Completed
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}