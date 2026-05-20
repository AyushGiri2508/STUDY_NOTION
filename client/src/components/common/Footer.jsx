import { Link } from 'react-router-dom';
import { HiOutlineAcademicCap, HiOutlineHeart } from 'react-icons/hi';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <div className="footer-logo-icon"><HiOutlineAcademicCap /></div>
            <span>Study<span className="logo-accent">Notion</span></span>
          </Link>
          <p className="footer-desc">StudyNotion is an EdTech platform that enables you to learn new skills, advance your career, and explore new hobbies with courses from top instructors.</p>
        </div>
        <div className="footer-links-group">
          <h4>Resources</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/catalog">Catalog</Link>
        </div>
        <div className="footer-links-group">
          <h4>Support</h4>
          <Link to="/help-center">Help Center</Link>
        </div>
        <div className="footer-links-group">
          <h4>Legal</h4>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
          <Link to="/cookie-policy">Cookie Policy</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} StudyNotion. Made with <HiOutlineHeart className="heart-icon" /> for the future of learning.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
