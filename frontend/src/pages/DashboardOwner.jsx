import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

export default function OwnerDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasStore, setHasStore] = useState(false);

  useEffect(() => {
    const fetchOwnerData = async () => {
      if (!user || !user.id) return;

      try {
        const res = await api.get(`/stores/owner/${user.id}`);
        setStore(res.data.store);
        setRatings(res.data.ratings);
        setHasStore(true);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setHasStore(false);
        } else {
          console.error("Failed to fetch owner data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Loading...</h2>
        <p>Fetching your store details...</p>
      </div>
    );
  }

  if (!hasStore) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">No Store Found</h2>
        <p>It looks like your account is not associated with a store yet.</p>
        <p>Please contact support or create a store to get started.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            {store.name} Dashboard
          </h1>
          <nav className="space-x-4">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === "dashboard"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Dashboard
            </button>
          </nav>
        </div>

        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Average Store Rating
            </h2>
            <div className="bg-yellow-50 p-6 rounded-lg shadow-sm text-center mb-8">
              <p className="text-sm font-medium text-yellow-600">
                Overall Rating
              </p>
              <p className="mt-1 text-5xl font-extrabold text-yellow-800">
                {parseFloat(store.avg_rating)
                  ? parseFloat(store.avg_rating).toFixed(1)
                  : "No ratings yet"}{" "}
                ⭐
              </p>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Recent Ratings
            </h2>
            <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ratings.length > 0 ? (
                    ratings.map((rating) => (
                      <tr
                        key={rating.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {rating.users ? rating.users.name : "Anonymous"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rating.rating} / 5
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No ratings available yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
