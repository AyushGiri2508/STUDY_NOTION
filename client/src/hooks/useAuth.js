import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthContext';
import * as authApi from '../api/authApi';
import * as profileApi from '../api/profileApi';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const { user, token, setUser, setToken, clearAuth, isAuthenticated, isStudent, isInstructor, isAdmin, accountType, loading } = useAuthStore();
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(false);

  const sendOTP = async (email) => {
    setAuthLoading(true);
    try {
      const res = await authApi.sendOTP(email);
      toast.success('OTP sent to your email!');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (data) => {
    setAuthLoading(true);
    try {
      const res = await authApi.signup(data);
      
      // Auto-login after successful signup
      const loginRes = await authApi.login({ email: data.email, password: data.password });
      setUser(loginRes.data.user);
      setToken(loginRes.data.token);
      
      toast.success('Account created successfully!');

      // Redirect to dashboard home
      navigate('/dashboard');
      
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const res = await authApi.login({ email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      toast.success('Welcome back!');

      // Redirect to dashboard home
      navigate('/dashboard');

      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    toast.success('Logged out');
    navigate('/');
  };

  const fetchUserDetails = async () => {
    try {
      const res = await profileApi.getUserDetails();
      setUser(res.data.data);
      return res.data.data;
    } catch (err) {
      console.error('Failed to fetch user details');
    }
  };

  return {
    user, token, loading, authLoading, isAuthenticated, isStudent, isInstructor, isAdmin, accountType,
    sendOTP, signup, login, logout, fetchUserDetails,
  };
};
