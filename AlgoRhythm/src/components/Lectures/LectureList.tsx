import { useState } from "react";
import { BookOpen, CheckCircle2, Clock } from "lucide-react";
import type { Lecture } from "../../types/Lecture";

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
                <h1 className="font-sans font-medium text-foreground text-4xl md:text-5xl mb-4" style={{ fontVariationSettings: "'wdth' 100" }}>
                    THEORY & LECTURES
                </h1>
                <p className="font-sans text--text-primary text-lg">
                    Master the fundamentals through comprehensive written materials and articles
                </p>
                <div className="mt-4 flex items-center gap-4">
                    <div className="bg-primary/20 border border-primary rounded-xl px-4 py-2">
                        <p className="font-sans font-medium text-primary">
                            {completedCount} / {lectures.length} completed
                        </p>
                    </div>
                </div>
            </div>

            {/* Topic Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
                <button
                    onClick={() => setSelectedTopic(null)}
                    className={`px-4 py-2 rounded-lg cursor-pointer ${selectedTopic === null
                        ? "bg-primary text-foreground"
                        : "bg-card text-muted-foreground"
                        }`}
                >
                    All Topics
                </button>
                {topics.map((topic) => (
                    <button
                        key={topic}
                        onClick={() => setSelectedTopic(topic)}
                        className={`px-4 py-2 rounded-lg cursor-pointer ${selectedTopic === topic
                            ? "bg-primary text-foreground"
                            : "bg-card text-muted-foreground"
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
                        className="w-full bg-card border border-muted rounded-xl p-6 hover:border-primary transition-colors cursor-pointer group text-left"
                    >
                        <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className="shrink-0">
                                {lecture.completed ? (
                                    <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-6 h-6 text-success" />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center group-hover:bg-[#7952e5] transition-colors">
                                        <BookOpen className="w-6 h-6 text-foreground" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-sans font-medium text-foreground text-xl mb-1">
                                            {lecture.title}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <span className="font-sans text-primary text-sm">
                                                {lecture.topic}
                                            </span>
                                            <span className="text-muted">•</span>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Clock className="w-4 h-4" />
                                                <span className="font-sans text-sm">
                                                    {lecture.readTime}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {lecture.completed && (
                                        <span className="bg-success/20 text-success px-3 py-1 rounded-full text-sm font-mono font-medium">
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
