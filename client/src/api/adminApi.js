import API from './axiosInstance';

// ─── Admin Stats ───
export const getAdminStats = () => API.get('/admin/stats');

// ─── User Management ───
export const getAllUsers = () => API.get('/admin/users');
export const getUserById = (userId) => API.get(`/admin/users/${userId}`);
export const deleteUser = (userId) => API.delete(`/admin/users/${userId}`);

// ─── Course Management ───
export const getAllCoursesAdmin = () => API.get('/admin/courses');
export const deleteCourseAdmin = (courseId) => API.delete(`/admin/courses/${courseId}`);

// ─── Category Management ───
export const updateCategory = (id, data) => API.put(`/admin/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/admin/categories/${id}`);
