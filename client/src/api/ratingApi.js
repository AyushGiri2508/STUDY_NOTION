import API from './axiosInstance';

export const createRating = (data) => API.post('/course/createRating', data);
export const getAverageRating = (courseId) =>
  API.get('/course/getAverageRating', { params: { courseId } });
export const getAllReviews = () => API.get('/course/getReviews');
