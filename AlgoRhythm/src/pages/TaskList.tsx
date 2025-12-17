import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, Circle, Loader2 } from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { StatBox } from '../components/StatBox';

import { taskApi } from '../api/taskApi';
import { courseApi } from '../api/courseApi';
import type { Course } from '@/types/Course';
import type { Task } from '@/types/Task';
import { DifficultyLabel, type Difficulty } from '@/utils/difficulty';

type TaskWithCourses = Task & {
  courseIds: string[];
};

export function TaskList() {
  const [tasks, setTasks] = useState<TaskWithCourses[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // FETCH TASKS + COURSES
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [taskResp, courseResp] = await Promise.all([
          taskApi.getAll(),
          courseApi.getAll(),
        ]);

        const tasks = taskResp;
        const courses = courseResp;

        const taskToCourses: Record<string, string[]> = {};

        courses.forEach(course => {
          course.tasks.forEach(taskInCourse => {
            if (!taskToCourses[taskInCourse.id]) {
              taskToCourses[taskInCourse.id] = [];
            }
            taskToCourses[taskInCourse.id].push(course.id);
          });
        });

        const tasksWithCourseIds: TaskWithCourses[] = tasks.map(t => ({
          ...t,
          courseIds: taskToCourses[t.id] ?? []
        }));

        setTasks(tasksWithCourseIds);
        setCourses(courses);
      } catch (err: any) {
        console.error('Failed to load tasks or courses:', err);
        setError(err.response?.data?.message || 'Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  // FILTERING
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse =
      !selectedCourse || task.courseIds.includes(selectedCourse);

    const matchesDifficulty =
      !selectedDifficulty || task.difficulty === selectedDifficulty;

    return matchesSearch && matchesCourse && matchesDifficulty;
  });

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const displayedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  // LOADING
  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-sans">Loading tasks & courses...</p>
        </div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="max-w-md text-center">
          <p className="text-error text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-foreground px-6 py-2 rounded-lg hover:bg-[#7952e5] transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // RENDER
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* HEADER */}
          <PageHeader
            title='CODING TASKS'
            subtitle='Practice and master algorithms through hands-on coding challenges'
          />

          <div className="mb-8 flex">
            <StatBox color="primary">
              {completedCount} / {totalCount} completed
            </StatBox>
          </div>

          <div className="flex gap-6">

            {/* LEFT FILTER SIDEBAR */}
            <motion.div className="hidden lg:block w-64 shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="bg-card border border-muted rounded-2xl p-6 sticky top-4">

                <h2 className="font-sans font-medium text-foreground text-xl mb-6">Filters</h2>

                {/* COURSE FILTER */}
                <div className="mb-6">
                  <h3 className="font-sans font-medium text-foreground text-sm mb-3">COURSE</h3>

                  <div className="space-y-2">
                    {/* ALL */}
                    <FilterButton
                      active={selectedCourse === null}
                      onClick={() => { setSelectedCourse(null); setCurrentPage(1); }}
                    >
                      All Courses
                    </FilterButton>

                    {/* REAL COURSES FROM BACKEND */}
                    {courses.map((course) => {
                      const count = tasks.filter(t => t.courseIds.includes(course.id)).length;

                      if (count === 0) return null;

                      return (
                        <FilterButton
                          key={course.id}
                          active={selectedCourse === course.id}
                          onClick={() => { setSelectedCourse(course.id); setCurrentPage(1); }}
                        >
                          <span className="truncate">{course.name}</span>
                          <span className="text-xs ml-2">({count})</span>
                        </FilterButton>
                      );
                    })}
                  </div>
                </div>

                {/* DIFFICULTY FILTER */}
                <div>
                  <h3 className=" font-sans font-medium text-foreground text-sm mb-3">DIFFICULTY</h3>

                  <div className="space-y-2">
                    <FilterButton
                      active={selectedDifficulty === null}
                      onClick={() => { setSelectedDifficulty(null); setCurrentPage(1); }}
                    >
                      All Levels
                    </FilterButton>

                    {[0, 1, 2].map(difficulty => {
                      const count = tasks.filter(t => t.difficulty === difficulty).length;

                      return (
                        <FilterButton
                          key={difficulty}
                          active={selectedDifficulty === difficulty}
                          onClick={() => {
                            setSelectedDifficulty(difficulty as Difficulty);
                            setCurrentPage(1);
                          }}
                        >
                          {DifficultyLabel[difficulty as Difficulty]} ({count})
                        </FilterButton>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* MAIN CONTENT */}
            <div className="flex-1 min-w-0">

              {/* SEARCH */}
              <SearchBox
                value={searchQuery}
                onChange={setSearchQuery}
              />

              {/* TASKS LIST */}
              <TaskListBox tasks={displayedTasks} />

              {/* PAGINATION */}
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onChange={setCurrentPage}
              />

            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

/* ----------- Reusable Small Components ----------- */

function FilterButton({ active, onClick, children }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        w-full cursor-pointer text-left px-3 py-2 rounded-lg font-sans transition-colors flex items-center justify-between
        ${active ? 'bg-primary text-foreground' : 'text-muted-foreground hover:bg-background'}
      `}
    >
      {children}
    </motion.button>
  );
}

function SearchBox({ value, onChange }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mb-6"
    >
      <div className="box-border flex items-center px-4 py-3 relative rounded-xl bg-transparent">
        <div aria-hidden="true" className="absolute border border-muted inset-0 pointer-events-none rounded-xl" />
        <input
          type="text"
          placeholder="Search tasks by name..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent border-none outline-none text-foreground placeholder-[#6b6b6b] flex-1"
        />
        <Search className="w-5 h-5 text-muted-foreground" />
      </div>
    </motion.div>
  );
}

function TaskListBox({ tasks }: { tasks: TaskWithCourses[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card flex flex-col rounded-2xl border border-muted overflow-hidden mb-6"
    >
      {tasks.length > 0 ? (
        tasks.map((task, index) => (
          <div key={task.id} className="w-full">
            <Link
              to={`/tasks/${task.id}`}
              className="flex items-center hover:bg-card-hover transition-colors group"
            >
              {/* Completion */}
              <div className="px-4 py-4">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <Circle className="w-5 h-5 text-muted group-hover:text-primary" />
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 min-w-0 py-4 pr-4">
                <p className="text-primary text-xs">{task.id}</p>
                <p className="text-[#f6f6f6] text-lg truncate">{task.title}</p>
                <p className="text-[#6b6b6b] text-sm">{task.category}</p>
              </div>

              {/* Difficulty */}
              <div className="px-4 py-4 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        task.difficulty === 0
                          ? '#ACE798'
                          : task.difficulty === 1
                            ? '#FFEE9C'
                            : '#FE6868'
                    }}
                  />
                  <p className="text-[#f6f6f6] text-sm hidden md:block">{DifficultyLabel[task.difficulty]}</p>
                </div>
              </div>
            </Link>

            {index < tasks.length - 1 && <div className="h-px bg-muted w-full" />}
          </div>
        ))
      ) : (
        <div className="w-full py-16 text-center">
          <p className="text-[#6b6b6b] text-lg">No tasks found</p>
        </div>
      )}
    </motion.div>
  );
}

function Pagination({ totalPages, currentPage, onChange }: any) {
  if (totalPages <= 1) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
      <div className="text-muted-foreground">Page <span className="text-primary">{currentPage}</span> of {totalPages}</div>

      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-card border border-muted rounded-lg disabled:opacity-30 hover:border-primary"
        >
          Previous
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-card border border-muted rounded-lg disabled:opacity-30 hover:border-primary"
        >
          Next
        </motion.button>
      </div>
    </motion.div>
  );
}