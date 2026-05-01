import API from './axiosInstance';

export const createCourse = (formData) =>
  API.post('/course/createCourse', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getAllCourses = () => API.get('/course/getAllCourses');

export const getCourseDetails = (courseId) =>
  API.post('/course/getCourseDetails', { courseId });
