import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthContext';
import * as profileApi from '../api/profileApi';
import * as authApi from '../api/authApi';
import toast from 'react-hot-toast';

export const useProfile = () => {
  const { user, setUser, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const res = await profileApi.updateProfile(data);
      // Refresh user details to get updated profile
      const updated = await profileApi.getUserDetails();
      setUser(updated.data.data);
      toast.success('Profile updated!');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayPicture = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('displayPicture', file);
      const res = await profileApi.updateDisplayPicture(formData);
      // Update user in state with new image
      setUser(res.data.data);
      toast.success('Profile photo updated!');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update photo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data) => {
    setLoading(true);
    try {
      await authApi.changePassword(data);
      toast.success('Password changed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      await profileApi.deleteAccount();
      clearAuth();
      toast.success('Account deleted');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordToken = async (email) => {
    setLoading(true);
    try {
      await authApi.resetPasswordToken(email);
      toast.success('Reset email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data) => {
    setLoading(true);
    try {
      await authApi.resetPassword(data);
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, updateProfile, updateDisplayPicture, changePassword, deleteAccount, resetPasswordToken, resetPassword };
};
