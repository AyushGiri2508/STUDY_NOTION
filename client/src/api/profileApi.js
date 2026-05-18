import API from './axiosInstance';

export const updateProfile = (data) => API.put('/profile/updateProfile', data);
export const deleteAccount = () => API.delete('/profile/deleteProfile');
export const getUserDetails = () => API.get('/profile/getUserDetails');

export const updateDisplayPicture = (formData) =>
  API.put('/profile/updateDisplayPicture', formData, {
    headers: {
      // Let browser auto-set Content-Type with the correct multipart boundary
      'Content-Type': undefined,
    },
    timeout: 30000,
  });
