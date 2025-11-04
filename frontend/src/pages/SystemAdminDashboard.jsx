import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const SystemAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [filter, setFilter] = useState('');
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingStores, setLoadingStores] = useState(true);

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
        setStores(res.data);
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div className="bg-blue-50 p-4 sm:p-6 rounded-lg shadow-sm text-center">
        <p className="text-xs sm:text-sm font-medium text-blue-600">Total Users</p>
        <p className="mt-1 text-2xl sm:text-4xl font-extrabold text-blue-800">{users.length}</p>
      </div>
      <div className="bg-green-50 p-4 sm:p-6 rounded-lg shadow-sm text-center">
        <p className="text-xs sm:text-sm font-medium text-green-600">Total Stores</p>
        <p className="mt-1 text-2xl sm:text-4xl font-extrabold text-green-800">{stores.length}</p>
      </div>
      <div className="bg-yellow-50 p-4 sm:p-6 rounded-lg shadow-sm text-center">
        <p className="text-xs sm:text-sm font-medium text-yellow-600">Submitted Ratings</p>
        <p className="mt-1 text-2xl sm:text-4xl font-extrabold text-yellow-800">150</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-full sm:max-w-7xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <nav className="flex gap-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('stores')}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${activeTab === 'stores' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              Stores
            </button>
          </nav>
        </header>

        <main className="p-4 sm:p-8 text-sm sm:text-base">
          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">User Management</h2>
              {loadingUsers || loadingStores ? (
                <div className="text-center text-gray-500 py-6">
                  <p>Loading dashboard data...</p>
                </div>
              ) : (
                <>
                  <DashboardOverview />
                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4">
                    <input
                      type="text"
                      placeholder="Filter users..."
                      className="px-3 py-2 border border-gray-300 rounded-lg w-full sm:w-1/3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    />
                    <Link to="/admin/add-user" className="text-center bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                      Add User
                    </Link>
                  </div>
                  <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Name</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Email</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Address</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Role</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Rating</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map(user => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-2 whitespace-nowrap">{user.name}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{user.email}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{user.address}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{user.role}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{user.role === 'Store Owner' ? user.rating : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'stores' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Store Management</h2>
              {loadingUsers || loadingStores ? (
                <div className="text-center text-gray-500 py-6">
                  <p>Loading dashboard data...</p>
                </div>
              ) : (
                <>
                  <DashboardOverview />
                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4">
                    <input
                      type="text"
                      placeholder="Filter stores..."
                      className="px-3 py-2 border border-gray-300 rounded-lg w-full sm:w-1/3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    />
                    <Link to="/admin/add-store" className="text-center bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                      Add Store
                    </Link>
                  </div>
                  <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Name</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Email</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Address</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Rating</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStores.map(store => (
                          <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-2 whitespace-nowrap">{store.name}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{store.email}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{store.address}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{store.rating}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SystemAdminDashboard;
