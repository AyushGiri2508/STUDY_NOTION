import API from './axiosInstance';

export const addSection = (data) => API.post('/course/addSection', data);
export const updateSection = (data) => API.post('/course/updateSection', data);
export const deleteSection = (data) => API.post('/course/deleteSection', data);
