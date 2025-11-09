import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Code, TrendingUp, Award } from 'lucide-react';
import { courses } from '../data/mockData';

// Icon mapping for courses
const courseIcons = {
  'course-1': BookOpen,
  'course-2': Code,
  'course-3': TrendingUp,
  'course-4': Award,
};

// Color mapping for courses
const courseColors = {
  'course-1': 'from-[#6942d5] to-[#8b5cf6]',
  'course-2': 'from-[#00eaff] to-[#0ea5e9]',
  'course-3': 'from-[#ace798] to-[#4ade80]',
  'course-4': 'from-[#ffee9c] to-[#fbbf24]',
};

export function Courses() {
  const activeCourses = courses.filter(c => c.progress > 0);
  const availableCourses = courses;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h1 className="font-['Roboto',sans-serif] font-medium text-white text-4xl md:text-5xl mb-4" style={{ fontVariationSettings: "'wdth' 100" }}>
            YOUR LEARNING PATH
          </h1>
          <p className="font-['Roboto',sans-serif] text-[#b0b0b0] text-lg mb-6">
            Master algorithms through structured courses and hands-on practice
          </p>
          <div className="flex gap-4">
            <div className="bg-[#6942d5]/20 border border-[#6942d5] rounded-xl px-4 py-2">
              <p className="font-['Roboto',sans-serif] font-medium text-[#6942d5]">
                Total progress: {courses.reduce((sum, c) => sum + c.progress, 0)}/{courses.reduce((sum, c) => sum + c.total, 0)}
              </p>
            </div>
            <div className="bg-[#00eaff]/20 border border-[#00eaff] rounded-xl px-4 py-2">
              <p className="font-['Roboto',sans-serif] font-medium text-[#00eaff]">
                {activeCourses.length} Active Courses
              </p>
            </div>
          </div>
        </motion.div>

        {/* Active Courses Section */}
        {activeCourses.length > 0 && (
          <div className="mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="font-['Roboto',sans-serif] font-medium text-white text-2xl md:text-3xl mb-6"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              CONTINUE LEARNING
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCourses.map((course, idx) => {
                const Icon = courseIcons[course.id as keyof typeof courseIcons] || BookOpen;
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + idx * 0.1 }}
                  >
                    <Link
                      to={`/courses/${course.id}`}
                      className={`relative h-[320px] rounded-2xl overflow-hidden block group bg-gradient-to-br ${courseColors[course.id as keyof typeof courseColors] || 'from-[#6942d5] to-[#8b5cf6]'} hover:shadow-2xl transition-shadow`}
                    >
                      {/* Content */}
                      <div className="relative h-full p-6 flex flex-col">
                        {/* Icon */}
                        <div className="mb-4">
                          <div className="inline-flex p-3 bg-white/20 rounded-xl">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        <p className="font-['Roboto',sans-serif] font-bold text-white text-2xl md:text-3xl mb-3 tracking-[-1.2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          {course.title}
                        </p>
                        <p className="font-['Roboto',sans-serif] font-light text-white/90 text-base mb-6 flex-1 line-clamp-2">
                          {course.description}
                        </p>

                        {/* Progress Section */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-['Roboto',sans-serif] text-white/80 text-sm">
                              Progress
                            </span>
                            <span className="font-['Roboto',sans-serif] font-medium text-white text-sm">
                              {Math.round((course.progress / course.total) * 100)}%
                            </span>
                          </div>
                          <div className="bg-[rgba(248,248,248,0.3)] h-2 rounded-full">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(course.progress / course.total) * 100}%` }}
                              transition={{ duration: 0.8, delay: 0.5 + idx * 0.1 }}
                              className="bg-white h-2 rounded-full"
                            />
                          </div>
                          <p className="font-['Roboto',sans-serif] text-white/70 text-xs mt-2">
                            {course.progress} of {course.total} items completed
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

        {/* All Courses Section */}
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="font-['Roboto',sans-serif] font-medium text-white text-2xl md:text-3xl mb-6"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            ALL COURSES
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableCourses.map((course, idx) => {
              const Icon = courseIcons[course.id as keyof typeof courseIcons] || BookOpen;
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                >
                  <Link
                    to={`/courses/${course.id}`}
                    className={`relative h-[320px] rounded-2xl overflow-hidden group cursor-pointer block bg-gradient-to-br ${courseColors[course.id as keyof typeof courseColors] || 'from-[#6942d5] to-[#8b5cf6]'} hover:shadow-2xl transition-shadow`}
                  >
                    {/* Content */}
                    <div className="relative h-full p-6 flex flex-col">
                      {/* Icon and Tags Row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="inline-flex p-3 bg-white/20 rounded-xl">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-wrap gap-2 justify-end">
                          <span className="bg-white/20 text-white px-3 py-1 rounded-full font-['Roboto',sans-serif] text-xs">
                            {course.difficulty}
                          </span>
                          <span className="bg-white/20 text-white px-3 py-1 rounded-full font-['Roboto',sans-serif] text-xs">
                            {course.isFree ? 'Free' : 'Premium'}
                          </span>
                        </div>
                      </div>

                      <p className="font-['Roboto',sans-serif] font-bold text-white text-2xl md:text-3xl mb-3 tracking-[-1.2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        {course.title}
                      </p>
                      <p className="font-['Roboto',sans-serif] font-light text-white/90 text-base flex-1 line-clamp-3">
                        {course.description}
                      </p>

                      {/* Footer with tags and CTA */}
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {course.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="bg-white/10 text-white/70 px-3 py-1 rounded-full font-['Roboto',sans-serif] text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-2 text-white group-hover:text-white/90 transition-colors"
                        >
                          <span className="font-['Roboto',sans-serif] font-medium">
                            {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                          </span>
                          <span>→</span>
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
