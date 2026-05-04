import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthContext';

// Wraps auth pages (login, signup, etc.)
// If user is already logged in, redirect them to dashboard
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
