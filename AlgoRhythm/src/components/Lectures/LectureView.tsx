import { motion } from "framer-motion";
import type { Lecture } from "../../types/Lecture";
import { courseProgressApi } from "@/api/courseProgressApi";
import { achievementApi } from "@/api/achievementApi";
import type { UserAchievementDto } from "@/api/achievementApi";
import { useState, useEffect } from "react";
import { useAchievementNotification } from "@/components/AchievementNotification";
import { checkAndShowNewAchievements } from "@/utils/achievementUtils";
import { ImageViewer, VideoViewer } from "@/components/MediaViewer";

interface LectureViewProps {
    lecture: Lecture;
    courseId?: string;
    isCompleted?: boolean;
    onBack: () => void;
    onProgressUpdate?: () => void;
}

export function LectureView({
    lecture,
    isCompleted,
    onBack
}: Readonly<LectureViewProps>) {
    const [isLoading, setIsLoading] = useState(false);
    const [completed, setCompleted] = useState(isCompleted ?? false);
    const [isCheckingCompletion, setIsCheckingCompletion] = useState(false);
    const [achievements, setAchievements] = useState<UserAchievementDto[]>([]);
    const { showAchievement } = useAchievementNotification();

    useEffect(() => {
        const checkCompletion = async () => {
            if (isCompleted !== undefined) {
                setCompleted(isCompleted);
                return;
            }

            setIsCheckingCompletion(true);
            try {
                const result = await courseProgressApi.isLectureCompleted(lecture.id);
                setCompleted(result.isCompleted);
            } catch (error) {
                console.error('Error checking lecture completion:', error);
            } finally {
                setIsCheckingCompletion(false);
            }
        };

        checkCompletion();
    }, [lecture.id, isCompleted]);

    useEffect(() => {
        const loadAchievements = async () => {
            try {
                const data = await achievementApi.getMyAchievements();
                setAchievements(data);
            } catch (error) {
                console.error('Error loading achievements:', error);
            }
        };
        loadAchievements();
    }, []);

    const handleToggleCompletion = async () => {
        setIsLoading(true);

        const newCompletedState = !completed;
        setCompleted(newCompletedState);

        try {
            await courseProgressApi.toggleLectureCompletion(lecture.id);

            if (newCompletedState) {
                const updatedAchievements = await checkAndShowNewAchievements(
                    achievements,
                    achievementApi.getMyAchievements,
                    showAchievement
                );
                setAchievements(updatedAchievements);
            }

        } catch (err) {
            console.error("Error toggling lecture completion:", err);
            setCompleted(!newCompletedState);
        } finally {
            setIsLoading(false);
        }
    };

    let buttonContent: React.ReactNode;

    if (isLoading) {
        buttonContent = (
            <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
            </span>
        );
    } else if (completed) {
        buttonContent = '✓ Completed';
    } else {
        buttonContent = 'Complete';
    }

    const sortedLectureContents = [...lecture.contents].sort(
        (a, b) => a.order - b.order
    );

    if (isCheckingCompletion) {
        return (
            <div className="flex items-center justify-center py-12">
                <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            key={lecture.id}
        >
            <button
                onClick={onBack}
                className="mb-6 text-primary hover:text-primary-hover cursor-pointer font-sans transition-colors"
            >
                ← Back
            </button>
            <div className="max-w-7xl mx-auto bg-card border border-muted rounded-2xl p-8 md:p-12">

                <div className="mb-6 flex items-center gap-2">
                    <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-sans">
                        Lecture
                    </span>
                    {completed && (
                        <span className="inline-block bg-success/20 text-success px-3 py-1 rounded-full text-sm font-sans">
                            ✓ Completed
                        </span>
                    )}
                </div>

                <div className="lecture-content font-sans">
                    {sortedLectureContents.map((content) => {
                        if (content.type === "Text" && content.htmlContent) {
                            return (
                                <div
                                    key={content.id}
                                    dangerouslySetInnerHTML={{ __html: content.htmlContent }}
                                />
                            );
                        }

                        if (content.type === "Photo" && content.path) {
                            return (
                                <ImageViewer
                                    key={content.id}
                                    fileName={content.path}
                                    alt={content.alt || ""}
                                    title={content.title}
                                />
                            );
                        }

                        if (content.type === "Video" && content.path) {
                            return (
                                <VideoViewer
                                    key={content.id}
                                    fileName={content.path}
                                    title={content.title}
                                />
                            );
                        }

                        return null;
                    })}
                </div>

                <div className="mt-12 pt-8 border-t border-muted">
                    <button
                        onClick={handleToggleCompletion}
                        disabled={isLoading}
                        className={`w-full px-6 py-3 rounded-lg font-sans font-medium transition-all ${completed
                            ? 'bg-success/20 text-success hover:bg-success/30 border border-success/30'
                            : 'bg-primary text-white hover:bg-primary-hover'
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                    >
                        {buttonContent}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}