import React, { useState } from 'react';
import { X, Percent, DollarSign, Calendar, Tag } from 'lucide-react';

const CreateOfferModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
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
        title: '',
        discountType: 'percentage',
        discountValue: '',
        startDate: '',
        endDate: '',
        isActive: true
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
                  <h2 className="text-xl font-bold text-white">Create New Offer</h2>
                  <p className="text-emerald-100 text-sm">Spice Bloom Special Deals</p>
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
            {/* Title Field */}
            <div className="group">
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className={`peer w-full rounded-lg border-2 bg-transparent px-4 py-3 text-gray-900 placeholder-transparent focus:outline-none transition-all duration-200 ${
                    errors.title 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-300 focus:border-emerald-500 hover:border-gray-400'
                  }`}
                  placeholder="Offer Title"
                />
                <label
                  htmlFor="title"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.title 
                      ? '-top-2.5 text-xs bg-white px-1 text-emerald-600 font-medium' 
                      : 'top-3 text-gray-500 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-emerald-600 peer-focus:font-medium'
                  }`}
                >
                  Offer Title
                </label>
              </div>
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
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

            {/* Active Toggle */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  formData.isActive ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    formData.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <label className="text-sm font-medium text-gray-700">
                Activate offer immediately
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-3 text-sm font-medium text-white hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Create Offer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOfferModal;