import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, BookOpen, Code, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

import { courseApi } from '../api/courseApi';
import { taskApi } from '../api/taskApi';
import { ProgressBar } from '../components/ProgressBar';
import { difficultyColors } from '@/utils/difficultyColors';

import type { Course } from '@/types/Course';
import type { Task } from '@/types/Task';
import type { Lecture } from '@/types/Lecture';

export function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [courseTasks, setCourseTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        // Pobieramy szczegóły kursu (z wykładami)
        const courseData = await courseApi.getById(id);
        setCourse(courseData);

        // Pobieramy wszystkie taski z informacją o kursach
        const allTasks = await taskApi.getAllWithCourses();

        // Filtrujemy taski należące do tego kursu
        const tasksForThisCourse = allTasks.filter(task =>
          task.courses.some(c => c.id === id)
        );

        setCourseTasks(tasksForThisCourse);
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
            className="bg-primary text-foreground px-6 py-2 rounded-lg hover:bg-[#7952e5] transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  // Statystyki - TODO: gdy będziemy śledzić completed, dostosuj
  const courseLectures = course.lectures;
  const completedLectures = 0; // TODO: dodać tracking completed
  const completedTasks = 0; // TODO: dodać tracking completed
  const totalItems = courseLectures.length + courseTasks.length;
  const completedItems = completedLectures + completedTasks;

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
            className="mb-6 flex items-center gap-2 text-primary hover:text-[#7952e5] font-sans transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Courses
          </button>

          {/* Course Header */}
          <div className="bg-linear-to-br from-primary to-[#8b5cf6] rounded-2xl p-8 md:p-12 mb-8">
            <div className="flex items-start justify-between gap-6 mb-6">
              <div className="flex-1">
                <h1 className="font-sans font-bold text-foreground text-4xl md:text-5xl mb-4">
                  {course.name}
                </h1>
                <p className="font-sans font-light text-foreground/90 text-lg mb-6">
                  {course.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white/20 text-foreground px-4 py-2 rounded-full text-sm font-sans font-medium">
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span className="bg-white/20 text-foreground px-4 py-2 rounded-full text-sm font-sans font-medium">
                    {courseLectures.length} Lectures
                  </span>
                  <span className="bg-white/20 text-foreground px-4 py-2 rounded-full text-sm font-sans font-medium">
                    {courseTasks.length} Tasks
                  </span>
                </div>
              </div>
            </div>

            {/* Progress */}
            {totalItems > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-foreground/90">Overall Progress</span>
                  <span className="font-sans font-medium text-foreground">
                    {completedItems}/{totalItems} completed
                  </span>
                </div>
                <ProgressBar
                  value={completedItems}
                  total={totalItems}
                  color='white'
                  height='h-4'
                  backgroundClassName='bg-white/20 rounded-full h-4'
                />
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
                  courseLectures.map((lecture) => (
                    <LectureCard key={lecture.id} lecture={lecture} />
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
                    <TaskCard key={task.id} task={task} />
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

// Komponent dla pojedynczego wykładu
function LectureCard({ lecture }: { lecture: Partial<Lecture> }) {
  const completed = false; // TODO: dodać tracking

  return (
    <Link
      to={`/lectures/${lecture.id}`}
      className="block bg-background hover:bg-card-hover border border-muted hover:border-primary rounded-lg p-4 transition-all"
    >
      <div className="flex items-start gap-3">
        {completed ? (
          <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-muted shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-sans font-medium text-foreground mb-1">
            {lecture.title}
          </p>
          <div className="flex items-center gap-2 text-muted-foreground">
          </div>
        </div>
      </div>
    </Link>
  );
}

// Komponent dla pojedynczego taska
function TaskCard({ task }: { task: Task }) {
  const completed = false; // TODO: dodać tracking

  return (
    <Link
      to={`/tasks/${task.id}`}
      className="block bg-background hover:bg-card-hover border border-muted hover:border-primary rounded-lg p-4 transition-all"
    >
      <div className="flex items-start gap-3">
        {completed ? (
          <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-muted shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-mono font-medium text-foreground mb-1 truncate">
            {task.title}
          </p>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${difficultyColors[task.difficulty] ?? 'bg-error'
                }`}
            />
            <span className="font-sans text-muted-foreground text-xs">
              {task.difficulty}
            </span>
            <span className="text-muted">•</span>
            <span className="font-sans text-muted-foreground text-xs">
              {task.taskType}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}