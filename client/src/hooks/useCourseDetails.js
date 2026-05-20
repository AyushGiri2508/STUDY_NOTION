import { useState, useEffect } from 'react';
import * as courseApi from '../api/courseApi';
import toast from 'react-hot-toast';

export const useCourseDetails = (courseId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCourse = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await courseApi.getCourseDetails(courseId);
      const data = res.data.data;
      setCourse(Array.isArray(data) ? data[0] : data);
    } catch (err) {
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  return { course, loading, refetch: fetchCourse, setCourse };
};
