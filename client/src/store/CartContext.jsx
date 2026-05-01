import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const useCartStore = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartStore must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
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
