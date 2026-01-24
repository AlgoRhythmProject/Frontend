import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/themeContext';

export function ThemeToggle() {
    const { toggleTheme, isDark } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-full bg-card border border-muted flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <motion.div
                initial={false}
                animate={{
                    scale: isDark ? 1 : 0,
                    opacity: isDark ? 1 : 0,
                    rotate: isDark ? 0 : 180,
                }}
                transition={{ duration: 0.3 }}
                className="absolute"
            >
                <Moon className="w-5 h-5 text-foreground" />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    scale: isDark ? 0 : 1,
                    opacity: isDark ? 0 : 1,
                    rotate: isDark ? -180 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="absolute"
            >
                <Sun className="w-5 h-5 text-foreground" />
            </motion.div>
        </motion.button>
    );
}

export function ThemeToggleSwitch() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="relative w-16 h-8 rounded-full bg-muted cursor-pointer transition-colors"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <motion.div
                animate={{
                    x: isDark ? 2 : 34,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg"
            >
                {isDark ? (
                    <Moon className="w-4 h-4 text-primary-foreground" />
                ) : (
                    <Sun className="w-4 h-4 text-primary-foreground" />
                )}
            </motion.div>
        </motion.button>
    );
}