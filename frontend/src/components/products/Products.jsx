import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Search, Package, AlertCircle } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 6; // 6 items per page looks great on the UI

  // Modal & Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories for selector
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products', {
        params: { search, page, limit }
      });
      if (response.data.success) {
        setProducts(response.data.products);
        setPages(response.data.pages);
        setTotal(response.data.total);
      }
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300); // Debounce search requests

    return () => clearTimeout(delayDebounceFn);
  }, [search, page]);

  const openAddModal = () => {
    setCurrentId(null);
    setName('');
    setSku('');
    setCategory(categories[0]?._id || '');
    setPurchasePrice('');
    setSellingPrice('');
    setQuantity('');
    setImageFile(null);
    setImagePreview('');
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setCurrentId(product._id);
    setName(product.name);
    setSku(product.sku);
    setCategory(product.category?._id || product.category || '');
    setPurchasePrice(product.purchasePrice || '');
    setSellingPrice(product.sellingPrice || '');
    setQuantity(product.quantity || '');
    setImageFile(null);
    setImagePreview(product.image || '');
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim() || !category) {
      toast.error('Name, SKU, and Category are required');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(currentId ? 'Updating product...' : 'Creating product...');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('sku', sku);
    formData.append('category', category);
    formData.append('purchasePrice', purchasePrice);
    formData.append('sellingPrice', sellingPrice);
    formData.append('quantity', quantity);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      let response;
      const headers = { 'Content-Type': 'multipart/form-data' };
      if (currentId) {
        response = await api.put(`/products/${currentId}`, formData, { headers });
      } else {
        response = await api.post('/products', formData, { headers });
      }

      toast.dismiss(toastId);

      if (response.data.success) {
        toast.success(response.data.message);
        setModalOpen(false);
        fetchProducts();
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
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    const toastId = toast.loading('Deleting product...');
    try {
      const response = await api.delete(`/products/${id}`);
      toast.dismiss(toastId);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchProducts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="module-header">
        <div>
          <h1 className="dashboard-title">Products</h1>
          <p className="dashboard-subtitle">Manage inventory stock levels and details.</p>
        </div>
        <button className="btn-primary btn-icon" onClick={openAddModal}>
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="search-bar-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search by product name or SKU..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <Package size={48} className="empty-icon" />
          <h3>No products found</h3>
          <p>Create some products or refine your search filter.</p>
          {search && (
            <button className="btn-secondary" onClick={() => setSearch('')} style={{ marginTop: '1rem' }}>
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Image</th>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Purchase Price</th>
                  <th>Selling Price</th>
                  <th>Qty</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const isLowStock = product.quantity < 10;
                  return (
                    <tr key={product._id}>
                      <td>
                        <div className="product-image-thumbnail">
                          {product.image ? (
                            <img src={product.image} alt={product.name} />
                          ) : (
                            <Package size={20} style={{ color: 'var(--text-secondary)' }} />
                          )}
                        </div>
                      </td>
                      <td className="table-cell-bold">{product.name}</td>
                      <td><code>{product.sku}</code></td>
                      <td>{product.category?.name || 'Unassigned'}</td>
                      <td>${parseFloat(product.purchasePrice || 0).toFixed(2)}</td>
                      <td>${parseFloat(product.sellingPrice || 0).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${isLowStock ? 'badge-low-stock' : 'badge-ok'}`}>
                          {product.quantity}
                          {isLowStock && <AlertCircle size={12} style={{ marginLeft: '4px' }} />}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="btn-action-edit" onClick={() => openEditModal(product)} title="Edit Product">
                            <Edit2 size={16} />
                          </button>
                          <button className="btn-action-delete" onClick={() => handleDelete(product._id)} title="Delete Product">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="pagination">
              <button 
                className="btn-secondary pagination-btn" 
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <div className="pagination-info">
                Page <strong>{page}</strong> of <strong>{pages}</strong> ({total} total products)
              </div>
              <button 
                className="btn-secondary pagination-btn" 
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal Popup Form */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content modal-large">
            <div className="modal-header">
              <h3>{currentId ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="btn-close" onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group flex-1">
                  <label htmlFor="p-name">Product Name *</label>
                  <input
                    type="text"
                    id="p-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Wireless Mouse"
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label htmlFor="p-sku">SKU *</label>
                  <input
                    type="text"
                    id="p-sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. ELEC-MSE-001"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label htmlFor="p-cat">Category *</label>
                  <select
                    id="p-cat"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="select-input"
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label htmlFor="p-qty">Quantity</label>
                  <input
                    type="number"
                    id="p-qty"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label htmlFor="p-purchase">Purchase Price ($)</label>
                  <input
                    type="number"
                    id="p-purchase"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="form-group flex-1">
                  <label htmlFor="p-selling">Selling Price ($)</label>
                  <input
                    type="number"
                    id="p-selling"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Product Image</label>
                <div className="image-upload-wrapper">
                  <input
                    type="file"
                    id="p-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="p-image" className="btn-secondary select-image-btn">
                    Choose Image File
                  </label>
                  {imagePreview && (
                    <div className="image-upload-preview">
                      <img src={imagePreview} alt="Upload Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : currentId ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
