import { Award, TrendingUp, Code, CheckCircle2, Settings, LogOut, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { ProgressBar } from '../components/ProgressBar';
import { authApi } from '../api/authApi';
import { achievementApi, type UserAchievementDto } from '../api/achievementApi';
import { courseProgressApi } from '../api/courseProgressApi';
import { taskApi } from '../api/taskApi';
import { useState, useEffect } from 'react';
import type { Task } from '@/types/Task';
import { RecentSubmissions } from '@/components/RecentSubmissions';
import { userStreakApi, type UserStreakDto } from '@/api/userStreakApi';

export function Profile() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);

  const [achievements, setAchievements] = useState<UserAchievementDto[]>([]);
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true);
  const [achievementError, setAchievementError] = useState<string | null>(null);

  const [completedTasksCount, setCompletedTasksCount] = useState<number>(0);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const [streak, setStreak] = useState<UserStreakDto | null>(null);
  const [isLoadingStreak, setIsLoadingStreak] = useState(true);


  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingStats(true);
        setIsLoadingAchievements(true);
        setIsLoadingStreak(true);

        const [completedTasksResp, tasksResp, achievementsResp, streakResp] = await Promise.all([
          courseProgressApi.getMyCompletedTasks(),
          taskApi.getAll(),
          achievementApi.getMyAchievements(),
          userStreakApi.getMyStreak(),
        ]);

        setCompletedTasksCount(completedTasksResp.completedTaskIds.length);
        setAllTasks(tasksResp);
        setAchievements(achievementsResp);
        setStreak(streakResp);

        setAchievementError(null);
      } catch (error) {
        console.error('Error loading profile data:', error);
        setAchievementError('Failed to load some data');
      } finally {
        setIsLoadingStats(false);
        setIsLoadingAchievements(false);
        setIsLoadingStreak(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const handleLogout = async () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    await authApi.logout();
    navigate('/login');
  };

  const earnedAchievementsCount = achievements.filter(a => a.isCompleted).length;

  // Calculate difficulty breakdown
  const completedTasksSet = new Set(
    allTasks.filter((_, idx) => idx < completedTasksCount).map(t => t.id)
  );

  const easyTasks = allTasks.filter(t => t.difficulty === 0);
  const mediumTasks = allTasks.filter(t => t.difficulty === 1);
  const hardTasks = allTasks.filter(t => t.difficulty === 2);

  const easyCompleted = easyTasks.filter(t => completedTasksSet.has(t.id)).length;
  const mediumCompleted = mediumTasks.filter(t => completedTasksSet.has(t.id)).length;
  const hardCompleted = hardTasks.filter(t => completedTasksSet.has(t.id)).length;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-linear-to-br from-primary to-primary-light rounded-2xl p-8 mb-8"
        >
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
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="bg-card border border-muted rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-primary" />
                  <p className="font-sans text-muted-foreground text-sm">Tasks Solved</p>
                </div>
                <p className="font-sans font-medium text-foreground text-2xl">
                  {isLoadingStats ? '...' : completedTasksCount}
                </p>
              </div>

              <div className="bg-card border border-muted rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-info" />
                  <p className="font-sans text-muted-foreground text-sm">Current Streak</p>
                </div>
                <p className="font-sans font-medium text-foreground text-2xl">
                  {isLoadingStreak ? '...' : streak?.currentStreak || 0}
                </p>
              </div>

              <div className="bg-card border border-muted rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-warning" />
                  <p className="font-sans text-muted-foreground text-sm">Longest Streak</p>
                </div>
                <p className="font-sans font-medium text-foreground text-2xl">
                  {isLoadingStreak ? '...' : streak?.longestStreak || 0}
                </p>
              </div>

              <div className="bg-card border border-muted rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-success" />
                  <p className="font-sans text-muted-foreground text-sm">Badges</p>
                </div>
                <p className="font-sans font-medium text-foreground text-2xl">
                  {isLoadingAchievements ? '...' : earnedAchievementsCount}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card border border-muted rounded-xl p-6"
            >
              <h2 className="font-sans font-medium text-foreground text-xl mb-4">
                Overall Progress
              </h2>

              {isLoadingStats ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-sans text-muted-foreground">Easy</span>
                      <span className="font-sans font-medium text-success">
                        {easyCompleted}/{easyTasks.length}
                      </span>
                    </div>
                    <ProgressBar value={easyCompleted} total={easyTasks.length} color="bg-success" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-sans text-muted-foreground">Medium</span>
                      <span className="font-sans font-medium text-warning">
                        {mediumCompleted}/{mediumTasks.length}
                      </span>
                    </div>
                    <ProgressBar value={mediumCompleted} total={mediumTasks.length} color="bg-warning" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-sans text-muted-foreground">Hard</span>
                      <span className="font-sans font-medium text-error">
                        {hardCompleted}/{hardTasks.length}
                      </span>
                    </div>
                    <ProgressBar value={hardCompleted} total={hardTasks.length} color="bg-error" />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Recent Submissions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <RecentSubmissions limit={5} />
            </motion.div>
          </div>

          {/* Right Column - Settings & Achievements */}
          <div className="space-y-6">
            {/* Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card border border-muted rounded-xl p-6"
            >
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
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card border border-muted rounded-xl p-6"
            >
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}