import { Calendar, Award, TrendingUp, Code, CheckCircle2, XCircle, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userStats, tasks } from '../data/mockData';

export function Profile() {
  const navigate = useNavigate();

  const recentActivity = tasks.slice(0, 5).map((task, idx) => ({
    task: task.title,
    completed: task.completed || false,
    date: new Date(Date.now() - idx * 86400000).toLocaleDateString(),
  }));

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-[#6942d5] to-[#8b5cf6] rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-4xl font-['Roboto:Bold',sans-serif]">
                {userStats.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="font-['Roboto:Medium',sans-serif] text-white text-4xl mb-2">
                {userStats.name}
              </h1>
              <p className="font-['Roboto:Regular',sans-serif] text-white/80 mb-1">
                {userStats.email}
              </p>
              <p className="font-['Roboto:Light',sans-serif] text-white/60">
                Member since {userStats.joinDate}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#242424] border border-[#3d3d3d] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-[#6942d5]" />
                  <p className="font-['Roboto:Regular',sans-serif] text-[#b0b0b0] text-sm">Solved</p>
                </div>
                <p className="font-['Roboto:Medium',sans-serif] text-white text-2xl">
                  {userStats.tasksCompleted}
                </p>
              </div>

              <div className="bg-[#242424] border border-[#3d3d3d] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-[#00eaff]" />
                  <p className="font-['Roboto:Regular',sans-serif] text-[#b0b0b0] text-sm">Streak</p>
                </div>
                <p className="font-['Roboto:Medium',sans-serif] text-white text-2xl">
                  {userStats.currentStreak}
                </p>
              </div>

              <div className="bg-[#242424] border border-[#3d3d3d] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-[#ace798]" />
                  <p className="font-['Roboto:Regular',sans-serif] text-[#b0b0b0] text-sm">Best</p>
                </div>
                <p className="font-['Roboto:Medium',sans-serif] text-white text-2xl">
                  {userStats.longestStreak}
                </p>
              </div>

              <div className="bg-[#242424] border border-[#3d3d3d] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-[#ffee9c]" />
                  <p className="font-['Roboto:Regular',sans-serif] text-[#b0b0b0] text-sm">Badges</p>
                </div>
                <p className="font-['Roboto:Medium',sans-serif] text-white text-2xl">
                  {userStats.badges.filter(b => b.earned).length}
                </p>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="bg-[#242424] border border-[#3d3d3d] rounded-xl p-6">
              <h2 className="font-['Roboto:Medium',sans-serif] text-white text-xl mb-4">
                Overall Progress
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-['Roboto:Regular',sans-serif] text-[#b0b0b0]">Easy</span>
                    <span className="font-['Roboto:Medium',sans-serif] text-[#ace798]">24/50</span>
                  </div>
                  <div className="bg-[#1a1a1a] h-2 rounded-full">
                    <div className="bg-[#ace798] h-2 rounded-full" style={{ width: '48%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-['Roboto:Regular',sans-serif] text-[#b0b0b0]">Medium</span>
                    <span className="font-['Roboto:Medium',sans-serif] text-[#ffee9c]">18/60</span>
                  </div>
                  <div className="bg-[#1a1a1a] h-2 rounded-full">
                    <div className="bg-[#ffee9c] h-2 rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-['Roboto:Regular',sans-serif] text-[#b0b0b0]">Hard</span>
                    <span className="font-['Roboto:Medium',sans-serif] text-[#fe6868]">5/40</span>
                  </div>
                  <div className="bg-[#1a1a1a] h-2 rounded-full">
                    <div className="bg-[#fe6868] h-2 rounded-full" style={{ width: '12.5%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#242424] border border-[#3d3d3d] rounded-xl p-6">
              <h2 className="font-['Roboto:Medium',sans-serif] text-white text-xl mb-4">
                Recent Activity
              </h2>
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                    {activity.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#ace798] shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#fe6868] shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-['Roboto:Medium',sans-serif] text-white truncate">
                        {activity.task}
                      </p>
                      <p className="font-['Roboto:Regular',sans-serif] text-[#b0b0b0] text-sm">
                        {activity.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Badges */}
          <div className="space-y-6">
            <div className="bg-[#242424] border border-[#3d3d3d] rounded-xl p-6">
              <h2 className="font-['Roboto:Medium',sans-serif] text-white text-xl mb-4">
                Achievements
              </h2>
              <div className="space-y-3">
                {userStats.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-lg border ${badge.earned
                        ? 'bg-[#6942d5]/10 border-[#6942d5]'
                        : 'bg-[#1a1a1a] border-[#3d3d3d] opacity-50'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${badge.earned ? 'bg-[#6942d5]' : 'bg-[#3d3d3d]'
                          }`}
                      >
                        <Award className={`w-5 h-5 ${badge.earned ? 'text-white' : 'text-[#6a6a6a]'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-['Roboto:Medium',sans-serif] mb-1 ${badge.earned ? 'text-white' : 'text-[#6a6a6a]'
                          }`}>
                          {badge.name}
                        </p>
                        <p className={`font-['Roboto:Regular',sans-serif] text-sm ${badge.earned ? 'text-[#b0b0b0]' : 'text-[#6a6a6a]'
                          }`}>
                          {badge.description}
                        </p>
                      </div>
                      {badge.earned && (
                        <CheckCircle2 className="w-5 h-5 text-[#ace798] shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="bg-[#242424] border border-[#3d3d3d] rounded-xl p-6">
              <h2 className="font-['Roboto',sans-serif] font-medium text-white text-xl mb-4">
                Settings
              </h2>
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/profile/edit')}
                  className="w-full text-left px-4 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-[#6942d5]" />
                  <p className="font-['Roboto',sans-serif] font-medium text-white">Edit Profile</p>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 bg-[#1a1a1a] hover:bg-[#fe6868]/20 rounded-lg transition-colors flex items-center gap-2 group"
                >
                  <LogOut className="w-4 h-4 text-[#fe6868]" />
                  <p className="font-['Roboto',sans-serif] font-medium text-[#fe6868]">Logout</p>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
