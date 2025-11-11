import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, BookOpen, Code, CheckCircle2, Clock } from 'lucide-react';
import { courses, tasks, lectures } from '../data/mockData';
import { ProgressBar } from '../components/ProgressBar';

export function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground text-2xl mb-4">Course not found</p>
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

  const courseLectures = lectures.filter((l) => l.courseId === course.id);
  const courseTasks = tasks.filter((t) => t.courseId === course.id);
  const completedLectures = courseLectures.filter((l) => l.completed).length;
  const completedTasks = courseTasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
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
                {course.title}
              </h1>
              <p className="font-sans font-light text-foreground/90 text-lg mb-6">
                {course.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/20 text-foreground px-4 py-2 rounded-full text-sm font-sans font-medium">
                  {course.difficulty}
                </span>
                <span className="bg-white/20 text-foreground px-4 py-2 rounded-full text-sm font-sans font-medium">
                  {course.isFree ? 'Free' : 'Premium'}
                </span>
              </div>
            </div>
          </div>
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-foreground/90">Overall Progress</span>
              <span className="font-sans font-medium text-foreground">
                {course.progress}/{course.total} completed
              </span>
            </div>
            <ProgressBar value={course.progress} total={course.total} color='white' height='h-4' backgroundClassName='bg-white/20 rounded-full h-4' ></ProgressBar>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lectures Section */}
          <div className="bg-card border border-muted rounded-2xl p-6">
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

            <div className="space-y-2">
              {courseLectures.length > 0 ? (
                courseLectures.map((lecture) => (
                  <Link
                    key={lecture.id}
                    to={`/lectures?id=${lecture.id}`}
                    className="block bg-background hover:bg-card-hover border border-muted hover:border-primary rounded-lg p-4 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {lecture.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-sans font-medium text-foreground mb-1">
                          {lecture.title}
                        </p>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span className="font-sans text-xs">
                            {lecture.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="font-sans text-muted-foreground text-center py-8">
                  No lectures available yet
                </p>
              )}
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-card border border-muted rounded-2xl p-6">
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

            <div className="space-y-2">
              {courseTasks.length > 0 ? (
                courseTasks.map((task) => (
                  <Link
                    key={task.id}
                    to={`/tasks/${task.id}`}
                    className="block bg-background hover:bg-card-hover border border-muted hover:border-primary rounded-lg p-4 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {task.completed ? (
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
                            className={`w-3 h-3 rounded-full ${task.difficulty === 'Easy'
                              ? 'bg-success'
                              : task.difficulty === 'Medium'
                                ? 'bg-warning'
                                : 'bg-error'
                              }`}
                          />
                          <span className="font-sans text-muted-foreground text-xs">
                            {task.difficulty}
                          </span>
                          <span className="text-muted">•</span>
                          <span className="font-sans text-muted-foreground text-xs">
                            {task.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="font-sans text-muted-foreground text-center py-8">
                  No tasks available yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
