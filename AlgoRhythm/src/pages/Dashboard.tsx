import { Link } from 'react-router-dom';
import { Book, Code, Trophy, TrendingUp } from 'lucide-react';
import { tasks, courses, userStats } from '../data/mockData';
import arrowImage from "../assets/ArrowImage.svg";
import { motion } from 'framer-motion';
import { StatCard } from '../components/Dashboard/StatCard';
import { TaskCard } from '../components/Dashboard/TaskCard';

export function Dashboard() {
  const recentTasks = tasks.slice(0, 3);
  const activeCourse = courses[0];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary to-[#8b5cf6] p-8 md:p-12"
        >
          <div className="relative z-10">
            <div
              className="font-sans font-medium text-4xl md:text-6xl text-foreground mb-4"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              YOUR PLACE TO<br />LEARN ALGORITHMS
            </div>

            <div
              className="font-sans text-foreground/90 max-w-2xl mb-6"
            >
              Master data structures and algorithms through interactive coding challenges, comprehensive courses, and hands-on practice.
            </div>

            <Link
              to="/tasks"
              className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-sans font-medium hover:bg-white/90 transition-colors"
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

        {/*STAT CARDS*/}
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
              value: courses.filter(c => c.progress > 0).length,
              sub: "in progress",
              color: "text-success"
            },
            {
              icon: <Trophy className="w-5 h-5 text-warning" />,
              bg: "bg-warning/20",
              label: "Badges Earned",
              value: userStats.badges.filter(b => b.earned).length,
              sub: `of ${userStats.badges.length} total`,
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
              {recentTasks.map((task, i) => (
                <TaskCard key={task.id} task={task} delay={0.5 + i * 0.1} />
              ))}
            </div>
          </motion.div>


          {/* ACTIVE COURSE */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-linear-to-br from-primary to-[#8b5cf6] rounded-2xl p-6 text-foreground"
          >
            <h2 className="font-sans font-medium text-2xl mb-4">Continue Learning</h2>
            <p className="font-sans font-bold text-3xl mb-3">{activeCourse.title}</p>
            <p className="font-sans font-light text-foreground/90 mb-4">{activeCourse.description}</p>

            {/* Animated Progress Bar */}
            <div className="bg-white/20 rounded-full h-3 mb-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(activeCourse.progress / activeCourse.total) * 100}%` }}
                transition={{ duration: 1, delay: 0.7 }}
                className="bg-white rounded-full h-3"
              />
            </div>

            <p className="font-sans font-light text-sm mb-4">
              Progress: {activeCourse.progress}/{activeCourse.total}
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/courses"
                className="inline-block bg-white text-primary px-6 py-2 rounded-lg font-sans font-medium hover:bg-white/90 transition-colors"
              >
                Continue Course
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
