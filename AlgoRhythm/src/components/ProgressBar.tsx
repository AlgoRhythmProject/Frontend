// src/components/ui/ProgressBar.tsx
import { motion } from "framer-motion";
import clsx from "clsx";

interface ProgressBarProps {
    value: number;
    total: number;
    color?: string;
    animate?: boolean;
    delay?: number;
    height?: string;
    backgroundClassName?: string;
}

export function ProgressBar({
    value,
    total,
    color = "primary",
    animate = true,
    delay = 0,
    height = "h-2",
    backgroundClassName = "bg-background",
}: ProgressBarProps) {
    const percentage = total > 0 ? (value / total) * 100 : 0;

    const barClass = clsx(`bg-${color}`, height, "rounded-full");
    const containerClass = clsx(backgroundClassName, height, "rounded-full overflow-hidden");

    if (animate) {
        return (
            <div className={containerClass}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay }}
                    className={barClass}
                />
            </div>
        );
    }

    return (
        <div className={containerClass}>
            <div className={barClass} style={{ width: `${percentage}%` }} />
        </div>
    );
}
