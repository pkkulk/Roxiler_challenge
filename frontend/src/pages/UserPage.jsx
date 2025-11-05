import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle, FaStar, FaLock, FaSignOutAlt, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

// ===================================================================
// 1. HELPER COMPONENT: InteractiveStars (Reused from HomePage)
// ===================================================================
const InteractiveStars = ({ initialRating, onRate, disabled }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const currentRating = initialRating;

  const handleStarClick = (rating) => {
    if (!disabled) {
      onRate(rating);
    }
  };

  const getStarColor = (starIndex) => {
    const ratingValue = hoverRating || currentRating;
    return starIndex <= ratingValue
      ? "text-yellow-500" // Filled color
      : "text-gray-300 hover:text-yellow-400"; // Unfilled/Hover color
  };

  return (
    <div
      className="flex space-x-0.5"
      onMouseLeave={() => setHoverRating(0)}
    >
      {[1, 2, 3, 4, 5].map((starIndex) => (
        <svg
          key={starIndex}
          onClick={() => handleStarClick(starIndex)}
          onMouseEnter={() => setHoverRating(starIndex)}
          className={`w-6 h-6 transition-colors duration-150 ${getStarColor(starIndex)} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={starIndex <= currentRating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
};

// ===================================================================
// DUMMY DATA (Remove this when connecting to your API)
// ===================================================================
const storesData = [
  { id: 1, name: "Sunrise Cafe", address: "123 Main St", avg_rating: 4.5 },
  { id: 2, name: "Book Nook", address: "456 Oak Ave", avg_rating: 3.8 },
  { id: 3, name: "Green Grocer", address: "789 Pine Ln", avg_rating: 4.9 },
  { id: 4, name: "Hardware Hub", address: "101 Maple Rd", avg_rating: 4.1 },
];
// ===================================================================


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
    // Simulate fetching data for the user's view
    const fetchStoresAndRatings = async () => {
      try {
        // Replace with actual API call: const storesRes = await api.get('/stores');
        setStores(storesData); 
        // Replace with actual API call to get user's past ratings
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
      // Optimistic update
      setRatings({ ...ratings, [storeId]: rating });
      // Replace with actual API call: await api.post('/ratings', { store_id: storeId, rating });
      
      // Removed alert for smoother UX
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit rating.");
      // Revert optimistic update on failure if needed
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      alert("Please fill in both fields.");
      return;
    }
    try {
      // Replace with actual API call: await api.post('/auth/update-password', passwordForm);
      alert("Password updated successfully!");
      setPasswordForm({ oldPassword: "", newPassword: "" });
      setActiveTab("stores");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update password.");
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header and Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-6 bg-white shadow-lg rounded-xl">
          <div className="flex items-center gap-3  md:mb-0">
            <FaUserCircle size={40} className="text-indigo-600" />
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome, {user?.name || "User"}
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("stores")}
              className={`py-2 px-4 rounded-xl font-semibold transition-all shadow-md ${
                activeTab === "stores"
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "text-gray-700 bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <FaStar className="inline mr-2" /> Browse & Rate
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`py-2 px-4 rounded-xl font-semibold transition-all shadow-md ${
                activeTab === "password"
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "text-gray-700 bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <FaLock className="inline mr-2" /> Update Password
            </button>
            <button
              onClick={logout}
              className="py-2 px-4 rounded-xl font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors shadow-md"
            >
              <FaSignOutAlt className="inline mr-2" /> Logout
            </button>
          </div>
        </div>

        {/* --- Main Content Area --- */}
        <div className="bg-white p-6 sm:p-10 shadow-2xl rounded-xl">
            
          {/* Stores Tab Content */}
          {activeTab === "stores" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Discover Local Stores
              </h2>
              
              <div className="relative mb-8">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stores by name or address..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-lg placeholder-gray-500 focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all shadow-md"
                />
              </div>

              <div className="space-y-6">
                {filteredStores.length > 0 ? (
                  filteredStores.map((store) => (
                    <div
                      key={store.id}
                      className="bg-gray-50 p-6 rounded-xl shadow-lg border-l-4 border-indigo-500/80 hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <div className="mb-2 sm:mb-0">
                          <h3 className="text-2xl font-bold text-gray-800">
                            {store.name}
                          </h3>
                          <p className="text-gray-500 text-base mt-1 flex items-center">
                            <FaMapMarkerAlt size={14} className="mr-2 text-gray-400" />
                            {store.address}
                          </p>
                        </div>
                        
                        {/* Overall Rating Display */}
                        <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                          <FaStar className="text-yellow-600" />
                          <span className="text-lg font-extrabold text-yellow-800">
                            {store.avg_rating ? store.avg_rating.toFixed(1) : "N/A"}
                          </span>
                        </div>
                      </div>
                      
                      <hr className="my-4 border-t border-gray-100" />

                      {/* User Rating Interaction (Interactive Stars) */}
                      <div className="flex items-center space-x-4 pt-2">
                        <label className="text-lg font-semibold text-gray-700 whitespace-nowrap">
                          Your Rating:
                        </label>
                        <InteractiveStars
                          initialRating={ratings[store.id] || 0}
                          onRate={(rating) => handleRatingChange(store.id, rating)}
                          disabled={!user}
                        />
                        <span className="text-sm text-indigo-600 font-medium ml-4">
                            {ratings[store.id] ? `Rated: ${ratings[store.id]} stars` : 'Select a star to rate!'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      <p className="text-lg">No stores found matching your search.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Update Password Tab Content */}
          {activeTab === "password" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Update Your Account Password
              </h2>
              <form onSubmit={handlePasswordChange} className="space-y-6 max-w-lg mx-auto p-8 bg-purple-50 rounded-xl shadow-inner border border-purple-200">
                <input
                  type="password"
                  name="oldPassword"
                  placeholder="Current Password"
                  value={passwordForm.oldPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all shadow-sm"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all shadow-sm"
                />
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 transform hover:scale-[1.01]"
                >
                  Save New Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}