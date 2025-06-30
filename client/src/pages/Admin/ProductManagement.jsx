import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiEdit, FiTrash2, FiPlus, FiX, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    category: '',
    image: null,
  });

  const [editLoading, setEditLoading] = useState(false);

  const categories = [
    { id: 'spices', name: 'Spices' },
    { id: 'herbs', name: 'Herbs' },
    { id: 'blends', name: 'Blends' },
    { id: 'oils', name: 'Essential Oils' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/v1/product/get-product');
      if (data?.success) {
        console.log('Fetched products:', data.products);
        setProducts(data.products);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(error.response?.data?.message || 'Error fetching products');
    } finally {
      setLoading(false);
    }
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
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Filter and paginate products
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Edit modal submit handler
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('price', formData.price);
      form.append('quantity', formData.quantity);
      form.append('description', formData.description);
      form.append('category', formData.category);
      if (formData.image) form.append('image', formData.image);
      const { data } = await axios.put(`/api/v1/product/update-product/${editingProduct._id}`, form);
      if (data?.success) {
        toast.success('Product updated successfully');
        setEditingProduct(null);
        fetchProducts();
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating product');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-100 backdrop-blur-xl p-4 md:p-8">
      {/* Breadcrumb and Back Button Header */}
      <div className="max-w-7xl mx-auto w-full mb-4">
        <div className="flex items-center gap-2 md:gap-4 w-full">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            aria-label="Go back"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <nav className="text-sm md:text-base text-emerald-500 font-medium flex items-center gap-1" aria-label="Breadcrumb">
            <span className="hover:underline cursor-pointer" onClick={() => navigate('/admin/dashboard')}>Admin Dashboard</span>
            <span className="mx-1 text-emerald-400">/</span>
            <span className="text-emerald-700 font-semibold">Product Management</span>
          </nav>
        </div>
      </div>
      {/* Edit Modal */}
      <AnimatePresence>
        {editingProduct && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative border border-emerald-100"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <button
                className="absolute top-3 right-3 text-emerald-500 hover:text-emerald-700 bg-emerald-50 rounded-full p-1.5"
                onClick={() => setEditingProduct(null)}
                aria-label="Close edit modal"
              >
                <FiX className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-emerald-700 mb-4">Edit Product</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-emerald-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-1">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full border border-emerald-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full border border-emerald-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-emerald-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border border-emerald-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-1">Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full border border-emerald-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                  />
                  {editingProduct.images?.[0] && !formData.image && (
                    <img src={editingProduct.images[0]} alt="Current" className="mt-2 h-16 w-16 object-cover rounded-lg border border-emerald-100" />
                  )}
                  {formData.image && (
                    <span className="block mt-2 text-xs text-emerald-500">New image selected</span>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="mr-3 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                    onClick={() => setEditingProduct(null)}
                  >Cancel</button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-semibold shadow hover:from-emerald-600 hover:to-emerald-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 flex items-center gap-2"
                    disabled={editLoading}
                  >
                    {editLoading && <LoadingSpinner />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto">
        {/* Header with title and add button */}
        <div className="backdrop-blur-md bg-white/80 border border-emerald-100 rounded-2xl shadow-lg px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-emerald-700 tracking-tight">Product Management</h1>
            <p className="text-emerald-500 mt-1 font-medium">Manage your product inventory</p>
          </div>
          <button
            onClick={() => navigate('/admin/products')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-semibold rounded-lg shadow hover:from-emerald-600 hover:to-emerald-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <FiPlus className="w-5 h-5" /> Add New Product
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/90 border border-emerald-100 rounded-xl shadow p-4 mb-8 flex items-center max-w-md mx-auto">
          <FiSearch className="h-5 w-5 text-emerald-400 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
            className="flex-1 bg-transparent outline-none text-emerald-900 placeholder-emerald-400 px-2 py-1 text-base"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
        </div>

        {/* Products Table */}
        <div className="bg-white/90 border border-emerald-100 rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-emerald-100">
                  <thead className="bg-emerald-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-emerald-700 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-emerald-700 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-emerald-700 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-emerald-700 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-emerald-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-emerald-50">
                    {currentProducts.length > 0 ? (
                      currentProducts.map((product) => (
                        <tr key={product._id} className="hover:bg-emerald-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img 
                                  className="h-10 w-10 rounded-full object-cover" 
                                  src={product.images?.[0] || 'https://via.placeholder.com/40'}
                                  alt={product.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-emerald-900">{product.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                              {product.category?.name || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-900">
                            ${parseFloat(product.price).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.quantity > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {product.quantity} in stock
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEditClick(product)}
                                className="text-emerald-600 hover:text-emerald-900 transition-colors duration-200 p-1.5 rounded-md hover:bg-emerald-50"
                                title="Edit"
                              >
                                <FiEdit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1.5 rounded-md hover:bg-red-50"
                                title="Delete"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-emerald-500">
                          No products found. Add a new product to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white/80 px-4 py-4 flex items-center justify-between border-t border-emerald-100">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-emerald-200 text-sm font-medium rounded-md ${
                        currentPage === 1 ? 'bg-emerald-100 text-emerald-400 cursor-not-allowed' : 'bg-white text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`ml-3 relative inline-flex items-center px-4 py-2 border border-emerald-200 text-sm font-medium rounded-md ${
                        currentPage === totalPages ? 'bg-emerald-100 text-emerald-400 cursor-not-allowed' : 'bg-white text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-emerald-700">
                        Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(indexOfLastProduct, filteredProducts.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredProducts.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => paginate(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-emerald-200 bg-white text-sm font-medium ${
                            currentPage === 1 ? 'text-emerald-300 cursor-not-allowed' : 'text-emerald-500 hover:bg-emerald-50'
                          }`}
                        >
                          <span className="sr-only">Previous</span>
                          <FiChevronLeft className="h-5 w-5" />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => paginate(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNum
                                  ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                                  : 'bg-white border-emerald-200 text-emerald-500 hover:bg-emerald-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-emerald-200 bg-white text-sm font-medium ${
                            currentPage === totalPages ? 'text-emerald-300 cursor-not-allowed' : 'text-emerald-500 hover:bg-emerald-50'
                          }`}
                        >
                          <span className="sr-only">Next</span>
                          <FiChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;