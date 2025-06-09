import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Layout from '../../components/Layouts/Layout.js';
import Spinner from '../../components/Spinner';
import { FiUpload, FiX } from 'react-icons/fi';
import './Admin.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    images: [],
    category: '',
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [categories, setCategories] = useState([]);

  // Get all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get('/api/v1/category/get-category');
      setCategories(data.category || []);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching categories');
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewImages.length > 3) {
      toast.error('Maximum 3 images allowed');
      return;
    }

    files.forEach(file => {
      if (file.size > 1024 * 1024) { // 1MB limit
        toast.error(`${file.name} is too large. Max size is 1MB`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, reader.result]);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, file]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length < 1) {
      toast.error('Please add at least one image');
      return;
    }

    try {
      setLoading(true);
      const productFormData = new FormData();
      productFormData.append('name', formData.name);
      productFormData.append('price', formData.price);
      productFormData.append('description', formData.description);
      productFormData.append('category', formData.category);
      formData.images.forEach(image => {
        productFormData.append('images', image);
      });

      const { data } = await axios.post('/api/v1/product/create-product', productFormData);
      if (data?.success) {
        toast.success('Product created successfully');
        setFormData({
          name: '',
          price: '',
          description: '',
          images: [],
          category: ''
        });
        setPreviewImages([]);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Error creating product');
      setLoading(false);
    }
  };

  return (
    <Layout title="Dashboard - Products">
      <div className="product-container">
        <h1 className="product-title">Product Management</h1>

        <div className="product-form-container">
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter product name"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="form-input"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="Enter price"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter product description"
                className="form-textarea"
                required
              />
            </div>

            <div className="form-group">
              <label>Product Images (Max 3)</label>
              <div className="image-upload-container">
                <div className="image-upload-box">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    multiple
                    id="image-upload"
                    className="image-input"
                  />
                  <label htmlFor="image-upload" className="image-upload-label">
                    <FiUpload />
                    <span>Choose Images</span>
                  </label>
                </div>

                <div className="image-preview-container">
                  {previewImages.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img src={image} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="remove-image"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? <Spinner /> : 'Create Product'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
