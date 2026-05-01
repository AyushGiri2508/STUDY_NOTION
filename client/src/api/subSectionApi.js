import API from './axiosInstance';

export const addSubSection = (formData) =>
  API.post('/course/addSubSection', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateSubSection = (formData) =>
  API.post('/course/updateSubSection', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteSubSection = (data) =>
  API.post('/course/deleteSubSection', data);
