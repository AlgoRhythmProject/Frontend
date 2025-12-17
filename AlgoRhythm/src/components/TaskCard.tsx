import type { Task } from "@/types/Task";
import { DifficultyColor, DifficultyLabel } from "@/utils/difficulty";
import { taskTypeLabel } from "@/utils/taskType";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export function TaskCard({ task }: { task: Task }) {
    const completed = false; // TODO: dodać tracking

    return (
        <Link
            to={`/tasks/${task.id}`}
            className="block bg-background hover:bg-card-hover border border-muted hover:border-primary rounded-lg p-4 transition-all"
        >
            <div className="flex items-start gap-3">
                {completed ? (
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                    <p className="font-mono font-medium text-foreground mb-1 truncate">
                        {task.title}
                    </p>
                    <div className="flex items-center gap-2">
                        <div
                            className={`w-3 h-3 rounded-full ${DifficultyColor[task.difficulty] ?? 'bg-error'
                                }`}
                        />
                        <span className="font-sans text-muted-foreground text-xs">
                            {DifficultyLabel[task.difficulty]}
                        </span>
                        <span className="text-muted">•</span>
                        <span className="font-sans text-muted-foreground text-xs">
                            {taskTypeLabel[task.taskType]}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}