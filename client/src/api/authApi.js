import API from './axiosInstance';

export const sendOTP = (email) => API.post('/auth/sendotp', { email });
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const changePassword = (data) => API.post('/auth/changepassword', data);
export const resetPasswordToken = (email) => API.post('/auth/reset-password-token', { email });
export const resetPassword = (data) => API.post('/auth/reset-password', data);
