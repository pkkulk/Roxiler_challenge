import React, { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

export default function UpdatePassword() {
  const { user, logout } = useContext(AuthContext); // <-- Correctly get the user from context
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert("You must be logged in to update your password.");
      logout(); 
      return;
    }
    
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      await api.put(`/auth/update-password`, {
        userId: user.id, 
        ...passwordForm,
      });
      alert("Password updated successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update password.");
    }
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Update Password
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <input
            type="password"
            name="oldPassword"
            placeholder="Current Password"
            value={passwordForm.oldPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={passwordForm.newPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-md"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}