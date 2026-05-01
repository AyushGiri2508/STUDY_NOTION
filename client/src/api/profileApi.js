import API from './axiosInstance';

export const updateProfile = (data) => API.put('/profile/updateProfile', data);
export const deleteAccount = () => API.delete('/profile/deleteProfile');
export const getUserDetails = () => API.get('/profile/getUserDetails');
