import { useState } from "react";
import { BookOpen, CheckCircle2, Clock } from "lucide-react";
import type { Lecture } from "../types/Lecture";

interface LectureListProps {
    lectures: Lecture[];
    onSelectLecture: (id: string) => void;
}

export function LectureList({ lectures, onSelectLecture }: LectureListProps) {
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

    const topics = Array.from(new Set(lectures.map((l) => l.topic)));
    const filteredLectures = selectedTopic
        ? lectures.filter((l) => l.topic === selectedTopic)
        : lectures;

    const completedCount = lectures.filter((l) => l.completed).length;

    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-['Roboto',sans-serif] font-medium text-white text-4xl md:text-5xl mb-4" style={{ fontVariationSettings: "'wdth' 100" }}>
                    THEORY & LECTURES
                </h1>
                <p className="font-['Roboto',sans-serif] text-[#b0b0b0] text-lg">
                    Master the fundamentals through comprehensive written materials and articles
                </p>
                <div className="mt-4 flex items-center gap-4">
                    <div className="bg-[#6942d5]/20 border border-[#6942d5] rounded-xl px-4 py-2">
                        <p className="font-['Roboto',sans-serif] font-medium text-[#6942d5]">
                            {completedCount} / {lectures.length} completed
                        </p>
                    </div>
                </div>
            </div>

            {/* Topic Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
                <button
                    onClick={() => setSelectedTopic(null)}
                    className={`px-4 py-2 rounded-lg ${selectedTopic === null
                        ? "bg-[#6942d5] text-white"
                        : "bg-[#242424] text-[#b0b0b0]"
                        }`}
                >
                    All Topics
                </button>
                {topics.map((topic) => (
                    <button
                        key={topic}
                        onClick={() => setSelectedTopic(topic)}
                        className={`px-4 py-2 rounded-lg ${selectedTopic === topic
                            ? "bg-[#6942d5] text-white"
                            : "bg-[#242424] text-[#b0b0b0]"
                            }`}
                    >
                        {topic}
                    </button>
                ))}
            </div>

            {/* Lecture Cards */}
            <div className="space-y-3">
                {filteredLectures.map((lecture) => (
                    <button
                        key={lecture.id}
                        onClick={() => onSelectLecture(lecture.id)}
                        className="w-full bg-[#242424] border border-[#3d3d3d] rounded-xl p-6 hover:border-primary transition-colors cursor-pointer group text-left"
                    >
                        <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className="shrink-0">
                                {lecture.completed ? (
                                    <div className="w-12 h-12 rounded-full bg-[#ace798]/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-6 h-6 text-[#ace798]" />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-[#6942d5] flex items-center justify-center group-hover:bg-[#7952e5] transition-colors">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-['Roboto',sans-serif] font-medium text-white text-xl mb-1">
                                            {lecture.title}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <span className="font-['Roboto',sans-serif] text-[#6942d5] text-sm">
                                                {lecture.topic}
                                            </span>
                                            <span className="text-[#3d3d3d]">•</span>
                                            <div className="flex items-center gap-1 text-[#b0b0b0]">
                                                <Clock className="w-4 h-4" />
                                                <span className="font-['Roboto',sans-serif] text-sm">
                                                    {lecture.readTime}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {lecture.completed && (
                                        <span className="bg-[#ace798]/20 text-[#ace798] px-3 py-1 rounded-full text-sm font-['Roboto',sans-serif] font-medium">
                                            Completed
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </>
    );
}
