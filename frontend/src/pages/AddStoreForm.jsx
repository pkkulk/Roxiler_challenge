

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function AddStoreForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    address: '',
    email: '',
    user_id: '', 
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/stores/add', form);
      alert('Store added successfully ✅');
      navigate('/admin');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add store');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Add New Store
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Name</label>
            <input
              name="name"
              type="text"
              placeholder="Store Name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              name="address"
              type="text"
              placeholder="Store Address"
              value={form.address}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Owner Email</label>
            <input
              name="email"
              type="email"
              placeholder="owner@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Owner ID</label>
            <input
              name="user_id"
              type="text"
              placeholder="Supabase User ID"
              value={form.user_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-md"
          >
            Add Store
          </button>
        </form>
      </div>
    </div>
  );
}