import { Link } from 'react-router-dom';
import { Book, Code, Trophy, TrendingUp } from 'lucide-react';
import { tasks, courses, userStats } from '../data/mockData';
// Zamień import na string placeholder
const imgRectangle34 = "/placeholder.png"; // lub pusty string ""

export function Dashboard() {
  const recentTasks = tasks.slice(0, 3);
  const activeCourse = courses[0];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6942d5] to-[#8b5cf6] p-8 md:p-12">
          <div className="relative z-10">
            <h1 className="font-['Roboto',sans-serif] font-medium text-4xl md:text-6xl text-white mb-4" style={{ fontVariationSettings: "'wdth' 100" }}>
              YOUR PLACE TO<br />LEARN ALGORITHMS
            </h1>
            <p className="font-['Roboto',sans-serif] text-white/90 max-w-2xl mb-6">
              Master data structures and algorithms through interactive coding challenges, comprehensive courses, and hands-on practice.
            </p>
            <Link
              to="/tasks"
              className="inline-block bg-white text-[#6942d5] px-8 py-3 rounded-lg font-['Roboto',sans-serif] font-medium hover:bg-white/90 transition-colors"
            >
              Start Practicing
            </Link>
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
            <div className="flex items-center justify-center rotate-[350deg]">
              <img alt="" className="w-48 h-48 object-cover rounded-2xl" src={imgRectangle34} />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#242424] border border-[#3d3d3d] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#6942d5]/20 rounded-lg">
                <Code className="w-5 h-5 text-[#6942d5]" />
              </div>
              <p className="font-['Roboto:Regular',sans-serif] text-[#b0b0b0]">Tasks Solved</p>
            </div>
            <p className="font-['Roboto:Medium',sans-serif] text-white text-3xl">{userStats.tasksCompleted}</p>
            <p className="font-['Roboto:Regular',sans-serif] text-[#6942d5] text-sm">of {userStats.totalTasks} total</p>
          </div>

          <div className="bg-[#242424] border border-[#3d3d3d] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#00eaff]/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#00eaff]" />
              </div>
              <p className="font-['Roboto:Regular',sans-serif] text-[#b0b0b0]">Current Streak</p>
            </div>
            <p className="font-['Roboto:Medium',sans-serif] text-white text-3xl">{userStats.currentStreak}</p>
            <p className="font-['Roboto:Regular',sans-serif] text-[#00eaff] text-sm">days in a row</p>
          </div>

          <div className="bg-[#242424] border border-[#3d3d3d] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#ace798]/20 rounded-lg">
                <Book className="w-5 h-5 text-[#ace798]" />
              </div>
              <p className="font-['Roboto:Regular',sans-serif] text-[#b0b0b0]">Courses Active</p>
            </div>
            <p className="font-['Roboto:Medium',sans-serif] text-white text-3xl">{courses.filter(c => c.progress > 0).length}</p>
            <p className="font-['Roboto:Regular',sans-serif] text-[#ace798] text-sm">in progress</p>
          </div>

          <div className="bg-[#242424] border border-[#3d3d3d] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#ffee9c]/20 rounded-lg">
                <Trophy className="w-5 h-5 text-[#ffee9c]" />
              </div>
              <p className="font-['Roboto:Regular',sans-serif] text-[#b0b0b0]">Badges Earned</p>
            </div>
            <p className="font-['Roboto:Medium',sans-serif] text-white text-3xl">{userStats.badges.filter(b => b.earned).length}</p>
            <p className="font-['Roboto:Regular',sans-serif] text-[#ffee9c] text-sm">of {userStats.badges.length} total</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tasks */}
          <div className="lg:col-span-2 bg-[#242424] border border-[#3d3d3d] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-['Roboto:Medium',sans-serif] text-white text-2xl">Recent Tasks</h2>
              <Link to="/tasks" className="font-['Roboto:Regular',sans-serif] text-[#6942d5] hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/tasks/${task.id}`}
                  className="block bg-[#1a1a1a] border border-[#3d3d3d] rounded-xl p-4 hover:border-[#6942d5] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] text-[#6942d5] text-xs mb-1">{task.id}</p>
                      <p className="font-['Roboto_Mono:Medium',sans-serif] text-white mb-2">{task.title}</p>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${task.difficulty === 'Easy' ? 'bg-[#ace798]' :
                            task.difficulty === 'Medium' ? 'bg-[#ffee9c]' : 'bg-[#fe6868]'
                          }`} />
                        <span className="font-['Roboto:Regular',sans-serif] text-[#b0b0b0] text-sm">{task.difficulty}</span>
                      </div>
                    </div>
                    {task.completed && (
                      <div className="text-[#ace798]">✓</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Active Course */}
          <div className="bg-gradient-to-br from-[#6942d5] to-[#8b5cf6] rounded-2xl p-6 text-white">
            <h2 className="font-['Roboto:Medium',sans-serif] text-2xl mb-4">Continue Learning</h2>
            <p className="font-['Roboto:Bold',sans-serif] text-3xl mb-3">{activeCourse.title}</p>
            <p className="font-['Roboto:Light',sans-serif] text-white/90 mb-4">{activeCourse.description}</p>
            <div className="bg-white/20 rounded-full h-3 mb-2">
              <div
                className="bg-white rounded-full h-3 transition-all"
                style={{ width: `${(activeCourse.progress / activeCourse.total) * 100}%` }}
              />
            </div>
            <p className="font-['Roboto:Light',sans-serif] text-sm mb-4">
              Progress: {activeCourse.progress}/{activeCourse.total}
            </p>
            <Link
              to="/courses"
              className="inline-block bg-white text-[#6942d5] px-6 py-2 rounded-lg font-['Roboto:Medium',sans-serif] hover:bg-white/90 transition-colors"
            >
              Continue Course
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
