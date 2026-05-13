import { useState, useEffect } from 'react';
import * as courseApi from '../api/courseApi';
import toast from 'react-hot-toast';

export const useInstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInstructorCourses = async () => {
    setLoading(true);
    try {
      const res = await courseApi.getAllCourses();
      // Filter courses where current user is the instructor
      // The server returns all courses — we filter client-side
      setCourses(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load your courses');
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (formData) => {
    try {
      const res = await courseApi.createCourse(formData);
      toast.success('Course created!');
      await fetchInstructorCourses();
      return res.data.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create course';
      console.error('Create course error:', err.response?.data || err);
      toast.error(msg);
      throw err;
    }
  };

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  return { courses, loading, createCourse, refetch: fetchInstructorCourses };
};
