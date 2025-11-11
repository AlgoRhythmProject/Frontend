import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, Circle } from 'lucide-react';
import { tasks, courses } from '../data/mockData';
import { PageHeader } from '../components/PageHeader';
import { StatBox } from '../components/StatBox';

export function TaskList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = !selectedCourse || task.courseId === selectedCourse;
    const matchesDifficulty = !selectedDifficulty || task.difficulty === selectedDifficulty;
    return matchesSearch && matchesCourse && matchesDifficulty;
  });

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const displayedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <PageHeader title='CODING TASKS' subtitle='Practice and master algorithms through hands-on coding challenges>' />
          <div className="mb-8">
            <div className="mt-4 flex items-center gap-4">
              <StatBox color="primary">
                {completedCount} / {totalCount} completed
              </StatBox>
            </div>
          </div>

          {/* Main Layout with Sidebar */}
          <div className="flex gap-6">
            {/* Left Filter Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="hidden lg:block w-64 shrink-0"
            >
              <div className="bg-card border border-muted rounded-2xl p-6 sticky top-4">
                <h2 className="font-sans font-medium text-foreground text-xl mb-6">
                  Filters
                </h2>

                {/* Course Filter */}
                <div className="mb-6">
                  <h3 className="font-sans font-medium text-foreground text-sm mb-3">
                    COURSE
                  </h3>
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedCourse(null);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg font-sans transition-colors ${selectedCourse === null
                        ? 'bg-primary text-foreground'
                        : 'text-muted-foreground hover:bg-background'
                        }`}
                    >
                      All Courses
                    </motion.button>
                    {courses.map((course) => {
                      const courseTaskCount = tasks.filter(t => t.courseId === course.id).length;
                      return (
                        <motion.button
                          key={course.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedCourse(course.id);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg font-sans transition-colors flex items-center justify-between ${selectedCourse === course.id
                            ? 'bg-primary text-foreground'
                            : 'text-muted-foreground hover:bg-background'
                            }`}
                        >
                          <span className="truncate">{course.title}</span>
                          <span className="text-xs ml-2">({courseTaskCount})</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <h3 className="font-sans font-medium text-foreground text-sm mb-3">
                    DIFFICULTY
                  </h3>
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedDifficulty(null);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg font-sans transition-colors ${selectedDifficulty === null
                        ? 'bg-primary text-foreground'
                        : 'text-muted-foreground hover:bg-background'
                        }`}
                    >
                      All Levels
                    </motion.button>
                    {['Easy', 'Medium', 'Hard'].map((difficulty) => {
                      const difficultyCount = tasks.filter(t => t.difficulty === difficulty).length;
                      const color = difficulty === 'Easy' ? '#ACE798' : difficulty === 'Medium' ? '#FFEE9C' : '#FE6868';
                      return (
                        <motion.button
                          key={difficulty}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedDifficulty(difficulty);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg font-sans transition-colors flex items-center justify-between ${selectedDifficulty === difficulty
                            ? 'bg-primary text-foreground'
                            : 'text-muted-foreground hover:bg-background'
                            }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                            {difficulty}
                          </span>
                          <span className="text-xs">({difficultyCount})</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mb-6"
              >
                <div className="box-border content-stretch flex items-center justify-between px-4 py-3 relative rounded-xl shrink-0 w-full bg-transparent">
                  <div aria-hidden="true" className="absolute border border-muted border-solid inset-0 pointer-events-none rounded-xl" />
                  <input
                    type="text"
                    placeholder="Search tasks by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-foreground placeholder-[#6b6b6b] flex-1 font-sans"
                  />
                  <Search className="w-5 h-5 text-muted-foreground" />
                </div>
              </motion.div>

              {/* Tasks List */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-card content-stretch flex flex-col items-start relative rounded-2xl shrink-0 w-full border border-muted overflow-hidden mb-6"
              >
                {displayedTasks.length > 0 ? (
                  displayedTasks.map((task, index) => (
                    <div key={task.id} className="w-full">
                      <Link
                        to={`/tasks/${task.id}`}
                        className="content-stretch flex items-center relative shrink-0 w-full hover:bg-card-hover transition-colors group"
                      >
                        {/* Completion Indicator */}
                        <div className="px-4 py-4">
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-success" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                          )}
                        </div>

                        {/* Task Info */}
                        <div className="box-border content-stretch flex gap-2 h-full items-center py-4 pr-4 relative flex-1 min-w-0">
                          <div className="content-stretch flex flex-col gap-1 items-start relative shrink-0 min-w-0 flex-1">
                            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-normal leading-[1.4] relative shrink-0 text-primary text-xs">
                              {task.id}
                            </p>
                            <p className="font-mono font-medium leading-normal relative text-[#f6f6f6] text-base md:text-lg truncate w-full">
                              {task.title}
                            </p>
                            <p className="font-sans text-[#6b6b6b] text-sm">
                              {task.category}
                            </p>
                          </div>
                        </div>

                        {/* Difficulty Badge */}
                        <div className="px-4 py-4 flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor:
                                  task.difficulty === 'Easy'
                                    ? '#ACE798'
                                    : task.difficulty === 'Medium'
                                      ? '#FFEE9C'
                                      : '#FE6868'
                              }}
                            />
                            <p className="font-sans font-normal text-[#f6f6f6] text-sm hidden md:block">
                              {task.difficulty}
                            </p>
                          </div>
                        </div>
                      </Link>

                      {/* Separator */}
                      {index < displayedTasks.length - 1 && (
                        <div className="h-px bg-muted w-full" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="w-full py-16 text-center">
                    <p className="font-sans text-[#6b6b6b] text-lg">
                      No tasks found matching your filters
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="flex items-center justify-between"
                >
                  <div className="font-sans text-muted-foreground">
                    Page <span className="text-primary">{currentPage}</span> of {totalPages}
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-card border border-muted rounded-lg font-sans text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary transition-colors"
                    >
                      Previous
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-card border border-muted rounded-lg font-sans text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary transition-colors"
                    >
                      Next
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
