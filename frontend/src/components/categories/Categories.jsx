import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, FolderPlus } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Form states
  const [currentId, setCurrentId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load categories');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setCurrentId(null);
    setName('');
    setDescription('');
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setCurrentId(category._id);
    setName(category.name);
    setDescription(category.description || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(currentId ? 'Updating category...' : 'Creating category...');

    try {
      let response;
      if (currentId) {
        response = await api.put(`/categories/${currentId}`, { name, description });
      } else {
        response = await api.post('/categories', { name, description });
      }

      toast.dismiss(toastId);

      if (response.data.success) {
        toast.success(response.data.message);
        setModalOpen(false);
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    const toastId = toast.loading('Deleting category...');
    try {
      const response = await api.delete(`/categories/${id}`);
      toast.dismiss(toastId);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="module-header">
        <div>
          <h1 className="dashboard-title">Categories</h1>
          <p className="dashboard-subtitle">Manage inventory categories and classifications.</p>
        </div>
        <button className="btn-primary btn-icon" onClick={openAddModal}>
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      {loading ? (
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="empty-state">
          <FolderPlus size={48} className="empty-icon" />
          <h3>No categories found</h3>
          <p>Get started by creating your first product category.</p>
          <button className="btn-primary" onClick={openAddModal} style={{ marginTop: '1rem' }}>
            Create Category
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Description</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td className="table-cell-bold">{category.name}</td>
                  <td className="table-cell-muted">{category.description || 'No description provided'}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-action-edit" onClick={() => openEditModal(category)} title="Edit Category">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-action-delete" onClick={() => handleDelete(category._id)} title="Delete Category">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Popup Form */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{currentId ? 'Edit Category' : 'Add New Category'}</h3>
              <button className="btn-close" onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="cat-name">Category Name</label>
                <input
                  type="text"
                  id="cat-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Electronics, Furniture"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cat-desc">Description</label>
                <textarea
                  id="cat-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the category (optional)"
                  rows={4}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : currentId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
