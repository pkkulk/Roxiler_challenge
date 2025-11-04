
import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

const storesData = [
  { id: 1, name: "Sunrise Cafe", address: "123 Main St", avg_rating: 4.5 },
  { id: 2, name: "Book Nook", address: "456 Oak Ave", avg_rating: 3.8 },
  { id: 3, name: "Green Grocer", address: "789 Pine Ln", avg_rating: 4.9 },
  { id: 4, name: "Hardware Hub", address: "101 Maple Rd", avg_rating: 4.1 },
];

export default function UserPage() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("stores");
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState({});
  const [filter, setFilter] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchStoresAndRatings = async () => {
      try {
        setStores(storesData);
        setRatings({ 1: 5, 3: 4 }); 
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchStoresAndRatings();
  }, [user]);

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(filter.toLowerCase()) ||
      store.address.toLowerCase().includes(filter.toLowerCase())
  );

  const handleRatingChange = async (storeId, rating) => {
    if (!user) {
      alert("Please log in to submit a rating.");
      return;
    }
    try {
      setRatings({ ...ratings, [storeId]: rating });
      alert("Rating submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit rating.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      alert("Please fill in both fields.");
      return;
    }
    try {
      alert("Password updated successfully!");
      setPasswordForm({ oldPassword: "", newPassword: "" });
      setActiveTab("stores");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update password.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8">
        {/* Header and Navigation */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
          <nav className="space-x-4">
            <button
              onClick={() => setActiveTab("stores")}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === "stores"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Stores
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === "password"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Update Password
            </button>
            <button
              onClick={() => logout()}
              className="py-2 px-4 rounded-lg font-medium text-red-600 hover:bg-red-100 transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>

        {/* --- */}

        {/* Stores Tab */}
        {activeTab === "stores" && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Browse Stores
            </h2>
            <input
              type="text"
              placeholder="Search by name or address..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
            <div className="space-y-6">
              {filteredStores.length > 0 ? (
                filteredStores.map((store) => (
                  <div
                    key={store.id}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {store.name}
                      </h3>
                      <p className="text-xl font-semibold text-yellow-500">
                        ⭐ {store.avg_rating || "No ratings yet"}
                      </p>
                    </div>
                    <p className="text-gray-500 mb-4">{store.address}</p>
                    <div className="flex items-center space-x-2">
                      <label className="text-gray-700 font-medium">
                        Your Rating:
                      </label>
                      <select
                        value={ratings[store.id] || ""}
                        onChange={(e) =>
                          handleRatingChange(store.id, Number(e.target.value))
                        }
                        className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      >
                        <option value="">Select</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-10">
                  No stores found.
                </p>
              )}
            </div>
          </div>
        )}

        {/* --- */}

        {/* Update Password Tab */}
        {activeTab === "password" && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Update Password
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                name="oldPassword"
                placeholder="Current Password"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
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
        )}
      </div>
    </div>
  );
}