import React, { useEffect, useState } from 'react';
import {
  Trash2,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { getOffers, createOffer, deleteOffer, updateOffer } from "../../services/offerService";
import { toast } from 'react-toastify';
import OfferModel from './OfferModel'
const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editOffer, setEditOffer] = useState(null);

  const loadOffers = async () => {
    try {
      setIsLoading(true);
      const res = await getOffers();
      setOffers(res.data.offers);
    } catch (error) {
      console.error("Error loading offers:", error);
      toast.error("Failed to load offers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

const handleCreate = async (formData) => {
  try {
    await createOffer(formData);
    toast.success("Offer created successfully!");
    await loadOffers();
    setShowCreateModal(false);
  } catch (error) {
    console.error("Error creating offer:", error);
    toast.error("Failed to create offer");
  }
};

const handleUpdate = async (formData) => {
  if (!editOffer) return; 
try {
    await updateOffer(editOffer._id, formData);
    toast.success("Offer updated successfully!");
    await loadOffers();
    setEditOffer(null);
    setShowCreateModal(false);
  } catch (error) {
    console.error("Error updating offer:", error);
    toast.error("Failed to update offer");
  }
};


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        setIsDeleting(true);
        await deleteOffer(id);
        await loadOffers();
        toast.success("Offer deleted successfully!");
      } catch (error) {
        console.error("Error deleting offer:", error);
        toast.error("Failed to delete offer");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'active' && offer.status === 'active') ||
      (filterStatus === 'inactive' && offer.status === 'inactive');
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Offer Management</h1>
          <p className="text-gray-600">Manage your offers</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-1"
          >
            <Plus size={18} /> New Offer
          </button>
          <button 
            onClick={loadOffers}
            disabled={isLoading}
            className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-1"
          >
            <RefreshCw className={isLoading ? 'animate-spin' : ''} size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* Search and filter */}
      <div className="flex gap-2 mb-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search offers..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg"
          />
        </div>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg py-2 px-3"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Offer list */}
      {isLoading ? (
        <p>Loading offers...</p>
      ) : filteredOffers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOffers.map(offer => (
            <div key={offer._id} className="p-4 border rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-lg">{offer.title}</h2>
                <span className="text-sm rounded-full px-2 py-0.5 bg-green-100 text-green-700">
                  {offer.discountType === 'percentage' 
                    ? `${offer.discountValue}% OFF`
                    : `₹${offer.discountValue} OFF`}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                Products: {offer.products?.map(p => p.name).join(', ') || 'All'}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Valid Until: {formatDate(offer.endDate)}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                Status: {offer.status}
              </p>
              <div className="flex gap-2">
               <button 
                 onClick={() => {
                  setEditOffer(offer);        // Set the offer to edit
                   setShowCreateModal(true);   // Open the form modal
                              }}
                       className="text-blue-600 hover:underline text-sm"
                      >
                         Edit
                 </button>

                <button 
                  onClick={() => handleDelete(offer._id)}
                  disabled={isDeleting}
                  className="text-red-600 hover:underline text-sm"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No offers found</p>
      )}

      {/* Create offer modal */}
      <OfferModel
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={editOffer ? handleUpdate : handleCreate}
      />
    </div>
  );
};

export default OfferManagement;
