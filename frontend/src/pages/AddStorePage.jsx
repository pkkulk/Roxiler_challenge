import { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AddStorePage() {
  const { user, login } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", address: "", email: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/stores/add", {
        name: form.name,
        address: form.address,
        email: form.email,
        user_id: user.id,
      });

      const updatedUser = { ...user, role: "owner" };
      login(updatedUser);

      alert("✅ Store added successfully! You are now a Store Owner.");
      navigate("/owner");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add store");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto" }}>
      <h2 className="text-2xl font-bold mb-4">Add Store 🏪</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          placeholder="Store Name"
          value={form.name}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="address"
          placeholder="Store Address"
          value={form.address}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Store Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Store
        </button>
      </form>
    </div>
  );
}