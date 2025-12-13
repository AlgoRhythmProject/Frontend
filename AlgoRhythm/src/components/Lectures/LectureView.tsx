import { motion } from "framer-motion";
import type { Lecture } from "../../types/Lecture";

interface LectureViewProps {
    lecture: Lecture;
    onBack: () => void;
}

export function LectureView({ lecture, onBack }: LectureViewProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <button
                onClick={onBack}
                className="mb-6 text-primary hover:text-[#7952e5] cursor-pointer font-sans transition-colors"
            >
                ← Back to all lectures
            </button>
            <div className="max-w-4xl mx-auto bg-card border border-muted rounded-2xl p-8 md:p-12">
                <div className="mb-6">
                    <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-sans mb-4">
                        Lecture
                    </span>
                </div>

                <div className="lecture-content font-sans">
                    {lecture.contents
                        .sort((a, b) => a.order - b.order)
                        .map((content) => {
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
                                    <figure key={content.id} className="my-8">
                                        <img
                                            src={content.path}
                                            alt={content.alt || ""}
                                            className="rounded-xl mx-auto max-w-full"
                                        />
                                        {content.title && (
                                            <figcaption className="text-center text-muted-foreground mt-2 text-sm">
                                                {content.title}
                                            </figcaption>
                                        )}
                                    </figure>
                                );
                            }
                            return null;
                        })}
                </div>

                <div className="mt-12 pt-8 border-t border-muted">
                    <button className="w-full bg-primary text-foreground px-6 py-3 rounded-lg font-sans font-medium cursor-default opacity-50">
                        Complete
                    </button>
                </div>
            </div>
        </motion.div>
    );
}