import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, BookOpen, Code, CheckCircle2, Loader2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

import { courseApi } from '../api/courseApi';
import { taskApi } from '../api/taskApi';
import { courseProgressApi } from '../api/courseProgressApi';
import { ProgressBar } from '../components/ProgressBar';
import { TaskCard } from '@/components/TaskCard';

import type { Course } from '@/types/Course';
import type { Task } from '@/types/Task';
import type { Lecture } from '@/types/Lecture';
import type { CourseProgress } from '@/types/CourseProgress';

export function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [courseTasks, setCourseTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseProgress = async (courseId: string) => {
    try {
      const progressData = await courseProgressApi.getMyCourseProgress(courseId);
      setProgress(progressData);
    } catch (err: any) {
      // 404 to OK - użytkownik jeszcze nie zaczął kursu
      if (err.response?.status !== 404) {
        console.error('Failed to load progress:', err);
      }
      // Jeśli 404, progress pozostaje null
      setProgress(null);
    }
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) {
        setError('Course ID is missing');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [courseData, allTasks] = await Promise.all([
          courseApi.getById(id),
          taskApi.getAllWithCourses(),
        ]);

        setCourse(courseData);

        const tasksForThisCourse = allTasks.filter(task =>
          task.courses!.some(c => c.id === id)
        );
        setCourseTasks(tasksForThisCourse);

        // Pobierz progress
        await fetchCourseProgress(id);
      } catch (err: any) {
        console.error('Failed to load course:', err);
        setError(err.response?.data?.message || 'Failed to load course. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);


  // LOADING STATE
  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-sans">Loading course...</p>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error || !course) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-foreground text-2xl mb-4">
            {error || 'Course not found'}
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="bg-primary cursor-pointer text-foreground px-6 py-2 rounded-lg hover:bg-primary-hover transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const courseLectures = course.lectures || [];
  const completedLectureIds = new Set(progress?.completedLectureIds || []);
  const completedTaskIds = new Set(progress?.completedTaskIds || []);

  const completedLectures = progress?.completedLecturesCount || 0;
  const completedTasks = progress?.completedTasksCount || 0;
  const totalItems = courseLectures.length + courseTasks.length;
  const completedItems = completedLectures + completedTasks;
  const overallPercentage = progress?.percentage ?? 0;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <button
            onClick={() => navigate('/courses')}
            className="mb-6 flex items-center cursor-pointer gap-2 text-primary hover:text-primary-hover font-sans transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Courses
          </button>

          {/* Course Header */}
          <div className="bg-linear-to-br from-primary to-primary-light rounded-2xl p-8 md:p-12 mb-8">
            <div className="flex items-start justify-between gap-6 mb-6">
              <div className="flex-1">
                <h1 className="font-sans font-bold text-on-primary text-4xl md:text-5xl mb-4">
                  {course.name}
                </h1>
                <p className="font-sans font-light text-on-primary/90 text-lg mb-6">
                  {course.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-primary-foreground/20 text-on-primary px-4 py-2 rounded-full text-sm font-sans font-medium">
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span className="bg-primary-foreground/20 text-on-primary px-4 py-2 rounded-full text-sm font-sans font-medium">
                    {courseLectures.length} Lectures
                  </span>
                  <span className="bg-primary-foreground/20 text-on-primary px-4 py-2 rounded-full text-sm font-sans font-medium">
                    {courseTasks.length} Tasks
                  </span>
                </div>
              </div>
            </div>

            {/* Progress */}
            {totalItems > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-on-primary/90">Overall Progress</span>
                  <span className="font-sans font-medium text-on-primary">
                    {completedItems}/{totalItems} completed ({Math.round(overallPercentage)}%)
                  </span>
                </div>
                <ProgressBar
                  value={overallPercentage}
                  total={100}
                  color="bg-white"
                  height="h-4"
                  backgroundClassName="bg-white/20 rounded-full h-4"
                />
              </div>
            )}

            {/* Progress Stats from API */}
            {progress && (
              <div className="mt-4 flex flex-wrap gap-4 text-white/80 text-sm">
                {progress.startedAt && (
                  <span>
                    Started: {new Date(progress.startedAt).toLocaleDateString()}
                  </span>
                )}
                {progress.completedAt && (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Completed: {new Date(progress.completedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lectures Section */}
            <motion.div
              className="bg-card border border-muted rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-sans font-medium text-foreground text-xl">
                      Lectures
                    </h2>
                    <p className="font-sans text-muted-foreground text-sm">
                      {completedLectures}/{courseLectures.length} completed
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {courseLectures.length > 0 ? (
                  courseLectures.map((lecture, index) => (
                    <LectureCard
                      key={lecture.id}
                      lecture={lecture}
                      index={index}
                      isCompleted={completedLectureIds.has(lecture.id)}
                      courseId={id!}
                    />
                  ))
                ) : (
                  <p className="font-sans text-muted-foreground text-center py-8">
                    No lectures available yet
                  </p>
                )}
              </div>
            </motion.div>

            {/* Tasks Section */}
            <motion.div
              className="bg-card border border-muted rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-info/20 rounded-lg">
                    <Code className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <h2 className="font-sans font-medium text-foreground text-xl">
                      Coding Tasks
                    </h2>
                    <p className="font-sans text-muted-foreground text-sm">
                      {completedTasks}/{courseTasks.length} completed
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {courseTasks.length > 0 ? (
                  courseTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      fromCourse={true}
                      courseId={id!}
                      isCompleted={completedTaskIds.has(task.id)}
                    />
                  ))
                ) : (
                  <p className="font-sans text-muted-foreground text-center py-8">
                    No tasks available yet
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface LectureCardProps {
  lecture: Partial<Lecture>;
  index: number;
  isCompleted: boolean;
  courseId: string;
}

function LectureCard({ lecture, index, isCompleted, courseId }: Readonly<LectureCardProps>) {
  return (
    <Link
      to={`/lectures?id=${lecture.id}`}
      state={{ fromCourse: true, courseId }}
      className="block bg-background hover:bg-card-hover border border-muted hover:border-primary rounded-lg p-4 transition-all group"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : (
            <Circle className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-muted-foreground font-medium">
              Lecture {index + 1}
            </span>
            {isCompleted && (
              <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
                Completed
              </span>
            )}
          </div>
          <p className="font-sans font-medium text-foreground">
            {lecture.title}
          </p>
        </div>
      </div>
    </Link>
  );
}