import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Save, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { DashboardLayout, Card, Button, Input } from '../components';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/Animations';
import { validateEmail, validatePassword, validateName } from '../utils/validation';
import { handleFormError } from '../utils/errorHandler';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form
  const { 
    register: registerProfile, 
    handleSubmit: handleSubmitProfile, 
    formState: { errors: errorsProfile },
    setError: setErrorProfile
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    }
  });

  // Password form
  const { 
    register: registerPassword, 
    handleSubmit: handleSubmitPassword, 
    formState: { errors: errorsPassword },
    reset: resetPassword,
    watch: watchPassword,
    setError: setErrorPassword
  } = useForm();

  const newPassword = watchPassword('newPassword');

  const handleUpdateProfile = async (data) => {
    setLoadingProfile(true);
    try {
      const response = await authAPI.updateProfile({
        name: data.name,
        email: data.email
      });

      // Update local user data
      updateUser(response.data.data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      handleFormError(error, setErrorProfile);
      const message = error.formattedMessage || 
                     error.response?.data?.message || 
                     'Failed to update profile';
      toast.error(message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdatePassword = async (data) => {
    setLoadingPassword(true);
    try {
      await authAPI.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });

      toast.success('Password updated successfully!');
      resetPassword();
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      handleFormError(error, setErrorPassword);
      const message = error.formattedMessage || 
                     error.response?.data?.message || 
                     'Failed to update password';
      toast.error(message);
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <DashboardLayout>
      <FadeIn>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and update your information
          </p>
        </div>

        <StaggerContainer className="max-w-4xl space-y-6">
          {/* Profile Information Card */}
          <StaggerItem>
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Profile Information
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Update your name and email address
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitProfile(handleUpdateProfile)} className="space-y-5">
                {/* Name Input */}
                <div>
                  <Input
                    label="Full Name"
                    type="text"
                    icon={User}
                    placeholder="Enter your full name"
                    error={errorsProfile.name?.message}
                    {...registerProfile('name', {
                      required: 'Name is required',
                      validate: (value) => validateName(value) || true
                    })}
                  />
                </div>

                {/* Email Input */}
                <div>
                  <Input
                    label="Email Address"
                    type="email"
                    icon={Mail}
                    placeholder="Enter your email"
                    error={errorsProfile.email?.message}
                    {...registerProfile('email', {
                      required: 'Email is required',
                      validate: (value) => validateEmail(value) || true
                    })}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loadingProfile}
                    disabled={loadingProfile}
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {loadingProfile ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Card>
          </StaggerItem>

          {/* Change Password Card */}
          <StaggerItem>
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Change Password
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Update your password to keep your account secure
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitPassword(handleUpdatePassword)} className="space-y-5">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      className={`
                        w-full pl-10 pr-12 py-3 rounded-lg border
                        ${errorsPassword.currentPassword 
                          ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
                        }
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                        placeholder-gray-400 dark:placeholder-gray-500
                        focus:ring-2 focus:outline-none transition-all duration-200
                      `}
                      placeholder="Enter current password"
                      {...registerPassword('currentPassword', {
                        required: 'Current password is required'
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      )}
                    </button>
                  </div>
                  {errorsPassword.currentPassword && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errorsPassword.currentPassword.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      className={`
                        w-full pl-10 pr-12 py-3 rounded-lg border
                        ${errorsPassword.newPassword 
                          ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
                        }
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                        placeholder-gray-400 dark:placeholder-gray-500
                        focus:ring-2 focus:outline-none transition-all duration-200
                      `}
                      placeholder="Enter new password"
                      {...registerPassword('newPassword', {
                        required: 'New password is required',
                        validate: (value) => validatePassword(value) || true
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      )}
                    </button>
                  </div>
                  {errorsPassword.newPassword && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errorsPassword.newPassword.message}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Must be at least 6 characters
                  </p>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`
                        w-full pl-10 pr-12 py-3 rounded-lg border
                        ${errorsPassword.confirmPassword 
                          ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
                        }
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                        placeholder-gray-400 dark:placeholder-gray-500
                        focus:ring-2 focus:outline-none transition-all duration-200
                      `}
                      placeholder="Confirm new password"
                      {...registerPassword('confirmPassword', {
                        required: 'Please confirm your new password',
                        validate: value => 
                          value === newPassword || 'Passwords do not match'
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      )}
                    </button>
                  </div>
                  {errorsPassword.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errorsPassword.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loadingPassword}
                    disabled={loadingPassword}
                  >
                    <Lock className="h-5 w-5 mr-2" />
                    {loadingPassword ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </Card>
          </StaggerItem>

          {/* Account Information Display */}
          <StaggerItem>
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 border-blue-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Account Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Account Type</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                    {user?.role}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">User ID</span>
                  <span className="text-sm font-mono text-gray-900 dark:text-white">
                    {user?._id?.slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Active
                  </span>
                </div>
              </div>
            </Card>
          </StaggerItem>
        </StaggerContainer>
      </FadeIn>
    </DashboardLayout>
  );
};

export default Profile;
