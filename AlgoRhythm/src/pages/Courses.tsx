// src/pages/Courses.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Code, TrendingUp, Award } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { StatBox } from "../components/StatBox";
import { ProgressBar } from "../components/ProgressBar";
import { courseApi } from "@/api/courseApi";
import { useEffect, useState } from "react";
import type { Course } from "@/types/Course";
import { courseProgressApi, type CourseProgress } from "@/api/courseProgressApi";

type UICourse = Course & {
  progress?: CourseProgress | null;
};

const ICON_MAP: Record<string, any> = {
  "course-1": BookOpen,
  "course-2": Code,
  "course-3": TrendingUp,
  "course-4": Award,
};

const COLOR_MAP: Record<string, string> = {
  "course-1": "from-primary to-[#8b5cf6]",
  "course-2": "from-info to-[#0ea5e9]",
  "course-3": "from-success to-[#4ade80]",
  "course-4": "from-warning to-[#fbbf24]",
};

const FALLBACK_GRADIENTS = [
  "from-indigo-500 to-violet-500",
  "from-rose-500 to-pink-500",
  "from-emerald-500 to-green-400",
  "from-sky-500 to-blue-400",
  "from-amber-500 to-orange-400",
];

function getDeterministicGradient(id: string) {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return FALLBACK_GRADIENTS[sum % FALLBACK_GRADIENTS.length];
}

function getIconForCourse(id: string) {
  if (ICON_MAP[id]) return ICON_MAP[id];
  const prefix = id.split("-")[0];
  if (ICON_MAP[prefix]) return ICON_MAP[prefix];
  return BookOpen;
}

function getGradientForCourse(id: string) {
  if (COLOR_MAP[id]) return COLOR_MAP[id];
  return getDeterministicGradient(id);
}

export function Courses() {
  const [courses, setCourses] = useState<UICourse[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const allCourses = await courseApi.getAll();

        // równoległe pobranie progressów z tolerancją błędów (404 -> null)
        const settled = await Promise.allSettled(
          allCourses.map((c) => courseProgressApi.getMyProgress(c.id))
        );

        const mapped: UICourse[] = allCourses.map((c, idx) => {
          const result = settled[idx];
          if (result.status === "fulfilled") {
            return { ...c, progress: result.value as CourseProgress };
          } else {
            // rejection (np. 404) -> traktujemy jako brak progressu (available)
            return { ...c, progress: null };
          }
        });

        setCourses(mapped);
      } catch (e) {
        console.error("Failed to load courses or progress", e);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  const continueLearning = courses.filter((c) => c.progress !== null && c.progress !== undefined);

  const progressCourses = continueLearning.filter((c) => c.progress && typeof c.progress.percentage === "number");
  const overallAverage =
    progressCourses.length > 0
      ? Math.round(progressCourses.reduce((s, c) => s + (c.progress?.percentage || 0), 0) / progressCourses.length)
      : 0;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-12">
          <PageHeader title="YOUR LEARNING PATH" subtitle="Master algorithms through structured courses and hands-on practice" />
          <div className="flex gap-4">
            <StatBox color="primary">Total progress: {overallAverage}%</StatBox>
            <StatBox color="info">{continueLearning.length} Active Courses</StatBox>
          </div>
        </motion.div>

        {/* Continue Learning */}
        {continueLearning.length > 0 && (
          <div className="mb-12">
            <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="font-sans font-medium text-foreground text-2xl md:text-3xl mb-6" style={{ fontVariationSettings: "'wdth' 100" }}>
              CONTINUE LEARNING
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {continueLearning.map((course, idx) => {
                const Icon = getIconForCourse(course.id);
                const gradient = getGradientForCourse(course.id);
                const percentage = course.progress?.percentage ?? 0;
                const totalLectures = course.lectures?.length ?? 0;

                return (
                  <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}>
                    <Link to={`/courses/${course.id}`} className={`relative h-80 rounded-2xl overflow-hidden block group bg-linear-to-br ${gradient} hover:shadow-2xl transition-shadow`}>
                      <div className="relative h-full p-6 flex flex-col">
                        <div className="mb-4">
                          <div className="inline-flex p-3 bg-white/20 rounded-xl">
                            <Icon className="w-6 h-6 text-foreground" />
                          </div>
                        </div>

                        <p className="font-sans font-bold text-foreground text-2xl md:text-3xl mb-3 tracking-[-1.2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          {course.name}
                        </p>
                        <p className="font-sans font-light text-foreground/90 text-base mb-6 flex-1 line-clamp-2">
                          {course.description}
                        </p>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-sans text-foreground/80 text-sm">Progress</span>
                            <span className="font-sans font-medium text-foreground text-sm">{Math.round(percentage)}%</span>
                          </div>

                          <ProgressBar value={percentage} total={100} color="white" backgroundClassName="bg-[rgba(248,248,248,0.3)]" delay={0.5 + idx * 0.05} />

                          <p className="font-sans text-foreground/70 text-xs mt-2">
                            {percentage}% • {totalLectures} lectures
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* All / Available Courses */}
        <div>
          <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="font-sans font-medium text-foreground text-2xl md:text-3xl mb-6" style={{ fontVariationSettings: "'wdth' 100" }}>
            ALL COURSES
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course, idx) => {
              const Icon = getIconForCourse(course.id);
              const gradient = getGradientForCourse(course.id);
              const isAvailable = course.progress === null || course.progress === undefined;
              const totalLectures = course.lectures?.length ?? 0;

              return (
                <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 + idx * 0.05 }}>
                  <Link to={`/courses/${course.id}`} className={`relative h-80 rounded-2xl overflow-hidden group cursor-pointer block bg-linear-to-br ${gradient} hover:shadow-2xl transition-shadow`}>
                    <div className="relative h-full p-6 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="inline-flex p-3 bg-white/20 rounded-xl">
                          <Icon className="w-6 h-6 text-foreground" />
                        </div>
                        <div className="flex flex-wrap gap-2 justify-end">
                          <span className="bg-white/20 text-foreground px-3 py-1 rounded-full font-sans text-xs">
                            {totalLectures} lectures
                          </span>
                          {isAvailable && <span className="bg-white/20 text-foreground px-3 py-1 rounded-full font-sans text-xs">Available</span>}
                        </div>
                      </div>

                      <p className="font-sans font-bold text-foreground text-2xl md:text-3xl mb-3 tracking-[-1.2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        {course.name}
                      </p>
                      <p className="font-sans font-light text-foreground/90 text-base flex-1 line-clamp-3">
                        {course.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
