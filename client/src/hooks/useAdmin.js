import { useState, useEffect, useCallback } from 'react';
import * as adminApi from '../api/adminApi';
import toast from 'react-hot-toast';

export const useAdmin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // ─── Fetch Admin Stats ───
  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAdminStats();
      setStats(res.data.data);
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Fetch All Users ───
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllUsers();
      setUsers(res.data.data);
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Delete User ───
  const removeUser = useCallback(async (userId) => {
    try {
      const res = await adminApi.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success(res.data.message || 'User deleted');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
      return false;
    }
  }, []);

  // ─── Fetch All Courses (Admin) ───
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllCoursesAdmin();
      setCourses(res.data.data);
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Delete Course ───
  const removeCourse = useCallback(async (courseId) => {
    try {
      const res = await adminApi.deleteCourseAdmin(courseId);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      toast.success(res.data.message || 'Course deleted');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete course');
      return false;
    }
  }, []);

  // ─── Update Category ───
  const editCategory = useCallback(async (id, data) => {
    try {
      const res = await adminApi.updateCategory(id, data);
      toast.success(res.data.message || 'Category updated');
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update category');
      return null;
    }
  }, []);

  // ─── Delete Category ───
  const removeCategory = useCallback(async (id) => {
    try {
      const res = await adminApi.deleteCategory(id);
      toast.success(res.data.message || 'Category deleted');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
      return false;
    }
  }, []);

  return {
    stats, users, courses, loading,
    fetchStats, fetchUsers, removeUser,
    fetchCourses, removeCourse,
    editCategory, removeCategory,
  };
};
