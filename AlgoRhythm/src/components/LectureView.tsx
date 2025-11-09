import { motion } from "framer-motion";
import { Clock, CheckCircle2 } from "lucide-react";
import type { Lecture } from '../types/Lecture';

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
                className="mb-6 text-primary hover:text-[#7952e5] cursor-pointer font-['Roboto',sans-serif] transition-colors"
            >
                ← Back to all lectures
            </button>

            <div className="max-w-4xl mx-auto bg-[#242424] border border-[#3d3d3d] rounded-2xl p-8 md:p-12">
                <div className="mb-6">
                    <span className="inline-block bg-[#6942d5]/20 text-[#6942d5] px-3 py-1 rounded-full text-sm font-['Roboto',sans-serif] mb-4">
                        {lecture.topic}
                    </span>
                    <div className="flex items-center gap-3 text-[#b0b0b0] mb-2">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span className="font-['Roboto',sans-serif] text-sm">{lecture.readTime}</span>
                        </div>
                        {lecture.completed && (
                            <>
                                <span>•</span>
                                <div className="flex items-center gap-1 text-[#ace798]">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="font-['Roboto',sans-serif] text-sm">Completed</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Lecture Content - Markdown-style rendering */}
                <div className="prose prose-invert max-w-none">
                    {lecture.content.split('\n\n').map((paragraph, idx) => {
                        if (paragraph.startsWith('# ')) {
                            return (
                                <h1 key={idx} className="text-4xl font-['Roboto',sans-serif] font-bold text-white mt-0 mb-6">
                                    {paragraph.replace('# ', '')}
                                </h1>
                            );
                        } else if (paragraph.startsWith('## ')) {
                            return (
                                <h2 key={idx} className="text-2xl font-['Roboto',sans-serif] font-bold text-white mt-8 mb-4">
                                    {paragraph.replace('## ', '')}
                                </h2>
                            );
                        } else if (paragraph.startsWith('### ')) {
                            return (
                                <h3 key={idx} className="text-xl font-['Roboto',sans-serif] font-bold text-white mt-6 mb-3">
                                    {paragraph.replace('### ', '')}
                                </h3>
                            );
                        } else if (paragraph.startsWith('- ')) {
                            const items = paragraph.split('\n');
                            return (
                                <ul key={idx} className="list-disc list-inside space-y-2 my-4 text-[#d1d1d1] font-['Roboto',sans-serif]">
                                    {items.map((item, i) => (
                                        <li key={i}>{item.replace('- ', '')}</li>
                                    ))}
                                </ul>
                            );
                        } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                            return (
                                <p key={idx} className="text-[#d1d1d1] font-['Roboto',sans-serif] my-4 font-bold">
                                    {paragraph.replace(/\*\*/g, '')}
                                </p>
                            );
                        } else {
                            return (
                                <p key={idx} className="text-[#d1d1d1] font-['Roboto',sans-serif] leading-relaxed my-4">
                                    {paragraph}
                                </p>
                            );
                        }
                    })}
                </div>

                {/* Mark as Complete Button */}
                <div className="mt-12 pt-8 border-t border-[#3d3d3d]">
                    <button className="w-full bg-[#6942d5] hover:bg-[#7952e5] cursor-pointer text-white px-6 py-3 rounded-lg font-['Roboto',sans-serif] font-medium transition-colors">
                        {lecture.completed ? '✓ Completed' : 'Mark as Complete'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
