import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { HiOutlineUser, HiOutlineCog, HiOutlineCollection, HiOutlinePlusCircle, HiOutlineShoppingCart, HiOutlineLogout, HiOutlineHome } from 'react-icons/hi';
import '../Dashboard.css';

const DashboardLayout = () => {
  const { isStudent, isInstructor, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="dashboard-layout" style={{ paddingTop: 'var(--nav-height)' }}>
      <aside className="sidebar">
        <div className="sidebar-links">
          <NavLink to="/dashboard" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><HiOutlineHome /> Dashboard</NavLink>
          <NavLink to="/dashboard/my-profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><HiOutlineUser /> My Profile</NavLink>

          {isStudent && (
            <>
              <NavLink to="/dashboard/enrolled-courses" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><HiOutlineCollection /> Enrolled Courses</NavLink>
              <NavLink to="/dashboard/cart" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><HiOutlineShoppingCart /> Cart</NavLink>
            </>
          )}

          {isInstructor && (
            <>
              <NavLink to="/dashboard/my-courses" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><HiOutlineCollection /> My Courses</NavLink>
              <NavLink to="/dashboard/add-course" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><HiOutlinePlusCircle /> Add Course</NavLink>
            </>
          )}

          <NavLink to="/dashboard/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><HiOutlineCog /> Settings</NavLink>
        </div>
        <div className="sidebar-divider" />
        <button className="sidebar-logout" onClick={handleLogout}><HiOutlineLogout /> Logout</button>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};
export default DashboardLayout;
