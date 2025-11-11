import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Mail, Lock, User, Save } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../store';
import { login } from '../store/userSlice';
import { AuthenticationInput } from '../components/Authentication/AuthenticationInput';
import { AuthenticationBackground } from '../components/Authentication/AuthenticationBackground';

export function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (userState.isAuthenticated) {
      setFormData((prev) => ({
        ...prev,
        firstName: userState.user?.firstName || '',
        lastName: userState.user?.lastName || '',
        email: userState.user?.email || '',
      }));
    }
  }, [userState.user]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert("New passwords don't match");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      dispatch(
        login({
          id: userState.user?.id || '123',
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          createdAt: userState.user?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isDeleted: false,
        })
      );

      setIsLoading(false);
      navigate('/profile');
    }, 800);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <AuthenticationBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <button
          onClick={() => navigate('/profile')}
          className="mb-6 flex items-center gap-2 text-foreground hover:text-[#7952e5] cursor-pointer font-sans transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1  transition-transform" />
          Back to Profile
        </button>

        <div className="bg-background/80 backdrop-blur-xl border border-muted rounded-2xl p-6 md:p-8">
          <h1 className="font-sans font-bold text-3xl text-foreground mb-2">
            Edit Profile
          </h1>
          <p className="font-sans text-muted-foreground mb-8">
            Update your personal information and password
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h2 className="font-sans font-medium text-xl text-foreground mb-4">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AuthenticationInput
                  label="First Name"
                  type="text"
                  icon={<User />}
                  value={formData.firstName}
                  onChange={(val: string) => handleChange('firstName', val)}
                  placeholder="First name"
                  delay={0.1}
                />
                <AuthenticationInput
                  label="Last Name"
                  type="text"
                  icon={<User />}
                  value={formData.lastName}
                  onChange={(val: string) => handleChange('lastName', val)}
                  placeholder="Last name"
                  delay={0.15}
                />
              </div>

              <AuthenticationInput
                label="Email"
                type="email"
                icon={<Mail />}
                value={formData.email}
                onChange={(val: string) => handleChange('email', val)}
                placeholder="your@email.com"
                delay={0.2}
              />
            </div>

            {/* Password Section */}
            <div className="space-y-4 pt-6 border-t border-muted">
              <h2 className="font-sans font-medium text-xl text-foreground mb-4">
                Change Password
              </h2>

              <AuthenticationInput
                label="Current Password"
                type="password"
                icon={<Lock />}
                value={formData.currentPassword}
                onChange={(val: string) => handleChange('currentPassword', val)}
                placeholder="Enter current password"
                delay={0.25}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AuthenticationInput
                  label="New Password"
                  type="password"
                  icon={<Lock />}
                  value={formData.newPassword}
                  onChange={(val: string) => handleChange('newPassword', val)}
                  placeholder="New password"
                  delay={0.3}
                />
                <AuthenticationInput
                  label="Confirm Password"
                  type="password"
                  icon={<Lock />}
                  value={formData.confirmPassword}
                  onChange={(val: string) => handleChange('confirmPassword', val)}
                  placeholder="Confirm password"
                  delay={0.35}
                />
              </div>

              <p className="font-sans text-[#6b6b6b] text-sm">
                Leave password fields empty if you don't want to change it
              </p>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 pt-6"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-linear-to-r from-primary to-[#8b5cf6] text-foreground py-3 px-6 rounded-lg font-sans font-medium hover:from-[#7952e5] hover:to-[#9c6cf7] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate('/profile')}
                className="sm:w-auto px-6 bg-background border border-muted text-foreground py-3 rounded-lg font-sans font-medium hover:border-primary transition-colors"
              >
                Cancel
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
