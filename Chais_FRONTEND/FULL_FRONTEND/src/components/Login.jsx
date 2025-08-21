import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        formData,
        { withCredentials: true } // ✅ allows cookies (access + refresh tokens)
      );

      // Save user details in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.data.user));

      alert("✅ Login successful!");
      navigate("/home"); // redirect to Home
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("❌ Login failed: " + (err.response?.data?.message || "Server error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="text"
          name="username"
          placeholder="Username (or leave blank if using email)"
          value={formData.username}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email (or leave blank if using username)"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
