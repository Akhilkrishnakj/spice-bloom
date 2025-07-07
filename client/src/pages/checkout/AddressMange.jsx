import React, { useEffect, useState, useCallback } from 'react';
import {
  MapPin, Plus, Check, Home, Building, Star, Trash2, Circle
} from 'lucide-react';
import {
  fetchAddresses,
  createAddress,
  deleteAddress,
} from '../../api/adress';

const AddressManager = ({
  onAddressSelect,
  selectedAddressId,
  formData,
  onFormDataChange
}) => {
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const loadSavedAddresses = useCallback(async () => {
    try {
      const { data } = await fetchAddresses();
      setSavedAddresses(data);

      // Auto-select first address if none selected and there's only one address
      if (data.length > 0 && !selectedAddressId) {
        onAddressSelect(data[0]);
        onFormDataChange({
          ...formData,
          firstName: data[0].firstName,
          lastName: data[0].lastName,
          phone: data[0].phone,
          address: data[0].address,
          email: data[0].email,
          city: data[0].city,
          state: data[0].state,
          zipCode: data[0].zipCode,
          country: data[0].country
        });
      }
    } catch (err) {
      console.error('Error loading addresses:', err);
    }
  }, [onAddressSelect, onFormDataChange, formData, selectedAddressId]);

  useEffect(() => {
    loadSavedAddresses();
  }, [loadSavedAddresses]);

  const getAddressIcon = (type) => {
    switch (type) {
      case 'home': return Home;
      case 'work': return Building;
      default: return MapPin;
    }
  };

  const handleAddressSelect = (address) => {
    console.log('Selected address:', address);
    onAddressSelect(address);
    onFormDataChange({
      ...formData,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      address: address.address,
      email: address.email,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      if (/^\d{0,10}$/.test(value)) {
        onFormDataChange({ ...formData, [name]: value });
      }
      return;
    }

    onFormDataChange({ ...formData, [name]: value });
  };

  const handleSaveNewAddress = async () => {
    const {
      firstName, lastName, phone, email, address, city, state, zipCode, country
    } = formData;

    if (firstName && lastName && email && address && city) {
      try {
        await createAddress({
          type: 'other',
          firstName,
          lastName,
          phone,
          email,
          address,
          city,
          state,
          zipCode,
          country: country || 'India'
        });
        setShowAddForm(false);
        loadSavedAddresses();
      } catch (err) {
        console.error('Error saving address:', err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteAddress(id);
        loadSavedAddresses();
      } catch (err) {
        console.error("Error deleting address:", err);
      }
    }
  };

  const handleNewAddress = () => {
    setShowAddForm(true);
    onAddressSelect(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mr-4 shadow">
          <MapPin className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
          <p className="text-gray-600">Choose from saved addresses or add a new one</p>
        </div>
      </div>

      {/* Saved Address Cards */}
      {savedAddresses.length > 0 && !showAddForm && (
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Star className="w-5 h-5 text-amber-500 mr-2 fill-current" />
            Your Saved Addresses
          </h3>

          {savedAddresses.map((address) => {
            const IconComponent = getAddressIcon(address.type);
            const isSelected = selectedAddressId === address._id;

            return (
              <div
                key={address._id}
                onClick={() => handleAddressSelect(address)}
                className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-500 ease-in-out transform ${
                  isSelected
                    ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 shadow-xl ring-4 ring-green-200 ring-opacity-50 scale-[1.02] animate-pulse'
                    : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-lg hover:scale-[1.01] hover:bg-green-25'
                }`}
                style={{
                  background: isSelected 
                    ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' 
                    : 'white'
                }}
              >
                {/* Radio Button Style Selector */}
                <div className="absolute top-4 right-4">
                  <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    isSelected 
                      ? 'border-green-500 bg-green-500 shadow-lg' 
                      : 'border-gray-300 bg-white hover:border-green-400'
                  }`}>
                    {isSelected ? (
                      <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                    ) : (
                      <Circle className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="flex items-start justify-between pr-10">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 ${
                      isSelected 
                        ? 'bg-green-500 shadow-lg transform scale-110' 
                        : 'bg-gray-100 hover:bg-green-100'
                    }`}>
                      <IconComponent className={`w-6 h-6 transition-colors duration-300 ${
                        isSelected ? 'text-white' : 'text-gray-700'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className={`text-lg font-semibold transition-colors duration-300 ${
                          isSelected ? 'text-green-800' : 'text-gray-900'
                        }`}>
                          {address.firstName} {address.lastName}
                        </p>
                        {isSelected && (
                          <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-fade-in">
                            <Check className="w-3 h-3" />
                            Selected
                          </div>
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                        isSelected ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {address.address}, {address.city}, {address.state} - {address.zipCode}
                        <br />
                        <span className="font-medium">Phone:</span> {address.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(address._id);
                  }}
                  className="absolute bottom-4 right-4 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Selected Border Glow Effect */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 to-green-600 opacity-20 animate-pulse pointer-events-none"></div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Address Button */}
      {!showAddForm && (
        <button
          onClick={handleNewAddress}
          className="w-full p-6 border-2 border-dashed border-green-300 rounded-2xl text-green-600 hover:border-green-400 hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-2 font-medium hover:scale-[1.01] hover:shadow-md"
        >
          <Plus className="w-6 h-6" />
          Add New Address
        </button>
      )}

      {/* Add Address Form */}
      {showAddForm && (
        <div className="space-y-6 bg-green-50 p-6 rounded-2xl border border-green-100 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">Add New Address</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-all duration-200"
            >
              Cancel
            </button>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-2 gap-6">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className="p-4 border rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="p-4 border rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
            />
          </div>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone"
            className="w-full p-4 border rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Street Address"
            className="w-full p-4 border rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
          />
           <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full p-4 border rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
          />
          <div className="grid grid-cols-3 gap-6">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City"
              className="p-4 border rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
            />
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="State"
              className="p-4 border rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
            />
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder="PIN Code"
              className="p-4 border rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
            />
          </div>

          <button
            onClick={handleSaveNewAddress}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
          >
            Save Address
          </button>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddressManager;
