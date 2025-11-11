import { Calendar, Award, TrendingUp, Code, CheckCircle2, XCircle, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userStats, tasks } from '../data/mockData';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { ProgressBar } from '../components/ProgressBar';

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
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-linear-to-br from-primary to-[#8b5cf6] rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-foreground text-4xl font-sans font-bold">
                {user
                  ? `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase()
                  : 'G'}              </span>
            </div>
            <div className="flex-1">
              <h1 className="font-sans font-medium text-foreground text-4xl mb-2">
                {`${user?.firstName} ${user?.lastName}`}
              </h1>
              <p className="font-sans text-foreground/80 mb-1">
                {user?.email}
              </p>
              <p className="font-sans font-light text-foreground/60">
                Member since {user ? new Date(user.createdAt).toLocaleDateString() : '-'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border border-muted rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-primary" />
                  <p className="font-sans text-muted-foreground text-sm">Solved</p>
                </div>
                <p className="font-sans font-medium text-foreground text-2xl">
                  {userStats.tasksCompleted}
                </p>
              </div>

              <div className="bg-card border border-muted rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-info" />
                  <p className="font-sans text-muted-foreground text-sm">Streak</p>
                </div>
                <p className="font-sans font-medium text-foreground text-2xl">
                  {userStats.currentStreak}
                </p>
              </div>

              <div className="bg-card border border-muted rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-success" />
                  <p className="font-sans text-muted-foreground text-sm">Best</p>
                </div>
                <p className="font-sans font-medium text-foreground text-2xl">
                  {userStats.longestStreak}
                </p>
              </div>

              <div className="bg-card border border-muted rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-warning" />
                  <p className="font-sans text-muted-foreground text-sm">Badges</p>
                </div>
                <p className="font-sans font-medium text-foreground text-2xl">
                  {userStats.badges.filter(b => b.earned).length}
                </p>
              </div>
            </div>
            <div className="bg-card border border-muted rounded-xl p-6">
              <h2 className="font-sans font-medium text-foreground text-xl mb-4">
                Overall Progress
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-sans text-muted-foreground">Easy</span>
                    <span className="font-sans font-medium text-success">24/50</span>
                  </div>
                  <ProgressBar value={24} total={50} color="success" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-sans text-muted-foreground">Medium</span>
                    <span className="font-sans font-medium text-warning">18/60</span>
                  </div>
                  <ProgressBar value={18} total={60} color="warning" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-sans text-muted-foreground">Hard</span>
                    <span className="font-sans font-medium text-error">5/40</span>
                  </div>
                  <ProgressBar value={5} total={40} color="error" />
                </div>
              </div>
            </div>


            {/* Recent Activity */}
            <div className="bg-card border border-muted rounded-xl p-6">
              <h2 className="font-sans font-medium text-foreground text-xl mb-4">
                Recent Activity
              </h2>
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    {activity.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-error shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-medium text-foreground truncate">
                        {activity.task}
                      </p>
                      <p className="font-sans text-muted-foreground text-sm">
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
            <div className="bg-card border border-muted rounded-xl p-6">
              <h2 className="font-sans font-medium text-foreground text-xl mb-4">
                Achievements
              </h2>
              <div className="space-y-3">
                {userStats.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-lg border ${badge.earned
                      ? 'bg-primary/10 border-primary'
                      : 'bg-background border-muted opacity-50'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${badge.earned ? 'bg-primary' : 'bg-muted'
                          }`}
                      >
                        <Award className={`w-5 h-5 ${badge.earned ? 'text-foreground' : 'text-[#6a6a6a]'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-sans font-medium mb-1 ${badge.earned ? 'text-foreground' : 'text-[#6a6a6a]'
                          }`}>
                          {badge.name}
                        </p>
                        <p className={`font-sans text-sm ${badge.earned ? 'text-muted-foreground' : 'text-[#6a6a6a]'
                          }`}>
                          {badge.description}
                        </p>
                      </div>
                      {badge.earned && (
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="bg-card border border-muted rounded-xl p-6">
              <h2 className="font-sans font-medium text-foreground text-xl mb-4">
                Settings
              </h2>
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/profile/edit')}
                  className="w-full text-left px-4 py-3 bg-background hover:bg-card-hover rounded-lg transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-primary" />
                  <p className="font-sans font-medium text-foreground">Edit Profile</p>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 bg-background hover:bg-error/20 rounded-lg transition-colors flex items-center gap-2 group"
                >
                  <LogOut className="w-4 h-4 text-error" />
                  <p className="font-sans font-medium text-error">Logout</p>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
