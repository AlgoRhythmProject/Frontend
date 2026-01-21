import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { PageHeader } from "../components/PageHeader";
import { StatBox } from "../components/StatBox";
import { ProgressBar } from "../components/ProgressBar";
import { LoadingState } from "../components/LoadingState";

import { courseApi } from "@/api/course/courseApi";
import type { Course } from "@/types/Course";
import { getCourseVisualConfig } from "@/config/courseConfig";
import type { CourseProgress } from "@/types/CourseProgress";
import { courseProgressApi } from "@/api/courseProgress/courseProgressApi";

type UICourse = Course & {
  progress?: CourseProgress | null;
};

export function Courses() {
  const [courses, setCourses] = useState<UICourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const allCourses = await courseApi.getPublished();

        const settled = await Promise.allSettled(
          allCourses.map((c) => courseProgressApi.getMyCourseProgress(c.id))
        );

        const mapped: UICourse[] = allCourses.map((c, idx) => {
          const result = settled[idx];
          if (result.status === "fulfilled") {
            return { ...c, progress: result.value };
          } else {
            return { ...c, progress: null };
          }
        });

        setCourses(mapped);
      } catch (e) {
        console.error("Failed to load courses or progress", e);
        setError("Failed to load courses. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const continueLearning = courses.filter(
    (c) => c.progress && c.progress !== undefined && c.progress.percentage > 0
  );

  const progressCourses = continueLearning.filter(
    (c) => c.progress && typeof c.progress.percentage === "number"
  );

  const overallAverage =
    progressCourses.length > 0
      ? Math.round(
        progressCourses.reduce((s, c) => s + (c.progress?.percentage || 0), 0) /
        progressCourses.length
      )
      : 0;

  return (
    <LoadingState
      isLoading={isLoading}
      error={error}
      loadingText="Loading courses..."
      onRetry={() => globalThis.location.reload()}
    >
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-12"
          >
            <PageHeader
              title="YOUR LEARNING PATH"
              subtitle="Master algorithms through structured courses and hands-on practice"
            />
            <div className="flex gap-4">
              <StatBox color="primary">Total progress: {overallAverage}%</StatBox>
              <StatBox color="info">{continueLearning.length} Active Courses</StatBox>
            </div>
          </motion.div>

          {/* Continue Learning */}
          {continueLearning.length > 0 && (
            <div className="mb-12">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="font-sans font-medium text-foreground text-2xl md:text-3xl mb-6"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                CONTINUE LEARNING
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {continueLearning.map((course, idx) => {
                  const { icon: Icon, gradient } = getCourseVisualConfig(course.id);
                  const percentage = course.progress?.percentage ?? 0;
                  const totalLectures = course.lectures?.length ?? 0;

                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
                    >
                      <Link
                        to={`/courses/${course.id}`}
                        className={`relative h-80 rounded-2xl overflow-hidden block group bg-linear-to-br ${gradient} hover:shadow-2xl transition-shadow`}
                      >
                        <div className="relative h-full p-6 flex flex-col">
                          <div className="mb-4">
                            <div className="inline-flex p-3 bg-primary-foreground/20 rounded-xl">
                              <Icon className="w-6 h-6 text-on-primary" />
                            </div>
                          </div>

                          <p
                            className="font-sans font-bold text-on-primary text-2xl md:text-3xl mb-3 tracking-[-1.2px]"
                            style={{ fontVariationSettings: "'wdth' 100" }}
                          >
                            {course.name}
                          </p>
                          <p className="font-sans font-light text-on-primary/90 text-base mb-6 flex-1 line-clamp-2">
                            {course.description}
                          </p>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-sans text-on-primary/80 text-sm">
                                Progress
                              </span>
                              <span className="font-sans font-medium text-on-primary text-sm">
                                {Math.round(percentage)}%
                              </span>
                            </div>

                            <ProgressBar
                              value={percentage}
                              total={100}
                              color="bg-white"
                              backgroundClassName="bg-[rgba(248,248,248,0.3)]"
                              delay={0.5 + idx * 0.05}
                            />

                            <p className="font-sans text-on-primary/70 text-xs mt-2">
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

          {/* All Courses */}
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="font-sans font-medium text-foreground text-2xl md:text-3xl mb-6"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              ALL COURSES
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course, idx) => {
                const { icon: Icon, gradient } = getCourseVisualConfig(course.id);
                const isAvailable =
                  course.progress === null || course.progress === undefined;
                const totalLectures = course.lectures?.length ?? 0;

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + idx * 0.05 }}
                  >
                    <Link
                      to={`/courses/${course.id}`}
                      className={`relative h-80 rounded-2xl overflow-hidden group cursor-pointer block bg-linear-to-br ${gradient} hover:shadow-2xl transition-shadow`}
                    >
                      <div className="relative h-full p-6 flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <div className="inline-flex p-3 bg-primary-foreground/20 rounded-xl">
                            <Icon className="w-6 h-6 text-on-primary" />
                          </div>
                          <div className="flex flex-wrap gap-2 justify-end">
                            <span className="bg-primary-foreground/20 text-on-primary px-3 py-1 rounded-full font-sans text-xs">
                              {totalLectures} lectures
                            </span>
                            {isAvailable && (
                              <span className="bg-primary-foreground/20 text-on-primary px-3 py-1 rounded-full font-sans text-xs">
                                Available
                              </span>
                            )}
                          </div>
                        </div>

                        <p
                          className="font-sans font-bold text-on-primary text-2xl md:text-3xl mb-3 tracking-[-1.2px]"
                          style={{ fontVariationSettings: "'wdth' 100" }}
                        >
                          {course.name}
                        </p>
                        <p className="font-sans font-light text-on-primary/90 text-base flex-1 line-clamp-3">
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
    </LoadingState>
  );
}