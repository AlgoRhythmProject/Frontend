import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from './components/Navigation';
import { NavigationAdmin } from './components/NavigationAdmin';
import { Dashboard } from './pages/Dashboard';
import { TaskList } from './pages/TaskList';
import { TaskDetail } from './pages/TaskDetail';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { Lectures } from './pages/Lectures';
import { Profile } from './pages/Profile';
import { EditProfile } from './pages/EditProfile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { VerifyEmail } from './pages/VerifyEmail';
import { GraphVisualizer } from './pages/GraphVisualizer';
import { ResetPassword } from './pages/ResetPassword';
import { ForgotPassword } from './pages/ForgotPassword';
import { AchievementNotificationProvider } from './components/AchievementNotification';
import { useTokenRefresh } from './hooks/useTokenRefresh';
import { Admin } from './pages/Admin';
import { ThemeProvider } from './hooks/themeContext';

function UserRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return isAuthenticated && !isAdmin ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return !isAuthenticated
    ? <Navigate to="/login" replace />
    : !isAdmin
      ? <Navigate to="/" replace />
      : <>{children}</>;
}

function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}


function AppContent() {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const authPages = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];
  const isAuthPage = authPages.includes(location.pathname);

  const isEditProfilePage = location.pathname === '/profile/edit';

  const shouldShowNavigation = isAuthenticated && !isAuthPage && !isEditProfilePage;

  useTokenRefresh();

  return (
    <>
      {shouldShowNavigation && (
        isAdmin ? <NavigationAdmin /> : <Navigation />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<UserRoute><Dashboard /></UserRoute>} />
            <Route path="/tasks" element={<UserRoute><TaskList /></UserRoute>} />
            <Route path="/tasks/:id" element={<UserRoute><TaskDetail /></UserRoute>} />
            <Route path="/courses" element={<UserRoute><Courses /></UserRoute>} />
            <Route path="/courses/:id" element={<UserRoute><CourseDetail /></UserRoute>} />
            <Route path="/lectures" element={<UserRoute><Lectures /></UserRoute>} />
            <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
            <Route path="/visualize" element={<UserRoute><GraphVisualizer /></UserRoute>} />
            <Route path="/profile/edit" element={<AuthenticatedRoute><EditProfile /></AuthenticatedRoute>} />
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <AchievementNotificationProvider>
      <ThemeProvider>
        <Router>
          <div className="bg-primary-background min-h-screen text-foreground">
            <div className="relative z-10">
              <AppContent />
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </AchievementNotificationProvider>
  );
}