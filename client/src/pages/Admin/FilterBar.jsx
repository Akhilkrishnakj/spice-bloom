import React from 'react';
import { Search, X } from 'lucide-react';
import { getDateDaysAgo, getTodaysDate } from './utils/dataUtils';

const FilterBar = ({ filters, setFilters }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      startDate: '',
      endDate: ''
    });
  };

  const setDateRange = (days) => {
    const startDate = getDateDaysAgo(days);
    const endDate = getTodaysDate();
    setFilters(prev => ({ ...prev, startDate, endDate }));
  };

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.startDate || filters.endDate;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="lg:w-48">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="flex gap-2">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Start date"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="End date"
          />
        </div>
      </div>

      {/* Quick Date Filters & Clear */}
      <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDateRange(7)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Last 7 days
          </button>
          <button
            onClick={() => setDateRange(30)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Last 30 days
          </button>
          <button
            onClick={() => setDateRange(90)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Last 90 days
          </button>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;