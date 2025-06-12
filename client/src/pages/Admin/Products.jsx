// Updated Product Form Component with category fix
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Layout from '../../components/Layouts/Layout.js';
import Spinner from '../../components/Spinner';
import { FiUpload, FiX } from 'react-icons/fi';
import './Admin.css';

const Products = () => {
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    images: [],
    category: '',
    shipping: ''
  });

  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const { data } = await axios.get('/api/v1/category/get-category');
        setCategories(data?.category || []); // Fixed key
      } catch (error) {
        console.error(error);
        toast.error('Error fetching categories');
      }
    };
    getAllCategories();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewImages.length > 3) {
      toast.error('Maximum 3 images allowed');
      return;
    }

    files.forEach(file => {
      if (file.size > 1024 * 1024) {
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
      productFormData.append('quantity', formData.quantity);
      productFormData.append('description', formData.description);
      productFormData.append('category', formData.category);
      productFormData.append('shipping', formData.shipping);
      formData.images.forEach(image => {
        productFormData.append('images', image);
      });

      const { data } = await axios.post('/api/v1/product/create-product', productFormData);
      if (data?.success) {
        toast.success('Product created successfully');
        setFormData({
          name: '',
          price: '',
          quantity: '',
          description: '',
          images: [],
          category: '',
          shipping: ''
        });
        setPreviewImages([]);
      } else {
        toast.error(data.message || 'Error creating product');
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
        <form onSubmit={handleSubmit} className="product-form">
          <input type="text" placeholder="Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="number" placeholder="Price" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          <input type="number" placeholder="Quantity" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
          <textarea placeholder="Description" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <select value={formData.shipping} onChange={e => setFormData({...formData, shipping: e.target.value})}>
            <option value="">Select Shipping Option</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>

          <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          {previewImages.map((img, i) => (
            <div key={i}>
              <img src={img} alt="preview" style={{ width: '100px' }} />
              <button onClick={() => removeImage(i)}>Remove</button>
            </div>
          ))}

          <button type="submit" disabled={loading}>{loading ? <Spinner /> : 'Create Product'}</button>
        </form>
      </div>
    </Layout>
  );
};

export default Products;
