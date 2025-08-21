import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ for redirect
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "avatar") setAvatar(e.target.files[0]);
    if (e.target.name === "coverimage") setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (avatar) data.append("avatar", avatar);
    if (coverImage) data.append("coverimage", coverImage);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // ✅ Save user info in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.data));

      // 🚀 Redirect to home
      navigate("/home");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(
        "❌ Registration failed: " +
          (err.response?.data?.message || "Server error")
      );
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
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={formData.fullname}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
          required
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

        <label className="block mb-2 text-sm">Avatar (required)</label>
        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-3"
          required
        />

        <label className="block mb-2 text-sm">Cover Image (optional)</label>
        <input
          type="file"
          name="coverimage"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
