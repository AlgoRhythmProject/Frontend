import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Mail, Lock, User, Save } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../store';
import { login } from '../store/userSlice';
import { AuthenticationInput } from '../components/Authentication/AuthenticationInput';
import { AuthenticationBackground } from '../components/Authentication/AuthenticationBackground';
import { authApi, ApiError } from '../api/authApi';
import { validateName, validateEmail, sanitizeInput, validatePassword } from '@/utils/validationUtils';

export function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.user);

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (userState.isAuthenticated && userState.user) {
      setProfileData({
        firstName: userState.user.firstName || '',
        lastName: userState.user.lastName || '',
        email: userState.user.email || '',
      });
    }
  }, [userState.user]);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccessMessage(null);
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccessMessage(null);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validate first name
    const firstNameValidation = validateName(profileData.firstName, "First name");
    if (!firstNameValidation.isValid) {
      setError(firstNameValidation.error!);
      return;
    }

    // Validate last name
    const lastNameValidation = validateName(profileData.lastName, "Last name");
    if (!lastNameValidation.isValid) {
      setError(lastNameValidation.error!);
      return;
    }

    // Validate email
    const emailValidation = validateEmail(profileData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error!);
      return;
    }

    setIsLoadingProfile(true);
    try {
      // Sanitize inputs before sending
      const sanitizedData = {
        firstName: sanitizeInput(profileData.firstName),
        lastName: sanitizeInput(profileData.lastName),
        email: profileData.email.trim().toLowerCase()
      };

      const updatedUser = await authApi.updateProfile(sanitizedData);

      // Aktualizuj Redux store z nowymi danymi
      dispatch(login({
        ...updatedUser,
        token: userState.user?.token // zachowaj obecny token
      }));

      setSuccessMessage("Profile updated successfully!");

      // Jeśli email się zmienił, poinformuj użytkownika o weryfikacji
      if (sanitizedData.email !== userState.user?.email) {
        setTimeout(() => {
          setSuccessMessage("Profile updated! Please verify your new email address.");
        }, 1000);
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        switch (err.code) {
          case 'EMAIL_EXISTS':
            setError("This email is already taken by another account.");
            break;
          case 'VALIDATION_ERROR':
            setError(err.message);
            break;
          case 'USER_NOT_FOUND':
            setError("User not found. Please log in again.");
            break;
          default:
            setError(err.message || "Failed to update profile. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Profile update failed:", err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validate current password
    if (!passwordData.currentPassword) {
      setError("Current password is required");
      return;
    }

    // Validate new password
    const passwordValidation = validatePassword(passwordData.newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error!);
      return;
    }

    // Check password match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setIsLoadingPassword(true);
    try {
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setSuccessMessage("Password changed successfully!");

      // Wyczyść pola hasła
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      if (err instanceof ApiError) {
        switch (err.code) {
          case 'INVALID_CURRENT_PASSWORD':
            setError("Current password is incorrect.");
            break;
          case 'VALIDATION_ERROR':
            setError(err.message);
            break;
          case 'USER_NOT_FOUND':
            setError("User not found. Please log in again.");
            break;
          default:
            setError(err.message || "Failed to change password. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Password change failed:", err);
    } finally {
      setIsLoadingPassword(false);
    }
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
          className="mb-6 flex items-center gap-2 text-foreground hover:text-primary-hover cursor-pointer font-sans transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Profile
        </button>

        <div className="bg-background/80 backdrop-blur-xl border border-muted rounded-2xl p-6 md:p-8">
          <h1 className="font-sans font-bold text-3xl text-foreground mb-2">
            Edit Profile
          </h1>
          <p className="font-sans text-muted-foreground mb-8">
            Update your personal information and password
          </p>

          {/* Success/Error Messages */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg"
            >
              <p className="font-sans text-primary text-sm">{successMessage}</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg"
            >
              <p className="font-sans text-error text-sm">{error}</p>
            </motion.div>
          )}

          {/* Personal Information Section */}
          <form onSubmit={handleProfileSubmit} className="space-y-6 mb-8">
            <div className="space-y-4">
              <h2 className="font-sans font-medium text-xl text-foreground mb-4">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AuthenticationInput
                  label="First Name"
                  type="text"
                  icon={<User />}
                  value={profileData.firstName}
                  onChange={(val: string) => handleProfileChange('firstName', val)}
                  placeholder="First name"
                  delay={0.1}
                />
                <AuthenticationInput
                  label="Last Name"
                  type="text"
                  icon={<User />}
                  value={profileData.lastName}
                  onChange={(val: string) => handleProfileChange('lastName', val)}
                  placeholder="Last name"
                  delay={0.15}
                />
              </div>

              <AuthenticationInput
                label="Email"
                type="email"
                icon={<Mail />}
                value={profileData.email}
                onChange={(val: string) => handleProfileChange('email', val)}
                placeholder="your@email.com"
                delay={0.2}
              />

              <p className="font-sans text-secondary-foreground text-sm">
                If you change your email, you'll need to verify the new address.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoadingProfile}
              className="w-full cursor-pointer bg-linear-to-r from-primary to-primary-light text-on-primary py-3 px-6 rounded-lg font-sans font-medium hover:from-primary-hover hover:to-primary-light-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isLoadingProfile ? 'Saving...' : 'Save Profile Changes'}
            </motion.button>
          </form>

          {/* Password Section */}
          <form onSubmit={handlePasswordSubmit} className="space-y-6 pt-6 border-t border-muted">
            <div className="space-y-4">
              <h2 className="font-sans font-medium text-xl text-on-primary mb-4">
                Change Password
              </h2>

              <AuthenticationInput
                label="Current Password"
                type="password"
                icon={<Lock />}
                value={passwordData.currentPassword}
                onChange={(val: string) => handlePasswordChange('currentPassword', val)}
                placeholder="Enter current password"
                delay={0.25}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AuthenticationInput
                  label="New Password"
                  type="password"
                  icon={<Lock />}
                  value={passwordData.newPassword}
                  onChange={(val: string) => handlePasswordChange('newPassword', val)}
                  placeholder="New password (min 8 chars)"
                  delay={0.3}
                />
                <AuthenticationInput
                  label="Confirm Password"
                  type="password"
                  icon={<Lock />}
                  value={passwordData.confirmPassword}
                  onChange={(val: string) => handlePasswordChange('confirmPassword', val)}
                  placeholder="Confirm password"
                  delay={0.35}
                />
              </div>

              <p className="font-sans text-secondary-foreground text-sm">
                Leave password fields empty if you don't want to change it
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoadingPassword || !passwordData.currentPassword}
              className="w-full bg-linear-to-r cursor-pointer from-primary to-primary-light text-foreground py-3 px-6 rounded-lg font-sans font-medium hover:from-primary-hover hover:to-primary-light-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              {isLoadingPassword ? 'Changing...' : 'Change Password'}
            </motion.button>
          </form>

          {/* Cancel Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate('/profile')}
              className="w-full bg-background/70 cursor-pointer border border-muted text-foreground py-3 rounded-lg font-sans font-medium hover:border-primary transition-colors"
            >
              Cancel
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}