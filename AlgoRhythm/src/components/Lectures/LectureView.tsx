import { motion } from "framer-motion";
import { Clock, CheckCircle2 } from "lucide-react";
import type { Lecture } from '../../types/Lecture';

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
                        {lecture.topic}
                    </span>
                    <div className="flex items-center gap-3 text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span className="font-sans text-sm">{lecture.readTime}</span>
                        </div>
                        {lecture.completed && (
                            <>
                                <span>•</span>
                                <div className="flex items-center gap-1 text-success">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="font-sans text-sm">Completed</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="prose prose-invert max-w-none">
                    {lecture.content.split('\n\n').map((paragraph) => {
                        const key = paragraph.slice(0, 30);

                        if (paragraph.startsWith('# ')) {
                            return (
                                <h1 key={key} className="text-4xl font-sans font-bold text-foreground mt-0 mb-6">
                                    {paragraph.replace('# ', '')}
                                </h1>
                            );
                        } else if (paragraph.startsWith('## ')) {
                            return (
                                <h2 key={key} className="text-2xl font-sans font-bold text-foreground mt-8 mb-4">
                                    {paragraph.replace('## ', '')}
                                </h2>
                            );
                        } else if (paragraph.startsWith('### ')) {
                            return (
                                <h3 key={key} className="text-xl font-sans font-bold text-foreground mt-6 mb-3">
                                    {paragraph.replace('### ', '')}
                                </h3>
                            );
                        } else if (paragraph.startsWith('- ')) {
                            const items = paragraph.split('\n');
                            return (
                                <ul key={key} className="list-disc list-inside space-y-2 my-4 text-[#d1d1d1] font-sans">
                                    {items.map((item) => (
                                        <li key={item.slice(0, 30)}>{item.replace('- ', '')}</li>
                                    ))}
                                </ul>
                            );
                        } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                            return (
                                <p key={key} className="text-[#d1d1d1] font-sans my-4 font-bold">
                                    {paragraph.replace(/\*\*/g, '')}
                                </p>
                            );
                        } else {
                            return (
                                <p key={key} className="text-[#d1d1d1] font-sans leading-relaxed my-4">
                                    {paragraph}
                                </p>
                            );
                        }
                    })}
                </div>


                {/* Mark as Complete Button */}
                <div className="mt-12 pt-8 border-t border-muted">
                    <button className="w-full bg-primary hover:bg-[#7952e5] cursor-pointer text-foreground px-6 py-3 rounded-lg font-sans font-medium transition-colors">
                        {lecture.completed ? '✓ Completed' : 'Mark as Complete'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
