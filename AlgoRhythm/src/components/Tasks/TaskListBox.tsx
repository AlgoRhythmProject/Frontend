import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { Link } from "react-router-dom";
import { DifficultyColor, DifficultyLabel } from "@/utils/difficulty";
import type { TaskWithCourses } from "@/types/Task";


interface TaskListBoxProps {
    tasks: TaskWithCourses[];
}

export function TaskListBox({ tasks }: TaskListBoxProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-card flex flex-col rounded-2xl border border-muted overflow-hidden mb-6"
        >
            {tasks.length > 0 ? (
                tasks.map((task, index) => (
                    <div key={task.id} className="w-full">
                        <Link
                            to={`/tasks/${task.id}`}
                            className="flex items-center hover:bg-card-hover transition-colors group"
                        >
                            {/* Completion */}
                            <div className="px-4 py-4">
                                {task.completed ? (
                                    <CheckCircle2 className="w-5 h-5 text-success" />
                                ) : (
                                    <Circle className="w-5 h-5 text-muted group-hover:text-primary" />
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex flex-col flex-1 min-w-0 py-4 pr-4">
                                <p className="text-primary text-xs">{task.id}</p>
                                <p className="text-foreground text-lg truncate">{task.title}</p>
                                <p className="text-muted-foreground text-sm">{task.category}</p>
                            </div>
                            {/* Difficulty */}
                            <div className="px-4 py-4 flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-3 h-3 rounded-full ${DifficultyColor[task.difficulty] ?? 'bg-error'
                                            }`}
                                    />
                                    <p className="text-foreground text-sm hidden md:block">
                                        {DifficultyLabel[task.difficulty]}
                                    </p>
                                </div>
                            </div>
                        </Link>

                        {index < tasks.length - 1 && <div className="h-px bg-muted w-full" />}
                    </div>
                ))
            ) : (
                <div className="w-full py-16 text-center">
                    <p className="text-secondary-foreground text-lg">No tasks found</p>
                </div>
            )}
        </motion.div>
    );
}