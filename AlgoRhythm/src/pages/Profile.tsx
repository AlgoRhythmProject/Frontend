import { Calendar, Award, TrendingUp, Code, CheckCircle2, XCircle, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tasks } from '../data/mockData';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { ProgressBar } from '../components/ProgressBar';
import { authApi } from '../api/authApi';
import { achievementApi, type UserAchievementDto } from '../api/achievementApi';
import { useState, useEffect } from 'react';

export function Profile() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);

  const [achievements, setAchievements] = useState<UserAchievementDto[]>([]);
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true);
  const [achievementError, setAchievementError] = useState<string | null>(null);

  // Mock data dla streaks i statystyk (na razie)
  const userStats = {
    tasksCompleted: 47,
    currentStreak: 12,
    longestStreak: 23,
  };

  const recentActivity = tasks.slice(0, 5).map((task, idx) => ({
    task: task.title,
    completed: task.completed || false,
    date: new Date(Date.now() - idx * 86400000).toLocaleDateString(),
  }));

  // Załaduj achievementy z API
  useEffect(() => {
    const loadAchievements = async () => {
      try {
        setIsLoadingAchievements(true);
        setAchievementError(null);
        const data = await achievementApi.getMyAchievements();
        setAchievements(data);
      } catch (error) {
        console.error('Error loading achievements:', error);
        setAchievementError('Failed to load achievements');
      } finally {
        setIsLoadingAchievements(false);
      }
    };

    if (user) {
      loadAchievements();
    }
  }, [user]);

  const handleLogout = async () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    await authApi.logout();
    navigate('/login');
  };

  const earnedAchievementsCount = achievements.filter(a => a.isCompleted).length;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-linear-to-br from-primary to-primary-light rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-on-primary text-4xl font-sans font-bold">
                {user
                  ? `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase()
                  : 'G'}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="font-sans font-medium text-on-primary text-4xl mb-2">
                {`${user?.firstName} ${user?.lastName}`}
              </h1>
              <p className="font-sans text-on-primary/80 mb-1">
                {user?.email}
              </p>
              <p className="font-sans font-light text-on-primary/60">
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
                  {isLoadingAchievements ? '...' : earnedAchievementsCount}
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
                  <ProgressBar value={24} total={50} color="bg-success" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-sans text-muted-foreground">Medium</span>
                    <span className="font-sans font-medium text-warning">18/60</span>
                  </div>
                  <ProgressBar value={18} total={60} color="bg-warning" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-sans text-muted-foreground">Hard</span>
                    <span className="font-sans font-medium text-error">5/40</span>
                  </div>
                  <ProgressBar value={5} total={40} color="bg-error" />
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

              {isLoadingAchievements ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : achievementError ? (
                <div className="text-center py-8">
                  <p className="font-sans text-error text-sm">{achievementError}</p>
                </div>
              ) : achievements.length === 0 ? (
                <div className="text-center py-8">
                  <p className="font-sans text-muted-foreground text-sm">No achievements yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border ${achievement.isCompleted
                        ? 'bg-primary/10 border-primary'
                        : 'bg-background border-muted opacity-50'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${achievement.isCompleted ? 'bg-primary' : 'bg-muted'
                            }`}
                        >
                          <Award
                            className={`w-5 h-5 ${achievement.isCompleted
                              ? 'text-on-primary'
                              : 'text-secondary-foreground'
                              }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-sans font-medium mb-1 ${achievement.isCompleted
                              ? 'text-foreground'
                              : 'text-secondary-foreground'
                              }`}
                          >
                            {achievement.achievementName}
                          </p>
                          <p
                            className={`font-sans text-sm ${achievement.isCompleted
                              ? 'text-muted-foreground'
                              : 'text-secondary-foreground'
                              }`}
                          >
                            {achievement.achievementDescription || 'No description'}
                          </p>
                          {achievement.isCompleted && achievement.earnedAt && (
                            <p className="font-sans text-xs text-muted-foreground mt-1">
                              Earned: {new Date(achievement.earnedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {achievement.isCompleted && (
                          <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                  className="w-full text-left px-4 py-3 bg-background hover:bg-card-hover cursor-pointer rounded-lg transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-primary" />
                  <p className="font-sans font-medium text-foreground">Edit Profile</p>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 bg-background hover:bg-error/20 cursor-pointer rounded-lg transition-colors flex items-center gap-2 group"
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