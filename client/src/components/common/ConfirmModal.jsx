import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title = 'Are you sure?', description = '', confirmText = 'Confirm', danger = false }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="glass-card" style={{ padding: '2rem', maxWidth: 420, width: '90%', textAlign: 'center' }} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
          <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
          {description && <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{description}</p>}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button className="btn btn-dark" onClick={onClose}>Cancel</button>
            <button className={`btn ${danger ? 'btn-danger' : 'btn-yellow'}`} onClick={onConfirm}>{confirmText}</button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
export default ConfirmModal;
