import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Mail, Lock, User, Save } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../store';
import { login } from '../store/userSlice';

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
      setFormData({
        ...formData,
        firstName: userState.user?.firstName || '',
        lastName: userState.user?.lastName || '',
        email: userState.user?.email || '',
      });
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

    // Symulacja zapisu na backendzie
    setTimeout(() => {
      // Tutaj normalnie wywołałbyś API do aktualizacji użytkownika
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <button
          onClick={() => navigate('/profile')}
          className="mb-6 flex items-center gap-2 text-primary hover:text-[#7952e5] font-sans transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Profile
        </button>

        <div className="bg-card border border-muted rounded-2xl p-6 md:p-8">
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
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block font-sans text-foreground mb-2 text-sm">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      placeholder="First name"
                      required
                      className="w-full bg-background border border-muted rounded-lg px-10 py-3 text-foreground placeholder-[#6b6b6b] font-sans outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label className="block font-sans text-foreground mb-2 text-sm">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      placeholder="Last name"
                      required
                      className="w-full bg-background border border-muted rounded-lg px-10 py-3 text-foreground placeholder-[#6b6b6b] font-sans outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block font-sans text-foreground mb-2 text-sm">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full bg-background border border-muted rounded-lg px-10 py-3 text-foreground placeholder-[#6b6b6b] font-sans outline-none focus:border-primary transition-colors"
                  />
                </div>
              </motion.div>
            </div>

            {/* Password Section */}
            <div className="space-y-4 pt-6 border-t border-muted">
              <h2 className="font-sans font-medium text-xl text-foreground mb-4">
                Change Password
              </h2>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <label className="block font-sans text-foreground mb-2 text-sm">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => handleChange('currentPassword', e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-background border border-muted rounded-lg px-10 py-3 text-foreground placeholder-[#6b6b6b] font-sans outline-none focus:border-primary transition-colors"
                  />
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block font-sans text-foreground mb-2 text-sm">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => handleChange('newPassword', e.target.value)}
                      placeholder="New password"
                      className="w-full bg-background border border-muted rounded-lg px-10 py-3 text-foreground placeholder-[#6b6b6b] font-sans outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <label className="block font-sans text-foreground mb-2 text-sm">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="Confirm password"
                      className="w-full bg-background border border-muted rounded-lg px-10 py-3 text-foreground placeholder-[#6b6b6b] font-sans outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </motion.div>
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
