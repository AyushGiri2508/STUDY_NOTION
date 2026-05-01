import { useState } from 'react';
import * as paymentApi from '../api/paymentApi';
import { useAuthStore } from '../store/AuthContext';
import { useCartStore } from '../store/CartContext';
import toast from 'react-hot-toast';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuthStore();
  const { clearCart } = useCartStore();

  const buyCourse = async (courseId) => {
    setLoading(true);
    try {
      const res = await paymentApi.capturePayment(courseId);
      const { orderId, amount, currency } = res.data;

      // Load Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount,
        currency,
        name: 'StudyNotion',
        description: 'Course Purchase',
        order_id: orderId,
        handler: async (response) => {
          try {
            await paymentApi.verifyPayment(response);
            toast.success('Course purchased successfully!');
            clearCart();
            // Update user's enrolled courses
            if (user) {
              setUser({ ...user, courses: [...(user.courses || []), courseId] });
            }
          } catch {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email,
        },
        theme: { color: '#FFD60A' },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return { loading, buyCourse };
};
