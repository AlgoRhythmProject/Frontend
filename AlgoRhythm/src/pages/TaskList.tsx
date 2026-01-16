import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { StatBox } from '../components/StatBox';

import { taskApi } from '../api/taskApi';
import { courseApi } from '../api/courseApi';
import { tagApi, type Tag } from '../api/tagApi';
import { courseProgressApi } from '../api/courseProgressApi';
import type { Course } from '@/types/Course';
import type { Task } from '@/types/Task';
import { DifficultyLabel, type Difficulty } from '@/utils/difficulty';
import { FilterButton } from '@/components/Tasks/FilterButton';
import { Pagination } from '@/components/Tasks/Pagination';
import { SearchBox } from '@/components/Tasks/SearchBox';
import { TaskListBox } from '@/components/Tasks/TaskListBox';

type TaskWithCourses = Task & {
  courseIds: string[];
  completed: boolean;
};

export function TaskList() {
  const [tasks, setTasks] = useState<TaskWithCourses[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [, setCompletedTaskIds] = useState<Set<string>>(new Set());

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // FETCH TASKS + COURSES + TAGS + COMPLETED TASKS
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [taskResp, courseResp, tagResp, completedResp] = await Promise.all([
          taskApi.getPublished(),
          courseApi.getPublished(),
          tagApi.getAll(),
          courseProgressApi.getMyCompletedTasks(),
        ]);

        const tasks = taskResp;
        const courses = courseResp;
        const tags = tagResp;
        const completedIds = new Set(completedResp.completedTaskIds);

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
          courseIds: taskToCourses[t.id] ?? [],
          completed: completedIds.has(t.id)
        }));

        setTasks(tasksWithCourseIds);
        setCourses(courses);
        setTags(tags);
        setCompletedTaskIds(completedIds);
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
      selectedDifficulty === null || task.difficulty === selectedDifficulty;

    const matchesTag =
      !selectedTag || (task.tagIds && task.tagIds.includes(selectedTag));

    return matchesSearch && matchesCourse && matchesDifficulty && matchesTag;
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
            className="bg-primary text-foreground px-6 py-2 rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
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
                <div className="mb-6">
                  <h3 className="font-sans font-medium text-foreground text-sm mb-3">DIFFICULTY</h3>

                  <div className="space-y-2">
                    <FilterButton
                      active={selectedDifficulty === null}
                      onClick={() => { setSelectedDifficulty(null); setCurrentPage(1); }}
                    >
                      All Levels
                    </FilterButton>

                    {([0, 1, 2] as const).map(difficulty => {
                      const diff = difficulty as Difficulty;
                      const count = tasks.filter(t => t.difficulty === diff).length;

                      return (
                        <FilterButton
                          key={difficulty}
                          active={selectedDifficulty === diff}
                          onClick={() => {
                            setSelectedDifficulty(diff);
                            setCurrentPage(1);
                          }}
                        >
                          {DifficultyLabel[diff]} ({count})
                        </FilterButton>
                      );
                    })}
                  </div>
                </div>

                {/* TAG FILTER */}
                <div>
                  <h3 className="font-sans font-medium text-foreground text-sm mb-3">TAGS</h3>

                  <div className="space-y-2">
                    <FilterButton
                      active={selectedTag === null}
                      onClick={() => { setSelectedTag(null); setCurrentPage(1); }}
                    >
                      All Tags
                    </FilterButton>

                    {tags.map((tag) => {
                      const count = tasks.filter(t =>
                        t.tagIds && t.tagIds.includes(tag.id)
                      ).length;

                      if (count === 0) return null;

                      return (
                        <FilterButton
                          key={tag.id}
                          active={selectedTag === tag.id}
                          onClick={() => {
                            setSelectedTag(tag.id);
                            setCurrentPage(1);
                          }}
                        >
                          <span className="truncate">{tag.name}</span>
                          <span className="text-xs ml-2">({count})</span>
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