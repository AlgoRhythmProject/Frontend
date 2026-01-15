import type { Achievement } from '@/types/Achievement';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X, Trophy, Star, BookOpen, Code, Zap, Target } from 'lucide-react';
import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';

interface AchievementNotificationContextType {
    showAchievement: (achievement: Achievement) => void;
}

// Icon mapping based on iconPath
const getIconForPath = (iconPath?: string) => {
    if (!iconPath) return Award;

    const path = iconPath.toLowerCase();

    if (path.includes('first-steps')) return Star;
    if (path.includes('problem-solver')) return Code;
    if (path.includes('code-master')) return Zap;
    if (path.includes('eager-learner')) return BookOpen;
    if (path.includes('knowledge-seeker')) return BookOpen;
    if (path.includes('scholar')) return BookOpen;
    if (path.includes('course-completer')) return Trophy;
    if (path.includes('dedicated-student')) return Target;
    if (path.includes('graduate')) return Trophy;
    if (path.includes('well-rounded')) return Trophy;

    return Award;
};

// Context
const AchievementNotificationContext = createContext<AchievementNotificationContextType | null>(null);

export function useAchievementNotification() {
    const context = useContext(AchievementNotificationContext);
    if (!context) {
        throw new Error('useAchievementNotification must be used within AchievementNotificationProvider');
    }
    return context;
}

// Single notification component
interface AchievementToastProps {
    achievement: Achievement;
    onClose: () => void;
}

function AchievementToast({ achievement, onClose }: AchievementToastProps) {
    const Icon = getIconForPath(achievement.iconPath);

    useEffect(() => {
        const timer = setTimeout(onClose, 6000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative bg-card border-2 border-primary rounded-xl shadow-2xl overflow-hidden min-w-[320px] max-w-md"
        >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative p-4 flex items-center gap-4">
                {/* Icon with animation */}
                <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                    className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0"
                >
                    <Icon className="w-7 h-7 text-on-primary" />
                </motion.div>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="font-sans font-semibold text-primary text-xs mb-1 uppercase tracking-wider"
                    >
                        🎉 Achievement Unlocked
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="font-sans font-bold text-foreground text-base mb-0.5 truncate"
                    >
                        {achievement.achievementName}
                    </motion.p>
                    {achievement.achievementDescription && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="font-sans text-muted-foreground text-sm truncate"
                        >
                            {achievement.achievementDescription}
                        </motion.p>
                    )}
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="shrink-0 w-7 h-7 rounded-full hover:bg-muted transition-colors flex items-center justify-center group"
                >
                    <X className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
            </div>

            {/* Progress bar */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 6, ease: 'linear' }}
                className="h-1 bg-primary origin-left"
            />
        </motion.div>
    );
}

// Provider component
interface AchievementNotificationProviderProps {
    children: ReactNode;
}

export function AchievementNotificationProvider({ children }: AchievementNotificationProviderProps) {
    const [achievements, setAchievements] = useState<Achievement[]>([]);

    const showAchievement = (achievement: Achievement) => {
        setAchievements(prev => [...prev, achievement]);
    };

    const removeAchievement = (id: string) => {
        setAchievements(prev => prev.filter(a => a.id !== id));
    };

    return (
        <AchievementNotificationContext.Provider value={{ showAchievement }}>
            {children}

            {/* Notification container */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {achievements.map(achievement => (
                        <div key={achievement.id} className="pointer-events-auto">
                            <AchievementToast
                                achievement={achievement}
                                onClose={() => removeAchievement(achievement.id)}
                            />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </AchievementNotificationContext.Provider>
    );
}