import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle, FaStore, FaChartLine, FaKey, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dashboardLink =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "owner"
      ? "/owner"
      : "/user";

  return (
    // NAVBAR: Transparent background (no bg-color class) and white text
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 transition-colors duration-300">
      
      {/* Logo/Brand Name: White text for visibility against the purple hero */}
      <Link to="/" className="text-2xl font-extrabold flex items-center gap-1.5 text-white hover:text-indigo-200 transition-colors">
        <FaStore size={22} className="text-white" />
        Store Rate Hub
      </Link>

      {/* Navigation Links and User Menu */}
      <div className="flex items-center gap-6">
        {!user ? (
          <>
            {/* Login Link: White text */}
            <Link 
              to="/login" 
              className="font-medium text-lg text-white hover:text-indigo-200 transition-colors"
            >
              Login
            </Link>
            {/* Signup Button: Retains the purple accent with white background for contrast */}
            <Link 
              to="/signup" 
              className="bg-white text-purple-600 px-5 py-2 rounded-lg font-bold shadow-lg hover:bg-gray-100 transition-colors"
            >
              Signup
            </Link>
          </>
        ) : (
          <div className="relative">
            {/* User Button: White icon for contrast */}
            <button
              className="flex items-center gap-2 focus:outline-none p-1 rounded-full border-2 border-transparent hover:border-white transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="user-menu"
            >
              <FaUserCircle size={30} className="text-white" />
            </button>

            {menuOpen && (
              // Dropdown Menu: Needs to remain white with dark text/icons
              <div 
                id="user-menu"
                className="absolute right-0 mt-3 w-60 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in"
                onBlur={() => setMenuOpen(false)}
              >
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{user.username || "User"}</p>
                    <p className="text-sm text-gray-500">{user.email || user.role}</p>
                </div>

                {/* Dropdown Items */}
                {(user.role === "admin" || user.role === "owner") && (
                  <Link
                    to={dashboardLink}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaChartLine size={18} /> My Dashboard
                  </Link>
                )}

                {(user.role === "user" || user.role === "owner") && (
                  <Link
                    to="/stores"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaStore size={18} /> Add New Store
                  </Link>
                )}

                <Link
                  to="/update-password"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <FaKey size={18} /> Update Password
                </Link>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-red-600 font-medium border-t border-gray-100 hover:bg-red-50 transition-colors flex items-center gap-3"
                >
                  <FaSignOutAlt size={18} /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}