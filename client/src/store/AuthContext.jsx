import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuthStore = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthStore must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Sync to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  // Initial load complete
  useEffect(() => {
    setLoading(false);
  }, []);

  const updateUser = (data) => setUser(data);

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        loading,
        setLoading,
        updateUser,
        clearAuth,
        isAuthenticated: !!token && !!user,
        isStudent: user?.accountType === 'Student',
        isInstructor: user?.accountType === 'Instructor',
        isAdmin: user?.accountType === 'Admin',
        accountType: user?.accountType || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
