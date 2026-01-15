import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import type { Lecture } from "../../types/Lecture";
import { motion } from "framer-motion";
import { PageHeader } from "../PageHeader";
import { tagApi } from "../../api/tagApi";
import { courseProgressApi } from "../../api/courseProgressApi";

interface Tag {
    id: string;
    name: string;
    description?: string;
}

interface LectureListProps {
    lectures: Lecture[];
    onSelectLecture: (id: string) => void;
}

export default function LectureList({ lectures, onSelectLecture }: Readonly<LectureListProps>) {
    // Tags + selection
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [completedLectureIds, setCompletedLectureIds] = useState<Set<string>>(new Set());

    // Scroll controls for tag bar
    const tagScrollRef = useRef<HTMLDivElement | null>(null);
    const [canScrollTagsLeft, setCanScrollTagsLeft] = useState(false);
    const [canScrollTagsRight, setCanScrollTagsRight] = useState(false);

    // Fetch tags and completed lectures once
    useEffect(() => {
        let mounted = true;
        const fetchData = async () => {
            try {
                const [tagsData, completedData] = await Promise.all([
                    tagApi.getAll(),
                    courseProgressApi.getMyCompletedLectures()
                ]);

                if (mounted) {
                    setTags(tagsData);
                    setCompletedLectureIds(new Set(completedData.completedLectureIds));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
        return () => {
            mounted = false;
        };
    }, []);

    // Map tagId -> tagName
    const tagMap = useMemo(() => {
        return tags.reduce((acc, tag) => {
            acc[tag.id] = tag.name;
            return acc;
        }, {} as Record<string, string>);
    }, [tags]);

    // Filtering by tag
    const filteredLectures = useMemo(() => {
        if (!selectedTag) return lectures;
        return lectures.filter((lecture) => lecture.tagIds?.includes(selectedTag));
    }, [lectures, selectedTag]);

    // Helpers to check scroll state
    const checkTagScroll = () => {
        const el = tagScrollRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setCanScrollTagsLeft(scrollLeft > 5);
        setCanScrollTagsRight(scrollLeft < scrollWidth - clientWidth - 5);
    };

    useEffect(() => {
        // Check after tags render
        checkTagScroll();
        const el = tagScrollRef.current;
        el?.addEventListener("scroll", checkTagScroll);
        window.addEventListener("resize", checkTagScroll);

        return () => {
            el?.removeEventListener("scroll", checkTagScroll);
            window.removeEventListener("resize", checkTagScroll);
        };
        // Re-run when tags change so we re-evaluate scrollability
    }, [tags]);

    const scrollTags = (direction: "left" | "right") => {
        const el = tagScrollRef.current;
        if (!el) return;
        const scrollAmount = 300; // px
        el.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    };

    return (
        <>
            {/* Header + tag bar */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <PageHeader
                    title="THEORY & LECTURES"
                    subtitle="Master the fundamentals through comprehensive written materials and articles"
                />

                <div className="relative mt-6">
                    {/* Left indicator/button */}
                    {canScrollTagsLeft && (
                        <div className="absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-primary-background to-transparent pointer-events-none z-10 flex items-center">
                            <button
                                aria-label="Scroll tags left"
                                onClick={() => scrollTags("left")}
                                className="ml-2 cursor-pointer pointer-events-auto bg-card/90 backdrop-blur-sm border border-muted rounded-full p-1.5 shadow-lg hover:bg-muted transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Scrollable tags */}
                    <div
                        ref={tagScrollRef}
                        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-4"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        <button
                            onClick={() => setSelectedTag(null)}
                            className={`px-6 py-2 cursor-pointer  rounded-lg text-sm transition-colors whitespace-nowrap shrink-0 ${selectedTag === null ? "bg-primary text-on-primary" : "bg-card text-muted-foreground hover:bg-muted"
                                }`}
                        >
                            All tags
                        </button>

                        {tags.map((tag) => (
                            <button
                                key={tag.id}
                                onClick={() => setSelectedTag(tag.id)}
                                className={`px-6 py-2 rounded-lg cursor-pointer text-sm transition-colors whitespace-nowrap shrink-0 ${selectedTag === tag.id ? "bg-primary text-on-primary" : "bg-card text-muted-foreground hover:bg-muted"
                                    }`}
                            >
                                {tag.name}
                            </button>
                        ))}
                    </div>

                    {/* Right indicator/button */}
                    {canScrollTagsRight && (
                        <div className="absolute  right-0 top-0 bottom-0 w-16 bg-linear-to-l from-primary-background to-transparent pointer-events-none z-10 flex items-center justify-end">
                            <button
                                aria-label="Scroll tags right"
                                onClick={() => scrollTags("right")}
                                className="mr-2 cursor-pointer pointer-events-auto bg-card/90 backdrop-blur-sm border border-muted rounded-full p-1.5 shadow-lg hover:bg-muted transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* List of lectures */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                <div className="space-y-3 mt-8 px-4">
                    {filteredLectures.map((lecture) => {
                        const isCompleted = completedLectureIds.has(lecture.id);

                        return (
                            <button
                                key={lecture.id}
                                onClick={() => onSelectLecture(lecture.id)}
                                className="w-full bg-card border border-muted rounded-xl p-6 hover:border-primary transition-colors cursor-pointer group text-left"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary-hover transition-colors relative">
                                            <BookOpen className="w-6 h-6 text-on-primary" />
                                            {isCompleted && (
                                                <div className="absolute -top-1 -right-1">
                                                    <CheckCircle2 className="w-5 h-5 text-success bg-card rounded-full" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-sans font-medium text-foreground text-xl mb-2">{lecture.title}</p>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {lecture.tagIds?.map((tagId) => (
                                                <span key={tagId} className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground border border-muted">
                                                    {tagMap[tagId] ?? "Unknown"}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}

                    {filteredLectures.length === 0 && (
                        <p className="text-muted-foreground text-sm text-center mt-8">No lectures found for this tag.</p>
                    )}
                </div>
            </motion.div>
        </>
    );
}