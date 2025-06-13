import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Layout from '../../components/Layouts/Layout.js';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import './Admin.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    category: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/v1/product/get-product');
      if (data?.success) {
        setProducts(data.products);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      toast.error('Error fetching products');
    }
    setLoading(false);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
      category: product.category?._id || '',
    });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const { data } = await axios.delete(`/api/v1/product/delete-product/${productId}`);
      if (data?.success) {
        toast.success('Product deleted successfully');
        fetchProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/v1/product/update-product/${editingProduct._id}`, formData);
      if (data?.success) {
        toast.success('Product updated successfully');
        setEditingProduct(null);
        fetchProducts();
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      toast.error('Error updating product');
    }
    setLoading(false);
  };

  return (
    <Layout title="Product Management">
      <div className="product-management-container" style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
        <h2 style={{ color: '#4a90e2', marginBottom: '20px', fontWeight: '700', fontSize: '2rem' }}>Product Management</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <thead style={{ backgroundColor: '#4a90e2', color: 'white' }}>
              <tr>
                <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Price</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Quantity</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{product.name}</td>
                  <td style={{ padding: '10px' }}>${product.price}</td>
                  <td style={{ padding: '10px' }}>{product.quantity}</td>
                  <td style={{ padding: '10px' }}>{product.category?.name || '-'}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <button onClick={() => handleEditClick(product)} style={{ marginRight: '10px', backgroundColor: '#4a90e2', border: 'none', color: 'white', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }} title="Edit">
                      <FiEdit />
                    </button>
                    <button onClick={() => handleDelete(product._id)} style={{ backgroundColor: '#e94e4e', border: 'none', color: 'white', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }} title="Delete">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {editingProduct && (
          <div style={{ marginTop: '30px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: 'white' }}>
            <h3 style={{ color: '#4a90e2', marginBottom: '15px' }}>Edit Product</h3>
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleInputChange}
                required
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                required
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }}
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleInputChange}
                required
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={loading} style={{ backgroundColor: '#4a90e2', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                  {loading ? 'Updating...' : 'Update Product'}
                </button>
                <button type="button" onClick={() => setEditingProduct(null)} style={{ marginLeft: '10px', padding: '10px 15px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductManagement;