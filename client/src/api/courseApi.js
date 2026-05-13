import API from './axiosInstance';

export const createCourse = (formData) =>
  API.post('/course/createCourse', formData, {
    headers: {
      // Let the browser auto-set Content-Type with the correct multipart boundary
      // Do NOT manually set 'multipart/form-data' — it breaks file uploads
      'Content-Type': undefined,
    },
    // Increase timeout for file uploads
    timeout: 30000,
  });

export const getAllCourses = () => API.get('/course/getAllCourses');

export const getCourseDetails = (courseId) =>
  API.post('/course/getCourseDetails', { courseId });
