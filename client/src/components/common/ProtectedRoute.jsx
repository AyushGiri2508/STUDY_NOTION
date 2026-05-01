import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuthStore();

  if (loading) return <div className="loader-container"><div className="loader" /><p className="loader-text">Loading...</p></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.accountType)) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
