import API from './axiosInstance';

export const createCategory = (data) => API.post('/course/createCategory', data);
export const showAllCategories = () => API.get('/course/showAllCategories');
export const getCategoryPageDetails = (categoryId) =>
  API.post('/course/getCategoryPageDetails', { categoryId });
