import { Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoadingStateProps {
    isLoading: boolean;
    error: string | null;
    loadingText?: string;
    onRetry?: () => void;
    children: React.ReactNode;
}

export function LoadingState({
    isLoading,
    error,
    loadingText = 'Loading...',
    onRetry,
    children
}: LoadingStateProps) {
    // LOADING
    if (isLoading) {
        return (
            <div className="min-h-screen p-8 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-muted-foreground font-sans">{loadingText}</p>
                </motion.div>
            </div>
        );
    }

    // ERROR
    if (error) {
        return (
            <div className="min-h-screen p-8 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md text-center"
                >
                    <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-error" />
                    </div>
                    <h2 className="text-foreground text-2xl font-sans font-bold mb-2">
                        Oops! Something went wrong
                    </h2>
                    <p className="text-error text-lg mb-6">{error}</p>
                    {onRetry && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onRetry}
                            className="bg-primary text-foreground px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors cursor-pointer font-sans font-medium"
                        >
                            Try Again
                        </motion.button>
                    )}
                </motion.div>
            </div>
        );
    }

    return <>{children}</>;
}

interface InlineLoadingProps {
    isLoading: boolean;
    error: string | null;
    loadingText?: string;
    children: React.ReactNode;
}

export function InlineLoading({
    isLoading,
    error,
    loadingText = 'Loading...',
    children
}: InlineLoadingProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    <p className="text-muted-foreground font-sans text-sm">{loadingText}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3 text-error">
                    <AlertCircle className="w-6 h-6" />
                    <p className="font-sans text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}