import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { CartProvider } from './store/CartContext';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import Catalog from './pages/Catalog';
import CourseDetails from './pages/CourseDetails';
import About from './pages/About';
import Contact from './pages/Contact';

import DashboardLayout from './pages/dashboard/DashboardLayout';
import MyProfile from './pages/dashboard/MyProfile';
import Settings from './pages/dashboard/Settings';
import EnrolledCourses from './pages/dashboard/EnrolledCourses';
import Cart from './pages/dashboard/Cart';
import MyCourses from './pages/dashboard/MyCourses';
import AddCourse from './pages/dashboard/AddCourse';
import DashboardHome from './pages/dashboard/DashboardHome';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/verify-otp" element={<PublicRoute><VerifyOTP /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/update-password/:token" element={<UpdatePassword />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:categoryId" element={<Catalog />} />
            <Route path="/course/:courseId" element={<CourseDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Dashboard — Protected */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<DashboardHome />} />
              <Route path="my-profile" element={<MyProfile />} />
              <Route path="settings" element={<Settings />} />

              {/* Student */}
              <Route path="enrolled-courses" element={<ProtectedRoute roles={['Student']}><EnrolledCourses /></ProtectedRoute>} />
              <Route path="cart" element={<ProtectedRoute roles={['Student']}><Cart /></ProtectedRoute>} />

              {/* Instructor */}
              <Route path="my-courses" element={<ProtectedRoute roles={['Instructor']}><MyCourses /></ProtectedRoute>} />
              <Route path="add-course" element={<ProtectedRoute roles={['Instructor']}><AddCourse /></ProtectedRoute>} />
            </Route>
          </Routes>
          <Footer />
          <Toaster position="top-center" toastOptions={{ style: { background: '#0a1128', color: '#f1f5f9', border: '1px solid rgba(71,165,255,0.15)', borderRadius: '10px' } }} />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
