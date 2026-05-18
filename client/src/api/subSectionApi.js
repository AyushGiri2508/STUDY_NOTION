import API from './axiosInstance';

export const addSubSection = (formData) =>
  API.post('/course/addSubSection', formData, {
    headers: {
      // Let browser auto-set Content-Type with the correct multipart boundary
      'Content-Type': undefined,
    },
    timeout: 60000, // 60s timeout for video uploads
  });

export const updateSubSection = (formData) =>
  API.post('/course/updateSubSection', formData, {
    headers: {
      'Content-Type': undefined,
    },
    timeout: 60000,
  });

export const deleteSubSection = (data) =>
  API.post('/course/deleteSubSection', data);
