import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ added Link
import axios from "axios";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/home");
    }
  }, [navigate]);

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
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      localStorage.setItem("user", JSON.stringify(res.data.data));

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
    <div className="register-container">
      <div className="form-box">
        <h2 className="title">Create Account</h2>
        <p className="subtitle">Join us and get started</p>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Avatar */}
          <label className="file-label">Avatar (required)</label>
          <label className={`file-upload ${avatar ? "uploaded" : ""}`}>
            {loading ? (
              <span className="loader"></span>
            ) : avatar ? (
              <span className="check">✔ Uploaded</span>
            ) : (
              <span className="icon">⬆ Upload</span>
            )}
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              required
            />
          </label>

          {/* Cover */}
          <label className="file-label">Cover Image (optional)</label>
          <label className={`file-upload ${coverImage ? "uploaded" : ""}`}>
            {loading ? (
              <span className="loader"></span>
            ) : coverImage ? (
              <span className="check">✔ Uploaded</span>
            ) : (
              <span className="icon">⬆ Upload</span>
            )}
            <input
              type="file"
              name="coverimage"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>

          <button type="submit" disabled={loading} className="btn">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* ✅ Login link */}
        <p className="redirect-text">
          Already have an account?{" "}
          <Link to="/login" className="redirect-link">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
