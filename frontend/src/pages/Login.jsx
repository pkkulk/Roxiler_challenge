import { useState, useContext } from "react";
import api from "../api";
import { useNavigate, useLocation, useSearchParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      login(res.data);
      alert("Login successful");

      const redirectQuery = searchParams.get("redirect");
      const redirect =
        redirectQuery ||
        location.state?.from?.pathname ||
        (res.data.role === "admin" ? "/admin" : res.data.role === "owner" ? "/owner" : "/user");
      
      navigate(redirect, { replace: true });
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  const redirect = searchParams.get("redirect") || "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="bg-white shadow-2xl rounded-xl p-8 max-w-sm w-full space-y-6 transform transition-transform hover:scale-105 duration-300">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Login 🔑</h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={form.password}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-md"
          >
            Login
          </button>
        </form>

        <div className="text-center">
          <Link
            to={`/signup?redirect=${redirect}`}
            className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
          >
            Don't have an account? <span className="underline">Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}