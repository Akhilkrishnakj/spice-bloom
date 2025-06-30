import React, { useState } from 'react';
import { X, Percent, DollarSign, Calendar, Tag } from 'lucide-react';

const CouponModel = ({ isOpen, onClose, onSave, editData, categories = [] }) => {
  const [formData, setFormData] = useState(editData || {
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrder: '',
    maxDiscount: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
    status: 'active',
    categories: [],
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.code.trim()) {
      newErrors.code = 'Coupon code is required';
    }
    if (!formData.discountValue || parseFloat(formData.discountValue) <= 0) {
      newErrors.discountValue = 'Discount value must be greater than 0';
    }
    if (formData.discountType === 'percentage' && parseFloat(formData.discountValue) > 100) {
      newErrors.discountValue = 'Percentage cannot exceed 100%';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minOrder: '',
        maxDiscount: '',
        usageLimit: '',
        startDate: '',
        endDate: '',
        status: 'active',
        categories: [],
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
        {/* Modal */}
        <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 animate-in zoom-in-95">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <Tag className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{editData ? 'Edit Coupon' : 'Create New Coupon'}</h2>
                  <p className="text-emerald-100 text-sm">Spice Bloom Coupon</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-white hover:bg-white/20 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Code Field */}
            <div className="group">
              <div className="relative">
                <input
                  type="text"
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className={`peer w-full rounded-lg border-2 bg-transparent px-4 py-3 text-gray-900 placeholder-transparent focus:outline-none transition-all duration-200 ${
                    errors.code 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-300 focus:border-emerald-500 hover:border-gray-400'
                  }`}
                  placeholder="Coupon Code"
                />
                <label
                  htmlFor="code"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.code 
                      ? '-top-2.5 text-xs bg-white px-1 text-emerald-600 font-medium' 
                      : 'top-3 text-gray-500 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-emerald-600 peer-focus:font-medium'
                  }`}
                >
                  Coupon Code
                </label>
              </div>
              {errors.code && <p className="mt-1 text-sm text-red-500">{errors.code}</p>}
            </div>
            {/* Description Field */}
            <div className="group">
              <div className="relative">
                <input
                  type="text"
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="peer w-full rounded-lg border-2 bg-transparent px-4 py-3 text-gray-900 placeholder-transparent focus:outline-none border-gray-300 focus:border-emerald-500 hover:border-gray-400 transition-all duration-200"
                  placeholder="Description"
                />
                <label
                  htmlFor="description"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.description 
                      ? '-top-2.5 text-xs bg-white px-1 text-emerald-600 font-medium' 
                      : 'top-3 text-gray-500 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-emerald-600 peer-focus:font-medium'
                  }`}
                >
                  Description
                </label>
              </div>
            </div>
            {/* Discount Type & Value */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <div className="relative">
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                    className="w-full appearance-none rounded-lg border-2 border-gray-300 bg-transparent px-4 py-3 pr-10 text-gray-900 focus:border-emerald-500 focus:outline-none hover:border-gray-400 transition-all duration-200"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Fixed Amount</option>
                  </select>
                  <div className="absolute right-3 top-3 flex items-center pointer-events-none">
                    {formData.discountType === 'percentage' ? (
                      <Percent className="h-5 w-5 text-gray-400" />
                    ) : (
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <label className="absolute -top-2.5 left-4 bg-white px-1 text-xs font-medium text-emerald-600">
                    Discount Type
                  </label>
                </div>
              </div>
              <div className="group">
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                    className={`peer w-full rounded-lg border-2 bg-transparent px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                      errors.discountValue 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-300 focus:border-emerald-500 hover:border-gray-400'
                    }`}
                    placeholder="0"
                  />
                  <label className="absolute -top-2.5 left-4 bg-white px-1 text-xs font-medium text-emerald-600">
                    {formData.discountType === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                  </label>
                </div>
                {errors.discountValue && <p className="mt-1 text-sm text-red-500">{errors.discountValue}</p>}
              </div>
            </div>
            {/* Min Order & Max Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrder}
                    onChange={(e) => setFormData({...formData, minOrder: e.target.value})}
                    className="w-full rounded-lg border-2 border-gray-300 bg-transparent px-4 py-3 text-gray-900 focus:border-emerald-500 focus:outline-none hover:border-gray-400 transition-all duration-200"
                    placeholder="0"
                  />
                  <label className="absolute -top-2.5 left-4 bg-white px-1 text-xs font-medium text-emerald-600">
                    Min Order (₹)
                  </label>
                </div>
              </div>
              <div className="group">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                    className="w-full rounded-lg border-2 border-gray-300 bg-transparent px-4 py-3 text-gray-900 focus:border-emerald-500 focus:outline-none hover:border-gray-400 transition-all duration-200"
                    placeholder="0"
                  />
                  <label className="absolute -top-2.5 left-4 bg-white px-1 text-xs font-medium text-emerald-600">
                    Max Discount (₹)
                  </label>
                </div>
              </div>
            </div>
            {/* Usage Limit */}
            <div className="group">
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                  className="w-full rounded-lg border-2 border-gray-300 bg-transparent px-4 py-3 text-gray-900 focus:border-emerald-500 focus:outline-none hover:border-gray-400 transition-all duration-200"
                  placeholder="1"
                />
                <label className="absolute -top-2.5 left-4 bg-white px-1 text-xs font-medium text-emerald-600">
                  Usage Limit
                </label>
              </div>
            </div>
            {/* Date Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <div className="relative">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full rounded-lg border-2 border-gray-300 bg-transparent px-4 py-3 text-gray-900 focus:border-emerald-500 focus:outline-none hover:border-gray-400 transition-all duration-200"
                  />
                  <label className="absolute -top-2.5 left-4 bg-white px-1 text-xs font-medium text-gray-500">
                    Start Date (Optional)
                  </label>
                </div>
              </div>
              <div className="group">
                <div className="relative">
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className={`w-full rounded-lg border-2 bg-transparent px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                      errors.endDate 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-300 focus:border-emerald-500 hover:border-gray-400'
                    }`}
                  />
                  <label className="absolute -top-2.5 left-4 bg-white px-1 text-xs font-medium text-emerald-600">
                    End Date
                  </label>
                </div>
                {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
              </div>
            </div>
            {/* Status */}
            <div className="group">
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full appearance-none rounded-lg border-2 border-gray-300 bg-transparent px-4 py-3 pr-10 text-gray-900 focus:border-emerald-500 focus:outline-none hover:border-gray-400 transition-all duration-200"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <label className="absolute -top-2.5 left-4 bg-white px-1 text-xs font-medium text-emerald-600">
                  Status
                </label>
              </div>
            </div>
            {/* Categories (multi-select) */}
            <div className="group">
              <div className="relative">
                <select
                  multiple
                  value={formData.categories}
                  onChange={e => setFormData({ ...formData, categories: Array.from(e.target.selectedOptions, option => option.value) })}
                  className="w-full rounded-lg border-2 border-gray-300 bg-transparent px-4 py-3 text-gray-900 focus:border-emerald-500 focus:outline-none hover:border-gray-400 transition-all duration-200"
                >
                  {categories.length === 0 ? (
                    <option disabled>No categories found</option>
                  ) : (
                    categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))
                  )}
                </select>
                <label className="absolute -top-2.5 left-4 bg-white px-1 text-xs font-medium text-emerald-600">
                  Categories (multi-select)
                </label>
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-semibold shadow hover:from-emerald-600 hover:to-emerald-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {editData ? 'Update Coupon' : 'Create Coupon'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CouponModel; 