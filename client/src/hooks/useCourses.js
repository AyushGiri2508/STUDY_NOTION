import { useState, useEffect } from 'react';
import * as courseApi from '../api/courseApi';
import toast from 'react-hot-toast';

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await courseApi.getAllCourses();
      setCourses(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return { courses, loading, refetch: fetchCourses };
};
