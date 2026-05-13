import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

/* ── Sample courses (used when localStorage cart is empty) ── */
const SAMPLE_COURSES = [
  {
    _id: 'sample_001',
    courseName: 'The Complete Web Development Bootcamp',
    courseDescription: 'Master HTML, CSS, JavaScript, Node.js, React, and more in this comprehensive full-stack bootcamp.',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop',
    price: 499,
    instructor: { firstName: 'Ayush', lastName: 'Giri' },
    category: { name: 'Web Development' },
    ratingAndReviews: [],
    studentEnrolled: [],
  },
  {
    _id: 'sample_002',
    courseName: 'React – The Complete Guide (incl. Hooks, Router & Redux)',
    courseDescription: 'Dive deep into React.js with hooks, context API, Redux, React Router, and build real-world projects.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
    price: 399,
    instructor: { firstName: 'Rahul', lastName: 'Sharma' },
    category: { name: 'Frontend' },
    ratingAndReviews: [],
    studentEnrolled: [],
  },
  {
    _id: 'sample_003',
    courseName: 'Python for Data Science & Machine Learning',
    courseDescription: 'Learn Python, Pandas, NumPy, Matplotlib, Scikit-learn and build ML models from scratch.',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop',
    price: 599,
    instructor: { firstName: 'Priya', lastName: 'Patel' },
    category: { name: 'Data Science' },
    ratingAndReviews: [],
    studentEnrolled: [],
  },
];

export const useCartStore = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartStore must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : SAMPLE_COURSES;
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (course) => {
    setCart((prev) => {
      if (prev.find((c) => c._id === course._id)) return prev;
      return [...prev, course];
    });
  };

  const removeFromCart = (courseId) => {
    setCart((prev) => prev.filter((c) => c._id !== courseId));
  };

  const clearCart = () => setCart([]);

  const isInCart = (courseId) => cart.some((c) => c._id === courseId);

  const totalPrice = cart.reduce((sum, c) => sum + (c.price || 0), 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, isInCart, totalPrice, totalItems: cart.length }}
    >
      {children}
    </CartContext.Provider>
  );
};
