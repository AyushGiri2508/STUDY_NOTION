import API from './axiosInstance';

export const addSubSection = (formData) =>
  API.post('/course/addSubSection', formData, {
    timeout: 60000, // 60s timeout for video uploads
  });

export const updateSubSection = (formData) =>
  API.post('/course/updateSubSection', formData, {
    timeout: 60000,
  });

export const deleteSubSection = (data) =>
  API.post('/course/deleteSubSection', data);
