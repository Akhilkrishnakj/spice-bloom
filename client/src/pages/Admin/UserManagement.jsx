import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  Trash2, 
  ShieldCheck,  
  UserCheck, 
  UserX, 
  Search, 
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const MiniLoader = () => (
  <div className="flex justify-center items-center"><span className="inline-block h-4 w-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></span></div>
);

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [actionLoading, setActionLoading] = useState({});
  const navigate = useNavigate();

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin');
      setUsers(res.data.users);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      toast.error('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting and filtering
  const getFilteredAndSortedUsers = () => {
    const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return [...filteredUsers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Pagination logic
  const filteredUsers = getFilteredAndSortedUsers();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const firstPage = () => setCurrentPage(1);
  const lastPage = () => setCurrentPage(totalPages);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Example: toggle active (would call API in real project)
  const toggleActive = (id) => {
    setUsers(users.map(u => u._id === id ? { ...u, active: !u.active } : u));
    // TODO: Call API to update user status
  };

  // Promote to admin
  const promoteToAdmin = async (id) => {
    setActionLoading(l => ({ ...l, [id]: true }));
    try {
      await api.patch(`/admin/users/${id}/promote`);
      toast.success('User promoted to admin');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to promote user');
    } finally {
      setActionLoading(l => ({ ...l, [id]: false }));
    }
  };

  // Block/unblock user
  const toggleBlock = async (id, blocked) => {
    setActionLoading(l => ({ ...l, [id]: true }));
    try {
      await api.patch(`/admin/users/${id}/block`, { blocked: !blocked });
      toast.success(blocked ? 'User unblocked' : 'User blocked');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update block status');
    } finally {
      setActionLoading(l => ({ ...l, [id]: false }));
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        console.error('Failed to delete user:', err);
        toast.error('Failed to delete user');
      }
    }
  };

  // Render sort direction indicator
  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return (
      <span className="ml-1">
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-4 md:p-8 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb and Back Button Header */}
        <div className="w-full mb-4">
          <div className="flex items-center gap-2 md:gap-4 w-full">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <nav className="text-sm md:text-base text-emerald-500 font-medium flex items-center gap-1" aria-label="Breadcrumb">
              <span className="hover:underline cursor-pointer" onClick={() => navigate('/admin/dashboard')}>Admin Dashboard</span>
              <span className="mx-1 text-emerald-400">/</span>
              <span className="text-emerald-700 font-semibold">User Management System</span>
            </nav>
          </div>
        </div>

        <div className="bg-white/80 border border-emerald-100 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-6 border-b border-emerald-100 backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-emerald-700 tracking-tight">User Management System</h1>
                <p className="text-emerald-500 mt-1 font-medium">Manage users, roles, and access</p>
              </div>
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-emerald-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-emerald-200 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-sm text-emerald-900 placeholder-emerald-400"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center p-12"><MiniLoader /></div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-emerald-100">
                  <thead className="bg-emerald-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-emerald-700 uppercase tracking-wider cursor-pointer hover:text-emerald-900" onClick={() => requestSort('name')}>
                        <div className="flex items-center">Name<SortIndicator columnKey="name" /></div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-emerald-700 uppercase tracking-wider cursor-pointer hover:text-emerald-900" onClick={() => requestSort('email')}>
                        <div className="flex items-center">Email<SortIndicator columnKey="email" /></div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-emerald-700 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-emerald-700 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('active')}>
                        <div className="flex items-center">Status<SortIndicator columnKey="active" /></div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-emerald-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/80 divide-y divide-emerald-50">
                    {currentItems.map((user) => (
                      <tr key={user._id} className="hover:bg-emerald-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                              <span className="text-emerald-600 font-bold text-lg">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-base font-semibold text-emerald-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-base text-emerald-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-emerald-200 text-emerald-900' : 'bg-emerald-50 text-emerald-700'}`}>
                              {user.role}
                            </span>
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => promoteToAdmin(user._id)}
                                className="ml-2 px-2 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 text-white text-xs font-semibold shadow hover:from-emerald-500 hover:to-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 flex items-center gap-1"
                                disabled={actionLoading[user._id]}
                                title="Promote to Admin"
                              >
                                {actionLoading[user._id] ? <MiniLoader /> : <ShieldCheck className="h-4 w-4" />}
                                Promote
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${user.active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {user.active ? 'Active' : 'Inactive'}
                            </span>
                            <button
                              onClick={() => toggleBlock(user._id, user.blocked)}
                              className={`px-2 py-1 rounded-full ${user.blocked ? 'bg-emerald-200 text-emerald-900' : 'bg-red-100 text-red-700'} text-xs font-semibold shadow hover:bg-red-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 flex items-center gap-1`}
                              disabled={actionLoading[user._id]}
                              title={user.blocked ? 'Unblock User' : 'Block User'}
                            >
                              {actionLoading[user._id] ? <MiniLoader /> : user.blocked ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                              {user.blocked ? 'Unblock' : 'Block'}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => toggleActive(user._id)}
                              className="text-emerald-600 hover:text-emerald-900 p-1.5 rounded-full hover:bg-emerald-50 transition-colors"
                              title={user.active ? 'Deactivate User' : 'Activate User'}
                            >
                              {user.active ? (
                                <UserX className="h-4 w-4" />
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="text-red-600 hover:text-white p-1.5 rounded-full hover:bg-red-500 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="text-emerald-400">
                            <p className="text-lg font-medium">No users found</p>
                            <p className="text-sm mt-1">
                              {searchTerm ? 'Try adjusting your search' : 'Add a new user to get started'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                {filteredUsers.length > itemsPerPage && (
                  <div className="bg-white/80 px-6 py-3 flex items-center justify-between border-t border-emerald-100">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-emerald-200 text-sm font-medium rounded-md text-emerald-700 bg-white hover:bg-emerald-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-emerald-200 text-sm font-medium rounded-md text-emerald-700 bg-white hover:bg-emerald-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-emerald-700">
                          Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                          <span className="font-medium">{Math.min(indexOfLastItem, filteredUsers.length)}</span> of <span className="font-medium">{filteredUsers.length}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={firstPage}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-emerald-200 bg-white text-sm font-medium text-emerald-500 hover:bg-emerald-50 disabled:opacity-50"
                            title="First Page"
                          >
                            <span className="sr-only">First</span>
                            <ChevronsLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 border border-emerald-200 bg-white text-sm font-medium text-emerald-500 hover:bg-emerald-50 disabled:opacity-50"
                            title="Previous"
                          >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          
                          {/* Page numbers */}
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
                                    ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-700'
                                    : 'bg-white border-emerald-200 text-emerald-500 hover:bg-emerald-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          
                          <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 border border-emerald-200 bg-white text-sm font-medium text-emerald-500 hover:bg-emerald-50 disabled:opacity-50"
                            title="Next"
                          >
                            <span className="sr-only">Next</span>
                            <ChevronRight className="h-4 w-4" />
                          </button>
                          <button
                            onClick={lastPage}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-emerald-200 bg-white text-sm font-medium text-emerald-500 hover:bg-emerald-50 disabled:opacity-50"
                            title="Last Page"
                          >
                            <span className="sr-only">Last</span>
                            <ChevronsRight className="h-4 w-4" />
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
    </div>
  );
};

export default UserManagement;
