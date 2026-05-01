import API from './axiosInstance';

export const capturePayment = (courseId) =>
  API.post('/payment/capturePayment', { course_id: courseId });

export const verifyPayment = (data) =>
  API.post('/payment/verifySignature', data);
