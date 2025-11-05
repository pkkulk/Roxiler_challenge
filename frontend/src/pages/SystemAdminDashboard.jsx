import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { FaUsers, FaStore, FaStar, FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { MdOutlineStorefront, MdAdminPanelSettings } from 'react-icons/md';

const SystemAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [filter, setFilter] = useState('');
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingStores, setLoadingStores] = useState(true);

  // Function to calculate total ratings (assuming stores contain an array of ratings or a count)
  const getTotalRatings = useCallback(() => {
    // NOTE: Replace '150' with actual logic to sum ratings count from store data if available
    return 150; 
  }, []); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/auth/all');
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchStores = async () => {
      try {
        const res = await api.get('/stores/all');
        setStores(res.data.map(store => ({
          ...store,
          // Placeholder for owner info needed for the table. Adjust API call as necessary.
          ownerEmail: 'owner@example.com' 
        })));
      } catch (err) {
        console.error("Failed to fetch stores:", err);
      } finally {
        setLoadingStores(false);
      }
    };
    
    fetchUsers();
    fetchStores();
  }, []);

  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      String(value).toLowerCase().includes(filter.toLowerCase())
    )
  );

  const filteredStores = stores.filter(store =>
    Object.values(store).some(value =>
      String(value).toLowerCase().includes(filter.toLowerCase())
    )
  );

  const DashboardOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* Total Users Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-600 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-gray-500">Total Users</p>
          <p className="mt-1 text-4xl font-extrabold text-indigo-800">{users.length}</p>
        </div>
        <FaUsers size={40} className="text-indigo-400 opacity-60" />
      </div>
      
      {/* Total Stores Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-purple-600 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-gray-500">Total Stores</p>
          <p className="mt-1 text-4xl font-extrabold text-purple-800">{stores.length}</p>
        </div>
        <MdOutlineStorefront size={45} className="text-purple-400 opacity-60" />
      </div>

      {/* Submitted Ratings Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-yellow-500 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-gray-500">Submitted Ratings</p>
          <p className="mt-1 text-4xl font-extrabold text-yellow-700">{getTotalRatings()}</p>
        </div>
        <FaStar size={40} className="text-yellow-500 opacity-60" />
      </div>
    </div>
  );

  const LoadingState = () => (
    <div className="text-center text-gray-500 py-12 bg-white rounded-xl shadow-lg">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto mb-4"></div>
      <p className="text-lg">Loading dashboard data...</p>
    </div>
  );

  const UserTable = () => (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MdAdminPanelSettings size={28} className="text-indigo-600" /> User Management
      </h2>
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-1/3">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Filter users by name, email, role..."
            className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <Link 
          to="/admin/add-user" 
          className="flex items-center gap-2 text-center bg-indigo-600 text-white py-2.5 px-6 rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition-colors transform hover:scale-[1.02]"
        >
          <FaPlus /> Add New User
        </Link>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-indigo-800 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left font-semibold text-indigo-800 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left font-semibold text-indigo-800 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left font-semibold text-indigo-800 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left font-semibold text-indigo-800 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.address || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'owner' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <button className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors">
                    <FaEdit size={16} />
                  </button>
                  <button className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors">
                    <FaTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const StoreTable = () => (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MdOutlineStorefront size={28} className="text-purple-600" /> Store Management
      </h2>
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-1/3">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Filter stores by name, address, owner..."
            className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <Link 
          to="/admin/add-store" 
          className="flex items-center gap-2 text-center bg-purple-600 text-white py-2.5 px-6 rounded-xl font-semibold shadow-md hover:bg-purple-700 transition-colors transform hover:scale-[1.02]"
        >
          <FaPlus /> Add New Store
        </Link>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-purple-50">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-purple-800 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left font-semibold text-purple-800 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left font-semibold text-purple-800 uppercase tracking-wider">Owner Email</th>
              <th className="px-6 py-3 text-left font-semibold text-purple-800 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left font-semibold text-purple-800 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredStores.map(store => (
              <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{store.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{store.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{store.ownerEmail}</td>
                <td className="px-6 py-4 whitespace-nowrap text-yellow-700 font-bold">{store.rating || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <button className="text-purple-600 hover:text-purple-900 p-1 rounded-full hover:bg-purple-50 transition-colors">
                    <FaEdit size={16} />
                  </button>
                  <button className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors">
                    <FaTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  return (
    <div className="min-h-screen font-sans">
      <div className="max-w-full 2xl:max-w-8xl mx-auto"> {/* Wider content area for admin */}
        
        {/* Main Content Area */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 sm:p-8 border-b border-gray-100">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Control Panel</h1>
            <nav className="flex gap-2 bg-gray-100 p-1 rounded-xl shadow-inner">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-4 rounded-lg font-semibold transition-all shadow-sm ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-white'}`}
              >
                <FaUsers className="inline mr-2" /> User Accounts
              </button>
              <button
                onClick={() => setActiveTab('stores')}
                className={`py-2 px-4 rounded-lg font-semibold transition-all shadow-sm ${activeTab === 'stores' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-700 hover:bg-white'}`}
              >
                <MdOutlineStorefront className="inline mr-2" /> Store Listings
              </button>
            </nav>
          </header>

          <main className="p-4 sm:p-8">
            {/* Overview Stats are always visible */}
            <DashboardOverview />

            {/* Content Switcher */}
            {loadingUsers || loadingStores ? (
              <LoadingState />
            ) : (
              activeTab === 'users' ? <UserTable /> : <StoreTable />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SystemAdminDashboard;