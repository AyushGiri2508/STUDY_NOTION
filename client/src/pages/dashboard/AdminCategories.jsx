import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useAdmin } from '../../hooks/useAdmin';
import { motion } from 'framer-motion';
import ConfirmModal from '../../components/common/ConfirmModal';
import API from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import {
  HiOutlineClipboardList,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineX,
  HiArrowLeft,
} from 'react-icons/hi';
import './AdminCategories.css';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const AdminCategories = () => {
  const { categories, fetchCategories } = useCategories();
  const { editCategory, removeCategory } = useAdmin();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleStartEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
    setEditDesc(cat.description || '');
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) {
      toast.error('Category name is required');
      return;
    }
    const result = await editCategory(editId, { name: editName, description: editDesc });
    if (result) {
      setEditId(null);
      fetchCategories();
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditName('');
    setEditDesc('');
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      const ok = await removeCategory(deleteTarget._id);
      if (ok) {
        setDeleteTarget(null);
        fetchCategories();
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newName.trim() || !newDesc.trim()) {
      toast.error('Name and description are required');
      return;
    }
    setAddLoading(true);
    try {
      await API.post('/course/createCategory', { name: newName, description: newDesc });
      toast.success('Category created successfully');
      setNewName('');
      setNewDesc('');
      setShowAdd(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <motion.div className="admin-categories" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
      <motion.div variants={fadeUp}>
        <Link to="/dashboard/admin" className="back-link"><HiArrowLeft /> Back to Admin Panel</Link>
      </motion.div>

      {/* Header */}
      <motion.div className="admin-page-header" variants={fadeUp}>
        <div>
          <h1><HiOutlineClipboardList style={{ color: 'var(--color-green)' }} /> Manage Categories</h1>
          <p>{categories.length} categories on the platform</p>
        </div>
        <button className="btn btn-yellow btn-sm" onClick={() => setShowAdd(!showAdd)}>
          <HiOutlinePlus /> Add Category
        </button>
      </motion.div>

      {/* Add Category Form */}
      {showAdd && (
        <motion.div className="admin-cat-add-form glass-card" variants={fadeUp} initial="hidden" animate="visible">
          <h3>Create New Category</h3>
          <div className="admin-cat-form-fields">
            <div className="form-group">
              <label className="form-label">Category Name</label>
              <input
                className="form-input"
                placeholder="e.g. Artificial Intelligence"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                className="form-input"
                placeholder="Brief description of this category"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>
          </div>
          <div className="admin-cat-form-actions">
            <button className="btn btn-yellow btn-sm" onClick={handleAddCategory} disabled={addLoading}>
              {addLoading ? <span className="btn-loader" /> : <><HiOutlineCheck /> Create</>}
            </button>
            <button className="btn btn-dark btn-sm" onClick={() => { setShowAdd(false); setNewName(''); setNewDesc(''); }}>
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Categories List */}
      <motion.div className="admin-cat-list" variants={fadeUp}>
        {categories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏷️</div>
            <h3>No categories yet</h3>
            <p>Click "Add Category" to create your first one.</p>
          </div>
        ) : (
          categories.map((cat) => (
            <motion.div key={cat._id} className="admin-cat-item glass-card" variants={fadeUp}>
              {editId === cat._id ? (
                /* Edit Mode */
                <div className="admin-cat-edit">
                  <div className="admin-cat-edit-fields">
                    <input
                      className="form-input admin-cat-edit-input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Category name"
                    />
                    <input
                      className="form-input admin-cat-edit-input"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      placeholder="Description"
                    />
                  </div>
                  <div className="admin-cat-edit-actions">
                    <button className="btn btn-yellow btn-sm" onClick={handleSaveEdit}><HiOutlineCheck /> Save</button>
                    <button className="btn btn-dark btn-sm" onClick={handleCancelEdit}><HiOutlineX /> Cancel</button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="admin-cat-view">
                  <div className="admin-cat-info">
                    <div className="admin-cat-icon-wrapper">
                      <HiOutlineClipboardList />
                    </div>
                    <div>
                      <h4 className="admin-cat-name">{cat.name}</h4>
                      <p className="admin-cat-desc">{cat.description || 'No description'}</p>
                    </div>
                  </div>
                  <div className="admin-cat-right">
                    <span className="admin-cat-course-count">
                      {cat.courses?.length || 0} courses
                    </span>
                    <div className="admin-cat-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => handleStartEdit(cat)} title="Edit">
                        <HiOutlinePencil />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(cat)} title="Delete">
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          title="Delete Category"
          description={`Are you sure you want to delete "${deleteTarget.name}"? Courses in this category will be left uncategorized.`}
          confirmText="Delete"
          danger={true}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </motion.div>
  );
};

export default AdminCategories;
