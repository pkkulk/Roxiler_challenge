import { useContext, useEffect, useState, useCallback } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import i from "../assets/image.png";

const InteractiveStars = ({ initialRating, onRate, disabled, isSaving }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const currentRating = initialRating;

  const handleStarClick = (rating) => {
    if (!disabled && !isSaving) {
      onRate(rating);
    }
  };

  const getStarColor = (starIndex) => {
    const ratingValue = hoverRating || currentRating;
    return starIndex <= ratingValue
      ? "text-yellow-500"
      : "text-gray-300 hover:text-yellow-400";
  };

  return (
    <div
      className={`flex space-x-0.5 transition-opacity ${isSaving ? 'opacity-50 cursor-wait' : ''}`}
      onMouseLeave={() => setHoverRating(0)}
    >
      {[1, 2, 3, 4, 5].map((starIndex) => (
        <svg
          key={starIndex}
          onClick={() => handleStarClick(starIndex)}
          onMouseEnter={() => setHoverRating(starIndex)}
          className={`w-7 h-7 transition-colors duration-150 ${getStarColor(starIndex)} ${disabled || isSaving ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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


export default function HomePage() {
  const { user } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingStoreId, setSavingStoreId] = useState(null);

  const fetchStores = useCallback(async (search) => {
    try {
      setLoading(true);
      const res = await api.get(`/stores/get?search=${search}`);
      setStores(res.data);
    } catch (err) {
      console.error("Error fetching stores:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStores(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchStores]);

  const handleRate = async (storeId, rating) => {
    if (!user) {
      alert("Please login to rate stores!");
      return;
    }
    
    setSavingStoreId(storeId);
    const previousRating = userRatings[storeId] || 0;

    setUserRatings((prevRatings) => ({ ...prevRatings, [storeId]: rating }));

    try {
      await api.post("/ratings", {
        store_id: storeId,
        user_id: user.id,
        rating,
      });
    } catch (err) {
      setUserRatings((prevRatings) => ({ ...prevRatings, [storeId]: previousRating }));
      console.error("Failed to submit rating:", err);
      alert(err.response?.data?.error || "Failed to submit rating. Please try again.");
    } finally {
      setSavingStoreId(null);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 font-sans antialiased pb-12"> 
      
      <section className="relative h-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white pt-24 pb-12 px-4 sm:px-8 lg:px-16 mb-12 shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-indigo-500 opacity-20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
              <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-purple-500 opacity-20 rounded-full mix-blend-multiply filter blur-xl animation-delay-2000 animate-blob"></div>
          </div>

          <div className="absolute inset-0 opacity-5 pointer-events-none">
              <p className="font-extrabold text-9xl absolute top-10 left-10 transform -rotate-12 text-indigo-400">RATING</p>
              <p className="font-extrabold text-8xl absolute bottom-20 right-20 transform rotate-12 text-purple-400">DISCOVER</p>
              <p className="font-extrabold text-7xl absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 rotate-6 text-indigo-300">GEMS</p>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left md:w-2/3">
                  <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
                      Discover & Rate Local Gems 🌟
                  </h1>
                  <p className="text-xl md:text-2xl text-indigo-100 mb-6 max-w-lg mx-auto md:mx-0">
                      Your trusted guide to finding and sharing feedback on the best stores around.
                  </p>
                  {!user && (
                      <button
                          onClick={() => (window.location.href = `/signup`)}
                          className="bg-white text-indigo-700 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-gray-100 hover:text-indigo-800 transition-all duration-300 transform hover:scale-105"
                      >
                          Get Started Now
                      </button>
                  )}

                  <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                      <div className="flex items-center gap-3">
                          <span className="flex-shrink-0 p-3 bg-purple-500 rounded-full text-white shadow-md">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                          </span>
                          <div>
                              <p className="text-xl font-bold text-white">500+ Locations</p>
                              <p className="text-indigo-200 text-sm">Always growing, always local.</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <span className="flex-shrink-0 p-3 bg-indigo-500 rounded-full text-white shadow-md">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.037 2.037L21 7.213m-2.223 9.422L13.978 20.9H9.02l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                          </span>
                          <div>
                              <p className="text-xl font-bold text-white">Thousands of Reviews</p>
                              <p className="text-indigo-200 text-sm">Trusted insights from your community.</p>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="mt-8 md:mt-0 md:w-1/3 flex justify-center items-center">
                  <img
                      src={i} 
                      size={80}
                      alt="Storefront illustration" 
                      className="w-80 h-80 md:w-80 md:h-80 object-contain drop-shadow-xl animate-float"
                  />
              </div>
          </div>
      </section>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"> 
        
        <div className="text-center mb-10 pt-4">
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-2">
                Browse Top-Rated Locations
            </h2>
            <p className="text-lg text-gray-500">
                Start your search or explore the latest rated spots below.
            </p>
        </div>

        <div className="mb-10">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input
              type="text"
              placeholder="Search stores by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-lg placeholder-gray-500 focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all shadow-md hover:shadow-lg bg-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-indigo-500 py-16 bg-white rounded-xl shadow-lg">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading amazing stores...</p>
          </div>
        ) : stores.length > 0 ? (
          <div className="space-y-6">
            {stores.map((store) => {
              const userRating = userRatings[store.id] || 0;
              const isSaving = savingStoreId === store.id;

              return (
                <div
                  key={store.id}
                  className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border-l-4 border-indigo-500/80"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div className="mb-3 md:mb-0">
                      <h3 className="text-3xl font-bold text-gray-900 leading-tight">{store.name}</h3>
                      <p className="text-gray-500 text-base mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        {store.address}
                      </p>
                    </div>

                    <div className="flex flex-col items-end bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200 min-w-[120px]">
                      <p className="text-sm font-semibold text-yellow-700">Avg. Rating</p>
                      <div className="text-3xl font-black text-yellow-800 flex items-center">
                        {parseFloat(store.avg_rating) ? parseFloat(store.avg_rating).toFixed(1) : "N/A"}
                        <span className="ml-1 text-3xl">⭐</span>
                      </div>
                    </div>
                  </div>

                  <hr className="my-4 border-t border-gray-100" />

                  {user ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 pt-2">
                      <label className="text-lg font-semibold text-gray-700 whitespace-nowrap">Your Rating:</label>

                      <InteractiveStars
                        initialRating={userRating}
                        onRate={(rating) => handleRate(store.id, rating)}
                        disabled={!user}
                        isSaving={isSaving}
                      />

                      <span className="text-sm text-indigo-600 font-medium ml-4">
                        {isSaving ? "Saving..." : userRating > 0 ? `Rated: ${userRating} stars` : 'Select a star to rate!'}
                      </span>
                    </div>
                  ) : (
                    <div className="pt-2">
                        <button
                          onClick={() => (window.location.href = `/login?redirect=/`)}
                          className="w-full sm:w-auto bg-indigo-600 text-white py-3 px-6 rounded-xl font-bold text-md hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                          Login to Rate
                        </button>
                        <p className="mt-2 text-sm text-gray-500">Log in to contribute your rating and feedback.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20 bg-white rounded-xl border-2 border-dashed border-gray-300 shadow-lg">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 19.172A4 4 0 0112 18h0c1.105 0 2 .895 2 2v2H6v-2c0-1.105.895-2 2-2h1.172zM12 14v4M12 2c-3.313 0-6 2.687-6 6s6 10 6 10 6-6.687 6-10S15.313 2 12 2z"/></svg>
            <p className="text-xl font-semibold">No stores found</p>
            <p className="mt-2">Your search **"{searchQuery}"** didn't match any stores. Try a different name!</p>
          </div>
        )}
      </div>
    </div>
  );
}