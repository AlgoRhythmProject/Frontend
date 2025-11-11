import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Task {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    completed?: boolean;
}

interface TaskCardProps {
    task: Task;
    delay?: number;
}

export function TaskCard({ task, delay = 0 }: TaskCardProps) {
    const color = task.difficulty === 'Easy' ? 'bg-success' :
        task.difficulty === 'Medium' ? 'bg-warning' : 'bg-error';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
        >
            <Link
                to={`/tasks/${task.id}`}
                className="block bg-background border border-muted rounded-xl p-4 hover:border-primary transition-colors"
            >
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] text-primary text-xs mb-1">{task.id}</p>
                        <p className="font-mono text-foreground mb-2">{task.title}</p>
                        <div className="flex items-center gap-2">
                            <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
                            <span className="font-sans text-muted-foreground text-sm">{task.difficulty}</span>
                        </div>
                    </div>
                    {task.completed && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            className="text-success"
                        >
                            ✓
                        </motion.div>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}
