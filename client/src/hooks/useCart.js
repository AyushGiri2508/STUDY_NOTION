import { useCartStore } from '../store/CartContext';
import toast from 'react-hot-toast';

export const useCart = () => {
  const { cart, addToCart: storeAdd, removeFromCart: storeRemove, clearCart, isInCart, totalPrice, totalItems } = useCartStore();

  const addToCart = (course) => {
    if (isInCart(course._id)) {
      toast.error('Course already in cart');
      return;
    }
    storeAdd(course);
    toast.success('Added to cart');
  };

  const removeFromCart = (courseId) => {
    storeRemove(courseId);
    toast.success('Removed from cart');
  };

  return { cart, addToCart, removeFromCart, clearCart, isInCart, totalPrice, totalItems };
};
