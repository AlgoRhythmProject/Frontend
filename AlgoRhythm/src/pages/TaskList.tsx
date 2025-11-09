import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, Circle } from 'lucide-react';
import { tasks, courses } from '../data/mockData';

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
          <div className="mb-8">
            <h1 className="font-['Roboto',sans-serif] font-medium text-white text-4xl md:text-5xl mb-4" style={{ fontVariationSettings: "'wdth' 100" }}>
              CODING TASKS
            </h1>
            <p className="font-['Roboto',sans-serif] text-[#b0b0b0] text-lg">
              Practice and master algorithms through hands-on coding challenges
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div className="bg-[#6942d5]/20 border border-[#6942d5] rounded-xl px-4 py-2">
                <p className="font-['Roboto',sans-serif] font-medium text-[#6942d5]">
                  {completedCount} / {totalCount} completed
                </p>
              </div>
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
              <div className="bg-[#242424] border border-[#3d3d3d] rounded-2xl p-6 sticky top-4">
                <h2 className="font-['Roboto',sans-serif] font-medium text-white text-xl mb-6">
                  Filters
                </h2>

                {/* Course Filter */}
                <div className="mb-6">
                  <h3 className="font-['Roboto',sans-serif] font-medium text-white text-sm mb-3">
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
                      className={`w-full text-left px-3 py-2 rounded-lg font-['Roboto',sans-serif] transition-colors ${selectedCourse === null
                        ? 'bg-[#6942d5] text-white'
                        : 'text-[#b0b0b0] hover:bg-[#1a1a1a]'
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
                          className={`w-full text-left px-3 py-2 rounded-lg font-['Roboto',sans-serif] transition-colors flex items-center justify-between ${selectedCourse === course.id
                            ? 'bg-[#6942d5] text-white'
                            : 'text-[#b0b0b0] hover:bg-[#1a1a1a]'
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
                  <h3 className="font-['Roboto',sans-serif] font-medium text-white text-sm mb-3">
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
                      className={`w-full text-left px-3 py-2 rounded-lg font-['Roboto',sans-serif] transition-colors ${selectedDifficulty === null
                        ? 'bg-[#6942d5] text-white'
                        : 'text-[#b0b0b0] hover:bg-[#1a1a1a]'
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
                          className={`w-full text-left px-3 py-2 rounded-lg font-['Roboto',sans-serif] transition-colors flex items-center justify-between ${selectedDifficulty === difficulty
                            ? 'bg-[#6942d5] text-white'
                            : 'text-[#b0b0b0] hover:bg-[#1a1a1a]'
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
                  <div aria-hidden="true" className="absolute border border-[#3d3d3d] border-solid inset-0 pointer-events-none rounded-xl" />
                  <input
                    type="text"
                    placeholder="Search tasks by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-white placeholder-[#6b6b6b] flex-1 font-['Roboto',sans-serif]"
                  />
                  <Search className="w-5 h-5 text-[#b0b0b0]" />
                </div>
              </motion.div>

              {/* Tasks List */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-[#242424] content-stretch flex flex-col items-start relative rounded-2xl shrink-0 w-full border border-[#3d3d3d] overflow-hidden mb-6"
              >
                {displayedTasks.length > 0 ? (
                  displayedTasks.map((task, index) => (
                    <div key={task.id} className="w-full">
                      <Link
                        to={`/tasks/${task.id}`}
                        className="content-stretch flex items-center relative shrink-0 w-full hover:bg-[#2a2a2a] transition-colors group"
                      >
                        {/* Completion Indicator */}
                        <div className="px-4 py-4">
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-[#ace798]" />
                          ) : (
                            <Circle className="w-5 h-5 text-[#3d3d3d] group-hover:text-[#6942d5] transition-colors" />
                          )}
                        </div>

                        {/* Task Info */}
                        <div className="box-border content-stretch flex gap-2 h-full items-center py-4 pr-4 relative flex-1 min-w-0">
                          <div className="content-stretch flex flex-col gap-1 items-start relative shrink-0 min-w-0 flex-1">
                            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-normal leading-[1.4] relative shrink-0 text-[#6942d5] text-xs">
                              {task.id}
                            </p>
                            <p className="font-['Roboto_Mono',sans-serif] font-medium leading-normal relative text-[#f6f6f6] text-base md:text-lg truncate w-full">
                              {task.title}
                            </p>
                            <p className="font-['Roboto',sans-serif] text-[#6b6b6b] text-sm">
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
                            <p className="font-['Roboto',sans-serif] font-normal text-[#f6f6f6] text-sm hidden md:block">
                              {task.difficulty}
                            </p>
                          </div>
                        </div>
                      </Link>

                      {/* Separator */}
                      {index < displayedTasks.length - 1 && (
                        <div className="h-px bg-[#3d3d3d] w-full" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="w-full py-16 text-center">
                    <p className="font-['Roboto',sans-serif] text-[#6b6b6b] text-lg">
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
                  <div className="font-['Roboto',sans-serif] text-[#b0b0b0]">
                    Page <span className="text-[#6942d5]">{currentPage}</span> of {totalPages}
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-[#242424] border border-[#3d3d3d] rounded-lg font-['Roboto',sans-serif] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#6942d5] transition-colors"
                    >
                      Previous
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-[#242424] border border-[#3d3d3d] rounded-lg font-['Roboto',sans-serif] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#6942d5] transition-colors"
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
