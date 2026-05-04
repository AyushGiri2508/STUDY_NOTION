import { useCart } from '../../hooks/useCart';
import { usePayment } from '../../hooks/usePayment';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineTrash } from 'react-icons/hi';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, totalPrice, totalItems } = useCart();
  const { buyCourse, loading } = usePayment();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="dashboard-header"><h1>My Cart</h1><p>{totalItems} course{totalItems !== 1 ? 's' : ''} in cart</p></div>
      {cart.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-xl)', alignItems: 'start' }}>
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            {cart.map((c) => (
              <div key={c._id} className="cart-item">
                <div className="cart-thumb"><img src={c.thumbnail || ''} alt="" /></div>
                <div><h4 style={{ fontSize: '0.938rem', marginBottom: 4 }}>{c.courseName}</h4><p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{c.instructor?.firstName} {c.instructor?.lastName}</p></div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-sm)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-yellow)' }}>₹{c.price}</span>
                  <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(c._id)}><HiOutlineTrash /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="glass-card cart-summary">
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-sm)' }}>Total</p>
            <p className="cart-total">₹{totalPrice}</p>
            <button className="btn btn-yellow btn-lg" disabled={loading} style={{ width: '100%' }} onClick={async () => { for (const c of cart) await buyCourse(c._id); }}>
              {loading ? <span className="btn-loader" /> : 'Buy All'}
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-state glass-card"><div className="empty-state-icon">🛒</div><h3>Your cart is empty</h3><p>Browse courses and add them to your cart</p><Link to="/catalog" className="btn btn-yellow">Browse Courses</Link></div>
      )}
    </motion.div>
  );
};
export default Cart;
