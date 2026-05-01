import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useCategories } from '../../hooks/useCategories';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineAcademicCap, HiOutlineUser, HiOutlineLogout, HiOutlineMenu, HiOutlineX, HiOutlineShoppingCart, HiOutlineCog, HiOutlineCollection, HiOutlineChevronDown, HiOutlinePlusCircle } from 'react-icons/hi';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isStudent, isInstructor, logout } = useAuth();
  const { totalItems } = useCart();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const catalogRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (catalogRef.current && !catalogRef.current.contains(e.target)) setCatalogOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => { window.removeEventListener('scroll', handleScroll); document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  useEffect(() => { setMobileOpen(false); setCatalogOpen(false); setDropdownOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); setDropdownOpen(false); setMobileOpen(false); };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon"><HiOutlineAcademicCap /></div>
          <span className="logo-text">Study<span className="logo-accent">Notion</span></span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>

          <div className="nav-dropdown" ref={catalogRef}>
            <button className={`nav-link ${location.pathname.startsWith('/catalog') ? 'active' : ''}`} onClick={() => setCatalogOpen(!catalogOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Catalog <HiOutlineChevronDown className={`dropdown-arrow ${catalogOpen ? 'open' : ''}`} />
            </button>
            <AnimatePresence>
              {catalogOpen && (
                <motion.div className="nav-dropdown-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
                  {categories.length > 0 ? categories.map((cat) => (
                    <Link key={cat._id} to={`/catalog/${cat._id}`} className="nav-dropdown-item">{cat.name}</Link>
                  )) : <div className="nav-dropdown-item" style={{ color: 'var(--color-text-muted)' }}>No categories</div>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
        </div>

        <div className="navbar-actions">
          {isAuthenticated && isStudent && (
            <Link to="/dashboard/cart" className="nav-cart">
              <HiOutlineShoppingCart />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="user-dropdown" ref={dropdownRef}>
              <button className="user-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user?.image ? <img src={user.image} alt="" className="user-avatar" /> : <div className="user-avatar-fallback">{user?.firstName?.[0]}</div>}
                <span className="user-name">{user?.firstName}</span>
                <HiOutlineChevronDown className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div className="dropdown-menu" initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.15 }}>
                    <div className="dropdown-header">
                      <p className="dropdown-name">{user?.firstName} {user?.lastName}</p>
                      <span className={`dropdown-role badge badge-yellow`}>{user?.accountType}</span>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/dashboard/my-profile" className="dropdown-item"><HiOutlineUser /> My Profile</Link>
                    {isInstructor && <Link to="/dashboard/my-courses" className="dropdown-item"><HiOutlineCollection /> My Courses</Link>}
                    {isStudent && <Link to="/dashboard/enrolled-courses" className="dropdown-item"><HiOutlineCollection /> Enrolled Courses</Link>}
                    <Link to="/dashboard/settings" className="dropdown-item"><HiOutlineCog /> Settings</Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item dropdown-logout" onClick={handleLogout}><HiOutlineLogout /> Logout</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline btn-sm">Log in</Link>
              <Link to="/signup" className="btn btn-yellow btn-sm">Sign up</Link>
            </div>
          )}

          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Link to="/" className="mobile-link">Home</Link>
            {categories.map((cat) => <Link key={cat._id} to={`/catalog/${cat._id}`} className="mobile-link">{cat.name}</Link>)}
            <Link to="/about" className="mobile-link">About</Link>
            <Link to="/contact" className="mobile-link">Contact</Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard/my-profile" className="mobile-link"><HiOutlineUser /> Dashboard</Link>
                {isInstructor && <Link to="/dashboard/add-course" className="mobile-link"><HiOutlinePlusCircle /> Create Course</Link>}
                <button className="mobile-link" onClick={handleLogout} style={{ color: 'var(--color-red)' }}><HiOutlineLogout /> Logout</button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/login" className="mobile-link">Log in</Link>
                <Link to="/signup" className="mobile-link">Sign up</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
