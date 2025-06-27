import React, { useEffect, useState } from 'react';
import {
  Trash2,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { getOffers, createOffer, deleteOffer, updateOffer, getCoupons, createCoupon, deleteCoupon, updateCoupon } from "../../services/offerService";
import { toast } from 'react-toastify';
import OfferModel from './OfferModel'
import CouponModel from './CouponModel'
import { getAllCategories } from '../../api/category';

const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editOffer, setEditOffer] = useState(null);
  const [activeTab, setActiveTab] = useState('offers'); // UI only
  const [coupons, setCoupons] = useState([]);
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [isCouponDeleting, setIsCouponDeleting] = useState(false);
  const [categories, setCategories] = useState([]);

  // Debug: log categories to check if they are fetched
  console.log('Categories fetched for CouponModel:', categories);

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

  const loadCoupons = async () => {
    try {
      setIsCouponLoading(true);
      const res = await getCoupons();
      setCoupons(res.data.coupons);
    } catch (error) {
      console.error("Error loading coupons:", error);
      toast.error("Failed to load coupons");
    } finally {
      setIsCouponLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'offers') loadOffers();
    else loadCoupons();
    // eslint-disable-next-line
  }, [activeTab]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        console.log("Category API response:", res.data);
        setCategories(res.data.category || []);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
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

  const handleCreateCoupon = async (formData) => {
    try {
      await createCoupon(formData);
      toast.success("Coupon created successfully!");
      await loadCoupons();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast.error("Failed to create coupon");
    }
  };

  const handleUpdateCoupon = async (formData) => {
    if (!editOffer) return;
    try {
      await updateCoupon(editOffer._id, formData);
      toast.success("Coupon updated successfully!");
      await loadCoupons();
      setEditOffer(null);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error updating coupon:", error);
      toast.error("Failed to update coupon");
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        setIsCouponDeleting(true);
        await deleteCoupon(id);
        await loadCoupons();
        toast.success("Coupon deleted successfully!");
      } catch (error) {
        console.error("Error deleting coupon:", error);
        toast.error("Failed to delete coupon");
      } finally {
        setIsCouponDeleting(false);
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-4 md:p-8 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto">
        {/* Glassy Card for Tabs, Header, Actions */}
        <div className="bg-white/80 border border-emerald-100 rounded-2xl shadow-lg px-6 py-6 mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex gap-2">
            <button
              className={`px-6 py-2 rounded-full font-semibold shadow transition-all duration-200 text-emerald-700 bg-white/80 border border-emerald-100 backdrop-blur-md ${activeTab === 'offers' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white' : 'hover:bg-emerald-50'}`}
              onClick={() => setActiveTab('offers')}
            >
              Offers
            </button>
            <button
              className={`px-6 py-2 rounded-full font-semibold shadow transition-all duration-200 text-emerald-700 bg-white/80 border border-emerald-100 backdrop-blur-md ${activeTab === 'coupons' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white' : 'hover:bg-emerald-50'}`}
              onClick={() => setActiveTab('coupons')}
            >
              Coupons
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-emerald-700 tracking-tight mb-1">{activeTab === 'offers' ? 'Offer Management' : 'Coupon Management'}</h1>
            <p className="text-emerald-500 font-medium">Manage your {activeTab === 'offers' ? 'offers' : 'coupons'} and categories</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-1 font-semibold shadow hover:from-emerald-600 hover:to-emerald-800 transition-all duration-200"
            >
              <Plus size={18} /> {activeTab === 'offers' ? 'New Offer' : 'New Coupon'}
            </button>
            <button 
              onClick={activeTab === 'offers' ? loadOffers : loadCoupons}
              disabled={activeTab === 'offers' ? isLoading : isCouponLoading}
              className="bg-white/80 border border-emerald-100 px-4 py-2 rounded-lg flex items-center gap-1 text-emerald-700 font-semibold shadow hover:bg-emerald-50 transition-all duration-200"
            >
              <RefreshCw className={(activeTab === 'offers' ? isLoading : isCouponLoading) ? 'animate-spin' : ''} size={18} /> Refresh
            </button>
          </div>
        </div>
        {/* Search and filter */}
        <div className="flex gap-2 mb-6">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${activeTab === 'offers' ? 'offers' : 'coupons'}...`}
              className="w-full pl-9 pr-3 py-2 border border-emerald-200 rounded-lg bg-white/80 text-emerald-900 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-emerald-200 rounded-lg py-2 px-3 bg-white/80 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        {/* Content Grid */}
        {activeTab === 'offers' ? (
          isLoading ? (
            <p className="text-emerald-400 font-semibold">Loading offers...</p>
          ) : filteredOffers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredOffers.map(offer => (
                <div key={offer._id} className="p-5 border border-emerald-100 rounded-2xl shadow-lg bg-white/80 backdrop-blur-md">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-bold text-lg text-emerald-700">{offer.title}</h2>
                    <span className="text-sm rounded-full px-2 py-0.5 bg-emerald-100 text-emerald-700 font-semibold">
                      {offer.discountType === 'percentage' 
                        ? `${offer.discountValue}% OFF`
                        : `₹${offer.discountValue} OFF`}
                    </span>
                  </div>
                  <p className="text-sm text-emerald-700 mb-1">
                    Products: {offer.products?.map(p => p.name).join(', ') || 'All'}
                  </p>
                  <p className="text-sm text-emerald-700 mb-1">
                    Categories: {offer.categories?.map(c => c.name).join(', ') || 'All'}
                  </p>
                  <p className="text-sm text-emerald-700 mb-1">
                    Valid Until: {formatDate(offer.endDate)}
                  </p>
                  <p className="text-sm text-emerald-500 mb-3">
                    Status: {offer.status}
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditOffer(offer);
                        setShowCreateModal(true);
                      }}
                      className="text-emerald-600 hover:underline text-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(offer._id)}
                      disabled={isDeleting}
                      className="text-red-600 hover:underline text-sm font-semibold"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-emerald-400 font-semibold">No offers found</p>
          )
        ) : (
          isCouponLoading ? (
            <p className="text-emerald-400 font-semibold">Loading coupons...</p>
          ) : coupons.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {coupons.map(coupon => (
                <div key={coupon._id} className="p-5 border border-emerald-100 rounded-2xl shadow-lg bg-white/80 backdrop-blur-md">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-bold text-lg text-emerald-700">{coupon.code}</h2>
                    <span className="text-sm rounded-full px-2 py-0.5 bg-emerald-100 text-emerald-700 font-semibold">
                      {coupon.discountType === 'percentage' 
                        ? `${coupon.discountValue}% OFF`
                        : `₹${coupon.discountValue} OFF`}
                    </span>
                  </div>
                  <p className="text-sm text-emerald-700 mb-1">
                    Categories: {coupon.categories?.map(c => c.name).join(', ') || 'All'}
                  </p>
                  <p className="text-sm text-emerald-700 mb-1">
                    Valid Until: {formatDate(coupon.endDate)}
                  </p>
                  <p className="text-sm text-emerald-500 mb-3">
                    Status: {coupon.status}
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditOffer(coupon);
                        setShowCreateModal(true);
                      }}
                      className="text-emerald-600 hover:underline text-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteCoupon(coupon._id)}
                      disabled={isCouponDeleting}
                      className="text-red-600 hover:underline text-sm font-semibold"
                    >
                      {isCouponDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-emerald-400 font-semibold">No coupons found</p>
          )
        )}
        {/* Create/Edit Modal (pass correct handlers/props) */}
        {activeTab === 'offers' ? (
          <OfferModel
            isOpen={showCreateModal}
            onClose={() => { setShowCreateModal(false); setEditOffer(null); }}
            onSave={editOffer ? handleUpdate : handleCreate}
            type={activeTab}
            editData={editOffer}
          />
        ) : (
          <CouponModel
            isOpen={showCreateModal}
            onClose={() => { setShowCreateModal(false); setEditOffer(null); }}
            onSave={editOffer ? handleUpdateCoupon : handleCreateCoupon}
            editData={editOffer}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
};

export default OfferManagement;
