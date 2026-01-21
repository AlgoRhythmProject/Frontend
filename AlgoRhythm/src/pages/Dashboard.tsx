import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Book, Code, Trophy, TrendingUp, Loader2 } from 'lucide-react';
import arrowImage from "../assets/ArrowImage.svg";
import { motion } from 'framer-motion';
import { StatCard } from '../components/Dashboard/StatCard';
import { TaskCard } from '@/components/TaskCard';
import { taskApi } from '../api/task/taskApi';
import { courseApi } from '../api/course/courseApi';
import type { Task } from '@/types/Task';
import type { Course } from '@/types/Course';
import type { CourseProgress } from '@/types/CourseProgress';
import { achievementApi } from '@/api/achievements/achievementApi';
import type { UserAchievementDto } from '@/api/achievements/types';
import { courseProgressApi } from '@/api/courseProgress/courseProgressApi';
import type { UserStreakDto } from '@/api/userStreak/types';
import { userStreakApi } from '@/api/userStreak/userStreakApi';

type TaskWithCourses = Task & {
  courseIds: string[];
  completed: boolean;
};

type UICourse = Course & {
  progress?: CourseProgress | null;
};

export function Dashboard() {
  const [tasks, setTasks] = useState<TaskWithCourses[]>([]);
  const [activeCourse, setActiveCourse] = useState<UICourse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [coursesWithProgressCount, setCoursesWithProgressCount] = useState<number>(0);
  const [completedTasksCount, setCompletedTasksCount] = useState<number>(0);
  const [streak, setStreak] = useState<UserStreakDto | null>(null);
  const [achievements, setAchievements] = useState<UserAchievementDto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [taskResp, courseResp, completedTasksResp, streakResp, achievementsResp] = await Promise.all([
          taskApi.getPublished(),
          courseApi.getPublished(),
          courseProgressApi.getMyCompletedTasks(),
          userStreakApi.getMyStreak(),
          achievementApi.getMyAchievements(),
        ]);

        const completedTaskIds = new Set(completedTasksResp.completedTaskIds);
        setCompletedTasksCount(completedTaskIds.size);
        setStreak(streakResp);
        setAchievements(achievementsResp);

        const taskToCourses: Record<string, string[]> = {};
        courseResp.forEach(course => {
          course.tasks.forEach(taskInCourse => {
            if (!taskToCourses[taskInCourse.id]) {
              taskToCourses[taskInCourse.id] = [];
            }
            taskToCourses[taskInCourse.id].push(course.id);
          });
        });

        const tasksWithCourseIds: TaskWithCourses[] = taskResp.map(t => ({
          ...t,
          courseIds: taskToCourses[t.id] ?? [],
          completed: completedTaskIds.has(t.id)
        }));

        setTasks(tasksWithCourseIds);

        const settled = await Promise.allSettled(
          courseResp.map((c) => courseProgressApi.getMyCourseProgress(c.id))
        );

        const coursesWithProgress: UICourse[] = courseResp.map((c, idx) => {
          const result = settled[idx];
          if (result.status === "fulfilled") {
            return { ...c, progress: result.value };
          } else {
            return { ...c, progress: null };
          }
        });

        const coursesInProgress = coursesWithProgress.filter(
          c => c.progress !== null && c.progress !== undefined && (c.progress.percentage ?? 0) > 0
        );

        setCoursesWithProgressCount(coursesInProgress.length);

        if (coursesInProgress.length > 0) {
          setActiveCourse(coursesInProgress[0]);
        } else if (coursesWithProgress.length > 0) {
          setActiveCourse(coursesWithProgress[0]);
        }

      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // User stats
  const earnedAchievementsCount = achievements.filter(a => a.isCompleted).length;
  const totalAchievementsCount = achievements.length;

  const userStats = {
    tasksCompleted: completedTasksCount,
    totalTasks: tasks.length,
    currentStreak: streak?.currentStreak ?? 0,
    achievementsEarned: earnedAchievementsCount,
    totalAchievements: totalAchievementsCount,
  };

  const recentTasks = tasks
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-sans">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-br from-always-primary to-primary-light p-8 md:p-12"
        >
          <div className="relative z-10">
            <div
              className="font-sans font-medium text-4xl md:text-6xl text-on-primary mb-4"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              YOUR PLACE TO<br />LEARN ALGORITHMS
            </div>

            <div className="font-sans text-on-primary/90 text-lg max-w-2xl mb-6">
              Master data structures and algorithms through interactive coding challenges, comprehensive courses, and hands-on practice.
            </div>

            <Link
              to="/tasks"
              className="inline-block bg-primary-foreground text-always-primary px-8 py-3 rounded-lg font-sans font-medium hover:bg-primary-foreground/90 transition-colors"
            >
              Start Practicing
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block"
          >
            <div className="flex items-center justify-center rotate-350">
              <img alt="" className="w-64 h-64 object-cover rounded-2xl" src={arrowImage} />
            </div>
          </motion.div>
        </motion.div>

        {/* STAT CARDS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              icon: <Code className="w-5 h-5 text-primary" />,
              bg: "bg-primary/20",
              label: "Tasks Solved",
              value: userStats.tasksCompleted,
              sub: `of ${userStats.totalTasks} total`,
              color: "text-primary"
            },
            {
              icon: <TrendingUp className="w-5 h-5 text-info" />,
              bg: "bg-info/20",
              label: "Current Streak",
              value: userStats.currentStreak,
              sub: "days in a row",
              color: "text-info"
            },
            {
              icon: <Book className="w-5 h-5 text-success" />,
              bg: "bg-success/20",
              label: "Courses Active",
              value: coursesWithProgressCount,
              sub: "in progress",
              color: "text-success"
            },
            {
              icon: <Trophy className="w-5 h-5 text-warning" />,
              bg: "bg-warning/20",
              label: "Achievements Earned",
              value: userStats.achievementsEarned,
              sub: `of ${userStats.totalAchievements} total`,
              color: "text-warning"
            }
          ].map((stat, idx) => (
            <StatCard
              key={idx}
              icon={stat.icon}
              bg={stat.bg}
              label={stat.label}
              value={stat.value}
              sub={stat.sub}
              color={stat.color}
              delay={0.2 + idx * 0.1}
            />
          ))}
        </motion.div>

        {/* TWO COLUMN SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* RECENT TASKS */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 bg-card border border-muted rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-sans text-foreground text-2xl">Recent Tasks</h2>
              <Link to="/tasks" className="font-sans text-primary hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">No tasks available yet</p>
              )}
            </div>
          </motion.div>

          {/* ACTIVE COURSE */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-linear-to-br from-always-primary to-primary-light rounded-2xl p-6 text-foreground"
          >
            {activeCourse ? (
              <>
                <h2 className="font-sans font-medium text-2xl text-on-primary mb-4">
                  {activeCourse.progress && (activeCourse.progress.percentage ?? 0) > 0
                    ? 'Continue Learning'
                    : 'Start Learning'}
                </h2>
                <p className="font-sans font-bold text-3xl mb-3 text-on-primary">{activeCourse.name}</p>
                <p className="font-sans font-light text-on-primary/90 mb-4">{activeCourse.description}</p>

                {/* Progress Bar */}
                <div className="bg-primary-foreground/20 rounded-full h-3 mb-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${activeCourse.progress?.percentage ?? 0}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="bg-primary-foreground rounded-full h-3"
                  />
                </div>

                <p className="font-sans font-light text-sm mb-4 text-on-primary">
                  Progress: {Math.round(activeCourse.progress?.percentage ?? 0)}%
                </p>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={`/courses/${activeCourse.id}`}
                    className="inline-block bg-primary-foreground text-always-primary px-6 py-2 rounded-lg font-sans font-medium hover:bg-primary-foreground/90 transition-colors"
                  >
                    {activeCourse.progress && (activeCourse.progress.percentage ?? 0) > 0
                      ? 'Continue Course'
                      : 'Start Course'}
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <h2 className="font-sans font-medium text-2xl mb-4">Start Learning</h2>
                <p className="font-sans font-light text-foreground/90 mb-6">
                  No courses available yet. Check back soon!
                </p>
                <Link
                  to="/courses"
                  className="inline-block bg-primary-foreground text-primary px-6 py-2 rounded-lg font-sans font-medium hover:bg-primary-foreground/90 transition-colors"
                >
                  Browse Courses
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}